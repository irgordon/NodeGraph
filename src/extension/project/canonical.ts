import { createHash } from 'crypto'
import { EvidenceRecord, JsonValue } from './types'

export function normalizeEvidenceText(value: string): string {
  return value
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .trim()
    .replace(/\s+/gu, ' ')
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortCanonicalValue(value))
}

export function calculateDocumentRevision(value: unknown): string {
  return hashUtf8(canonicalJson(value))
}

export function calculateQuoteContentHash(text: string): string {
  return hashUtf8(normalizeEvidenceText(text))
}

export function calculateEvidenceObjectHash(evidence: EvidenceRecord): string {
  return hashUtf8(canonicalJson(buildEvidenceProjection(evidence)))
}

export function calculateByteHash(value: Uint8Array): string {
  const digest = createHash('sha256').update(value).digest('hex')
  return `sha256:${digest}`
}

export function buildEvidenceProjection(evidence: EvidenceRecord): unknown {
  return {
    evidenceId: evidence.evidenceId,
    paperId: evidence.paperId,
    source: buildSourceProjection(evidence),
    quote: buildQuoteProjection(evidence),
    locator: buildLocatorProjection(evidence),
  }
}

function buildSourceProjection(evidence: EvidenceRecord): unknown {
  return {
    sourceId: evidence.source.sourceId,
    sourceDocumentHash: evidence.source.sourceDocumentHash,
  }
}

function buildQuoteProjection(evidence: EvidenceRecord): unknown {
  const text = normalizeEvidenceText(evidence.quote.text)
  return { text, quoteContentHash: calculateQuoteContentHash(text) }
}

function buildLocatorProjection(evidence: EvidenceRecord): unknown {
  const locator: Record<string, string | number> = {
    page: evidence.locator.page,
    exact: normalizeEvidenceText(evidence.locator.exact),
  }
  copyLocatorFields(locator, evidence, ['prefix', 'suffix', 'section'])
  return locator
}

function copyLocatorFields(
  target: Record<string, string | number>,
  evidence: EvidenceRecord,
  fields: Array<'prefix' | 'suffix' | 'section'>
): void {
  for (const field of fields) {
    const value = evidence.locator[field]
    if (value !== undefined) target[field] = normalizeEvidenceText(value)
  }
}

function sortCanonicalValue(value: unknown): JsonValue {
  if (Array.isArray(value)) return value.map(sortCanonicalValue)
  if (!isPlainObject(value)) return value as JsonValue
  return sortCanonicalObject(value)
}

function sortCanonicalObject(value: Record<string, unknown>): JsonValue {
  const result: Record<string, JsonValue> = {}
  for (const key of Object.keys(value).sort()) result[key] = sortCanonicalValue(value[key])
  return result
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}

function hashUtf8(value: string): string {
  const digest = createHash('sha256').update(value, 'utf8').digest('hex')
  return `sha256:${digest}`
}
