import test, { TestContext } from 'node:test'
import assert from 'node:assert/strict'
import {
  access,
  appendFile,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  unlink,
  writeFile,
} from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
import { AtomicJsonWriter } from '../src/extension/project/AtomicJsonWriter'
import { AuditLogError } from '../src/extension/project/AuditLog'
import {
  calculateByteHash,
  calculateDocumentRevision,
  calculateEvidenceObjectHash,
  calculateQuoteContentHash,
  canonicalJson,
} from '../src/extension/project/canonical'
import {
  Phase1ProjectError,
  Phase1ProjectService,
} from '../src/extension/project/Phase1ProjectService'
import { MutationAuditError } from '../src/extension/project/MutationRepository'
import { createEmptyExtraction } from '../src/extension/project/extractionDefaults'
import {
  createProjectRuntime,
  ProjectRuntime,
} from '../src/extension/project/ProjectRuntime'
import { ProjectPathError } from '../src/extension/project/ProjectPathResolver'
import {
  Clock,
  EvidenceRecord,
  MutationEnvelope,
  PaperRegistration,
  ProjectManifest,
} from '../src/extension/project/types'
import { NodeGraph } from '../src/webview/types/graph'

const REPOSITORY_ROOT = process.cwd()
const MANIFEST_NAME = 'project.nodegraph.json'
const FIXED_TIME = '2026-07-30T14:00:00.000Z'

interface ProjectContext {
  root: string
  manifestPath: string
  runtime: ProjectRuntime
  service: Phase1ProjectService
}

class FixedClock implements Clock {
  public now(): string {
    return FIXED_TIME
  }
}

test('valid project opens successfully', async t => {
  const context = await createProject(t)
  const opened = await context.service.open(context.manifestPath)
  assert.equal(opened.mode, 'read-write')
  assert.equal(opened.manifest?.projectId, 'project_phase1_test')
  assert.equal(opened.hydrationCount, 0)
})

test('project initialization records absent base revisions', async t => {
  const context = await createProject(t)
  const manifest = await readManifest(context)
  const audit = await context.runtime.audit.inspect(context.root, manifest.documents.auditLog)
  const creationEvents = audit.events.filter(event =>
    event.action === 'project.created' || event.action === 'project.document-created'
  )
  assert.equal(creationEvents.length, 8)
  assert.ok(creationEvents.every(event => event.baseRevision === 'absent'))
  assert.ok(creationEvents.every(event => event.resultingRevision?.startsWith('sha256:')))
})

test('failed project initialization removes only files created by that attempt', async t => {
  const root = await temporaryDirectory(t)
  let failCreation = true
  const writer = new AtomicJsonWriter({
    beforeReplace: async target => {
      if (failCreation && target.endsWith(path.join('synthesis', 'gaps.json'))) {
        failCreation = false
        throw new Error('injected-project-creation-failure')
      }
    },
  })
  const runtime = createRuntime(writer)
  const service = new Phase1ProjectService(runtime)
  await assert.rejects(
    service.create(root, 'project_retry', 'Retry Project'),
    /injected-project-creation-failure/
  )
  for (const relativePath of initialProjectFilePaths()) {
    await assert.rejects(access(path.join(root, relativePath)), relativePath)
  }
  const retry = await service.create(root, 'project_retry', 'Retry Project')
  assert.equal(retry.mode, 'read-write')
})

test('project initialization preserves pre-existing subordinate files', async t => {
  const root = await temporaryDirectory(t)
  const existing = path.join(root, 'synthesis/claims.json')
  const existingBytes = '{"belongsTo":"user"}\n'
  await mkdir(path.dirname(existing), { recursive: true })
  await writeFile(existing, existingBytes)
  const service = new Phase1ProjectService(createRuntime())
  await assert.rejects(
    service.create(root, 'project_collision', 'Collision Project'),
    /Project file already exists/
  )
  assert.equal(await readFile(existing, 'utf8'), existingBytes)
  await assert.rejects(access(path.join(root, MANIFEST_NAME)))
})

test('100-paper project opens without graph hydration', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 100)
  await rebuildDirect(context, true)
  context.runtime.papers.resetInstrumentation()
  for (let attempt = 0; attempt < 3; attempt++) {
    const opened = await context.service.open(context.manifestPath)
    assert.equal(opened.paperIndex?.entries.length, 100)
    assert.deepEqual(context.runtime.papers.instrumentation(), { count: 0, paperIds: [] })
  }
})

test('legacy single-paper graph opens without changing its bytes', async t => {
  const context = await createProject(t)
  const source = path.join(REPOSITORY_ROOT, 'demo/ex1/attention-is-all-you-need.nodegraph.json')
  const target = path.join(context.root, 'papers/legacy.nodegraph.json')
  await mkdir(path.dirname(target), { recursive: true })
  await copyFile(source, target)
  const before = await readFile(target)
  const result = await context.runtime.papers.read(
    context.root,
    provisionalPaper('paper_legacy', 'papers/legacy.nodegraph.json')
  )
  assert.ok(result.graph)
  assert.equal(result.diagnostics.length, 0)
  assert.deepEqual(await readFile(target), before)
})

