import { PaperGraphRepository } from './PaperGraphRepository'
import { calculateDocumentRevision } from './canonical'
import { ConstructResolver } from './ConstructResolver'
import { normalizeMetadataSearch } from './metadata'
import { SynthesisRepository } from './SynthesisRepository'
import {
  ConstructTaxonomyDocument,
  ExtractionDocument,
  MatrixCell,
  MatrixCellDetail,
  MatrixConstruct,
  MatrixFilters,
  MatrixPaper,
  MatrixSummary,
  MatrixMethodology,
  MethodologyRegistryDocument,
  PaperIndexDocument,
  PaperIndexEntry,
  PaperReadResult,
  PaperRegistration,
  ProjectManifest,
  SearchQuery,
  SearchResult,
} from './types'

export class QueryService {
  constructor(
    private readonly papers: PaperGraphRepository,
    private readonly synthesis: SynthesisRepository,
    private readonly constructs: ConstructResolver
  ) {}

  public search(index: PaperIndexDocument, query: SearchQuery): SearchResult[] {
    return index.entries
      .filter(entry => matchesQuery(entry, query))
      .map(entry => ({
        paperId: entry.paperId,
        paperPath: entry.paperPath,
        title: entry.title,
        authors: entry.authors,
        ...(entry.publicationYear ? { publicationYear: entry.publicationYear } : {}),
        ...(entry.doi ? { doi: entry.doi } : {}),
        tags: entry.tags,
      }))
  }

  public async hydratePaper(
    projectRoot: string,
    manifest: ProjectManifest,
    paperId: string
  ): Promise<PaperReadResult> {
    const registration = findRegistration(manifest, paperId)
    return this.papers.read(projectRoot, registration)
  }

  public matrix(
    index: PaperIndexDocument,
    taxonomy: ConstructTaxonomyDocument,
    filters: MatrixFilters = {}
  ): MatrixSummary {
    const entries = index.entries.filter(entry => isPhase2Entry(entry))
      .filter(entry => matchesMatrixFilters(entry, filters))
    const constructs = matrixConstructs(entries, taxonomy, filters)
    return {
      papers: entries.map(matrixPaper),
      constructs,
      cells: entries.flatMap(entry =>
        constructs.map(construct => matrixCell(entry, construct.constructId))
      ),
      filters,
    }
  }

  public async hydrateMatrixCell(
    projectRoot: string,
    manifest: ProjectManifest,
    paperId: string,
    constructId: string
  ): Promise<MatrixCellDetail | undefined> {
    const registration = manifest.papers.find(paper => paper.paperId === paperId)
    if (!registration?.extractionPath) return undefined
    const [extraction, evidence, taxonomy, methodologies] = await Promise.all([
      this.synthesis.readExtraction(projectRoot, registration),
      this.synthesis.readEvidence(projectRoot, manifest),
      this.synthesis.readTaxonomy(projectRoot, manifest),
      this.synthesis.readMethodologies(projectRoot, manifest),
    ])
    if (!extraction.value || !evidence.value || !taxonomy.value || !methodologies.value) {
      return undefined
    }
    const mappings = extraction.value.constructMappings.filter(mapping =>
      constructId === PENDING_CONSTRUCT_ID
        ? mapping.mappingStatus !== 'approved'
        : mapping.mappingStatus === 'approved' &&
          resolvedConstructId(taxonomy.value!, mapping.constructId, this.constructs) === constructId
    )
    const mappingIds = new Set(mappings.map(mapping => mapping.mappingId))
    const findings = (extraction.value.fields.findings.items ?? [])
      .filter(finding => finding.constructMappingIds.some(id => mappingIds.has(id)))
    const evidenceIds = new Set([
      ...mappings.flatMap(mapping => mapping.evidenceIds),
      ...findings.flatMap(finding => finding.evidenceIds),
    ])
    const constructName = constructId === PENDING_CONSTRUCT_ID
      ? PENDING_CONSTRUCT_NAME
      : taxonomy.value.constructs.find(
        construct => construct.constructId === constructId
      )?.canonicalName ?? constructId
    return {
      paperId,
      paperPath: registration.path,
      constructId,
      constructName,
      extractionId: extraction.value.extractionId,
      extractionRevision: calculateDocumentRevision(extraction.value),
      methodology: matrixMethodologyFromExtraction(extraction.value, methodologies.value),
      mappings,
      findings,
      evidence: evidence.value.evidence.filter(record => evidenceIds.has(record.evidenceId)),
      diagnostics: [
        ...extraction.diagnostics,
        ...evidence.diagnostics,
        ...taxonomy.diagnostics,
        ...methodologies.diagnostics,
      ],
    }
  }

