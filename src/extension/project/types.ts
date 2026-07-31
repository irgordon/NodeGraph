import { NodeGraph } from '../../webview/types/graph'

export const APPLICATION_VERSION = '0.0.0'
export const PROJECT_SCHEMA_VERSION = '1.0.0'
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
}

export interface ProjectDocuments {
  claims: string
  conflicts: string
  gaps: string
  researchQuestions: string
  constructs: string
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

export interface ReviewState {
  verification: {
    source: string
    interpretation: string
    classification: string
  }
  approval: {
    researcher: string
    advisor: string
  }
  origin: string
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