test('all five legacy fixtures remain valid and unchanged', async t => {
  const context = await createProject(t)
  await mkdir(path.join(context.root, 'papers'), { recursive: true })
  const fixtures = [
    'demo/ex1/attention-is-all-you-need.nodegraph.json',
    'demo/ex2/point-transformer.nodegraph.json',
    'demo/ex3/mooncake.nodegraph.json',
    'demo/ex4/3d-gaussian-splatting.nodegraph.json',
    'demo/ex5/mental-illness-terms-and-hermeneutic-hijacking.nodegraph.json',
  ]
  for (const [index, fixture] of fixtures.entries()) {
    const target = path.join(context.root, `papers/legacy-${index}.nodegraph.json`)
    await copyFile(path.join(REPOSITORY_ROOT, fixture), target)
    const before = await readFile(target)
    const read = await context.runtime.papers.read(
      context.root,
      provisionalPaper(`paper_legacy_${index}`, `papers/legacy-${index}.nodegraph.json`)
    )
    assert.ok(read.graph, fixture)
    assert.equal(read.diagnostics.length, 0, fixture)
    assert.deepEqual(await readFile(target), before)
  }
})

test('invalid paper JSON returns an actionable diagnostic', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 1)
  await writeFile(path.join(context.root, 'papers/paper-000.nodegraph.json'), '{"broken":')
  const report = await context.service.validate(context.manifestPath)
  assertDiagnostic(report.diagnostics, 'invalid-json', 'Correct the JSON syntax')
})

test('unsupported project schema opens read-only', async t => {
  const context = await createProject(t)
  const manifest = await readManifest(context)
  manifest.schema.version = '2.0.0'
  await writeJson(context.manifestPath, manifest)
  const opened = await context.service.open(context.manifestPath)
  assert.equal(opened.mode, 'read-only')
  assertDiagnostic(opened.diagnostics, 'unsupported-newer-version', 'newer application')
})

test('unsupported subordinate schema is preserved and cannot be written', async t => {
  const context = await createProject(t)
  const manifest = await readManifest(context)
  const claimsPath = path.join(context.root, manifest.documents.claims)
  const claims: any = await readJson(claimsPath)
  claims.schema.version = '2.0.0'
  await writeJson(claimsPath, claims)
  const before = await readFile(claimsPath)
  const result = await context.runtime.synthesis.applyMutation(context.root, manifest, {
    mutationId: 'mutation_unsupported_schema',
    targetDocument: manifest.documents.claims,
    baseRevision: calculateDocumentRevision(claims),
    operations: [{ op: 'replace', path: '/modified', value: '2026-07-30T15:00:00.000Z' }],
    requestedAt: FIXED_TIME,
    actor: { type: 'human', id: 'researcher' },
  })
  assert.equal(result.accepted, false)
  assertDiagnostic(result.diagnostics ?? [], 'unsupported-newer-version', 'newer application')
  assert.deepEqual(await readFile(claimsPath), before)
})

test('public service errors retain diagnostic codes for read-only projects', async t => {
  const context = await createProject(t)
  const manifest = await readManifest(context)
  manifest.schema.version = '2.0.0'
  await writeJson(context.manifestPath, manifest)
  await assert.rejects(
    context.service.rebuildIndexes(context.manifestPath),
    (error: unknown) => {
      assert.ok(error instanceof Phase1ProjectError)
      assert.equal(error.code, 'project-read-only')
      assert.ok(error.diagnostics.some(item => item.code === 'unsupported-newer-version'))
      return true
    }
  )
})

test('missing authoritative source hash is reported', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 1)
  const manifest: any = await readManifest(context)
  delete manifest.papers[0].source.sourceDocumentHash
  await writeJson(context.manifestPath, manifest)
  const opened = await context.service.open(context.manifestPath)
  assertDiagnostic(opened.diagnostics, 'schema-required', 'required property')
})

test('duplicate paper identifiers are rejected', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 2)
  const manifest = await readManifest(context)
  manifest.papers[1].paperId = manifest.papers[0].paperId
  await writeJson(context.manifestPath, manifest)
  const opened = await context.service.open(context.manifestPath)
  assertDiagnostic(opened.diagnostics, 'duplicate-paper-id', 'unique')
})

test('absolute PDF paths are rejected', async () => {
  const runtime = createRuntime()
  const fixture = await readJson<any>(
    path.join(REPOSITORY_ROOT, 'docs/schemas/fixtures/invalid/absolute-source-path-project.json')
  )
  const diagnostics = runtime.schemas.validate('project.schema.json', fixture, MANIFEST_NAME)
  assertDiagnostic(diagnostics, 'schema-pattern', 'documented schema')
})

test('traversal PDF paths are rejected', async () => {
  const runtime = createRuntime()
  const fixture = await readJson<any>(
    path.join(REPOSITORY_ROOT, 'docs/schemas/fixtures/invalid/traversal-source-path-project.json')
  )
  const diagnostics = runtime.schemas.validate('project.schema.json', fixture, MANIFEST_NAME)
  assertDiagnostic(diagnostics, 'schema-pattern', 'documented schema')
})

