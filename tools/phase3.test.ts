import test, { TestContext } from 'node:test'
import assert from 'node:assert/strict'
import {
  access,
  mkdtemp,
  mkdir,
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
import { ConfidenceService } from '../src/extension/project/ConfidenceService'
import { pendingReviewState } from '../src/extension/project/extractionDefaults'
import { Phase1ProjectService } from '../src/extension/project/Phase1ProjectService'
import { Phase2ProjectService } from '../src/extension/project/Phase2ProjectService'
import { Phase3ProjectService } from '../src/extension/project/Phase3ProjectService'
import {
  createProjectRuntime,
  ProjectRuntime,
} from '../src/extension/project/ProjectRuntime'
import {
  Actor,
  AppraisalField,
  Clock,
  ConflictRecord,
  ConstructTaxonomyDocument,
  ContextDimension,
  EvidenceAppraisal,
  EvidenceRecord,
  ExtractionDocument,
  FindingRelationship,
  ProjectManifest,
  ReviewState,
  SynthesisClaim,
} from '../src/extension/project/types'
import { NodeGraph } from '../src/webview/types/graph'

const REPOSITORY_ROOT = process.cwd()
const FIXED_TIME = '2026-07-31T16:00:00.000Z'
const MANIFEST_NAME = 'project.nodegraph.json'
const HUMAN: Actor = { type: 'human', id: 'researcher' }
const AGENT: Actor = { type: 'agent', id: 'claim-extractor', version: '0.0.0' }

interface Context {
  root: string
  manifestPath: string
  runtime: ProjectRuntime
  phase1: Phase1ProjectService
  phase2: Phase2ProjectService
  phase3: Phase3ProjectService
}

class FixedClock implements Clock {
  public now(): string { return FIXED_TIME }
}

class ManifestFailureWriter extends AtomicJsonWriter {
  public failManifest = false

  public override async write(
    target: string,
    value: unknown,
    guard?: () => Promise<void>
  ): Promise<void> {
    if (this.failManifest && path.basename(target) === MANIFEST_NAME) {
      throw new Error('injected-manifest-failure')
    }
    return super.write(target, value, guard)
  }
}

test('Phase 3 schema 1.2.0 validates its authoritative documents', async () => {
  const runtime = createRuntime()
  for (const [schema, fixture] of [
    ['project-v1.2.schema.json', 'project-v1.2.nodegraph.json'],
    ['synthesis-claims-v1.2.schema.json', 'synthesis-claims-v1.2.json'],
    ['conflicts-v1.2.schema.json', 'conflicts-v1.2.json'],
    ['evidence-appraisals.schema.json', 'evidence-appraisals.json'],
  ]) {
    assert.deepEqual(runtime.schemas.validate(schema, await fixtureJson(`valid/${fixture}`), fixture), [])
  }
})

test('1.1.0 migrates explicitly to 1.2.0 with manifest replacement last', async t => {
  const context = await phase2Project(t)
  const outcome = await context.phase3.migrate(context.manifestPath)
  assert.equal(outcome.mutation.accepted, true)
  const manifest = await manifestOf(context)
  assert.equal(manifest.schema.version, '1.2.0')
  assert.equal(manifest.documents.claims, 'synthesis/claims-v1.2.json')
  await access(path.join(context.root, manifest.documents.appraisals!))
  await access(path.join(context.root, manifest.documents.conflicts))
  const after = await readFile(context.manifestPath)
  const repeated = await context.phase3.migrate(context.manifestPath)
  assertRejectedWith(repeated, 'migration-not-required')
  assert.deepEqual(await readFile(context.manifestPath), after)
})

test('failed migration keeps the Phase 2 manifest and removes proposed authority', async t => {
  const writer = new ManifestFailureWriter()
  const context = await phase2Project(t, writer)
  const before = await readFile(context.manifestPath)
  const phase2Manifest = await manifestOf(context)
  const oldClaims = await readFile(path.join(context.root, phase2Manifest.documents.claims))
  const oldConflicts = await readFile(path.join(context.root, phase2Manifest.documents.conflicts))
  writer.failManifest = true
  await assert.rejects(context.phase3.migrate(context.manifestPath), /injected-manifest-failure/)
  assert.deepEqual(await readFile(context.manifestPath), before)
  assert.deepEqual(
    await readFile(path.join(context.root, phase2Manifest.documents.claims)), oldClaims
  )
  assert.deepEqual(
    await readFile(path.join(context.root, phase2Manifest.documents.conflicts)), oldConflicts
  )
  await assert.rejects(access(path.join(context.root, 'synthesis/claims-v1.2.json')))
})

test('migration validates Phase 2 extraction references before writing authority', async t => {
  const context = await phase2Project(t)
  const extraction = await extractionOf(context, 'paper_001')
  extraction.fields.findings.items![0].evidenceIds = ['evidence_missing']
  await writeExtraction(context, extraction)
  const outcome = await context.phase3.migrate(context.manifestPath)
  assertRejectedWith(outcome, 'missing-evidence-reference')
  assert.equal((await manifestOf(context)).schema.version, '1.1.0')
  await assert.rejects(access(path.join(context.root, 'synthesis/claims-v1.2.json')))
})

test('Phase 3 migration requires sequential Phase 2 migration', async t => {
  const context = await phase2Project(t)
  const manifest: any = await manifestOf(context)
  manifest.schema.version = '1.0.0'
  delete manifest.documents.methodologies
  manifest.papers.forEach((paper: any) => delete paper.extractionPath)
  await writeJson(context.manifestPath, manifest)
  const outcome = await context.phase3.migrate(context.manifestPath)
  assert.equal(outcome.mutation.accepted, false)
  assert.ok(outcome.diagnostics.some(item => item.code === 'sequential-migration-required'))
})

test('synthesis claim creation requires findings from two distinct papers', async t => {
  const context = await phase3Project(t)
  const proposal = claimProposal()
  proposal.findingRefs[1] = {
    paperId: 'paper_001', findingId: 'finding_002', relationship: 'supports',
  }
  proposal.evidenceRefs = ['evidence_001']
  const outcome = await context.phase3.importClaim(context.manifestPath, proposal, AGENT)
  assertRejectedWith(outcome, 'cross-paper-basis-required')
})

test('malformed claim imports return schema diagnostics before reference checks', async t => {
  const context = await phase3Project(t)
  const before = await readFile(claimsPath(context))
  const outcome = await context.phase3.importClaim(
    context.manifestPath,
    { claimId: 'claim_incomplete' },
    AGENT
  )
  assertRejectedWith(outcome, 'schema-required')
  assert.deepEqual(await readFile(claimsPath(context)), before)
})

test('single-study propositions accept one paper with exact evidence', async t => {
  const context = await phase3Project(t)
  const proposal = claimProposal()
  proposal.claimType = 'single-study-proposition'
  proposal.findingRefs = [proposal.findingRefs[0]]
  proposal.evidenceRefs = ['evidence_001']
  const outcome = await context.phase3.importClaim(context.manifestPath, proposal, AGENT)
  assert.equal(outcome.mutation.accepted, true)
})

test('claim references resolve to actual extraction findings', async t => {
  const context = await phase3Project(t)
  const proposal = claimProposal()
  proposal.findingRefs[1].findingId = 'finding_missing'
  const outcome = await context.phase3.importClaim(context.manifestPath, proposal, AGENT)
  assertRejectedWith(outcome, 'missing-finding-reference')
})

test('claim detail resolves claim to findings to exact evidence', async t => {
  const context = await projectWithClaim(t)
  const detail = await context.phase3.hydrateClaim(context.manifestPath, 'claim_001')
  assert.equal(detail?.findings.length, 2)
  assert.deepEqual(detail?.findings.map(item => item.relationship), [
    'supports', 'contradicts',
  ])
  assert.deepEqual(detail?.findings.map(item => item.evidence[0].evidenceId), [
    'evidence_001', 'evidence_002',
  ])
  assert.match(detail?.findings[0].evidence[0].quote.text ?? '', /Paper 1/)
})

test('claim evidence must belong to the finding paper', async t => {
  const context = await phase3Project(t)
  const manifest = await manifestOf(context)
  const extraction = await extractionOf(context, 'paper_001')
  extraction.fields.findings.items![0].evidenceIds.push('evidence_002')
  await writeExtraction(context, extraction)
  const proposal = claimProposal()
  proposal.evidenceRefs = ['evidence_002']
  const outcome = await context.phase3.importClaim(context.manifestPath, proposal, AGENT)
  assertRejectedWith(outcome, 'evidence-paper-mismatch')
  assert.equal(manifest.schema.version, '1.2.0')
})

test('claim evidence must be linked by a referenced finding', async t => {
  const context = await phase3Project(t, undefined, undefined, 3)
  const proposal = claimProposal()
  proposal.evidenceRefs.push('evidence_003')
  const outcome = await context.phase3.importClaim(context.manifestPath, proposal, AGENT)
  assertRejectedWith(outcome, 'claim-evidence-not-linked-to-finding')
})

test('stale evidence remains visible and cannot approve a claim', async t => {
  const context = await phase3Project(t)
  await setEvidenceSourceState(context, 'evidence_001', 'stale')
  const outcome = await context.phase3.importClaim(context.manifestPath, claimProposal(), AGENT)
  assert.equal(outcome.mutation.accepted, true)
  const ledger = await context.phase3.openLedger(context.manifestPath)
  assert.ok(ledger.ledger?.entries[0].warnings.includes('invalid-evidence'))
  const approval = await context.phase3.reviewClaim(context.manifestPath, 'claim_001', 'approved')
  assertRejectedWith(approval, 'stale-claim-evidence')
})

test('all supported finding relationship values validate', async () => {
  const runtime = createRuntime()
  const relationships: FindingRelationship[] = [
    'supports', 'partially-supports', 'contradicts', 'extends', 'qualifies',
    'replicates', 'fails-to-replicate', 'uses-different-definition',
    'uses-different-population', 'uses-different-method',
  ]
  for (const relationship of relationships) {
    const claim = claimProposal()
    claim.claimType = 'single-study-proposition'
    claim.findingRefs = [{ paperId: 'paper_001', findingId: 'finding_001', relationship }]
    claim.evidenceRefs = ['evidence_001']
    assert.deepEqual(runtime.schemas.validate(
      'synthesis-claim-v1.2.schema.json', claim, relationship
    ), [])
  }
})

test('agents cannot assign claim approval', async t => {
  const context = await phase3Project(t)
  const proposal = claimProposal()
  proposal.reviewState.approval.researcher = 'approved'
  const outcome = await context.phase3.importClaim(context.manifestPath, proposal, AGENT)
  assertRejectedWith(outcome, 'agent-proposal-state-required')
})

test('cross-paradigm claims require an explicit researcher decision', async t => {
  const context = await phase3Project(t, undefined, ['pragmatist', 'interpretive'])
  const outcome = await context.phase3.importClaim(context.manifestPath, claimProposal(), AGENT)
  assertRejectedWith(outcome, 'cross-paradigm-decision-required')
})

test('researcher cross-paradigm decisions persist before claim approval', async t => {
  const context = await phase3Project(t, undefined, ['pragmatist', 'interpretive'])
  const proposal = claimProposal()
  proposal.paradigmDecision = { required: true, status: 'pending' }
  assert.equal((await context.phase3.importClaim(
    context.manifestPath, proposal, AGENT
  )).mutation.accepted, true)
  assertRejectedWith(
    await context.phase3.reviewClaim(context.manifestPath, proposal.claimId, 'approved'),
    'cross-paradigm-decision-required'
  )
  const decision = await context.phase3.decideParadigm(
    context.manifestPath,
    proposal.claimId,
    'approved',
    'The paradigms answer the same bounded question without being collapsed.'
  )
  assert.equal(decision.mutation.accepted, true)
  const reopened = new Phase3ProjectService(context.runtime, new FixedClock())
  const detail = await reopened.hydrateClaim(context.manifestPath, proposal.claimId)
  assert.equal(detail?.claim.paradigmDecision.status, 'approved')
  assert.match(detail?.claim.paradigmDecision.rationale ?? '', /same bounded question/)
  assert.equal((await reopened.reviewClaim(
    context.manifestPath, proposal.claimId, 'approved'
  )).mutation.accepted, true)
  assert.ok((await auditActions(context)).includes('claim.paradigm-decision'))
})

test('source navigation rejects a replaced PDF with an actionable diagnostic', async t => {
  const context = await projectWithClaim(t)
  await writeFile(path.join(context.root, pdfPath(1)), 'replacement PDF bytes')
  const target = await context.phase3.sourceNavigation(
    context.manifestPath,
    'evidence_001'
  )
  assert.equal(target.sourcePath, undefined)
  assert.ok(target.diagnostics.some(item =>
    item.code === 'source-document-hash-mismatch' && item.action.length > 0))
})

test('conflicts require an explicit canonical type', async () => {
  const runtime = createRuntime()
  const fixture: any = await fixtureJson('valid/conflicts-v1.2.json')
  delete fixture.conflicts[0].conflictType
  assert.ok(runtime.schemas.validate('conflicts-v1.2.schema.json', fixture, 'conflicts')
    .some(item => item.code === 'schema-required'))
})

test('researchers can reclassify a conflict with rationale', async t => {
  const context = await projectWithConflict(t)
  const outcome = await context.phase3.reclassifyConflict(
    context.manifestPath,
    'conflict_001',
    'methodological-artifact',
    'The analytical techniques differ.'
  )
  assert.equal(outcome.mutation.accepted, true)
  const conflicts = await conflictsOf(context)
  assert.equal(conflicts.conflicts[0].conflictType, 'methodological-artifact')
  assert.equal(conflicts.conflicts[0].classificationRationale, 'The analytical techniques differ.')
})

test('conflict reclassification preserves dissenting evidence', async t => {
  const context = await projectWithConflict(t)
  const before = (await conflictsOf(context)).conflicts[0].findingRefs
  await context.phase3.reclassifyConflict(
    context.manifestPath, 'conflict_001', 'conceptual-disagreement', 'Definitions differ.'
  )
  const after = (await conflictsOf(context)).conflicts[0].findingRefs
  assert.deepEqual(after, before)
  assert.ok(after.some(item => item.relationship === 'contradicts'))
})

test('claim relationship mutations are revision checked and audited', async t => {
  const context = await phase3Project(t, undefined, undefined, 3)
  await context.phase3.importClaim(context.manifestPath, claimProposal(), AGENT)
  const added = await context.phase3.addClaimRelationship(
    context.manifestPath,
    'claim_001',
    { paperId: 'paper_003', findingId: 'finding_003', relationship: 'extends' },
    ['evidence_003']
  )
  assert.equal(added.mutation.accepted, true)
  const changed = await context.phase3.changeClaimRelationship(
    context.manifestPath, 'claim_001', 'paper_003', 'finding_003', 'replicates'
  )
  assert.equal(changed.mutation.accepted, true)
  const removed = await context.phase3.removeClaimRelationship(
    context.manifestPath, 'claim_001', 'paper_003', 'finding_003', ['evidence_003']
  )
  assert.equal(removed.mutation.accepted, true)
  const claim = (await claimsOf(context)).claims[0]
  assert.equal(claim.findingRefs.some(item => item.paperId === 'paper_003'), false)
  const audit = await auditActions(context)
  assert.ok(audit.includes('claim.relationship-added'))
  assert.ok(audit.includes('claim.relationship-reclassified'))
  assert.ok(audit.includes('claim.relationship-removed'))
})

test('conflict explanation changes remain proposals and are audited', async t => {
  const context = await projectWithConflict(t)
  const outcome = await context.phase3.replaceConflictExplanations(
    context.manifestPath,
    'conflict_001',
    [{
      explanationId: 'explanation_method',
      type: 'method',
      text: 'Different analytical techniques may explain the disagreement.',
      contextComparisonIds: [],
      reviewState: pendingReviewState('ai'),
    }],
    AGENT
  )
  assert.equal(outcome.mutation.accepted, true)
  assert.equal((await conflictsOf(context)).conflicts[0].possibleExplanations.length, 1)
  assert.ok((await auditActions(context)).includes('conflict.explanations-changed'))
})

test('context comparison distinguishes missing and unclear values', async t => {
  const context = await projectWithClaim(t)
  const extraction = await extractionOf(context, 'paper_002')
  extraction.fields.setting.reportingStatus = 'unclear'
  await writeExtraction(context, extraction)
  const result = await context.phase3.compareContexts(
    context.manifestPath,
    'claim_001',
    ['setting', 'organization-type']
  )
  assert.equal(result.comparisons[0].result, 'unclear')
  assert.equal(result.comparisons[1].result, 'missing')
})

test('context comparisons never assert causation', async t => {
  const context = await projectWithClaim(t)
  const dimensions: ContextDimension[] = ['population', 'setting', 'analytical-technique']
  const result = await context.phase3.compareContexts(context.manifestPath, 'claim_001', dimensions)
  assert.ok(result.comparisons.every(item => item.causalInference === false))
})

test('evidence appraisal proposals and researcher review remain separate', async t => {
  const context = await projectWithClaim(t)
  const appraisal = await appraisalFor(context, 'paper_001', 'ai')
  const proposed = await context.phase3.importAppraisal(context.manifestPath, appraisal, AGENT)
  assert.equal(proposed.mutation.accepted, true)
  const reviewed = await context.phase3.reviewAppraisal(
    context.manifestPath, appraisal.appraisalId, 'approved'
  )
  assert.equal(reviewed.mutation.accepted, true)
  const persisted = await appraisalsOf(context)
  assert.equal(persisted.appraisals[0].reviewState.approval.researcher, 'approved')
  assert.equal(persisted.appraisals[0].reviewState.verification.source, 'pending')
})

test('missing appraisal inputs produce not-assessed confidence', async t => {
  const context = await projectWithClaim(t)
  const outcome = await context.phase3.recalculateConfidence(context.manifestPath, 'claim_001')
  assert.equal(outcome.mutation.accepted, true)
  assert.equal((await claimsOf(context)).claims[0].confidence?.label, 'not-assessed')
})

test('confidence evaluation is repeatable for identical inputs', async t => {
  const context = await projectWithClaim(t, 'supports')
  await installApprovedAppraisals(context)
  await context.phase3.recalculateConfidence(context.manifestPath, 'claim_001')
  const first = (await claimsOf(context)).claims[0].confidence
  await context.phase3.recalculateConfidence(context.manifestPath, 'claim_001')
  const second = (await claimsOf(context)).claims[0].confidence
  assert.deepEqual(second, first)
})

test('confidence explanations expose policy and all rule inputs', async t => {
  const context = await projectWithClaim(t, 'supports')
  await installApprovedAppraisals(context)
  await context.phase3.recalculateConfidence(context.manifestPath, 'claim_001')
  const confidence = (await claimsOf(context)).claims[0].confidence!
  assert.equal(confidence.policyId, 'nodegraph-evidence-confidence')
  assert.equal(confidence.policyVersion, '1.0.0')
  assert.equal(confidence.inputs.supportingStudyCount, 2)
  assert.ok(confidence.reasons.length)
  assert.ok(confidence.freshness.extractionRevisions.paper_001)
})

test('a numerical majority cannot erase stronger dissent', async t => {
  const context = await phase3Project(t, undefined, undefined, 3)
  const claim = claimProposal()
  claim.findingRefs.push({
    paperId: 'paper_003', findingId: 'finding_003', relationship: 'supports',
  })
  claim.evidenceRefs.push('evidence_003')
  await context.phase3.importClaim(context.manifestPath, claim, AGENT)
  await installApprovedAppraisals(context, true)
  await context.phase3.recalculateConfidence(context.manifestPath, 'claim_001')
  const confidence = (await claimsOf(context)).claims[0].confidence!
  assert.equal(confidence.inputs.supportingStudyCount, 2)
  assert.equal(confidence.inputs.dissentingStudyCount, 1)
  assert.equal(confidence.label, 'low')
})

test('appraisal changes make persisted confidence visibly stale', async t => {
  const context = await projectWithClaim(t, 'supports')
  await installApprovedAppraisals(context)
  await context.phase3.recalculateConfidence(context.manifestPath, 'claim_001')
  const appraisals = await appraisalsOf(context)
  appraisals.appraisals[0].fields.reliability.normalizedValue = 'strong'
  appraisals.modified = '2026-07-31T16:01:00.000Z'
  await writeJson(appraisalsPath(context), appraisals)
  const ledger = await context.phase3.openLedger(context.manifestPath)
  assert.equal(ledger.ledger?.entries[0].confidenceStale, true)
})

test('extraction changes make persisted confidence visibly stale', async t => {
  const context = await projectWithClaim(t, 'supports')
  await installApprovedAppraisals(context)
  await context.phase3.recalculateConfidence(context.manifestPath, 'claim_001')
  const extraction = await extractionOf(context, 'paper_001')
  extraction.fields.setting = {
    reportingStatus: 'present',
    sourceText: 'Changed setting',
    normalizedValue: 'changed setting',
  }
  await writeExtraction(context, extraction)
  const ledger = await context.phase3.openLedger(context.manifestPath)
  assert.ok(ledger.ledger, ledger.diagnostics.map(item => item.code).join(', '))
  assert.equal(ledger.ledger.entries[0].confidenceStale, true)
  const detail = await context.phase3.hydrateClaim(context.manifestPath, 'claim_001')
  assert.equal(detail?.claim.confidence?.stale, true)
  assert.ok(detail?.claim.confidence?.staleReasons.includes('extraction-revision-changed'))
})

test('source replacement makes persisted confidence visibly stale', async t => {
  const context = await projectWithClaim(t, 'supports')
  await installApprovedAppraisals(context)
  await context.phase3.recalculateConfidence(context.manifestPath, 'claim_001')
  await writeFile(path.join(context.root, pdfPath(1)), 'Replacement PDF bytes')
  const ledger = await context.phase3.openLedger(context.manifestPath)
  assert.equal(ledger.ledger?.entries[0].confidenceStale, true)
  const detail = await context.phase3.hydrateClaim(context.manifestPath, 'claim_001')
  assert.ok(detail?.claim.confidence?.staleReasons.includes('source-document-hash-changed'))
})

test('taxonomy changes make persisted confidence visibly stale', async t => {
  const context = await projectWithClaim(t, 'supports')
  await installApprovedAppraisals(context)
  await context.phase3.recalculateConfidence(context.manifestPath, 'claim_001')
  const manifest = await manifestOf(context)
  const taxonomy = await readJson<ConstructTaxonomyDocument>(
    path.join(context.root, manifest.documents.constructs)
  )
  taxonomy.taxonomyVersion += 1
  taxonomy.modified = '2026-07-31T16:02:00.000Z'
  await writeJson(path.join(context.root, manifest.documents.constructs), taxonomy)
  const ledger = await context.phase3.openLedger(context.manifestPath)
  assert.equal(ledger.ledger?.entries[0].confidenceStale, true)
  const detail = await context.phase3.hydrateClaim(context.manifestPath, 'claim_001')
  assert.ok(detail?.claim.confidence?.staleReasons.includes('taxonomy-version-changed'))
})

test('stale claim mutations preserve authoritative bytes', async t => {
  const context = await phase3Project(t)
  const beforeDocument = await claimsOf(context)
  const staleRevision = calculateDocumentRevision(beforeDocument)
  await context.phase3.importClaim(context.manifestPath, claimProposal(), AGENT)
  const before = await readFile(claimsPath(context))
  const second = claimProposal()
  second.claimId = 'claim_002'
  const outcome = await context.phase3.importClaim(
    context.manifestPath, second, AGENT, staleRevision
  )
  assert.equal(outcome.mutation.accepted, false)
  assert.equal(outcome.mutation.accepted ? '' : outcome.mutation.code, 'stale-revision')
  assert.deepEqual(await readFile(claimsPath(context)), before)
})

test('Phase 3 authoritative decisions append audit events', async t => {
  const context = await projectWithConflict(t)
  await context.phase3.reclassifyConflict(
    context.manifestPath, 'conflict_001', 'methodological-artifact', 'Methods differ.'
  )
  const manifest = await manifestOf(context)
  const audit = await context.runtime.audit.inspect(context.root, manifest.documents.auditLog)
  const event = audit.events.find(item => item.action === 'conflict.reclassified')
  assert.equal(event?.metadata?.previousConflictType, 'direct-empirical-inconsistency')
  assert.equal(event?.metadata?.conflictType, 'methodological-artifact')
})

test('claim ledger summary opens without paper-graph hydration', async t => {
  const context = await projectWithClaim(t)
  const readEvidence = context.runtime.synthesis.readEvidence.bind(context.runtime.synthesis)
  let evidenceReadCount = 0
  context.runtime.synthesis.readEvidence = async (root, manifest) => {
    evidenceReadCount += 1
    return readEvidence(root, manifest)
  }
  context.runtime.papers.resetInstrumentation()
  const opened = await context.phase3.openLedger(context.manifestPath)
  assert.equal(opened.hydrationCount, 0)
  assert.equal(evidenceReadCount, 0)
  assert.equal(opened.ledger?.entries.length, 1)
})

test('selected claim detail hydrates only referenced extraction detail', async t => {
  const context = await phase3Project(t, undefined, undefined, 3)
  await context.phase3.importClaim(context.manifestPath, claimProposal(), AGENT)
  const detail = await context.phase3.hydrateClaim(context.manifestPath, 'claim_001')
  assert.deepEqual(detail?.findings.map(item => item.paperId).sort(), ['paper_001', 'paper_002'])
  assert.equal(context.runtime.papers.instrumentation().count, 0)
})

test('deleted ledger index rebuilds without authoritative data loss', async t => {
  const context = await projectWithClaim(t)
  const before = await readFile(claimsPath(context))
  await unlink(ledgerPath(context))
  const opened = await context.phase3.openLedger(context.manifestPath)
  assert.equal(opened.ledger?.entries.length, 1)
  assert.deepEqual(await readFile(claimsPath(context)), before)
})

test('claim-ledger webview script parses and requests its lazy summary', async () => {
  const script = await claimLedgerScript()
  const messages: unknown[] = []
  const webviewApi = () => ({
    postMessage(value: unknown) { messages.push(value) },
  })
  new Function('window', 'acquireVsCodeApi', script)(
    { addEventListener() {} },
    webviewApi
  )
  assert.deepEqual(messages, [{ type: 'ready' }])
})

test('reopening a retained claim ledger refreshes its summary', async () => {
  const source = await readFile(path.join(
    REPOSITORY_ROOT, 'src/extension/project/ClaimLedgerPanel.ts'
  ), 'utf8')
  const openPath = source.match(/const existing[\s\S]*?const panel/)
  const revealPath = source.match(/private reveal\(\)[\s\S]*?private register/)
  assert.match(openPath?.[0] ?? '', /if \(existing\) return existing\.reveal\(\)/)
  assert.match(revealPath?.[0] ?? '', /this\.refresh\(\)/)
})

test('Phase 1 project creation remains at schema 1.1.0', async t => {
  const context = await baseProject(t)
  assert.equal((await manifestOf(context)).schema.version, '1.1.0')
  assert.equal((await context.phase1.open(context.manifestPath)).hydrationCount, 0)
})

test('Phase 2 extraction remains writable before Phase 3 migration', async t => {
  const context = await phase2Project(t)
  const extraction = await extractionOf(context, 'paper_001')
  extraction.extractionStatus = 'proposed'
  replaceReviewStates(extraction, pendingReviewState('ai'))
  extraction.constructMappings[0].mappingStatus = 'pending'
  extraction.methodology.methodologicalParadigm.mappingStatus = 'pending'
  const outcome = await context.phase2.importExtraction(
    context.manifestPath, extraction, AGENT
  )
  assert.equal(outcome.mutation.accepted, true)
})

test('legacy single-paper graph schema remains compatible', async () => {
  const runtime = createRuntime()
  const graph = await readJson(path.join(REPOSITORY_ROOT, 'demo/ex1/attention-is-all-you-need.nodegraph.json'))
  assert.deepEqual(runtime.schemas.validate('nodegraph.schema.json', graph, 'legacy'), [])
})

test('unmigrated projects reject all Phase 3 write paths', async t => {
  const context = await phase2Project(t)
  const appraisal = await appraisalFor(context, 'paper_001', 'ai')
  const outcomes = await Promise.all([
    context.phase3.importClaim(context.manifestPath, claimProposal(), AGENT),
    context.phase3.importConflict(context.manifestPath, conflictProposal(), AGENT),
    context.phase3.importAppraisal(context.manifestPath, appraisal, AGENT),
    context.phase3.reviewClaim(context.manifestPath, 'claim_001', 'approved'),
    context.phase3.reviewConflict(context.manifestPath, 'conflict_001', 'approved'),
    context.phase3.reviewAppraisal(context.manifestPath, 'appraisal_001', 'approved'),
    context.phase3.recalculateConfidence(context.manifestPath, 'claim_001'),
  ])
  for (const outcome of outcomes) {
    assertRejectedWith(outcome, 'phase3-migration-required')
  }
})

test('unsupported Phase 3 documents reject writes without changing bytes', async t => {
  const context = await phase3Project(t)
  const claims = await claimsOf(context)
  claims.schema.version = '9.0.0'
  await writeJson(claimsPath(context), claims)
  const before = await readFile(claimsPath(context))
  const outcome = await context.phase3.importClaim(context.manifestPath, claimProposal(), AGENT)
  assertRejectedWith(outcome, 'unsupported-newer-version')
  assert.deepEqual(await readFile(claimsPath(context)), before)
})

test('conflicts without dissenting relationships are rejected', async t => {
  const context = await projectWithClaim(t, 'supports')
  const conflict = conflictProposal()
  conflict.findingRefs[1].relationship = 'supports'
  const outcome = await context.phase3.importConflict(context.manifestPath, conflict, AGENT)
  assertRejectedWith(outcome, 'conflict-dissent-required')
})

test('agents cannot approve conflicts, appraisals, or paradigm decisions', async t => {
  const context = await projectWithClaim(t)
  const conflict = conflictProposal()
  conflict.reviewState.approval.researcher = 'approved'
  const conflictOutcome = await context.phase3.importConflict(
    context.manifestPath, conflict, AGENT
  )
  assertRejectedWith(conflictOutcome, 'agent-proposal-state-required')
  const appraisal = await appraisalFor(context, 'paper_001', 'ai')
  appraisal.reviewState.approval.researcher = 'approved'
  const appraisalOutcome = await context.phase3.importAppraisal(
    context.manifestPath, appraisal, AGENT
  )
  assertRejectedWith(appraisalOutcome, 'agent-proposal-state-required')
  const decision = await context.runtime.claims.decideParadigm(
    context.root,
    await manifestOf(context),
    'claim_001',
    'approved',
    'Agent rationale',
    calculateDocumentRevision(await claimsOf(context)),
    AGENT
  )
  assert.equal(decision.accepted, false)
  const manifest = await manifestOf(context)
  const claims = await claimsOf(context)
  const direct = await context.runtime.synthesis.applyMutation(context.root, manifest, {
    mutationId: 'mutation_agent_paradigm_decision',
    targetDocument: manifest.documents.claims,
    baseRevision: calculateDocumentRevision(claims),
    operations: [{
      op: 'replace',
      path: '/claims/0/paradigmDecision',
      value: {
        required: true,
        status: 'approved',
        rationale: 'Agent decision',
        decidedBy: 'claim-extractor',
        decidedAt: FIXED_TIME,
      },
    }],
    requestedAt: FIXED_TIME,
    actor: AGENT,
  })
  assert.equal(direct.accepted, false)
  assert.ok(direct.diagnostics?.some(item =>
    item.code === 'paradigm-decision-authority-required'))
})

test('confidence service never turns unknown appraisal data into weakness', async t => {
  const context = await projectWithClaim(t, 'supports')
  await installApprovedAppraisals(context)
  const appraisals = await appraisalsOf(context)
  appraisals.appraisals[0].fields.targetPopulationRelevance = unknownField()
  await writeJson(appraisalsPath(context), appraisals)
  await context.phase3.recalculateConfidence(context.manifestPath, 'claim_001')
  assert.equal((await claimsOf(context)).claims[0].confidence?.label, 'not-assessed')
})

test('ledger rows keep disputed analytical state visible', async t => {
  const context = await phase3Project(t)
  const claim = claimProposal()
  claim.reviewState.verification.classification = 'disputed'
  claim.reviewState.origin = 'human'
  await context.phase3.importClaim(context.manifestPath, claim, HUMAN)
  const ledger = await context.phase3.openLedger(context.manifestPath)
  assert.ok(ledger.ledger?.entries[0].warnings.includes('disputed-classification'))
  assert.equal(ledger.ledger?.entries[0].origin, 'human')
})

async function baseProject(
  t: TestContext,
  writer?: AtomicJsonWriter
): Promise<Context> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'nodegraph-phase3-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const runtime = createRuntime(writer)
  const phase1 = new Phase1ProjectService(runtime)
  const phase2 = new Phase2ProjectService(runtime)
  const phase3 = new Phase3ProjectService(runtime, new FixedClock())
  const manifestPath = path.join(root, MANIFEST_NAME)
  await phase1.create(root, 'project_phase3_test', 'Phase 3 Test')
  return { root, manifestPath, runtime, phase1, phase2, phase3 }
}

