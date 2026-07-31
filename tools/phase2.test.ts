import test, { TestContext } from 'node:test'
import assert from 'node:assert/strict'
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  unlink,
  writeFile,
} from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
import { AtomicJsonWriter } from '../src/extension/project/AtomicJsonWriter'
import {
  calculateByteHash,
  calculateDocumentRevision,
  calculateEvidenceObjectHash,
  calculateQuoteContentHash,
} from '../src/extension/project/canonical'
import {
  createEmptyExtraction,
  pendingReviewState,
} from '../src/extension/project/extractionDefaults'
import { Phase1ProjectService } from '../src/extension/project/Phase1ProjectService'
import { Phase2ProjectService } from '../src/extension/project/Phase2ProjectService'
import {
  createProjectRuntime,
  ProjectRuntime,
} from '../src/extension/project/ProjectRuntime'
import {
  Actor,
  Clock,
  ConstructTaxonomyDocument,
  EvidenceRecord,
  ExtractionDocument,
  PaperRegistration,
  ProjectManifest,
  ReviewState,
} from '../src/extension/project/types'
import { NodeGraph } from '../src/webview/types/graph'

const REPOSITORY_ROOT = process.cwd()
const MANIFEST_NAME = 'project.nodegraph.json'
const FIXED_TIME = '2026-07-30T16:00:00.000Z'
const HUMAN: Actor = { type: 'human', id: 'researcher' }
const AGENT: Actor = { type: 'agent', id: 'extractor', version: '0.0.0' }

interface ProjectContext {
  root: string
  manifestPath: string
  runtime: ProjectRuntime
  phase1: Phase1ProjectService
  phase2: Phase2ProjectService
}

class FixedClock implements Clock {
  public now(): string {
    return FIXED_TIME
  }
}

test('standardized extraction validates and preserves source language', async () => {
  const runtime = createRuntime()
  const extraction = await validExtractionFixture()
  const diagnostics = runtime.schemas.validate(
    'extraction.schema.json',
    extraction,
    'extractions/paper-001.json'
  )
  assert.equal(diagnostics.length, 0)
  assert.equal(
    extraction.fields.researchProblem.sourceText,
    'The study asks how shared leadership shapes trust.'
  )
  assert.equal(
    extraction.fields.researchProblem.normalizedValue,
    'Relationship between shared leadership and trust'
  )
})

test('reporting states keep unreported distinct from absence', async () => {
  const extraction = await validExtractionFixture()
  assert.equal(extraction.fields.purpose.reportingStatus, 'not-reported')
  assert.equal(
    extraction.fields.researchQuestionsOrHypotheses.reportingStatus,
    'absent'
  )
  assert.notEqual(
    extraction.fields.purpose.reportingStatus,
    extraction.fields.researchQuestionsOrHypotheses.reportingStatus
  )
})

test('invalid extraction fields produce actionable diagnostics', async t => {
  const context = await synthesisProject(t)
  const before = await extractionBytes(context, 'paper_001')
  const proposal: any = await agentExtraction(context)
  delete proposal.fields.population
  const outcome = await context.phase2.importExtraction(
    context.manifestPath,
    proposal,
    AGENT
  )
  const item = outcome.diagnostics.find(
    diagnostic => diagnostic.code === 'schema-required'
  )
  assert.equal(outcome.mutation.accepted, false)
  assert.ok(item)
  assert.match(item.action, /required property/i)
  assert.deepEqual(await extractionBytes(context, 'paper_001'), before)
})

test('agent extraction imports as a pending proposal', async t => {
  const context = await synthesisProject(t)
  const proposal = await agentExtraction(context)
  const outcome = await context.phase2.importExtraction(
    context.manifestPath,
    proposal,
    AGENT
  )
  assert.equal(outcome.mutation.accepted, true)
  const persisted = await readExtraction(context, 'paper_001')
  assert.equal(persisted.extractionStatus, 'proposed')
  assert.equal(persisted.reviewState.origin, 'ai')
  assert.deepEqual(
    persisted.fields.findings.items?.[0].reviewState.verification,
    { source: 'pending', interpretation: 'pending', classification: 'pending' }
  )
})

test('agent extraction cannot label nested classifications as human', async t => {
  const context = await synthesisProject(t)
  const proposal = await agentExtraction(context)
  proposal.constructMappings[0].reviewState.origin = 'human'
  const outcome = await context.phase2.importExtraction(
    context.manifestPath,
    proposal,
    AGENT
  )
  assert.equal(outcome.mutation.accepted, false)
  assert.ok(outcome.diagnostics.some(item =>
    item.code === 'agent-proposal-origin-required'
  ))
})

test('agent approval and verification attempts are rejected', async t => {
  const context = await synthesisProject(t)
  const before = await extractionBytes(context, 'paper_001')
  const proposal = await agentExtraction(context)
  proposal.constructMappings[0].mappingStatus = 'approved'
  proposal.constructMappings[0].reviewState.approval.researcher = 'approved'
  proposal.fields.findings.items![0].reviewState.verification.interpretation =
    'verified'
  const outcome = await context.phase2.importExtraction(
    context.manifestPath,
    proposal,
    AGENT
  )
  assert.equal(outcome.mutation.accepted, false)
  assert.ok(outcome.diagnostics.some(item =>
    item.code === 'approval-authority-required' ||
    item.code === 'verification-authority-required'
  ))
  assert.deepEqual(await extractionBytes(context, 'paper_001'), before)
})