test('canonical path containment rejects a symlink outside the project', async t => {
  const context = await createProject(t)
  const outside = await mkdtemp(path.join(os.tmpdir(), 'nodegraph-outside-'))
  t.after(() => rm(outside, { recursive: true, force: true }))
  await writeFile(path.join(outside, 'outside.json'), '{}')
  await symlink(outside, path.join(context.root, 'escape'))
  await assert.rejects(
    context.runtime.paths.resolve(context.root, 'escape/outside.json', true),
    (error: unknown) => error instanceof ProjectPathError && error.code === 'path-outside-project'
  )
})

test('creation targets reject an existing parent symlink outside the project', async t => {
  const context = await createProject(t)
  const outside = await mkdtemp(path.join(os.tmpdir(), 'nodegraph-outside-parent-'))
  t.after(() => rm(outside, { recursive: true, force: true }))
  await symlink(outside, path.join(context.root, 'escaped-parent'))
  await assert.rejects(
    context.runtime.paths.resolve(context.root, 'escaped-parent/new/index.json'),
    (error: unknown) => error instanceof ProjectPathError && error.code === 'path-outside-project'
  )
  await assert.rejects(access(path.join(outside, 'new/index.json')))
})

test('paper-relative source paths use the shared path policy', async t => {
  const context = await createProject(t)
  const graphPath = await writeUnregisteredPaper(context, 0)
  const graph = await readJson<NodeGraph>(graphPath)
  if (graph.source) graph.source.pdf = '../outside.pdf'
  await writeJson(graphPath, graph)
  await assert.rejects(
    context.service.registerPaper(context.manifestPath, {
      paperId: 'paper_000',
      paperPath: paperGraphPath(0),
      sourceId: 'source_000',
    }),
    (error: unknown) => {
      assert.ok(error instanceof Phase1ProjectError)
      assert.equal(error.code, 'path-traversal')
      assert.ok(error.diagnostics.some(item => item.code === 'path-traversal'))
      return true
    }
  )
})

test('missing registered paper file is reported', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 1)
  await unlink(path.join(context.root, 'papers/paper-000.nodegraph.json'))
  const opened = await context.service.open(context.manifestPath)
  assertDiagnostic(opened.diagnostics, 'missing-paper-file', 'Restore')
})

test('missing registered source PDF is reported', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 1)
  await unlink(path.join(context.root, 'papers/paper-000.pdf'))
  const opened = await context.service.open(context.manifestPath)
  assertDiagnostic(opened.diagnostics, 'missing-source-file', 'Restore')
})

test('replacing a source PDF produces a stale-source warning', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 1)
  await rebuildDirect(context, true)
  await writeFile(path.join(context.root, 'papers/paper-000.pdf'), 'replacement bytes')
  const report = await context.service.validate(context.manifestPath)
  const diagnostic = findDiagnostic(report.diagnostics, 'source-document-hash-mismatch')
  assert.equal(diagnostic.severity, 'warning')
})

test('quotation hash mismatch produces a stale-evidence warning', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 1)
  const manifest = await readManifest(context)
  const evidence = createEvidence(manifest.papers[0], 'finding_000')
  evidence.quote.quoteContentHash = `sha256:${'1'.repeat(64)}`
  await writeEvidence(context, [evidence])
  const report = await context.service.validate(context.manifestPath)
  assertDiagnostic(report.diagnostics, 'stale-quotation-hash', 'review')
})

test('claim referencing missing authoritative evidence is reported', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 1)
  const manifest = await readManifest(context)
  await writeClaims(context, manifest, [createClaim('evidence_missing')])
  const report = await context.service.validate(context.manifestPath)
  assertDiagnostic(report.diagnostics, 'missing-evidence-reference', 'Restore')
})

test('deleting both indexes preserves authoritative files', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 1)
  const manifest = await readManifest(context)
  await writeEvidence(context, [createEvidence(manifest.papers[0], 'finding_000')])
  await rebuildDirect(context, true)
  const authoritativeBefore = await authoritativeSnapshot(context)
  await deleteIndexes(context)
  const opened = await context.service.open(context.manifestPath)
  assert.equal(opened.manifest?.papers.length, 1)
  assert.deepEqual(await authoritativeSnapshot(context), authoritativeBefore)
})

test('deleted indexes rebuild from authoritative data', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 1)
  const manifest = await readManifest(context)
  const evidence = createEvidence(manifest.papers[0], 'finding_000')
  await writeEvidence(context, [evidence])
  await rebuildDirect(context, true)
  await deleteIndexes(context)
  const rebuilt = await context.service.rebuildIndexes(context.manifestPath)
  assert.equal(rebuilt.paperIndex.entries.length, 1)
  assert.equal(rebuilt.evidenceIndex.entries[0].evidenceId, evidence.evidenceId)
  assert.equal(rebuilt.evidenceIndex.entries[0].evidenceObjectHash, evidence.evidenceObjectHash)
})

test('an invalid paper index is replaced from authoritative data', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 1)
  const manifest = await readManifest(context)
  const indexPath = path.join(context.root, manifest.documents.paperIndex)
  await writeJson(indexPath, { invalid: true })
  const rebuilt = await context.service.rebuildIndexes(context.manifestPath, true)
  assert.equal(rebuilt.paperIndex.entries.length, 1)
  assertDiagnostic(rebuilt.diagnostics, 'invalid-derived-index', 'Rebuild')
  assert.deepEqual(await readJson(indexPath), rebuilt.paperIndex)
})

