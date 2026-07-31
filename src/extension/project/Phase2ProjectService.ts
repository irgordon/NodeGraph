import * as path from 'path'
import { realpath } from 'fs/promises'
import { calculateDocumentRevision } from './canonical'
import { hasErrors } from './diagnostics'
import {
  indexRebuildError,
  Phase1ProjectError,
} from './Phase1ProjectService'
import { ProjectRuntime } from './ProjectRuntime'
import {
  Actor,
  ClassificationVerification,
  ConstructRecord,
  ConstructTaxonomyDocument,
  ExtractionDocument,
  InterpretationVerification,
  MatrixCellDetail,
  MatrixFilters,
  MatrixSummary,
  MutationResult,
  ProjectDiagnostic,
  ProjectManifest,
  SourceVerification,
  SourceVerificationQueueItem,
} from './types'

const HUMAN_ACTOR: Actor = { type: 'human', id: 'researcher' }

export interface Phase2MutationOutcome {
  mutation: MutationResult
  diagnostics: ProjectDiagnostic[]
  indexFailure?: Phase1ProjectError
}

export interface MatrixOpenResult {
  matrix?: MatrixSummary
  diagnostics: ProjectDiagnostic[]
  hydrationCount: number
}

export class Phase2ProjectService {
  constructor(private readonly runtime: ProjectRuntime) {}

  public async migrate(manifestPath: string): Promise<Phase2MutationOutcome> {
    const result = await this.runtime.migrations.migratePhase2(
      manifestPath,
      HUMAN_ACTOR
    )
    if (!result.mutation.accepted || !result.manifest) {
      return { mutation: result.mutation, diagnostics: result.diagnostics }
    }
    return this.rebuildAcceptedMutation(
      path.dirname(manifestPath),
      result.manifest,
      result.mutation,
      result.diagnostics,
      true
    )
  }

  public async importExtraction(
    manifestPath: string,
    proposal: ExtractionDocument,
    actor: Actor,
    baseRevision?: string
  ): Promise<Phase2MutationOutcome> {
    const project = await this.openWritableProject(manifestPath)
    const current = await this.runtime.extractions.read(
      project.root,
      project.manifest,
      proposal.paperId
    )
    if (!current.value) {
      return rejectedOutcome(
        `extraction:${proposal.paperId}`,
        baseRevision ?? 'absent',
        current.diagnostics
      )
    }
    const mutation = await this.runtime.extractions.importProposal(
      project.root,
      project.manifest,
      proposal,
      baseRevision ?? calculateDocumentRevision(current.value),
      actor
    )
    return this.rebuildAfterMutation(project, mutation)
  }

  public async openMatrix(
    manifestPath: string,
    filters: MatrixFilters = {}
  ): Promise<MatrixOpenResult> {
    const project = await this.openWritableProject(manifestPath)
    let paperIndex = project.opened.paperIndex
    const diagnostics = [...project.opened.diagnostics]
    if (!paperIndex) {
      const rebuilt = await this.runtime.indexes.rebuild(
        project.root,
        project.manifest,
        true
      )
      diagnostics.push(...rebuilt.diagnostics)
      if (!hasErrors(rebuilt.diagnostics)) paperIndex = rebuilt.paperIndex
    }
    if (!paperIndex) {
      return { diagnostics, hydrationCount: this.runtime.papers.instrumentation().count }
    }
    const taxonomy = await this.runtime.synthesis.readTaxonomy(
      project.root,
      project.manifest
    )
    if (!taxonomy.value) {
      return {
        diagnostics: [...diagnostics, ...taxonomy.diagnostics],
        hydrationCount: this.runtime.papers.instrumentation().count,
      }
    }
    return {
      matrix: this.runtime.queries.matrix(
        paperIndex,
        taxonomy.value,
        filters
      ),
      diagnostics: [...diagnostics, ...taxonomy.diagnostics],
      hydrationCount: this.runtime.papers.instrumentation().count,
    }
  }

  public async hydrateCell(
    manifestPath: string,
    paperId: string,
    constructId: string
  ): Promise<MatrixCellDetail | undefined> {
    const project = await this.openWritableProject(manifestPath, false)
    return this.runtime.queries.hydrateMatrixCell(
      project.root,
      project.manifest,
      paperId,
      constructId
    )
  }

  public async exportCsv(
    manifestPath: string,
    filters: MatrixFilters = {}
  ): Promise<{ csv?: string; diagnostics: ProjectDiagnostic[] }> {
    const opened = await this.openMatrix(manifestPath, filters)
    if (!opened.matrix) return { diagnostics: opened.diagnostics }
    const project = await this.runtime.registry.open(manifestPath)
    if (!project.paperIndex) return { diagnostics: project.diagnostics }
    return {
      csv: this.runtime.csv.export(project.paperIndex, opened.matrix),
      diagnostics: opened.diagnostics,
    }
  }

