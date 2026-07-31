import { randomUUID } from 'crypto'
import { ConstructResolver } from './ConstructResolver'
import { diagnostic } from './diagnostics'
import { pendingReviewState } from './extractionDefaults'
import { cleanMetadataValues, normalizeMetadataSearch } from './metadata'
import { ReviewStateService } from './ReviewStateService'
import { SynthesisRepository } from './SynthesisRepository'
import {
  Actor,
  Clock,
  ConstructMapping,
  ConstructRecord,
  ConstructTaxonomyDocument,
  ExtractionDocument,
  MethodologyRegistryDocument,
  MutationResult,
  ParadigmRecord,
  ProjectDiagnostic,
  ProjectManifest,
  systemClock,
} from './types'

export interface TaxonomyMutationOutcome {
  mutation: MutationResult
  duplicateCandidates?: ConstructRecord[]
}

export class TaxonomyService {
  constructor(
    private readonly synthesis: SynthesisRepository,
    private readonly resolver: ConstructResolver,
    private readonly reviews: ReviewStateService,
    private readonly clock: Clock = systemClock
  ) {}

  public listApproved(taxonomy: ConstructTaxonomyDocument): ConstructRecord[] {
    return taxonomy.constructs.filter(construct => construct.status === 'approved')
  }

  public resolveCanonicalId(
    taxonomy: ConstructTaxonomyDocument,
    constructId: string,
    file: string
  ) {
    return this.resolver.resolve(taxonomy, constructId, file)
  }

  public resolveAlias(
    taxonomy: ConstructTaxonomyDocument,
    sourceTerm: string,
    file: string
  ) {
    return this.resolver.resolveTerm(taxonomy, sourceTerm, file)
  }

  public findLikelyDuplicates(
    taxonomy: ConstructTaxonomyDocument,
    proposedName: string
  ): ConstructRecord[] {
    const needle = normalizeMetadataSearch(proposedName)
    return taxonomy.constructs.filter(construct =>
      [construct.canonicalName, ...construct.aliases]
        .some(value => isLikelyDuplicate(needle, normalizeMetadataSearch(value)))
    )
  }

  public async proposeConstruct(
    projectRoot: string,
    manifest: ProjectManifest,
    construct: Pick<ConstructRecord, 'constructId' | 'canonicalName' | 'definition'>,
    baseRevision: string,
    actor: Actor
  ): Promise<TaxonomyMutationOutcome> {
    const read = await this.synthesis.readTaxonomy(projectRoot, manifest)
    if (!read.value) return { mutation: readRejected(manifest.documents.constructs, baseRevision, read.diagnostics) }
    const duplicates = this.findLikelyDuplicates(read.value, construct.canonicalName)
    const candidate: ConstructTaxonomyDocument = {
      ...read.value,
      constructs: [...read.value.constructs, {
        ...construct,
        ...(construct.definition ? { definition: construct.definition } : {}),
        aliases: [],
        status: 'proposed',
        reviewState: pendingReviewState(actor.type === 'agent' ? 'ai' : 'human'),
      }],
      modified: this.clock.now(),
    }
    return {
      mutation: await this.applyTaxonomy(
        projectRoot,
        manifest,
        candidate,
        baseRevision,
        actor,
        'taxonomy.construct-proposed',
        construct.constructId
      ),
      duplicateCandidates: duplicates,
    }
  }

  public reviewConstruct(
    projectRoot: string,
    manifest: ProjectManifest,
    constructId: string,
    decision: 'approved' | 'rejected',
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    if (actor.type !== 'human') {
      return Promise.resolve(humanAuthorityRejected(
        manifest.documents.constructs,
        baseRevision,
        constructId
      ))
    }
    return this.updateConstruct(
      projectRoot,
      manifest,
      constructId,
      baseRevision,
      actor,
      `taxonomy.construct-${decision}`,
      (taxonomy, construct) => {
        const review = this.reviews.transitionResearcherApproval(
          construct.reviewState,
          decision,
          actor,
          manifest.documents.constructs
        )
        if (!review.value) return review.diagnostics
        construct.reviewState = review.value
        if (decision === 'approved') construct.status = 'approved'
        taxonomy.taxonomyVersion += 1
        return []
      }
    )
  }

