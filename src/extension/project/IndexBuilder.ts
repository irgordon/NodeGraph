import { AtomicJsonWriter } from './AtomicJsonWriter'
import { AuditLog } from './AuditLog'
import { diagnostic, hasErrors } from './diagnostics'
import { isFileError } from './documentIO'
import { INDEXER_VERSION, PROJECT_SCHEMA_VERSION } from './types'
import { IntegrityService } from './IntegrityService'
import { PaperGraphRepository } from './PaperGraphRepository'
import { ProjectPathError, ProjectPathResolver } from './ProjectPathResolver'
import { SchemaValidator } from './SchemaValidator'
import { SynthesisRepository } from './SynthesisRepository'
import {
  Clock,
  EvidenceIndexDocument,
  EvidenceRecord,
  IndexBuildResult,
  PaperIndexDocument,
  PaperIndexEntry,
  PaperRegistration,
  ProjectDiagnostic,
  ProjectManifest,
  systemClock,
} from './types'

export class IndexBuilder {
  constructor(
    private readonly paths: ProjectPathResolver,
    private readonly schemas: SchemaValidator,
    private readonly writer: AtomicJsonWriter,
    private readonly audit: AuditLog,
    private readonly papers: PaperGraphRepository,
    private readonly synthesis: SynthesisRepository,
    private readonly integrity: IntegrityService,
    private readonly clock: Clock = systemClock
  ) {}

  public async rebuild(
    projectRoot: string,
    manifest: ProjectManifest,
    full = false
  ): Promise<IndexBuildResult> {
    const now = this.clock.now()
    const inputs = await this.loadInputs(projectRoot, manifest)
    const diagnostics = [...inputs.diagnostics]
    const paperBuild = await this.buildPaperEntries(
      projectRoot,
      manifest,
      inputs.paperIndex,
      inputs.evidence,
      inputs.taxonomyVersion,
      now,
      full,
      diagnostics
    )
    const indexes = buildIndexDocuments(paperBuild, inputs.evidence, now)
    diagnostics.push(...this.validateIndexes(manifest, indexes.paper, indexes.evidence))
    await this.persistValidBuild(projectRoot, manifest, indexes, paperBuild, full, diagnostics)
    return buildIndexResult(indexes, paperBuild, diagnostics)
  }

