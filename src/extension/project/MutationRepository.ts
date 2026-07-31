import { readFile } from 'fs/promises'
import { AtomicJsonWriter } from './AtomicJsonWriter'
import { AuditLog } from './AuditLog'
import { calculateDocumentRevision } from './canonical'
import { diagnostic, hasErrors } from './diagnostics'
import { isFileError } from './documentIO'
import { applyJsonPatch, JsonPatchError } from './JsonPatch'
import { ProjectPathResolver } from './ProjectPathResolver'
import { ReviewStateService } from './ReviewStateService'
import { inspectSupportedSchemaVersion } from './SchemaVersionPolicy'
import { SchemaValidator } from './SchemaValidator'
import {
  APPLICATION_VERSION,
  MutationEnvelope,
  MutationRejected,
  MutationResult,
  ProjectDiagnostic,
} from './types'

export interface MutationOptions {
  schemaName: string
  auditPath: string
  auditAction: string
  auditObjectId: string
  allowCreate?: boolean
  validateCandidate?(candidate: unknown): Promise<ProjectDiagnostic[]>
}

export class MutationAuditError extends Error {
  public readonly code = 'audit-append-failed'

  constructor(
    public readonly targetDocument: string,
    public readonly resultingRevision: string,
    public readonly cause: unknown
  ) {
    super(`The authoritative write committed, but its audit event could not be appended: ${targetDocument}`)
  }
}

export class MutationRepository {
  private readonly recoveryRequired = new Set<string>()

  constructor(
    private readonly paths: ProjectPathResolver,
    private readonly schemas: SchemaValidator,
    private readonly writer: AtomicJsonWriter,
    private readonly audit: AuditLog,
    private readonly reviews: ReviewStateService
  ) {}

  public async apply(
    projectRoot: string,
    envelope: MutationEnvelope,
    options: MutationOptions
  ): Promise<MutationResult> {
    const projectKey = await this.paths.canonicalRoot(projectRoot)
    if (this.recoveryRequired.has(projectKey)) return recoveryRejected(envelope)
    const envelopeDiagnostics = this.schemas.validate(
      'mutation-envelope.schema.json',
      envelope,
      'mutation-envelope'
    )
    if (hasErrors(envelopeDiagnostics)) return invalidMutation(envelope, envelopeDiagnostics)
    return this.applyValidated(projectRoot, projectKey, envelope, options)
  }

  public async requiresRecovery(projectRoot: string): Promise<boolean> {
    const projectKey = await this.paths.canonicalRoot(projectRoot)
    return this.recoveryRequired.has(projectKey)
  }

  private async applyValidated(
    projectRoot: string,
    projectKey: string,
    envelope: MutationEnvelope,
    options: MutationOptions
  ): Promise<MutationResult> {
    const target = await this.paths.resolve(projectRoot, envelope.targetDocument)
    const current = await readCurrentDocument(target, envelope.targetDocument, this.schemas, options.schemaName)
    if (current.diagnostics.length) return invalidMutation(envelope, current.diagnostics)
    const currentRevision = current.value === undefined
      ? 'absent'
      : calculateDocumentRevision(current.value)
    if (
      currentRevision === 'absent' &&
      envelope.baseRevision === 'absent' &&
      !options.allowCreate
    ) {
      return creationRejected(envelope)
    }
    if (envelope.baseRevision !== currentRevision) {
      return this.rejectStale(projectRoot, envelope, options.auditPath, currentRevision)
    }
    return this.commitCandidate(
      projectRoot,
      target,
      current.value,
      currentRevision,
      projectKey,
      envelope,
      options
    )
  }

