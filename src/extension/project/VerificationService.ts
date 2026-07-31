import { randomUUID } from 'crypto'
import { diagnostic } from './diagnostics'
import { IntegrityService } from './IntegrityService'
import { ProjectPathResolver } from './ProjectPathResolver'
import {
  ReviewStateService,
  VerificationDimension,
  VerificationValue,
} from './ReviewStateService'
import { SynthesisRepository } from './SynthesisRepository'
import {
  Actor,
  Clock,
  EvidenceRecordsDocument,
  ExtractionDocument,
  MutationResult,
  ProjectDiagnostic,
  ProjectManifest,
  SourceVerification,
  SourceVerificationQueueItem,
  systemClock,
} from './types'

export interface SourceNavigation {
  sourcePath?: string
  quote?: string
  page?: number
  diagnostics: ProjectDiagnostic[]
}

export class VerificationService {
  constructor(
    private readonly paths: ProjectPathResolver,
    private readonly synthesis: SynthesisRepository,
    private readonly integrity: IntegrityService,
    private readonly reviews: ReviewStateService,
    private readonly clock: Clock = systemClock
  ) {}

  public async sourceQueue(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{
    items: SourceVerificationQueueItem[]
    diagnostics: ProjectDiagnostic[]
  }> {
    const evidence = await this.synthesis.readEvidence(projectRoot, manifest)
    if (!evidence.value) return { items: [], diagnostics: evidence.diagnostics }
    const referenced = await this.referencedEvidence(projectRoot, manifest)
    const sourceHealth = await this.inspectSources(projectRoot, manifest)
    const diagnostics = [
      ...evidence.diagnostics,
      ...referenced.diagnostics,
      ...sourceHealth.diagnostics,
    ]
    const registrations = new Map(manifest.papers.map(paper => [paper.paperId, paper]))
    const items = evidence.value.evidence
      .filter(record => referenced.ids.has(record.evidenceId))
      .filter(record => record.reviewState.verification.source !== 'verified')
      .map(record => {
        const registration = registrations.get(record.paperId)
        return {
          evidenceId: record.evidenceId,
          paperId: record.paperId,
          sourcePath: registration?.source.relativePath ?? record.source.relativePath,
          quote: record.quote.text,
          page: record.locator.page,
          state: record.reviewState.verification.source,
          stale: record.reviewState.verification.source === 'stale' ||
            sourceHealth.stalePaperIds.has(record.paperId),
        }
      })
    return { items, diagnostics }
  }

  public async sourceNavigation(
    projectRoot: string,
    manifest: ProjectManifest,
    evidenceId: string
  ): Promise<SourceNavigation> {
    const evidence = await this.synthesis.readEvidence(projectRoot, manifest)
    if (!evidence.value) return { diagnostics: evidence.diagnostics }
    const record = evidence.value.evidence.find(item => item.evidenceId === evidenceId)
    if (!record) return { diagnostics: [missingEvidence(evidenceId)] }
    const registration = manifest.papers.find(
      paper => paper.paperId === record.paperId &&
        paper.source.sourceId === record.source.sourceId
    )
    if (!registration) {
      return { diagnostics: [missingEvidenceSourceRegistration(record)] }
    }
    try {
      return {
        sourcePath: await this.paths.resolve(
          projectRoot,
          registration.source.relativePath,
          true
        ),
        quote: record.quote.text,
        page: record.locator.page,
        diagnostics: evidence.diagnostics,
      }
    } catch {
      return {
        diagnostics: [
          missingSourceTarget(registration.source.relativePath, evidenceId),
        ],
      }
    }
  }

  public async updateSourceVerification(
    projectRoot: string,
    manifest: ProjectManifest,
    evidenceId: string,
    state: SourceVerification,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    const read = await this.synthesis.readEvidence(projectRoot, manifest)
    if (!read.value) {
      return verificationRejected(
        manifest.documents.evidence,
        baseRevision,
        read.diagnostics
      )
    }
    const candidate = structuredClone(read.value)
    const record = candidate.evidence.find(item => item.evidenceId === evidenceId)
    if (!record) {
      return verificationRejected(
        manifest.documents.evidence,
        baseRevision,
        [missingEvidence(evidenceId)]
      )
    }
    const transition = this.reviews.transitionVerification(
      record.reviewState,
      'source',
      state,
      actor,
      manifest.documents.evidence
    )
    if (!transition.value) {
      return verificationRejected(
        manifest.documents.evidence,
        baseRevision,
        transition.diagnostics
      )
    }
    record.reviewState = transition.value
    record.modified = this.clock.now()
    candidate.modified = this.clock.now()
    return this.applyRoot(
      projectRoot,
      manifest,
      manifest.documents.evidence,
      candidate,
      baseRevision,
      actor,
      `verification.source-${state}`,
      evidenceId
    )
  }

  public updateFindingVerification(
    projectRoot: string,
    manifest: ProjectManifest,
    paperId: string,
    findingId: string,
    dimension: 'interpretation' | 'classification',
    state: VerificationValue,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    return this.updateExtractionReview(
      projectRoot,
      manifest,
      paperId,
      findingId,
      dimension,
      state,
      baseRevision,
      actor,
      extraction => extraction.fields.findings.items?.find(
        finding => finding.findingId === findingId
      ),
      'finding'
    )
  }

  public updateMappingClassification(
    projectRoot: string,
    manifest: ProjectManifest,
    paperId: string,
    mappingId: string,
    state: VerificationValue,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    return this.updateExtractionReview(
      projectRoot,
      manifest,
      paperId,
      mappingId,
      'classification',
      state,
      baseRevision,
      actor,
      extraction => extraction.constructMappings.find(
        mapping => mapping.mappingId === mappingId
      ),
      'mapping'
    )
  }

  private async updateExtractionReview(
    projectRoot: string,
    manifest: ProjectManifest,
    paperId: string,
    objectId: string,
    dimension: VerificationDimension,
    state: VerificationValue,
    baseRevision: string,
    actor: Actor,
    find: (extraction: ExtractionDocument) => { reviewState: ExtractionDocument['reviewState'] } | undefined,
    kind: 'finding' | 'mapping'
  ): Promise<MutationResult> {
    const registration = manifest.papers.find(paper => paper.paperId === paperId)
    if (!registration?.extractionPath) {
      return verificationRejected(
        'project.nodegraph.json',
        baseRevision,
        [missingExtraction(paperId)]
      )
    }
    const read = await this.synthesis.readExtraction(projectRoot, registration)
    if (!read.value) {
      return verificationRejected(
        registration.extractionPath,
        baseRevision,
        read.diagnostics
      )
    }
    const candidate = structuredClone(read.value)
    const object = find(candidate)
    if (!object) {
      return verificationRejected(
        registration.extractionPath,
        baseRevision,
        [missingReviewObject(objectId, kind, registration.extractionPath)]
      )
    }
    const transition = this.reviews.transitionVerification(
      object.reviewState,
      dimension,
      state,
      actor,
      registration.extractionPath
    )
    if (!transition.value) {
      return verificationRejected(
        registration.extractionPath,
        baseRevision,
        transition.diagnostics
      )
    }
    object.reviewState = transition.value
    candidate.modified = this.clock.now()
    return this.applyRoot(
      projectRoot,
      manifest,
      registration.extractionPath,
      candidate,
      baseRevision,
      actor,
      `verification.${kind}-${dimension}-${state}`,
      objectId
    )
  }

  private async referencedEvidence(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{ ids: Set<string>; diagnostics: ProjectDiagnostic[] }> {
    const diagnostics: ProjectDiagnostic[] = []
    const ids = new Set<string>()
    for (const paper of manifest.papers) {
      const read = await this.synthesis.readExtraction(projectRoot, paper)
      diagnostics.push(...read.diagnostics)
      if (!read.value) continue
      extractionEvidenceIds(read.value).forEach(id => ids.add(id))
    }
    return { ids, diagnostics }
  }

  private async inspectSources(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{
    stalePaperIds: Set<string>
    diagnostics: ProjectDiagnostic[]
  }> {
    const inspected: {
      paperId: string
      result: Awaited<ReturnType<IntegrityService['inspectSource']>>
    }[] = []
    for (const paper of manifest.papers) {
      inspected.push({
        paperId: paper.paperId,
        result: await this.integrity.inspectSource(projectRoot, paper),
      })
    }
    return {
      stalePaperIds: new Set(inspected
        .filter(item => item.result.diagnostics.length > 0)
        .map(item => item.paperId)),
      diagnostics: inspected.flatMap(item => item.result.diagnostics),
    }
  }

  private applyRoot(
    projectRoot: string,
    manifest: ProjectManifest,
    targetDocument: string,
    candidate: EvidenceRecordsDocument | ExtractionDocument,
    baseRevision: string,
    actor: Actor,
    action: string,
    objectId: string
  ): Promise<MutationResult> {
    return this.synthesis.applyMutation(projectRoot, manifest, {
      mutationId: `mutation_${randomUUID().replace(/-/g, '')}`,
      targetDocument,
      baseRevision,
      operations: [{ op: 'replace', path: '', value: candidate }],
      requestedAt: this.clock.now(),
      actor,
    }, { action, objectId })
  }
}

function extractionEvidenceIds(extraction: ExtractionDocument): string[] {
  return [...new Set([
    ...extraction.fields.exactEvidenceQuotations.evidenceIds,
    ...(extraction.fields.findings.items ?? []).flatMap(item => item.evidenceIds),
    ...extraction.constructMappings.flatMap(item => item.evidenceIds),
  ])]
}

function verificationRejected(
  targetDocument: string,
  baseRevision: string,
  diagnostics: ProjectDiagnostic[]
): MutationResult {
  return {
    accepted: false,
    code: 'verification-rejected',
    targetDocument,
    currentRevision: baseRevision,
    receivedBaseRevision: baseRevision,
    retryable: false,
    rejectedOperations: [],
    diagnostics,
  }
}

function missingEvidence(evidenceId: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'missing-evidence-reference',
    file: 'evidence/records.json',
    objectId: evidenceId,
    rule: 'The requested authoritative evidence record does not exist.',
    action: 'Refresh the verification queue and choose an existing record.',
  })
}

function missingSourceTarget(file: string, evidenceId: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'integrity',
    severity: 'warning',
    code: 'missing-source-file',
    file,
    objectId: evidenceId,
    rule: 'The evidence source cannot be opened.',
    action: 'Restore the registered PDF before verifying the quotation.',
  })
}

function missingEvidenceSourceRegistration(
  evidence: EvidenceRecordsDocument['evidence'][number]
): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'source-registration-mismatch',
    file: 'project.nodegraph.json',
    objectId: evidence.evidenceId,
    rule: 'The evidence source does not match a registered paper source.',
    action: 'Restore the source registration before opening this evidence.',
  })
}

function missingExtraction(paperId: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'phase2-document-not-registered',
    file: 'project.nodegraph.json',
    objectId: paperId,
    rule: 'The registered paper has no extraction document.',
    action: 'Run the Phase 2 migration before verification.',
  })
}

function missingReviewObject(
  objectId: string,
  kind: 'finding' | 'mapping',
  file: string
): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: `${kind}-not-found`,
    file,
    objectId,
    rule: `The requested ${kind} does not exist in the extraction.`,
    action: 'Refresh the extraction and choose an existing record.',
  })
}
