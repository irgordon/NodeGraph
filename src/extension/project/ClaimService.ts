import { diagnostic } from './diagnostics'
import { ReviewStateService } from './ReviewStateService'
import { SchemaValidator } from './SchemaValidator'
import { SynthesisRepository } from './SynthesisRepository'
import {
  humanAuthorityDiagnostic,
  phase3Rejected,
  replacePhase3Document,
  requirePhase3,
} from './phase3Support'
import {
  Actor,
  Clock,
  ConfidenceResult,
  FindingReference,
  FindingRelationship,
  MutationResult,
  ProjectManifest,
  ResearcherApproval,
  SynthesisClaim,
  SynthesisClaimsDocument,
  systemClock,
} from './types'

export class ClaimService {
  constructor(
    private readonly synthesis: SynthesisRepository,
    private readonly reviews: ReviewStateService,
    private readonly schemas: SchemaValidator,
    private readonly clock: Clock = systemClock
  ) {}

  public async propose(
    projectRoot: string,
    manifest: ProjectManifest,
    proposal: unknown,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    const shape = this.schemas.validate(
      'synthesis-claim-v1.2.schema.json', proposal, manifest.documents.claims
    )
    if (shape.length) return phase3Rejected(manifest.documents.claims, baseRevision, shape)
    const claim = proposal as SynthesisClaim
    const context = await this.claimsContext(projectRoot, manifest, baseRevision)
    if (!context.value) return context.rejection
    const diagnostics = validateProposalAuthority(claim, actor, manifest.documents.claims)
    if (diagnostics.length) return phase3Rejected(manifest.documents.claims, baseRevision, diagnostics)
    if (context.value.claims.some(item => item.claimId === claim.claimId)) {
      return phase3Rejected(manifest.documents.claims, baseRevision, [duplicateClaim(claim.claimId)])
    }
    const now = this.clock.now()
    const candidate: SynthesisClaimsDocument = {
      ...context.value,
      claims: [...context.value.claims, structuredClone(claim)],
      modified: now,
    }
    return this.apply(projectRoot, manifest, candidate, baseRevision, actor,
      'claim.proposed', claim.claimId)
  }

  public review(
    projectRoot: string,
    manifest: ProjectManifest,
    claimId: string,
    decision: ResearcherApproval,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    if (actor.type !== 'human') {
      return Promise.resolve(phase3Rejected(manifest.documents.claims, baseRevision, [
        humanAuthorityDiagnostic(manifest.documents.claims, claimId, 'review a claim'),
      ]))
    }
    return this.update(projectRoot, manifest, claimId, baseRevision, actor,
      `claim.${decision}`, claim => {
        const transition = this.reviews.transitionResearcherApproval(
          claim.reviewState,
          decision,
          actor,
          manifest.documents.claims
        )
        if (!transition.value) return transition.diagnostics
        claim.reviewState = transition.value
        return []
      })
  }

  public decideParadigm(
    projectRoot: string,
    manifest: ProjectManifest,
    claimId: string,
    status: 'approved' | 'rejected',
    rationale: string,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    if (actor.type !== 'human') {
      return Promise.resolve(phase3Rejected(manifest.documents.claims, baseRevision, [
        humanAuthorityDiagnostic(manifest.documents.claims, claimId, 'decide a cross-paradigm synthesis'),
      ]))
    }
    return this.update(projectRoot, manifest, claimId, baseRevision, actor,
      'claim.paradigm-decision', claim => {
        claim.paradigmDecision = {
          required: true,
          status,
          rationale,
          decidedBy: actor.id,
          decidedAt: this.clock.now(),
        }
        return []
      })
  }

  public changeRelationship(
    projectRoot: string,
    manifest: ProjectManifest,
    claimId: string,
    paperId: string,
    findingId: string,
    relationship: FindingRelationship,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    return this.update(projectRoot, manifest, claimId, baseRevision, actor,
      'claim.relationship-reclassified', claim => {
        const reference = claim.findingRefs.find(item =>
          item.paperId === paperId && item.findingId === findingId)
        if (!reference) return [missingFindingReference(claimId, findingId)]
        const authority = relationshipAuthority(claim, actor, manifest.documents.claims)
        if (authority.length) return authority
        reference.relationship = relationship
        return []
      }, { paperId, findingId, relationship })
  }

  public addRelationship(
    projectRoot: string,
    manifest: ProjectManifest,
    claimId: string,
    reference: FindingReference,
    evidenceIds: string[],
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    return this.update(projectRoot, manifest, claimId, baseRevision, actor,
      'claim.relationship-added', claim => {
        const authority = relationshipAuthority(claim, actor, manifest.documents.claims)
        if (authority.length) return authority
        if (claim.findingRefs.some(item => sameFinding(item, reference))) {
          return [duplicateFindingReference(claimId, reference.findingId)]
        }
        claim.findingRefs.push(structuredClone(reference))
        claim.evidenceRefs = [...new Set([...claim.evidenceRefs, ...evidenceIds])]
        return []
      }, { paperId: reference.paperId, findingId: reference.findingId })
  }

  public removeRelationship(
    projectRoot: string,
    manifest: ProjectManifest,
    claimId: string,
    paperId: string,
    findingId: string,
    evidenceIds: string[],
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    return this.update(projectRoot, manifest, claimId, baseRevision, actor,
      'claim.relationship-removed', claim => {
        const authority = relationshipAuthority(claim, actor, manifest.documents.claims)
        if (authority.length) return authority
        const index = claim.findingRefs.findIndex(item =>
          item.paperId === paperId && item.findingId === findingId)
        if (index < 0) return [missingFindingReference(claimId, findingId)]
        claim.findingRefs.splice(index, 1)
        claim.evidenceRefs = claim.evidenceRefs.filter(id => !evidenceIds.includes(id))
        return []
      }, { paperId, findingId, evidenceIds })
  }

