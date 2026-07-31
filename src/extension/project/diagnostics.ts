import { DiagnosticLayer, DiagnosticSeverity, ProjectDiagnostic } from './types'

export interface DiagnosticInput {
  layer: DiagnosticLayer
  code: string
  file: string
  rule: string
  action: string
  severity?: DiagnosticSeverity
  objectId?: string
  jsonPath?: string
}

export function diagnostic(input: DiagnosticInput): ProjectDiagnostic {
  return {
    layer: input.layer,
    severity: input.severity ?? 'error',
    code: input.code,
    file: input.file,
    rule: input.rule,
    action: input.action,
    ...(input.objectId ? { objectId: input.objectId } : {}),
    ...(input.jsonPath ? { jsonPath: input.jsonPath } : {}),
  }
}

export function hasErrors(diagnostics: ProjectDiagnostic[]): boolean {
  return diagnostics.some(item => item.severity === 'error')
}