  public mergeConstructs(
    projectRoot: string,
    manifest: ProjectManifest,
    sourceId: string,
    primaryId: string,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    if (actor.type !== 'human') {
      return Promise.resolve(humanAuthorityRejected(
        manifest.documents.constructs,
        baseRevision,
        sourceId
      ))
    }
    return this.updateTaxonomy(
      projectRoot,
      manifest,
      baseRevision,
      actor,
      'taxonomy.construct-merged',
      sourceId,
      taxonomy => mergeConstructRecords(taxonomy, sourceId, primaryId),
      { deprecatedConstructId: sourceId, primaryConstructId: primaryId }
    )
  }

  public async proposeMapping(
    projectRoot: string,
    manifest: ProjectManifest,
    paperId: string,
    mapping: Pick<ConstructMapping, 'mappingId' | 'sourceTerm' | 'constructId' | 'evidenceIds'>,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    return this.updateExtraction(
      projectRoot,
      manifest,
      paperId,
      baseRevision,
      actor,
      'taxonomy.mapping-proposed',
      mapping.mappingId,
      extraction => {
        const proposed: ConstructMapping = {
          ...mapping,
          ...(mapping.constructId ? { constructId: mapping.constructId } : {}),
          mappingStatus: mapping.constructId ? 'pending' : 'unmapped',
          reviewState: pendingReviewState(actor.type === 'agent' ? 'ai' : 'human'),
        }
        extraction.constructMappings.push(proposed)
        extraction.fields.keyConstructs = {
          reportingStatus: 'present',
          mappingIds: [
            ...(extraction.fields.keyConstructs.mappingIds ?? []),
            mapping.mappingId,
          ],
        }
        return []
      }
    )
  }

  public reviewMapping(
    projectRoot: string,
    manifest: ProjectManifest,
    paperId: string,
    mappingId: string,
    decision: 'approved' | 'rejected',
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    if (actor.type !== 'human') {
      return Promise.resolve(humanAuthorityRejected(
        extractionPath(manifest, paperId),
        baseRevision,
        mappingId
      ))
    }
    return this.updateExtraction(
      projectRoot,
      manifest,
      paperId,
      baseRevision,
      actor,
      `taxonomy.mapping-${decision}`,
      mappingId,
      async (extraction, root) => {
        const mapping = extraction.constructMappings.find(item => item.mappingId === mappingId)
        if (!mapping) return [missingMapping(mappingId, root)]
        if (decision === 'approved') {
          const taxonomy = await this.synthesis.readTaxonomy(projectRoot, manifest)
          if (!taxonomy.value) return taxonomy.diagnostics
          if (!mapping.constructId) return [missingMappingTarget(mappingId, root)]
          const resolved = this.resolver.resolve(taxonomy.value, mapping.constructId, root)
          if (!resolved.constructId) return resolved.diagnostics
          mapping.constructId = resolved.constructId
        }
        const review = this.reviews.transitionResearcherApproval(
          mapping.reviewState,
          decision,
          actor,
          root
        )
        if (!review.value) return review.diagnostics
        mapping.reviewState = review.value
        mapping.mappingStatus = decision
        return []
      }
    )
  }

  public remapConstruct(
    projectRoot: string,
    manifest: ProjectManifest,
    paperId: string,
    mappingId: string,
    constructId: string,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    if (actor.type !== 'human') {
      return Promise.resolve(humanAuthorityRejected(
        extractionPath(manifest, paperId),
        baseRevision,
        mappingId
      ))
    }
    return this.updateExtraction(
      projectRoot,
      manifest,
      paperId,
      baseRevision,
      actor,
      'taxonomy.mapping-remapped',
      mappingId,
      async (extraction, root) => {
        const mapping = extraction.constructMappings.find(item => item.mappingId === mappingId)
        if (!mapping) return [missingMapping(mappingId, root)]
        const taxonomy = await this.synthesis.readTaxonomy(projectRoot, manifest)
        if (!taxonomy.value) return taxonomy.diagnostics
        const resolved = this.resolver.resolve(taxonomy.value, constructId, root)
        if (!resolved.constructId) return resolved.diagnostics
        mapping.constructId = resolved.constructId
        mapping.mappingStatus = 'approved'
        return []
      }
    )
  }