  public setConfidence(
    projectRoot: string,
    manifest: ProjectManifest,
    claimId: string,
    confidence: ConfidenceResult,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    return this.update(projectRoot, manifest, claimId, baseRevision, actor,
      'claim.confidence-recalculated', claim => {
        claim.confidence = confidence
        return []
      }, { label: confidence.label, policyVersion: confidence.policyVersion })
  }

  private async update(
    projectRoot: string,
    manifest: ProjectManifest,
    claimId: string,
    baseRevision: string,
    actor: Actor,
    action: string,
    mutate: (claim: SynthesisClaim) => ReturnType<typeof requirePhase3>,
    metadata?: Record<string, unknown>
  ): Promise<MutationResult> {
    const context = await this.claimsContext(projectRoot, manifest, baseRevision)
    if (!context.value) return context.rejection
    const candidate = structuredClone(context.value)
    const claim = candidate.claims.find(item => item.claimId === claimId)
    if (!claim) {
      return phase3Rejected(manifest.documents.claims, baseRevision, [missingClaim(claimId)])
    }
    const diagnostics = mutate(claim)
    if (diagnostics.length) return phase3Rejected(manifest.documents.claims, baseRevision, diagnostics)
    claim.modified = this.clock.now()
    candidate.modified = this.clock.now()
    return this.apply(projectRoot, manifest, candidate, baseRevision, actor,
      action, claimId, metadata)
  }

  private async claimsContext(
    projectRoot: string,
    manifest: ProjectManifest,
    baseRevision: string
  ): Promise<{
    value?: SynthesisClaimsDocument
    rejection: MutationResult
  }> {
    const versionDiagnostics = requirePhase3(manifest, manifest.documents.claims)
    if (versionDiagnostics.length) {
      return {
        rejection: phase3Rejected(manifest.documents.claims, baseRevision, versionDiagnostics),
      }
    }
    const read = await this.synthesis.readClaims(projectRoot, manifest)
    return {
      value: read.value,
      rejection: phase3Rejected(manifest.documents.claims, baseRevision, read.diagnostics),
    }
  }

  private apply(
    projectRoot: string,
    manifest: ProjectManifest,
    candidate: SynthesisClaimsDocument,
    baseRevision: string,
    actor: Actor,
    action: string,
    objectId: string,
    metadata?: Record<string, unknown>
  ): Promise<MutationResult> {
    return replacePhase3Document(
      this.synthesis,
      projectRoot,
      manifest,
      manifest.documents.claims,
      candidate,
      baseRevision,
      actor,
      this.clock.now(),
      action,
      objectId,
      metadata
    )
  }
}

function validateProposalAuthority(
  proposal: SynthesisClaim,
  actor: Actor,
  file: string
) {
  if (actor.type !== 'agent') return []
  if (
    proposal.reviewState.origin === 'ai' &&
    proposal.reviewState.approval.researcher === 'not-reviewed' &&
    proposal.reviewState.approval.advisor === 'not-reviewed' &&
    !['approved', 'rejected'].includes(proposal.paradigmDecision.status)
  ) return []
  return [diagnostic({
    layer: 'structural',
    code: 'agent-proposal-state-required',
    file,
    objectId: proposal.claimId,
    rule: 'Agent-created claims must remain AI-origin proposals without researcher decisions.',
    action: 'Set all approval dimensions to not-reviewed and submit the claim for review.',
  })]
}

function duplicateClaim(claimId: string) {
  return diagnostic({
    layer: 'structural',
    code: 'duplicate-claim-id',
    file: 'synthesis claims',
    objectId: claimId,
    rule: 'Claim identifiers must be unique.',
    action: 'Assign a new stable claim identifier.',
  })
}

function missingClaim(claimId: string) {
  return diagnostic({
    layer: 'structural',
    code: 'missing-claim-reference',
    file: 'synthesis claims',
    objectId: claimId,
    rule: 'The requested claim does not exist.',
    action: 'Refresh the claim ledger and choose an existing claim.',
  })
}

function missingFindingReference(claimId: string, findingId: string) {
  return diagnostic({
    layer: 'structural',
    code: 'missing-finding-reference',
    file: 'synthesis claims',
    objectId: findingId,
    rule: `${findingId} is not part of ${claimId}.`,
    action: 'Choose a finding already referenced by the claim.',
  })
}

function duplicateFindingReference(claimId: string, findingId: string) {
  return diagnostic({
    layer: 'structural',
    code: 'duplicate-finding-reference',
    file: 'synthesis claims',
    objectId: findingId,
    rule: `${findingId} is already part of ${claimId}.`,
    action: 'Reclassify the existing relationship instead of adding a duplicate.',
  })
}

function relationshipAuthority(
  claim: SynthesisClaim,
  actor: Actor,
  file: string
) {
  if (actor.type !== 'agent' || claim.reviewState.approval.researcher !== 'approved') return []
  return [humanAuthorityDiagnostic(file, claim.claimId, 'change an approved claim relationship')]
}

function sameFinding(left: FindingReference, right: FindingReference): boolean {
  return left.paperId === right.paperId && left.findingId === right.findingId
}
