#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const contracts = require('./contracts/runtime-contracts')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const SCHEMA_ROOT = path.join(PROJECT_ROOT, 'docs', 'schemas')
const FIXTURE_ROOT = path.join(SCHEMA_ROOT, 'fixtures')

const VALID_CASES = [
  ['project.schema.json', 'valid/project.nodegraph.json'],
  ['evidence.schema.json', 'valid/evidence.json'],
  ['evidence-records.schema.json', 'valid/evidence-records.json'],
  ['synthesis-claims.schema.json', 'valid/synthesis-claims.json'],
  ['conflicts.schema.json', 'valid/conflicts.json'],
  ['gaps.schema.json', 'valid/gaps.json'],
  ['research-questions.schema.json', 'valid/research-questions.json'],
  ['construct-taxonomy.schema.json', 'valid/construct-taxonomy.json'],
  ['paper-index.schema.json', 'valid/paper-index.json'],
  ['evidence-index.schema.json', 'valid/evidence-index.json'],
  ['audit-event.schema.json', 'valid/audit-event.json'],
  ['mutation-envelope.schema.json', 'valid/mutation-envelope.json'],
]

const INVALID_CASES = [
  ['project.schema.json', 'invalid/traversal-project.json'],
  ['evidence.schema.json', 'invalid/absolute-evidence.json'],
  ['construct-taxonomy.schema.json', 'invalid/deprecated-construct-without-primary.json'],
  ['synthesis-claim.schema.json', 'invalid/unsupported-relationship.json'],
  ['gaps.schema.json', 'invalid/approved-gap-without-adversarial-pass.json'],
  ['project.schema.json', 'invalid/missing-source-hash-project.json'],
  ['project.schema.json', 'invalid/malformed-source-hash-project.json'],
  ['project.schema.json', 'invalid/absolute-source-path-project.json'],
  ['project.schema.json', 'invalid/traversal-source-path-project.json'],
  ['paper-index.schema.json', 'invalid/malformed-paper-index-metadata.json'],
]

function main() {
  const context = createValidationContext()
  validateSchemaFixtures(context)
  validateLegacyGraphs(context)
  validateRuntimeContracts(context)
  reportSuccess()
}

function createValidationContext() {
  const ajv = createAjv()
  const schemas = loadSchemas()
  addSchemas(ajv, schemas)
  validateSchemaDefinitions(ajv, schemas)
  return { ajv, schemas }
}

function validateSchemaFixtures(context) {
  for (const contractCase of VALID_CASES) validateExpectedCase(context, contractCase, true)
  for (const contractCase of INVALID_CASES) validateExpectedCase(context, contractCase, false)
}

function validateLegacyGraphs(context) {
  const schema = readJson(path.join(PROJECT_ROOT, 'schema', 'nodegraph.schema.json'))
  const validate = context.ajv.compile(schema)
  for (const graphPath of findLegacyGraphs()) assertValid(validate, readJson(graphPath), graphPath)
}

function validateRuntimeContracts(context) {
  validatePathContainment()
  validateStaleRevision(context)
  validateCanonicalHash()
  validateCrossDocumentReferences()
  validateApprovalAuthority()
  validateTaxonomyResolution()
  validateInactiveTaxonomyResolution()
  validateUnsupportedVersionFallback()
  validateMissingAuthoritativeEvidence()
  validateEvidenceIndexRebuild(context)
}

function createAjv() {
  const ajv = new Ajv({ allErrors: true, strict: false })
  addFormats(ajv)
  return ajv
}

function loadSchemas() {
  return fs.readdirSync(SCHEMA_ROOT)
    .filter(name => name.endsWith('.schema.json'))
    .map(name => [name, readJson(path.join(SCHEMA_ROOT, name))])
}

function addSchemas(ajv, schemas) {
  for (const [, schema] of schemas) ajv.addSchema(schema)
}

function validateSchemaDefinitions(ajv, schemas) {
  for (const [name, schema] of schemas) {
    if (!ajv.validateSchema(schema)) fail(`${name} is not a valid draft-07 schema`, ajv.errors)
  }
}

function validateExpectedCase(context, contractCase, expected) {
  const [schemaName, fixtureName] = contractCase
  const schema = context.schemas.find(([name]) => name === schemaName)?.[1]
  if (!schema) fail(`Missing schema ${schemaName}`)
  const validate = context.ajv.getSchema(schema.$id)
  const fixture = readJson(path.join(FIXTURE_ROOT, fixtureName))
  const actual = validate(fixture)
  if (actual !== expected) fail(`${fixtureName} expected valid=${expected}`, validate.errors)
}

