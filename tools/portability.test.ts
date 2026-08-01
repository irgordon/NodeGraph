import test, { TestContext } from 'node:test'
import assert from 'node:assert/strict'
import {
  access,
  cp,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { inflateRawSync } from 'node:zlib'
import {
  assertProjectRelativeSyntax,
  isPathContained,
  ProjectPathError,
  ProjectPathResolver,
} from '../src/extension/project/ProjectPathResolver'
import { createProjectRuntime } from '../src/extension/project/ProjectRuntime'
import { runTool } from '../src/extension/toolDiscovery'

const REPOSITORY_ROOT = process.cwd()
const TEXT_EXTENSIONS = new Set([
  '', '.css', '.html', '.js', '.json', '.md', '.mjs', '.txt', '.xml',
])
const REQUIRED_TEMPLATES = [
  '.agent/NODEGRAPH_SPEC.md',
  '.prompt/english.md',
  '.prompt/korean.md',
]

test('project paths handle POSIX and Windows forms without prefix checks', () => {
  assert.doesNotThrow(() => assertProjectRelativeSyntax('papers/source.pdf'))
  for (const candidate of [
    '/home/researcher/source.pdf',
    'C:\\Users\\researcher\\source.pdf',
    'papers\\source.pdf',
  ]) {
    assert.throws(
      () => assertProjectRelativeSyntax(candidate),
      (error: unknown) => error instanceof ProjectPathError
    )
  }
  assert.equal(isPathContained('/work/project', '/work/project/papers/a.pdf', path.posix), true)
  assert.equal(isPathContained('/work/project', '/work/project-copy/a.pdf', path.posix), false)
  assert.equal(isPathContained(
    'C:\\work\\project',
    'C:\\work\\project\\papers\\a.pdf',
    path.win32
  ), true)
  assert.equal(isPathContained(
    'C:\\work\\project',
    'D:\\work\\project\\papers\\a.pdf',
    path.win32
  ), false)
})

test('relative PDF paths survive a project move with spaces and Unicode', async t => {
  const parent = await portableTemp(t)
  const originalRoot = path.join(parent, 'Original Project Ω')
  const movedRoot = path.join(parent, 'Moved Project 文献')
  const storedPath = 'papers/Source Paper Ω.pdf'
  await mkdir(path.join(originalRoot, 'papers'), { recursive: true })
  await writeFile(path.join(originalRoot, ...storedPath.split('/')), 'portable source')
  const resolver = new ProjectPathResolver()
  assert.equal(await readFile(await resolver.resolve(originalRoot, storedPath), 'utf8'), 'portable source')
  const persisted = JSON.stringify({ source: { relativePath: storedPath } })
  assert.equal(persisted.includes(originalRoot), false)
  await rename(originalRoot, movedRoot)
  assert.equal(await readFile(await resolver.resolve(movedRoot, storedPath), 'utf8'), 'portable source')
})

test('runtime schemas load from an explicit installed-resource location', async t => {
  const parent = await portableTemp(t)
  const installedRoot = path.join(parent, 'Installed Extension Ω')
  const schemaRoot = path.join(installedRoot, 'docs', 'schemas')
  const legacySchemaPath = path.join(installedRoot, 'schema', 'nodegraph.schema.json')
  await cp(path.join(REPOSITORY_ROOT, 'docs', 'schemas'), schemaRoot, { recursive: true })
  await mkdir(path.dirname(legacySchemaPath), { recursive: true })
  await cp(path.join(REPOSITORY_ROOT, 'schema', 'nodegraph.schema.json'), legacySchemaPath)
  const runtime = createProjectRuntime({ schemaRoot, legacySchemaPath })
  const graph = JSON.parse(await readFile(
    path.join(REPOSITORY_ROOT, 'demo', 'ex1', 'attention-is-all-you-need.nodegraph.json'),
    'utf8'
  ))
  assert.deepEqual(runtime.schemas.validate('nodegraph.schema.json', graph, 'portable'), [])
})

test('tool discovery passes arguments without invoking a shell', async t => {
  const parent = await portableTemp(t)
  const marker = path.join(parent, 'shell marker')
  const payload = `;require('fs').writeFileSync(${JSON.stringify(marker)},'bad')`
  const output = runTool(
    process.execPath,
    ['-e', 'console.log(process.argv[1])', payload]
  )
  assert.equal(output, payload)
  await assert.rejects(access(marker))
})

test('launch and installed-resource configuration contain no machine path', async () => {
  const launch = JSON.parse(await readFile(
    path.join(REPOSITORY_ROOT, '.vscode', 'launch.json'),
    'utf8'
  ))
  const configuration = launch.configurations[0]
  assert.deepEqual(configuration.args, ['--extensionDevelopmentPath=${workspaceFolder}'])
  assert.deepEqual(configuration.outFiles, ['${workspaceFolder}/dist/**/*.js'])
  const extensionSource = await readFile(
    path.join(REPOSITORY_ROOT, 'src', 'extension', 'extension.ts'),
    'utf8'
  )
  assert.match(extensionSource, /Uri\.joinPath\(context\.extensionUri, 'docs', 'schemas'\)/)
  assert.doesNotMatch(extensionSource, /context\.extensionPath/)
})

test('repository tools use portable entry points and defaults', async () => {
  const exporter = await readFile(
    path.join(REPOSITORY_ROOT, 'tools', 'export-all-html.js'),
    'utf8'
  )
  assert.match(exporter, /process\.cwd\(\)/)
  assert.doesNotMatch(exporter, /DEFAULT_ROOT|\/media\/|\/mnt\/|\/Volumes\//)
  await assert.rejects(access(path.join(REPOSITORY_ROOT, 'tools', 'export-all-html.sh')))
})

test('source, fixtures, and generated bundles contain no developer location', async () => {
  const files = await auditFiles(REPOSITORY_ROOT)
  const findings = files.flatMap(file => scanFile(file, REPOSITORY_ROOT))
  assert.deepEqual(findings, [])
})

test('valid persisted examples contain only portable source paths', async () => {
  const roots = [
    path.join(REPOSITORY_ROOT, 'docs', 'schemas', 'fixtures', 'valid'),
    path.join(REPOSITORY_ROOT, 'docs', 'schemas', 'fixtures', 'runtime'),
    path.join(REPOSITORY_ROOT, 'demo'),
  ]
  const files = (await Promise.all(roots.map(root => jsonFiles(root)))).flat()
  for (const file of files) {
    const text = await readFile(file, 'utf8')
    assert.deepEqual(machineSpecificMatches(text, file), [], file)
  }
})

const vsixPath = path.join(REPOSITORY_ROOT, 'nodegraph-0.0.0.vsix')
test('packaged templates and VSIX content are location neutral', {
  skip: existsSync(vsixPath) ? false : 'No local VSIX was supplied.',
}, async () => {
  const entries = readZipEntries(vsixPath)
  for (const relativePath of REQUIRED_TEMPLATES) {
    const packaged = entries.get(`extension/${relativePath}`)
    assert.ok(packaged, `${relativePath} is missing from the VSIX`)
    assert.deepEqual(packaged, await readFile(path.join(REPOSITORY_ROOT, relativePath)))
  }
  const findings = [...entries].flatMap(([name, content]) => {
    if (!TEXT_EXTENSIONS.has(path.extname(name).toLowerCase())) return []
    return machineSpecificMatches(content.toString('utf8'), name)
  })
  assert.deepEqual(findings, [])
})

async function portableTemp(t: TestContext): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'NodeGraph portability Ω '))
  t.after(() => rm(root, { recursive: true, force: true }))
  return root
}

