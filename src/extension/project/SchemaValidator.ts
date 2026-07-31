import Ajv, { ErrorObject, ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
import { readFileSync, readdirSync } from 'fs'
import * as path from 'path'
import { diagnostic } from './diagnostics'
import { ProjectDiagnostic } from './types'

interface LoadedSchema {
  $id: string
  [key: string]: unknown
}

export class SchemaValidator {
  private readonly validators = new Map<string, ValidateFunction>()

  constructor(schemaRoot: string, legacySchemaPath: string) {
    const ajv = createAjv()
    const schemas = loadSynthesisSchemas(schemaRoot)
    for (const [, schema] of schemas) ajv.addSchema(schema)
    for (const [name, schema] of schemas) {
      this.validators.set(name, ajv.getSchema(schema.$id) ?? ajv.compile(schema))
    }
    const legacySchema = readJson(legacySchemaPath) as LoadedSchema
    this.validators.set('nodegraph.schema.json', ajv.compile(legacySchema))
  }

  public validate(schemaName: string, value: unknown, file: string): ProjectDiagnostic[] {
    const validate = this.validators.get(schemaName)
    if (!validate) return [missingSchemaDiagnostic(schemaName, file)]
    if (validate(value)) return []
    return (validate.errors ?? []).map(error => schemaErrorDiagnostic(file, error))
  }

  public parseJson(text: string, file: string): { value?: unknown; diagnostics: ProjectDiagnostic[] } {
    try {
      return { value: JSON.parse(text), diagnostics: [] }
    } catch (error) {
      return { diagnostics: [jsonParseDiagnostic(file, error)] }
    }
  }
}

function createAjv(): Ajv {
  const ajv = new Ajv({ allErrors: true, strict: false })
  addFormats(ajv)
  return ajv
}

function loadSynthesisSchemas(schemaRoot: string): Array<[string, LoadedSchema]> {
  return readdirSync(schemaRoot)
    .filter(name => name.endsWith('.schema.json'))
    .map(name => [name, readJson(path.join(schemaRoot, name)) as LoadedSchema])
}

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(file, 'utf8'))
}

function missingSchemaDiagnostic(schemaName: string, file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'syntactic',
    code: 'schema-not-found',
    file,
    rule: `Schema ${schemaName} is unavailable.`,
    action: 'Restore the application schema files and retry.',
  })
}

function schemaErrorDiagnostic(file: string, error: ErrorObject): ProjectDiagnostic {
  return diagnostic({
    layer: 'syntactic',
    code: `schema-${error.keyword}`,
    file,
    jsonPath: error.instancePath || '/',
    rule: error.message ?? 'The document does not match its schema.',
    action: actionForSchemaError(error),
  })
}

function actionForSchemaError(error: ErrorObject): string {
  if (error.keyword === 'required') return 'Add the required property shown in the diagnostic.'
  if (error.keyword === 'additionalProperties') return 'Remove the unsupported property.'
  return 'Correct the value to match the documented schema.'
}

function jsonParseDiagnostic(file: string, error: unknown): ProjectDiagnostic {
  return diagnostic({
    layer: 'syntactic',
    code: 'invalid-json',
    file,
    rule: error instanceof Error ? error.message : 'The file is not valid JSON.',
    action: 'Correct the JSON syntax without replacing the existing file.',
  })
}
