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
  ConflictRecord,
  ConflictExplanation,
  ConflictsDocument,
  ConflictType,
  MutationResult,
  ProjectDiagnostic,
  ProjectManifest,
  PHASE3_DOCUMENT_SCHEMA_VERSION,
  ResearcherApproval,
  systemClock,
} from './types'

export class ConflictService {
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
    const shape = this.validateProposal(proposal, manifest)
    if (shape.length) return phase3Rejected(manifest.documents.conflicts, baseRevision, shape)
    const conflict = proposal as ConflictRecord
    const context = await this.context(projectRoot, manifest, baseRevision)
    if (!context.value) return context.rejection
    const diagnostics = proposalDiagnostics(conflict, actor, manifest.documents.conflicts)
    if (diagnostics.length) return phase3Rejected(manifest.documents.conflicts, baseRevision, diagnostics)
    if (context.value.conflicts.some(item => item.conflictId === conflict.conflictId)) {
      return phase3Rejected(manifest.documents.conflicts, baseRevision, [
        conflictDiagnostic('duplicate-conflict-id', conflict.conflictId),
      ])
    }
    const now = this.clock.now()
    const candidate: ConflictsDocument = {
      ...context.value,
      conflicts: [...context.value.conflicts, structuredClone(conflict)],
      modified: now,
    }
    return this.apply(projectRoot, manifest, candidate, baseRevision, actor,
      'conflict.proposed', conflict.conflictId)
  }

  private validateProposal(proposal: unknown, manifest: ProjectManifest): ProjectDiagnostic[] {
    return this.schemas.validate('conflicts-v1.2.schema.json', {
      schema: { name: 'nodegraph-conflicts', version: PHASE3_DOCUMENT_SCHEMA_VERSION },
      conflicts: [proposal],
      modified: this.clock.now(),
    }, manifest.documents.conflicts)
  }

  public reclassify(
    projectRoot: string,
    manifest: ProjectManifest,
    conflictId: string,
    conflictType: ConflictType,
    rationale: string,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    if (actor.type !== 'human') {
      return Promise.resolve(phase3Rejected(manifest.documents.conflicts, baseRevision, [
        humanAuthorityDiagnostic(manifest.documents.conflicts, conflictId, 'reclassify a conflict'),
      ]))
    }
    return this.update(projectRoot, manifest, conflictId, baseRevision, actor,
      'conflict.reclassified', conflict => {
        const previousConflictType = conflict.conflictType
        conflict.conflictType = conflictType
        conflict.classificationRationale = rationale
        return { diagnostics: [], metadata: { previousConflictType, conflictType } }
      })
  }

  public review(
    projectRoot: string,
    manifest: ProjectManifest,
    conflictId: string,
    decision: ResearcherApproval,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    if (actor.type !== 'human') {
      return Promise.resolve(phase3Rejected(manifest.documents.conflicts, baseRevision, [
        humanAuthorityDiagnostic(manifest.documents.conflicts, conflictId, 'review a conflict'),
      ]))
    }
    return this.update(projectRoot, manifest, conflictId, baseRevision, actor,
      `conflict.${decision}`, conflict => {
        const transition = this.reviews.transitionResearcherApproval(
          conflict.reviewState,
          decision,
          actor,
          manifest.documents.conflicts
        )
        if (!transition.value) return { diagnostics: transition.diagnostics }
        conflict.reviewState = transition.value
        return { diagnostics: [] }
      })
  }

  public replaceExplanations(
    projectRoot: string,
    manifest: ProjectManifest,
    conflictId: string,
    explanations: ConflictExplanation[],
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    return this.update(projectRoot, manifest, conflictId, baseRevision, actor,
      'conflict.explanations-changed', conflict => {
        const diagnostics = explanationDiagnostics(conflict, explanations, actor, manifest)
        if (diagnostics.length) return { diagnostics }
        conflict.possibleExplanations = structuredClone(explanations)
        return { diagnostics: [], metadata: { explanationCount: explanations.length } }
      })
  }

  private async update(
    projectRoot: string,
    manifest: ProjectManifest,
    conflictId: string,
    baseRevision: string,
    actor: Actor,
    action: string,
    mutate: (conflict: ConflictRecord) => {
      diagnostics: ProjectDiagnostic[]
      metadata?: Record<string, unknown>
    }
  ): Promise<MutationResult> {
    const context = await this.context(projectRoot, manifest, baseRevision)
    if (!context.value) return context.rejection
    const candidate = structuredClone(context.value)
    const conflict = candidate.conflicts.find(item => item.conflictId === conflictId)
    if (!conflict) {
      return phase3Rejected(manifest.documents.conflicts, baseRevision, [
        conflictDiagnostic('missing-conflict-reference', conflictId),
      ])
    }
    const changed = mutate(conflict)
    if (changed.diagnostics.length) {
      return phase3Rejected(manifest.documents.conflicts, baseRevision, changed.diagnostics)
    }
    conflict.modified = this.clock.now()
    candidate.modified = this.clock.now()
    return this.apply(projectRoot, manifest, candidate, baseRevision, actor,
      action, conflictId, changed.metadata)
  }

  private async context(
    projectRoot: string,
    manifest: ProjectManifest,
    baseRevision: string
  ): Promise<{ value?: ConflictsDocument; rejection: MutationResult }> {
    const diagnostics = requirePhase3(manifest, manifest.documents.conflicts)
    if (diagnostics.length) {
      return {
        rejection: phase3Rejected(manifest.documents.conflicts, baseRevision, diagnostics),
      }
    }
    const read = await this.synthesis.readConflicts(projectRoot, manifest)
    return {
      value: read.value,
      rejection: phase3Rejected(manifest.documents.conflicts, baseRevision, read.diagnostics),
    }
  }

  private apply(
    projectRoot: string,
    manifest: ProjectManifest,
    candidate: ConflictsDocument,
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
      manifest.documents.conflicts,
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

function proposalDiagnostics(
  proposal: ConflictRecord,
  actor: Actor,
  file: string
): ProjectDiagnostic[] {
  if (actor.type !== 'agent') return []
  const states = [proposal.reviewState, ...proposal.possibleExplanations.map(item => item.reviewState)]
  if (states.every(state =>
    state.origin === 'ai' && state.approval.researcher === 'not-reviewed')) return []
  return [diagnostic({
    layer: 'structural',
    code: 'agent-proposal-state-required',
    file,
    objectId: proposal.conflictId,
    rule: 'Agent-created conflicts and explanations must remain AI-origin proposals.',
    action: 'Reset researcher approval to not-reviewed and submit the conflict for review.',
  })]
}

function conflictDiagnostic(code: string, conflictId: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code,
    file: 'synthesis conflicts',
    objectId: conflictId,
    rule: `${conflictId} does not identify a unique conflict.`,
    action: 'Refresh the conflict list or assign a new stable identifier.',
  })
}

function explanationDiagnostics(
  conflict: ConflictRecord,
  explanations: ConflictExplanation[],
  actor: Actor,
  manifest: ProjectManifest
): ProjectDiagnostic[] {
  if (actor.type !== 'agent') return []
  if (conflict.reviewState.approval.researcher === 'approved') {
    return [humanAuthorityDiagnostic(
      manifest.documents.conflicts,
      conflict.conflictId,
      'change explanations on an approved conflict'
    )]
  }
  if (explanations.every(item =>
    item.reviewState.origin === 'ai' &&
    item.reviewState.approval.researcher === 'not-reviewed')) return []
  return [diagnostic({
    layer: 'structural',
    code: 'agent-explanation-proposal-required',
    file: manifest.documents.conflicts,
    objectId: conflict.conflictId,
    rule: 'Agent-created conflict explanations must remain AI-origin proposals.',
    action: 'Reset researcher approval to not-reviewed and submit the explanation for review.',
  })]
}
