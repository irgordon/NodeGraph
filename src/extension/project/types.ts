import { NodeGraph } from '../../webview/types/graph'

export const APPLICATION_VERSION = '0.0.0'
export const LEGACY_PROJECT_SCHEMA_VERSION = '1.0.0'
export const PROJECT_SCHEMA_VERSION = '1.1.0'
export const DOCUMENT_SCHEMA_VERSION = '1.0.0'
export const PAPER_INDEX_SCHEMA_VERSION = '1.1.0'
export const EXTRACTION_SCHEMA_VERSION = '1.0.0'
export const METHODOLOGY_SCHEMA_VERSION = '1.0.0'
export const INDEXER_VERSION = APPLICATION_VERSION

export interface SchemaHeader {
  name: string
  version: string
}

export interface SourceDocument {
  sourceId: string
  relativePath: string
  sourceDocumentHash: string
  doi?: string
  title?: string
  version?: string
}

export interface PaperRegistration {
  paperId: string
  path: string
  source: SourceDocument
  extractionPath?: string
}

export interface ProjectDocuments {
  claims: string
  conflicts: string
  gaps: string
  researchQuestions: string
  constructs: string
  methodologies?: string
  evidence: string
  paperIndex: string
  evidenceIndex: string
  auditLog: string
}

export interface ProjectManifest {
  schema: SchemaHeader
  projectId: string
  title: string
  created: string
  modified: string
  papers: PaperRegistration[]
  documents: ProjectDocuments
  settings?: Record<string, unknown>
}

export interface EvidenceRecord {
  evidenceId: string
  paperId: string
  nodeId?: string
  source: SourceDocument
  quote: {
    text: string
    quoteContentHash: string
  }
  locator: {
    page: number
    prefix?: string
    exact: string
    suffix?: string
    section?: string
  }
  evidenceObjectHash: string
  reviewState: ReviewState
  created: string
  modified: string
}

export interface EvidenceRecordsDocument {
  schema: SchemaHeader
  evidence: EvidenceRecord[]
  modified: string
}

export interface FindingReference {
  paperId: string
  findingId: string
}

export interface SynthesisClaim {
  claimId: string
  findingRefs: FindingReference[]
  evidenceRefs: string[]
  constructRefs?: string[]
}

export interface SynthesisClaimsDocument {
  schema: SchemaHeader
  claims: SynthesisClaim[]
  modified: string
}

export interface ConflictRecord {
  conflictId: string
  claimId: string
  findingRefs: FindingReference[]
}

export interface ConflictsDocument {
  schema: SchemaHeader
  conflicts: ConflictRecord[]
  modified: string
}

export interface AdversarialPassRecord {
  gapId: string
}

export interface GapRecord {
  gapId: string
  evidenceRefs: string[]
  adversarialPasses: AdversarialPassRecord[]
}

export interface GapsDocument {
  schema: SchemaHeader
  gaps: GapRecord[]
  modified: string
}

export interface ResearchQuestionRecord {
  researchQuestionId: string
  gapRefs: string[]
  claimRefs: string[]
}

export interface ResearchQuestionsDocument {
  schema: SchemaHeader
  researchQuestions: ResearchQuestionRecord[]
  modified: string
}

export interface PaperIndexEntry {
  paperId: string
  paperPath: string
  paperGraphHash: string
  sourceDocumentHash: string
  title: string
  authors: string[]
  publicationYear?: number
  doi?: string
  tags: string[]
  taxonomyVersion: number
  extractorVersion: string
  indexedAt: string
  extractionId?: string
  extractionPath?: string
  extractionRevision?: string
  constructMappings?: MatrixConstructMapping[]
  findings?: MatrixFinding[]
  methodology?: MatrixMethodology
  verificationSummary?: VerificationSummary
  staleness?: MatrixStaleness
}

export interface PaperIndexDocument {
  schema: SchemaHeader
  generatedAt: string
  entries: PaperIndexEntry[]
}

export interface EvidenceIndexEntry {
  evidenceId: string
  paperId: string
  nodeId?: string
  evidenceObjectHash: string
  quoteContentHash: string
  sourceDocumentHash: string
  indexedAt: string
}

export interface EvidenceIndexDocument {
  schema: SchemaHeader
  generatedAt: string
  entries: EvidenceIndexEntry[]
}

export type SourceVerification =
  | 'pending'
  | 'verified'
  | 'rejected'
  | 'stale'
  | 'not-applicable'

export type InterpretationVerification =
  | 'pending'
  | 'verified'
  | 'rejected'
  | 'not-applicable'

export type ClassificationVerification =
  | 'pending'
  | 'verified'
  | 'disputed'
  | 'not-applicable'

