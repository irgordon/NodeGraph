import * as path from 'path'
import { diagnostic, hasErrors } from './diagnostics'
import { isFileError } from './documentIO'
import { ProjectPathError } from './ProjectPathResolver'
import { ProjectRuntime } from './ProjectRuntime'
import {
  Actor,
  IndexBuildResult,
  MutationResult,
  PaperRegistration,
  ProjectDiagnostic,
  ProjectOpenResult,
  SearchQuery,
  SearchResult,
  SourceDocument,
  ValidationReport,
} from './types'

export interface RegisterPaperInput {
  paperId: string
  paperPath: string
  sourceId: string
  sourcePath?: string
  sourceVersion?: string
}

export interface ProjectMutationOutcome {
  mutation: MutationResult
  indexes?: IndexBuildResult
  project?: ProjectOpenResult
  diagnostics: ProjectDiagnostic[]
  indexFailure?: Phase1ProjectError
}

export class Phase1ProjectError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly diagnostics: ProjectDiagnostic[] = [],
    public readonly cause?: unknown
  ) {
    super(message)
  }
}

const HUMAN_ACTOR: Actor = { type: 'human', id: 'researcher' }

export class Phase1ProjectService {
  constructor(private readonly runtime: ProjectRuntime) {}

  public create(projectRoot: string, projectId: string, title: string): Promise<ProjectOpenResult> {
    return this.runtime.registry.create(projectRoot, projectId, title)
  }

  public open(manifestPath: string): Promise<ProjectOpenResult> {
    this.runtime.papers.resetInstrumentation()
    return this.runtime.registry.open(manifestPath)
  }

  public async validate(manifestPath: string): Promise<ValidationReport> {
    const opened = await this.open(manifestPath)
    if (!opened.manifest) return { valid: false, diagnostics: opened.diagnostics }
    const report = await this.runtime.integrity.validate(path.dirname(manifestPath), opened.manifest)
    const diagnostics = [...opened.diagnostics, ...report.diagnostics]
    return { valid: !hasErrors(diagnostics), diagnostics }
  }

  public async rebuildIndexes(
    manifestPath: string,
    full = false
  ): Promise<IndexBuildResult> {
    const project = await this.openWritableProject(manifestPath)
    return this.runtime.indexes.rebuild(project.root, project.opened.manifest, full)
  }

  public async search(manifestPath: string, query: SearchQuery): Promise<SearchResult[]> {
    const opened = await this.open(manifestPath)
    if (!opened.paperIndex) return []
    return this.runtime.queries.search(opened.paperIndex, query)
  }

  public async registerPaper(
    manifestPath: string,
    input: RegisterPaperInput,
    actor: Actor = HUMAN_ACTOR
  ): Promise<ProjectMutationOutcome> {
    const project = await this.openWritableProject(manifestPath)
    const registration = await this.buildRegistration(project.root, input)
    const mutation = await this.runtime.registry.registerPaper(
      project.root,
      project.opened.manifest,
      registration,
      project.opened.manifestRevision,
      actor
    )
    if (!mutation.accepted) return { mutation, diagnostics: mutation.diagnostics ?? [] }
    return this.rebuildAfterMutation(manifestPath, mutation)
  }

  public async unregisterPaper(
    manifestPath: string,
    paperId: string,
    actor: Actor = HUMAN_ACTOR
  ): Promise<ProjectMutationOutcome> {
    const project = await this.openWritableProject(manifestPath)
    const mutation = await this.runtime.registry.unregisterPaper(
      project.root,
      project.opened.manifest,
      paperId,
      project.opened.manifestRevision,
      actor
    )
    if (!mutation.accepted) return { mutation, diagnostics: mutation.diagnostics ?? [] }
    return this.rebuildAfterMutation(manifestPath, mutation)
  }

  private async openWritableProject(manifestPath: string): Promise<WritableProject> {
    const opened = await this.open(manifestPath)
    if (!opened.manifest || !opened.manifestRevision) {
      throw new Phase1ProjectError(
        'project-manifest-invalid',
        'The project manifest is invalid.',
        opened.diagnostics
      )
    }
    if (opened.mode === 'read-only') {
      throw new Phase1ProjectError(
        'project-read-only',
        'The project is read-only until its reported errors are corrected.',
        opened.diagnostics
      )
    }
    return {
      root: path.dirname(manifestPath),
      opened: {
        ...opened,
        manifest: opened.manifest,
        manifestRevision: opened.manifestRevision,
      },
    }
  }

  private async buildRegistration(
    projectRoot: string,
    input: RegisterPaperInput
  ): Promise<PaperRegistration> {
    const provisional = provisionalRegistration(input)
    const read = await this.readRegistrationGraph(projectRoot, provisional)
    if (!read.graph || hasErrors(read.diagnostics)) {
      throw new Phase1ProjectError(
        'invalid-paper-graph',
        'The paper graph cannot be registered until its errors are corrected.',
        read.diagnostics
      )
    }
    const source = await this.buildSource(projectRoot, input, read.graph)
    return { paperId: input.paperId, path: input.paperPath, source }
  }

