import { access, mkdir, readFile } from 'fs/promises'
import * as path from 'path'
import { randomUUID } from 'crypto'
import { AtomicJsonWriter } from './AtomicJsonWriter'
import { calculateDocumentRevision } from './canonical'
import { diagnostic, hasErrors } from './diagnostics'
import { isFileError, readJsonDocument } from './documentIO'
import { MutationAuditError, MutationRepository } from './MutationRepository'
import { ProjectPathError, ProjectPathResolver } from './ProjectPathResolver'
import { SchemaValidator } from './SchemaValidator'
import {
  paperIndexSchemaName,
  projectSchemaName,
  selectProjectSchemaMode,
} from './SchemaVersionPolicy'
import {
  createEmptyExtraction,
  createInitialMethodologyRegistry,
} from './extractionDefaults'
import {
  Actor,
  APPLICATION_VERSION,
  Clock,
  DOCUMENT_SCHEMA_VERSION,
  EvidenceIndexDocument,
  MutationEnvelope,
  MutationResult,
  PAPER_INDEX_SCHEMA_VERSION,
  PaperIndexDocument,
  PaperRegistration,
  PROJECT_SCHEMA_VERSION,
  ProjectDiagnostic,
  ProjectManifest,
  ProjectOpenResult,
  systemClock,
} from './types'

const MANIFEST_FILE = 'project.nodegraph.json'
const PAPERS_DIRECTORY = 'papers'

export class ProjectRegistry {
  constructor(
    private readonly paths: ProjectPathResolver,
    private readonly schemas: SchemaValidator,
    private readonly writer: AtomicJsonWriter,
    private readonly mutations: MutationRepository,
    private readonly clock: Clock = systemClock
  ) {}

  public async create(projectRoot: string, projectId: string, title: string): Promise<ProjectOpenResult> {
    await mkdir(projectRoot, { recursive: true })
    const manifestPath = path.join(projectRoot, MANIFEST_FILE)
    await assertManifestAbsent(manifestPath)
    const manifest = buildInitialManifest(projectId, title, this.clock.now())
    const diagnostics = this.schemas.validate(
      projectSchemaName(manifest.schema.version),
      manifest,
      MANIFEST_FILE
    )
    if (hasErrors(diagnostics)) return { mode: 'read-only', diagnostics, hydrationCount: 0 }
    await this.writeInitialProject(projectRoot, manifest)
    return this.open(manifestPath)
  }

  public async open(manifestPath: string): Promise<ProjectOpenResult> {
    const projectRoot = path.dirname(manifestPath)
    const schemaName = await detectManifestSchema(manifestPath)
    const manifestRead = await readJsonDocument<ProjectManifest>(
      manifestPath,
      MANIFEST_FILE,
      schemaName,
      this.schemas
    )
    if (!manifestRead.value) {
      return { mode: 'read-only', diagnostics: manifestRead.diagnostics, hydrationCount: 0 }
    }
    const manifest = manifestRead.value
    const mode = selectProjectSchemaMode(manifest.schema.version, MANIFEST_FILE)
    const diagnostics = [
      ...manifestRead.diagnostics,
      ...documentPathDiagnostics(manifest),
      ...(await this.inspectRegistrations(projectRoot, manifest)),
    ]
    const indexes = await this.loadIndexes(projectRoot, manifest)
    diagnostics.push(...indexes.diagnostics)
    return {
      mode: mode.mode === 'read-only' || hasErrors(diagnostics) ? 'read-only' : 'read-write',
      manifest,
      manifestRevision: calculateDocumentRevision(manifest),
      ...(indexes.paperIndex ? { paperIndex: indexes.paperIndex } : {}),
      ...(indexes.evidenceIndex ? { evidenceIndex: indexes.evidenceIndex } : {}),
      diagnostics,
      hydrationCount: 0,
    }
  }

