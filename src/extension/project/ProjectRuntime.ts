import * as path from 'path'
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

export interface ProjectRuntimeOptions {
  extensionRoot: string
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
}

export function createProjectRuntime(options: ProjectRuntimeOptions): ProjectRuntime {
  const clock = options.clock ?? systemClock
  const paths = new ProjectPathResolver()
  const schemas = createSchemaValidator(options.extensionRoot)
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
  }
}

function createSchemaValidator(extensionRoot: string): SchemaValidator {
  return new SchemaValidator(
    path.join(extensionRoot, 'docs', 'schemas'),
    path.join(extensionRoot, 'schema', 'nodegraph.schema.json')
  )
}
