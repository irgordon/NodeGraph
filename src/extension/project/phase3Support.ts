import { randomUUID } from 'crypto'
import { diagnostic } from './diagnostics'
import { SynthesisRepository } from './SynthesisRepository'
import {
  Actor,
  MutationResult,
  PROJECT_SCHEMA_VERSION,
  ProjectDiagnostic,
  ProjectManifest,
} from './types'

export function requirePhase3(
  manifest: ProjectManifest,
  targetDocument: string
): ProjectDiagnostic[] {
  return manifest.schema.version === PROJECT_SCHEMA_VERSION
    ? []
    : [diagnostic({
      layer: 'structural',
      code: 'phase3-migration-required',
      file: targetDocument,
      rule: `Phase 3 mutations require project schema ${PROJECT_SCHEMA_VERSION}.`,
      action: 'Run NodeGraph: Upgrade Project for Claims, then retry the operation.',
    })]
}

export function replacePhase3Document(
  synthesis: SynthesisRepository,
  projectRoot: string,
  manifest: ProjectManifest,
  targetDocument: string,
  candidate: unknown,
  baseRevision: string,
  actor: Actor,
  requestedAt: string,
  auditAction: string,
  objectId: string,
  metadata?: Record<string, unknown>
): Promise<MutationResult> {
  return synthesis.applyMutation(projectRoot, manifest, {
    mutationId: `mutation_${randomUUID().replace(/-/g, '')}`,
    targetDocument,
    baseRevision,
    operations: [{ op: 'replace', path: '', value: candidate }],
    requestedAt,
    actor,
  }, { action: auditAction, objectId, metadata })
}

export function phase3Rejected(
  targetDocument: string,
  baseRevision: string,
  diagnostics: ProjectDiagnostic[],
  code = 'phase3-operation-rejected'
): MutationResult {
  return {
    accepted: false,
    code,
    targetDocument,
    currentRevision: baseRevision,
    receivedBaseRevision: baseRevision,
    retryable: false,
    rejectedOperations: [],
    diagnostics,
  }
}

export function humanAuthorityDiagnostic(
  file: string,
  objectId: string,
  operation: string
): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'researcher-authority-required',
    file,
    objectId,
    rule: `Only a researcher may ${operation}.`,
    action: 'Submit the proposed analytical change for researcher review.',
  })
}
