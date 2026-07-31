'use strict'

const crypto = require('crypto')
const path = require('path')

function calculateQuoteContentHash(text) {
  return sha256(normalizeEvidenceText(text))
}

function calculateEvidenceObjectHash(evidence) {
  return sha256(canonicalJson(buildEvidenceHashProjection(evidence)))
}

function calculateDocumentRevision(document) {
  return sha256(canonicalJson(document))
}

function rebuildEvidenceIndex(evidenceDocument, indexedAt) {
  return {
    schema: { name: 'nodegraph-evidence-index', version: '1.0.0' },
    generatedAt: indexedAt,
    entries: evidenceDocument.evidence
      .map(evidence => buildEvidenceIndexEntry(evidence, indexedAt))
      .sort((left, right) => left.evidenceId.localeCompare(right.evidenceId)),
  }
}

function buildEvidenceHashProjection(evidence) {
  return {
    evidenceId: evidence.evidenceId,
    paperId: evidence.paperId,
    source: buildSourceProjection(evidence.source),
    quote: buildQuoteProjection(evidence.quote),
    locator: buildLocatorProjection(evidence.locator),
  }
}

function buildEvidenceIndexEntry(evidence, indexedAt) {
  return {
    evidenceId: evidence.evidenceId,
    paperId: evidence.paperId,
    ...(evidence.nodeId === undefined ? {} : { nodeId: evidence.nodeId }),
    evidenceObjectHash: evidence.evidenceObjectHash,
    quoteContentHash: evidence.quote.quoteContentHash,
    sourceDocumentHash: evidence.source.sourceDocumentHash,
    indexedAt,
  }
}

function resolveProjectPath(projectRoot, candidate) {
  assertProjectRelativeSyntax(candidate)
  const resolved = path.resolve(projectRoot, ...candidate.split('/'))
  assertContainedPath(projectRoot, resolved)
  return resolved
}

function evaluateMutation(currentRevision, mutation) {
  const expected = currentRevision ?? 'absent'
  if (mutation.baseRevision === expected) return { accepted: true }
  return buildStaleRevisionResponse(expected, mutation)
}

function authorizeApprovalTransition(actor, before, after) {
  if (!approvalChanged(before, after)) return { authorized: true }
  if (actor.type === 'human') return { authorized: true }
  if (isReviewStateService(actor)) return { authorized: true }
  return { authorized: false, code: 'approval-authority-required' }
}

function resolveConstructId(taxonomy, constructId) {
  const construct = findConstruct(taxonomy, constructId)
  if (construct.status === 'approved') return construct.constructId
  if (construct.status !== 'deprecated') throw contractError('construct-not-approved')
  return resolveDeprecatedConstruct(taxonomy, construct)
}

function selectSchemaMode(documentVersion, supportedVersions) {
  if (supportedVersions.includes(documentVersion)) return { mode: 'read-write' }
  const newest = [...supportedVersions].sort(compareVersions).at(-1)
  if (compareVersions(documentVersion, newest) > 0) {
    return { mode: 'read-only', code: 'unsupported-newer-version' }
  }
  return { mode: 'migration-required', code: 'unsupported-older-version' }
}

function normalizeEvidenceText(value) {
  return String(value)
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .trim()
    .replace(/\s+/gu, ' ')
}

function canonicalJson(value) {
  return JSON.stringify(sortCanonicalValue(value))
}

function buildSourceProjection(source) {
  return {
    sourceId: source.sourceId,
    sourceDocumentHash: source.sourceDocumentHash,
  }
}

function buildQuoteProjection(quote) {
  const text = normalizeEvidenceText(quote.text)
  return { text, quoteContentHash: calculateQuoteContentHash(text) }
}

function buildLocatorProjection(locator) {
  const projection = { page: locator.page, exact: normalizeEvidenceText(locator.exact) }
  copyNormalizedFields(projection, locator, ['prefix', 'suffix', 'section'])
  return projection
}

function copyNormalizedFields(target, source, fields) {
  for (const field of fields) {
    if (source[field] !== undefined) target[field] = normalizeEvidenceText(source[field])
  }
}

function sortCanonicalValue(value) {
  if (Array.isArray(value)) return value.map(sortCanonicalValue)
  if (!isPlainObject(value)) return value
  return sortCanonicalObject(value)
}

function sortCanonicalObject(value) {
  const result = {}
  for (const key of Object.keys(value).sort()) result[key] = sortCanonicalValue(value[key])
  return result
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object'
}

function sha256(value) {
  const digest = crypto.createHash('sha256').update(value, 'utf8').digest('hex')
  return `sha256:${digest}`
}

function assertProjectRelativeSyntax(candidate) {
  if (typeof candidate !== 'string' || candidate.length === 0) throw contractError('invalid-project-path')
  if (path.posix.isAbsolute(candidate) || path.win32.isAbsolute(candidate)) throw contractError('absolute-path')
  if (candidate.includes('\\') || candidate.includes('\0')) throw contractError('invalid-project-path')
  if (candidate.split('/').some(isUnsafeSegment)) throw contractError('path-traversal')
}

function isUnsafeSegment(segment) {
  return segment === '' || segment === '.' || segment === '..'
}

function assertContainedPath(projectRoot, resolved) {
  const relative = path.relative(path.resolve(projectRoot), resolved)
  if (relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) {
    throw contractError('path-outside-project')
  }
}

function buildStaleRevisionResponse(currentRevision, mutation) {
  return {
    accepted: false,
    code: 'stale-revision',
    targetDocument: mutation.targetDocument,
    currentRevision,
    receivedBaseRevision: mutation.baseRevision,
    retryable: true,
  }
}

function approvalChanged(before, after) {
  return before.researcher !== after.researcher || before.advisor !== after.advisor
}

function isReviewStateService(actor) {
  return actor.type === 'service' && actor.id === 'ReviewStateService'
}

function findConstruct(taxonomy, constructId) {
  const construct = taxonomy.constructs.find(item => item.constructId === constructId)
  if (!construct) throw contractError('construct-not-found')
  return construct
}

function resolveDeprecatedConstruct(taxonomy, construct) {
  if (!construct.primaryConstructId) throw contractError('missing-primary-construct')
  if (construct.primaryConstructId === construct.constructId) throw contractError('self-referential-primary')
  const primary = findConstruct(taxonomy, construct.primaryConstructId)
  if (primary.status !== 'approved') throw contractError('primary-construct-not-active')
  return primary.constructId
}

function compareVersions(left, right) {
  const leftParts = left.split('.').map(Number)
  const rightParts = right.split('.').map(Number)
  for (let index = 0; index < 3; index++) {
    if (leftParts[index] !== rightParts[index]) return leftParts[index] - rightParts[index]
  }
  return 0
}

function contractError(code) {
  const error = new Error(code)
  error.code = code
  return error
}

module.exports = {
  authorizeApprovalTransition,
  buildEvidenceHashProjection,
  calculateDocumentRevision,
  calculateEvidenceObjectHash,
  calculateQuoteContentHash,
  canonicalJson,
  evaluateMutation,
  normalizeEvidenceText,
  rebuildEvidenceIndex,
  resolveConstructId,
  resolveProjectPath,
  selectSchemaMode,
}
