import * as path from 'path'
import { calculateDocumentRevision } from './canonical'
import { diagnostic } from './diagnostics'
import { ProjectRuntime } from './ProjectRuntime'
import { phase3Rejected, requirePhase3 } from './phase3Support'
import {
  Actor,
  ClaimLedgerDetail,
  ClaimLedgerIndexDocument,
  Clock,
  ConflictExplanation,
  ConflictRecord,
  ConflictType,
  ContextComparison,
  ContextDimension,
  EvidenceAppraisal,
  ExtractionDocument,
  FindingReference,
  FindingRelationship,
  MutationResult,
  PROJECT_SCHEMA_VERSION,
  ProjectDiagnostic,
  ProjectManifest,
  ResearcherApproval,
  SynthesisClaim,
  systemClock,
} from './types'

const HUMAN_ACTOR: Actor = { type: 'human', id: 'researcher' }
const CONFIDENCE_ACTOR: Actor = { type: 'service', id: 'ConfidenceService' }

export interface Phase3MutationOutcome {
  mutation: MutationResult
  diagnostics: ProjectDiagnostic[]
}

export interface ClaimLedgerOpenOutcome {
  ledger?: ClaimLedgerIndexDocument
  diagnostics: ProjectDiagnostic[]
  hydrationCount: number
}

export class Phase3ProjectService {
  constructor(
    private readonly runtime: ProjectRuntime,
    private readonly clock: Clock = systemClock
  ) {}

  public async migrate(manifestPath: string): Promise<Phase3MutationOutcome> {
    const migrated = await this.runtime.migrations.migratePhase3(
      manifestPath,
      HUMAN_ACTOR
    )
    if (!migrated.mutation.accepted || !migrated.manifest) {
      return { mutation: migrated.mutation, diagnostics: migrated.diagnostics }
    }
    const ledger = await this.runtime.claimLedger.rebuild(
      path.dirname(manifestPath),
      migrated.manifest
    )
    return {
      mutation: migrated.mutation,
      diagnostics: [...migrated.diagnostics, ...ledger.diagnostics],
    }
  }

  public async importClaim(
    manifestPath: string,
    proposal: unknown,
    actor: Actor,
    baseRevision?: string
  ): Promise<Phase3MutationOutcome> {
    const project = await this.openProject(manifestPath)
    if (!project.value) return rejectedProjectOutcome(project.diagnostics, baseRevision)
    const read = await this.runtime.synthesis.readClaims(project.root, project.value)
    if (!read.value) return rejectedProjectOutcome(read.diagnostics, baseRevision)
    const mutation = await this.runtime.claims.propose(
      project.root,
      project.value,
      proposal,
      baseRevision ?? calculateDocumentRevision(read.value),
      actor
    )
    return this.finishMutation(project.root, project.value, mutation)
  }

  public async reviewClaim(
    manifestPath: string,
    claimId: string,
    decision: ResearcherApproval,
    baseRevision?: string
  ): Promise<Phase3MutationOutcome> {
    return this.withClaims(manifestPath, baseRevision, (root, manifest, revision) =>
      this.runtime.claims.review(
        root,
        manifest,
        claimId,
        decision,
        revision,
        HUMAN_ACTOR
      ))
  }

  public async decideParadigm(
    manifestPath: string,
    claimId: string,
    decision: 'approved' | 'rejected',
    rationale: string,
    baseRevision?: string
  ): Promise<Phase3MutationOutcome> {
    return this.withClaims(manifestPath, baseRevision, (root, manifest, revision) =>
      this.runtime.claims.decideParadigm(
        root,
        manifest,
        claimId,
        decision,
        rationale,
        revision,
        HUMAN_ACTOR
      ))
  }

  public addClaimRelationship(
    manifestPath: string,
    claimId: string,
    reference: FindingReference,
    evidenceIds: string[],
    baseRevision?: string
  ): Promise<Phase3MutationOutcome> {
    return this.withClaims(manifestPath, baseRevision, (root, manifest, revision) =>
      this.runtime.claims.addRelationship(
        root, manifest, claimId, reference, evidenceIds, revision, HUMAN_ACTOR
      ))
  }