async function auditFiles(root: string): Promise<string[]> {
  const targets = [
    'src', 'tools', 'docs', '.vscode', '.agent', '.prompt', 'resources', 'demo',
    'schema', 'dist',
    'package.json', 'esbuild.js', '.vscodeignore', 'README.md', 'CHANGELOG.md',
  ]
  return (await Promise.all(targets.map(target => textFiles(path.join(root, target))))).flat()
}

async function textFiles(target: string): Promise<string[]> {
  const stats = await stat(target)
  if (stats.isFile()) return TEXT_EXTENSIONS.has(path.extname(target)) ? [target] : []
  const entries = await readdir(target, { withFileTypes: true })
  const nested = await Promise.all(entries.map(entry =>
    textFiles(path.join(target, entry.name))))
  return nested.flat()
}

async function jsonFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true })
  const nested = await Promise.all(entries.map(entry => {
    const target = path.join(root, entry.name)
    if (entry.isDirectory()) return jsonFiles(target)
    return Promise.resolve(entry.name.endsWith('.json') ? [target] : [])
  }))
  return nested.flat()
}

function scanFile(file: string, root: string): string[] {
  const relativePath = path.relative(root, file)
  const text = readFileSync(file, 'utf8')
  return machineSpecificMatches(text, relativePath)
}