async function phase2Project(
  t: TestContext,
  writer?: AtomicJsonWriter,
  paradigms?: string[],
  paperCount = 2
): Promise<Context> {
  const context = await baseProject(t, writer)
  for (let index = 1; index <= paperCount; index++) {
    await writePaperFiles(context, index)
    const outcome = await context.phase1.registerPaper(context.manifestPath, {
      paperId: paperId(index),
      paperPath: graphPath(index),
      sourceId: `source_${index.toString().padStart(3, '0')}`,
    })
    assert.equal(outcome.mutation.accepted, true)
  }
  await writeTaxonomy(context)
  await writeEvidence(context, paperCount)
  for (let index = 1; index <= paperCount; index++) {
    await writeExtraction(context, await extractionFixture(
      index,
      paradigms?.[index - 1] ?? 'pragmatist'
    ))
  }
  return context
}

async function phase3Project(
  t: TestContext,
  writer?: AtomicJsonWriter,
  paradigms?: string[],
  paperCount = 2
): Promise<Context> {
  const context = await phase2Project(t, writer, paradigms, paperCount)
  const outcome = await context.phase3.migrate(context.manifestPath)
  assert.equal(outcome.mutation.accepted, true, outcome.diagnostics.map(item => item.code).join(', '))
  context.runtime.papers.resetInstrumentation()
  return context
}