test('incremental indexing hydrates only the changed paper', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 2)
  await rebuildDirect(context, true)
  const graphPath = path.join(context.root, 'papers/paper-001.nodegraph.json')
  const graph = await readJson<NodeGraph>(graphPath)
  graph.title = 'Changed Paper'
  await writeJson(graphPath, graph)
  context.runtime.papers.resetInstrumentation()
  const rebuilt = await context.service.rebuildIndexes(context.manifestPath)
  assert.deepEqual(rebuilt.processedPaperIds, ['paper_001'])
  assert.deepEqual(rebuilt.reusedPaperIds, ['paper_000'])
  assert.deepEqual(context.runtime.papers.instrumentation().paperIds, ['paper_001'])
})

test('taxonomy version changes invalidate reusable paper index entries', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 2)
  await rebuildDirect(context, true)
  const manifest = await readManifest(context)
  const taxonomyPath = path.join(context.root, manifest.documents.constructs)
  const taxonomy = await readJson<{ taxonomyVersion: number } & Record<string, unknown>>(
    taxonomyPath
  )
  taxonomy.taxonomyVersion = 2
  await writeJson(taxonomyPath, taxonomy)
  context.runtime.papers.resetInstrumentation()
  const rebuilt = await context.service.rebuildIndexes(context.manifestPath)
  assert.deepEqual(rebuilt.processedPaperIds, ['paper_000', 'paper_001'])
  assert.deepEqual(rebuilt.reusedPaperIds, [])
  assert.ok(rebuilt.paperIndex.entries.every(entry => entry.taxonomyVersion === 2))
})

test('metadata search uses the paper index without hydration', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 2)
  await rebuildDirect(context, true)
  context.runtime.papers.resetInstrumentation()
  const results = await context.service.search(context.manifestPath, { text: 'Author 1' })
  assert.equal(results.length, 1)
  assert.equal(results[0].paperId, 'paper_001')
  assert.equal(context.runtime.papers.instrumentation().count, 0)
})

test('indexing and search share metadata normalization', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 1)
  const graphPath = path.join(context.root, paperGraphPath(0))
  const graph = await readJson<NodeGraph & { tags?: string[] }>(graphPath)
  graph.title = '  Leadership Study  '
  if (graph.source) {
    graph.source.authors = '  Ada Researcher  '
    graph.source.doi = '  10.1000/NORMALIZED  '
  }
  graph.tags = [' Leadership ', 'leadership', '  evidence  ']
  await writeJson(graphPath, graph)
  await rebuildDirect(context, true)
  context.runtime.papers.resetInstrumentation()
  const byText = await context.service.search(context.manifestPath, { text: '  ADA RESEARCHER ' })
  const byDoi = await context.service.search(context.manifestPath, { doi: ' 10.1000/normalized ' })
  const byTag = await context.service.search(context.manifestPath, { tag: ' LEADERSHIP ' })
  assert.equal(byText[0].title, 'Leadership Study')
  assert.equal(byDoi[0].doi, '10.1000/NORMALIZED')
  assert.deepEqual(byTag[0].tags, ['Leadership', 'evidence'])
  assert.equal(context.runtime.papers.instrumentation().count, 0)
})

test('valid baseRevision mutation succeeds', async t => {
  const context = await createProject(t)
  const { manifest, envelope } = await claimsMutation(context)
  const result = await context.runtime.synthesis.applyMutation(context.root, manifest, envelope)
  assert.equal(result.accepted, true)
})

test('stale baseRevision mutation is rejected', async t => {
  const context = await createProject(t)
  const { manifest, envelope } = await claimsMutation(context)
  assert.equal((await context.runtime.synthesis.applyMutation(context.root, manifest, envelope)).accepted, true)
  const stale = await context.runtime.synthesis.applyMutation(context.root, manifest, envelope)
  assert.equal(stale.accepted, false)
  assert.equal(stale.code, 'stale-revision')
  assert.deepEqual(stale.rejectedOperations, envelope.operations)
})

test('rejected stale mutation leaves authoritative state unchanged', async t => {
  const context = await createProject(t)
  const { manifest, envelope } = await claimsMutation(context)
  await context.runtime.synthesis.applyMutation(context.root, manifest, envelope)
  const claimsPath = path.join(context.root, manifest.documents.claims)
  const before = await readFile(claimsPath)
  await context.runtime.synthesis.applyMutation(context.root, manifest, envelope)
  assert.deepEqual(await readFile(claimsPath), before)
})

