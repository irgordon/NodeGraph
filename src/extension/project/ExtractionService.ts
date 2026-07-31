import { randomUUID } from 'crypto'
import { diagnostic, hasErrors } from './diagnostics'
import { SchemaValidator } from './SchemaValidator'
import { SynthesisRepository } from './SynthesisRepository'
import {
  Actor,
  ExtractionDocument,
  MutationResult,
  ProjectDiagnostic,
  ProjectManifest,
} from './types'

export class ExtractionService {
  constructor(
    private readonly schemas: SchemaValidator,
    private readonly synthesis: SynthesisRepository
  ) {}

  public read(
    projectRoot: string,
    manifest: ProjectManifest,
    paperId: string
  ): Promise<{
    value?: ExtractionDocument
    diagnostics: ProjectDiagnostic[]
  }> {
    const registration = manifest.papers.find(paper => paper.paperId === paperId)
    if (!registration) return Promise.resolve({
      diagnostics: [paperNotRegistered(paperId)],
    })
    return this.synthesis.readExtraction(projectRoot, registration)
  }

  public async importProposal(
    projectRoot: string,
    manifest: ProjectManifest,
    proposal: ExtractionDocument,
    baseRevision: string,
    actor: Actor
  ): Promise<MutationResult> {
    const registration = manifest.papers.find(
      paper => paper.paperId === proposal.paperId
    )
    if (!registration?.extractionPath) {
      return proposalRejected(
        proposal,
        baseRevision,
        [paperNotRegistered(proposal.paperId)]
      )
    }
    const diagnostics = [
      ...this.schemas.validate(
        'extraction.schema.json',
        proposal,
        registration.extractionPath
      ),
      ...validateAgentProposal(proposal, actor, registration.extractionPath),
    ]
    if (hasErrors(diagnostics)) {
      return proposalRejected(proposal, baseRevision, diagnostics)
    }
    return this.synthesis.applyMutation(projectRoot, manifest, {
      mutationId: `mutation_${randomUUID().replace(/-/g, '')}`,
      targetDocument: registration.extractionPath,
      baseRevision,
      operations: [{ op: 'replace', path: '', value: proposal }],
      requestedAt: proposal.modified,
      actor,
    }, {
      action: 'extraction.proposal-imported',
      objectId: proposal.extractionId,
    })
  }
}

function validateAgentProposal(
  proposal: ExtractionDocument,
  actor: Actor,
  file: string
): ProjectDiagnostic[] {
  if (actor.type !== 'agent') return []
  if (
    proposal.reviewState.origin === 'ai' &&
    proposal.extractionStatus === 'proposed' &&
    extractionReviewStates(proposal).every(state => state.origin === 'ai')
  ) return []
  return [diagnostic({
    layer: 'structural',
    code: 'agent-proposal-origin-required',
    file,
    objectId: proposal.extractionId,
    rule: 'Agent-created extraction must remain an AI proposal.',
    action: 'Set origin to ai and extractionStatus to proposed.',
  })]
}

function extractionReviewStates(
  proposal: ExtractionDocument
): ExtractionDocument['reviewState'][] {
  return [
    proposal.reviewState,
    proposal.methodology.methodologicalParadigm.reviewState,
    proposal.methodology.researchApproach.reviewState,
    proposal.methodology.analyticalTechnique.reviewState,
    proposal.methodology.sampleCharacteristics.reviewState,
    ...proposal.constructMappings.map(mapping => mapping.reviewState),
    ...Object.values(proposal.fields).flatMap(field =>
      'items' in field && Array.isArray(field.items)
        ? field.items.map(item => item.reviewState)
        : []
    ),
  ]
}

function paperNotRegistered(paperId: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'paper-not-registered',
    file: 'project.nodegraph.json',
    objectId: paperId,
    rule: 'The extraction paper is not registered in this project.',
    action: 'Choose a registered paper before importing the extraction.',
  })
}

function proposalRejected(
  proposal: ExtractionDocument,
  baseRevision: string,
  diagnostics: ProjectDiagnostic[]
): MutationResult {
  return {
    accepted: false,
    code: 'invalid-extraction-proposal',
    targetDocument: `extraction:${proposal.paperId}`,
    currentRevision: baseRevision,
    receivedBaseRevision: baseRevision,
    retryable: false,
    rejectedOperations: [],
    diagnostics,
  }
}
