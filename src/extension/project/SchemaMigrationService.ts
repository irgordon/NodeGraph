import { access, readFile } from 'fs/promises'
import * as path from 'path'
import { randomUUID } from 'crypto'
import { AtomicJsonWriter } from './AtomicJsonWriter'
import { calculateDocumentRevision } from './canonical'
import { CrossDocumentValidator, SynthesisBundle } from './CrossDocumentValidator'
import { diagnostic, hasErrors } from './diagnostics'
import { readJsonDocument, isFileError } from './documentIO'
import {
  createEmptyExtraction,
  createInitialMethodologyRegistry,
} from './extractionDefaults'
import { MutationAuditError, MutationRepository } from './MutationRepository'
import { ProjectPathResolver } from './ProjectPathResolver'
import { SchemaValidator } from './SchemaValidator'
import { SynthesisRepository } from './SynthesisRepository'
import {
  Actor,
  Clock,
  ConflictRecord,
  ConflictsDocument,
  EvidenceAppraisalsDocument,
  ExtractionDocument,
  LEGACY_PROJECT_SCHEMA_VERSION,
  MutationResult,
  PHASE2_PROJECT_SCHEMA_VERSION,
  PHASE3_DOCUMENT_SCHEMA_VERSION,
  PROJECT_SCHEMA_VERSION,
  ProjectDiagnostic,
  ProjectManifest,
  ReviewState,
  SynthesisClaim,
  SynthesisClaimsDocument,
  systemClock,
} from './types'

const MANIFEST_FILE = 'project.nodegraph.json'
const METHODOLOGY_PATH = 'taxonomy/methodologies.json'
const PHASE3_CLAIMS_PATH = 'synthesis/claims-v1.2.json'
const PHASE3_CONFLICTS_PATH = 'synthesis/conflicts-v1.2.json'
const PHASE3_APPRAISALS_PATH = 'synthesis/evidence-appraisals-v1.2.json'
const PHASE3_LEDGER_INDEX_PATH = 'indexes/claims.index.json'

export interface MigrationResult {
  mutation: MutationResult
  manifest?: ProjectManifest
  diagnostics: ProjectDiagnostic[]
}

interface ProposedDocument {
  path: string
  schema: string
  value: unknown
}

export class SchemaMigrationService {
  constructor(
    private readonly paths: ProjectPathResolver,
    private readonly schemas: SchemaValidator,
    private readonly writer: AtomicJsonWriter,
    private readonly mutations: MutationRepository,
    private readonly synthesis: SynthesisRepository,
    private readonly crossDocuments: CrossDocumentValidator,
    private readonly clock: Clock = systemClock
  ) {}

  public async migratePhase2(
    manifestPath: string,
    actor: Actor
  ): Promise<MigrationResult> {
    if (actor.type !== 'human') return migrationAuthorityRejected(actor, 'Phase 2')
    const read = await this.readManifest(manifestPath, 'project.schema.json')
    if (!read.value) return migrationInvalid(read.diagnostics)
    if (read.value.schema.version !== LEGACY_PROJECT_SCHEMA_VERSION) {
      return migrationNotRequired(read.value.schema.version, LEGACY_PROJECT_SCHEMA_VERSION)
    }
    return this.runPhase2Migration(path.dirname(manifestPath), read.value, actor)
  }

  public async migratePhase3(
    manifestPath: string,
    actor: Actor
  ): Promise<MigrationResult> {
    if (actor.type !== 'human') return migrationAuthorityRejected(actor, 'Phase 3')
    const version = await readManifestVersion(manifestPath)
    if (version !== PHASE2_PROJECT_SCHEMA_VERSION) {
      return phase3MigrationRejected(version)
    }
    const read = await this.readManifest(manifestPath, 'project-v1.1.schema.json')
    if (!read.value) return migrationInvalid(read.diagnostics)
    if (read.value.schema.version !== PHASE2_PROJECT_SCHEMA_VERSION) {
      return phase3MigrationRejected(read.value.schema.version)
    }
    return this.runPhase3Migration(path.dirname(manifestPath), read.value, actor)
  }