test('revision changes immediately before replacement reject the mutation', async t => {
  let replacement: { suffix: string; content: string } | undefined
  const writer = new AtomicJsonWriter({
    beforeReplace: async target => {
      if (replacement && target.endsWith(replacement.suffix)) {
        const pending = replacement
        replacement = undefined
        await writeFile(target, pending.content)
      }
    },
  })
  const context = await createProject(t, writer)
  const { manifest, envelope } = await claimsMutation(context)
  const target = path.join(context.root, manifest.documents.claims)
  const concurrent = await readJson<Record<string, unknown>>(target)
  concurrent.modified = '2026-07-30T15:30:00.000Z'
  const concurrentBytes = `${JSON.stringify(concurrent, null, 2)}\n`
  replacement = { suffix: path.join('synthesis', 'claims.json'), content: concurrentBytes }
  const result = await context.runtime.synthesis.applyMutation(context.root, manifest, envelope)
  assert.equal(result.accepted, false)
  assert.equal(result.code, 'stale-revision')
  assert.equal(result.currentRevision, calculateDocumentRevision(concurrent))
  assert.deepEqual(result.rejectedOperations, envelope.operations)
  assert.equal(await readFile(target, 'utf8'), concurrentBytes)
  assert.equal((await readdir(path.dirname(target))).filter(name => name.endsWith('.tmp')).length, 0)
})

test('failed candidate validation preserves original authoritative bytes', async t => {
  const context = await createProject(t)
  const { manifest, envelope } = await claimsMutation(context)
  const target = path.join(context.root, manifest.documents.claims)
  const before = await readFile(target)
  envelope.operations = [{ op: 'replace', path: '/claims', value: {} }]
  const result = await context.runtime.synthesis.applyMutation(context.root, manifest, envelope)
  assert.equal(result.accepted, false)
  assertDiagnostic(result.diagnostics ?? [], 'schema-type', 'documented schema')
  assert.deepEqual(await readFile(target), before)
})

test('absent revisions cannot create subordinate documents outside initialization', async t => {
  const context = await createProject(t)
  const manifest = await readManifest(context)
  const target = path.join(context.root, manifest.documents.claims)
  const claims = await readJson(target)
  await unlink(target)
  const result = await context.runtime.synthesis.applyMutation(context.root, manifest, {
    mutationId: 'mutation_disallowed_creation',
    targetDocument: manifest.documents.claims,
    baseRevision: 'absent',
    operations: [{ op: 'add', path: '', value: claims }],
    requestedAt: FIXED_TIME,
    actor: { type: 'human', id: 'researcher' },
  })
  assert.equal(result.accepted, false)
  assertDiagnostic(result.diagnostics ?? [], 'authoritative-creation-not-allowed', 'ProjectRegistry')
  await assert.rejects(access(target))
})

test('failed atomic replacement preserves prior JSON and removes temporary files', async t => {
  const root = await temporaryDirectory(t)
  const target = path.join(root, 'authoritative.json')
  await writeFile(target, '{"state":"before"}\n')
  const writer = new AtomicJsonWriter({
    beforeReplace: async () => { throw new Error('injected-write-failure') },
  })
  await assert.rejects(writer.write(target, { state: 'after' }), /injected-write-failure/)
  assert.equal(await readFile(target, 'utf8'), '{"state":"before"}\n')
  assert.equal((await readdir(root)).filter(name => name.endsWith('.tmp')).length, 0)
})

test('failed index batch preserves both previous valid indexes', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 1)
  await rebuildDirect(context, true)
  const manifest = await readManifest(context)
  const paperPath = path.join(context.root, manifest.documents.paperIndex)
  const evidencePath = path.join(context.root, manifest.documents.evidenceIndex)
  const paperBefore = await readFile(paperPath)
  const evidenceBefore = await readFile(evidencePath)
  const writer = new AtomicJsonWriter({
    beforeReplace: async target => {
      if (target.endsWith(manifest.documents.evidenceIndex.split('/').join(path.sep))) {
        throw new Error('injected-index-replacement-failure')
      }
    },
  })
  const failingRuntime = createRuntime(writer)
  await assert.rejects(
    failingRuntime.indexes.rebuild(context.root, manifest, true),
    /injected-index-replacement-failure/
  )
  assert.deepEqual(await readFile(paperPath), paperBefore)
  assert.deepEqual(await readFile(evidencePath), evidenceBefore)
  const indexFiles = await readdir(path.dirname(paperPath))
  assert.equal(indexFiles.filter(name => name.endsWith('.tmp') || name.endsWith('.backup')).length, 0)
})

test('registration reports index failure without hiding the committed mutation', async t => {
  let failIndexes = false
  const writer = new AtomicJsonWriter({
    beforeReplace: async target => {
      if (failIndexes && target.endsWith(path.join('indexes', 'evidence.index.json'))) {
        throw new Error('injected-registration-index-failure')
      }
    },
  })
  const context = await createProject(t, writer)
  await writeUnregisteredPaper(context, 0)
  failIndexes = true
  const outcome = await context.service.registerPaper(context.manifestPath, {
    paperId: 'paper_000',
    paperPath: paperGraphPath(0),
    sourceId: 'source_000',
  })
  assert.equal(outcome.mutation.accepted, true)
  assertDiagnostic(outcome.diagnostics, 'index-rebuild-failed', 'rebuild')
  assert.ok(outcome.indexFailure?.cause instanceof Error)
  assert.equal((await readManifest(context)).papers.length, 1)
})

