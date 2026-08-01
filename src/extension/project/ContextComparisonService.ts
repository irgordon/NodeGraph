import { pendingReviewState } from './extractionDefaults'
import {
  ContextComparison,
  ContextDimension,
  ContextValue,
  ExtractionDocument,
  FindingReference,
  ReportedText,
  ReportingStatus,
} from './types'

export class ContextComparisonService {
  public compare(
    references: FindingReference[],
    extractions: Map<string, ExtractionDocument>,
    dimensions: ContextDimension[]
  ): ContextComparison[] {
    return dimensions.map(dimension => {
      const values = references.map(reference =>
        contextValue(reference, extractions.get(reference.paperId), dimension))
      return {
        contextComparisonId: comparisonId(dimension),
        dimension,
        values,
        result: compareValues(values),
        causalInference: false as const,
        reviewState: pendingReviewState('imported'),
      }
    })
  }
}

function contextValue(
  reference: FindingReference,
  extraction: ExtractionDocument | undefined,
  dimension: ContextDimension
): ContextValue {
  const field = extraction ? selectField(extraction, dimension) : undefined
  return {
    paperId: reference.paperId,
    findingId: reference.findingId,
    reportingStatus: field?.reportingStatus ?? 'not-extracted',
    ...(field?.sourceText ? { sourceValue: field.sourceText } : {}),
    ...(field?.normalizedValue ? { normalizedValue: field.normalizedValue } : {}),
  }
}

function selectField(
  extraction: ExtractionDocument,
  dimension: ContextDimension
): ReportedText | undefined {
  if (dimension === 'population') return extraction.fields.population
  if (dimension === 'setting') return extraction.fields.setting
  if (dimension === 'team-or-sample-characteristics') {
    return sampleField(extraction)
  }
  if (dimension === 'methodological-paradigm') return paradigmField(extraction)
  if (dimension === 'research-approach') return normalizedTermField(
    extraction.methodology.researchApproach
  )
  if (dimension === 'analytical-technique') return normalizedTermField(
    extraction.methodology.analyticalTechnique
  )
  return undefined
}

function sampleField(extraction: ExtractionDocument): ReportedText {
  const sample = extraction.methodology.sampleCharacteristics
  return {
    reportingStatus: sample.reportingStatus,
    ...(sample.sourceText ? { sourceText: sample.sourceText } : {}),
    ...(sample.unitOfAnalysis ? { normalizedValue: sample.unitOfAnalysis } : {}),
  }
}

function paradigmField(extraction: ExtractionDocument): ReportedText {
  const paradigm = extraction.methodology.methodologicalParadigm
  return {
    reportingStatus: paradigm.reportingStatus,
    ...(paradigm.sourceTerm ? { sourceText: paradigm.sourceTerm } : {}),
    ...(paradigm.paradigmId ? { normalizedValue: paradigm.paradigmId } : {}),
  }
}

function normalizedTermField(
  term: ExtractionDocument['methodology']['researchApproach']
): ReportedText {
  return {
    reportingStatus: term.reportingStatus,
    ...(term.sourceTerm ? { sourceText: term.sourceTerm } : {}),
    ...(term.normalizedValue ? { normalizedValue: term.normalizedValue } : {}),
  }
}

function compareValues(values: ContextValue[]): ContextComparison['result'] {
  const statuses = values.map(value => value.reportingStatus)
  if (statuses.includes('unclear')) return 'unclear'
  if (statuses.includes('not-reported')) return 'not-reported'
  if (statuses.some(isMissingStatus)) return 'missing'
  const normalizedValues = values.map(value =>
    normalize(value.normalizedValue ?? value.sourceValue ?? ''))
  return new Set(normalizedValues).size === 1 ? 'same' : 'different'
}

function isMissingStatus(status: ReportingStatus): boolean {
  return status !== 'present'
}

function comparisonId(dimension: ContextDimension): string {
  return `context_${dimension.replace(/-/g, '_')}`
}

function normalize(value: string): string {
  return value.trim().normalize('NFC').toLocaleLowerCase('en-US')
}