  public async sourceQueue(
    manifestPath: string
  ): Promise<{
    items: SourceVerificationQueueItem[]
    diagnostics: ProjectDiagnostic[]
  }> {
    const project = await this.openWritableProject(manifestPath)
    return this.runtime.verification.sourceQueue(project.root, project.manifest)
  }

  public async sourceNavigation(
    manifestPath: string,
    evidenceId: string
  ) {
    const project = await this.openWritableProject(manifestPath, false)
    return this.runtime.verification.sourceNavigation(
      project.root,
      project.manifest,
      evidenceId
    )
  }

  public async verifySource(
    manifestPath: string,
    evidenceId: string,
    state: SourceVerification,
    baseRevision?: string
  ): Promise<Phase2MutationOutcome> {
    const project = await this.openWritableProject(manifestPath)
    const evidence = await this.runtime.synthesis.readEvidence(
      project.root,
      project.manifest
    )
    if (!evidence.value) {
      return rejectedOutcome(
        project.manifest.documents.evidence,
        baseRevision ?? 'absent',
        evidence.diagnostics
      )
    }
    const mutation = await this.runtime.verification.updateSourceVerification(
      project.root,
      project.manifest,
      evidenceId,
      state,
      baseRevision ?? calculateDocumentRevision(evidence.value),
      HUMAN_ACTOR
    )
    return this.rebuildAfterMutation(project, mutation)
  }

  public async verifyFinding(
    manifestPath: string,
    paperId: string,
    findingId: string,
    dimension: 'interpretation' | 'classification',
    state: InterpretationVerification | ClassificationVerification,
    baseRevision?: string
  ): Promise<Phase2MutationOutcome> {
    const project = await this.openWritableProject(manifestPath)
    const extraction = await this.extractionMutationContext(
      project,
      paperId,
      baseRevision
    )
    if (!extraction.ok) return extraction.outcome
    const mutation = await this.runtime.verification.updateFindingVerification(
      project.root,
      project.manifest,
      paperId,
      findingId,
      dimension,
      state,
      extraction.baseRevision,
      HUMAN_ACTOR
    )
    return this.rebuildAfterMutation(project, mutation)
  }

  public async verifyMappingClassification(
    manifestPath: string,
    paperId: string,
    mappingId: string,
    state: ClassificationVerification,
    baseRevision?: string
  ): Promise<Phase2MutationOutcome> {
    const project = await this.openWritableProject(manifestPath)
    const extraction = await this.extractionMutationContext(
      project,
      paperId,
      baseRevision
    )
    if (!extraction.ok) return extraction.outcome
    const mutation = await this.runtime.verification.updateMappingClassification(
      project.root,
      project.manifest,
      paperId,
      mappingId,
      state,
      extraction.baseRevision,
      HUMAN_ACTOR
    )
    return this.rebuildAfterMutation(project, mutation)
  }

  public async reviewMapping(
    manifestPath: string,
    paperId: string,
    mappingId: string,
    decision: 'approved' | 'rejected',
    baseRevision?: string
  ): Promise<Phase2MutationOutcome> {
    const project = await this.openWritableProject(manifestPath)
    const extraction = await this.extractionMutationContext(
      project,
      paperId,
      baseRevision
    )
    if (!extraction.ok) return extraction.outcome
    const mutation = await this.runtime.taxonomy.reviewMapping(
      project.root,
      project.manifest,
      paperId,
      mappingId,
      decision,
      extraction.baseRevision,
      HUMAN_ACTOR
    )
    return this.rebuildAfterMutation(project, mutation)
  }

  public async proposeConstruct(
    manifestPath: string,
    construct: Pick<ConstructRecord, 'constructId' | 'canonicalName' | 'definition'>,
    actor: Actor
  ): Promise<Phase2MutationOutcome> {
    const project = await this.openWritableProject(manifestPath)
    const taxonomy = await this.runtime.synthesis.readTaxonomy(
      project.root,
      project.manifest
    )
    if (!taxonomy.value) {
      return rejectedOutcome(
        project.manifest.documents.constructs,
        'absent',
        taxonomy.diagnostics
      )
    }
    const outcome = await this.runtime.taxonomy.proposeConstruct(
      project.root,
      project.manifest,
      construct,
      calculateDocumentRevision(taxonomy.value),
      actor
    )
    return this.rebuildAfterMutation(project, outcome.mutation)
  }

  public async taxonomy(
    manifestPath: string
  ): Promise<{
    value?: ConstructTaxonomyDocument
    diagnostics: ProjectDiagnostic[]
  }> {
    const project = await this.openWritableProject(manifestPath, false)
    return this.runtime.synthesis.readTaxonomy(project.root, project.manifest)
  }

  public async reviewConstruct(
    manifestPath: string,
    constructId: string,
    decision: 'approved' | 'rejected'
  ): Promise<Phase2MutationOutcome> {
    const project = await this.openWritableProject(manifestPath)
    const taxonomy = await this.runtime.synthesis.readTaxonomy(
      project.root,
      project.manifest
    )
    if (!taxonomy.value) {
      return rejectedOutcome(
        project.manifest.documents.constructs,
        'absent',
        taxonomy.diagnostics
      )
    }
    const mutation = await this.runtime.taxonomy.reviewConstruct(
      project.root,
      project.manifest,
      constructId,
      decision,
      calculateDocumentRevision(taxonomy.value),
      HUMAN_ACTOR
    )
    return this.rebuildAfterMutation(project, mutation)
  }