test('audit events append and truncated final lines remain visible', async t => {
  const context = await createProject(t)
  const manifest = await readManifest(context)
  const initial = await context.runtime.audit.inspect(context.root, manifest.documents.auditLog)
  await context.runtime.audit.append(context.root, manifest.documents.auditLog, {
    actor: { type: 'service', id: 'Phase1Test' },
    action: 'index.rebuilt',
    objectId: manifest.projectId,
  })
  const appended = await context.runtime.audit.inspect(context.root, manifest.documents.auditLog)
  assert.equal(appended.events.length, initial.events.length + 1)
  const auditPath = path.join(context.root, manifest.documents.auditLog)
  await appendFile(auditPath, '{"eventId":')
  const inspected = await context.runtime.audit.inspect(context.root, manifest.documents.auditLog)
  assertDiagnostic(inspected.diagnostics, 'truncated-audit-final-line', 'repair')
  const validation = await context.service.validate(context.manifestPath)
  assertDiagnostic(validation.diagnostics, 'truncated-audit-final-line', 'repair')
  await assert.rejects(
    context.runtime.audit.append(context.root, manifest.documents.auditLog, {
      actor: { type: 'service', id: 'Phase1Test' },
      action: 'index.rebuilt',
      objectId: manifest.projectId,
    }),
    (error: unknown) => error instanceof AuditLogError && error.code === 'truncated-audit-final-line'
  )
})

test('missing audit log is visible and blocks authoritative replacement', async t => {
  const context = await createProject(t)
  const { manifest, envelope } = await claimsMutation(context)
  const claimsPath = path.join(context.root, manifest.documents.claims)
  const before = await readFile(claimsPath)
  await unlink(path.join(context.root, manifest.documents.auditLog))
  const validation = await context.service.validate(context.manifestPath)
  assertDiagnostic(validation.diagnostics, 'missing-audit-log', 'Restore')
  await assert.rejects(
    context.runtime.synthesis.applyMutation(context.root, manifest, envelope),
    (error: unknown) => error instanceof AuditLogError && error.code === 'missing-audit-log'
  )
  assert.deepEqual(await readFile(claimsPath), before)
})

test('audit append failure reports the committed revision and blocks later writes', async t => {
  let breakAuditAfterPreflight = false
  const writer = new AtomicJsonWriter({
    beforeReplace: async target => {
      if (
        breakAuditAfterPreflight &&
        target.endsWith(path.join('synthesis', 'claims.json'))
      ) {
        breakAuditAfterPreflight = false
        const projectRoot = path.dirname(path.dirname(target))
        await appendFile(path.join(projectRoot, 'audit/events.jsonl'), '{"eventId":')
      }
    },
  })
  const context = await createProject(t, writer)
  const { manifest, envelope } = await claimsMutation(context)
  const target = path.join(context.root, manifest.documents.claims)
  const before = await readFile(target)
  breakAuditAfterPreflight = true
  let failure: MutationAuditError | undefined
  try {
    await context.runtime.synthesis.applyMutation(context.root, manifest, envelope)
  } catch (error) {
    if (error instanceof MutationAuditError) failure = error
    else throw error
  }
  assert.ok(failure)
  assert.equal(failure.targetDocument, manifest.documents.claims)
  assert.match(failure.resultingRevision, /^sha256:/)
  assert.ok(failure.cause instanceof AuditLogError)
  assert.notDeepEqual(await readFile(target), before)
  const blocked = await context.runtime.synthesis.applyMutation(context.root, manifest, envelope)
  assert.equal(blocked.accepted, false)
  assert.equal(blocked.code, 'audit-recovery-required')
  const otherRoot = await temporaryDirectory(t)
  const otherProject = await context.service.create(
    otherRoot,
    'project_unaffected',
    'Unaffected Project'
  )
  assert.equal(otherProject.mode, 'read-write')
})

test('paper registration and removal are audited without changing the paper graph', async t => {
  const context = await createProject(t)
  const graphPath = await writeUnregisteredPaper(context, 0)
  const before = await readFile(graphPath)
  const registered = await context.service.registerPaper(context.manifestPath, {
    paperId: 'paper_000',
    paperPath: 'papers/paper-000.nodegraph.json',
    sourceId: 'source_000',
  })
  assert.equal(registered.mutation.accepted, true)
  const removed = await context.service.unregisterPaper(context.manifestPath, 'paper_000')
  assert.equal(removed.mutation.accepted, true)
  assert.deepEqual(removed.indexes?.paperIndex.entries, [])
  assert.deepEqual(await readFile(graphPath), before)
  const manifest = await readManifest(context)
  const persistedIndex = await readJson<{ entries: unknown[] }>(
    path.join(context.root, manifest.documents.paperIndex)
  )
  assert.deepEqual(persistedIndex.entries, [])
  const audit = await context.runtime.audit.inspect(context.root, manifest.documents.auditLog)
  assert.ok(audit.events.some(event => event.action === 'extraction.initialized'))
  assert.ok(audit.events.some(event => event.action === 'paper.registered'))
  assert.ok(audit.events.some(event => event.action === 'paper.unregistered'))
})

test('source hash changes are recorded during index rebuild', async t => {
  const context = await createProject(t)
  await addRegisteredPapers(context, 1)
  await rebuildDirect(context, true)
  await writeFile(path.join(context.root, 'papers/paper-000.pdf'), 'changed PDF')
  await context.service.rebuildIndexes(context.manifestPath)
  const manifest = await readManifest(context)
  const audit = await context.runtime.audit.inspect(context.root, manifest.documents.auditLog)
  assert.ok(audit.events.some(event => event.action === 'source.hash-changed'))
})