test('evidence-bearing findings resolve to authoritative evidence', async t => {
  const context = await synthesisProject(t)
  await installApprovedExtraction(context)
  const manifest = await readManifest(context)
  const registration = manifest.papers[0]
  const extraction = await readExtraction(context, registration.paperId)
  const diagnostics = await context.runtime.synthesis.validateExtraction(
    context.root,
    manifest,
    registration,
    extraction
  )
  assert.equal(diagnostics.length, 0)
})

test('agent-created evidence stays pending and marked as AI', async t => {
  const context = await synthesisProject(t)
  const manifest = await readManifest(context)
  const evidence = await context.runtime.synthesis.readEvidence(
    context.root,
    manifest
  )
  assert.ok(evidence.value)
  const candidate = structuredClone(evidence.value)
  const record = structuredClone(candidate.evidence[0])
  record.evidenceId = 'evidence_002'
  record.reviewState = pendingReviewState('human')
  record.evidenceObjectHash = calculateEvidenceObjectHash(record)
  candidate.evidence.push(record)
  const envelope = {
    mutationId: 'mutation_agent_evidence',
    targetDocument: manifest.documents.evidence,
    baseRevision: calculateDocumentRevision(evidence.value),
    operations: [{ op: 'replace' as const, path: '', value: candidate }],
    requestedAt: FIXED_TIME,
    actor: AGENT,
  }
  const rejected = await context.runtime.synthesis.applyMutation(
    context.root,
    manifest,
    envelope
  )
  assert.equal(rejected.accepted, false)
  assert.ok(rejected.diagnostics?.some(item =>
    item.code === 'agent-origin-required'
  ))

  record.reviewState = pendingReviewState('ai')
  const accepted = await context.runtime.synthesis.applyMutation(
    context.root,
    manifest,
    envelope
  )
  assert.equal(accepted.accepted, true)
  const persisted = await context.runtime.synthesis.readEvidence(
    context.root,
    manifest
  )
  const added = persisted.value?.evidence.find(item =>
    item.evidenceId === 'evidence_002'
  )
  assert.equal(added?.reviewState.origin, 'ai')
  assert.equal(added?.reviewState.verification.source, 'pending')
})

test('missing evidence remains visible and blocks a replacement index', async t => {
  const context = await synthesisProject(t)
  await installApprovedExtraction(context)
  const manifest = await readManifest(context)
  const evidencePath = path.join(context.root, manifest.documents.evidence)
  await writeJson(evidencePath, {
    schema: { name: 'nodegraph-evidence-records', version: '1.0.0' },
    evidence: [],
    modified: FIXED_TIME,
  })
  const result = await context.runtime.indexes.rebuild(
    context.root,
    manifest,
    true
  )
  assert.ok(result.diagnostics.some(item =>
    item.code === 'missing-evidence-reference'
  ))
})

test('stale evidence remains visible in matrix state', async t => {
  const context = await synthesisProject(t)
  await installApprovedExtraction(context)
  const manifest = await readManifest(context)
  await writeFile(
    path.join(context.root, manifest.papers[0].source.relativePath),
    'replacement PDF'
  )
  const rebuilt = await context.runtime.indexes.rebuild(
    context.root,
    manifest,
    true
  )
  assert.equal(rebuilt.paperIndex.entries[0].staleness?.evidence, true)
  assert.ok(rebuilt.diagnostics.some(item => item.code.includes('source')))
})

test('partial rebuild does not reuse a source-stale matrix entry', async t => {
  const context = await synthesisProject(t)
  await installApprovedExtraction(context)
  const manifest = await readManifest(context)
  await writeFile(
    path.join(context.root, manifest.papers[0].source.relativePath),
    'replacement PDF'
  )
  const rebuilt = await context.runtime.indexes.rebuild(context.root, manifest)
  assert.deepEqual(rebuilt.processedPaperIds, ['paper_001'])
  assert.deepEqual(rebuilt.reusedPaperIds, [])
  assert.equal(rebuilt.paperIndex.entries[0].staleness?.evidence, true)
})

test('verification dimensions transition independently', async t => {
  const context = await synthesisProject(t)
  await importAgentExtraction(context)
  let outcome = await context.phase2.verifySource(
    context.manifestPath,
    'evidence_001',
    'verified'
  )
  assert.equal(outcome.mutation.accepted, true)
  let extraction = await readExtraction(context, 'paper_001')
  let finding = extraction.fields.findings.items![0]
  assert.equal(finding.reviewState.verification.interpretation, 'pending')
  assert.equal(finding.reviewState.verification.classification, 'pending')

  outcome = await context.phase2.verifyFinding(
    context.manifestPath,
    'paper_001',
    finding.findingId,
    'interpretation',
    'verified'
  )
  assert.equal(outcome.mutation.accepted, true)
  extraction = await readExtraction(context, 'paper_001')
  finding = extraction.fields.findings.items![0]
  assert.equal(finding.reviewState.verification.interpretation, 'verified')
  assert.equal(finding.reviewState.verification.classification, 'pending')

  outcome = await context.phase2.verifyFinding(
    context.manifestPath,
    'paper_001',
    finding.findingId,
    'classification',
    'disputed'
  )
  assert.equal(outcome.mutation.accepted, true)
  extraction = await readExtraction(context, 'paper_001')
  finding = extraction.fields.findings.items![0]
  assert.equal(finding.reviewState.verification.interpretation, 'verified')
  assert.equal(finding.reviewState.verification.classification, 'disputed')
})