  public async registerPaper(
    projectRoot: string,
    manifest: ProjectManifest,
    registration: PaperRegistration,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    const diagnostics = await this.validateNewRegistration(projectRoot, manifest, registration)
    if (hasErrors(diagnostics)) return registrationRejected(registration, baseRevision, diagnostics)
    const envelope = buildRegistrationEnvelope(manifest, registration, baseRevision, actor, this.clock.now())
    let extractionCreated = false
    try {
      extractionCreated = await this.createRegistrationExtraction(
        projectRoot,
        manifest,
        registration
      )
      const result = await this.mutations.apply(projectRoot, envelope, {
        schemaName: projectSchemaName(manifest.schema.version),
        auditPath: manifest.documents.auditLog,
        auditAction: 'paper.registered',
        auditObjectId: registration.paperId,
      })
      if (!result.accepted && extractionCreated) {
        await this.removeRegistrationExtraction(projectRoot, registration)
      }
      return result
    } catch (error) {
      if (extractionCreated && !(error instanceof MutationAuditError)) {
        await this.removeRegistrationExtraction(projectRoot, registration)
      }
      throw error
    }
  }

  public async unregisterPaper(
    projectRoot: string,
    manifest: ProjectManifest,
    paperId: string,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    const index = manifest.papers.findIndex(paper => paper.paperId === paperId)
    if (index < 0) return missingRegistrationRejected(paperId, baseRevision)
    const envelope = buildUnregistrationEnvelope(manifest, index, paperId, baseRevision, actor, this.clock.now())
    return this.mutations.apply(projectRoot, envelope, {
      schemaName: projectSchemaName(manifest.schema.version),
      auditPath: manifest.documents.auditLog,
      auditAction: 'paper.unregistered',
      auditObjectId: paperId,
    })
  }

  public async resolveDocument(
    projectRoot: string,
    relativePath: string,
    requireExisting = false
  ): Promise<string> {
    return this.paths.resolve(projectRoot, relativePath, requireExisting)
  }

  private async writeInitialProject(projectRoot: string, manifest: ProjectManifest): Promise<void> {
    const documents = initialDocuments(manifest, this.clock.now())
    const targets = initialProjectTargets(manifest, documents)
    await this.assertTargetsAbsent(projectRoot, targets)
    const createdPaths = new Set<string>()
    try {
      await mkdir(path.join(projectRoot, PAPERS_DIRECTORY), { recursive: true })
      for (const document of documents) {
        if (document.authoritative) createdPaths.add(manifest.documents.auditLog)
        await this.writeTrackedInitialDocument(
          projectRoot,
          manifest,
          document,
          createdPaths
        )
      }
      createdPaths.add(manifest.documents.auditLog)
      await this.writeTrackedAuthoritativeDocument(
        projectRoot,
        manifest,
        manifestDocument(manifest),
        'project.created',
        manifest.projectId,
        createdPaths
      )
    } catch (error) {
      await this.removeInitialFiles(projectRoot, [...createdPaths])
      throw error
    }
  }

  private async writeTrackedInitialDocument(
    projectRoot: string,
    manifest: ProjectManifest,
    document: InitialDocument,
    createdPaths: Set<string>
  ): Promise<void> {
    try {
      await this.writeInitialDocument(projectRoot, manifest, document)
      createdPaths.add(document.path)
    } catch (error) {
      if (error instanceof MutationAuditError) createdPaths.add(document.path)
      throw error
    }
  }

  private async writeTrackedAuthoritativeDocument(
    projectRoot: string,
    manifest: ProjectManifest,
    document: InitialDocument,
    auditAction: string,
    auditObjectId: string,
    createdPaths: Set<string>
  ): Promise<void> {
    try {
      await this.writeAuthoritativeDocument(
        projectRoot,
        manifest,
        document,
        auditAction,
        auditObjectId
      )
      createdPaths.add(document.path)
    } catch (error) {
      if (error instanceof MutationAuditError) createdPaths.add(document.path)
      throw error
    }
  }

