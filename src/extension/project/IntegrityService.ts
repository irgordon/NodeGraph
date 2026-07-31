import { readFile } from 'fs/promises'
import * as path from 'path'
import { NodeGraph } from '../../webview/types/graph'
import { AuditLog } from './AuditLog'
import {
  calculateByteHash,
  calculateEvidenceObjectHash,
  calculateQuoteContentHash,
} from './canonical'
import { SynthesisBundle } from './CrossDocumentValidator'
import { diagnostic, hasErrors } from './diagnostics'
import { isFileError } from './documentIO'
import { PaperGraphRepository } from './PaperGraphRepository'
import { ProjectPathError, ProjectPathResolver } from './ProjectPathResolver'
import { SynthesisRepository } from './SynthesisRepository'
import {
  EvidenceIndexDocument,
  EvidenceRecord,
  PaperIndexDocument,
  PaperRegistration,
  ProjectDiagnostic,
  ProjectManifest,
  SourceDocument,
  ValidationReport,
} from './types'

export interface PaperIntegrityResult {
  graph?: NodeGraph
  graphHash?: string
  currentSourceHash?: string
  diagnostics: ProjectDiagnostic[]
}

export interface KnownPaperIntegrity {
  graphHash?: string
  currentSourceHash?: string
}

export type SourceIdentity = Pick<
  SourceDocument,
  'relativePath' | 'sourceDocumentHash'
>

export class IntegrityService {
  constructor(
    private readonly paths: ProjectPathResolver,
    private readonly papers: PaperGraphRepository,
    private readonly synthesis: SynthesisRepository,
    private readonly audit: AuditLog
  ) {}

  public async validate(projectRoot: string, manifest: ProjectManifest): Promise<ValidationReport> {
    const bundleRead = await this.synthesis.readBundle(projectRoot, manifest)
    const auditRead = await this.audit.inspect(projectRoot, manifest.documents.auditLog)
    const diagnostics = [...bundleRead.diagnostics, ...auditRead.diagnostics]
    if (!bundleRead.bundle) return report(diagnostics)
    diagnostics.push(...await this.validatePapers(projectRoot, manifest, bundleRead.bundle))
    diagnostics.push(...await this.validateIndexes(projectRoot, manifest, bundleRead.bundle))
    return report(diagnostics)
  }

  public async inspectPaper(
    projectRoot: string,
    registration: PaperRegistration,
    evidence: EvidenceRecord[] = [],
    known: KnownPaperIntegrity = {}
  ): Promise<PaperIntegrityResult> {
    const diagnostics: ProjectDiagnostic[] = []
    const graphHash = known.graphHash ??
      await this.readGraphHash(projectRoot, registration, diagnostics)
    const currentSourceHash = known.currentSourceHash ??
      await this.readSourceHash(projectRoot, registration, diagnostics)
    const graphRead = await this.readGraph(projectRoot, registration, diagnostics)
    if (graphRead) diagnostics.push(...validateEvidenceForGraph(evidence, graphRead, registration))
    return {
      ...(graphRead ? { graph: graphRead } : {}),
      ...(graphHash ? { graphHash } : {}),
      ...(currentSourceHash ? { currentSourceHash } : {}),
      diagnostics,
    }
  }

  public async inspectSource(
    projectRoot: string,
    registration: PaperRegistration
  ): Promise<{ currentHash?: string; diagnostics: ProjectDiagnostic[] }> {
    const diagnostics: ProjectDiagnostic[] = []
    const currentHash = await this.readSourceHash(projectRoot, registration, diagnostics)
    return { ...(currentHash ? { currentHash } : {}), diagnostics }
  }

  public async identifyProjectSource(
    projectRoot: string,
    relativePath: string
  ): Promise<SourceIdentity> {
    const target = await this.paths.resolve(projectRoot, relativePath, true)
    return sourceIdentity(relativePath, await readFile(target))
  }

  public async identifyPaperSource(
    projectRoot: string,
    paperPath: string,
    relativeReference: string
  ): Promise<SourceIdentity> {
    const resolved = await this.paths.resolveFromFile(
      projectRoot,
      paperPath,
      relativeReference,
      true
    )
    return sourceIdentity(resolved.relativePath, await readFile(resolved.target))
  }