test('unapproved constructs cannot enter approved mappings', async t => {
  const context = await synthesisProject(t)
  const manifest = await readManifest(context)
  await writeTaxonomy(context, [
    constructRecord('construct_pending', 'Pending construct', 'proposed'),
  ])
  const proposal = await approvedExtraction(context)
  proposal.constructMappings[0].constructId = 'construct_pending'
  const before = await extractionBytes(context, 'paper_001')
  const outcome = await context.phase2.importExtraction(
    context.manifestPath,
    proposal,
    HUMAN
  )
  assert.equal(outcome.mutation.accepted, false)
  assert.ok(outcome.diagnostics.some(item =>
    item.code === 'construct-not-approved'
  ))
  assert.deepEqual(await extractionBytes(context, 'paper_001'), before)
  assert.equal(manifest.schema.version, '1.1.0')
})

test('pending construct mappings remain visible in the matrix', async t => {
  const context = await synthesisProject(t)
  await importAgentExtraction(context)
  const opened = await context.phase2.openMatrix(context.manifestPath)
  assert.ok(opened.matrix?.constructs.some(
    construct => construct.constructId === '__pending__'
  ))
  const cell = opened.matrix?.cells.find(item =>
    item.constructId === '__pending__'
  )
  assert.equal(cell?.state, 'pending')
})

test('mapping approval and classification verification remain independent', async t => {
  const context = await synthesisProject(t)
  await importAgentExtraction(context)
  const mappingId = (await readExtraction(
    context,
    'paper_001'
  )).constructMappings[0].mappingId
  let outcome = await context.phase2.reviewMapping(
    context.manifestPath,
    'paper_001',
    mappingId,
    'approved'
  )
  assert.equal(outcome.mutation.accepted, true)
  let mapping = (await readExtraction(
    context,
    'paper_001'
  )).constructMappings[0]
  assert.equal(mapping.mappingStatus, 'approved')
  assert.equal(mapping.reviewState.approval.researcher, 'approved')
  assert.equal(mapping.reviewState.verification.classification, 'pending')

  outcome = await context.phase2.verifyMappingClassification(
    context.manifestPath,
    'paper_001',
    mappingId,
    'disputed'
  )
  assert.equal(outcome.mutation.accepted, true)
  mapping = (await readExtraction(context, 'paper_001')).constructMappings[0]
  assert.equal(mapping.reviewState.approval.researcher, 'approved')
  assert.equal(mapping.reviewState.verification.classification, 'disputed')
})

test('construct merge preserves aliases and historical references', async t => {
  const context = await synthesisProject(t)
  const historical = constructRecord(
    'construct_historical',
    'Historical term',
    'approved'
  )
  historical.aliases = ['historical term', 'Related term']
  await writeTaxonomy(context, [
    constructRecord('construct_primary', 'Primary construct', 'approved'),
    historical,
  ])
  const extraction = await approvedExtraction(context)
  extraction.constructMappings[0].constructId = 'construct_historical'
  await writeExtraction(context, extraction)
  const manifest = await readManifest(context)
  const taxonomy = await readTaxonomy(context)
  const result = await context.runtime.taxonomy.mergeConstructs(
    context.root,
    manifest,
    'construct_historical',
    'construct_primary',
    calculateDocumentRevision(taxonomy),
    HUMAN
  )
  assert.equal(result.accepted, true)
  const reopenedRuntime = createRuntime()
  const reopened = await new Phase1ProjectService(reopenedRuntime)
    .open(context.manifestPath)
  assert.equal(reopened.mode, 'read-write')
  assert.ok(reopened.manifest)
  const taxonomyRead = await reopenedRuntime.synthesis.readTaxonomy(
    context.root,
    reopened.manifest!
  )
  assert.ok(taxonomyRead.value)
  const merged = taxonomyRead.value!
  const primary = merged.constructs.find(item =>
    item.constructId === 'construct_primary'
  )
  const deprecated = merged.constructs.find(item =>
    item.constructId === 'construct_historical'
  )
  assert.equal(primary?.status, 'approved')
  assert.equal(primary?.canonicalName, 'Primary construct')
  assert.deepEqual(primary?.aliases, ['Historical term', 'Related term'])
  assert.ok(!primary?.aliases.includes('construct_historical'))
  assert.equal(deprecated?.status, 'deprecated')
  assert.equal(deprecated?.primaryConstructId, 'construct_primary')
  assert.equal(merged.taxonomyVersion, taxonomy.taxonomyVersion + 1)
  assert.equal(
    reopenedRuntime.taxonomy.resolveCanonicalId(
      merged,
      'construct_historical',
      manifest.documents.constructs
    ).constructId,
    'construct_primary'
  )
  assert.equal(
    reopenedRuntime.taxonomy.resolveAlias(
      merged,
      ' historical TERM ',
      manifest.documents.constructs
    ).constructId,
    'construct_primary'
  )
  assert.equal(
    (await readExtraction(context, 'paper_001')).constructMappings[0].constructId,
    'construct_historical'
  )
  const audit = await reopenedRuntime.audit.inspect(
    context.root,
    manifest.documents.auditLog
  )
  const event = audit.events.find(item => item.action === 'taxonomy.construct-merged')
  assert.equal(event?.metadata?.deprecatedConstructId, 'construct_historical')
  assert.equal(event?.metadata?.primaryConstructId, 'construct_primary')
})