  public removeClaimRelationship(
    manifestPath: string,
    claimId: string,
    paperId: string,
    findingId: string,
    evidenceIds: string[],
    baseRevision?: string
  ): Promise<Phase3MutationOutcome> {
    return this.withClaims(manifestPath, baseRevision, (root, manifest, revision) =>
      this.runtime.claims.removeRelationship(
        root, manifest, claimId, paperId, findingId, evidenceIds, revision, HUMAN_ACTOR
      ))
  }

  public changeClaimRelationship(
    manifestPath: string,
    claimId: string,
    paperId: string,
    findingId: string,
    relationship: FindingRelationship,
    baseRevision?: string
  ): Promise<Phase3MutationOutcome> {
    return this.withClaims(manifestPath, baseRevision, (root, manifest, revision) =>
      this.runtime.claims.changeRelationship(
        root, manifest, claimId, paperId, findingId, relationship, revision, HUMAN_ACTOR
      ))
  }

  public async importConflict(
    manifestPath: string,
    proposal: unknown,
    actor: Actor,
    baseRevision?: string
  ): Promise<Phase3MutationOutcome> {
    const project = await this.openProject(manifestPath)
    if (!project.value) return rejectedProjectOutcome(project.diagnostics, baseRevision)
    const read = await this.runtime.synthesis.readConflicts(project.root, project.value)
    if (!read.value) return rejectedProjectOutcome(read.diagnostics, baseRevision)
    const mutation = await this.runtime.conflicts.propose(
      project.root,
      project.value,
      proposal,
      baseRevision ?? calculateDocumentRevision(read.value),
      actor
    )
    return this.finishMutation(project.root, project.value, mutation)
  }

  public async reclassifyConflict(
    manifestPath: string,
    conflictId: string,
    conflictType: ConflictType,
    rationale: string,
    baseRevision?: string
  ): Promise<Phase3MutationOutcome> {
    return this.withConflicts(manifestPath, baseRevision, (root, manifest, revision) =>
      this.runtime.conflicts.reclassify(
        root,
        manifest,
        conflictId,
        conflictType,
        rationale,
        revision,
        HUMAN_ACTOR
      ))
  }

  public async reviewConflict(
    manifestPath: string,
    conflictId: string,
    decision: ResearcherApproval,
    baseRevision?: string
  ): Promise<Phase3MutationOutcome> {
    return this.withConflicts(manifestPath, baseRevision, (root, manifest, revision) =>
      this.runtime.conflicts.review(
        root,
        manifest,
        conflictId,
        decision,
        revision,
        HUMAN_ACTOR
      ))
  }

  public replaceConflictExplanations(
    manifestPath: string,
    conflictId: string,
    explanations: ConflictExplanation[],
    actor: Actor,
    baseRevision?: string
  ): Promise<Phase3MutationOutcome> {
    return this.withConflicts(manifestPath, baseRevision, (root, manifest, revision) =>
      this.runtime.conflicts.replaceExplanations(
        root, manifest, conflictId, explanations, revision, actor
      ))
  }

  public async importAppraisal(
    manifestPath: string,
    proposal: unknown,
    actor: Actor,
    baseRevision?: string
  ): Promise<Phase3MutationOutcome> {
    const project = await this.openProject(manifestPath)
    if (!project.value) return rejectedProjectOutcome(project.diagnostics, baseRevision)
    const read = await this.runtime.synthesis.readAppraisals(project.root, project.value)
    if (!read.value) return rejectedProjectOutcome(read.diagnostics, baseRevision)
    const mutation = await this.runtime.appraisals.propose(
      project.root,
      project.value,
      proposal,
      baseRevision ?? calculateDocumentRevision(read.value),
      actor
    )
    return this.finishMutation(project.root, project.value, mutation)
  }

