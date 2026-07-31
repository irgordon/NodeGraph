import { access } from 'fs/promises'
import * as path from 'path'
import { randomUUID } from 'crypto'
import { AtomicJsonWriter } from './AtomicJsonWriter'
import { calculateDocumentRevision } from './canonical'
import { diagnostic, hasErrors } from './diagnostics'
import { readJsonDocument, isFileError } from './documentIO'
import {
  createEmptyExtraction,
  createInitialMethodologyRegistry,
} from './extractionDefaults'
import {
  MutationAuditError,
  MutationRepository,
} from './MutationRepository'
import { ProjectPathResolver } from './ProjectPathResolver'
import { SchemaValidator } from './SchemaValidator'
import {
  Actor,
  Clock,
  LEGACY_PROJECT_SCHEMA_VERSION,
  MutationResult,
  PROJECT_SCHEMA_VERSION,
  ProjectDiagnostic,
  ProjectManifest,
  systemClock,
} from './types'

const MANIFEST_FILE = 'project.nodegraph.json'
const METHODOLOGY_PATH = 'taxonomy/methodologies.json'

export interface MigrationResult {
  mutation: MutationResult
  manifest?: ProjectManifest
  diagnostics: ProjectDiagnostic[]
}

export class SchemaMigrationService {
  constructor(
    private readonly paths: ProjectPathResolver,
    private readonly schemas: SchemaValidator,
    private readonly writer: AtomicJsonWriter,
    private readonly mutations: MutationRepository,
    private readonly clock: Clock = systemClock
  ) {}

  public async migratePhase2(
    manifestPath: string,
    actor: Actor
  ): Promise<MigrationResult> {
    if (actor.type !== 'human') return migrationAuthorityRejected(actor)
    const read = await readJsonDocument<ProjectManifest>(
      manifestPath,
      MANIFEST_FILE,
      'project.schema.json',
      this.schemas
    )
    if (!read.value) return migrationInvalid(read.diagnostics)
    if (read.value.schema.version !== LEGACY_PROJECT_SCHEMA_VERSION) {
      return migrationNotRequired(read.value.schema.version)
    }
    return this.migrateValidated(path.dirname(manifestPath), read.value, actor)
  }

  private async migrateValidated(
    projectRoot: string,
    current: ProjectManifest,
    actor: Actor
  ): Promise<MigrationResult> {
    const now = this.clock.now()
    const candidate = buildCandidateManifest(current, now)
    const proposed = buildProposedDocuments(candidate, now)
    const diagnostics = this.validateProposal(candidate, proposed)
    if (hasErrors(diagnostics)) return migrationInvalid(diagnostics)
    await this.assertTargetsAbsent(projectRoot, proposed)
    const created: string[] = []
    try {
      await this.writeProposedDocuments(projectRoot, proposed, created)
      const mutation = await this.replaceManifest(projectRoot, current, candidate, actor, now)
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

  private validateProposal(
    manifest: ProjectManifest,
    documents: ProposedDocument[]
  ): ProjectDiagnostic[] {
    return [
      ...this.schemas.validate(
        'project-v1.1.schema.json',
        manifest,
        MANIFEST_FILE
      ),
      ...documents.flatMap(document =>
        this.schemas.validate(document.schema, document.value, document.path)
      ),
    ]
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

  private async replaceManifest(
    projectRoot: string,
    current: ProjectManifest,
    candidate: ProjectManifest,
    actor: Actor,
    now: string
  ): Promise<MutationResult> {
    return this.mutations.apply(projectRoot, {
      mutationId: `mutation_${randomUUID().replace(/-/g, '')}`,
      targetDocument: MANIFEST_FILE,
      baseRevision: calculateDocumentRevision(current),
      operations: [{ op: 'replace', path: '', value: candidate }],
      requestedAt: now,
      actor,
    }, {
      schemaName: 'project-v1.1.schema.json',
      currentSchemaName: 'project.schema.json',
      auditPath: current.documents.auditLog,
      auditAction: 'schema.migrated',
      auditObjectId: current.projectId,
      auditMetadata: {
        fromSchemaVersion: LEGACY_PROJECT_SCHEMA_VERSION,
        toSchemaVersion: PROJECT_SCHEMA_VERSION,
      },
      validateCandidate: () => this.validateCreatedTargets(projectRoot, candidate),
    })
  }

  private async validateCreatedTargets(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<ProjectDiagnostic[]> {
    const paths = [
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
    const diagnostics: ProjectDiagnostic[] = []
    for (const relativePath of [
      manifest.documents.paperIndex,
      manifest.documents.evidenceIndex,
    ]) {
      try {
        await this.writer.remove(
          await this.paths.resolve(projectRoot, relativePath)
        )
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

interface ProposedDocument {
  path: string
  schema: string
  value: unknown
}

function buildCandidateManifest(
  current: ProjectManifest,
  now: string
): ProjectManifest {
  return {
    ...current,
    schema: { ...current.schema, version: PROJECT_SCHEMA_VERSION },
    modified: now,
    papers: current.papers.map(paper => ({
      ...paper,
      extractionPath: `extractions/${paper.paperId}.json`,
    })),
    documents: {
      ...current.documents,
      methodologies: METHODOLOGY_PATH,
    },
  }
}

function buildProposedDocuments(
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

function migrationAuthorityRejected(actor: Actor): MigrationResult {
  return migrationInvalid([diagnostic({
    layer: 'structural',
    code: 'migration-authority-required',
    file: MANIFEST_FILE,
    objectId: actor.id,
    rule: 'Only a researcher may start the Phase 2 schema migration.',
    action: 'Run the migration through a researcher-confirmed command.',
  })])
}

function migrationNotRequired(version: string): MigrationResult {
  return migrationInvalid([diagnostic({
    layer: 'structural',
    code: 'migration-not-required',
    file: MANIFEST_FILE,
    objectId: version,
    rule: 'The project is not at the supported Phase 1 schema version.',
    action: version === PROJECT_SCHEMA_VERSION
      ? 'Open the project normally; it is already migrated.'
      : 'Use an application version that supports this project schema.',
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
    rule: 'A proposed Phase 2 subordinate document is missing.',
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
    action: 'Rebuild project indexes before using the synthesis matrix.',
  })
}