test('construct merge rejects inactive sources, cycles, and self-merges', async t => {
  const context = await synthesisProject(t)
  const rejected = constructRecord('construct_rejected', 'Rejected', 'proposed')
  rejected.reviewState.approval.researcher = 'rejected'
  await writeTaxonomy(context, [
    constructRecord('construct_primary', 'Primary', 'approved'),
    constructRecord('construct_secondary', 'Secondary', 'approved'),
    constructRecord('construct_other', 'Other', 'approved'),
    constructRecord('construct_pending', 'Pending', 'proposed'),
    rejected,
  ])
  const manifest = await readManifest(context)
  let taxonomy = await readTaxonomy(context)
  const merge = (sourceId: string, primaryId: string) =>
    context.runtime.taxonomy.mergeConstructs(
      context.root,
      manifest,
      sourceId,
      primaryId,
      calculateDocumentRevision(taxonomy),
      HUMAN
    )

  for (const sourceId of ['construct_pending', 'construct_rejected']) {
    const result = await merge(sourceId, 'construct_primary')
    assert.equal(result.accepted, false)
    assert.ok(result.diagnostics?.some(item =>
      item.code === 'construct-merge-source-not-approved'
    ))
  }
  const self = await merge('construct_primary', 'construct_primary')
  assert.equal(self.accepted, false)
  assert.ok(self.diagnostics?.some(item =>
    item.code === 'self-referential-primary'
  ))

  assert.equal((await merge('construct_secondary', 'construct_primary')).accepted, true)
  taxonomy = await readTaxonomy(context)
  const repeated = await merge('construct_secondary', 'construct_other')
  assert.equal(repeated.accepted, false)
  assert.ok(repeated.diagnostics?.some(item =>
    item.code === 'construct-merge-source-not-approved'
  ))
  const cycle = await merge('construct_primary', 'construct_secondary')
  assert.equal(cycle.accepted, false)
  assert.ok(cycle.diagnostics?.some(item =>
    item.code === 'primary-construct-not-active'
  ))
})

test('agents cannot approve, merge, or remap taxonomy state', async t => {
  const context = await synthesisProject(t)
  await writeTaxonomy(context, [
    constructRecord('construct_primary', 'Primary construct', 'approved'),
    constructRecord('construct_other', 'Other construct', 'approved'),
  ])
  const manifest = await readManifest(context)
  const taxonomy = await readTaxonomy(context)
  const result = await context.runtime.taxonomy.mergeConstructs(
    context.root,
    manifest,
    'construct_other',
    'construct_primary',
    calculateDocumentRevision(taxonomy),
    AGENT
  )
  assert.equal(result.accepted, false)
  assert.ok(result.diagnostics?.some(item =>
    item.code === 'researcher-authority-required'
  ))
})

test('taxonomy version changes invalidate affected index entries', async t => {
  const context = await synthesisProject(t)
  await installApprovedExtraction(context)
  const manifest = await readManifest(context)
  const current = await readTaxonomy(context)
  const proposed = await context.runtime.taxonomy.proposeConstruct(
    context.root,
    manifest,
    {
      constructId: 'construct_new',
      canonicalName: 'New construct',
    },
    calculateDocumentRevision(current),
    HUMAN
  )
  assert.equal(proposed.mutation.accepted, true)
  const afterProposal = await readTaxonomy(context)
  const approved = await context.runtime.taxonomy.reviewConstruct(
    context.root,
    manifest,
    'construct_new',
    'approved',
    calculateDocumentRevision(afterProposal),
    HUMAN
  )
  assert.equal(approved.accepted, true)
  const rebuilt = await context.runtime.indexes.rebuild(
    context.root,
    manifest
  )
  assert.deepEqual(rebuilt.processedPaperIds, ['paper_001'])
  assert.equal(rebuilt.reusedPaperIds.length, 0)
})

test('100-paper matrix opens without graph hydration', async t => {
  const context = await createProject(t)
  await addPapers(context, 100)
  await rebuild(context, true)
  context.runtime.papers.resetInstrumentation()
  const opened = await context.phase2.openMatrix(context.manifestPath)
  assert.equal(opened.matrix?.papers.length, 100)
  assert.deepEqual(
    context.runtime.papers.instrumentation(),
    { count: 0, paperIds: [] }
  )
})

test('one matrix cell hydrates only its extraction detail', async t => {
  const context = await synthesisProject(t)
  await installApprovedExtraction(context)
  context.runtime.papers.resetInstrumentation()
  const detail = await context.phase2.hydrateCell(
    context.manifestPath,
    'paper_001',
    'construct_shared_leadership'
  )
  assert.equal(detail?.paperId, 'paper_001')
  assert.equal(detail?.findings.length, 1)
  assert.deepEqual(
    context.runtime.papers.instrumentation(),
    { count: 0, paperIds: [] }
  )
})

test('invalid indexes rebuild from authoritative extraction', async t => {
  const context = await synthesisProject(t)
  await installApprovedExtraction(context)
  const manifest = await readManifest(context)
  const extractionBefore = await extractionBytes(context, 'paper_001')
  await writeFile(
    path.join(context.root, manifest.documents.paperIndex),
    '{"invalid":true}\n'
  )
  const opened = await context.phase2.openMatrix(context.manifestPath)
  assert.equal(opened.matrix?.papers.length, 1)
  assert.deepEqual(await extractionBytes(context, 'paper_001'), extractionBefore)
})