  public async reviewAppraisal(
    manifestPath: string,
    appraisalId: string,
    decision: ResearcherApproval,
    baseRevision?: string
  ): Promise<Phase3MutationOutcome> {
    const project = await this.openProject(manifestPath)
    if (!project.value) return rejectedProjectOutcome(project.diagnostics, baseRevision)
    const read = await this.runtime.synthesis.readAppraisals(project.root, project.value)
    if (!read.value) return rejectedProjectOutcome(read.diagnostics, baseRevision)
    const mutation = await this.runtime.appraisals.review(
      project.root,
      project.value,
      appraisalId,
      decision,
      baseRevision ?? calculateDocumentRevision(read.value),
      HUMAN_ACTOR
    )
    return this.finishMutation(project.root, project.value, mutation)
  }

  public async recalculateConfidence(
    manifestPath: string,
    claimId: string,
    baseRevision?: string
  ): Promise<Phase3MutationOutcome> {
    const project = await this.openProject(manifestPath)
    if (!project.value) return rejectedProjectOutcome(project.diagnostics, baseRevision)
    const source = await this.confidenceSource(project.root, project.value, claimId)
    if (!source.value) return rejectedProjectOutcome(source.diagnostics, baseRevision)
    const confidence = this.runtime.confidence.evaluate({
      ...source.value,
      manifest: project.value,
      calculatedAt: this.clock.now(),
    })
    const mutation = await this.runtime.claims.setConfidence(
      project.root,
      project.value,
      claimId,
      confidence,
      baseRevision ?? calculateDocumentRevision(source.value.claims),
      CONFIDENCE_ACTOR
    )
    return this.finishMutation(project.root, project.value, mutation)
  }

  public async compareContexts(
    manifestPath: string,
    claimId: string,
    dimensions: ContextDimension[]
  ): Promise<{ comparisons: ContextComparison[]; diagnostics: ProjectDiagnostic[] }> {
    const project = await this.openProject(manifestPath)
    if (!project.value) return { comparisons: [], diagnostics: project.diagnostics }
    const claims = await this.runtime.synthesis.readClaims(project.root, project.value)
    const claim = claims.value?.claims.find(item => item.claimId === claimId)
    if (!claim) return { comparisons: [], diagnostics: [...claims.diagnostics, missingClaim(claimId)] }
    const extractions = await readExtractions(
      this.runtime,
      project.root,
      project.value,
      new Set(claim.findingRefs.map(ref => ref.paperId))
    )
    return {
      comparisons: this.runtime.contextComparisons.compare(
        claim.findingRefs,
        extractions.values,
        dimensions
      ),
      diagnostics: [...claims.diagnostics, ...extractions.diagnostics],
    }
  }

  public async openLedger(manifestPath: string): Promise<ClaimLedgerOpenOutcome> {
    this.runtime.papers.resetInstrumentation()
    const project = await this.openProject(manifestPath)
    if (!project.value) {
      return { diagnostics: project.diagnostics, hydrationCount: 0 }
    }
    const opened = await this.runtime.claimLedger.open(project.root, project.value)
    return {
      ledger: opened.index,
      diagnostics: opened.diagnostics,
      hydrationCount: this.runtime.papers.instrumentation().count,
    }
  }

  public async hydrateClaim(
    manifestPath: string,
    claimId: string
  ): Promise<ClaimLedgerDetail | undefined> {
    const project = await this.openProject(manifestPath)
    return project.value
      ? this.runtime.claimLedger.hydrate(project.root, project.value, claimId)
      : undefined
  }

  public async reviewQueues(manifestPath: string) {
    const project = await this.openProject(manifestPath)
    if (!project.value) {
      return { claims: [], conflicts: [], appraisals: [], diagnostics: project.diagnostics }
    }
    const [claims, conflicts, appraisals] = await Promise.all([
      this.runtime.synthesis.readClaims(project.root, project.value),
      this.runtime.synthesis.readConflicts(project.root, project.value),
      this.runtime.synthesis.readAppraisals(project.root, project.value),
    ])
    return {
      claims: claims.value?.claims.filter(item =>
        item.reviewState.approval.researcher === 'not-reviewed') ?? [],
      conflicts: conflicts.value?.conflicts.filter(item =>
        item.reviewState.approval.researcher === 'not-reviewed') ?? [],
      appraisals: appraisals.value?.appraisals.filter(item =>
        item.reviewState.approval.researcher === 'not-reviewed') ?? [],
      diagnostics: [
        ...claims.diagnostics,
        ...conflicts.diagnostics,
        ...appraisals.diagnostics,
      ],
    }
  }