  private async writeInitialDocument(
    projectRoot: string,
    manifest: ProjectManifest,
    document: InitialDocument
  ): Promise<void> {
    const diagnostics = this.schemas.validate(document.schema, document.value, document.path)
    if (hasErrors(diagnostics)) throw new Error(`Invalid initial document: ${document.path}`)
    if (document.authoritative) {
      await this.writeAuthoritativeDocument(
        projectRoot,
        manifest,
        document,
        'project.document-created',
        document.path
      )
      return
    }
    await this.writer.write(await this.paths.resolve(projectRoot, document.path), document.value)
  }

  private async writeAuthoritativeDocument(
    projectRoot: string,
    manifest: ProjectManifest,
    document: InitialDocument,
    auditAction: string,
    auditObjectId: string
  ): Promise<void> {
    const result = await this.mutations.apply(
      projectRoot,
      buildCreationEnvelope(document, this.clock.now()),
      {
        schemaName: document.schema,
        auditPath: manifest.documents.auditLog,
        auditAction,
        auditObjectId,
        allowCreate: true,
      }
    )
    if (!result.accepted) throw new Error(`Failed to create ${document.path}: ${result.code}`)
  }

  private async assertTargetsAbsent(projectRoot: string, relativePaths: string[]): Promise<void> {
    for (const relativePath of relativePaths) {
      const target = await this.paths.resolve(projectRoot, relativePath)
      await assertFileAbsent(target)
    }
  }

  private async removeInitialFiles(projectRoot: string, relativePaths: string[]): Promise<void> {
    for (const relativePath of [...relativePaths].reverse()) {
      const target = await this.paths.resolve(projectRoot, relativePath)
      await this.writer.remove(target)
    }
  }

