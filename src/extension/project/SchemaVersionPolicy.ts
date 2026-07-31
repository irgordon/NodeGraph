import { diagnostic } from './diagnostics'
import {
  DOCUMENT_SCHEMA_VERSION,
  LEGACY_PROJECT_SCHEMA_VERSION,
  PAPER_INDEX_SCHEMA_VERSION,
  PROJECT_SCHEMA_VERSION,
  ProjectDiagnostic,
} from './types'

export interface SchemaMode {
  mode: 'read-write' | 'read-only'
  diagnostics: ProjectDiagnostic[]
}

export function selectProjectSchemaMode(version: string, file: string): SchemaMode {
  if (version === PROJECT_SCHEMA_VERSION) return { mode: 'read-write', diagnostics: [] }
  if (version === LEGACY_PROJECT_SCHEMA_VERSION) {
    return {
      mode: 'read-only',
      diagnostics: [migrationRequiredDiagnostic(file)],
    }
  }
  return {
    mode: 'read-only',
    diagnostics: [unsupportedVersionDiagnostic(version, file)],
  }
}

export function inspectSupportedSchemaVersion(
  value: unknown,
  file: string,
  schemaName: string
): ProjectDiagnostic[] {
  const version = schemaVersion(value)
  const supported = supportedVersion(schemaName)
  return version && version !== supported
    ? [unsupportedDocumentVersionDiagnostic(version, supported, file)]
    : []
}

export function projectSchemaName(version: string): string {
  return version === PROJECT_SCHEMA_VERSION
    ? 'project-v1.1.schema.json'
    : 'project.schema.json'
}

export function paperIndexSchemaName(version: string): string {
  return version === PROJECT_SCHEMA_VERSION
    ? 'paper-index-v1.1.schema.json'
    : 'paper-index.schema.json'
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

function migrationRequiredDiagnostic(file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'syntactic',
    severity: 'warning',
    code: 'migration-required',
    file,
    rule: `Project schema ${LEGACY_PROJECT_SCHEMA_VERSION} is preserved read-only.`,
    action: `Run the Phase 2 project migration to schema ${PROJECT_SCHEMA_VERSION}.`,
  })
}

function unsupportedDocumentVersionDiagnostic(
  version: string,
  supported: string,
  file: string
): ProjectDiagnostic {
  const newer = compareVersions(version, supported) > 0
  return diagnostic({
    layer: 'syntactic',
    severity: 'warning',
    code: newer ? 'unsupported-newer-version' : 'unsupported-older-version',
    file,
    rule: `Persisted schema ${version} is not supported for this document.`,
    action: newer
      ? 'Open the document with a newer application version.'
      : 'Keep the document read-only until an explicit migration is available.',
  })
}

function supportedVersion(schemaName: string): string {
  if (schemaName === 'project-v1.1.schema.json') return PROJECT_SCHEMA_VERSION
  if (schemaName === 'project.schema.json') return LEGACY_PROJECT_SCHEMA_VERSION
  if (schemaName === 'paper-index-v1.1.schema.json') return PAPER_INDEX_SCHEMA_VERSION
  return DOCUMENT_SCHEMA_VERSION
}

function compareVersions(left: string, right: string): number {
  const leftParts = left.split('.').map(Number)
  const rightParts = right.split('.').map(Number)
  for (let index = 0; index < 3; index++) {
    if (leftParts[index] !== rightParts[index]) return leftParts[index] - rightParts[index]
  }
  return 0
}