  public async locateMatrixCell(
    manifestPath: string,
    paperPath: string,
    nodeId: string
  ) {
    const project = await this.runtime.registry.open(manifestPath)
    if (!project.manifest || !project.paperIndex) return undefined
    const projectRoot = path.dirname(manifestPath)
    const registration = await findRegistrationByAbsolutePath(
      this.runtime,
      projectRoot,
      project.manifest,
      paperPath
    )
    return registration
      ? this.runtime.queries.locateMatrixCell(
        project.paperIndex,
        registration.path,
        nodeId
      )
      : undefined
  }

  public async paperGraphTarget(
    manifestPath: string,
    paperId: string
  ): Promise<string | undefined> {
    const project = await this.openWritableProject(manifestPath, false)
    const registration = project.manifest.papers.find(
      paper => paper.paperId === paperId
    )
    return registration
      ? this.runtime.registry.resolveDocument(
        project.root,
        registration.path,
        true
      )
      : undefined
  }

  private async openWritableProject(
    manifestPath: string,
    resetInstrumentation = true
  ): Promise<WritableProject> {
    if (resetInstrumentation) this.runtime.papers.resetInstrumentation()
    const opened = await this.runtime.registry.open(manifestPath)
    if (!opened.manifest) {
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
      manifest: opened.manifest,
      opened,
    }
  }

  private async extractionMutationContext(
    project: WritableProject,
    paperId: string,
    baseRevision?: string
  ): Promise<ExtractionMutationContext> {
    const registration = project.manifest.papers.find(
      paper => paper.paperId === paperId
    )
    if (!registration) {
      return {
        ok: false,
        outcome: rejectedOutcome(
          'project.nodegraph.json',
          baseRevision ?? 'absent',
          []
        ),
      }
    }
    const extraction = await this.runtime.synthesis.readExtraction(
      project.root,
      registration
    )
    if (!extraction.value) {
      return {
        ok: false,
        outcome: rejectedOutcome(
          registration.extractionPath ?? paperId,
          baseRevision ?? 'absent',
          extraction.diagnostics
        ),
      }
    }
    return {
      ok: true,
      baseRevision: baseRevision ?? calculateDocumentRevision(extraction.value),
    }
  }

  private async rebuildAfterMutation(
    project: WritableProject,
    mutation: MutationResult
  ): Promise<Phase2MutationOutcome> {
    if (!mutation.accepted) {
      return { mutation, diagnostics: mutation.diagnostics ?? [] }
    }
    return this.rebuildAcceptedMutation(
      project.root,
      project.manifest,
      mutation
    )
  }

  private async rebuildAcceptedMutation(
    projectRoot: string,
    manifest: ProjectManifest,
    mutation: MutationResult,
    priorDiagnostics: ProjectDiagnostic[] = [],
    full = false
  ): Promise<Phase2MutationOutcome> {
    try {
      const indexes = await this.runtime.indexes.rebuild(
        projectRoot,
        manifest,
        full
      )
      return {
        mutation,
        diagnostics: [...priorDiagnostics, ...indexes.diagnostics],
      }
    } catch (error) {
      const indexFailure = indexRebuildError(error)
      return {
        mutation,
        diagnostics: [...priorDiagnostics, ...indexFailure.diagnostics],
        indexFailure,
      }
    }
  }
}

async function findRegistrationByAbsolutePath(
  runtime: ProjectRuntime,
  projectRoot: string,
  manifest: ProjectManifest,
  target: string
) {
  const canonicalTarget = await canonicalExistingPath(target)
  for (const registration of manifest.papers) {
    const resolved = await runtime.registry.resolveDocument(
      projectRoot,
      registration.path
    )
    if (await canonicalExistingPath(resolved) === canonicalTarget) {
      return registration
    }
  }
  return undefined
}

async function canonicalExistingPath(target: string): Promise<string> {
  try {
    return await realpath(target)
  } catch {
    return path.resolve(target)
  }
}

interface WritableProject {
  root: string
  manifest: ProjectManifest
  opened: Awaited<ReturnType<ProjectRuntime['registry']['open']>>
}

type ExtractionMutationContext =
  | { ok: true; baseRevision: string }
  | { ok: false; outcome: Phase2MutationOutcome }

function rejectedOutcome(
  targetDocument: string,
  revision: string,
  diagnostics: ProjectDiagnostic[]
): Phase2MutationOutcome {
  return {
    mutation: {
      accepted: false,
      code: 'phase2-operation-rejected',
      targetDocument,
      currentRevision: revision,
      receivedBaseRevision: revision,
      retryable: false,
      rejectedOperations: [],
      diagnostics,
    },
    diagnostics,
  }
}