  private readManifest(manifestPath: string, schema: string) {
    return readJsonDocument<ProjectManifest>(
      manifestPath,
      MANIFEST_FILE,
      schema,
      this.schemas
    )
  }

  private async runPhase2Migration(
    projectRoot: string,
    current: ProjectManifest,
    actor: Actor
  ): Promise<MigrationResult> {
    const now = this.clock.now()
    const candidate = buildPhase2Manifest(current, now)
    const proposed = buildPhase2Documents(candidate, now)
    const diagnostics = this.validateSchemas(
      'project-v1.1.schema.json',
      candidate,
      proposed
    )
    if (hasErrors(diagnostics)) return migrationInvalid(diagnostics)
    return this.commitMigration(
      projectRoot,
      current,
      candidate,
      proposed,
      actor,
      'project.schema.json',
      'project-v1.1.schema.json'
    )
  }

  private async runPhase3Migration(
    projectRoot: string,
    current: ProjectManifest,
    actor: Actor
  ): Promise<MigrationResult> {
    const source = await this.readPhase3Source(projectRoot, current)
    if (!source.bundle || hasErrors(source.diagnostics)) {
      return migrationInvalid(source.diagnostics)
    }
    const now = this.clock.now()
    const candidate = buildPhase3Manifest(current, now)
    const proposed = buildPhase3Documents(source.bundle, now)
    const bundle = phase3Bundle(source.bundle, proposed)
    const diagnostics = [
      ...this.validateSchemas('project-v1.2.schema.json', candidate, proposed),
      ...this.crossDocuments.validate(candidate, bundle, source.extractions),
    ]
    if (hasErrors(diagnostics)) return migrationInvalid(diagnostics)
    return this.commitMigration(
      projectRoot,
      current,
      candidate,
      proposed,
      actor,
      'project-v1.1.schema.json',
      'project-v1.2.schema.json'
    )
  }