  public async sourceNavigation(manifestPath: string, evidenceId: string) {
    const project = await this.openProject(manifestPath)
    if (!project.value) return { diagnostics: project.diagnostics }
    return this.runtime.verification.sourceNavigation(
      project.root,
      project.value,
      evidenceId
    )
  }

  private async withClaims(
    manifestPath: string,
    baseRevision: string | undefined,
    operation: (
      root: string,
      manifest: ProjectManifest,
      revision: string
    ) => Promise<MutationResult>
  ): Promise<Phase3MutationOutcome> {
    const project = await this.openProject(manifestPath)
    if (!project.value) return rejectedProjectOutcome(project.diagnostics, baseRevision)
    const read = await this.runtime.synthesis.readClaims(project.root, project.value)
    if (!read.value) return rejectedProjectOutcome(read.diagnostics, baseRevision)
    const mutation = await operation(
      project.root,
      project.value,
      baseRevision ?? calculateDocumentRevision(read.value)
    )
    return this.finishMutation(project.root, project.value, mutation)
  }

  private async withConflicts(
    manifestPath: string,
    baseRevision: string | undefined,
    operation: (
      root: string,
      manifest: ProjectManifest,
      revision: string
    ) => Promise<MutationResult>
  ): Promise<Phase3MutationOutcome> {
    const project = await this.openProject(manifestPath)
    if (!project.value) return rejectedProjectOutcome(project.diagnostics, baseRevision)
    const read = await this.runtime.synthesis.readConflicts(project.root, project.value)
    if (!read.value) return rejectedProjectOutcome(read.diagnostics, baseRevision)
    const mutation = await operation(
      project.root,
      project.value,
      baseRevision ?? calculateDocumentRevision(read.value)
    )
    return this.finishMutation(project.root, project.value, mutation)
  }

  private async finishMutation(
    projectRoot: string,
    manifest: ProjectManifest,
    mutation: MutationResult
  ): Promise<Phase3MutationOutcome> {
    if (!mutation.accepted) {
      return { mutation, diagnostics: mutation.diagnostics ?? [] }
    }
    try {
      const ledger = await this.runtime.claimLedger.rebuild(projectRoot, manifest)
      return { mutation, diagnostics: ledger.diagnostics }
    } catch (error) {
      return {
        mutation,
        diagnostics: [ledgerRebuildFailed(error)],
      }
    }
  }

  private async openProject(manifestPath: string): Promise<{
    root: string
    value?: ProjectManifest
    diagnostics: ProjectDiagnostic[]
  }> {
    const opened = await this.runtime.registry.open(manifestPath)
    if (!opened.manifest) {
      return { root: path.dirname(manifestPath), diagnostics: opened.diagnostics }
    }
    const diagnostics = [
      ...opened.diagnostics,
      ...requirePhase3(opened.manifest, 'project.nodegraph.json'),
    ]
    return {
      root: path.dirname(manifestPath),
      ...(opened.manifest.schema.version === PROJECT_SCHEMA_VERSION
        ? { value: opened.manifest }
        : {}),
      diagnostics,
    }
  }

