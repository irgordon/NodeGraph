import { readJsonDocument } from './documentIO'
import {
  CrossDocumentValidator,
  SynthesisBundle,
} from './CrossDocumentValidator'
import { MutationRepository } from './MutationRepository'
import { ProjectPathResolver } from './ProjectPathResolver'
import { SchemaValidator } from './SchemaValidator'
import {
  ConflictsDocument,
  EvidenceRecordsDocument,
  GapsDocument,
  MutationEnvelope,
  MutationResult,
  ProjectDiagnostic,
  ProjectManifest,
  ResearchQuestionsDocument,
  SynthesisClaimsDocument,
} from './types'
import { ConstructTaxonomyDocument } from './ConstructResolver'

interface DocumentContract {
  key: keyof SynthesisBundle
  path: string
  schema: string
  auditAction: string
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
    diagnostics.push(...this.crossDocuments.validate(manifest, bundle))
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

  public async applyMutation(
    projectRoot: string,
    manifest: ProjectManifest,
    envelope: MutationEnvelope
  ): Promise<MutationResult> {
    const contract = authoritativeContracts(manifest)
      .find(item => item.path === envelope.targetDocument)
    if (!contract) return unsupportedTarget(envelope)
    return this.mutations.apply(projectRoot, envelope, {
      schemaName: contract.schema,
      auditPath: manifest.documents.auditLog,
      auditAction: contract.auditAction,
      auditObjectId: envelope.mutationId,
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
    const read = await this.readBundle(projectRoot, manifest)
    if (!read.bundle) return read.diagnostics
    const bundle = replaceValidatedBundleDocument(read.bundle, contract.key, candidate)
    return this.crossDocuments.validate(manifest, bundle)
  }

  private async readBundleDocuments(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<BundleReads> {
    const [claims, conflicts, gaps, researchQuestions, constructs, evidence] = await Promise.all([
      this.readDocument<SynthesisClaimsDocument>(
        projectRoot,
        manifest.documents.claims,
        'synthesis-claims.schema.json'
      ),
      this.readDocument<ConflictsDocument>(
        projectRoot,
        manifest.documents.conflicts,
        'conflicts.schema.json'
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
    ])
    return { claims, conflicts, gaps, researchQuestions, constructs, evidence }
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
}

function collectReadDiagnostics(reads: BundleReads): ProjectDiagnostic[] {
  return Object.values(reads).flatMap(read => read.diagnostics)
}

function hasBundleValues(
  reads: BundleReads
): reads is { [Key in keyof BundleReads]: Required<BundleReads[Key]> } {
  return Object.values(reads).every(read => read.value !== undefined)
}

function bundleFromReads(
  reads: { [Key in keyof BundleReads]: Required<BundleReads[Key]> }
): SynthesisBundle {
  return {
    claims: reads.claims.value,
    conflicts: reads.conflicts.value,
    gaps: reads.gaps.value,
    researchQuestions: reads.researchQuestions.value,
    constructs: reads.constructs.value,
    evidence: reads.evidence.value,
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
  }
}

function authoritativeContracts(manifest: ProjectManifest): DocumentContract[] {
  return [
    { key: 'claims', path: manifest.documents.claims, schema: 'synthesis-claims.schema.json', auditAction: 'synthesis.claims-mutated' },
    { key: 'conflicts', path: manifest.documents.conflicts, schema: 'conflicts.schema.json', auditAction: 'synthesis.conflicts-mutated' },
    { key: 'gaps', path: manifest.documents.gaps, schema: 'gaps.schema.json', auditAction: 'synthesis.gaps-mutated' },
    { key: 'researchQuestions', path: manifest.documents.researchQuestions, schema: 'research-questions.schema.json', auditAction: 'synthesis.questions-mutated' },
    { key: 'constructs', path: manifest.documents.constructs, schema: 'construct-taxonomy.schema.json', auditAction: 'taxonomy.constructs-mutated' },
    { key: 'evidence', path: manifest.documents.evidence, schema: 'evidence-records.schema.json', auditAction: 'evidence.records-mutated' },
  ]
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