function validateInline(context, schemaName, value, label) {
  const schema = context.schemas.find(([name]) => name === schemaName)?.[1]
  const validate = context.ajv.getSchema(schema.$id)
  assertValid(validate, value, label)
}

function findLegacyGraphs() {
  const demoRoot = path.join(PROJECT_ROOT, 'demo')
  return walkFiles(demoRoot).filter(file => file.endsWith('.nodegraph.json'))
}

function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walkFiles(target) : [target]
  })
}

function validatePathContainment() {
  const project = readFixture('invalid/traversal-project.json')
  const evidence = readFixture('invalid/absolute-evidence.json')
  const absoluteSource = readFixture('invalid/absolute-source-path-project.json')
  const traversalSource = readFixture('invalid/traversal-source-path-project.json')
  assertThrowsCode(() => contracts.resolveProjectPath('/project', project.papers[0].path), 'path-traversal')
  assertThrowsCode(() => contracts.resolveProjectPath('/project', evidence.source.relativePath), 'absolute-path')
  assertThrowsCode(() => contracts.resolveProjectPath('/project', absoluteSource.papers[0].source.relativePath), 'absolute-path')
  assertThrowsCode(() => contracts.resolveProjectPath('/project', traversalSource.papers[0].source.relativePath), 'path-traversal')
}

function validateStaleRevision(context) {
  const fixture = readFixture('runtime/stale-revision.json')
  validateInline(context, 'mutation-envelope.schema.json', fixture.mutation, 'stale mutation envelope')
  const actual = contracts.evaluateMutation(fixture.currentRevision, fixture.mutation)
  assertSubset(actual, fixture.expected, 'stale revision response')
}

function validateCanonicalHash() {
  const fixture = readFixture('runtime/canonical-hash.json')
  const quoteHash = contracts.calculateQuoteContentHash(fixture.evidenceA.quote.text)
  const firstHash = contracts.calculateEvidenceObjectHash(fixture.evidenceA)
  const secondHash = contracts.calculateEvidenceObjectHash(fixture.evidenceB)
  assertEqual(quoteHash, fixture.expectedQuoteContentHash, 'quote content hash')
  assertEqual(firstHash, fixture.expectedEvidenceObjectHash, 'evidence object hash')
  assertEqual(firstHash, secondHash, 'immutable evidence projection')
}

function validateCrossDocumentReferences() {
  const bundle = loadValidBundle()
  assertEqual(validateReferences(bundle).length, 0, 'valid cross-document references')
  const fixture = readFixture('runtime/cross-document-reference.json')
  bundle.claims.claims[0].findingRefs[0].paperId = fixture.replacementPaperId
  assertIncludes(validateReferences(bundle), fixture.expectedCode, 'missing cross-document reference')
}

function validateApprovalAuthority() {
  const fixture = readFixture('runtime/approval-transition.json')
  const actual = contracts.authorizeApprovalTransition(fixture.actor, fixture.before, fixture.after)
  assertSubset(actual, fixture.expected, 'approval transition')
}

function validateTaxonomyResolution() {
  const taxonomy = readFixture('valid/construct-taxonomy.json')
  const resolved = contracts.resolveConstructId(taxonomy, 'construct_participative_leadership')
  assertEqual(resolved, 'construct_shared_leadership', 'deprecated construct resolution')
}

function validateInactiveTaxonomyResolution() {
  const fixture = readFixture('runtime/inactive-primary-construct.json')
  const resolve = () => contracts.resolveConstructId(fixture.taxonomy, fixture.constructId)
  assertThrowsCode(resolve, fixture.expectedCode)
}

function validateUnsupportedVersionFallback() {
  const fixture = readFixture('runtime/unsupported-version.json')
  const actual = contracts.selectSchemaMode(fixture.documentVersion, fixture.supportedVersions)
  assertSubset(actual, fixture.expected, 'unsupported schema fallback')
}

function validateMissingAuthoritativeEvidence() {
  const bundle = loadValidBundle()
  const fixture = readFixture('runtime/missing-authoritative-evidence.json')
  bundle.evidenceRecords.evidence = bundle.evidenceRecords.evidence
    .filter(evidence => evidence.evidenceId !== fixture.removedEvidenceId)
  assertIncludes(validateReferences(bundle), fixture.expectedCode, 'missing authoritative evidence')
}

function validateEvidenceIndexRebuild(context) {
  const evidenceRecords = readFixture('valid/evidence-records.json')
  const fixture = readFixture('runtime/evidence-index-rebuild.json')
  const rebuilt = contracts.rebuildEvidenceIndex(evidenceRecords, fixture.indexedAt)
  validateInline(context, 'evidence-index.schema.json', rebuilt, 'rebuilt evidence index')
  assertDeepEqual(rebuilt, fixture.expected, 'lossless evidence index rebuild')
}