  public locateMatrixCell(
    index: PaperIndexDocument,
    paperPath: string,
    nodeId: string
  ): { paperId: string; constructId: string } | undefined {
    const entry = index.entries.find(item => item.paperPath === paperPath)
    const finding = entry?.findings?.find(item => item.nodeId === nodeId)
    if (!entry || !finding) return undefined
    const mapping = entry.constructMappings?.find(item =>
      finding.constructMappingIds.includes(item.mappingId)
    )
    return mapping
      ? {
        paperId: entry.paperId,
        constructId: mapping.mappingStatus === 'approved' && mapping.constructId
          ? mapping.constructId
          : PENDING_CONSTRUCT_ID,
      }
      : undefined
  }
}

export const PENDING_CONSTRUCT_ID = '__pending__'
export const PENDING_CONSTRUCT_NAME = 'Pending / unmapped'

function matchesQuery(
  entry: PaperIndexDocument['entries'][number],
  query: SearchQuery
): boolean {
  return matchesText(entry, query.text) &&
    matchesYear(entry, query.publicationYear) &&
    matchesExact(entry.doi, query.doi) &&
    matchesTag(entry.tags, query.tag)
}

function matchesText(
  entry: PaperIndexDocument['entries'][number],
  text: string | undefined
): boolean {
  if (!text?.trim()) return true
  const needle = normalizeMetadataSearch(text)
  return searchableValues(entry)
    .some(value => normalizeMetadataSearch(value).includes(needle))
}

function searchableValues(entry: PaperIndexDocument['entries'][number]): string[] {
  return [
    entry.paperId,
    entry.title,
    ...entry.authors,
    ...(entry.publicationYear ? [String(entry.publicationYear)] : []),
    ...(entry.doi ? [entry.doi] : []),
    ...entry.tags,
  ]
}

function matchesYear(
  entry: PaperIndexDocument['entries'][number],
  year: number | undefined
): boolean {
  return year === undefined || entry.publicationYear === year
}

function matchesExact(value: string | undefined, expected: string | undefined): boolean {
  return expected === undefined ||
    (value !== undefined &&
      normalizeMetadataSearch(value) === normalizeMetadataSearch(expected))
}

function matchesTag(tags: string[], expected: string | undefined): boolean {
  return expected === undefined ||
    tags.some(tag => normalizeMetadataSearch(tag) === normalizeMetadataSearch(expected))
}

function findRegistration(manifest: ProjectManifest, paperId: string): PaperRegistration {
  const registration = manifest.papers.find(item => item.paperId === paperId)
  if (!registration) throw new Error(`paper-not-registered: ${paperId}`)
  return registration
}

function isPhase2Entry(entry: PaperIndexEntry): boolean {
  return Boolean(
    entry.extractionId &&
    entry.extractionPath &&
    entry.extractionRevision &&
    entry.constructMappings &&
    entry.findings &&
    entry.methodology &&
    entry.verificationSummary &&
    entry.staleness
  )
}

function matchesMatrixFilters(
  entry: PaperIndexEntry,
  filters: MatrixFilters
): boolean {
  return matchesText(entry, filters.paper) &&
    matchesYear(entry, filters.publicationYear) &&
    includesNormalized(entry.methodology?.paradigmLabel, filters.paradigm) &&
    includesNormalized(entry.methodology?.researchApproach, filters.approach) &&
    includesNormalized(entry.methodology?.analyticalTechnique, filters.technique) &&
    includesNormalized(entry.methodology?.population, filters.population) &&
    matchesVerification(entry, filters.verification)
}

function includesNormalized(
  value: string | undefined,
  expected: string | undefined
): boolean {
  if (!expected) return true
  return Boolean(
    value &&
    normalizeMetadataSearch(value).includes(normalizeMetadataSearch(expected))
  )
}

function matchesVerification(
  entry: PaperIndexEntry,
  expected: string | undefined
): boolean {
  if (!expected) return true
  if (expected === 'pending-source') {
    return (entry.verificationSummary?.pendingSource ?? 0) > 0
  }
  if (expected === 'pending-interpretation') {
    return (entry.verificationSummary?.pendingInterpretation ?? 0) > 0
  }
  if (expected === 'pending-classification') {
    return (entry.verificationSummary?.pendingClassification ?? 0) > 0
  }
  if (expected === 'disputed-classification') {
    return (entry.verificationSummary?.disputedClassification ?? 0) > 0
  }
  return true
}

function matrixConstructs(
  entries: PaperIndexEntry[],
  taxonomy: ConstructTaxonomyDocument,
  filters: MatrixFilters
): MatrixConstruct[] {
  const approved = taxonomy.constructs
    .filter(construct => construct.status === 'approved')
    .filter(construct => !filters.constructId || construct.constructId === filters.constructId)
    .map(construct => ({
      constructId: construct.constructId,
      canonicalName: construct.canonicalName,
    }))
    .sort((left, right) => left.canonicalName.localeCompare(right.canonicalName))
  const hasPending = entries.some(entry =>
    entry.constructMappings?.some(mapping => mapping.mappingStatus !== 'approved')
  )
  return hasPending && (!filters.constructId || filters.constructId === PENDING_CONSTRUCT_ID)
    ? [...approved, {
      constructId: PENDING_CONSTRUCT_ID,
      canonicalName: PENDING_CONSTRUCT_NAME,
    }]
    : approved
}