  private async loadInputs(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{
    paperIndex?: PaperIndexDocument
    evidence: EvidenceRecord[]
    taxonomyVersion: number
    diagnostics: ProjectDiagnostic[]
  }> {
    const paperIndex = await this.synthesis.readDocument<PaperIndexDocument>(
      projectRoot,
      manifest.documents.paperIndex,
      'paper-index.schema.json'
    )
    const evidence = await this.synthesis.readEvidence(projectRoot, manifest)
    const taxonomy = await this.synthesis.readTaxonomy(projectRoot, manifest)
    return {
      ...(paperIndex.value ? { paperIndex: paperIndex.value } : {}),
      evidence: evidence.value?.evidence ?? [],
      taxonomyVersion: taxonomy.value?.taxonomyVersion ?? 1,
      diagnostics: [
        ...paperIndex.diagnostics
          .filter(item => item.code !== 'missing-file')
          .map(asRecoverableIndexDiagnostic),
        ...evidence.diagnostics,
        ...taxonomy.diagnostics,
      ],
    }
  }

  private async buildPaperEntries(
    projectRoot: string,
    manifest: ProjectManifest,
    currentIndex: PaperIndexDocument | undefined,
    evidence: EvidenceRecord[],
    taxonomyVersion: number,
    now: string,
    full: boolean,
    diagnostics: ProjectDiagnostic[]
  ): Promise<PaperBuild> {
    const currentEntries = new Map((currentIndex?.entries ?? []).map(item => [item.paperId, item]))
    const build = createPaperBuild(currentEntries, manifest)
    const context = {
      evidence,
      taxonomyVersion,
      now,
      full,
      build,
      diagnostics,
      auditPath: manifest.documents.auditLog,
    }
    for (const registration of manifest.papers) {
      await this.addPaperEntry(
        projectRoot,
        registration,
        currentEntries.get(registration.paperId),
        context
      )
    }
    return build
  }

  private async addPaperEntry(
    projectRoot: string,
    registration: PaperRegistration,
    current: PaperIndexEntry | undefined,
    context: PaperBuildContext
  ): Promise<void> {
    const graphHash = await this.calculateGraphHash(projectRoot, registration)
    context.diagnostics.push(...graphHash.diagnostics)
    if (!graphHash.value) return
    const sourceHash = await this.inspectSourceIdentity(projectRoot, registration, context)
    if (
      !context.full &&
      current &&
      canReuse(current, registration, graphHash.value, context.taxonomyVersion)
    ) {
      reusePaperEntry(context.build, current)
      return
    }
    await this.rebuildPaperEntry(
      projectRoot,
      registration,
      graphHash.value,
      sourceHash,
      context
    )
  }

  private async inspectSourceIdentity(
    projectRoot: string,
    registration: PaperRegistration,
    context: PaperBuildContext
  ): Promise<string | undefined> {
    const source = await this.integrity.inspectSource(projectRoot, registration)
    context.diagnostics.push(...source.diagnostics)
    await this.recordSourceChange(projectRoot, registration, source.currentHash, context.auditPath)
    return source.currentHash
  }

  private async rebuildPaperEntry(
    projectRoot: string,
    registration: PaperRegistration,
    graphHash: string,
    currentSourceHash: string | undefined,
    context: PaperBuildContext
  ): Promise<void> {
    const paperEvidence = context.evidence.filter(item => item.paperId === registration.paperId)
    const inspected = await this.integrity.inspectPaper(
      projectRoot,
      registration,
      paperEvidence,
      {
        graphHash,
        ...(currentSourceHash ? { currentSourceHash } : {}),
      }
    )
    context.diagnostics.push(...inspected.diagnostics)
    if (!inspected.graph || hasErrors(inspected.diagnostics)) return
    context.build.entries.push(this.papers.buildIndexMetadata(
      registration,
      inspected.graph,
      graphHash,
      context.taxonomyVersion,
      context.now,
      INDEXER_VERSION
    ))
    context.build.processed.push(registration.paperId)
  }

  private async persistValidBuild(
    projectRoot: string,
    manifest: ProjectManifest,
    indexes: IndexDocuments,
    paperBuild: PaperBuild,
    full: boolean,
    diagnostics: ProjectDiagnostic[]
  ): Promise<void> {
    if (hasErrors(diagnostics)) return
    await this.audit.assertAppendable(projectRoot, manifest.documents.auditLog)
    await this.writeIndexes(projectRoot, manifest, indexes.paper, indexes.evidence)
    await this.appendAudit(projectRoot, manifest, paperBuild, full)
  }

  private async calculateGraphHash(
    projectRoot: string,
    registration: PaperRegistration
  ): Promise<{ value?: string; diagnostics: ProjectDiagnostic[] }> {
    try {
      const value = await this.papers.calculateGraphHash(projectRoot, registration.path)
      return { value, diagnostics: [] }
    } catch (error) {
      return { diagnostics: [paperReadDiagnostic(registration, error)] }
    }
  }

  private async recordSourceChange(
    projectRoot: string,
    registration: PaperRegistration,
    currentHash: string | undefined,
    auditPath: string
  ): Promise<void> {
    if (!currentHash || currentHash === registration.source.sourceDocumentHash) return
    await this.audit.append(projectRoot, auditPath, {
      actor: { type: 'service', id: 'IntegrityService', version: INDEXER_VERSION },
      action: 'source.hash-changed',
      objectId: registration.source.sourceId,
      beforeHash: registration.source.sourceDocumentHash,
      afterHash: currentHash,
      metadata: { paperId: registration.paperId, sourcePath: registration.source.relativePath },
    })
  }

  private validateIndexes(
    manifest: ProjectManifest,
    paperIndex: PaperIndexDocument,
    evidenceIndex: EvidenceIndexDocument
  ): ProjectDiagnostic[] {
    return [
      ...this.schemas.validate('paper-index.schema.json', paperIndex, manifest.documents.paperIndex),
      ...this.schemas.validate('evidence-index.schema.json', evidenceIndex, manifest.documents.evidenceIndex),
    ]
  }

  private async writeIndexes(
    projectRoot: string,
    manifest: ProjectManifest,
    paperIndex: PaperIndexDocument,
    evidenceIndex: EvidenceIndexDocument
  ): Promise<void> {
    const paperTarget = await this.paths.resolve(projectRoot, manifest.documents.paperIndex)
    const evidenceTarget = await this.paths.resolve(projectRoot, manifest.documents.evidenceIndex)
    await this.writer.writeBatch([
      { target: paperTarget, value: paperIndex },
      { target: evidenceTarget, value: evidenceIndex },
    ])
  }

  private async appendAudit(
    projectRoot: string,
    manifest: ProjectManifest,
    build: PaperBuild,
    full: boolean
  ): Promise<void> {
    await this.audit.append(projectRoot, manifest.documents.auditLog, {
      actor: { type: 'service', id: 'IndexBuilder', version: INDEXER_VERSION },
      action: 'index.rebuilt',
      objectId: manifest.projectId,
      metadata: {
        full,
        processedPaperIds: build.processed,
        reusedPaperIds: build.reused,
        removedPaperIds: build.removed,
      },
    })
  }
}

interface PaperBuild {
  entries: PaperIndexEntry[]
  processed: string[]
  reused: string[]
  removed: string[]
}

interface PaperBuildContext {
  evidence: EvidenceRecord[]
  taxonomyVersion: number
  now: string
  full: boolean
  build: PaperBuild
  diagnostics: ProjectDiagnostic[]
  auditPath: string
}

interface IndexDocuments {
  paper: PaperIndexDocument
  evidence: EvidenceIndexDocument
}

function createPaperBuild(
  currentEntries: Map<string, PaperIndexEntry>,
  manifest: ProjectManifest
): PaperBuild {
  const registered = new Set(manifest.papers.map(item => item.paperId))
  return {
    entries: [],
    processed: [],
    reused: [],
    removed: [...currentEntries.keys()].filter(paperId => !registered.has(paperId)),
  }
}

function canReuse(
  current: PaperIndexEntry,
  registration: PaperRegistration,
  graphHash: string,
  taxonomyVersion: number
): boolean {
  return current.paperGraphHash === graphHash &&
    current.paperPath === registration.path &&
    current.sourceDocumentHash === registration.source.sourceDocumentHash &&
    current.taxonomyVersion === taxonomyVersion &&
    current.extractorVersion === INDEXER_VERSION
}

function reusePaperEntry(build: PaperBuild, current: PaperIndexEntry): void {
  build.entries.push(current)
  build.reused.push(current.paperId)
}

function paperReadDiagnostic(
  registration: PaperRegistration,
  error: unknown
): ProjectDiagnostic {
  const pathCode = error instanceof ProjectPathError ? error.code : undefined
  const missing = isFileError(error, 'ENOENT')
  return diagnostic({
    layer: pathCode ? 'structural' : 'integrity',
    code: pathCode ?? (missing ? 'missing-paper-file' : 'inaccessible-paper-file'),
    file: registration.path,
    objectId: registration.paperId,
    rule: pathCode ? 'The paper path escapes the project root.' : 'The paper graph cannot be read.',
    action: pathCode ? 'Use a contained project-relative path.' : 'Restore the paper graph before rebuilding indexes.',
  })
}

function asRecoverableIndexDiagnostic(item: ProjectDiagnostic): ProjectDiagnostic {
  return {
    ...item,
    layer: 'integrity',
    severity: 'warning',
    code: 'invalid-derived-index',
    action: 'Rebuild the derived index from authoritative project data.',
  }
}

function buildPaperIndex(entries: PaperIndexEntry[], now: string): PaperIndexDocument {
  return {
    schema: { name: 'nodegraph-paper-index', version: PROJECT_SCHEMA_VERSION },
    generatedAt: now,
    entries: [...entries].sort((left, right) => left.paperId.localeCompare(right.paperId)),
  }
}

function buildIndexDocuments(
  paperBuild: PaperBuild,
  evidence: EvidenceRecord[],
  now: string
): IndexDocuments {
  return {
    paper: buildPaperIndex(paperBuild.entries, now),
    evidence: buildEvidenceIndex(evidence, now),
  }
}

function buildIndexResult(
  indexes: IndexDocuments,
  paperBuild: PaperBuild,
  diagnostics: ProjectDiagnostic[]
): IndexBuildResult {
  return {
    paperIndex: indexes.paper,
    evidenceIndex: indexes.evidence,
    processedPaperIds: paperBuild.processed,
    reusedPaperIds: paperBuild.reused,
    removedPaperIds: paperBuild.removed,
    diagnostics,
  }
}

export function buildEvidenceIndex(
  evidence: EvidenceRecord[],
  now: string
): EvidenceIndexDocument {
  return {
    schema: { name: 'nodegraph-evidence-index', version: PROJECT_SCHEMA_VERSION },
    generatedAt: now,
    entries: evidence
      .map(record => buildEvidenceEntry(record, now))
      .sort((left, right) => left.evidenceId.localeCompare(right.evidenceId)),
  }
}

function buildEvidenceEntry(
  record: EvidenceRecord,
  now: string
): EvidenceIndexDocument['entries'][number] {
  return {
    evidenceId: record.evidenceId,
    paperId: record.paperId,
    ...(record.nodeId ? { nodeId: record.nodeId } : {}),
    evidenceObjectHash: record.evidenceObjectHash,
    quoteContentHash: record.quote.quoteContentHash,
    sourceDocumentHash: record.source.sourceDocumentHash,
    indexedAt: now,
  }
}