export type ResearcherApproval = 'not-reviewed' | 'approved' | 'rejected'
export type AdvisorApproval = 'not-reviewed' | 'approved' | 'changes-requested'
export type RecordOrigin = 'human' | 'ai' | 'imported'

export interface ReviewState {
  verification: {
    source: SourceVerification
    interpretation: InterpretationVerification
    classification: ClassificationVerification
  }
  approval: {
    researcher: ResearcherApproval
    advisor: AdvisorApproval
  }
  origin: RecordOrigin
}

export interface Actor {
  type: 'human' | 'agent' | 'service'
  id: string
  version?: string
}

export interface MutationOperation {
  op: 'add' | 'remove' | 'replace' | 'test'
  path: string
  value?: unknown
}

export interface MutationEnvelope {
  mutationId: string
  targetDocument: string
  baseRevision: string
  operations: MutationOperation[]
  requestedAt: string
  actor: Actor
}

export interface MutationAccepted {
  accepted: true
  targetDocument: string
  resultingRevision: string
}

export interface MutationRejected {
  accepted: false
  code: string
  targetDocument: string
  currentRevision: string
  receivedBaseRevision: string
  retryable: boolean
  rejectedOperations: MutationOperation[]
  diagnostics?: ProjectDiagnostic[]
}

export type MutationResult = MutationAccepted | MutationRejected

export type DiagnosticLayer = 'syntactic' | 'structural' | 'integrity'
export type DiagnosticSeverity = 'error' | 'warning'

export interface ProjectDiagnostic {
  layer: DiagnosticLayer
  severity: DiagnosticSeverity
  code: string
  file: string
  rule: string
  action: string
  objectId?: string
  jsonPath?: string
}

export interface ValidationReport {
  valid: boolean
  diagnostics: ProjectDiagnostic[]
}

export interface ProjectOpenResult {
  mode: 'read-write' | 'read-only'
  manifest?: ProjectManifest
  manifestRevision?: string
  paperIndex?: PaperIndexDocument
  evidenceIndex?: EvidenceIndexDocument
  diagnostics: ProjectDiagnostic[]
  hydrationCount: number
}

export interface PaperReadResult {
  graph?: NodeGraph
  diagnostics: ProjectDiagnostic[]
}

export interface PaperHydrationSnapshot {
  count: number
  paperIds: string[]
}

export interface IndexBuildResult {
  paperIndex: PaperIndexDocument
  evidenceIndex: EvidenceIndexDocument
  processedPaperIds: string[]
  reusedPaperIds: string[]
  removedPaperIds: string[]
  diagnostics: ProjectDiagnostic[]
}

export interface SearchQuery {
  text?: string
  publicationYear?: number
  doi?: string
  tag?: string
}

export interface SearchResult {
  paperId: string
  paperPath: string
  title: string
  authors: string[]
  publicationYear?: number
  doi?: string
  tags: string[]
}

export type ReportingStatus =
  | 'not-extracted'
  | 'present'
  | 'absent'
  | 'not-reported'
  | 'unclear'
  | 'not-applicable'

export type MappingStatus = 'unmapped' | 'pending' | 'approved' | 'rejected'

export interface ReportedText {
  reportingStatus: ReportingStatus
  sourceText?: string
  normalizedValue?: string
  evidenceIds?: string[]
}

export interface ExtractedItem {
  extractionItemId: string
  sourceText: string
  normalizedValue?: string
  evidenceIds: string[]
  reviewState: ReviewState
}

export interface ReportedItems {
  reportingStatus: ReportingStatus
  items?: ExtractedItem[]
}

export interface ExtractionFinding {
  findingId: string
  nodeId?: string
  sourceText: string
  normalizedValue?: string
  constructMappingIds: string[]
  evidenceIds: string[]
  reviewState: ReviewState
}

export interface ConstructMapping {
  mappingId: string
  sourceTerm: string
  constructId?: string
  mappingStatus: MappingStatus
  evidenceIds: string[]
  reviewState: ReviewState
}

export interface NormalizedTerm {
  reportingStatus: ReportingStatus
  sourceTerm?: string
  normalizedValue?: string
  reviewState: ReviewState
}

export interface ParadigmMapping {
  reportingStatus: ReportingStatus
  sourceTerm?: string
  paradigmId?: string
  mappingStatus: MappingStatus
  reviewState: ReviewState
}

export interface SampleCharacteristics {
  reportingStatus: ReportingStatus
  sourceText?: string
  n?: number
  unitOfAnalysis?: string
  reviewState: ReviewState
}

