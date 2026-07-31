import { Actor, ProjectDiagnostic } from './types'
import { diagnostic } from './diagnostics'

export class ReviewStateService {
  public validateApprovalAuthority(
    before: unknown,
    after: unknown,
    actor: Actor,
    file: string
  ): ProjectDiagnostic[] {
    if (!approvalChanged(before, after)) return []
    if (actor.type === 'human') return []
    if (actor.type === 'service' && actor.id === 'ReviewStateService') return []
    return [diagnostic({
      layer: 'structural',
      code: 'approval-authority-required',
      file,
      rule: 'Approval fields may only be changed by a human or ReviewStateService.',
      action: 'Submit the change for researcher review.',
    })]
  }
}

function approvalChanged(before: unknown, after: unknown): boolean {
  return JSON.stringify(collectApprovals(before)) !== JSON.stringify(collectApprovals(after))
}

function collectApprovals(value: unknown, pointer = ''): Record<string, unknown> {
  const approvals: Record<string, unknown> = {}
  walkApprovals(value, pointer, approvals)
  return approvals
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

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}