  private async readPhase3Source(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{
    bundle?: SynthesisBundle
    extractions: Map<string, ExtractionDocument>
    diagnostics: ProjectDiagnostic[]
  }> {
    const [bundle, methodologies, extractionReads] = await Promise.all([
      this.synthesis.readBundle(projectRoot, manifest),
      this.synthesis.readMethodologies(projectRoot, manifest),
      Promise.all(manifest.papers.map(async paper => ({
        paperId: paper.paperId,
        read: await this.synthesis.readExtraction(projectRoot, paper),
      }))),
    ])
    const extractions = new Map(extractionReads.flatMap(item => item.read.value
      ? [[item.paperId, item.read.value] as const]
      : []))
    return {
      bundle: bundle.bundle,
      extractions,
      diagnostics: [
        ...bundle.diagnostics,
        ...methodologies.diagnostics,
        ...extractionReads.flatMap(item => item.read.diagnostics),
        ...this.validatePhase2Extractions(
          manifest,
          bundle.bundle,
          methodologies.value,
          extractions
        ),
      ],
    }
  }

  private validatePhase2Extractions(
    manifest: ProjectManifest,
    bundle: SynthesisBundle | undefined,
    methodologies: Awaited<ReturnType<SynthesisRepository['readMethodologies']>>['value'],
    extractions: Map<string, ExtractionDocument>
  ): ProjectDiagnostic[] {
    if (!bundle || !methodologies) return []
    return [...extractions.values()].flatMap(extraction =>
      this.crossDocuments.validateExtraction(
        manifest,
        extraction,
        bundle.evidence,
        bundle.constructs,
        methodologies
      ))
  }

  private validateSchemas(
    manifestSchema: string,
    manifest: ProjectManifest,
    documents: ProposedDocument[]
  ): ProjectDiagnostic[] {
    return [
      ...this.schemas.validate(manifestSchema, manifest, MANIFEST_FILE),
      ...documents.flatMap(document =>
        this.schemas.validate(document.schema, document.value, document.path)),
    ]
  }

  private async commitMigration(
    projectRoot: string,
    current: ProjectManifest,
    candidate: ProjectManifest,
    proposed: ProposedDocument[],
    actor: Actor,
    currentSchema: string,
    candidateSchema: string
  ): Promise<MigrationResult> {
    await this.assertTargetsAbsent(projectRoot, proposed)
    const created: string[] = []
    try {
      await this.writeProposedDocuments(projectRoot, proposed, created)
      const mutation = await this.replaceManifest(
        projectRoot,
        current,
        candidate,
        actor,
        currentSchema,
        candidateSchema
      )
      if (!mutation.accepted) {
        await this.removeCreated(projectRoot, created)
        return { mutation, diagnostics: mutation.diagnostics ?? [] }
      }
      const diagnostics = await this.invalidateIndexes(projectRoot, candidate)
      return { mutation, manifest: candidate, diagnostics }
    } catch (error) {
      if (error instanceof MutationAuditError) {
        await this.invalidateIndexes(projectRoot, candidate)
        throw error
      }
      await this.removeCreated(projectRoot, created)
      throw error
    }
  }

  private async assertTargetsAbsent(
    projectRoot: string,
    documents: ProposedDocument[]
  ): Promise<void> {
    for (const document of documents) {
      const target = await this.paths.resolve(projectRoot, document.path)
      try {
        await access(target)
        throw new Error(`Migration target already exists: ${document.path}`)
      } catch (error) {
        if (!isFileError(error, 'ENOENT')) throw error
      }
    }
  }

  private async writeProposedDocuments(
    projectRoot: string,
    documents: ProposedDocument[],
    created: string[]
  ): Promise<void> {
    for (const document of documents) {
      const target = await this.paths.resolve(projectRoot, document.path)
      await this.writer.write(target, document.value)
      created.push(document.path)
    }
  }

  private replaceManifest(
    projectRoot: string,
    current: ProjectManifest,
    candidate: ProjectManifest,
    actor: Actor,
    currentSchema: string,
    candidateSchema: string
  ): Promise<MutationResult> {
    return this.mutations.apply(projectRoot, {
      mutationId: `mutation_${randomUUID().replace(/-/g, '')}`,
      targetDocument: MANIFEST_FILE,
      baseRevision: calculateDocumentRevision(current),
      operations: [{ op: 'replace', path: '', value: candidate }],
      requestedAt: this.clock.now(),
      actor,
    }, {
      schemaName: candidateSchema,
      currentSchemaName: currentSchema,
      auditPath: current.documents.auditLog,
      auditAction: 'schema.migrated',
      auditObjectId: current.projectId,
      auditMetadata: {
        fromSchemaVersion: current.schema.version,
        toSchemaVersion: candidate.schema.version,
      },
      validateCandidate: () => this.validateCreatedTargets(projectRoot, candidate),
    })
  }

  private async validateCreatedTargets(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<ProjectDiagnostic[]> {
    const paths = manifest.schema.version === PROJECT_SCHEMA_VERSION
      ? [manifest.documents.claims, manifest.documents.conflicts, manifest.documents.appraisals!]
      : [
        manifest.documents.methodologies!,
        ...manifest.papers.map(paper => paper.extractionPath!),
      ]
    const diagnostics: ProjectDiagnostic[] = []
    for (const relativePath of paths) {
      try {
        await access(await this.paths.resolve(projectRoot, relativePath, true))
      } catch {
        diagnostics.push(missingMigrationTarget(relativePath))
      }
    }
    return diagnostics
  }

  private async invalidateIndexes(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<ProjectDiagnostic[]> {
    const paths = [
      manifest.documents.paperIndex,
      manifest.documents.evidenceIndex,
      ...(manifest.documents.claimLedgerIndex
        ? [manifest.documents.claimLedgerIndex]
        : []),
    ]
    const diagnostics: ProjectDiagnostic[] = []
    for (const relativePath of paths) {
      try {
        await this.writer.remove(await this.paths.resolve(projectRoot, relativePath))
      } catch {
        diagnostics.push(indexInvalidationFailed(relativePath))
      }
    }
    return diagnostics
  }

  private async removeCreated(
    projectRoot: string,
    created: string[]
  ): Promise<void> {
    for (const relativePath of [...created].reverse()) {
      await this.writer.remove(await this.paths.resolve(projectRoot, relativePath))
    }
  }
}

async function readManifestVersion(manifestPath: string): Promise<string> {
  try {
    const value = JSON.parse(await readFile(manifestPath, 'utf8')) as {
      schema?: { version?: unknown }
    }
    return typeof value.schema?.version === 'string' ? value.schema.version : ''
  } catch {
    return ''
  }
}

function buildPhase2Manifest(current: ProjectManifest, now: string): ProjectManifest {
  return {
    ...current,
    schema: { ...current.schema, version: PHASE2_PROJECT_SCHEMA_VERSION },
    modified: now,
    papers: current.papers.map(paper => ({
      ...paper,
      extractionPath: `extractions/${paper.paperId}.json`,
    })),
    documents: { ...current.documents, methodologies: METHODOLOGY_PATH },
  }
}

function buildPhase2Documents(
  manifest: ProjectManifest,
  now: string
): ProposedDocument[] {
  return [
    {
      path: manifest.documents.methodologies!,
      schema: 'methodology-registry.schema.json',
      value: createInitialMethodologyRegistry(now),
    },
    ...manifest.papers.map(paper => ({
      path: paper.extractionPath!,
      schema: 'extraction.schema.json',
      value: createEmptyExtraction(paper.paperId, now),
    })),
  ]
}

function buildPhase3Manifest(current: ProjectManifest, now: string): ProjectManifest {
  return {
    ...current,
    schema: { ...current.schema, version: PROJECT_SCHEMA_VERSION },
    modified: now,
    documents: {
      ...current.documents,
      claims: PHASE3_CLAIMS_PATH,
      conflicts: PHASE3_CONFLICTS_PATH,
      appraisals: PHASE3_APPRAISALS_PATH,
      claimLedgerIndex: PHASE3_LEDGER_INDEX_PATH,
    },
  }
}

function buildPhase3Documents(
  source: SynthesisBundle,
  now: string
): ProposedDocument[] {
  return [
    {
      path: PHASE3_CLAIMS_PATH,
      schema: 'synthesis-claims-v1.2.schema.json',
      value: migrateClaims(source.claims, now),
    },
    {
      path: PHASE3_CONFLICTS_PATH,
      schema: 'conflicts-v1.2.schema.json',
      value: migrateConflicts(source.conflicts, now),
    },
    {
      path: PHASE3_APPRAISALS_PATH,
      schema: 'evidence-appraisals.schema.json',
      value: emptyAppraisals(now),
    },
  ]
}

function migrateClaims(
  source: SynthesisClaimsDocument,
  now: string
): SynthesisClaimsDocument {
  return {
    schema: { name: 'nodegraph-synthesis-claims', version: PHASE3_DOCUMENT_SCHEMA_VERSION },
    claims: source.claims.map(claim => migrateClaim(claim)),
    modified: now,
  }
}

function migrateClaim(claim: SynthesisClaim): SynthesisClaim {
  const { confidence, ...rest } = claim
  return {
    ...rest,
    ...(confidence?.policyId ? { confidence } : {}),
  }
}

function migrateConflicts(
  source: ConflictsDocument,
  now: string
): ConflictsDocument {
  return {
    schema: { name: 'nodegraph-conflicts', version: PHASE3_DOCUMENT_SCHEMA_VERSION },
    conflicts: source.conflicts.map(conflict => migrateConflict(conflict)),
    modified: now,
  }
}

function migrateConflict(conflict: ConflictRecord): ConflictRecord {
  return {
    ...conflict,
    possibleExplanations: conflict.possibleExplanations.map((explanation, index) => ({
      explanationId: explanation.explanationId ??
        `explanation_${conflict.conflictId.slice('conflict_'.length)}_${index + 1}`,
      type: explanation.type,
      text: legacyExplanationText(explanation),
      contextComparisonIds: explanation.contextComparisonIds ?? [],
      reviewState: explanation.reviewState ?? pendingReviewState(),
    })),
    contextComparisons: conflict.contextComparisons ?? [],
  }
}

function legacyExplanationText(explanation: ConflictRecord['possibleExplanations'][number]): string {
  if (explanation.text) return explanation.text
  const legacy = explanation as unknown as { value?: string }
  return legacy.value ?? 'Imported explanation requires researcher review.'
}

function emptyAppraisals(now: string): EvidenceAppraisalsDocument {
  return {
    schema: { name: 'nodegraph-evidence-appraisals', version: PHASE3_DOCUMENT_SCHEMA_VERSION },
    appraisals: [],
    modified: now,
  }
}

function phase3Bundle(
  source: SynthesisBundle,
  proposed: ProposedDocument[]
): SynthesisBundle {
  return {
    ...source,
    claims: proposed[0].value as SynthesisClaimsDocument,
    conflicts: proposed[1].value as ConflictsDocument,
    appraisals: proposed[2].value as EvidenceAppraisalsDocument,
  }
}

function pendingReviewState(): ReviewState {
  return {
    verification: {
      source: 'not-applicable',
      interpretation: 'pending',
      classification: 'pending',
    },
    approval: { researcher: 'not-reviewed', advisor: 'not-reviewed' },
    origin: 'imported',
  }
}

function migrationAuthorityRejected(actor: Actor, phase: string): MigrationResult {
  return migrationInvalid([diagnostic({
    layer: 'structural',
    code: 'migration-authority-required',
    file: MANIFEST_FILE,
    objectId: actor.id,
    rule: `Only a researcher may start the ${phase} schema migration.`,
    action: 'Run the migration through a researcher-confirmed command.',
  })])
}

function migrationNotRequired(version: string, expected: string): MigrationResult {
  return migrationInvalid([diagnostic({
    layer: 'structural',
    code: 'migration-not-required',
    file: MANIFEST_FILE,
    objectId: version,
    rule: `The project is not at schema ${expected}.`,
    action: 'Open the project normally or run the next sequential migration.',
  })])
}

function phase3MigrationRejected(version: string): MigrationResult {
  const sequential = version === LEGACY_PROJECT_SCHEMA_VERSION
  return migrationInvalid([diagnostic({
    layer: 'structural',
    code: sequential ? 'sequential-migration-required' : 'migration-not-required',
    file: MANIFEST_FILE,
    objectId: version,
    rule: `Phase 3 migration requires schema ${PHASE2_PROJECT_SCHEMA_VERSION}.`,
    action: sequential
      ? 'Run the Phase 2 migration first, then run the Phase 3 migration.'
      : 'Open the project normally or use a compatible application version.',
  })])
}

function migrationInvalid(diagnostics: ProjectDiagnostic[]): MigrationResult {
  return {
    mutation: {
      accepted: false,
      code: 'migration-rejected',
      targetDocument: MANIFEST_FILE,
      currentRevision: 'absent',
      receivedBaseRevision: 'absent',
      retryable: false,
      rejectedOperations: [],
      diagnostics,
    },
    diagnostics,
  }
}

function missingMigrationTarget(file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'missing-migration-target',
    file,
    rule: 'A proposed migration subordinate document is missing.',
    action: 'Restore the proposed document before replacing the manifest.',
  })
}

function indexInvalidationFailed(file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'integrity',
    severity: 'warning',
    code: 'migration-index-invalidation-failed',
    file,
    rule: 'The migration committed, but a derived index could not be removed.',
    action: 'Rebuild project indexes before using synthesis views.',
  })
}
