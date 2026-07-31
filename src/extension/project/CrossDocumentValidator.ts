import { ConstructResolver, ConstructTaxonomyDocument } from './ConstructResolver'
import { diagnostic } from './diagnostics'
import {
  ConflictsDocument,
  EvidenceRecordsDocument,
  GapsDocument,
  ProjectDiagnostic,
  ProjectManifest,
  ResearchQuestionsDocument,
  SynthesisClaimsDocument,
} from './types'

export interface SynthesisBundle {
  claims: SynthesisClaimsDocument
  conflicts: ConflictsDocument
  gaps: GapsDocument
  researchQuestions: ResearchQuestionsDocument
  constructs: ConstructTaxonomyDocument
  evidence: EvidenceRecordsDocument
}

interface ReferenceIndexes {
  papers: Set<string>
  sources: Map<string, string>
  evidence: Set<string>
  claims: Set<string>
  gaps: Set<string>
}

export class CrossDocumentValidator {
  constructor(private readonly constructs: ConstructResolver) {}

  public validate(manifest: ProjectManifest, bundle: SynthesisBundle): ProjectDiagnostic[] {
    const indexes = buildIndexes(manifest, bundle)
    return [
      ...validateUniqueIdentifiers(bundle, manifest),
      ...validateEvidenceRecords(bundle, indexes, manifest),
      ...validateClaims(bundle, indexes, manifest, this.constructs),
      ...validateConflicts(bundle, indexes, manifest),
      ...validateGaps(bundle, indexes, manifest),
      ...validateQuestions(bundle, indexes, manifest),
    ]
  }
}

function buildIndexes(manifest: ProjectManifest, bundle: SynthesisBundle): ReferenceIndexes {
  return {
    papers: new Set(manifest.papers.map(paper => paper.paperId)),
    sources: new Map(manifest.papers.map(paper => [paper.source.sourceId, paper.paperId])),
    evidence: new Set(bundle.evidence.evidence.map(item => item.evidenceId)),
    claims: new Set(bundle.claims.claims.map(item => item.claimId)),
    gaps: new Set(bundle.gaps.gaps.map(item => item.gapId)),
  }
}

function validateUniqueIdentifiers(
  bundle: SynthesisBundle,
  manifest: ProjectManifest
): ProjectDiagnostic[] {
  return [
    ...duplicateIds(
      bundle.evidence.evidence.map(item => item.evidenceId),
      manifest.documents.evidence
    ),
    ...duplicateIds(
      bundle.claims.claims.map(item => item.claimId),
      manifest.documents.claims
    ),
    ...duplicateIds(
      bundle.conflicts.conflicts.map(item => item.conflictId),
      manifest.documents.conflicts
    ),
    ...duplicateIds(
      bundle.gaps.gaps.map(item => item.gapId),
      manifest.documents.gaps
    ),
    ...duplicateIds(
      bundle.researchQuestions.researchQuestions.map(item => item.researchQuestionId),
      manifest.documents.researchQuestions
    ),
    ...duplicateIds(
      bundle.constructs.constructs.map(item => item.constructId),
      manifest.documents.constructs
    ),
  ]
}

function duplicateIds(identifiers: string[], file: string): ProjectDiagnostic[] {
  const seen = new Set<string>()
  const diagnostics: ProjectDiagnostic[] = []
  for (const identifier of identifiers) {
    if (seen.has(identifier)) {
      diagnostics.push(referenceDiagnostic('duplicate-identifier', file, identifier))
    }
    seen.add(identifier)
  }
  return diagnostics
}

function validateEvidenceRecords(
  bundle: SynthesisBundle,
  indexes: ReferenceIndexes,
  manifest: ProjectManifest
): ProjectDiagnostic[] {
  return bundle.evidence.evidence.flatMap(evidence => {
    const diagnostics: ProjectDiagnostic[] = []
    if (!indexes.papers.has(evidence.paperId)) {
      diagnostics.push(referenceDiagnostic('missing-paper-reference', manifest.documents.evidence, evidence.evidenceId))
    }
    if (indexes.sources.get(evidence.source.sourceId) !== evidence.paperId) {
      diagnostics.push(referenceDiagnostic('source-registration-mismatch', manifest.documents.evidence, evidence.evidenceId))
    }
    return diagnostics
  })
}

function validateClaims(
  bundle: SynthesisBundle,
  indexes: ReferenceIndexes,
  manifest: ProjectManifest,
  constructs: ConstructResolver
): ProjectDiagnostic[] {
  return bundle.claims.claims.flatMap(claim => [
    ...claim.findingRefs
      .filter(ref => !indexes.papers.has(ref.paperId))
      .map(() => referenceDiagnostic('missing-paper-reference', manifest.documents.claims, claim.claimId)),
    ...claim.evidenceRefs
      .filter(id => !indexes.evidence.has(id))
      .map(() => referenceDiagnostic('missing-evidence-reference', manifest.documents.claims, claim.claimId)),
    ...(claim.constructRefs ?? [])
      .flatMap(id => constructs.resolve(bundle.constructs, id, manifest.documents.claims).diagnostics),
  ])
}

function validateConflicts(
  bundle: SynthesisBundle,
  indexes: ReferenceIndexes,
  manifest: ProjectManifest
): ProjectDiagnostic[] {
  return bundle.conflicts.conflicts.flatMap(conflict => [
    ...(!indexes.claims.has(conflict.claimId)
      ? [referenceDiagnostic('missing-claim-reference', manifest.documents.conflicts, conflict.conflictId)]
      : []),
    ...conflict.findingRefs
      .filter(ref => !indexes.papers.has(ref.paperId))
      .map(() => referenceDiagnostic('missing-paper-reference', manifest.documents.conflicts, conflict.conflictId)),
  ])
}

function validateGaps(
  bundle: SynthesisBundle,
  indexes: ReferenceIndexes,
  manifest: ProjectManifest
): ProjectDiagnostic[] {
  return bundle.gaps.gaps.flatMap(gap => [
    ...gap.evidenceRefs
      .filter(id => !indexes.evidence.has(id))
      .map(() => referenceDiagnostic('missing-evidence-reference', manifest.documents.gaps, gap.gapId)),
    ...gap.adversarialPasses
      .filter(item => item.gapId !== gap.gapId)
      .map(() => referenceDiagnostic('adversarial-gap-mismatch', manifest.documents.gaps, gap.gapId)),
  ])
}

function validateQuestions(
  bundle: SynthesisBundle,
  indexes: ReferenceIndexes,
  manifest: ProjectManifest
): ProjectDiagnostic[] {
  return bundle.researchQuestions.researchQuestions.flatMap(question => [
    ...question.gapRefs
      .filter(id => !indexes.gaps.has(id))
      .map(() => referenceDiagnostic(
        'missing-gap-reference',
        manifest.documents.researchQuestions,
        question.researchQuestionId
      )),
    ...question.claimRefs
      .filter(id => !indexes.claims.has(id))
      .map(() => referenceDiagnostic(
        'missing-claim-reference',
        manifest.documents.researchQuestions,
        question.researchQuestionId
      )),
  ])
}

function referenceDiagnostic(code: string, file: string, objectId: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code,
    file,
    objectId,
    rule: `${objectId} contains an unresolved or duplicated project reference.`,
    action: 'Restore the referenced authoritative object or correct the reference.',
  })
}