  public listApprovedParadigms(
    registry: MethodologyRegistryDocument
  ): ParadigmRecord[] {
    return registry.paradigms.filter(paradigm => paradigm.status === 'approved')
  }

  public async proposeParadigm(
    projectRoot: string,
    manifest: ProjectManifest,
    paradigmId: string,
    label: string,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    const read = await this.synthesis.readMethodologies(projectRoot, manifest)
    if (!read.value || !manifest.documents.methodologies) {
      return readRejected(
        manifest.documents.methodologies ?? 'methodologies',
        baseRevision,
        read.diagnostics
      )
    }
    const candidate: MethodologyRegistryDocument = {
      ...read.value,
      paradigms: [...read.value.paradigms, {
        paradigmId,
        label,
        aliases: [],
        status: 'proposed',
        reviewState: pendingReviewState(actor.type === 'agent' ? 'ai' : 'human'),
      }],
      modified: this.clock.now(),
    }
    return this.applyMethodologies(
      projectRoot,
      manifest,
      candidate,
      baseRevision,
      actor,
      'taxonomy.paradigm-proposed',
      paradigmId
    )
  }

  public async reviewParadigm(
    projectRoot: string,
    manifest: ProjectManifest,
    paradigmId: string,
    decision: 'approved' | 'rejected',
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    if (actor.type !== 'human') {
      return humanAuthorityRejected(
        manifest.documents.methodologies ?? 'methodologies',
        baseRevision,
        paradigmId
      )
    }
    const read = await this.synthesis.readMethodologies(projectRoot, manifest)
    if (!read.value || !manifest.documents.methodologies) {
      return readRejected(
        manifest.documents.methodologies ?? 'methodologies',
        baseRevision,
        read.diagnostics
      )
    }
    const paradigm = read.value.paradigms.find(item => item.paradigmId === paradigmId)
    if (!paradigm) return readRejected(
      manifest.documents.methodologies,
      baseRevision,
      [missingParadigm(paradigmId, manifest.documents.methodologies)]
    )
    const review = this.reviews.transitionResearcherApproval(
      paradigm.reviewState,
      decision,
      actor,
      manifest.documents.methodologies
    )
    if (!review.value) {
      return readRejected(
        manifest.documents.methodologies,
        baseRevision,
        review.diagnostics
      )
    }
    const candidate: MethodologyRegistryDocument = {
      ...read.value,
      registryVersion: read.value.registryVersion + 1,
      paradigms: read.value.paradigms.map(item => item.paradigmId !== paradigmId
        ? item
        : {
          ...item,
          status: decision === 'approved' ? 'approved' : 'proposed',
          reviewState: review.value!,
        }),
      modified: this.clock.now(),
    }
    return this.applyMethodologies(
      projectRoot,
      manifest,
      candidate,
      baseRevision,
      actor,
      `taxonomy.paradigm-${decision}`,
      paradigmId
    )
  }

  private async updateConstruct(
    projectRoot: string,
    manifest: ProjectManifest,
    constructId: string,
    baseRevision: string,
    actor: Actor,
    action: string,
    update: (
      taxonomy: ConstructTaxonomyDocument,
      construct: ConstructRecord
    ) => ProjectDiagnostic[]
  ): Promise<MutationResult> {
    return this.updateTaxonomy(
      projectRoot,
      manifest,
      baseRevision,
      actor,
      action,
      constructId,
      taxonomy => {
        const construct = taxonomy.constructs.find(item => item.constructId === constructId)
        return construct
          ? update(taxonomy, construct)
          : [missingConstruct(constructId, manifest.documents.constructs)]
      }
    )
  }