test('deleted indexes rebuild without authoritative extraction loss', async t => {
  const context = await synthesisProject(t)
  await installApprovedExtraction(context)
  const manifest = await readManifest(context)
  const before = await extractionBytes(context, 'paper_001')
  await unlink(path.join(context.root, manifest.documents.paperIndex))
  await unlink(path.join(context.root, manifest.documents.evidenceIndex))
  const opened = await context.phase2.openMatrix(context.manifestPath)
  assert.ok(opened.matrix)
  assert.deepEqual(await extractionBytes(context, 'paper_001'), before)
})

test('partial rebuild failure preserves the previous valid index pair', async t => {
  let fail = false
  const writer = new AtomicJsonWriter({
    beforeReplace: async target => {
      if (fail && target.endsWith('papers.index.json')) {
        throw new Error('injected-phase2-index-failure')
      }
    },
  })
  const context = await synthesisProject(t, writer)
  await installApprovedExtraction(context)
  const manifest = await readManifest(context)
  const paperBefore = await readFile(
    path.join(context.root, manifest.documents.paperIndex)
  )
  const evidenceBefore = await readFile(
    path.join(context.root, manifest.documents.evidenceIndex)
  )
  const extraction = await readExtraction(context, 'paper_001')
  extraction.modified = '2026-07-30T17:00:00.000Z'
  await writeExtraction(context, extraction)
  fail = true
  await assert.rejects(
    context.runtime.indexes.rebuild(context.root, manifest),
    /injected-phase2-index-failure/
  )
  assert.deepEqual(
    await readFile(path.join(context.root, manifest.documents.paperIndex)),
    paperBefore
  )
  assert.deepEqual(
    await readFile(path.join(context.root, manifest.documents.evidenceIndex)),
    evidenceBefore
  )
})

test('Phase 2 mutation reports index failure without hiding its commit', async t => {
  let fail = false
  const writer = new AtomicJsonWriter({
    beforeReplace: async target => {
      if (fail && target.endsWith('papers.index.json')) {
        throw new Error('injected-phase2-follow-up-index-failure')
      }
    },
  })
  const context = await synthesisProject(t, writer)
  await installApprovedExtraction(context)
  const manifest = await readManifest(context)
  const paperBefore = await readFile(
    path.join(context.root, manifest.documents.paperIndex)
  )
  fail = true
  const outcome = await context.phase2.verifyFinding(
    context.manifestPath,
    'paper_001',
    'finding_001',
    'classification',
    'disputed'
  )
  assert.equal(outcome.mutation.accepted, true)
  assert.equal(outcome.indexFailure?.code, 'index-rebuild-failed')
  assert.ok(outcome.indexFailure?.cause instanceof Error)
  assert.deepEqual(
    await readFile(path.join(context.root, manifest.documents.paperIndex)),
    paperBefore
  )
  const finding = (await readExtraction(
    context,
    'paper_001'
  )).fields.findings.items![0]
  assert.equal(finding.reviewState.verification.classification, 'disputed')
})

test('removed paper registrations disappear from the matrix index', async t => {
  const context = await createProject(t)
  await addPapers(context, 2)
  await rebuild(context, true)
  const manifest = await readManifest(context)
  manifest.papers = manifest.papers.slice(0, 1)
  await writeJson(context.manifestPath, manifest)
  const rebuilt = await context.runtime.indexes.rebuild(
    context.root,
    manifest
  )
  assert.deepEqual(rebuilt.removedPaperIds, ['paper_002'])
  assert.deepEqual(
    rebuilt.paperIndex.entries.map(entry => entry.paperId),
    ['paper_001']
  )
})

test('graph and matrix selections use stable mappings and fail safely', async t => {
  const context = await synthesisProject(t)
  await installApprovedExtraction(context)
  const found = await context.phase2.locateMatrixCell(
    context.manifestPath,
    path.join(context.root, paperGraphPath(1)),
    'node_claim_04'
  )
  assert.deepEqual(found, {
    paperId: 'paper_001',
    constructId: 'construct_shared_leadership',
  })
  assert.equal(
    await context.phase2.locateMatrixCell(
      context.manifestPath,
      path.join(context.root, paperGraphPath(1)),
      'missing-node'
    ),
    undefined
  )
})

test('CSV export is stable, Unicode-safe, quoted, and formula-safe', async t => {
  const context = await synthesisProject(t)
  const graph = await readJson<NodeGraph>(
    path.join(context.root, paperGraphPath(1))
  )
  graph.title = '=SUM(1,1)'
  graph.source!.authors = 'Zoë 연구자'
  await writeJson(path.join(context.root, paperGraphPath(1)), graph)
  const extraction = await approvedExtraction(context)
  extraction.constructMappings[0].sourceTerm = '@source,\nterm'
  await writeExtraction(context, extraction)
  await rebuild(context, true)
  const first = await context.phase2.exportCsv(context.manifestPath)
  const second = await context.phase2.exportCsv(context.manifestPath)
  assert.equal(first.csv, second.csv)
  assert.match(first.csv!, /"'=SUM\(1,1\)"/)
  assert.match(first.csv!, /"'@source,\nterm"/)
  assert.ok(first.csv?.endsWith('\r\n'))
})