  private async commitCandidate(
    projectRoot: string,
    target: string,
    current: unknown,
    currentRevision: string,
    projectKey: string,
    envelope: MutationEnvelope,
    options: MutationOptions
  ): Promise<MutationResult> {
    const candidate = applyOperations(current, envelope)
    if (candidate instanceof JsonPatchError) return patchRejected(envelope, candidate)
    const diagnostics = await this.validateCandidate(current, candidate, envelope, options)
    if (hasErrors(diagnostics)) return invalidMutation(envelope, diagnostics)
    await this.audit.assertAppendable(
      projectRoot,
      options.auditPath,
      options.allowCreate ?? false
    )
    const changed = await this.writeCandidate(
      projectRoot,
      target,
      candidate,
      currentRevision,
      envelope,
      options
    )
    if (changed) return changed
    const resultingRevision = calculateDocumentRevision(candidate)
    await this.appendCommitAudit(
      projectRoot,
      projectKey,
      envelope,
      options,
      resultingRevision
    )
    return { accepted: true, targetDocument: envelope.targetDocument, resultingRevision }
  }

  private async writeCandidate(
    projectRoot: string,
    target: string,
    candidate: unknown,
    expectedRevision: string,
    envelope: MutationEnvelope,
    options: MutationOptions
  ): Promise<MutationRejected | undefined> {
    try {
      await this.writer.write(target, candidate, async () => {
        const currentRevision = await readCurrentRevision(
          target,
          envelope.targetDocument,
          this.schemas,
          options.schemaName
        )
        if (currentRevision !== expectedRevision) {
          throw new RevisionChangedBeforeReplace(currentRevision)
        }
      })
      return undefined
    } catch (error) {
      if (error instanceof CurrentDocumentInvalid) {
        return invalidMutation(envelope, error.diagnostics)
      }
      if (!(error instanceof RevisionChangedBeforeReplace)) throw error
      return this.rejectStale(
        projectRoot,
        envelope,
        options.auditPath,
        error.currentRevision
      )
    }
  }

  private async validateCandidate(
    current: unknown,
    candidate: unknown,
    envelope: MutationEnvelope,
    options: MutationOptions
  ): Promise<ProjectDiagnostic[]> {
    const schemaDiagnostics = this.schemas.validate(
      options.schemaName,
      candidate,
      envelope.targetDocument
    )
    if (hasErrors(schemaDiagnostics)) return schemaDiagnostics
    const approvalDiagnostics = this.reviews.validateApprovalAuthority(
      current,
      candidate,
      envelope.actor,
      envelope.targetDocument
    )
    if (hasErrors(approvalDiagnostics)) return approvalDiagnostics
    const extraDiagnostics = await options.validateCandidate?.(candidate) ?? []
    return [...schemaDiagnostics, ...approvalDiagnostics, ...extraDiagnostics]
  }

  private async rejectStale(
    projectRoot: string,
    envelope: MutationEnvelope,
    auditPath: string,
    currentRevision: string
  ): Promise<MutationRejected> {
    await this.audit.append(projectRoot, auditPath, {
      actor: { type: 'service', id: 'SynthesisRepository', version: APPLICATION_VERSION },
      action: 'mutation.rejected-stale',
      objectId: envelope.mutationId,
      baseRevision: envelope.baseRevision,
      metadata: { targetDocument: envelope.targetDocument, currentRevision },
    })
    return staleRejected(envelope, currentRevision)
  }

  private async appendCommitAudit(
    projectRoot: string,
    projectKey: string,
    envelope: MutationEnvelope,
    options: MutationOptions,
    resultingRevision: string
  ): Promise<void> {
    try {
      await this.audit.append(projectRoot, options.auditPath, {
        actor: envelope.actor,
        action: options.auditAction,
        objectId: options.auditObjectId,
        baseRevision: envelope.baseRevision,
        resultingRevision,
        metadata: { mutationId: envelope.mutationId, targetDocument: envelope.targetDocument },
      }, options.allowCreate ?? false)
    } catch (error) {
      this.recoveryRequired.add(projectKey)
      throw new MutationAuditError(envelope.targetDocument, resultingRevision, error)
    }
  }
}

