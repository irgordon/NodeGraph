import { readJsonDocument } from './documentIO'
import {
  CrossDocumentValidator,
  SynthesisBundle,
} from './CrossDocumentValidator'
import { hasErrors } from './diagnostics'
import { MutationRepository } from './MutationRepository'
import { ProjectPathResolver } from './ProjectPathResolver'
import { SchemaValidator } from './SchemaValidator'
import {
  ConflictsDocument,
  ConstructTaxonomyDocument,
  EvidenceAppraisalsDocument,
  EvidenceRecordsDocument,
  ExtractionDocument,
  GapsDocument,
  MethodologyRegistryDocument,
  MutationEnvelope,
  MutationResult,
  ProjectDiagnostic,
  ProjectManifest,
  ResearchQuestionsDocument,
  SynthesisClaimsDocument,
  PROJECT_SCHEMA_VERSION,
} from './types'

interface DocumentContract {
  key: keyof SynthesisBundle | 'extraction' | 'methodologies'
  path: string
  schema: string
  auditAction: string
}

export interface MutationAuditContext {
  action: string
  objectId: string
  metadata?: Record<string, unknown>
}

export class SynthesisRepository {
  constructor(
    private readonly paths: ProjectPathResolver,
    private readonly schemas: SchemaValidator,
    private readonly mutations: MutationRepository,
    private readonly crossDocuments: CrossDocumentValidator
  ) {}

