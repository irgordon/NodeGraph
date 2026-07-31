import { AtomicJsonWriter } from './AtomicJsonWriter'
import { AuditLog } from './AuditLog'
import { calculateDocumentRevision } from './canonical'
import { diagnostic, hasErrors } from './diagnostics'
import { isFileError } from './documentIO'
import {
  DOCUMENT_SCHEMA_VERSION,
  INDEXER_VERSION,
  PAPER_INDEX_SCHEMA_VERSION,
} from './types'
import { IntegrityService } from './IntegrityService'
import { PaperGraphRepository } from './PaperGraphRepository'
import { ProjectPathError, ProjectPathResolver } from './ProjectPathResolver'
import { SchemaValidator } from './SchemaValidator'
import { SynthesisRepository } from './SynthesisRepository'
import {
  Clock,
  ConstructTaxonomyDocument,
  EvidenceIndexDocument,
  EvidenceRecord,
  ExtractionDocument,
  IndexBuildResult,
  MethodologyRegistryDocument,
  MatrixConstructMapping,
  MatrixFinding,
  MatrixMethodology,
  PaperIndexDocument,
  PaperIndexEntry,
  PaperRegistration,
  ProjectDiagnostic,
  ProjectManifest,
  ReviewState,
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
      inputs.taxonomy,
      inputs.methodologies,
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
    taxonomy?: ConstructTaxonomyDocument
    methodologies?: MethodologyRegistryDocument
    diagnostics: ProjectDiagnostic[]
  }> {
    const paperIndex = await this.synthesis.readDocument<PaperIndexDocument>(
      projectRoot,
      manifest.documents.paperIndex,
      'paper-index-v1.1.schema.json'
    )
    const evidence = await this.synthesis.readEvidence(projectRoot, manifest)
    const taxonomy = await this.synthesis.readTaxonomy(projectRoot, manifest)
    const methodologies = await this.synthesis.readMethodologies(projectRoot, manifest)
    return {
      ...(paperIndex.value ? { paperIndex: paperIndex.value } : {}),
      evidence: evidence.value?.evidence ?? [],
      ...(taxonomy.value ? { taxonomy: taxonomy.value } : {}),
      ...(methodologies.value ? { methodologies: methodologies.value } : {}),
      diagnostics: [
        ...paperIndex.diagnostics
          .filter(item => item.code !== 'missing-file')
          .map(asRecoverableIndexDiagnostic),
        ...evidence.diagnostics,
        ...taxonomy.diagnostics,
        ...methodologies.diagnostics,
      ],
    }
  }

  private async buildPaperEntries(
    projectRoot: string,
    manifest: ProjectManifest,
    currentIndex: PaperIndexDocument | undefined,
    evidence: EvidenceRecord[],
    taxonomy: ConstructTaxonomyDocument | undefined,
    methodologies: MethodologyRegistryDocument | undefined,
    now: string,
    full: boolean,
    diagnostics: ProjectDiagnostic[]
  ): Promise<PaperBuild> {
    const currentEntries = new Map((currentIndex?.entries ?? []).map(item => [item.paperId, item]))
    const build = createPaperBuild(currentEntries, manifest)
    const context = {
      evidence,
      taxonomy,
      methodologies,
      now,
      full,
      build,
      diagnostics,
      auditPath: manifest.documents.auditLog,
      manifest,
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
    if (!context.taxonomy || !context.methodologies) return
    const extraction = await this.synthesis.readExtraction(projectRoot, registration)
    context.diagnostics.push(...extraction.diagnostics)
    if (!extraction.value) return
    const extractionDiagnostics = await this.synthesis.validateExtraction(
      projectRoot,
      context.manifest,
      registration,
      extraction.value
    )
    context.diagnostics.push(...extractionDiagnostics)
    if (hasErrors(extractionDiagnostics)) return
    const extractionRevision = calculateDocumentRevision(extraction.value)
    const graphHash = await this.calculateGraphHash(projectRoot, registration)
    context.diagnostics.push(...graphHash.diagnostics)
    if (!graphHash.value) return
    const source = await this.inspectSourceIdentity(projectRoot, registration, context)
    if (
      !context.full &&
      current &&
      canReuse(
        current,
        registration,
        graphHash.value,
        source.currentHash,
        extractionRevision,
        extraction.value,
        context.taxonomy.taxonomyVersion
      )
    ) {
      reusePaperEntry(context.build, current)
      return
    }
    await this.rebuildPaperEntry(
      projectRoot,
      registration,
      graphHash.value,
      source.currentHash,
      source.diagnostics,
      extraction.value,
      extractionRevision,
      context
    )
  }

  private async inspectSourceIdentity(
    projectRoot: string,
    registration: PaperRegistration,
    context: PaperBuildContext
  ): Promise<{
    currentHash?: string
    diagnostics: ProjectDiagnostic[]
  }> {
    const source = await this.integrity.inspectSource(projectRoot, registration)
    context.diagnostics.push(...source.diagnostics)
    await this.recordSourceChange(projectRoot, registration, source.currentHash, context.auditPath)
    return source
  }

  private async rebuildPaperEntry(
    projectRoot: string,
    registration: PaperRegistration,
    graphHash: string,
    currentSourceHash: string | undefined,
    sourceDiagnostics: ProjectDiagnostic[],
    extraction: ExtractionDocument,
    extractionRevision: string,
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
    const metadata = this.papers.buildIndexMetadata(
      registration,
      inspected.graph,
      graphHash,
      context.taxonomy!.taxonomyVersion,
      context.now,
      extraction.extractorVersion
    )
    context.build.entries.push(buildPhase2Entry(
      metadata,
      registration.extractionPath!,
      extraction,
      extractionRevision,
      context.taxonomy!,
      context.methodologies!,
      paperEvidence,
      [...sourceDiagnostics, ...inspected.diagnostics]
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
      ...this.schemas.validate('paper-index-v1.1.schema.json', paperIndex, manifest.documents.paperIndex),
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
  taxonomy?: ConstructTaxonomyDocument
  methodologies?: MethodologyRegistryDocument
  now: string
  full: boolean
  build: PaperBuild
  diagnostics: ProjectDiagnostic[]
  auditPath: string
  manifest: ProjectManifest
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
  currentSourceHash: string | undefined,
  extractionRevision: string,
  extraction: ExtractionDocument,
  taxonomyVersion: number
): boolean {
  return current.paperGraphHash === graphHash &&
    current.paperPath === registration.path &&
    currentSourceHash === registration.source.sourceDocumentHash &&
    current.sourceDocumentHash === registration.source.sourceDocumentHash &&
    current.extractionPath === registration.extractionPath &&
    current.extractionRevision === extractionRevision &&
    current.taxonomyVersion === taxonomyVersion &&
    current.extractorVersion === extraction.extractorVersion
}

function reusePaperEntry(build: PaperBuild, current: PaperIndexEntry): void {
  build.entries.push(current)
  build.reused.push(current.paperId)
}

function buildPhase2Entry(
  metadata: PaperIndexEntry,
  extractionPath: string,
  extraction: ExtractionDocument,
  extractionRevision: string,
  taxonomy: ConstructTaxonomyDocument,
  methodologies: MethodologyRegistryDocument,
  evidence: EvidenceRecord[],
  diagnostics: ProjectDiagnostic[]
): PaperIndexEntry {
  const findings = buildMatrixFindings(extraction)
  return {
    ...metadata,
    extractionId: extraction.extractionId,
    extractionPath,
    extractionRevision,
    constructMappings: buildMatrixMappings(extraction, taxonomy, findings),
    findings,
    methodology: buildMatrixMethodology(extraction, methodologies),
    verificationSummary: buildVerificationSummary(extraction, evidence),
    staleness: {
      paperGraph: false,
      extraction: false,
      evidence: diagnostics.some(item =>
        item.code.startsWith('stale-') ||
        item.code === 'source-document-hash-mismatch'
      ),
    },
  }
}

function buildMatrixFindings(extraction: ExtractionDocument): MatrixFinding[] {
  return (extraction.fields.findings.items ?? []).map(finding => ({
    findingId: finding.findingId,
    ...(finding.nodeId ? { nodeId: finding.nodeId } : {}),
    sourceText: finding.sourceText,
    constructMappingIds: [...finding.constructMappingIds],
    evidenceIds: [...finding.evidenceIds],
    reviewState: finding.reviewState,
  }))
}

function buildMatrixMappings(
  extraction: ExtractionDocument,
  taxonomy: ConstructTaxonomyDocument,
  findings: MatrixFinding[]
): MatrixConstructMapping[] {
  return extraction.constructMappings.map(mapping => {
    const construct = mapping.constructId
      ? resolveConstructRecord(taxonomy, mapping.constructId)
      : undefined
    return {
      mappingId: mapping.mappingId,
      sourceTerm: mapping.sourceTerm,
      ...(mapping.constructId ? { constructId: mapping.constructId } : {}),
      ...(mapping.mappingStatus === 'approved' && construct
        ? {
          constructId: construct.constructId,
          constructName: construct.canonicalName,
        }
        : {}),
      mappingStatus: mapping.mappingStatus,
      findingIds: findings
        .filter(finding => finding.constructMappingIds.includes(mapping.mappingId))
        .map(finding => finding.findingId),
      evidenceIds: [...mapping.evidenceIds],
      reviewState: mapping.reviewState,
    }
  })
}

function resolveConstructRecord(
  taxonomy: ConstructTaxonomyDocument,
  constructId: string
) {
  const construct = taxonomy.constructs.find(item => item.constructId === constructId)
  if (construct?.status === 'approved') return construct
  if (construct?.status !== 'deprecated' || !construct.primaryConstructId) return undefined
  const primary = taxonomy.constructs.find(
    item => item.constructId === construct.primaryConstructId
  )
  return primary?.status === 'approved' ? primary : undefined
}

function buildMatrixMethodology(
  extraction: ExtractionDocument,
  registry: MethodologyRegistryDocument
): MatrixMethodology {
  const paradigm = extraction.methodology.methodologicalParadigm
  const approved = paradigm.mappingStatus === 'approved'
    ? registry.paradigms.find(
      item => item.paradigmId === paradigm.paradigmId && item.status === 'approved'
    )
    : undefined
  const sample = extraction.methodology.sampleCharacteristics
  return {
    ...(approved ? {
      paradigmId: approved.paradigmId,
      paradigmLabel: approved.label,
    } : {}),
    ...(paradigm.sourceTerm ? { paradigmSourceTerm: paradigm.sourceTerm } : {}),
    paradigmMappingStatus: paradigm.mappingStatus,
    ...normalizedSummary(
      'researchApproach',
      extraction.methodology.researchApproach
    ),
    ...normalizedSummary(
      'analyticalTechnique',
      extraction.methodology.analyticalTechnique
    ),
    ...reportedSummary('population', extraction.fields.population),
    ...(sample.unitOfAnalysis ? { unitOfAnalysis: sample.unitOfAnalysis } : {}),
    ...(sample.n !== undefined ? { sampleSize: sample.n } : {}),
  }
}

function normalizedSummary(
  key: 'researchApproach' | 'analyticalTechnique',
  value: { normalizedValue?: string; sourceTerm?: string }
): Partial<MatrixMethodology> {
  const summary = value.normalizedValue ?? value.sourceTerm
  return summary ? { [key]: summary } : {}
}

function reportedSummary(
  key: 'population',
  value: { normalizedValue?: string; sourceText?: string }
): Partial<MatrixMethodology> {
  const summary = value.normalizedValue ?? value.sourceText
  return summary ? { [key]: summary } : {}
}

function buildVerificationSummary(
  extraction: ExtractionDocument,
  evidence: EvidenceRecord[]
) {
  const states: ReviewState[] = [
    ...(extraction.fields.findings.items ?? []).map(item => item.reviewState),
    ...extraction.constructMappings.map(item => item.reviewState),
  ]
  const referenced = new Set([
    ...extraction.fields.exactEvidenceQuotations.evidenceIds,
    ...(extraction.fields.findings.items ?? []).flatMap(item => item.evidenceIds),
    ...extraction.constructMappings.flatMap(item => item.evidenceIds),
  ])
  return {
    pendingSource: evidence.filter(record =>
      referenced.has(record.evidenceId) &&
      record.reviewState.verification.source === 'pending'
    ).length,
    pendingInterpretation: states.filter(
      state => state.verification.interpretation === 'pending'
    ).length,
    pendingClassification: states.filter(
      state => state.verification.classification === 'pending'
    ).length,
    disputedClassification: states.filter(
      state => state.verification.classification === 'disputed'
    ).length,
  }
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
    schema: { name: 'nodegraph-paper-index', version: PAPER_INDEX_SCHEMA_VERSION },
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
    schema: { name: 'nodegraph-evidence-index', version: DOCUMENT_SCHEMA_VERSION },
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