  private async validatePapers(
    projectRoot: string,
    manifest: ProjectManifest,
    bundle: SynthesisBundle
  ): Promise<ProjectDiagnostic[]> {
    const diagnostics: ProjectDiagnostic[] = []
    const evidenceByPaper = groupEvidence(bundle.evidence.evidence)
    for (const registration of manifest.papers) {
      const result = await this.inspectPaper(
        projectRoot,
        registration,
        evidenceByPaper.get(registration.paperId) ?? []
      )
      diagnostics.push(...result.diagnostics)
      if (result.graph) {
        diagnostics.push(...validateFindingReferences(result.graph, registration, bundle))
      }
    }
    return diagnostics
  }

  private async validateIndexes(
    projectRoot: string,
    manifest: ProjectManifest,
    bundle: SynthesisBundle
  ): Promise<ProjectDiagnostic[]> {
    const paperIndex = await this.synthesis.readDocument<PaperIndexDocument>(
      projectRoot,
      manifest.documents.paperIndex,
      'paper-index.schema.json'
    )
    const evidenceIndex = await this.synthesis.readDocument<EvidenceIndexDocument>(
      projectRoot,
      manifest.documents.evidenceIndex,
      'evidence-index.schema.json'
    )
    return [
      ...paperIndex.diagnostics.map(asRecoverableIndexDiagnostic),
      ...evidenceIndex.diagnostics.map(asRecoverableIndexDiagnostic),
      ...(paperIndex.value
        ? await validatePaperIndex(projectRoot, manifest, paperIndex.value, this.papers)
        : []),
      ...(evidenceIndex.value
        ? validateEvidenceIndex(bundle.evidence.evidence, evidenceIndex.value, manifest)
        : []),
    ]
  }

  private async readGraph(
    projectRoot: string,
    registration: PaperRegistration,
    diagnostics: ProjectDiagnostic[]
  ): Promise<NodeGraph | undefined> {
    try {
      const read = await this.papers.read(projectRoot, registration)
      diagnostics.push(...read.diagnostics)
      return read.graph
    } catch (error) {
      diagnostics.push(fileDiagnostic(error, registration.path, registration.paperId, 'paper'))
      return undefined
    }
  }

  private async readGraphHash(
    projectRoot: string,
    registration: PaperRegistration,
    diagnostics: ProjectDiagnostic[]
  ): Promise<string | undefined> {
    try {
      return await this.papers.calculateGraphHash(projectRoot, registration.path)
    } catch (error) {
      diagnostics.push(fileDiagnostic(error, registration.path, registration.paperId, 'paper'))
      return undefined
    }
  }

  private async readSourceHash(
    projectRoot: string,
    registration: PaperRegistration,
    diagnostics: ProjectDiagnostic[]
  ): Promise<string | undefined> {
    try {
      const sourcePath = await this.paths.resolve(projectRoot, registration.source.relativePath, true)
      const currentHash = calculateByteHash(await readFile(sourcePath))
      if (currentHash !== registration.source.sourceDocumentHash) {
        diagnostics.push(staleSourceDiagnostic(registration, currentHash))
      }
      return currentHash
    } catch (error) {
      diagnostics.push(fileDiagnostic(
        error,
        registration.source.relativePath,
        registration.source.sourceId,
        'source'
      ))
      return undefined
    }
  }
}

function sourceIdentity(relativePath: string, content: Buffer): SourceIdentity {
  return {
    relativePath,
    sourceDocumentHash: calculateByteHash(content),
  }
}

function report(diagnostics: ProjectDiagnostic[]): ValidationReport {
  return { valid: !hasErrors(diagnostics), diagnostics }
}

function groupEvidence(evidence: EvidenceRecord[]): Map<string, EvidenceRecord[]> {
  const grouped = new Map<string, EvidenceRecord[]>()
  for (const record of evidence) {
    const records = grouped.get(record.paperId) ?? []
    records.push(record)
    grouped.set(record.paperId, records)
  }
  return grouped
}