  public async readBundle(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{ bundle?: SynthesisBundle; diagnostics: ProjectDiagnostic[] }> {
    const reads = await this.readBundleDocuments(projectRoot, manifest)
    const diagnostics = collectReadDiagnostics(reads)
    if (!hasBundleValues(reads)) return { diagnostics }
    const bundle = bundleFromReads(reads)
    const extractions = manifest.schema.version === PROJECT_SCHEMA_VERSION
      ? await this.readExtractions(projectRoot, manifest)
      : { values: new Map<string, ExtractionDocument>(), diagnostics: [] }
    diagnostics.push(...extractions.diagnostics)
    diagnostics.push(...this.crossDocuments.validate(
      manifest,
      bundle,
      extractions.values
    ))
    return { bundle, diagnostics }
  }

  public async readEvidence(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{ value?: EvidenceRecordsDocument; diagnostics: ProjectDiagnostic[] }> {
    return this.readDocument(
      projectRoot,
      manifest.documents.evidence,
      'evidence-records.schema.json'
    )
  }

  public async readClaims(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{ value?: SynthesisClaimsDocument; diagnostics: ProjectDiagnostic[] }> {
    return this.readDocument(
      projectRoot,
      manifest.documents.claims,
      claimSchemaName(manifest)
    )
  }

  public async readConflicts(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{ value?: ConflictsDocument; diagnostics: ProjectDiagnostic[] }> {
    return this.readDocument(
      projectRoot,
      manifest.documents.conflicts,
      conflictSchemaName(manifest)
    )
  }

  public async readAppraisals(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{ value?: EvidenceAppraisalsDocument; diagnostics: ProjectDiagnostic[] }> {
    if (!manifest.documents.appraisals) {
      return { diagnostics: [missingPhase3Document('appraisals')] }
    }
    return this.readDocument(
      projectRoot,
      manifest.documents.appraisals,
      'evidence-appraisals.schema.json'
    )
  }

  public async readTaxonomy(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{ value?: ConstructTaxonomyDocument; diagnostics: ProjectDiagnostic[] }> {
    return this.readDocument(
      projectRoot,
      manifest.documents.constructs,
      'construct-taxonomy.schema.json'
    )
  }

  public async readMethodologies(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{ value?: MethodologyRegistryDocument; diagnostics: ProjectDiagnostic[] }> {
    if (!manifest.documents.methodologies) {
      return { diagnostics: [missingPhase2Document('methodologies')] }
    }
    const read = await this.readDocument<MethodologyRegistryDocument>(
      projectRoot,
      manifest.documents.methodologies,
      'methodology-registry.schema.json'
    )
    if (!read.value) return read
    const diagnostics = [
      ...read.diagnostics,
      ...this.crossDocuments.validateMethodologies(
        read.value,
        manifest.documents.methodologies
      ),
    ]
    return hasErrors(diagnostics)
      ? { diagnostics }
      : { value: read.value, diagnostics }
  }

  public async readExtraction(
    projectRoot: string,
    registration: ProjectManifest['papers'][number]
  ): Promise<{ value?: ExtractionDocument; diagnostics: ProjectDiagnostic[] }> {
    if (!registration.extractionPath) {
      return { diagnostics: [missingPhase2Document(`extraction:${registration.paperId}`)] }
    }
    return this.readDocument(
      projectRoot,
      registration.extractionPath,
      'extraction.schema.json'
    )
  }

  public validateExtraction(
    projectRoot: string,
    manifest: ProjectManifest,
    registration: ProjectManifest['papers'][number],
    extraction: ExtractionDocument
  ): Promise<ProjectDiagnostic[]> {
    if (!registration.extractionPath) {
      return Promise.resolve([
        missingPhase2Document(`extraction:${registration.paperId}`),
      ])
    }
    return this.validateExtractionCandidate(
      projectRoot,
      manifest,
      {
        key: 'extraction',
        path: registration.extractionPath,
        schema: 'extraction.schema.json',
        auditAction: 'extraction.mutated',
      },
      extraction
    )
  }

  public async applyMutation(
    projectRoot: string,
    manifest: ProjectManifest,
    envelope: MutationEnvelope,
    audit?: MutationAuditContext
  ): Promise<MutationResult> {
    const contract = authoritativeContracts(manifest)
      .find(item => item.path === envelope.targetDocument)
    if (!contract) return unsupportedTarget(envelope)
    return this.mutations.apply(projectRoot, envelope, {
      schemaName: contract.schema,
      auditPath: manifest.documents.auditLog,
      auditAction: audit?.action ?? contract.auditAction,
      auditObjectId: audit?.objectId ?? envelope.mutationId,
      auditMetadata: audit?.metadata,
      validateCandidate: candidate => this.validateCandidate(
        projectRoot,
        manifest,
        contract,
        candidate
      ),
    })
  }

  public async readDocument<T>(
    projectRoot: string,
    relativePath: string,
    schemaName: string
  ): Promise<{ value?: T; diagnostics: ProjectDiagnostic[] }> {
    const target = await this.paths.resolve(projectRoot, relativePath)
    return readJsonDocument<T>(target, relativePath, schemaName, this.schemas)
  }

  private async validateCandidate(
    projectRoot: string,
    manifest: ProjectManifest,
    contract: DocumentContract,
    candidate: unknown
  ): Promise<ProjectDiagnostic[]> {
    if (contract.key === 'extraction') {
      return this.validateExtractionCandidate(
        projectRoot,
        manifest,
        contract,
        candidate
      )
    }
    if (contract.key === 'methodologies') {
      return this.crossDocuments.validateMethodologies(
        candidate as MethodologyRegistryDocument,
        contract.path
      )
    }
    const read = await this.readBundle(projectRoot, manifest)
    if (!read.bundle) return read.diagnostics
    const bundle = replaceValidatedBundleDocument(read.bundle, contract.key, candidate)
    const extractions = manifest.schema.version === PROJECT_SCHEMA_VERSION
      ? await this.readExtractions(projectRoot, manifest)
      : { values: new Map<string, ExtractionDocument>(), diagnostics: [] }
    return [
      ...read.diagnostics,
      ...extractions.diagnostics,
      ...this.crossDocuments.validate(manifest, bundle, extractions.values),
    ]
  }

  private async validateExtractionCandidate(
    projectRoot: string,
    manifest: ProjectManifest,
    contract: DocumentContract,
    candidate: unknown
  ): Promise<ProjectDiagnostic[]> {
    const [evidence, taxonomy, methodologies] = await Promise.all([
      this.readEvidence(projectRoot, manifest),
      this.readTaxonomy(projectRoot, manifest),
      this.readMethodologies(projectRoot, manifest),
    ])
    const diagnostics = [
      ...evidence.diagnostics,
      ...taxonomy.diagnostics,
      ...methodologies.diagnostics,
    ]
    if (!evidence.value || !taxonomy.value || !methodologies.value) return diagnostics
    const extraction = candidate as ExtractionDocument
    const registration = manifest.papers.find(
      paper => paper.extractionPath === contract.path
    )
    if (!registration || extraction.paperId !== registration.paperId) {
      return [...diagnostics, extractionPaperMismatch(contract.path)]
    }
    return [
      ...diagnostics,
      ...this.crossDocuments.validateExtraction(
        manifest,
        extraction,
        evidence.value,
        taxonomy.value,
        methodologies.value
      ),
    ]
  }

  private async readBundleDocuments(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<BundleReads> {
    const [claims, conflicts, gaps, researchQuestions, constructs, evidence, appraisals] = await Promise.all([
      this.readDocument<SynthesisClaimsDocument>(
        projectRoot,
        manifest.documents.claims,
        claimSchemaName(manifest)
      ),
      this.readDocument<ConflictsDocument>(
        projectRoot,
        manifest.documents.conflicts,
        conflictSchemaName(manifest)
      ),
      this.readDocument<GapsDocument>(
        projectRoot,
        manifest.documents.gaps,
        'gaps.schema.json'
      ),
      this.readDocument<ResearchQuestionsDocument>(
        projectRoot,
        manifest.documents.researchQuestions,
        'research-questions.schema.json'
      ),
      this.readDocument<ConstructTaxonomyDocument>(
        projectRoot,
        manifest.documents.constructs,
        'construct-taxonomy.schema.json'
      ),
      this.readDocument<EvidenceRecordsDocument>(
        projectRoot,
        manifest.documents.evidence,
        'evidence-records.schema.json'
      ),
      manifest.documents.appraisals
        ? this.readDocument<EvidenceAppraisalsDocument>(
          projectRoot,
          manifest.documents.appraisals,
          'evidence-appraisals.schema.json'
        )
        : Promise.resolve({ diagnostics: [] }),
    ])
    return { claims, conflicts, gaps, researchQuestions, constructs, evidence, appraisals }
  }

  private async readExtractions(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{
    values: Map<string, ExtractionDocument>
    diagnostics: ProjectDiagnostic[]
  }> {
    const reads = await Promise.all(manifest.papers.map(async registration => ({
      paperId: registration.paperId,
      read: await this.readExtraction(projectRoot, registration),
    })))
    return {
      values: new Map(reads.flatMap(item => item.read.value
        ? [[item.paperId, item.read.value] as const]
        : [])),
      diagnostics: reads.flatMap(item => item.read.diagnostics),
    }
  }
}

interface DocumentRead<T> {
  value?: T
  diagnostics: ProjectDiagnostic[]
}

interface BundleReads {
  claims: DocumentRead<SynthesisClaimsDocument>
  conflicts: DocumentRead<ConflictsDocument>
  gaps: DocumentRead<GapsDocument>
  researchQuestions: DocumentRead<ResearchQuestionsDocument>
  constructs: DocumentRead<ConstructTaxonomyDocument>
  evidence: DocumentRead<EvidenceRecordsDocument>
  appraisals: DocumentRead<EvidenceAppraisalsDocument>
}

function collectReadDiagnostics(reads: BundleReads): ProjectDiagnostic[] {
  return Object.values(reads).flatMap(read => read.diagnostics)
}

function hasBundleValues(
  reads: BundleReads
): reads is { [Key in keyof BundleReads]: Required<BundleReads[Key]> } {
  return reads.claims.value !== undefined &&
    reads.conflicts.value !== undefined &&
    reads.gaps.value !== undefined &&
    reads.researchQuestions.value !== undefined &&
    reads.constructs.value !== undefined &&
    reads.evidence.value !== undefined
}

function bundleFromReads(
  reads: BundleReads
): SynthesisBundle {
  return {
    claims: reads.claims.value!,
    conflicts: reads.conflicts.value!,
    gaps: reads.gaps.value!,
    researchQuestions: reads.researchQuestions.value!,
    constructs: reads.constructs.value!,
    evidence: reads.evidence.value!,
    ...(reads.appraisals.value ? { appraisals: reads.appraisals.value } : {}),
  }
}

function replaceValidatedBundleDocument(
  bundle: SynthesisBundle,
  key: keyof SynthesisBundle,
  candidate: unknown
): SynthesisBundle {
  switch (key) {
    case 'claims':
      return { ...bundle, claims: candidate as SynthesisClaimsDocument }
    case 'conflicts':
      return { ...bundle, conflicts: candidate as ConflictsDocument }
    case 'gaps':
      return { ...bundle, gaps: candidate as GapsDocument }
    case 'researchQuestions':
      return { ...bundle, researchQuestions: candidate as ResearchQuestionsDocument }
    case 'constructs':
      return { ...bundle, constructs: candidate as ConstructTaxonomyDocument }
    case 'evidence':
      return { ...bundle, evidence: candidate as EvidenceRecordsDocument }
    case 'appraisals':
      return { ...bundle, appraisals: candidate as EvidenceAppraisalsDocument }
  }
}

function authoritativeContracts(manifest: ProjectManifest): DocumentContract[] {
  return [
    { key: 'claims', path: manifest.documents.claims, schema: claimSchemaName(manifest), auditAction: 'synthesis.claims-mutated' },
    { key: 'conflicts', path: manifest.documents.conflicts, schema: conflictSchemaName(manifest), auditAction: 'synthesis.conflicts-mutated' },
    { key: 'gaps', path: manifest.documents.gaps, schema: 'gaps.schema.json', auditAction: 'synthesis.gaps-mutated' },
    { key: 'researchQuestions', path: manifest.documents.researchQuestions, schema: 'research-questions.schema.json', auditAction: 'synthesis.questions-mutated' },
    { key: 'constructs', path: manifest.documents.constructs, schema: 'construct-taxonomy.schema.json', auditAction: 'taxonomy.constructs-mutated' },
    ...(manifest.documents.methodologies
      ? [{
        key: 'methodologies' as const,
        path: manifest.documents.methodologies,
        schema: 'methodology-registry.schema.json',
        auditAction: 'taxonomy.methodologies-mutated',
      }]
      : []),
    { key: 'evidence', path: manifest.documents.evidence, schema: 'evidence-records.schema.json', auditAction: 'evidence.records-mutated' },
    ...(manifest.documents.appraisals
      ? [{
        key: 'appraisals' as const,
        path: manifest.documents.appraisals,
        schema: 'evidence-appraisals.schema.json',
        auditAction: 'evidence.appraisals-mutated',
      }]
      : []),
    ...manifest.papers.flatMap(paper => paper.extractionPath
      ? [{
        key: 'extraction' as const,
        path: paper.extractionPath,
        schema: 'extraction.schema.json',
        auditAction: 'extraction.mutated',
      }]
      : []),
  ]
}

function claimSchemaName(manifest: ProjectManifest): string {
  return manifest.schema.version === PROJECT_SCHEMA_VERSION
    ? 'synthesis-claims-v1.2.schema.json'
    : 'synthesis-claims.schema.json'
}

function conflictSchemaName(manifest: ProjectManifest): string {
  return manifest.schema.version === PROJECT_SCHEMA_VERSION
    ? 'conflicts-v1.2.schema.json'
    : 'conflicts.schema.json'
}

function missingPhase2Document(name: string): ProjectDiagnostic {
  return {
    layer: 'syntactic',
    severity: 'error',
    code: 'phase2-document-not-registered',
    file: 'project.nodegraph.json',
    objectId: name,
    rule: 'The Phase 2 authoritative document is not registered.',
    action: 'Run the explicit Phase 2 project migration.',
  }
}

function missingPhase3Document(name: string): ProjectDiagnostic {
  return {
    layer: 'syntactic',
    severity: 'error',
    code: 'phase3-document-not-registered',
    file: 'project.nodegraph.json',
    objectId: name,
    rule: 'The Phase 3 authoritative document is not registered.',
    action: 'Run the explicit Phase 3 project migration.',
  }
}

function extractionPaperMismatch(file: string): ProjectDiagnostic {
  return {
    layer: 'structural',
    severity: 'error',
    code: 'extraction-paper-mismatch',
    file,
    rule: 'The extraction paper ID does not match its manifest registration.',
    action: 'Use the extraction document registered for the selected paper.',
  }
}

function unsupportedTarget(envelope: MutationEnvelope): MutationResult {
  return {
    accepted: false,
    code: 'unsupported-mutation-target',
    targetDocument: envelope.targetDocument,
    currentRevision: envelope.baseRevision,
    receivedBaseRevision: envelope.baseRevision,
    retryable: false,
    rejectedOperations: envelope.operations,
  }
}