class RevisionChangedBeforeReplace extends Error {
  constructor(public readonly currentRevision: string) {
    super('revision-changed-before-replace')
  }
}

async function readCurrentDocument(
  target: string,
  displayPath: string,
  schemas: SchemaValidator,
  schemaName: string
): Promise<{ value?: unknown; diagnostics: ProjectDiagnostic[] }> {
  let text: string
  try {
    text = await readFile(target, 'utf8')
  } catch (error) {
    return isFileError(error, 'ENOENT')
      ? { diagnostics: [] }
      : { diagnostics: [fileReadDiagnostic(displayPath)] }
  }
  const parsed = schemas.parseJson(text, displayPath)
  if (!parsed.value) return { diagnostics: parsed.diagnostics }
  return {
    value: parsed.value,
    diagnostics: [
      ...schemas.validate(schemaName, parsed.value, displayPath),
      ...inspectSupportedSchemaVersion(parsed.value, displayPath),
    ],
  }
}

async function readCurrentRevision(
  target: string,
  displayPath: string,
  schemas: SchemaValidator,
  schemaName: string
): Promise<string> {
  const current = await readCurrentDocument(target, displayPath, schemas, schemaName)
  if (current.diagnostics.length) throw new CurrentDocumentInvalid(current.diagnostics)
  return current.value === undefined ? 'absent' : calculateDocumentRevision(current.value)
}

class CurrentDocumentInvalid extends Error {
  constructor(public readonly diagnostics: ProjectDiagnostic[]) {
    super('current-document-invalid-before-replace')
  }
}

function applyOperations(current: unknown, envelope: MutationEnvelope): unknown | JsonPatchError {
  try {
    return applyJsonPatch(current, envelope.operations)
  } catch (error) {
    if (error instanceof JsonPatchError) return error
    throw error
  }
}

function invalidMutation(
  envelope: MutationEnvelope,
  diagnostics: ProjectDiagnostic[]
): MutationRejected {
  return {
    accepted: false,
    code: 'invalid-mutation',
    targetDocument: envelope.targetDocument,
    currentRevision: envelope.baseRevision,
    receivedBaseRevision: envelope.baseRevision,
    retryable: false,
    rejectedOperations: envelope.operations,
    diagnostics,
  }
}

function staleRejected(envelope: MutationEnvelope, currentRevision: string): MutationRejected {
  return {
    accepted: false,
    code: 'stale-revision',
    targetDocument: envelope.targetDocument,
    currentRevision,
    receivedBaseRevision: envelope.baseRevision,
    retryable: true,
    rejectedOperations: envelope.operations,
  }
}

function patchRejected(envelope: MutationEnvelope, error: JsonPatchError): MutationRejected {
  return invalidMutation(envelope, [diagnostic({
    layer: 'structural',
    code: error.code,
    file: envelope.targetDocument,
    jsonPath: error.pointer,
    rule: 'The mutation operation cannot be applied to the current document.',
    action: 'Refresh the document and correct the rejected operation.',
  })])
}

function creationRejected(envelope: MutationEnvelope): MutationRejected {
  return invalidMutation(envelope, [diagnostic({
    layer: 'structural',
    code: 'authoritative-creation-not-allowed',
    file: envelope.targetDocument,
    rule: 'Only project initialization may create an authoritative document from an absent revision.',
    action: 'Create the project through ProjectRegistry before applying document mutations.',
  })])
}

function recoveryRejected(envelope: MutationEnvelope): MutationRejected {
  return {
    accepted: false,
    code: 'audit-recovery-required',
    targetDocument: envelope.targetDocument,
    currentRevision: envelope.baseRevision,
    receivedBaseRevision: envelope.baseRevision,
    retryable: false,
    rejectedOperations: envelope.operations,
  }
}

function fileReadDiagnostic(file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'syntactic',
    code: 'inaccessible-file',
    file,
    rule: 'The current authoritative document cannot be read.',
    action: 'Restore read access before retrying the mutation.',
  })
}