function validateEvidenceForGraph(
  evidence: EvidenceRecord[],
  graph: NodeGraph,
  registration: PaperRegistration
): ProjectDiagnostic[] {
  return evidence.flatMap(record => [
    ...validateEvidenceHashes(record, registration),
    ...validateEvidenceSource(record, registration),
    ...validateEvidenceNode(record, graph, registration),
  ])
}

function validateEvidenceHashes(
  evidence: EvidenceRecord,
  registration: PaperRegistration
): ProjectDiagnostic[] {
  const diagnostics: ProjectDiagnostic[] = []
  if (calculateQuoteContentHash(evidence.quote.text) !== evidence.quote.quoteContentHash) {
    diagnostics.push(evidenceDiagnostic('stale-quotation-hash', evidence, registration))
  }
  if (calculateEvidenceObjectHash(evidence) !== evidence.evidenceObjectHash) {
    diagnostics.push(evidenceDiagnostic('stale-evidence-object-hash', evidence, registration))
  }
  return diagnostics
}

function validateEvidenceSource(
  evidence: EvidenceRecord,
  registration: PaperRegistration
): ProjectDiagnostic[] {
  const source = registration.source
  if (
    evidence.source.sourceId === source.sourceId &&
    evidence.source.sourceDocumentHash === source.sourceDocumentHash &&
    evidence.source.relativePath === source.relativePath
  ) return []
  return [evidenceDiagnostic('evidence-source-mismatch', evidence, registration)]
}

function validateEvidenceNode(
  evidence: EvidenceRecord,
  graph: NodeGraph,
  registration: PaperRegistration
): ProjectDiagnostic[] {
  if (!evidence.nodeId) return []
  const node = graph.nodes.find(item => item.id === evidence.nodeId)
  if (!node) return [evidenceDiagnostic('broken-evidence-link', evidence, registration)]
  if (!node.original?.text) return [evidenceDiagnostic('missing-node-evidence', evidence, registration)]
  if (calculateQuoteContentHash(node.original.text) === evidence.quote.quoteContentHash) return []
  return [evidenceDiagnostic('stale-quotation-evidence', evidence, registration)]
}

function validateFindingReferences(
  graph: NodeGraph,
  registration: PaperRegistration,
  bundle: SynthesisBundle
): ProjectDiagnostic[] {
  const referenced = [
    ...bundle.claims.claims.flatMap(claim => claim.findingRefs),
    ...bundle.conflicts.conflicts.flatMap(conflict => conflict.findingRefs),
  ].filter(reference => reference.paperId === registration.paperId)
  const nodeIds = new Set(graph.nodes.map(node => node.id))
  return referenced
    .filter(reference => !nodeIds.has(reference.findingId))
    .map(reference => diagnostic({
      layer: 'integrity',
      code: 'orphaned-finding-reference',
      file: registration.path,
      objectId: reference.findingId,
      rule: 'A synthesis object references a finding node that does not exist.',
      action: 'Restore the node or update the synthesis reference through review.',
    }))
}

async function validatePaperIndex(
  projectRoot: string,
  manifest: ProjectManifest,
  index: PaperIndexDocument,
  papers: PaperGraphRepository
): Promise<ProjectDiagnostic[]> {
  const diagnostics: ProjectDiagnostic[] = []
  const registrations = new Map(manifest.papers.map(item => [item.paperId, item]))
  for (const registration of manifest.papers) {
    const entry = index.entries.find(item => item.paperId === registration.paperId)
    if (!entry) diagnostics.push(staleIndexDiagnostic(manifest.documents.paperIndex, registration.paperId))
    else diagnostics.push(...await comparePaperIndexEntry(projectRoot, registration, entry, papers, manifest))
  }
  for (const entry of index.entries) {
    if (!registrations.has(entry.paperId)) {
      diagnostics.push(staleIndexDiagnostic(manifest.documents.paperIndex, entry.paperId))
    }
  }
  return diagnostics
}

