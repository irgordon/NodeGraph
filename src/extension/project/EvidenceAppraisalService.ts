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
  EvidenceAppraisal,
  EvidenceAppraisalsDocument,
  MutationResult,
  PHASE3_DOCUMENT_SCHEMA_VERSION,
  ProjectDiagnostic,
  ProjectManifest,
  ResearcherApproval,
  systemClock,
} from './types'

export class EvidenceAppraisalService {
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
    const context = await this.context(projectRoot, manifest, baseRevision)
    if (!context.value) return context.rejection
    const target = appraisalTarget(manifest)
    const shape = this.validateProposal(proposal, target)
    if (shape.length) {
      return phase3Rejected(target, baseRevision, shape)
    }
    const appraisal = proposal as EvidenceAppraisal
    const diagnostics = proposalDiagnostics(appraisal, actor, target)
    if (diagnostics.length) return phase3Rejected(target, baseRevision, diagnostics)
    const candidate = structuredClone(context.value)
    const index = candidate.appraisals.findIndex(item => item.appraisalId === appraisal.appraisalId)
    if (index >= 0) candidate.appraisals[index] = structuredClone(appraisal)
    else candidate.appraisals.push(structuredClone(appraisal))
    candidate.modified = this.clock.now()
    return this.apply(projectRoot, manifest, candidate, baseRevision, actor,
      index >= 0 ? 'appraisal.proposal-replaced' : 'appraisal.proposed',
      appraisal.appraisalId)
  }

  private validateProposal(proposal: unknown, target: string): ProjectDiagnostic[] {
    return this.schemas.validate('evidence-appraisals.schema.json', {
      schema: { name: 'nodegraph-evidence-appraisals', version: PHASE3_DOCUMENT_SCHEMA_VERSION },
      appraisals: [proposal],
      modified: this.clock.now(),
    }, target)
  }

  public async review(
    projectRoot: string,
    manifest: ProjectManifest,
    appraisalId: string,
    decision: ResearcherApproval,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    const context = await this.context(projectRoot, manifest, baseRevision)
    if (!context.value) return context.rejection
    const target = appraisalTarget(manifest)
    if (actor.type !== 'human') {
      return phase3Rejected(target, baseRevision, [
        humanAuthorityDiagnostic(target, appraisalId, 'review an evidence appraisal'),
      ])
    }
    const candidate = structuredClone(context.value)
    const appraisal = candidate.appraisals.find(item => item.appraisalId === appraisalId)
    if (!appraisal) {
      return phase3Rejected(target, baseRevision, [
        missingAppraisal(appraisalId),
      ])
    }
    const transition = this.reviews.transitionResearcherApproval(
      appraisal.reviewState,
      decision,
      actor,
      target
    )
    if (!transition.value) {
      return phase3Rejected(target, baseRevision, transition.diagnostics)
    }
    appraisal.reviewState = transition.value
    appraisal.modified = this.clock.now()
    candidate.modified = this.clock.now()
    return this.apply(projectRoot, manifest, candidate, baseRevision, actor,
      `appraisal.${decision}`, appraisalId)
  }

  private async context(
    projectRoot: string,
    manifest: ProjectManifest,
    baseRevision: string
  ): Promise<{ value?: EvidenceAppraisalsDocument; rejection: MutationResult }> {
    const target = appraisalTarget(manifest)
    const diagnostics = requirePhase3(manifest, target)
    if (diagnostics.length) {
      return { rejection: phase3Rejected(target, baseRevision, diagnostics) }
    }
    const read = await this.synthesis.readAppraisals(projectRoot, manifest)
    return {
      value: read.value,
      rejection: phase3Rejected(target, baseRevision, read.diagnostics),
    }
  }

  private apply(
    projectRoot: string,
    manifest: ProjectManifest,
    candidate: EvidenceAppraisalsDocument,
    baseRevision: string,
    actor: Actor,
    action: string,
    objectId: string
  ): Promise<MutationResult> {
    return replacePhase3Document(
      this.synthesis,
      projectRoot,
      manifest,
      appraisalTarget(manifest),
      candidate,
      baseRevision,
      actor,
      this.clock.now(),
      action,
      objectId
    )
  }
}

function appraisalTarget(manifest: ProjectManifest): string {
  return manifest.documents.appraisals ?? 'synthesis/evidence-appraisals-v1.2.json'
}

function proposalDiagnostics(
  proposal: EvidenceAppraisal,
  actor: Actor,
  file: string
): ProjectDiagnostic[] {
  if (actor.type !== 'agent') return []
  if (
    proposal.reviewState.origin === 'ai' &&
    proposal.reviewState.approval.researcher === 'not-reviewed' &&
    proposal.reviewState.approval.advisor === 'not-reviewed'
  ) return []
  return [diagnostic({
    layer: 'structural',
    code: 'agent-proposal-state-required',
    file,
    objectId: proposal.appraisalId,
    rule: 'Agent-created appraisals must remain AI-origin proposals.',
    action: 'Set approval to not-reviewed and submit the appraisal for researcher review.',
  })]
}

function missingAppraisal(appraisalId: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'missing-appraisal-reference',
    file: 'evidence appraisals',
    objectId: appraisalId,
    rule: 'The requested evidence appraisal does not exist.',
    action: 'Refresh the appraisal queue and choose an existing record.',
  })
}