test('stale Phase 2 writes preserve authoritative bytes', async t => {
  const context = await synthesisProject(t)
  const current = await readExtraction(context, 'paper_001')
  const staleRevision = calculateDocumentRevision(current)
  current.modified = '2026-07-30T17:00:00.000Z'
  await writeExtraction(context, current)
  const before = await extractionBytes(context, 'paper_001')
  const proposal = await agentExtraction(context)
  const outcome = await context.phase2.importExtraction(
    context.manifestPath,
    proposal,
    AGENT,
    staleRevision
  )
  assert.equal(outcome.mutation.accepted, false)
  assert.equal(
    outcome.mutation.accepted ? '' : outcome.mutation.code,
    'stale-revision'
  )
  assert.deepEqual(await extractionBytes(context, 'paper_001'), before)
})

test('unsupported extraction versions reject Phase 2 writes', async t => {
  const context = await synthesisProject(t)
  const extraction: any = await agentExtraction(context)
  extraction.schema.version = '2.0.0'
  await writeExtraction(context, extraction)
  const before = await extractionBytes(context, 'paper_001')
  const outcome = await context.phase2.verifyFinding(
    context.manifestPath,
    'paper_001',
    'finding_001',
    'interpretation',
    'verified'
  )
  assert.equal(outcome.mutation.accepted, false)
  assert.ok(outcome.diagnostics.some(item =>
    item.code === 'schema-const' ||
    item.code === 'unsupported-newer-version'
  ))
  assert.deepEqual(await extractionBytes(context, 'paper_001'), before)
})

test('Phase 1 projects migrate explicitly with manifest replacement last', async t => {
  const context = await synthesisProject(t)
  await convertToLegacyProject(context)
  const outcome = await context.phase2.migrate(context.manifestPath)
  assert.equal(outcome.mutation.accepted, true)
  const manifest = await readManifest(context)
  assert.equal(manifest.schema.version, '1.1.0')
  assert.ok(manifest.documents.methodologies)
  assert.ok(manifest.papers[0].extractionPath)
  await access(path.join(context.root, manifest.documents.methodologies!))
  await access(path.join(context.root, manifest.papers[0].extractionPath!))
  const audit = await context.runtime.audit.inspect(
    context.root,
    manifest.documents.auditLog
  )
  const event = audit.events.find(item => item.action === 'schema.migrated')
  assert.equal(event?.metadata?.fromSchemaVersion, '1.0.0')
  assert.equal(event?.metadata?.toSchemaVersion, '1.1.0')
})

test('failed migration leaves the original manifest unchanged', async t => {
  const context = await synthesisProject(t)
  await convertToLegacyProject(context, true)
  const before = await readFile(context.manifestPath)
  await assert.rejects(
    context.phase2.migrate(context.manifestPath),
    /Migration target already exists/
  )
  assert.deepEqual(await readFile(context.manifestPath), before)
})

test('index invalidation failure cannot remove migrated authority', async t => {
  class IndexRemovalFailureWriter extends AtomicJsonWriter {
    private failRemoval = true

    public override async remove(target: string): Promise<void> {
      if (this.failRemoval && target.endsWith('papers.index.json')) {
        this.failRemoval = false
        throw new Error('injected-index-removal-failure')
      }
      await super.remove(target)
    }
  }

  const context = await synthesisProject(t, new IndexRemovalFailureWriter())
  await convertToLegacyProject(context)
  const outcome = await context.phase2.migrate(context.manifestPath)
  assert.equal(outcome.mutation.accepted, true)
  assert.ok(outcome.diagnostics.some(item =>
    item.code === 'migration-index-invalidation-failed'
  ))
  const manifest = await readManifest(context)
  await access(path.join(context.root, manifest.documents.methodologies!))
  await access(path.join(context.root, manifest.papers[0].extractionPath!))
})

test('initial methodology registry has four paradigms and human review', async t => {
  const context = await createProject(t)
  const manifest = await readManifest(context)
  const registry = await context.runtime.synthesis.readMethodologies(
    context.root,
    manifest
  )
  assert.deepEqual(
    registry.value?.paradigms.map(item => item.paradigmId),
    ['positivist', 'interpretive', 'critical', 'pragmatist']
  )
  const proposed = await context.runtime.taxonomy.proposeParadigm(
    context.root,
    manifest,
    'realist',
    'Realist',
    calculateDocumentRevision(registry.value),
    AGENT
  )
  assert.equal(proposed.accepted, true)
  const after = await context.runtime.synthesis.readMethodologies(
    context.root,
    manifest
  )
  const rejected = await context.runtime.taxonomy.reviewParadigm(
    context.root,
    manifest,
    'realist',
    'approved',
    calculateDocumentRevision(after.value),
    AGENT
  )
  assert.equal(rejected.accepted, false)
  const duplicate = await context.runtime.taxonomy.proposeParadigm(
    context.root,
    manifest,
    'positivist',
    'Another Positivist',
    calculateDocumentRevision(after.value),
    AGENT
  )
  assert.equal(duplicate.accepted, false)
  assert.ok(duplicate.diagnostics?.some(item =>
    item.code === 'duplicate-identifier'
  ))
})