async function projectWithClaim(
  t: TestContext,
  secondRelationship: FindingRelationship = 'contradicts'
): Promise<Context> {
  const context = await phase3Project(t)
  const claim = claimProposal()
  claim.findingRefs[1].relationship = secondRelationship
  const outcome = await context.phase3.importClaim(context.manifestPath, claim, AGENT)
  assert.equal(outcome.mutation.accepted, true, outcome.diagnostics.map(item => item.code).join(', '))
  return context
}

async function projectWithConflict(t: TestContext): Promise<Context> {
  const context = await projectWithClaim(t)
  const outcome = await context.phase3.importConflict(
    context.manifestPath, conflictProposal(), AGENT
  )
  assert.equal(outcome.mutation.accepted, true, outcome.diagnostics.map(item => item.code).join(', '))
  return context
}

function createRuntime(writer?: AtomicJsonWriter): ProjectRuntime {
  return createProjectRuntime({
    schemaRoot: path.join(REPOSITORY_ROOT, 'docs', 'schemas'),
    legacySchemaPath: path.join(REPOSITORY_ROOT, 'schema', 'nodegraph.schema.json'),
    clock: new FixedClock(),
    ...(writer ? { writer } : {}),
  })
}

async function writePaperFiles(context: Context, index: number): Promise<void> {
  await writeJson(path.join(context.root, graphPath(index)), createGraph(index))
  await mkdir(path.dirname(path.join(context.root, pdfPath(index))), { recursive: true })
  await writeFile(path.join(context.root, pdfPath(index)), `PDF paper ${index}`)
}