  private async updateTaxonomy(
    projectRoot: string,
    manifest: ProjectManifest,
    baseRevision: string,
    actor: Actor,
    action: string,
    objectId: string,
    update: (taxonomy: ConstructTaxonomyDocument) => ProjectDiagnostic[],
    auditMetadata?: Record<string, unknown>
  ): Promise<MutationResult> {
    const read = await this.synthesis.readTaxonomy(projectRoot, manifest)
    if (!read.value) {
      return readRejected(manifest.documents.constructs, baseRevision, read.diagnostics)
    }
    const candidate = structuredClone(read.value)
    const diagnostics = update(candidate)
    if (diagnostics.length) {
      return readRejected(manifest.documents.constructs, baseRevision, diagnostics)
    }
    candidate.modified = this.clock.now()
    return this.applyTaxonomy(
      projectRoot,
      manifest,
      candidate,
      baseRevision,
      actor,
      action,
      objectId,
      auditMetadata
    )
  }

  private async updateExtraction(
    projectRoot: string,
    manifest: ProjectManifest,
    paperId: string,
    baseRevision: string,
    actor: Actor,
    action: string,
    objectId: string,
    update: (
      extraction: ExtractionDocument,
      file: string
    ) => ProjectDiagnostic[] | Promise<ProjectDiagnostic[]>
  ): Promise<MutationResult> {
    const registration = manifest.papers.find(paper => paper.paperId === paperId)
    if (!registration?.extractionPath) {
      return readRejected('project.nodegraph.json', baseRevision, [
        missingExtraction(paperId),
      ])
    }
    const read = await this.synthesis.readExtraction(projectRoot, registration)
    if (!read.value) {
      return readRejected(registration.extractionPath, baseRevision, read.diagnostics)
    }
    const candidate = structuredClone(read.value)
    const diagnostics = await update(candidate, registration.extractionPath)
    if (diagnostics.length) {
      return readRejected(registration.extractionPath, baseRevision, diagnostics)
    }
    candidate.modified = this.clock.now()
    return this.applyExtraction(
      projectRoot,
      manifest,
      candidate,
      registration.extractionPath,
      baseRevision,
      actor,
      action,
      objectId
    )
  }

  private applyTaxonomy(
    projectRoot: string,
    manifest: ProjectManifest,
    candidate: ConstructTaxonomyDocument,
    baseRevision: string,
    actor: Actor,
    action: string,
    objectId: string,
    auditMetadata?: Record<string, unknown>
  ): Promise<MutationResult> {
    return this.applyRootMutation(
      projectRoot,
      manifest,
      manifest.documents.constructs,
      candidate,
      baseRevision,
      actor,
      action,
      objectId,
      auditMetadata
    )
  }

  private applyMethodologies(
    projectRoot: string,
    manifest: ProjectManifest,
    candidate: MethodologyRegistryDocument,
    baseRevision: string,
    actor: Actor,
    action: string,
    objectId: string
  ): Promise<MutationResult> {
    return this.applyRootMutation(
      projectRoot,
      manifest,
      manifest.documents.methodologies!,
      candidate,
      baseRevision,
      actor,
      action,
      objectId
    )
  }

  private applyExtraction(
    projectRoot: string,
    manifest: ProjectManifest,
    candidate: ExtractionDocument,
    target: string,
    baseRevision: string,
    actor: Actor,
    action: string,
    objectId: string
  ): Promise<MutationResult> {
    return this.applyRootMutation(
      projectRoot,
      manifest,
      target,
      candidate,
      baseRevision,
      actor,
      action,
      objectId
    )
  }

  private applyRootMutation(
    projectRoot: string,
    manifest: ProjectManifest,
    targetDocument: string,
    candidate: unknown,
    baseRevision: string,
    actor: Actor,
    action: string,
    objectId: string,
    auditMetadata?: Record<string, unknown>
  ): Promise<MutationResult> {
    return this.synthesis.applyMutation(projectRoot, manifest, {
      mutationId: `mutation_${randomUUID().replace(/-/g, '')}`,
      targetDocument,
      baseRevision,
      operations: [{ op: 'replace', path: '', value: candidate }],
      requestedAt: this.clock.now(),
      actor,
    }, { action, objectId, metadata: auditMetadata })
  }
}