test('matrix filters share index metadata normalization', async t => {
  const context = await synthesisProject(t)
  await installApprovedExtraction(context)
  const opened = await context.phase2.openMatrix(context.manifestPath, {
    paradigm: '  PRAGMATIST ',
    technique: 'thematic',
    population: 'doctoral',
    publicationYear: 2024,
  })
  assert.deepEqual(opened.matrix?.papers.map(paper => paper.paperId), ['paper_001'])
})

async function createProject(
  t: TestContext,
  writer?: AtomicJsonWriter
): Promise<ProjectContext> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'nodegraph-phase2-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const runtime = createRuntime(writer)
  const phase1 = new Phase1ProjectService(runtime)
  const phase2 = new Phase2ProjectService(runtime)
  const manifestPath = path.join(root, MANIFEST_NAME)
  const opened = await phase1.create(root, 'project_phase2_test', 'Phase 2 Test')
  assert.equal(opened.mode, 'read-write')
  return { root, manifestPath, runtime, phase1, phase2 }
}

async function synthesisProject(
  t: TestContext,
  writer?: AtomicJsonWriter
): Promise<ProjectContext> {
  const context = await createProject(t, writer)
  await addPapers(context, 1)
  await writeApprovedTaxonomy(context)
  await writeEvidence(context)
  return context
}

function createRuntime(writer?: AtomicJsonWriter): ProjectRuntime {
  return createProjectRuntime({
    extensionRoot: REPOSITORY_ROOT,
    clock: new FixedClock(),
    ...(writer ? { writer } : {}),
  })
}

async function addPapers(
  context: ProjectContext,
  count: number
): Promise<void> {
  const manifest = await readManifest(context)
  for (let index = 1; index <= count; index++) {
    manifest.papers.push(await writePaper(context, index))
  }
  manifest.modified = FIXED_TIME
  await writeJson(context.manifestPath, manifest)
}

async function writePaper(
  context: ProjectContext,
  index: number
): Promise<PaperRegistration> {
  const graph = createGraph(index)
  const pdf = Buffer.from(`PDF bytes ${index}`)
  const paperId = paperIdentifier(index)
  const extractionPath = `extractions/${paperId}.json`
  await writeJson(path.join(context.root, paperGraphPath(index)), graph)
  await writeFile(path.join(context.root, paperPdfPath(index)), pdf)
  await writeJson(
    path.join(context.root, extractionPath),
    createEmptyExtraction(paperId, FIXED_TIME)
  )
  return {
    paperId,
    path: paperGraphPath(index),
    extractionPath,
    source: {
      sourceId: `source_${index.toString().padStart(3, '0')}`,
      relativePath: paperPdfPath(index),
      sourceDocumentHash: calculateByteHash(pdf),
      title: graph.title,
      doi: graph.source?.doi,
      version: 'publisher-version',
    },
  }
}

function createGraph(index: number): NodeGraph {
  return {
    version: '1.0.0',
    title: `Paper ${index}`,
    created: FIXED_TIME,
    modified: FIXED_TIME,
    source: {
      pdf: path.basename(paperPdfPath(index)),
      authors: `Author ${index}`,
      venue: `Research Journal ${2023 + index}`,
      doi: `10.1000/paper-${index}`,
      pages: 20,
    },
    nodeTemplates: {
      claim: {
        label: 'Claim',
        color: '#000000',
        icon: 'quote',
        shape: 'sharp',
      },
    },
    nodes: [{
      id: index === 1 ? 'node_claim_04' : `node_claim_${index}`,
      template: 'claim',
      title: `Finding ${index}`,
      content: 'Finding content',
      original: {
        text: 'Shared leadership improves trust.',
        location: 'p. 14',
      },
      contentExpanded: true,
      originalExpanded: false,
      childrenExpanded: false,
      position: { x: 0, y: 0 },
      children: [],
      links: [],
    }],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
  }
}

async function writeApprovedTaxonomy(context: ProjectContext): Promise<void> {
  await writeTaxonomy(context, [
    constructRecord(
      'construct_shared_leadership',
      'Shared leadership',
      'approved'
    ),
  ])
}

async function writeTaxonomy(
  context: ProjectContext,
  constructs: ConstructTaxonomyDocument['constructs']
): Promise<void> {
  const manifest = await readManifest(context)
  await writeJson(path.join(context.root, manifest.documents.constructs), {
    schema: { name: 'nodegraph-construct-taxonomy', version: '1.0.0' },
    taxonomyVersion: 1,
    constructs,
    modified: FIXED_TIME,
  })
}

function constructRecord(
  constructId: string,
  canonicalName: string,
  status: 'proposed' | 'approved'
): ConstructTaxonomyDocument['constructs'][number] {
  return {
    constructId,
    canonicalName,
    aliases: [],
    status,
    reviewState: status === 'approved'
      ? approvedReviewState()
      : pendingReviewState('human'),
  }
}

async function writeEvidence(context: ProjectContext): Promise<void> {
  const manifest = await readManifest(context)
  const registration = manifest.papers[0]
  const quote = 'Shared leadership improves trust.'
  const record: EvidenceRecord = {
    evidenceId: 'evidence_001',
    paperId: registration.paperId,
    nodeId: 'node_claim_04',
    source: { ...registration.source },
    quote: {
      text: quote,
      quoteContentHash: calculateQuoteContentHash(quote),
    },
    locator: { page: 14, exact: quote },
    evidenceObjectHash: `sha256:${'0'.repeat(64)}`,
    reviewState: pendingReviewState('ai'),
    created: FIXED_TIME,
    modified: FIXED_TIME,
  }
  record.evidenceObjectHash = calculateEvidenceObjectHash(record)
  await writeJson(path.join(context.root, manifest.documents.evidence), {
    schema: { name: 'nodegraph-evidence-records', version: '1.0.0' },
    evidence: [record],
    modified: FIXED_TIME,
  })
}