  private async inspectRegistrations(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<ProjectDiagnostic[]> {
    const diagnostics = [
      ...duplicateRegistrationDiagnostics(manifest),
      ...registrationPathCollisionDiagnostics(manifest),
    ]
    for (const registration of manifest.papers) {
      diagnostics.push(...await this.inspectRegistrationFiles(projectRoot, registration))
    }
    return diagnostics
  }

  private async inspectRegistrationFiles(
    projectRoot: string,
    registration: PaperRegistration,
    includeExtraction = true
  ): Promise<ProjectDiagnostic[]> {
    return [
      ...await inspectRegisteredPath(this.paths, projectRoot, registration.path, registration.paperId, 'paper'),
      ...await inspectRegisteredPath(
        this.paths,
        projectRoot,
        registration.source.relativePath,
        registration.source.sourceId,
        'source'
      ),
      ...(includeExtraction && registration.extractionPath
        ? await inspectRegisteredPath(
          this.paths,
          projectRoot,
          registration.extractionPath,
          registration.paperId,
          'extraction'
        )
        : []),
    ]
  }

  private async loadIndexes(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{
    paperIndex?: PaperIndexDocument
    evidenceIndex?: EvidenceIndexDocument
    diagnostics: ProjectDiagnostic[]
  }> {
    const paper = await this.loadOptionalIndex<PaperIndexDocument>(
      projectRoot,
      manifest.documents.paperIndex,
      paperIndexSchemaName(manifest.schema.version)
    )
    const evidence = await this.loadOptionalIndex<EvidenceIndexDocument>(
      projectRoot,
      manifest.documents.evidenceIndex,
      'evidence-index.schema.json'
    )
    return {
      ...(paper.value ? { paperIndex: paper.value } : {}),
      ...(evidence.value ? { evidenceIndex: evidence.value } : {}),
      diagnostics: [...paper.diagnostics, ...evidence.diagnostics],
    }
  }

  private async loadOptionalIndex<T>(
    projectRoot: string,
    relativePath: string,
    schemaName: string
  ): Promise<{ value?: T; diagnostics: ProjectDiagnostic[] }> {
    const target = await this.paths.resolve(projectRoot, relativePath)
    const read = await readJsonDocument<T>(target, relativePath, schemaName, this.schemas)
    if (read.value) return read
    if (read.diagnostics.some(item => item.code === 'missing-file')) {
      return { diagnostics: [missingIndexDiagnostic(relativePath)] }
    }
    return { diagnostics: read.diagnostics.map(invalidIndexDiagnostic) }
  }

  private async validateNewRegistration(
    projectRoot: string,
    manifest: ProjectManifest,
    registration: PaperRegistration
  ): Promise<ProjectDiagnostic[]> {
    const candidate = { ...manifest, papers: [...manifest.papers, registration] }
    const diagnostics = this.schemas.validate(
      projectSchemaName(manifest.schema.version),
      candidate,
      MANIFEST_FILE
    )
    diagnostics.push(...documentPathDiagnostics(candidate))
    diagnostics.push(...duplicateRegistrationDiagnostics(candidate))
    diagnostics.push(...registrationPathCollisionDiagnostics(candidate))
    diagnostics.push(...await this.inspectRegistrationFiles(projectRoot, registration, false))
    return diagnostics
  }

  private async createRegistrationExtraction(
    projectRoot: string,
    manifest: ProjectManifest,
    registration: PaperRegistration
  ): Promise<boolean> {
    if (!registration.extractionPath) return false
    const target = await this.paths.resolve(projectRoot, registration.extractionPath)
    await assertFileAbsent(target)
    const extraction = createEmptyExtraction(registration.paperId, this.clock.now())
    await this.writeAuthoritativeDocument(
      projectRoot,
      manifest,
      initialDocument(
        registration.extractionPath,
        'extraction.schema.json',
        extraction
      ),
      'extraction.initialized',
      extraction.extractionId
    )
    return true
  }

  private async removeRegistrationExtraction(
    projectRoot: string,
    registration: PaperRegistration
  ): Promise<void> {
    await this.writer.remove(
      await this.paths.resolve(projectRoot, registration.extractionPath!)
    )
  }
}

function buildInitialManifest(projectId: string, title: string, now: string): ProjectManifest {
  return {
    schema: { name: 'nodegraph-project', version: PROJECT_SCHEMA_VERSION },
    projectId,
    title,
    created: now,
    modified: now,
    papers: [],
    documents: {
      claims: 'synthesis/claims.json',
      conflicts: 'synthesis/conflicts.json',
      gaps: 'synthesis/gaps.json',
      researchQuestions: 'synthesis/research-questions.json',
      constructs: 'taxonomy/constructs.json',
      methodologies: 'taxonomy/methodologies.json',
      evidence: 'evidence/records.json',
      paperIndex: 'indexes/papers.index.json',
      evidenceIndex: 'indexes/evidence.index.json',
      auditLog: 'audit/events.jsonl',
    },
  }
}

interface InitialDocument {
  path: string
  schema: string
  value: unknown
  authoritative: boolean
}

function initialProjectTargets(
  manifest: ProjectManifest,
  documents: InitialDocument[]
): string[] {
  return [
    ...documents.map(document => document.path),
    manifest.documents.auditLog,
    MANIFEST_FILE,
  ]
}

function manifestDocument(manifest: ProjectManifest): InitialDocument {
  return {
    path: MANIFEST_FILE,
    schema: projectSchemaName(manifest.schema.version),
    value: manifest,
    authoritative: true,
  }
}

function initialDocuments(
  manifest: ProjectManifest,
  now: string
): InitialDocument[] {
  return [
    initialDocument(manifest.documents.claims, 'synthesis-claims.schema.json', emptyDocument('nodegraph-synthesis-claims', 'claims', now)),
    initialDocument(manifest.documents.conflicts, 'conflicts.schema.json', emptyDocument('nodegraph-conflicts', 'conflicts', now)),
    initialDocument(manifest.documents.gaps, 'gaps.schema.json', emptyDocument('nodegraph-gaps', 'gaps', now)),
    initialDocument(manifest.documents.researchQuestions, 'research-questions.schema.json', emptyDocument('nodegraph-research-questions', 'researchQuestions', now)),
    initialDocument(manifest.documents.constructs, 'construct-taxonomy.schema.json', emptyTaxonomy(now)),
    initialDocument(
      manifest.documents.methodologies!,
      'methodology-registry.schema.json',
      createInitialMethodologyRegistry(now)
    ),
    initialDocument(manifest.documents.evidence, 'evidence-records.schema.json', emptyDocument('nodegraph-evidence-records', 'evidence', now)),
    derivedDocument(
      manifest.documents.paperIndex,
      'paper-index-v1.1.schema.json',
      emptyIndex('nodegraph-paper-index', PAPER_INDEX_SCHEMA_VERSION, now)
    ),
    derivedDocument(
      manifest.documents.evidenceIndex,
      'evidence-index.schema.json',
      emptyIndex('nodegraph-evidence-index', DOCUMENT_SCHEMA_VERSION, now)
    ),
  ]
}

function initialDocument(pathValue: string, schema: string, value: unknown): InitialDocument {
  return { path: pathValue, schema, value, authoritative: true }
}

function derivedDocument(pathValue: string, schema: string, value: unknown): InitialDocument {
  return { path: pathValue, schema, value, authoritative: false }
}

function buildCreationEnvelope(document: InitialDocument, now: string): MutationEnvelope {
  return {
    mutationId: `mutation_${randomUUID().replace(/-/g, '')}`,
    targetDocument: document.path,
    baseRevision: 'absent',
    operations: [{ op: 'add', path: '', value: document.value }],
    requestedAt: now,
    actor: { type: 'service', id: 'ProjectRegistry', version: APPLICATION_VERSION },
  }
}

function emptyDocument(schemaName: string, collection: string, now: string): unknown {
  return {
    schema: { name: schemaName, version: DOCUMENT_SCHEMA_VERSION },
    [collection]: [],
    modified: now,
  }
}

function emptyTaxonomy(now: string): unknown {
  return {
    schema: { name: 'nodegraph-construct-taxonomy', version: DOCUMENT_SCHEMA_VERSION },
    taxonomyVersion: 1,
    constructs: [],
    modified: now,
  }
}

function emptyIndex(schemaName: string, version: string, now: string): unknown {
  return {
    schema: { name: schemaName, version },
    generatedAt: now,
    entries: [],
  }
}

function duplicateRegistrationDiagnostics(manifest: ProjectManifest): ProjectDiagnostic[] {
  return [
    ...duplicates(manifest.papers.map(item => item.paperId))
      .map(value => duplicateDiagnostic('duplicate-paper-id', value)),
    ...duplicates(manifest.papers.map(item => item.path))
      .map(value => duplicateDiagnostic('duplicate-paper-path', value)),
    ...duplicates(manifest.papers.map(item => item.source.sourceId))
      .map(value => duplicateDiagnostic('duplicate-source-id', value)),
    ...duplicates(manifest.papers.flatMap(item => item.extractionPath ?? []))
      .map(value => duplicateDiagnostic('duplicate-extraction-path', value)),
  ]
}

function documentPathDiagnostics(manifest: ProjectManifest): ProjectDiagnostic[] {
  const paths = Object.values(manifest.documents)
    .filter((value): value is string => typeof value === 'string')
  return [
    ...duplicates(paths).map(duplicateDocumentPathDiagnostic),
    ...paths
      .filter(relativePath => relativePath === MANIFEST_FILE)
      .map(reservedDocumentPathDiagnostic),
  ]
}

function registrationPathCollisionDiagnostics(manifest: ProjectManifest): ProjectDiagnostic[] {
  const ownedPaths = new Set([
    MANIFEST_FILE,
    ...Object.values(manifest.documents)
      .filter((value): value is string => typeof value === 'string'),
  ])
  return [
    ...crossRegistrationPathCollisions(manifest),
    ...manifest.papers.flatMap(registration => [
    ...(ownedPaths.has(registration.path)
      ? [registrationCollisionDiagnostic(registration.path, registration.paperId)]
      : []),
    ...(ownedPaths.has(registration.source.relativePath)
      ? [registrationCollisionDiagnostic(
        registration.source.relativePath,
        registration.source.sourceId
      )]
      : []),
    ...(registration.extractionPath && ownedPaths.has(registration.extractionPath)
      ? [registrationCollisionDiagnostic(
        registration.extractionPath,
        registration.paperId
      )]
      : []),
    ]),
  ]
}

function crossRegistrationPathCollisions(
  manifest: ProjectManifest
): ProjectDiagnostic[] {
  const paths = manifest.papers.flatMap(registration => [
    registration.path,
    registration.source.relativePath,
    ...(registration.extractionPath ? [registration.extractionPath] : []),
  ])
  return duplicates(paths).map(relativePath =>
    registrationCollisionDiagnostic(relativePath, relativePath)
  )
}

function duplicates(values: string[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value)
    seen.add(value)
  }
  return [...duplicates]
}

function duplicateDocumentPathDiagnostic(relativePath: string): ProjectDiagnostic {
  return projectPathDiagnostic(
    'duplicate-project-document-path',
    relativePath,
    'Give every manifest-owned document a distinct path.'
  )
}

function reservedDocumentPathDiagnostic(relativePath: string): ProjectDiagnostic {
  return projectPathDiagnostic(
    'reserved-project-document-path',
    relativePath,
    'Use a subordinate path that is different from project.nodegraph.json.'
  )
}

function registrationCollisionDiagnostic(
  relativePath: string,
  objectId: string
): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'registration-path-collision',
    file: MANIFEST_FILE,
    objectId,
    rule: `${relativePath} is already owned by the project manifest.`,
    action: 'Choose a distinct contained path for the paper graph, source PDF, or extraction.',
  })
}

