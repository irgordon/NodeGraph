import { readFile } from 'fs/promises'
import { hasErrors } from './diagnostics'
import { inspectSupportedSchemaVersion } from './SchemaVersionPolicy'
import { SchemaValidator } from './SchemaValidator'
import { ProjectDiagnostic } from './types'

export interface DocumentReadResult<T> {
  value?: T
  diagnostics: ProjectDiagnostic[]
}

export async function readJsonDocument<T>(
  target: string,
  displayPath: string,
  schemaName: string,
  schemas: SchemaValidator
): Promise<DocumentReadResult<T>> {
  let text: string
  try {
    text = await readFile(target, 'utf8')
  } catch (error) {
    return { diagnostics: [readFailureDiagnostic(displayPath, error)] }
  }
  const parsed = schemas.parseJson(text, displayPath)
  if (!parsed.value) return { diagnostics: parsed.diagnostics }
  const diagnostics = [
    ...schemas.validate(schemaName, parsed.value, displayPath),
    ...inspectSupportedSchemaVersion(parsed.value, displayPath),
  ]
  return hasErrors(diagnostics)
    ? { diagnostics }
    : { value: parsed.value as T, diagnostics }
}

function readFailureDiagnostic(file: string, error: unknown): ProjectDiagnostic {
  const missing = isFileError(error, 'ENOENT')
  return {
    layer: 'syntactic',
    severity: 'error',
    code: missing ? 'missing-file' : 'inaccessible-file',
    file,
    rule: missing ? 'The registered file does not exist.' : 'The registered file cannot be read.',
    action: missing ? 'Restore the file or remove its registration.' : 'Check file permissions and retry.',
  }
}

export function isFileError(error: unknown, code: string): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === code
}
