import { ConstructResolver } from './ConstructResolver'
import { diagnostic } from './diagnostics'
import {
  ConflictsDocument,
  ConstructTaxonomyDocument,
  EvidenceRecordsDocument,
  ExtractionDocument,
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
}

interface ReferenceIndexes {
  papers: Set<string>
  sources: Map<string, ProjectManifest['papers'][number]>
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

function buildIndexes(manifest: ProjectManifest, bundle: SynthesisBundle): ReferenceIndexes {
  return {
    papers: new Set(manifest.papers.map(paper => paper.paperId)),
    sources: new Map(manifest.papers.map(paper => [paper.source.sourceId, paper])),
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
