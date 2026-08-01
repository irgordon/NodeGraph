import {
  CONFIDENCE_POLICY_ID,
  CONFIDENCE_POLICY_VERSION,
  ConfidenceResult,
  ConflictRecord,
  EvidenceAppraisal,
  EvidenceRecord,
  ExtractionDocument,
  ProjectManifest,
  SynthesisClaim,
} from './types'
import { calculateDocumentRevision } from './canonical'

const SUPPORTING = new Set([
  'supports',
  'partially-supports',
  'extends',
  'replicates',
])
const DISSENTING = new Set([
  'contradicts',
  'fails-to-replicate',
  'qualifies',
])

export interface ConfidenceEvaluationInput {
  claim: SynthesisClaim
  conflicts: ConflictRecord[]
  appraisals: EvidenceAppraisal[]
  evidence: EvidenceRecord[]
  extractions: Map<string, ExtractionDocument>
  manifest: ProjectManifest
  appraisalsRevision: string
  conflictsRevision: string
  taxonomyVersion: number
  currentSourceHashes: Record<string, string>
  calculatedAt: string
}

interface PolicyFacts {
  supportingPaperIds: string[]
  dissentingPaperIds: string[]
  appraisals: EvidenceAppraisal[]
  missingInputCount: number
  staleCount: number
  disputedCount: number
  rejectedCount: number
  unresolvedConflict: boolean
  highRelevance: boolean
  allLowRelevance: boolean
  allMajorLimitations: boolean
  adequateValidity: boolean
  strongerDissent: boolean
}

export class ConfidenceService {
  public evaluate(input: ConfidenceEvaluationInput): ConfidenceResult {
    const facts = collectFacts(input)
    const decision = decideLabel(input, facts)
    return {
      policyId: CONFIDENCE_POLICY_ID,
      policyVersion: CONFIDENCE_POLICY_VERSION,
      label: decision.label,
      inputs: {
        findingRefs: structuredClone(input.claim.findingRefs),
        appraisalIds: facts.appraisals.map(item => item.appraisalId),
        supportingStudyCount: facts.supportingPaperIds.length,
        dissentingStudyCount: facts.dissentingPaperIds.length,
        targetPopulationRelevance: facts.appraisals.map(item =>
          item.fields.targetPopulationRelevance.status),
        methodologicalLimitations: facts.appraisals.map(item =>
          item.fields.methodologicalLimitations.status),
        unresolvedConflict: facts.unresolvedConflict,
        crossParadigmDecision: input.claim.paradigmDecision.status,
        staleCount: facts.staleCount,
        disputedCount: facts.disputedCount,
        rejectedCount: facts.rejectedCount,
        missingInputCount: facts.missingInputCount,
      },
      reasons: decision.reasons,
      limitations: collectLimitations(facts.appraisals),
      freshness: buildFreshness(input),
      stale: false,
      staleReasons: [],
      calculatedAt: input.calculatedAt,
    }
  }

  public staleReasons(
    result: ConfidenceResult,
    input: Omit<ConfidenceEvaluationInput, 'calculatedAt'>
  ): string[] {
    const current = buildFreshness({ ...input, calculatedAt: result.calculatedAt })
    return freshnessDifferences(result.freshness, current)
  }
}