test('application version begins at 0.0.0', async () => {
  const packageJson = await readJson<any>(path.join(REPOSITORY_ROOT, 'package.json'))
  assert.equal(packageJson.version, '0.0.0')
})

test('project schema version remains independent at 1.1.0', async t => {
  const context = await createProject(t)
  const manifest = await readManifest(context)
  const packageJson = await readJson<any>(path.join(REPOSITORY_ROOT, 'package.json'))
  assert.equal(manifest.schema.version, '1.1.0')
  assert.notEqual(manifest.schema.version, packageJson.version)
})

async function createProject(
  t: TestContext,
  writer?: AtomicJsonWriter
): Promise<ProjectContext> {
  const root = await temporaryDirectory(t)
  const runtime = createRuntime(writer)
  const service = new Phase1ProjectService(runtime)
  const manifestPath = path.join(root, MANIFEST_NAME)
  const opened = await service.create(root, 'project_phase1_test', 'Phase 1 Test')
  assert.equal(opened.mode, 'read-write')
  return { root, runtime, service, manifestPath }
}

function initialProjectFilePaths(): string[] {
  return [
    MANIFEST_NAME,
    'synthesis/claims.json',
    'synthesis/conflicts.json',
    'synthesis/gaps.json',
    'synthesis/research-questions.json',
    'taxonomy/constructs.json',
    'taxonomy/methodologies.json',
    'evidence/records.json',
    'indexes/papers.index.json',
    'indexes/evidence.index.json',
    'audit/events.jsonl',
  ]
}

function createRuntime(writer?: AtomicJsonWriter): ProjectRuntime {
  return createProjectRuntime({
    extensionRoot: REPOSITORY_ROOT,
    clock: new FixedClock(),
    ...(writer ? { writer } : {}),
  })
}

async function temporaryDirectory(t: TestContext): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'nodegraph-phase1-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  return root
}

async function addRegisteredPapers(context: ProjectContext, count: number): Promise<void> {
  const manifest = await readManifest(context)
  for (let index = 0; index < count; index++) {
    manifest.papers.push(await writePaper(context, index))
  }
  manifest.modified = FIXED_TIME
  await writeJson(context.manifestPath, manifest)
}

async function writeUnregisteredPaper(context: ProjectContext, index: number): Promise<string> {
  await writePaperFiles(context.root, index)
  return path.join(context.root, paperGraphPath(index))
}

async function writePaper(context: ProjectContext, index: number): Promise<PaperRegistration> {
  const files = await writePaperFiles(context.root, index)
  const extractionPath = paperExtractionPath(index)
  await writeJson(
    path.join(context.root, extractionPath),
    createEmptyExtraction(paperId(index), FIXED_TIME)
  )
  return {
    paperId: paperId(index),
    path: paperGraphPath(index),
    extractionPath,
    source: {
      sourceId: sourceId(index),
      relativePath: paperPdfPath(index),
      sourceDocumentHash: calculateByteHash(files.pdfBytes),
      doi: `10.1000/paper-${index}`,
      title: `Paper ${index}`,
      version: 'publisher-version',
    },
  }
}

async function writePaperFiles(
  root: string,
  index: number
): Promise<{ graph: NodeGraph; pdfBytes: Buffer }> {
  const graph = createGraph(index)
  const pdfBytes = Buffer.from(`PDF bytes ${index}`)
  await mkdir(path.join(root, 'papers'), { recursive: true })
  await writeJson(path.join(root, paperGraphPath(index)), graph)
  await writeFile(path.join(root, paperPdfPath(index)), pdfBytes)
  return { graph, pdfBytes }
}

