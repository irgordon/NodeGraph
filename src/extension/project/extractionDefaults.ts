import {
  APPLICATION_VERSION,
  EXTRACTION_SCHEMA_VERSION,
  ExtractionDocument,
  METHODOLOGY_SCHEMA_VERSION,
  MethodologyRegistryDocument,
  ReportingStatus,
  ReviewState,
} from './types'

export function createEmptyExtraction(
  paperId: string,
  now: string
): ExtractionDocument {
  const reportingStatus: ReportingStatus = 'not-extracted'
  return {
    schema: { name: 'nodegraph-extraction', version: EXTRACTION_SCHEMA_VERSION },
    extractionId: `extraction_${paperId.slice('paper_'.length)}`,
    paperId,
    extractorVersion: APPLICATION_VERSION,
    extractionStatus: 'not-started',
    fields: {
      researchProblem: { reportingStatus },
      purpose: { reportingStatus },
      researchQuestionsOrHypotheses: { reportingStatus },
      theoreticalFramework: { reportingStatus },
      keyConstructs: { reportingStatus },
      population: { reportingStatus },
      setting: { reportingStatus },
      sampleSize: { reportingStatus },
      methodology: { reportingStatus },
      dataCollection: { reportingStatus },
      analysisMethod: { reportingStatus },
      findings: { reportingStatus },
      mechanisms: { reportingStatus },
      moderators: { reportingStatus },
      limitations: { reportingStatus },
      boundaryConditions: { reportingStatus },
      recommendations: { reportingStatus },
      exactEvidenceQuotations: { reportingStatus, evidenceIds: [] },
    },
    methodology: {
      methodologicalParadigm: {
        reportingStatus,
        mappingStatus: 'unmapped',
        reviewState: pendingReviewState('imported'),
      },
      researchApproach: {
        reportingStatus,
        reviewState: pendingReviewState('imported'),
      },
      analyticalTechnique: {
        reportingStatus,
        reviewState: pendingReviewState('imported'),
      },
      sampleCharacteristics: {
        reportingStatus,
        reviewState: pendingReviewState('imported'),
      },
    },
    constructMappings: [],
    reviewState: pendingReviewState('imported'),
    created: now,
    modified: now,
  }
}

export function createInitialMethodologyRegistry(
  now: string
): MethodologyRegistryDocument {
  return {
    schema: {
      name: 'nodegraph-methodology-registry',
      version: METHODOLOGY_SCHEMA_VERSION,
    },
    registryVersion: 1,
    paradigms: [
      approvedParadigm('positivist', 'Positivist'),
      approvedParadigm('interpretive', 'Interpretive'),
      approvedParadigm('critical', 'Critical'),
      approvedParadigm('pragmatist', 'Pragmatist'),
    ],
    modified: now,
  }
}

export function pendingReviewState(
  origin: ReviewState['origin'] = 'human'
): ReviewState {
  return {
    verification: {
      source: 'pending',
      interpretation: 'pending',
      classification: 'pending',
    },
    approval: {
      researcher: 'not-reviewed',
      advisor: 'not-reviewed',
    },
    origin,
  }
}

function approvedParadigm(paradigmId: string, label: string) {
  return {
    paradigmId,
    label,
    aliases: [],
    status: 'approved' as const,
    reviewState: {
      verification: {
        source: 'not-applicable' as const,
        interpretation: 'not-applicable' as const,
        classification: 'verified' as const,
      },
      approval: {
        researcher: 'approved' as const,
        advisor: 'not-reviewed' as const,
      },
      origin: 'imported' as const,
    },
  }
}