function projectPathDiagnostic(
  code: string,
  relativePath: string,
  action: string
): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code,
    file: MANIFEST_FILE,
    objectId: relativePath,
    rule: `${relativePath} cannot safely identify the requested project document.`,
    action,
  })
}

function duplicateDiagnostic(code: string, value: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code,
    file: MANIFEST_FILE,
    objectId: value,
    rule: `${value} is registered more than once.`,
    action: 'Keep one registration with a unique identifier and path.',
  })
}

async function inspectRegisteredPath(
  paths: ProjectPathResolver,
  projectRoot: string,
  relativePath: string,
  objectId: string,
  kind: 'paper' | 'source' | 'extraction'
): Promise<ProjectDiagnostic[]> {
  try {
    const target = await paths.resolve(projectRoot, relativePath, true)
    await access(target)
    return []
  } catch (error) {
    return [registeredPathDiagnostic(relativePath, objectId, kind, error)]
  }
}

function registeredPathDiagnostic(
  file: string,
  objectId: string,
  kind: 'paper' | 'source' | 'extraction',
  error: unknown
): ProjectDiagnostic {
  const pathCode = error instanceof ProjectPathError ? error.code : undefined
  const missing = isFileError(error, 'ENOENT')
  return diagnostic({
    layer: pathCode ? 'structural' : 'integrity',
    code: pathCode ?? (missing ? `missing-${kind}-file` : `inaccessible-${kind}-file`),
    file,
    objectId,
    rule: pathCode ? 'The registered path escapes the project root.' : `The registered ${kind} file cannot be read.`,
    action: pathCode ? 'Use a contained project-relative path.' : `Restore the ${kind} file or remove its registration.`,
  })
}