function createGraph(index: number): NodeGraph {
  return {
    version: '1.0.0',
    title: `Paper ${index}`,
    created: FIXED_TIME,
    modified: FIXED_TIME,
    source: {
      pdf: path.basename(pdfPath(index)),
      authors: `Author ${index}`,
      venue: 'Research Journal',
      doi: `10.1000/phase3-${index}`,
      pages: 20,
    },
    nodeTemplates: {
      claim: { label: 'Claim', color: '#000000', icon: 'quote', shape: 'sharp' },
    },
    nodes: [{
      id: `node_${index}`,
      template: 'claim',
      title: `Finding ${index}`,
      content: `Finding ${index}`,
      original: { text: `Exact quote from Paper ${index}.`, location: 'p. 10' },
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

async function extractionFixture(index: number, paradigm: string): Promise<ExtractionDocument> {
  const source = await fixtureJson<ExtractionDocument>('valid/extraction.json')
  const text = JSON.stringify(source)
    .replaceAll('paper_001', paperId(index))
    .replaceAll('extraction_001', `extraction_${index.toString().padStart(3, '0')}`)
    .replaceAll('finding_001', findingId(index))
    .replaceAll('evidence_001', evidenceId(index))
    .replaceAll('node_claim_04', `node_${index}`)
    .replaceAll('pragmatist', paradigm)
    .replaceAll('Shared leadership improves trust.', `Exact quote from Paper ${index}.`)
  return JSON.parse(text) as ExtractionDocument
}

async function writeTaxonomy(context: Context): Promise<void> {
  const manifest = await manifestOf(context)
  await writeJson(path.join(context.root, manifest.documents.constructs), {
    schema: { name: 'nodegraph-construct-taxonomy', version: '1.0.0' },
    taxonomyVersion: 1,
    constructs: [{
      constructId: 'construct_shared_leadership',
      canonicalName: 'Shared leadership',
      aliases: [],
      status: 'approved',
      reviewState: approvedReviewState(),
    }],
    modified: FIXED_TIME,
  })
}

async function writeEvidence(context: Context, count: number): Promise<void> {
  const manifest = await manifestOf(context)
  const evidence: EvidenceRecord[] = []
  for (let index = 1; index <= count; index++) {
    const registration = manifest.papers[index - 1]
    const quote = `Exact quote from Paper ${index}.`
    const record: EvidenceRecord = {
      evidenceId: evidenceId(index),
      paperId: paperId(index),
      nodeId: `node_${index}`,
      source: { ...registration.source },
      quote: { text: quote, quoteContentHash: calculateQuoteContentHash(quote) },
      locator: { page: 10, exact: quote },
      evidenceObjectHash: `sha256:${'0'.repeat(64)}`,
      reviewState: approvedReviewState(),
      created: FIXED_TIME,
      modified: FIXED_TIME,
    }
    record.evidenceObjectHash = calculateEvidenceObjectHash(record)
    evidence.push(record)
  }
  await writeJson(path.join(context.root, manifest.documents.evidence), {
    schema: { name: 'nodegraph-evidence-records', version: '1.0.0' },
    evidence,
    modified: FIXED_TIME,
  })
}

function claimProposal(): SynthesisClaim {
  return {
    claimId: 'claim_001',
    text: 'Shared leadership improves trust across the reviewed studies.',
    claimType: 'synthesis',
    findingRefs: [
      { paperId: 'paper_001', findingId: 'finding_001', relationship: 'supports' },
      { paperId: 'paper_002', findingId: 'finding_002', relationship: 'contradicts' },
    ],
    evidenceRefs: ['evidence_001', 'evidence_002'],
    constructRefs: ['construct_shared_leadership'],
    paradigmDecision: { required: false, status: 'not-required' },
    reviewState: pendingReviewState('ai'),
    created: FIXED_TIME,
    modified: FIXED_TIME,
  }
}

function conflictProposal(): ConflictRecord {
  return {
    conflictId: 'conflict_001',
    claimId: 'claim_001',
    conflictType: 'direct-empirical-inconsistency',
    findingRefs: structuredClone(claimProposal().findingRefs),
    possibleExplanations: [],
    contextComparisons: [],
    reviewState: pendingReviewState('ai'),
    created: FIXED_TIME,
    modified: FIXED_TIME,
  }
}

async function appraisalFor(
  context: Context,
  paper: string,
  origin: ReviewState['origin'],
  strongerDissent = false
): Promise<EvidenceAppraisal> {
  const manifest = await manifestOf(context)
  const registration = manifest.papers.find(item => item.paperId === paper)!
  const extraction = await extractionOf(context, paper)
  const suffix = paper.slice('paper_'.length)
  const fields = Object.fromEntries([
    'peerReviewed', 'studyDesign', 'sampleSize', 'samplingMethod',
    'measurementValidity', 'reliability', 'studyTiming', 'selfReportDependence',
    'replicationStatus', 'methodologicalLimitations', 'targetPopulationRelevance',
    'methodologicalParadigm', 'analyticalTechnique',
  ].map(name => [name, assessedField(name, evidenceId(Number(suffix)), strongerDissent)])) as EvidenceAppraisal['fields']
  return {
    appraisalId: `appraisal_${suffix}`,
    paperId: paper,
    sourceDocumentHash: registration.source.sourceDocumentHash,
    extractionRevision: calculateDocumentRevision(extraction),
    fields,
    reviewState: origin === 'human' ? approvedReviewState() : pendingReviewState(origin),
    created: FIXED_TIME,
    modified: FIXED_TIME,
  }
}

function assessedField(
  name: string,
  evidence: string,
  strongerDissent: boolean
): AppraisalField {
  const normalizedValue = name === 'targetPopulationRelevance'
    ? 'high'
    : name === 'methodologicalLimitations'
      ? strongerDissent ? 'minor' : 'minor'
      : name === 'measurementValidity'
        ? 'adequate'
        : 'reported'
  return {
    status: 'present',
    sourceText: `${name} source statement`,
    normalizedValue,
    evidenceIds: [evidence],
  }
}

async function installApprovedAppraisals(
  context: Context,
  strongerDissent = false
): Promise<void> {
  const manifest = await manifestOf(context)
  const appraisals = await Promise.all(manifest.papers.map(paper =>
    appraisalFor(
      context,
      paper.paperId,
      'human',
      strongerDissent && paper.paperId === 'paper_002'
    )))
  await writeJson(appraisalsPath(context), {
    schema: { name: 'nodegraph-evidence-appraisals', version: '1.2.0' },
    appraisals,
    modified: FIXED_TIME,
  })
}

async function setEvidenceSourceState(
  context: Context,
  targetId: string,
  state: EvidenceRecord['reviewState']['verification']['source']
): Promise<void> {
  const manifest = await manifestOf(context)
  const document: any = await readJson(path.join(context.root, manifest.documents.evidence))
  document.evidence.find((item: EvidenceRecord) => item.evidenceId === targetId)
    .reviewState.verification.source = state
  await writeJson(path.join(context.root, manifest.documents.evidence), document)
}

function approvedReviewState(): ReviewState {
  return {
    verification: { source: 'verified', interpretation: 'verified', classification: 'verified' },
    approval: { researcher: 'approved', advisor: 'not-reviewed' },
    origin: 'human',
  }
}

function unknownField(): AppraisalField {
  return { status: 'not-assessed', evidenceIds: [] }
}

function replaceReviewStates(value: unknown, replacement: ReviewState): void {
  if (Array.isArray(value)) return value.forEach(item => replaceReviewStates(item, replacement))
  if (!value || typeof value !== 'object') return
  const record = value as Record<string, unknown>
  for (const [key, child] of Object.entries(record)) {
    if (key === 'reviewState') record[key] = structuredClone(replacement)
    else replaceReviewStates(child, replacement)
  }
}

function assertRejectedWith(
  outcome: { mutation: { accepted: boolean }; diagnostics: Array<{ code: string }> },
  code: string
): void {
  assert.equal(outcome.mutation.accepted, false)
  assert.ok(outcome.diagnostics.some(item => item.code === code),
    `Expected ${code}; received ${outcome.diagnostics.map(item => item.code).join(', ')}`)
}

async function manifestOf(context: Context): Promise<ProjectManifest> {
  return readJson(context.manifestPath)
}

async function claimsOf(context: Context) {
  return readJson<Awaited<ReturnType<ProjectRuntime['synthesis']['readClaims']>>['value'] & {}>(claimsPath(context))
}

async function conflictsOf(context: Context) {
  const manifest = await manifestOf(context)
  return readJson<{ conflicts: ConflictRecord[]; modified: string }>(
    path.join(context.root, manifest.documents.conflicts)
  )
}

async function appraisalsOf(context: Context) {
  return readJson<{ appraisals: EvidenceAppraisal[]; modified: string }>(appraisalsPath(context))
}

async function auditActions(context: Context): Promise<string[]> {
  const manifest = await manifestOf(context)
  const audit = await context.runtime.audit.inspect(context.root, manifest.documents.auditLog)
  return audit.events.map(item => item.action)
}

async function extractionOf(context: Context, id: string): Promise<ExtractionDocument> {
  const manifest = await manifestOf(context)
  const registration = manifest.papers.find(item => item.paperId === id)!
  return readJson(path.join(context.root, registration.extractionPath!))
}

async function writeExtraction(context: Context, extraction: ExtractionDocument): Promise<void> {
  const manifest = await manifestOf(context)
  const registration = manifest.papers.find(item => item.paperId === extraction.paperId)!
  await writeJson(path.join(context.root, registration.extractionPath!), extraction)
}

function claimsPath(context: Context): string {
  return path.join(context.root, 'synthesis/claims-v1.2.json')
}

function appraisalsPath(context: Context): string {
  return path.join(context.root, 'synthesis/evidence-appraisals-v1.2.json')
}

function ledgerPath(context: Context): string {
  return path.join(context.root, 'indexes/claims.index.json')
}

function paperId(index: number): string { return `paper_${index.toString().padStart(3, '0')}` }
function findingId(index: number): string { return `finding_${index.toString().padStart(3, '0')}` }
function evidenceId(index: number): string { return `evidence_${index.toString().padStart(3, '0')}` }
function graphPath(index: number): string { return `papers/paper-${index}.nodegraph.json` }
function pdfPath(index: number): string { return `papers/paper-${index}.pdf` }

async function fixtureJson<T = unknown>(relativePath: string): Promise<T> {
  return readJson(path.join(REPOSITORY_ROOT, 'docs/schemas/fixtures', relativePath))
}

async function claimLedgerScript(): Promise<string> {
  const source = await readFile(path.join(
    REPOSITORY_ROOT, 'src/extension/project/ClaimLedgerPanel.ts'
  ), 'utf8')
  const html = evaluateLedgerTemplate(source)
  const match = html.match(/<script nonce="testnonce">([\s\S]*)<\/script>/)
  assert.ok(match, 'Claim-ledger inline script was not found.')
  return match[1]
}

function evaluateLedgerTemplate(source: string): string {
  const tick = String.fromCharCode(96)
  const owner = source.indexOf('function ledgerHtml(')
  const start = source.indexOf(`return ${tick}`, owner) + 8
  const end = source.indexOf(`${tick}\n}`, start)
  assert.ok(owner >= 0 && start >= 8 && end > start, 'Claim-ledger HTML was not found.')
  const template = source.slice(start, end)
  return new Function('nonce', `return ${tick}${template}${tick}`)('testnonce') as string
}

async function readJson<T = unknown>(file: string): Promise<T> {
  return JSON.parse(await readFile(file, 'utf8')) as T
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`)
}