function loadValidBundle() {
  return {
    project: readFixture('valid/project.nodegraph.json'),
    paperIndex: readFixture('valid/paper-index.json'),
    evidenceIndex: readFixture('valid/evidence-index.json'),
    evidenceRecords: readFixture('valid/evidence-records.json'),
    claims: readFixture('valid/synthesis-claims.json'),
    conflicts: readFixture('valid/conflicts.json'),
    gaps: readFixture('valid/gaps.json'),
    researchQuestions: readFixture('valid/research-questions.json'),
    taxonomy: readFixture('valid/construct-taxonomy.json'),
  }
}

function validateReferences(bundle) {
  const indexes = buildReferenceIndexes(bundle)
  return [
    ...validateClaimReferences(bundle.claims.claims, indexes),
    ...validateConflictReferences(bundle.conflicts.conflicts, indexes),
    ...validateGapReferences(bundle.gaps.gaps, indexes),
    ...validateQuestionReferences(bundle.researchQuestions.researchQuestions, indexes),
  ]
}

function buildReferenceIndexes(bundle) {
  return {
    papers: new Set(bundle.paperIndex.entries.map(entry => entry.paperId)),
    evidence: new Set(bundle.evidenceRecords.evidence.map(entry => entry.evidenceId)),
    claims: new Set(bundle.claims.claims.map(claim => claim.claimId)),
    gaps: new Set(bundle.gaps.gaps.map(gap => gap.gapId)),
    constructs: bundle.taxonomy,
  }
}

function validateClaimReferences(claims, indexes) {
  return claims.flatMap(claim => [
    ...claim.findingRefs.filter(ref => !indexes.papers.has(ref.paperId)).map(() => 'missing-paper-reference'),
    ...claim.evidenceRefs.filter(id => !indexes.evidence.has(id)).map(() => 'missing-evidence-reference'),
    ...(claim.constructRefs ?? []).flatMap(id => validateConstructReference(indexes.constructs, id)),
  ])
}

function validateConflictReferences(conflicts, indexes) {
  return conflicts.flatMap(conflict => [
    ...(!indexes.claims.has(conflict.claimId) ? ['missing-claim-reference'] : []),
    ...conflict.findingRefs.filter(ref => !indexes.papers.has(ref.paperId)).map(() => 'missing-paper-reference'),
  ])
}

function validateGapReferences(gaps, indexes) {
  return gaps.flatMap(gap => [
    ...gap.evidenceRefs.filter(id => !indexes.evidence.has(id)).map(() => 'missing-evidence-reference'),
    ...gap.adversarialPasses.filter(pass => pass.gapId !== gap.gapId).map(() => 'adversarial-gap-mismatch'),
  ])
}

function validateQuestionReferences(questions, indexes) {
  return questions.flatMap(question => [
    ...question.gapRefs.filter(id => !indexes.gaps.has(id)).map(() => 'missing-gap-reference'),
    ...question.claimRefs.filter(id => !indexes.claims.has(id)).map(() => 'missing-claim-reference'),
  ])
}

function validateConstructReference(taxonomy, constructId) {
  try {
    contracts.resolveConstructId(taxonomy, constructId)
    return []
  } catch (error) {
    return [error.code ?? 'invalid-construct-reference']
  }
}

function assertValid(validate, value, label) {
  if (!validate(value)) fail(`${label} failed legacy schema validation`, validate.errors)
}

function assertThrowsCode(action, expectedCode) {
  try {
    action()
  } catch (error) {
    if (error.code === expectedCode) return
    fail(`Expected ${expectedCode}, received ${error.code ?? error.message}`)
  }
  fail(`Expected ${expectedCode} to be thrown`)
}

function assertSubset(actual, expected, label) {
  for (const [key, value] of Object.entries(expected)) assertEqual(actual[key], value, `${label}.${key}`)
}

function assertIncludes(values, expected, label) {
  if (!values.includes(expected)) fail(`${label}: expected ${expected}, received ${values.join(', ')}`)
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) fail(`${label}: expected ${expected}, received ${actual}`)
}

function assertDeepEqual(actual, expected, label) {
  assertEqual(contracts.canonicalJson(actual), contracts.canonicalJson(expected), label)
}

function readFixture(relativePath) {
  return readJson(path.join(FIXTURE_ROOT, relativePath))
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function reportSuccess() {
  const legacyCount = findLegacyGraphs().length
  console.log(`Contract verification passed: ${VALID_CASES.length} valid, ${INVALID_CASES.length} invalid, ${legacyCount} legacy graphs, 10 runtime rules`)
}

function fail(message, details) {
  if (details) console.error(JSON.stringify(details, null, 2))
  throw new Error(message)
}

main()