  private async confidenceSource(
    projectRoot: string,
    manifest: ProjectManifest,
    claimId: string
  ): Promise<{ value?: ConfidenceSource; diagnostics: ProjectDiagnostic[] }> {
    const [claims, conflicts, appraisals, evidence, taxonomy] = await Promise.all([
      this.runtime.synthesis.readClaims(projectRoot, manifest),
      this.runtime.synthesis.readConflicts(projectRoot, manifest),
      this.runtime.synthesis.readAppraisals(projectRoot, manifest),
      this.runtime.synthesis.readEvidence(projectRoot, manifest),
      this.runtime.synthesis.readTaxonomy(projectRoot, manifest),
    ])
    const claim = claims.value?.claims.find(item => item.claimId === claimId)
    if (!claim || !claims.value || !conflicts.value || !appraisals.value ||
      !evidence.value || !taxonomy.value) {
      return {
        diagnostics: [
          ...claims.diagnostics,
          ...conflicts.diagnostics,
          ...appraisals.diagnostics,
          ...evidence.diagnostics,
          ...taxonomy.diagnostics,
          ...(!claim ? [missingClaim(claimId)] : []),
        ],
      }
    }
    const extractions = await readExtractions(
      this.runtime,
      projectRoot,
      manifest,
      new Set(claim.findingRefs.map(ref => ref.paperId))
    )
    const sources = await readCurrentSourceHashes(
      this.runtime,
      projectRoot,
      manifest,
      new Set(claim.findingRefs.map(ref => ref.paperId))
    )
    return {
      value: {
        claims: claims.value,
        claim,
        conflicts: conflicts.value.conflicts.filter(item => item.claimId === claimId),
        appraisals: appraisals.value.appraisals,
        evidence: evidence.value.evidence,
        extractions: extractions.values,
        appraisalsRevision: calculateDocumentRevision(appraisals.value),
        conflictsRevision: calculateDocumentRevision(conflicts.value),
        taxonomyVersion: taxonomy.value.taxonomyVersion,
        currentSourceHashes: sources.values,
      },
      diagnostics: [...extractions.diagnostics, ...sources.diagnostics],
    }
  }
}

interface ConfidenceSource {
  claims: { claims: SynthesisClaim[]; modified: string; schema: { name: string; version: string } }
  claim: SynthesisClaim
  conflicts: ConflictRecord[]
  appraisals: EvidenceAppraisal[]
  evidence: Parameters<ProjectRuntime['confidence']['evaluate']>[0]['evidence']
  extractions: Map<string, ExtractionDocument>
  appraisalsRevision: string
  conflictsRevision: string
  taxonomyVersion: number
  currentSourceHashes: Record<string, string>
}

async function readExtractions(
  runtime: ProjectRuntime,
  projectRoot: string,
  manifest: ProjectManifest,
  paperIds: Set<string>
) {
  const registrations = manifest.papers.filter(item => paperIds.has(item.paperId))
  const reads = await Promise.all(registrations.map(async paper => ({
    paperId: paper.paperId,
    read: await runtime.synthesis.readExtraction(projectRoot, paper),
  })))
  return {
    values: new Map(reads.flatMap(item => item.read.value
      ? [[item.paperId, item.read.value] as const]
      : [])),
    diagnostics: reads.flatMap(item => item.read.diagnostics),
  }
}

async function readCurrentSourceHashes(
  runtime: ProjectRuntime,
  projectRoot: string,
  manifest: ProjectManifest,
  paperIds: Set<string>
) {
  const registrations = manifest.papers.filter(item => paperIds.has(item.paperId))
  const reads = await Promise.all(registrations.map(async paper => ({
    paperId: paper.paperId,
    result: await runtime.integrity.inspectSource(projectRoot, paper),
  })))
  return {
    values: Object.fromEntries(reads.flatMap(item => item.result.currentHash
      ? [[item.paperId, item.result.currentHash]]
      : [])),
    diagnostics: reads.flatMap(item => item.result.diagnostics),
  }
}

function rejectedProjectOutcome(
  diagnostics: ProjectDiagnostic[],
  baseRevision = 'absent'
): Phase3MutationOutcome {
  const mutation = phase3Rejected(
    'project.nodegraph.json',
    baseRevision,
    diagnostics
  )
  return { mutation, diagnostics }
}

function missingClaim(claimId: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'missing-claim-reference',
    file: 'synthesis claims',
    objectId: claimId,
    rule: 'The requested claim does not exist.',
    action: 'Refresh the claim ledger and choose an existing claim.',
  })
}

function ledgerRebuildFailed(error: unknown): ProjectDiagnostic {
  return diagnostic({
    layer: 'integrity',
    severity: 'warning',
    code: 'claim-ledger-rebuild-failed',
    file: 'indexes/claims.index.json',
    rule: `The authoritative mutation committed, but the derived ledger rebuild failed: ${errorMessage(error)}`,
    action: 'Reopen the claim ledger to rebuild it from authoritative records.',
  })
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
