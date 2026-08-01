import { ConstructResolver } from './ConstructResolver'
import { calculateDocumentRevision } from './canonical'
import { diagnostic } from './diagnostics'
import {
  ConflictsDocument,
  ConstructTaxonomyDocument,
  EvidenceAppraisal,
  EvidenceAppraisalsDocument,
  EvidenceRecord,
  EvidenceRecordsDocument,
  ExtractionDocument,
  ExtractionFinding,
  GapsDocument,
  MethodologyRegistryDocument,
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
  appraisals?: EvidenceAppraisalsDocument
}

interface ReferenceIndexes {
  papers: Set<string>
  sources: Map<string, ProjectManifest['papers'][number]>
  evidence: Map<string, EvidenceRecord>
  claims: Set<string>
  gaps: Set<string>
  findings: Map<string, { finding: ExtractionFinding; extraction: ExtractionDocument }>
  extractions: Map<string, ExtractionDocument>
}

export class CrossDocumentValidator {
  constructor(private readonly constructs: ConstructResolver) {}

  public validate(
    manifest: ProjectManifest,
    bundle: SynthesisBundle,
    extractions = new Map<string, ExtractionDocument>()
  ): ProjectDiagnostic[] {
    const indexes = buildIndexes(manifest, bundle, extractions)
    return [
      ...validateUniqueIdentifiers(bundle, manifest),
      ...validateEvidenceRecords(bundle, indexes, manifest),
      ...validateClaims(bundle, indexes, manifest, this.constructs),
      ...validateConflicts(bundle, indexes, manifest),
      ...validateAppraisals(bundle.appraisals, indexes, manifest),
      ...validateGaps(bundle, indexes, manifest),
      ...validateQuestions(bundle, indexes, manifest),
    ]
  }

  public validateExtraction(
    manifest: ProjectManifest,
    extraction: ExtractionDocument,
    evidence: EvidenceRecordsDocument,
    taxonomy: ConstructTaxonomyDocument,
    methodologies: MethodologyRegistryDocument
  ): ProjectDiagnostic[] {
    const registration = manifest.papers.find(
      paper => paper.paperId === extraction.paperId
    )
    if (!registration) {
      return [referenceDiagnostic(
        'missing-paper-reference',
        extraction.paperId,
        extraction.extractionId
      )]
    }
    return [
      ...duplicateExtractionIdentifiers(extraction, registration.extractionPath!),
      ...validateExtractionEvidence(extraction, evidence, registration.extractionPath!),
      ...validateExtractionMappings(
        extraction,
        taxonomy,
        registration.extractionPath!,
        this.constructs
      ),
      ...validateExtractionMethodology(
        extraction,
        methodologies,
        registration.extractionPath!
      ),
    ]
  }

  public validateMethodologies(
    registry: MethodologyRegistryDocument,
    file: string
  ): ProjectDiagnostic[] {
    return duplicateIds(
      registry.paradigms.map(paradigm => paradigm.paradigmId),
      file
    )
  }
}

function duplicateExtractionIdentifiers(
  extraction: ExtractionDocument,
  file: string
): ProjectDiagnostic[] {
  const itemIds = [
    ...itemIdentifiers(extraction.fields.researchQuestionsOrHypotheses),
    ...itemIdentifiers(extraction.fields.theoreticalFramework),
    ...itemIdentifiers(extraction.fields.dataCollection),
    ...itemIdentifiers(extraction.fields.analysisMethod),
    ...itemIdentifiers(extraction.fields.mechanisms),
    ...itemIdentifiers(extraction.fields.moderators),
    ...itemIdentifiers(extraction.fields.limitations),
    ...itemIdentifiers(extraction.fields.boundaryConditions),
    ...itemIdentifiers(extraction.fields.recommendations),
    ...(extraction.fields.findings.items ?? []).map(item => item.findingId),
  ]
  return [
    ...duplicateIds(extraction.constructMappings.map(item => item.mappingId), file),
    ...duplicateIds(itemIds, file),
  ]
}

function itemIdentifiers(
  field: ExtractionDocument['fields']['researchQuestionsOrHypotheses']
): string[] {
  return (field.items ?? []).map(item => item.extractionItemId)
}

function validateExtractionEvidence(
  extraction: ExtractionDocument,
  evidence: EvidenceRecordsDocument,
  file: string
): ProjectDiagnostic[] {
  const records = new Map(evidence.evidence.map(item => [item.evidenceId, item]))
  return extractionEvidenceIds(extraction).flatMap(evidenceId => {
    const record = records.get(evidenceId)
    if (!record) return [referenceDiagnostic('missing-evidence-reference', file, evidenceId)]
    if (record.paperId !== extraction.paperId) {
      return [referenceDiagnostic('evidence-paper-mismatch', file, evidenceId)]
    }
    return []
  })
}