function collectFacts(input: ConfidenceEvaluationInput): PolicyFacts {
  const supportingPaperIds = uniquePapers(input.claim, SUPPORTING)
  const dissentingPaperIds = uniquePapers(input.claim, DISSENTING)
  const basisPaperIds = [...new Set(input.claim.findingRefs.map(ref => ref.paperId))]
  const appraisals = basisPaperIds.flatMap(paperId =>
    input.appraisals.filter(item => item.paperId === paperId))
  const currentApproved = appraisals.filter(item => isCurrentApproved(item, input))
  const evidenceFacts = inspectEvidence(input)
  const findingFacts = inspectFindings(input)
  const missingAppraisals = basisPaperIds.filter(paperId =>
    !currentApproved.some(item => item.paperId === paperId)).length
  const incompleteMinimum = currentApproved.filter(item =>
    item.fields.targetPopulationRelevance.status !== 'present' ||
    item.fields.methodologicalLimitations.status !== 'present').length
  return {
    supportingPaperIds,
    dissentingPaperIds,
    appraisals: currentApproved,
    missingInputCount: missingAppraisals + incompleteMinimum +
      evidenceFacts.missing + findingFacts.missing,
    staleCount: evidenceFacts.stale,
    disputedCount: evidenceFacts.disputed + findingFacts.disputed +
      (input.claim.reviewState.verification.classification === 'disputed' ? 1 : 0),
    rejectedCount: evidenceFacts.rejected + findingFacts.rejected,
    unresolvedConflict: input.conflicts.some(conflict =>
      conflict.reviewState.approval.researcher !== 'approved'),
    highRelevance: currentApproved.some(item =>
      normalized(item.fields.targetPopulationRelevance.normalizedValue) === 'high'),
    allLowRelevance: currentApproved.length > 0 && currentApproved.every(item =>
      normalized(item.fields.targetPopulationRelevance.normalizedValue) === 'low'),
    allMajorLimitations: currentApproved.length > 0 && currentApproved.every(item =>
      ['major', 'high'].includes(normalized(
        item.fields.methodologicalLimitations.normalizedValue))),
    adequateValidity: currentApproved.some(item =>
      ['adequate', 'strong', 'high', 'valid'].includes(normalized(
        item.fields.measurementValidity.normalizedValue)) ||
      ['adequate', 'strong', 'high', 'reliable'].includes(normalized(
        item.fields.reliability.normalizedValue))),
    strongerDissent: hasStrongerDissent(dissentingPaperIds, currentApproved),
  }
}

function decideLabel(
  input: ConfidenceEvaluationInput,
  facts: PolicyFacts
): { label: ConfidenceResult['label']; reasons: string[] } {
  if (minimumInputsUnavailable(input, facts)) {
    return {
      label: 'not-assessed',
      reasons: ['Required current evidence, reviewed appraisal inputs, or a cross-paradigm decision are unavailable.'],
    }
  }
  if (facts.strongerDissent || facts.allLowRelevance || facts.allMajorLimitations) {
    return {
      label: 'low',
      reasons: [lowConfidenceReason(facts)],
    }
  }
  if (
    facts.supportingPaperIds.length >= 2 &&
    facts.dissentingPaperIds.length === 0 &&
    !facts.unresolvedConflict &&
    facts.highRelevance &&
    facts.adequateValidity
  ) {
    return {
      label: 'high',
      reasons: ['Multiple current studies provide relevant support without unresolved dissent, and reviewed validity or reliability is adequate.'],
    }
  }
  return {
    label: 'moderate',
    reasons: ['Minimum evidence and appraisal inputs are available, but the high-confidence rule is not fully satisfied.'],
  }
}

function minimumInputsUnavailable(
  input: ConfidenceEvaluationInput,
  facts: PolicyFacts
): boolean {
  return facts.supportingPaperIds.length === 0 ||
    facts.missingInputCount > 0 ||
    facts.staleCount > 0 ||
    facts.rejectedCount > 0 ||
    (input.claim.paradigmDecision.required &&
      input.claim.paradigmDecision.status !== 'approved')
}

function lowConfidenceReason(facts: PolicyFacts): string {
  if (facts.strongerDissent) {
    return 'Reviewed, relevant dissent with fewer reported limitations prevents a majority from determining confidence.'
  }
  if (facts.allLowRelevance) {
    return 'All reviewed evidence has low relevance to the target population.'
  }
  return 'All reviewed supporting studies report major methodological limitations.'
}

function uniquePapers(claim: SynthesisClaim, relationships: Set<string>): string[] {
  return [...new Set(claim.findingRefs
    .filter(ref => relationships.has(ref.relationship))
    .map(ref => ref.paperId))]
}

function isCurrentApproved(
  appraisal: EvidenceAppraisal,
  input: ConfidenceEvaluationInput
): boolean {
  const registration = input.manifest.papers.find(item => item.paperId === appraisal.paperId)
  const extraction = input.extractions.get(appraisal.paperId)
  return appraisal.reviewState.approval.researcher === 'approved' &&
    registration?.source.sourceDocumentHash === appraisal.sourceDocumentHash &&
    extraction !== undefined &&
    appraisal.extractionRevision === revisionOf(extraction)
}

