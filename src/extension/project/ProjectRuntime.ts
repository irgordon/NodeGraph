import { AtomicJsonWriter } from './AtomicJsonWriter'
import { AuditLog } from './AuditLog'
import { ConstructResolver } from './ConstructResolver'
import { CrossDocumentValidator } from './CrossDocumentValidator'
import { ExtractionService } from './ExtractionService'
import { IndexBuilder } from './IndexBuilder'
import { IntegrityService } from './IntegrityService'
import { MutationRepository } from './MutationRepository'
import { MatrixCsvExporter } from './MatrixCsvExporter'
import { PaperGraphRepository } from './PaperGraphRepository'
import { ProjectPathResolver } from './ProjectPathResolver'
import { ProjectRegistry } from './ProjectRegistry'
import { QueryService } from './QueryService'
import { ReviewStateService } from './ReviewStateService'
import { SchemaMigrationService } from './SchemaMigrationService'
import { SchemaValidator } from './SchemaValidator'
import { SynthesisRepository } from './SynthesisRepository'
import { TaxonomyService } from './TaxonomyService'
import { VerificationService } from './VerificationService'
import { Clock, systemClock } from './types'
import { ClaimService } from './ClaimService'
import { ConflictService } from './ConflictService'
import { EvidenceAppraisalService } from './EvidenceAppraisalService'
import { ConfidenceService } from './ConfidenceService'
import { ContextComparisonService } from './ContextComparisonService'
import { ClaimLedgerQueryService } from './ClaimLedgerQueryService'

export interface ProjectRuntimeOptions {
  schemaRoot: string
  legacySchemaPath: string
  clock?: Clock
  writer?: AtomicJsonWriter
}

export interface ProjectRuntime {
  paths: ProjectPathResolver
  schemas: SchemaValidator
  audit: AuditLog
  papers: PaperGraphRepository
  registry: ProjectRegistry
  synthesis: SynthesisRepository
  integrity: IntegrityService
  indexes: IndexBuilder
  queries: QueryService
  reviews: ReviewStateService
  migrations: SchemaMigrationService
  extractions: ExtractionService
  taxonomy: TaxonomyService
  verification: VerificationService
  csv: MatrixCsvExporter
  claims: ClaimService
  conflicts: ConflictService
  appraisals: EvidenceAppraisalService
  confidence: ConfidenceService
  contextComparisons: ContextComparisonService
  claimLedger: ClaimLedgerQueryService
}

export function createProjectRuntime(options: ProjectRuntimeOptions): ProjectRuntime {
  const clock = options.clock ?? systemClock
  const paths = new ProjectPathResolver()
  const schemas = new SchemaValidator(options.schemaRoot, options.legacySchemaPath)
  const writer = options.writer ?? new AtomicJsonWriter()
  const audit = new AuditLog(paths, schemas, clock)
  const papers = new PaperGraphRepository(paths, schemas)
  const reviews = new ReviewStateService()
  const mutations = new MutationRepository(paths, schemas, writer, audit, reviews)
  const resolver = new ConstructResolver()
  const crossDocuments = new CrossDocumentValidator(resolver)
  const synthesis = new SynthesisRepository(paths, schemas, mutations, crossDocuments)
  const integrity = new IntegrityService(paths, papers, synthesis, audit)
  const registry = new ProjectRegistry(paths, schemas, writer, mutations, clock)
  const indexes = new IndexBuilder(
    paths,
    schemas,
    writer,
    audit,
    papers,
    synthesis,
    integrity,
    clock
  )
  const queries = new QueryService(papers, synthesis, resolver)
  const migrations = new SchemaMigrationService(
    paths,
    schemas,
    writer,
    mutations,
    synthesis,
    crossDocuments,
    clock
  )
  const extractions = new ExtractionService(schemas, synthesis)
  const taxonomy = new TaxonomyService(synthesis, resolver, reviews, clock)
  const verification = new VerificationService(
    paths,
    synthesis,
    integrity,
    reviews,
    clock
  )
  const csv = new MatrixCsvExporter()
  const claims = new ClaimService(synthesis, reviews, schemas, clock)
  const conflicts = new ConflictService(synthesis, reviews, schemas, clock)
  const appraisals = new EvidenceAppraisalService(synthesis, reviews, schemas, clock)
  const confidence = new ConfidenceService()
  const contextComparisons = new ContextComparisonService()
  const claimLedger = new ClaimLedgerQueryService(
    paths,
    schemas,
    writer,
    synthesis,
    integrity,
    confidence,
    clock
  )
  return {
    paths,
    schemas,
    audit,
    papers,
    registry,
    synthesis,
    integrity,
    indexes,
    queries,
    reviews,
    migrations,
    extractions,
    taxonomy,
    verification,
    csv,
    claims,
    conflicts,
    appraisals,
    confidence,
    contextComparisons,
    claimLedger,
  }
}