function extractionEvidenceIds(extraction: ExtractionDocument): string[] {
  const fieldEvidence = Object.values(extraction.fields).flatMap(value => {
    const direct = 'evidenceIds' in value && Array.isArray(value.evidenceIds)
      ? value.evidenceIds
      : []
    const items = 'items' in value && Array.isArray(value.items)
      ? value.items.flatMap(item => item.evidenceIds)
      : []
    return [...direct, ...items]
  })
  return [...new Set([
    ...fieldEvidence,
    ...extraction.constructMappings.flatMap(item => item.evidenceIds),
  ])]
}

function validateExtractionMappings(
  extraction: ExtractionDocument,
  taxonomy: ConstructTaxonomyDocument,
  file: string,
  resolver: ConstructResolver
): ProjectDiagnostic[] {
  const mappings = new Map(
    extraction.constructMappings.map(item => [item.mappingId, item])
  )
  const diagnostics = [
    ...(extraction.fields.keyConstructs.mappingIds ?? [])
      .filter(mappingId => !mappings.has(mappingId))
      .map(mappingId => referenceDiagnostic('missing-mapping-reference', file, mappingId)),
    ...(extraction.fields.findings.items ?? [])
      .flatMap(finding => finding.constructMappingIds)
      .filter(mappingId => !mappings.has(mappingId))
      .map(mappingId => referenceDiagnostic('missing-mapping-reference', file, mappingId)),
  ]
  for (const mapping of extraction.constructMappings) {
    if (!mapping.constructId) continue
    const target = taxonomy.constructs.find(
      construct => construct.constructId === mapping.constructId
    )
    if (!target) {
      diagnostics.push(referenceDiagnostic(
        'missing-construct-reference',
        file,
        mapping.constructId
      ))
      continue
    }
    const resolved = resolver.resolve(taxonomy, mapping.constructId, file)
    if (mapping.mappingStatus === 'approved') diagnostics.push(...resolved.diagnostics)
    if (
      mapping.mappingStatus === 'approved' &&
      mapping.reviewState.approval.researcher !== 'approved'
    ) {
      diagnostics.push(referenceDiagnostic(
        'mapping-approval-required',
        file,
        mapping.mappingId
      ))
    }
  }
  return diagnostics
}

function validateExtractionMethodology(
  extraction: ExtractionDocument,
  registry: MethodologyRegistryDocument,
  file: string
): ProjectDiagnostic[] {
  const mapping = extraction.methodology.methodologicalParadigm
  if (!mapping.paradigmId) return []
  const paradigm = registry.paradigms.find(
    item => item.paradigmId === mapping.paradigmId
  )
  if (mapping.mappingStatus !== 'approved') return []
  if (paradigm?.status === 'approved') return []
  return [referenceDiagnostic(
    'paradigm-not-approved',
    file,
    mapping.paradigmId
  )]
}