function createGraph(index: number): NodeGraph {
  return {
    version: '1.0.0',
    title: `Paper ${index}`,
    created: FIXED_TIME,
    modified: FIXED_TIME,
    source: {
      pdf: `paper-${index.toString().padStart(3, '0')}.pdf`,
      authors: `Author ${index}, Coauthor`,
      venue: `Research Journal ${2020 + index}`,
      doi: `10.1000/paper-${index}`,
      pages: 10,
    },
    nodeTemplates: {
      claim: { label: 'Claim', color: '#000000', icon: 'quote', shape: 'sharp' },
    },
    nodes: [{
      id: findingId(index),
      template: 'claim',
      title: `Finding ${index}`,
      content: 'Finding content',
      original: { text: quoteText(index), location: 'p. 1' },
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

function createEvidence(registration: PaperRegistration, nodeId: string): EvidenceRecord {
  const index = Number(registration.paperId.split('_').at(-1))
  const quote = quoteText(index)
  const evidence: EvidenceRecord = {
    evidenceId: `evidence_${registration.paperId.slice('paper_'.length)}`,
    paperId: registration.paperId,
    nodeId,
    source: { ...registration.source },
    quote: { text: quote, quoteContentHash: calculateQuoteContentHash(quote) },
    locator: { page: 1, exact: quote },
    evidenceObjectHash: `sha256:${'0'.repeat(64)}`,
    reviewState: reviewState(),
    created: FIXED_TIME,
    modified: FIXED_TIME,
  }
  evidence.evidenceObjectHash = calculateEvidenceObjectHash(evidence)
  return evidence
}

function createClaim(evidenceId: string): any {
  return {
    claimId: 'claim_test',
    text: 'A test claim.',
    claimType: 'single-study-proposition',
    findingRefs: [{
      paperId: 'paper_000',
      findingId: 'finding_000',
      relationship: 'supports',
    }],
    evidenceRefs: [evidenceId],
    paradigmDecision: { required: false, status: 'not-required' },
    reviewState: reviewState(),
    created: FIXED_TIME,
    modified: FIXED_TIME,
  }
}

function reviewState(): any {
  return {
    verification: {
      source: 'pending',
      interpretation: 'pending',
      classification: 'pending',
    },
    approval: { researcher: 'not-reviewed', advisor: 'not-reviewed' },
    origin: 'human',
  }
}

async function writeEvidence(
  context: ProjectContext,
  evidence: EvidenceRecord[]
): Promise<void> {
  const manifest = await readManifest(context)
  await writeJson(path.join(context.root, manifest.documents.evidence), {
    schema: { name: 'nodegraph-evidence-records', version: '1.0.0' },
    evidence,
    modified: FIXED_TIME,
  })
}

async function writeClaims(
  context: ProjectContext,
  manifest: ProjectManifest,
  claims: any[]
): Promise<void> {
  await writeJson(path.join(context.root, manifest.documents.claims), {
    schema: { name: 'nodegraph-synthesis-claims', version: '1.0.0' },
    claims,
    modified: FIXED_TIME,
  })
}

async function rebuildDirect(context: ProjectContext, full: boolean): Promise<void> {
  const manifest = await readManifest(context)
  const result = await context.runtime.indexes.rebuild(context.root, manifest, full)
  assert.equal(result.diagnostics.filter(item => item.severity === 'error').length, 0)
}

async function deleteIndexes(context: ProjectContext): Promise<void> {
  const manifest = await readManifest(context)
  await unlink(path.join(context.root, manifest.documents.paperIndex))
  await unlink(path.join(context.root, manifest.documents.evidenceIndex))
}

async function authoritativeSnapshot(context: ProjectContext): Promise<string> {
  const manifest = await readManifest(context)
  const documents = [
    MANIFEST_NAME,
    manifest.documents.claims,
    manifest.documents.conflicts,
    manifest.documents.gaps,
    manifest.documents.researchQuestions,
    manifest.documents.constructs,
    manifest.documents.evidence,
  ]
  const values = await Promise.all(documents.map(file => readJson(path.join(context.root, file))))
  return canonicalJson(values)
}

async function claimsMutation(
  context: ProjectContext
): Promise<{ manifest: ProjectManifest; envelope: MutationEnvelope }> {
  const manifest = await readManifest(context)
  const claims = await readJson(path.join(context.root, manifest.documents.claims))
  return {
    manifest,
    envelope: {
      mutationId: 'mutation_claims_test',
      targetDocument: manifest.documents.claims,
      baseRevision: calculateDocumentRevision(claims),
      operations: [{ op: 'replace', path: '/modified', value: '2026-07-30T15:00:00.000Z' }],
      requestedAt: FIXED_TIME,
      actor: { type: 'human', id: 'researcher' },
    },
  }
}

async function readManifest(context: ProjectContext): Promise<ProjectManifest> {
  return readJson<ProjectManifest>(context.manifestPath)
}

function provisionalPaper(paperIdValue: string, paperPathValue: string): PaperRegistration {
  return {
    paperId: paperIdValue,
    path: paperPathValue,
    source: {
      sourceId: `source_${paperIdValue}`,
      relativePath: paperPathValue,
      sourceDocumentHash: `sha256:${'0'.repeat(64)}`,
    },
  }
}

function paperId(index: number): string {
  return `paper_${index.toString().padStart(3, '0')}`
}

function sourceId(index: number): string {
  return `source_${index.toString().padStart(3, '0')}`
}

function findingId(index: number): string {
  return `finding_${index.toString().padStart(3, '0')}`
}

function quoteText(index: number): string {
  return `Exact source quotation ${index}.`
}

function paperGraphPath(index: number): string {
  return `papers/paper-${index.toString().padStart(3, '0')}.nodegraph.json`
}

function paperPdfPath(index: number): string {
  return `papers/paper-${index.toString().padStart(3, '0')}.pdf`
}

function paperExtractionPath(index: number): string {
  return `extractions/paper-${index.toString().padStart(3, '0')}.json`
}

function assertDiagnostic(
  diagnostics: Array<{ code: string; action: string }>,
  code: string,
  actionText: string
): void {
  const item = findDiagnostic(diagnostics, code)
  assert.match(item.action, new RegExp(actionText, 'i'))
}

function findDiagnostic<T extends { code: string }>(diagnostics: T[], code: string): T {
  const item = diagnostics.find(diagnostic => diagnostic.code === code)
  assert.ok(item, `Expected diagnostic ${code}; received ${diagnostics.map(value => value.code).join(', ')}`)
  return item
}

async function readJson<T = unknown>(file: string): Promise<T> {
  return JSON.parse(await readFile(file, 'utf8')) as T
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`)
}