function mergeConstructRecords(
  taxonomy: ConstructTaxonomyDocument,
  sourceId: string,
  primaryId: string
): ProjectDiagnostic[] {
  const source = taxonomy.constructs.find(item => item.constructId === sourceId)
  const primary = taxonomy.constructs.find(item => item.constructId === primaryId)
  if (!source) return [missingConstruct(sourceId, 'taxonomy/constructs.json')]
  if (sourceId === primaryId) return [selfMergeDiagnostic(sourceId)]
  if (!isActiveApprovedConstruct(source)) return [inactiveMergeSource(sourceId)]
  if (!primary || !isActiveApprovedConstruct(primary)) {
    return [missingApprovedPrimary(primaryId)]
  }
  primary.aliases = cleanMetadataValues([
    ...primary.aliases,
    source.canonicalName,
    ...source.aliases,
  ])
  source.status = 'deprecated'
  source.primaryConstructId = primaryId
  taxonomy.taxonomyVersion += 1
  return []
}

function isActiveApprovedConstruct(construct: ConstructRecord): boolean {
  return construct.status === 'approved' &&
    construct.reviewState.approval.researcher === 'approved'
}

function isLikelyDuplicate(left: string, right: string): boolean {
  if (!left || !right) return false
  return left === right || left.includes(right) || right.includes(left)
}

function readRejected(
  targetDocument: string,
  baseRevision: string,
  diagnostics: ProjectDiagnostic[]
): MutationResult {
  return {
    accepted: false,
    code: 'taxonomy-operation-rejected',
    targetDocument,
    currentRevision: baseRevision,
    receivedBaseRevision: baseRevision,
    retryable: false,
    rejectedOperations: [],
    diagnostics,
  }
}

function humanAuthorityRejected(
  targetDocument: string,
  baseRevision: string,
  objectId: string
): MutationResult {
  return readRejected(targetDocument, baseRevision, [diagnostic({
    layer: 'structural',
    code: 'researcher-authority-required',
    file: targetDocument,
    objectId,
    rule: 'Only a researcher can approve, reject, merge, or remap taxonomy records.',
    action: 'Submit the change as a proposal for researcher review.',
  })])
}

function extractionPath(manifest: ProjectManifest, paperId: string): string {
  return manifest.papers.find(paper => paper.paperId === paperId)?.extractionPath
    ?? 'project.nodegraph.json'
}

function missingConstruct(constructId: string, file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'construct-not-found',
    file,
    objectId: constructId,
    rule: 'The requested construct does not exist.',
    action: 'Refresh the taxonomy and choose an existing construct.',
  })
}

function missingApprovedPrimary(constructId: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'primary-construct-not-active',
    file: 'taxonomy/constructs.json',
    objectId: constructId,
    rule: 'A merge target must be an approved construct.',
    action: 'Approve the primary construct before merging.',
  })
}

function inactiveMergeSource(constructId: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'construct-merge-source-not-approved',
    file: 'taxonomy/constructs.json',
    objectId: constructId,
    rule: 'Only an active researcher-approved construct can be deprecated by a merge.',
    action: 'Approve the source construct, or choose another active construct.',
  })
}

function selfMergeDiagnostic(constructId: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'self-referential-primary',
    file: 'taxonomy/constructs.json',
    objectId: constructId,
    rule: 'A construct cannot be merged into itself.',
    action: 'Choose a distinct approved primary construct.',
  })
}

function missingMapping(mappingId: string, file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'mapping-not-found',
    file,
    objectId: mappingId,
    rule: 'The requested construct mapping does not exist.',
    action: 'Refresh the extraction and choose an existing mapping.',
  })
}

function missingMappingTarget(mappingId: string, file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'mapping-target-required',
    file,
    objectId: mappingId,
    rule: 'An approved mapping requires a construct target.',
    action: 'Choose an approved construct before approving the mapping.',
  })
}

function missingParadigm(paradigmId: string, file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'paradigm-not-found',
    file,
    objectId: paradigmId,
    rule: 'The requested paradigm does not exist.',
    action: 'Refresh the methodology registry and choose an existing paradigm.',
  })
}

function missingExtraction(paperId: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'phase2-document-not-registered',
    file: 'project.nodegraph.json',
    objectId: paperId,
    rule: 'The paper has no registered extraction document.',
    action: 'Migrate the project or register the paper again.',
  })
}