function buildIndexes(
  manifest: ProjectManifest,
  bundle: SynthesisBundle,
  extractions: Map<string, ExtractionDocument>
): ReferenceIndexes {
  return {
    papers: new Set(manifest.papers.map(paper => paper.paperId)),
    sources: new Map(manifest.papers.map(paper => [paper.source.sourceId, paper])),
    evidence: new Map(bundle.evidence.evidence.map(item => [item.evidenceId, item])),
    claims: new Set(bundle.claims.claims.map(item => item.claimId)),
    gaps: new Set(bundle.gaps.gaps.map(item => item.gapId)),
    findings: new Map([...extractions].flatMap(([paperId, extraction]) =>
      (extraction.fields.findings.items ?? []).map(finding => [
        findingKey(paperId, finding.findingId),
        { finding, extraction },
      ]))),
    extractions,
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
    const registration = indexes.sources.get(evidence.source.sourceId)
    if (
      registration?.paperId !== evidence.paperId ||
      registration.source.relativePath !== evidence.source.relativePath ||
      registration.source.sourceDocumentHash !== evidence.source.sourceDocumentHash
    ) {
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
  return bundle.claims.claims.flatMap(claim => {
    const findings = claim.findingRefs.map(ref => ({
      ref,
      resolved: indexes.findings.get(findingKey(ref.paperId, ref.findingId)),
    }))
    return [
      ...claim.findingRefs
        .filter(ref => !indexes.papers.has(ref.paperId))
        .map(() => referenceDiagnostic('missing-paper-reference', manifest.documents.claims, claim.claimId)),
      ...findings
        .filter(item => indexes.findings.size > 0 && !item.resolved)
        .map(item => referenceDiagnostic('missing-finding-reference', manifest.documents.claims, item.ref.findingId)),
      ...claim.evidenceRefs
        .filter(id => !indexes.evidence.has(id))
        .map(() => referenceDiagnostic('missing-evidence-reference', manifest.documents.claims, claim.claimId)),
      ...claim.evidenceRefs.flatMap(id => validateClaimEvidenceHealth(
        indexes.evidence.get(id),
        claim.reviewState.approval.researcher === 'approved',
        manifest.documents.claims,
        id
      )),
      ...validateClaimEvidence(claim, findings, indexes, manifest),
      ...validateClaimPaperBasis(claim, manifest.documents.claims),
      ...validateClaimParadigms(claim, findings, manifest.documents.claims),
      ...(claim.constructRefs ?? []).flatMap(id =>
        validateApprovedConstruct(bundle.constructs, constructs, id, manifest.documents.claims)),
    ]
  })
}

function validateClaimEvidenceHealth(
  evidence: EvidenceRecord | undefined,
  approved: boolean,
  file: string,
  evidenceId: string
): ProjectDiagnostic[] {
  if (!evidence) return []
  const source = evidence.reviewState.verification.source
  if (source !== 'stale' && source !== 'rejected') return []
  return [diagnostic({
    layer: 'integrity',
    severity: approved ? 'error' : 'warning',
    code: source === 'stale' ? 'stale-claim-evidence' : 'rejected-claim-evidence',
    file,
    objectId: evidenceId,
    rule: `Claim evidence ${evidenceId} is ${source}.`,
    action: approved
      ? 'Return the claim to review or restore a current verified evidence chain.'
      : 'Keep the proposal visibly invalid until the evidence issue is reviewed.',
  })]
}

function validateClaimEvidence(
  claim: SynthesisClaimsDocument['claims'][number],
  findings: Array<{
    ref: SynthesisClaimsDocument['claims'][number]['findingRefs'][number]
    resolved?: { finding: ExtractionFinding; extraction: ExtractionDocument }
  }>,
  indexes: ReferenceIndexes,
  manifest: ProjectManifest
): ProjectDiagnostic[] {
  const linkedEvidence = new Set(findings.flatMap(item =>
    item.resolved?.finding.evidenceIds ?? []))
  return [
    ...claim.evidenceRefs
      .filter(evidenceId => !linkedEvidence.has(evidenceId))
      .map(evidenceId => referenceDiagnostic(
        'claim-evidence-not-linked-to-finding',
        manifest.documents.claims,
        evidenceId
      )),
    ...findings.flatMap(item => {
      if (!item.resolved) return []
      const linked = item.resolved.finding.evidenceIds
        .filter(evidenceId => claim.evidenceRefs.includes(evidenceId))
      if (!linked.length) {
        return [referenceDiagnostic(
          'finding-evidence-chain-missing',
          manifest.documents.claims,
          item.ref.findingId
        )]
      }
      return linked.flatMap(evidenceId => {
        const evidence = indexes.evidence.get(evidenceId)
        return !evidence || evidence.paperId === item.ref.paperId
          ? []
          : [referenceDiagnostic('evidence-paper-mismatch', manifest.documents.claims, evidenceId)]
      })
    }),
  ]
}

function validateClaimPaperBasis(
  claim: SynthesisClaimsDocument['claims'][number],
  file: string
): ProjectDiagnostic[] {
  if (claim.claimType === 'single-study-proposition') return []
  return new Set(claim.findingRefs.map(ref => ref.paperId)).size >= 2
    ? []
    : [referenceDiagnostic('cross-paper-basis-required', file, claim.claimId)]
}

function validateClaimParadigms(
  claim: SynthesisClaimsDocument['claims'][number],
  findings: Array<{ resolved?: { extraction: ExtractionDocument } }>,
  file: string
): ProjectDiagnostic[] {
  const paradigms = new Set(findings.flatMap(item => {
    const mapping = item.resolved?.extraction.methodology.methodologicalParadigm
    return mapping?.mappingStatus === 'approved' && mapping.paradigmId
      ? [mapping.paradigmId]
      : []
  }))
  if (paradigms.size < 2) return []
  if (
    claim.paradigmDecision.required &&
    (claim.reviewState.approval.researcher !== 'approved' ||
      claim.paradigmDecision.status === 'approved')
  ) return []
  return [referenceDiagnostic('cross-paradigm-decision-required', file, claim.claimId)]
}

function validateApprovedConstruct(
  taxonomy: ConstructTaxonomyDocument,
  resolver: ConstructResolver,
  constructId: string,
  file: string
): ProjectDiagnostic[] {
  const resolved = resolver.resolve(taxonomy, constructId, file)
  if (resolved.diagnostics.length) return resolved.diagnostics
  const construct = taxonomy.constructs.find(item => item.constructId === resolved.constructId)
  return construct?.status === 'approved'
    ? []
    : [referenceDiagnostic('construct-not-approved', file, constructId)]
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
      .filter(ref => indexes.findings.size > 0 &&
        !indexes.findings.has(findingKey(ref.paperId, ref.findingId)))
      .map(() => referenceDiagnostic('missing-finding-reference', manifest.documents.conflicts, conflict.conflictId)),
    ...(!conflict.findingRefs.some(ref => isDissenting(ref.relationship))
      ? [referenceDiagnostic('conflict-dissent-required', manifest.documents.conflicts, conflict.conflictId)]
      : []),
    ...validateConflictFindingMembership(conflict, bundle, manifest),
    ...validateContextReferences(conflict, manifest.documents.conflicts),
  ])
}