async function comparePaperIndexEntry(
  projectRoot: string,
  registration: PaperRegistration,
  entry: PaperIndexDocument['entries'][number],
  papers: PaperGraphRepository,
  manifest: ProjectManifest
): Promise<ProjectDiagnostic[]> {
  try {
    const graphHash = await papers.calculateGraphHash(projectRoot, registration.path)
    const stale = entry.paperGraphHash !== graphHash ||
      entry.paperPath !== registration.path ||
      entry.sourceDocumentHash !== registration.source.sourceDocumentHash
    return stale ? [staleIndexDiagnostic(manifest.documents.paperIndex, registration.paperId)] : []
  } catch {
    return [staleIndexDiagnostic(manifest.documents.paperIndex, registration.paperId)]
  }
}

function validateEvidenceIndex(
  evidence: EvidenceRecord[],
  index: EvidenceIndexDocument,
  manifest: ProjectManifest
): ProjectDiagnostic[] {
  const authoritative = new Map(evidence.map(item => [item.evidenceId, item]))
  const diagnostics: ProjectDiagnostic[] = []
  for (const record of evidence) {
    const entry = index.entries.find(item => item.evidenceId === record.evidenceId)
    if (!entry || !evidenceEntryMatches(record, entry)) {
      diagnostics.push(staleIndexDiagnostic(manifest.documents.evidenceIndex, record.evidenceId))
    }
  }
  for (const entry of index.entries) {
    if (!authoritative.has(entry.evidenceId)) {
      diagnostics.push(staleIndexDiagnostic(manifest.documents.evidenceIndex, entry.evidenceId))
    }
  }
  return diagnostics
}

function evidenceEntryMatches(
  evidence: EvidenceRecord,
  entry: EvidenceIndexDocument['entries'][number]
): boolean {
  return entry.paperId === evidence.paperId &&
    entry.nodeId === evidence.nodeId &&
    entry.evidenceObjectHash === evidence.evidenceObjectHash &&
    entry.quoteContentHash === evidence.quote.quoteContentHash &&
    entry.sourceDocumentHash === evidence.source.sourceDocumentHash
}

function staleSourceDiagnostic(
  registration: PaperRegistration,
  currentHash: string
): ProjectDiagnostic {
  return diagnostic({
    layer: 'integrity',
    severity: 'warning',
    code: 'source-document-hash-mismatch',
    file: registration.source.relativePath,
    objectId: registration.source.sourceId,
    rule: `The current PDF hash ${currentHash} does not match the registered source identity.`,
    action: 'Restore the registered PDF or review and explicitly register the new source version.',
  })
}

function evidenceDiagnostic(
  code: string,
  evidence: EvidenceRecord,
  registration: PaperRegistration
): ProjectDiagnostic {
  return diagnostic({
    layer: 'integrity',
    severity: code.startsWith('stale-') ? 'warning' : 'error',
    code,
    file: registration.path,
    objectId: evidence.evidenceId,
    rule: `${evidence.evidenceId} no longer matches its authoritative source or paper node.`,
    action: 'Preserve the record and review the source, quotation, and link before updating it.',
  })
}

function fileDiagnostic(
  error: unknown,
  file: string,
  objectId: string,
  kind: 'paper' | 'source'
): ProjectDiagnostic {
  const pathCode = error instanceof ProjectPathError ? error.code : undefined
  const missing = isFileError(error, 'ENOENT')
  return diagnostic({
    layer: pathCode ? 'structural' : 'integrity',
    code: pathCode ?? (missing ? `missing-${kind}-file` : `inaccessible-${kind}-file`),
    file,
    objectId,
    rule: pathCode ? 'The path escapes the project root.' : `The registered ${kind} file cannot be read.`,
    action: pathCode ? 'Use a contained project-relative path.' : `Restore the ${kind} file or remove its registration.`,
  })
}

function staleIndexDiagnostic(file: string, objectId: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'integrity',
    severity: 'warning',
    code: 'stale-derived-index',
    file,
    objectId,
    rule: 'The derived index entry does not match authoritative project data.',
    action: 'Rebuild the index from the manifest, paper graphs, and evidence records.',
  })
}

function asRecoverableIndexDiagnostic(item: ProjectDiagnostic): ProjectDiagnostic {
  return {
    ...item,
    layer: 'integrity',
    severity: 'warning',
    code: item.code === 'missing-file' ? 'missing-derived-index' : 'invalid-derived-index',
    action: 'Rebuild the derived index from authoritative project data.',
  }
}