  private async readRegistrationGraph(
    projectRoot: string,
    registration: PaperRegistration
  ) {
    try {
      return await this.runtime.papers.read(projectRoot, registration)
    } catch (error) {
      throw paperReadError(error, registration.path)
    }
  }

  private async buildSource(
    projectRoot: string,
    input: RegisterPaperInput,
    graph: NonNullable<Awaited<ReturnType<ProjectRuntime['papers']['read']>>['graph']>
  ): Promise<SourceDocument> {
    const identity = await this.identifySource(projectRoot, input, graph.source?.pdf)
    return {
      sourceId: input.sourceId,
      ...identity,
      ...(graph.source?.doi ? { doi: graph.source.doi } : {}),
      title: graph.title,
      ...(input.sourceVersion ? { version: input.sourceVersion } : {}),
    }
  }

  private async identifySource(
    projectRoot: string,
    input: RegisterPaperInput,
    paperSourcePath: string | undefined
  ) {
    try {
      if (input.sourcePath) {
        return await this.runtime.integrity.identifyProjectSource(projectRoot, input.sourcePath)
      }
      if (!paperSourcePath) throw missingPaperSourcePath(input.paperPath)
      return await this.runtime.integrity.identifyPaperSource(
        projectRoot,
        input.paperPath,
        paperSourcePath
      )
    } catch (error) {
      if (error instanceof Phase1ProjectError) throw error
      throw sourceIdentityError(error, input.sourcePath ?? paperSourcePath ?? input.paperPath)
    }
  }

  private async rebuildAfterMutation(
    manifestPath: string,
    mutation: MutationResult
  ): Promise<ProjectMutationOutcome> {
    const project = await this.open(manifestPath)
    if (!project.manifest) {
      return { mutation, project, diagnostics: project.diagnostics }
    }
    try {
      const indexes = await this.runtime.indexes.rebuild(
        path.dirname(manifestPath),
        project.manifest
      )
      return { mutation, indexes, project, diagnostics: indexes.diagnostics }
    } catch (error) {
      const indexFailure = indexRebuildError(error)
      return {
        mutation,
        project,
        diagnostics: indexFailure.diagnostics,
        indexFailure,
      }
    }
  }
}

interface WritableProject {
  root: string
  opened: ProjectOpenResult & {
    manifest: NonNullable<ProjectOpenResult['manifest']>
    manifestRevision: string
  }
}

function provisionalRegistration(input: RegisterPaperInput): PaperRegistration {
  return {
    paperId: input.paperId,
    path: input.paperPath,
    source: {
      sourceId: input.sourceId,
      relativePath: input.sourcePath ?? input.paperPath,
      sourceDocumentHash: `sha256:${'0'.repeat(64)}`,
    },
  }
}

function missingPaperSourcePath(paperPath: string): Phase1ProjectError {
  return new Phase1ProjectError(
    'paper-source-path-required',
    'The paper graph does not identify its source PDF.',
    [diagnostic({
      layer: 'structural',
      code: 'paper-source-path-required',
      file: paperPath,
      rule: 'A registered paper must identify a source PDF.',
      action: 'Add source.pdf to the paper graph or provide a project-relative source path.',
    })]
  )
}

function sourceIdentityError(error: unknown, file: string): Phase1ProjectError {
  const pathCode = error instanceof ProjectPathError ? error.code : undefined
  const missing = isFileError(error, 'ENOENT')
  const code = pathCode ?? (missing ? 'missing-source-file' : 'inaccessible-source-file')
  return new Phase1ProjectError(
    code,
    'The paper source could not be registered.',
    [diagnostic({
      layer: pathCode ? 'structural' : 'integrity',
      code,
      file,
      rule: pathCode
        ? 'The source path is not a contained project-relative path.'
        : 'The source PDF cannot be read.',
      action: pathCode
        ? 'Choose a PDF inside the project and use its project-relative path.'
        : 'Restore read access to the source PDF before registering the paper.',
    })],
    error
  )
}

function paperReadError(error: unknown, file: string): Phase1ProjectError {
  const pathCode = error instanceof ProjectPathError ? error.code : undefined
  const missing = isFileError(error, 'ENOENT')
  const code = pathCode ?? (missing ? 'missing-paper-file' : 'inaccessible-paper-file')
  return new Phase1ProjectError(
    code,
    'The paper graph could not be registered.',
    [diagnostic({
      layer: pathCode ? 'structural' : 'integrity',
      code,
      file,
      rule: pathCode
        ? 'The paper graph path is not a contained project-relative path.'
        : 'The paper graph cannot be read.',
      action: pathCode
        ? 'Choose a paper graph inside the project.'
        : 'Restore read access to the paper graph before registering it.',
    })],
    error
  )
}

function indexRebuildError(cause: unknown): Phase1ProjectError {
  return new Phase1ProjectError(
    'index-rebuild-failed',
    'The authoritative mutation committed, but its derived indexes could not be rebuilt.',
    [diagnostic({
      layer: 'integrity',
      code: 'index-rebuild-failed',
      file: 'indexes',
      rule: 'The authoritative mutation committed, but its derived indexes could not be rebuilt.',
      action: 'Correct the reported file problem and rebuild the disposable indexes.',
    })],
    cause
  )
}
