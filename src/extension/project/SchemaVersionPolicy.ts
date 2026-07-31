import { diagnostic } from './diagnostics'
import { PROJECT_SCHEMA_VERSION, ProjectDiagnostic } from './types'

export interface SchemaMode {
  mode: 'read-write' | 'read-only'
  diagnostics: ProjectDiagnostic[]
}

export function selectProjectSchemaMode(version: string, file: string): SchemaMode {
  if (version === PROJECT_SCHEMA_VERSION) return { mode: 'read-write', diagnostics: [] }
  return {
    mode: 'read-only',
    diagnostics: [unsupportedVersionDiagnostic(version, file)],
  }
}

export function inspectSupportedSchemaVersion(
  value: unknown,
  file: string
): ProjectDiagnostic[] {
  const version = schemaVersion(value)
  return version && version !== PROJECT_SCHEMA_VERSION
    ? selectProjectSchemaMode(version, file).diagnostics
    : []
}

function schemaVersion(value: unknown): string | undefined {
  if (!value || typeof value !== 'object' || !('schema' in value)) return undefined
  const schema = value.schema
  if (!schema || typeof schema !== 'object' || !('version' in schema)) return undefined
  return typeof schema.version === 'string' ? schema.version : undefined
}

function unsupportedVersionDiagnostic(version: string, file: string): ProjectDiagnostic {
  const newer = compareVersions(version, PROJECT_SCHEMA_VERSION) > 0
  return diagnostic({
    layer: 'syntactic',
    severity: 'warning',
    code: newer ? 'unsupported-newer-version' : 'unsupported-older-version',
    file,
    rule: `Persisted schema ${version} is not supported by this application.`,
    action: newer
      ? 'Open the project with a newer application version.'
      : 'Keep the project read-only until an explicit migration is available.',
  })
}

function compareVersions(left: string, right: string): number {
  const leftParts = left.split('.').map(Number)
  const rightParts = right.split('.').map(Number)
  for (let index = 0; index < 3; index++) {
    if (leftParts[index] !== rightParts[index]) return leftParts[index] - rightParts[index]
  }
  return 0
}
