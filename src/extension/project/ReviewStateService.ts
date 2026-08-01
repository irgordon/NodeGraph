import {
  Actor,
  ClassificationVerification,
  InterpretationVerification,
  ProjectDiagnostic,
  ResearcherApproval,
  ReviewState,
  SourceVerification,
} from './types'
import { diagnostic } from './diagnostics'

export type VerificationDimension = keyof ReviewState['verification']
export type VerificationValue =
  | SourceVerification
  | InterpretationVerification
  | ClassificationVerification

export class ReviewStateService {
  public validateApprovalAuthority(
    before: unknown,
    after: unknown,
    actor: Actor,
    file: string
  ): ProjectDiagnostic[] {
    return [
      ...validateApprovalChanges(before, after, actor, file),
      ...validateVerificationChanges(before, after, actor, file),
      ...validateParadigmDecisionChanges(before, after, actor, file),
      ...validateAgentOrigins(before, after, actor, file),
    ]
  }

  public transitionVerification(
    state: ReviewState,
    dimension: VerificationDimension,
    value: VerificationValue,
    actor: Actor,
    file: string
  ): { value?: ReviewState; diagnostics: ProjectDiagnostic[] } {
    if (!canVerify(actor)) {
      return { diagnostics: [verificationAuthorityDiagnostic(file, dimension)] }
    }
    if (!isAllowedVerification(dimension, value)) {
      return { diagnostics: [invalidVerificationDiagnostic(file, dimension, value)] }
    }
    return {
      value: {
        ...state,
        verification: { ...state.verification, [dimension]: value },
      },
      diagnostics: [],
    }
  }

  public transitionResearcherApproval(
    state: ReviewState,
    value: ResearcherApproval,
    actor: Actor,
    file: string
  ): { value?: ReviewState; diagnostics: ProjectDiagnostic[] } {
    if (
      actor.type !== 'human' &&
      !(actor.type === 'service' && actor.id === 'ReviewStateService')
    ) {
      return { diagnostics: [approvalTransitionDiagnostic(file)] }
    }
    return {
      value: {
        ...state,
        approval: { ...state.approval, researcher: value },
      },
      diagnostics: [],
    }
  }
}

function validateApprovalChanges(
  before: unknown,
  after: unknown,
  actor: Actor,
  file: string
): ProjectDiagnostic[] {
  const changes = changedApprovals(before, after)
  if (!changes.length) return []
  if (actor.type === 'human') return []
  if (actor.type === 'service' && actor.id === 'ReviewStateService') return []
  if (actor.type === 'agent' && changes.every(change => isUnreviewed(change.after))) return []
  return [diagnostic({
    layer: 'structural',
    code: 'approval-authority-required',
    file,
    rule: 'Approval fields may only be changed by a human or ReviewStateService.',
    action: 'Submit the change for researcher review.',
  })]
}

function validateVerificationChanges(
  before: unknown,
  after: unknown,
  actor: Actor,
  file: string
): ProjectDiagnostic[] {
  const changes = changedVerifications(before, after)
  if (!changes.length || actor.type === 'human') return []
  if (actor.type === 'service' && actor.id === 'ReviewStateService') return []
  if (actor.type === 'agent' && changes.every(change => isPending(change.after))) {
    return []
  }
  return [verificationMutationAuthorityDiagnostic(file)]
}

function validateAgentOrigins(
  before: unknown,
  after: unknown,
  actor: Actor,
  file: string
): ProjectDiagnostic[] {
  if (actor.type !== 'agent') return []
  const changes = changedReviewStates(before, after)
  if (changes.every(change => isAiOrigin(change.after))) return []
  return [diagnostic({
    layer: 'structural',
    code: 'agent-origin-required',
    file,
    rule: 'Review state created or changed by an agent must retain AI origin.',
    action: 'Set reviewState.origin to ai and submit the record for researcher review.',
  })]
}

function validateParadigmDecisionChanges(
  before: unknown,
  after: unknown,
  actor: Actor,
  file: string
): ProjectDiagnostic[] {
  if (actor.type !== 'agent') return []
  const changes = changedParadigmDecisions(before, after)
  if (changes.every(change => !isResearcherParadigmDecision(change.after))) return []
  return [diagnostic({
    layer: 'structural',
    code: 'paradigm-decision-authority-required',
    file,
    rule: 'Only a researcher may approve or reject a cross-paradigm decision.',
    action: 'Keep the decision pending and submit it for researcher review.',
  })]
}

interface ApprovalChange {
  before: unknown
  after: unknown
}

function changedApprovals(before: unknown, after: unknown): ApprovalChange[] {
  const earlier = collectApprovals(before)
  const later = collectApprovals(after)
  const pointers = new Set([...Object.keys(earlier), ...Object.keys(later)])
  return [...pointers]
    .filter(pointer => JSON.stringify(earlier[pointer]) !== JSON.stringify(later[pointer]))
    .map(pointer => ({ before: earlier[pointer], after: later[pointer] }))
}

function collectApprovals(value: unknown, pointer = ''): Record<string, unknown> {
  const approvals: Record<string, unknown> = {}
  walkApprovals(value, pointer, approvals)
  return approvals
}

function changedVerifications(
  before: unknown,
  after: unknown
): ApprovalChange[] {
  const earlier = collectVerifications(before)
  const later = collectVerifications(after)
  const pointers = new Set([...Object.keys(earlier), ...Object.keys(later)])
  return [...pointers]
    .filter(pointer => JSON.stringify(earlier[pointer]) !== JSON.stringify(later[pointer]))
    .map(pointer => ({ before: earlier[pointer], after: later[pointer] }))
}