export interface ExtractionDocument {
  schema: SchemaHeader
  extractionId: string
  paperId: string
  extractorVersion: string
  extractionStatus: 'not-started' | 'draft' | 'proposed' | 'reviewed'
  fields: {
    researchProblem: ReportedText
    purpose: ReportedText
    researchQuestionsOrHypotheses: ReportedItems
    theoreticalFramework: ReportedItems
    keyConstructs: {
      reportingStatus: ReportingStatus
      mappingIds?: string[]
    }
    population: ReportedText
    setting: ReportedText
    sampleSize: ReportedText
    methodology: ReportedText
    dataCollection: ReportedItems
    analysisMethod: ReportedItems
    findings: {
      reportingStatus: ReportingStatus
      items?: ExtractionFinding[]
    }
    mechanisms: ReportedItems
    moderators: ReportedItems
    limitations: ReportedItems
    boundaryConditions: ReportedItems
    recommendations: ReportedItems
    exactEvidenceQuotations: {
      reportingStatus: ReportingStatus
      evidenceIds: string[]
    }
  }
  methodology: {
    methodologicalParadigm: ParadigmMapping
    researchApproach: NormalizedTerm
    analyticalTechnique: NormalizedTerm
    sampleCharacteristics: SampleCharacteristics
  }
  constructMappings: ConstructMapping[]
  reviewState: ReviewState
  created: string
  modified: string
}

export interface ConstructRecord {
  constructId: string
  canonicalName: string
  definition?: string
  aliases: string[]
  status: 'proposed' | 'approved' | 'deprecated'
  primaryConstructId?: string
  reviewState: ReviewState
}

export interface ConstructTaxonomyDocument {
  schema: SchemaHeader
  taxonomyVersion: number
  constructs: ConstructRecord[]
  modified: string
}

export interface ParadigmRecord {
  paradigmId: string
  label: string
  aliases: string[]
  status: 'proposed' | 'approved'
  reviewState: ReviewState
}

export interface MethodologyRegistryDocument {
  schema: SchemaHeader
  registryVersion: number
  paradigms: ParadigmRecord[]
  modified: string
}

export interface MatrixConstructMapping {
  mappingId: string
  sourceTerm: string
  constructId?: string
  constructName?: string
  mappingStatus: MappingStatus
  findingIds: string[]
  evidenceIds: string[]
  reviewState: ReviewState
}

export interface MatrixFinding {
  findingId: string
  nodeId?: string
  sourceText: string
  constructMappingIds: string[]
  evidenceIds: string[]
  reviewState: ReviewState
}

export interface MatrixMethodology {
  paradigmId?: string
  paradigmLabel?: string
  paradigmSourceTerm?: string
  paradigmMappingStatus: MappingStatus
  researchApproach?: string
  analyticalTechnique?: string
  population?: string
  unitOfAnalysis?: string
  sampleSize?: number
}

export interface VerificationSummary {
  pendingSource: number
  pendingInterpretation: number
  pendingClassification: number
  disputedClassification: number
}

export interface MatrixStaleness {
  paperGraph: boolean
  extraction: boolean
  evidence: boolean
}

export interface MatrixFilters {
  paper?: string
  constructId?: string
  paradigm?: string
  approach?: string
  technique?: string
  population?: string
  publicationYear?: number
  verification?: string
}

export interface MatrixPaper {
  paperId: string
  title: string
  publicationYear?: number
  methodology: MatrixMethodology
  verificationSummary: VerificationSummary
  staleness: MatrixStaleness
}

export interface MatrixConstruct {
  constructId: string
  canonicalName: string
}

export interface MatrixCell {
  paperId: string
  constructId: string
  state: 'empty' | 'unmapped' | 'pending' | 'extracted' | 'stale' | 'invalid'
  mappingIds: string[]
  sourceTerms: string[]
  findingIds: string[]
  evidenceIds: string[]
  verification: {
    source: SourceVerification[]
    interpretation: InterpretationVerification[]
    classification: ClassificationVerification[]
  }
}

export interface MatrixSummary {
  papers: MatrixPaper[]
  constructs: MatrixConstruct[]
  cells: MatrixCell[]
  filters: MatrixFilters
}

export interface MatrixCellDetail {
  paperId: string
  paperPath: string
  constructId: string
  constructName: string
  extractionId: string
  extractionRevision: string
  methodology: MatrixMethodology
  mappings: ConstructMapping[]
  findings: ExtractionFinding[]
  evidence: EvidenceRecord[]
  diagnostics: ProjectDiagnostic[]
}

export interface SourceVerificationQueueItem {
  evidenceId: string
  paperId: string
  sourcePath: string
  quote: string
  page: number
  state: SourceVerification
  stale: boolean
}

export interface AuditEvent {
  eventId: string
  timestamp: string
  actor: Actor
  action: string
  objectId: string
  beforeHash?: string
  afterHash?: string
  baseRevision?: string
  resultingRevision?: string
  metadata?: Record<string, unknown>
  supersedesEventId?: string
}

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue }

export interface Clock {
  now(): string
}

export const systemClock: Clock = {
  now: () => new Date().toISOString(),
}
