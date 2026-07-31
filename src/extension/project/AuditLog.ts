import { mkdir, open, readFile } from 'fs/promises'
import * as path from 'path'
import { randomUUID } from 'crypto'
import { diagnostic, hasErrors } from './diagnostics'
import { ProjectPathResolver } from './ProjectPathResolver'
import { SchemaValidator } from './SchemaValidator'
import {
  Actor,
  AuditEvent,
  Clock,
  ProjectDiagnostic,
  systemClock,
} from './types'

export interface AuditEventInput {
  actor: Actor
  action: string
  objectId: string
  beforeHash?: string
  afterHash?: string
  baseRevision?: string
  resultingRevision?: string
  metadata?: Record<string, unknown>
}

export class AuditLog {
  constructor(
    private readonly paths: ProjectPathResolver,
    private readonly schemas: SchemaValidator,
    private readonly clock: Clock = systemClock
  ) {}

  public async append(
    projectRoot: string,
    relativePath: string,
    input: AuditEventInput,
    allowCreate = false
  ): Promise<AuditEvent> {
    const target = await this.paths.resolve(projectRoot, relativePath)
    const event = buildAuditEvent(input, this.clock.now())
    const diagnostics = this.schemas.validate('audit-event.schema.json', event, relativePath)
    if (hasErrors(diagnostics)) throw new AuditLogError('invalid-audit-event', diagnostics)
    await assertAppendable(target, relativePath, allowCreate)
    await appendAndFlush(target, `${JSON.stringify(event)}\n`)
    return event
  }

  public async assertAppendable(
    projectRoot: string,
    relativePath: string,
    allowCreate = false
  ): Promise<void> {
    const target = await this.paths.resolve(projectRoot, relativePath)
    await assertAppendable(target, relativePath, allowCreate)
  }

  public async inspect(
    projectRoot: string,
    relativePath: string
  ): Promise<{ events: AuditEvent[]; diagnostics: ProjectDiagnostic[] }> {
    const target = await this.paths.resolve(projectRoot, relativePath)
    const read = await readOptionalText(target)
    if (read.missing) {
      return { events: [], diagnostics: [missingAuditDiagnostic(relativePath)] }
    }
    return parseAuditText(read.text, relativePath, this.schemas)
  }
}

export class AuditLogError extends Error {
  constructor(
    public readonly code: string,
    public readonly diagnostics: ProjectDiagnostic[] = []
  ) {
    super(code)
  }
}

function buildAuditEvent(input: AuditEventInput, timestamp: string): AuditEvent {
  return {
    eventId: `evt_${randomUUID().replace(/-/g, '')}`,
    timestamp,
    actor: input.actor,
    action: input.action,
    objectId: input.objectId,
    ...(input.beforeHash ? { beforeHash: input.beforeHash } : {}),
    ...(input.afterHash ? { afterHash: input.afterHash } : {}),
    ...(input.baseRevision ? { baseRevision: input.baseRevision } : {}),
    ...(input.resultingRevision ? { resultingRevision: input.resultingRevision } : {}),
    ...(input.metadata ? { metadata: input.metadata } : {}),
  }
}

async function assertAppendable(
  target: string,
  relativePath: string,
  allowCreate: boolean
): Promise<void> {
  const read = await readOptionalText(target)
  if (read.missing && !allowCreate) {
    throw new AuditLogError('missing-audit-log', [missingAuditDiagnostic(relativePath)])
  }
  if (read.text && !read.text.endsWith('\n')) {
    throw new AuditLogError('truncated-audit-final-line', [truncatedDiagnostic(relativePath)])
  }
}

async function appendAndFlush(target: string, line: string): Promise<void> {
  await mkdir(path.dirname(target), { recursive: true })
  const handle = await open(target, 'a')
  try {
    await handle.writeFile(line, 'utf8')
    await handle.sync()
  } finally {
    await handle.close()
  }
}

async function readOptionalText(
  target: string
): Promise<{ text: string; missing: boolean }> {
  try {
    return { text: await readFile(target, 'utf8'), missing: false }
  } catch (error) {
    if (isMissingFile(error)) return { text: '', missing: true }
    throw error
  }
}

function parseAuditText(
  text: string,
  relativePath: string,
  schemas: SchemaValidator
): { events: AuditEvent[]; diagnostics: ProjectDiagnostic[] } {
  const events: AuditEvent[] = []
  const diagnostics: ProjectDiagnostic[] = []
  const lines = text.split('\n')
  for (let index = 0; index < lines.length; index++) {
    if (!lines[index]) continue
    parseAuditLine(lines[index], index, lines.length, text, relativePath, schemas, events, diagnostics)
  }
  return { events, diagnostics }
}

function parseAuditLine(
  line: string,
  index: number,
  lineCount: number,
  text: string,
  file: string,
  schemas: SchemaValidator,
  events: AuditEvent[],
  diagnostics: ProjectDiagnostic[]
): void {
  const parsed = schemas.parseJson(line, file)
  if (!parsed.value) {
    diagnostics.push(index === lineCount - 1 && !text.endsWith('\n')
      ? truncatedDiagnostic(file)
      : parsed.diagnostics[0])
    return
  }
  const schemaDiagnostics = schemas.validate('audit-event.schema.json', parsed.value, file)
  diagnostics.push(...schemaDiagnostics)
  if (!hasErrors(schemaDiagnostics)) events.push(parsed.value as AuditEvent)
}

function truncatedDiagnostic(file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'syntactic',
    code: 'truncated-audit-final-line',
    file,
    severity: 'warning',
    rule: 'The audit log ends with an incomplete JSON line.',
    action: 'Preserve the line for inspection and repair it before appending new events.',
  })
}

function missingAuditDiagnostic(file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'integrity',
    code: 'missing-audit-log',
    file,
    rule: 'The project audit log is missing.',
    action: 'Restore the audit log before applying more project writes.',
  })
}

function isMissingFile(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
}