function missingIndexDiagnostic(file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'integrity',
    severity: 'warning',
    code: 'missing-derived-index',
    file,
    rule: 'The derived index is missing.',
    action: 'Rebuild project indexes; authoritative data is unaffected.',
  })
}

function invalidIndexDiagnostic(item: ProjectDiagnostic): ProjectDiagnostic {
  return {
    ...item,
    layer: 'integrity',
    severity: 'warning',
    code: 'invalid-derived-index',
    action: 'Rebuild the derived index from authoritative project data.',
  }
}

function buildRegistrationEnvelope(
  manifest: ProjectManifest,
  registration: PaperRegistration,
  baseRevision: string,
  actor: Actor,
  now: string
): MutationEnvelope {
  return {
    mutationId: `mutation_${randomUUID().replace(/-/g, '')}`,
    targetDocument: MANIFEST_FILE,
    baseRevision,
    operations: [
      { op: 'add', path: '/papers/-', value: registration },
      { op: 'replace', path: '/modified', value: now },
    ],
    requestedAt: now,
    actor,
  }
}

function buildUnregistrationEnvelope(
  manifest: ProjectManifest,
  index: number,
  paperId: string,
  baseRevision: string,
  actor: Actor,
  now: string
): MutationEnvelope {
  return {
    mutationId: `mutation_${randomUUID().replace(/-/g, '')}`,
    targetDocument: MANIFEST_FILE,
    baseRevision,
    operations: [
      { op: 'test', path: `/papers/${index}/paperId`, value: paperId },
      { op: 'remove', path: `/papers/${index}` },
      { op: 'replace', path: '/modified', value: now },
    ],
    requestedAt: now,
    actor,
  }
}