function matrixPaper(entry: PaperIndexEntry): MatrixPaper {
  return {
    paperId: entry.paperId,
    title: entry.title,
    ...(entry.publicationYear ? { publicationYear: entry.publicationYear } : {}),
    methodology: entry.methodology!,
    verificationSummary: entry.verificationSummary!,
    staleness: entry.staleness!,
  }
}

function matrixCell(entry: PaperIndexEntry, constructId: string): MatrixCell {
  const mappings = (entry.constructMappings ?? []).filter(mapping =>
    constructId === PENDING_CONSTRUCT_ID
      ? mapping.mappingStatus !== 'approved'
      : mapping.mappingStatus === 'approved' && mapping.constructId === constructId
  )
  const mappingIds = new Set(mappings.map(mapping => mapping.mappingId))
  const findings = (entry.findings ?? []).filter(finding =>
    finding.constructMappingIds.some(id => mappingIds.has(id))
  )
  return {
    paperId: entry.paperId,
    constructId,
    state: matrixCellState(entry, mappings, findings),
    mappingIds: [...mappingIds],
    sourceTerms: mappings.map(mapping => mapping.sourceTerm),
    findingIds: findings.map(finding => finding.findingId),
    evidenceIds: [...new Set([
      ...mappings.flatMap(mapping => mapping.evidenceIds),
      ...findings.flatMap(finding => finding.evidenceIds),
    ])],
    verification: {
      source: findings.map(finding => finding.reviewState.verification.source),
      interpretation: findings.map(
        finding => finding.reviewState.verification.interpretation
      ),
      classification: [
        ...mappings.map(mapping => mapping.reviewState.verification.classification),
        ...findings.map(finding => finding.reviewState.verification.classification),
      ],
    },
  }
}

function matrixCellState(
  entry: PaperIndexEntry,
  mappings: NonNullable<PaperIndexEntry['constructMappings']>,
  findings: NonNullable<PaperIndexEntry['findings']>
): MatrixCell['state'] {
  if (entry.staleness && Object.values(entry.staleness).some(Boolean)) return 'stale'
  if (!mappings.length) return 'empty'
  if (mappings.some(mapping => mapping.mappingStatus === 'pending')) return 'pending'
  if (mappings.every(mapping => mapping.mappingStatus === 'unmapped')) return 'unmapped'
  if (!findings.length) return 'invalid'
  return 'extracted'
}

function resolvedConstructId(
  taxonomy: ConstructTaxonomyDocument,
  constructId: string | undefined,
  resolver: ConstructResolver
): string | undefined {
  if (!constructId) return undefined
  return resolver.resolve(taxonomy, constructId, 'matrix').constructId
}

function matrixMethodologyFromExtraction(
  extraction: ExtractionDocument,
  registry: MethodologyRegistryDocument
): MatrixMethodology {
  const paradigm = extraction.methodology.methodologicalParadigm
  const approved = registry.paradigms.find(
    item => item.paradigmId === paradigm.paradigmId && item.status === 'approved'
  )
  return {
    ...(approved ? {
      paradigmId: approved.paradigmId,
      paradigmLabel: approved.label,
    } : {}),
    ...(paradigm.sourceTerm ? { paradigmSourceTerm: paradigm.sourceTerm } : {}),
    paradigmMappingStatus: paradigm.mappingStatus,
    ...(extraction.methodology.researchApproach.normalizedValue ||
      extraction.methodology.researchApproach.sourceTerm
      ? {
        researchApproach:
          extraction.methodology.researchApproach.normalizedValue ??
          extraction.methodology.researchApproach.sourceTerm,
      }
      : {}),
    ...(extraction.methodology.analyticalTechnique.normalizedValue ||
      extraction.methodology.analyticalTechnique.sourceTerm
      ? {
        analyticalTechnique:
          extraction.methodology.analyticalTechnique.normalizedValue ??
          extraction.methodology.analyticalTechnique.sourceTerm,
      }
      : {}),
    ...(extraction.fields.population.normalizedValue ||
      extraction.fields.population.sourceText
      ? {
        population:
          extraction.fields.population.normalizedValue ??
          extraction.fields.population.sourceText,
      }
      : {}),
    ...(extraction.methodology.sampleCharacteristics.unitOfAnalysis
      ? {
        unitOfAnalysis:
          extraction.methodology.sampleCharacteristics.unitOfAnalysis,
      }
      : {}),
    ...(extraction.methodology.sampleCharacteristics.n !== undefined
      ? { sampleSize: extraction.methodology.sampleCharacteristics.n }
      : {}),
  }
}