async function installApprovedExtraction(
  context: ProjectContext
): Promise<void> {
  await writeExtraction(context, await approvedExtraction(context))
  await rebuild(context, true)
}

async function importAgentExtraction(
  context: ProjectContext
): Promise<void> {
  const outcome = await context.phase2.importExtraction(
    context.manifestPath,
    await agentExtraction(context),
    AGENT
  )
  assert.equal(outcome.mutation.accepted, true)
}

async function approvedExtraction(
  context: ProjectContext
): Promise<ExtractionDocument> {
  const extraction = await validExtractionFixture()
  extraction.paperId = 'paper_001'
  extraction.extractionId = 'extraction_001'
  extraction.created = FIXED_TIME
  extraction.modified = FIXED_TIME
  return extraction
}

async function agentExtraction(
  context: ProjectContext
): Promise<ExtractionDocument> {
  const extraction = await approvedExtraction(context)
  extraction.extractionStatus = 'proposed'
  replaceReviewStates(extraction, 'ai')
  extraction.constructMappings[0].mappingStatus = 'pending'
  extraction.methodology.methodologicalParadigm.mappingStatus = 'pending'
  return extraction
}

function replaceReviewStates(
  value: unknown,
  origin: ReviewState['origin']
): void {
  if (Array.isArray(value)) {
    value.forEach(item => replaceReviewStates(item, origin))
    return
  }
  if (!value || typeof value !== 'object') return
  const object = value as Record<string, unknown>
  for (const [key, child] of Object.entries(object)) {
    if (key === 'reviewState') object[key] = pendingReviewState(origin)
    else replaceReviewStates(child, origin)
  }
}

function approvedReviewState(): ReviewState {
  return {
    verification: {
      source: 'not-applicable',
      interpretation: 'verified',
      classification: 'verified',
    },
    approval: {
      researcher: 'approved',
      advisor: 'not-reviewed',
    },
    origin: 'human',
  }
}

async function rebuild(
  context: ProjectContext,
  full = false
) {
  const manifest = await readManifest(context)
  const result = await context.runtime.indexes.rebuild(
    context.root,
    manifest,
    full
  )
  assert.equal(
    result.diagnostics.filter(item => item.severity === 'error').length,
    0,
    result.diagnostics.map(item => item.code).join(', ')
  )
  return result
}

async function convertToLegacyProject(
  context: ProjectContext,
  keepMethodologyTarget = false
): Promise<void> {
  const manifest: any = await readManifest(context)
  const methodologyPath = manifest.documents.methodologies
  const extractionPaths = manifest.papers.map(
    (paper: PaperRegistration) => paper.extractionPath
  )
  manifest.schema.version = '1.0.0'
  delete manifest.documents.methodologies
  manifest.papers.forEach((paper: PaperRegistration) => {
    delete paper.extractionPath
  })
  await writeJson(context.manifestPath, manifest)
  if (!keepMethodologyTarget) {
    await unlink(path.join(context.root, methodologyPath))
  }
  for (const extractionPath of extractionPaths) {
    await unlink(path.join(context.root, extractionPath))
  }
}

async function readManifest(context: ProjectContext): Promise<ProjectManifest> {
  return readJson<ProjectManifest>(context.manifestPath)
}

async function readTaxonomy(
  context: ProjectContext
): Promise<ConstructTaxonomyDocument> {
  const manifest = await readManifest(context)
  return readJson(path.join(context.root, manifest.documents.constructs))
}

async function readExtraction(
  context: ProjectContext,
  paperId: string
): Promise<ExtractionDocument> {
  const manifest = await readManifest(context)
  const registration = manifest.papers.find(paper => paper.paperId === paperId)!
  return readJson(path.join(context.root, registration.extractionPath!))
}

async function writeExtraction(
  context: ProjectContext,
  extraction: ExtractionDocument
): Promise<void> {
  const manifest = await readManifest(context)
  const registration = manifest.papers.find(
    paper => paper.paperId === extraction.paperId
  )!
  await writeJson(
    path.join(context.root, registration.extractionPath!),
    extraction
  )
}

async function extractionBytes(
  context: ProjectContext,
  paperId: string
): Promise<Buffer> {
  const manifest = await readManifest(context)
  const registration = manifest.papers.find(paper => paper.paperId === paperId)!
  return readFile(path.join(context.root, registration.extractionPath!))
}

function paperIdentifier(index: number): string {
  return `paper_${index.toString().padStart(3, '0')}`
}

function paperGraphPath(index: number): string {
  return `papers/paper-${index.toString().padStart(3, '0')}.nodegraph.json`
}

function paperPdfPath(index: number): string {
  return `papers/paper-${index.toString().padStart(3, '0')}.pdf`
}

async function validExtractionFixture(): Promise<ExtractionDocument> {
  return readJson(path.join(
    REPOSITORY_ROOT,
    'docs/schemas/fixtures/valid/extraction.json'
  ))
}

async function readJson<T = unknown>(file: string): Promise<T> {
  return JSON.parse(await readFile(file, 'utf8')) as T
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`)
}