function registrationRejected(
  registration: PaperRegistration,
  baseRevision: string,
  diagnostics: ProjectDiagnostic[]
): MutationResult {
  return {
    accepted: false,
    code: 'invalid-registration',
    targetDocument: MANIFEST_FILE,
    currentRevision: baseRevision,
    receivedBaseRevision: baseRevision,
    retryable: false,
    rejectedOperations: [{ op: 'add', path: '/papers/-', value: registration }],
    diagnostics,
  }
}

function missingRegistrationRejected(paperId: string, baseRevision: string): MutationResult {
  return {
    accepted: false,
    code: 'paper-not-registered',
    targetDocument: MANIFEST_FILE,
    currentRevision: baseRevision,
    receivedBaseRevision: baseRevision,
    retryable: false,
    rejectedOperations: [],
    diagnostics: [diagnostic({
      layer: 'structural',
      code: 'paper-not-registered',
      file: MANIFEST_FILE,
      objectId: paperId,
      rule: 'The requested paper is not registered.',
      action: 'Refresh the manifest and choose a registered paper.',
    })],
  }
}

async function assertManifestAbsent(manifestPath: string): Promise<void> {
  return assertFileAbsent(manifestPath)
}

async function detectManifestSchema(manifestPath: string): Promise<string> {
  try {
    const parsed = JSON.parse(await readFile(manifestPath, 'utf8')) as {
      schema?: { version?: unknown }
      papers?: Array<{ extractionPath?: unknown }>
      documents?: { methodologies?: unknown }
    }
    const version = typeof parsed.schema?.version === 'string'
      ? parsed.schema.version
      : PROJECT_SCHEMA_VERSION
    const phase2Shape = parsed.documents?.methodologies !== undefined
      || parsed.papers?.some(paper => paper.extractionPath !== undefined)
    return phase2Shape ? 'project-v1.1.schema.json' : projectSchemaName(version)
  } catch {
    return projectSchemaName(PROJECT_SCHEMA_VERSION)
  }
}

async function assertFileAbsent(target: string): Promise<void> {
  try {
    await access(target)
    throw new Error(`Project file already exists: ${target}`)
  } catch (error) {
    if (!isFileError(error, 'ENOENT')) throw error
  }
}