function collectVerifications(
  value: unknown,
  pointer = ''
): Record<string, unknown> {
  const verifications: Record<string, unknown> = {}
  walkVerifications(value, pointer, verifications)
  return verifications
}

function changedReviewStates(
  before: unknown,
  after: unknown
): ApprovalChange[] {
  const earlier = collectReviewStates(before)
  const later = collectReviewStates(after)
  const pointers = new Set([...Object.keys(earlier), ...Object.keys(later)])
  return [...pointers]
    .filter(pointer => JSON.stringify(earlier[pointer]) !== JSON.stringify(later[pointer]))
    .map(pointer => ({ before: earlier[pointer], after: later[pointer] }))
}

function collectReviewStates(
  value: unknown,
  pointer = ''
): Record<string, unknown> {
  const states: Record<string, unknown> = {}
  walkReviewStates(value, pointer, states)
  return states
}

function changedParadigmDecisions(
  before: unknown,
  after: unknown
): ApprovalChange[] {
  const earlier = collectParadigmDecisions(before)
  const later = collectParadigmDecisions(after)
  const pointers = new Set([...Object.keys(earlier), ...Object.keys(later)])
  return [...pointers]
    .filter(pointer => JSON.stringify(earlier[pointer]) !== JSON.stringify(later[pointer]))
    .map(pointer => ({ before: earlier[pointer], after: later[pointer] }))
}

function collectParadigmDecisions(
  value: unknown,
  pointer = ''
): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  walkParadigmDecisions(value, pointer, values)
  return values
}

function walkApprovals(
  value: unknown,
  pointer: string,
  approvals: Record<string, unknown>
): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkApprovals(item, `${pointer}/${index}`, approvals))
    return
  }
  if (!isObject(value)) return
  for (const [key, child] of Object.entries(value)) {
    if (key === 'approval') approvals[`${pointer}/approval`] = child
    else walkApprovals(child, `${pointer}/${key}`, approvals)
  }
}

function walkVerifications(
  value: unknown,
  pointer: string,
  verifications: Record<string, unknown>
): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      walkVerifications(item, `${pointer}/${index}`, verifications))
    return
  }
  if (!isObject(value)) return
  for (const [key, child] of Object.entries(value)) {
    if (key === 'verification') verifications[`${pointer}/verification`] = child
    else walkVerifications(child, `${pointer}/${key}`, verifications)
  }
}

function walkReviewStates(
  value: unknown,
  pointer: string,
  states: Record<string, unknown>
): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      walkReviewStates(item, `${pointer}/${index}`, states))
    return
  }
  if (!isObject(value)) return
  for (const [key, child] of Object.entries(value)) {
    if (key === 'reviewState') states[`${pointer}/reviewState`] = child
    else walkReviewStates(child, `${pointer}/${key}`, states)
  }
}

function walkParadigmDecisions(
  value: unknown,
  pointer: string,
  values: Record<string, unknown>
): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      walkParadigmDecisions(item, `${pointer}/${index}`, values))
    return
  }
  if (!isObject(value)) return
  for (const [key, child] of Object.entries(value)) {
    if (key === 'paradigmDecision') values[`${pointer}/paradigmDecision`] = child
    else walkParadigmDecisions(child, `${pointer}/${key}`, values)
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}

function isUnreviewed(value: unknown): boolean {
  if (!isObject(value)) return false
  return value.researcher === 'not-reviewed' && value.advisor === 'not-reviewed'
}

function isPending(value: unknown): boolean {
  if (!isObject(value)) return false
  return value.source === 'pending' &&
    value.interpretation === 'pending' &&
    value.classification === 'pending'
}

function isAiOrigin(value: unknown): boolean {
  return isObject(value) && value.origin === 'ai'
}

function isResearcherParadigmDecision(value: unknown): boolean {
  return isObject(value) && (value.status === 'approved' || value.status === 'rejected')
}

function canVerify(actor: Actor): boolean {
  return actor.type === 'human' ||
    (actor.type === 'service' && actor.id === 'ReviewStateService')
}

function isAllowedVerification(
  dimension: VerificationDimension,
  value: VerificationValue
): boolean {
  if (dimension === 'source') {
    return ['pending', 'verified', 'rejected', 'stale', 'not-applicable'].includes(value)
  }
  if (dimension === 'interpretation') {
    return ['pending', 'verified', 'rejected', 'not-applicable'].includes(value)
  }
  return ['pending', 'verified', 'disputed', 'not-applicable'].includes(value)
}

function verificationAuthorityDiagnostic(
  file: string,
  dimension: VerificationDimension
): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'verification-authority-required',
    file,
    objectId: dimension,
    rule: 'Only a researcher or ReviewStateService may confirm or dispute verification.',
    action: 'Submit the proposed state to the researcher verification queue.',
  })
}

function verificationMutationAuthorityDiagnostic(
  file: string
): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'verification-authority-required',
    file,
    rule: 'An agent may add pending review states but cannot confirm or dispute verification.',
    action: 'Submit the proposed state to the researcher verification queue.',
  })
}

function invalidVerificationDiagnostic(
  file: string,
  dimension: VerificationDimension,
  value: VerificationValue
): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'invalid-verification-transition',
    file,
    objectId: dimension,
    rule: `${value} is not valid for ${dimension} verification.`,
    action: 'Choose a documented state for the selected verification dimension.',
  })
}

function approvalTransitionDiagnostic(file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'approval-authority-required',
    file,
    rule: 'Only a researcher or ReviewStateService may change researcher approval.',
    action: 'Submit the proposal for researcher review.',
  })
}