function machineSpecificMatches(text: string, file: string): string[] {
  const inspected = dependencyNeutralText(text, file)
  const patterns: Array<[string, RegExp]> = [
    ['macOS home path', /\/Users\/[^/\s"']+/g],
    ['Linux home path', /\/home\/[^/\s"']+/g],
    ['Windows home path', /[A-Za-z]:\\Users\\[^\\\s"']+/g],
    ['Homebrew prefix', /\/opt\/homebrew\//g],
    ['Cellar prefix', /\/usr\/local\/Cellar\//g],
    ['developer repository path', /Documents[\\/]Projects[\\/]NodeGraph/g],
    ['mounted workspace path', /\/(?:media|mnt|Volumes)\/[^/\s"']+/g],
    ['file URI', /file:\/\/\//g],
    ['fixed local port', /(?:localhost|127\.0\.0\.1):\d+/g],
  ]
  const dynamic = [REPOSITORY_ROOT, os.homedir(), os.hostname(), os.userInfo().username]
    .filter(value => value.length > 3)
  const findings = patterns.flatMap(([label, pattern]) =>
    pattern.test(inspected) ? [`${file}: ${label}`] : [])
  for (const value of dynamic) {
    if (inspected.includes(value)) findings.push(`${file}: current-machine value`)
  }
  return findings
}

function dependencyNeutralText(text: string, file: string): string {
  return file.endsWith('pdf.worker.min.mjs') || file.endsWith('docs/PORTABILITY.md')
    ? text.replaceAll('/home/web_user', '')
    : text
}

function readZipEntries(file: string): Map<string, Buffer> {
  const archive = readFileSync(file)
  const end = findZipEnd(archive)
  const count = archive.readUInt16LE(end + 10)
  let offset = archive.readUInt32LE(end + 16)
  const entries = new Map<string, Buffer>()
  for (let index = 0; index < count; index++) {
    assert.equal(archive.readUInt32LE(offset), 0x02014b50)
    const compression = archive.readUInt16LE(offset + 10)
    const compressedSize = archive.readUInt32LE(offset + 20)
    const nameLength = archive.readUInt16LE(offset + 28)
    const extraLength = archive.readUInt16LE(offset + 30)
    const commentLength = archive.readUInt16LE(offset + 32)
    const localOffset = archive.readUInt32LE(offset + 42)
    const name = archive.subarray(offset + 46, offset + 46 + nameLength).toString('utf8')
    entries.set(name, readZipEntry(archive, localOffset, compressedSize, compression))
    offset += 46 + nameLength + extraLength + commentLength
  }
  return entries
}

function findZipEnd(archive: Buffer): number {
  const minimum = Math.max(0, archive.length - 65_557)
  for (let offset = archive.length - 22; offset >= minimum; offset--) {
    if (archive.readUInt32LE(offset) === 0x06054b50) return offset
  }
  throw new Error('The VSIX central directory is missing.')
}

function readZipEntry(
  archive: Buffer,
  offset: number,
  compressedSize: number,
  compression: number
): Buffer {
  assert.equal(archive.readUInt32LE(offset), 0x04034b50)
  const nameLength = archive.readUInt16LE(offset + 26)
  const extraLength = archive.readUInt16LE(offset + 28)
  const start = offset + 30 + nameLength + extraLength
  const content = archive.subarray(start, start + compressedSize)
  if (compression === 0) return Buffer.from(content)
  if (compression === 8) return inflateRawSync(content)
  throw new Error(`Unsupported VSIX compression method ${compression}.`)
}