function inspectEvidence(input: ConfidenceEvaluationInput) {
  const records = new Map(input.evidence.map(item => [item.evidenceId, item]))
  const referenced = input.claim.evidenceRefs.map(id => records.get(id))
  return {
    missing: referenced.filter(item => !item).length + missingSourceCount(input),
    stale: referenced.filter(item => item?.reviewState.verification.source === 'stale').length +
      changedSourceCount(input),
    disputed: referenced.filter(item =>
      item?.reviewState.verification.classification === 'disputed').length,
    rejected: referenced.filter(item =>
      item?.reviewState.verification.source === 'rejected' ||
      item?.reviewState.verification.interpretation === 'rejected').length,
  }
}

function inspectFindings(input: ConfidenceEvaluationInput) {
  const findings = input.claim.findingRefs.map(reference =>
    input.extractions.get(reference.paperId)?.fields.findings.items
      ?.find(item => item.findingId === reference.findingId))
  return {
    missing: findings.filter(item => !item).length,
    disputed: findings.filter(item =>
      item?.reviewState.verification.classification === 'disputed').length,
    rejected: findings.filter(item =>
      item?.reviewState.verification.interpretation === 'rejected').length,
  }
}

function missingSourceCount(input: ConfidenceEvaluationInput): number {
  return claimPaperIds(input.claim)
    .filter(paperId => !input.currentSourceHashes[paperId]).length
}

function changedSourceCount(input: ConfidenceEvaluationInput): number {
  return claimPaperIds(input.claim).filter(paperId => {
    const registered = input.manifest.papers.find(item => item.paperId === paperId)
      ?.source.sourceDocumentHash
    const current = input.currentSourceHashes[paperId]
    return Boolean(registered && current && registered !== current)
  }).length
}

function claimPaperIds(claim: SynthesisClaim): string[] {
  return [...new Set(claim.findingRefs.map(item => item.paperId))]
}

function hasStrongerDissent(
  dissentingPaperIds: string[],
  appraisals: EvidenceAppraisal[]
): boolean {
  return dissentingPaperIds.some(paperId => {
    const appraisal = appraisals.find(item => item.paperId === paperId)
    if (!appraisal) return false
    const relevance = normalized(appraisal.fields.targetPopulationRelevance.normalizedValue)
    const limitations = normalized(appraisal.fields.methodologicalLimitations.normalizedValue)
    return relevance === 'high' && !['major', 'high'].includes(limitations)
  })
}

function collectLimitations(appraisals: EvidenceAppraisal[]): string[] {
  return appraisals.flatMap(item => {
    const field = item.fields.methodologicalLimitations
    return field.status === 'present' && field.sourceText ? [field.sourceText] : []
  })
}

function buildFreshness(input: ConfidenceEvaluationInput) {
  return {
    sourceDocumentHashes: Object.fromEntries(input.manifest.papers.map(item => [
      item.paperId,
      input.currentSourceHashes[item.paperId] ?? item.source.sourceDocumentHash,
    ])),
    extractionRevisions: Object.fromEntries([...input.extractions].map(
      ([paperId, extraction]) => [paperId, revisionOf(extraction)])),
    appraisalsRevision: input.appraisalsRevision,
    conflictsRevision: input.conflictsRevision,
    taxonomyVersion: input.taxonomyVersion,
  }
}

function freshnessDifferences(
  before: ConfidenceResult['freshness'],
  after: ConfidenceResult['freshness']
): string[] {
  const reasons: string[] = []
  if (JSON.stringify(before.sourceDocumentHashes) !== JSON.stringify(after.sourceDocumentHashes)) {
    reasons.push('source-document-hash-changed')
  }
  if (JSON.stringify(before.extractionRevisions) !== JSON.stringify(after.extractionRevisions)) {
    reasons.push('extraction-revision-changed')
  }
  if (before.appraisalsRevision !== after.appraisalsRevision) reasons.push('appraisals-revision-changed')
  if (before.conflictsRevision !== after.conflictsRevision) reasons.push('conflicts-revision-changed')
  if (before.taxonomyVersion !== after.taxonomyVersion) reasons.push('taxonomy-version-changed')
  return reasons
}

function revisionOf(value: unknown): string {
  return calculateDocumentRevision(value)
}

function normalized(value: string | undefined): string {
  return value?.trim().toLocaleLowerCase('en-US') ?? ''
}