function validateConflictFindingMembership(
  conflict: ConflictsDocument['conflicts'][number],
  bundle: SynthesisBundle,
  manifest: ProjectManifest
): ProjectDiagnostic[] {
  const claim = bundle.claims.claims.find(item => item.claimId === conflict.claimId)
  if (!claim) return []
  const claimRefs = new Set(claim.findingRefs.map(ref =>
    findingKey(ref.paperId, ref.findingId)))
  return conflict.findingRefs
    .filter(ref => !claimRefs.has(findingKey(ref.paperId, ref.findingId)))
    .map(ref => referenceDiagnostic(
      'conflict-finding-not-in-claim',
      manifest.documents.conflicts,
      ref.findingId
    ))
}

function validateContextReferences(
  conflict: ConflictsDocument['conflicts'][number],
  file: string
): ProjectDiagnostic[] {
  const comparisons = new Set(conflict.contextComparisons.map(item =>
    item.contextComparisonId))
  return conflict.possibleExplanations.flatMap(explanation =>
    explanation.contextComparisonIds
      .filter(id => !comparisons.has(id))
      .map(id => referenceDiagnostic('missing-context-comparison', file, id)))
}

function isDissenting(relationship: string): boolean {
  return [
    'contradicts',
    'qualifies',
    'fails-to-replicate',
    'uses-different-definition',
    'uses-different-population',
    'uses-different-method',
  ].includes(relationship)
}

function validateAppraisals(
  appraisals: EvidenceAppraisalsDocument | undefined,
  indexes: ReferenceIndexes,
  manifest: ProjectManifest
): ProjectDiagnostic[] {
  if (!appraisals || !manifest.documents.appraisals) return []
  return [
    ...duplicateIds(
      appraisals.appraisals.map(item => item.appraisalId),
      manifest.documents.appraisals
    ),
    ...duplicateIds(
      appraisals.appraisals.map(item => item.paperId),
      manifest.documents.appraisals
    ),
    ...appraisals.appraisals.flatMap(appraisal =>
      validateAppraisal(appraisal, indexes, manifest)),
  ]
}

function validateAppraisal(
  appraisal: EvidenceAppraisal,
  indexes: ReferenceIndexes,
  manifest: ProjectManifest
): ProjectDiagnostic[] {
  const file = manifest.documents.appraisals!
  const registration = manifest.papers.find(item => item.paperId === appraisal.paperId)
  const evidenceIds = Object.values(appraisal.fields)
    .flatMap(field => field.evidenceIds)
  return [
    ...(!registration
      ? [referenceDiagnostic('missing-paper-reference', file, appraisal.appraisalId)]
      : []),
    ...(registration && registration.source.sourceDocumentHash !== appraisal.sourceDocumentHash
      ? [referenceDiagnostic('stale-appraisal-source', file, appraisal.appraisalId)]
      : []),
    ...(indexes.extractions.has(appraisal.paperId) &&
      calculateDocumentRevision(indexes.extractions.get(appraisal.paperId)) !== appraisal.extractionRevision
      ? [referenceDiagnostic('stale-appraisal-extraction', file, appraisal.appraisalId)]
      : []),
    ...evidenceIds.flatMap(evidenceId => {
      const evidence = indexes.evidence.get(evidenceId)
      if (!evidence) {
        return [referenceDiagnostic('missing-evidence-reference', file, evidenceId)]
      }
      return evidence.paperId === appraisal.paperId
        ? []
        : [referenceDiagnostic('evidence-paper-mismatch', file, evidenceId)]
    }),
  ]
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

function findingKey(paperId: string, findingId: string): string {
  return `${paperId}\u0000${findingId}`
}
