import {
  MatrixCell,
  MatrixSummary,
  PaperIndexDocument,
  PaperIndexEntry,
} from './types'

const COLUMNS = [
  'paperId',
  'paperTitle',
  'publicationYear',
  'constructId',
  'constructName',
  'cellState',
  'extractionId',
  'extractionRevision',
  'mappingIds',
  'sourceTerms',
  'findingIds',
  'nodeIds',
  'evidenceIds',
  'methodologicalParadigm',
  'researchApproach',
  'analyticalTechnique',
  'population',
  'unitOfAnalysis',
  'sourceVerification',
  'interpretationVerification',
  'classificationVerification',
  'stale',
] as const

type Column = typeof COLUMNS[number]
type CsvRow = Record<Column, string>

export class MatrixCsvExporter {
  public export(index: PaperIndexDocument, matrix: MatrixSummary): string {
    const entries = new Map(index.entries.map(entry => [entry.paperId, entry]))
    const rows = matrix.cells.map(cell =>
      buildRow(cell, entries.get(cell.paperId), matrix)
    )
    return [
      serializeRow(Object.fromEntries(COLUMNS.map(column => [column, column])) as CsvRow),
      ...rows.map(serializeRow),
    ].join('\r\n') + '\r\n'
  }
}

function buildRow(
  cell: MatrixCell,
  entry: PaperIndexEntry | undefined,
  matrix: MatrixSummary
): CsvRow {
  const paper = matrix.papers.find(item => item.paperId === cell.paperId)
  const construct = matrix.constructs.find(
    item => item.constructId === cell.constructId
  )
  const findings = entry?.findings?.filter(
    finding => cell.findingIds.includes(finding.findingId)
  ) ?? []
  return {
    paperId: cell.paperId,
    paperTitle: paper?.title ?? entry?.title ?? '',
    publicationYear: String(paper?.publicationYear ?? ''),
    constructId: cell.constructId,
    constructName: construct?.canonicalName ?? '',
    cellState: cell.state,
    extractionId: entry?.extractionId ?? '',
    extractionRevision: entry?.extractionRevision ?? '',
    mappingIds: cell.mappingIds.join(' | '),
    sourceTerms: cell.sourceTerms.join(' | '),
    findingIds: cell.findingIds.join(' | '),
    nodeIds: findings.flatMap(finding => finding.nodeId ?? []).join(' | '),
    evidenceIds: cell.evidenceIds.join(' | '),
    methodologicalParadigm: paper?.methodology.paradigmLabel ??
      paper?.methodology.paradigmSourceTerm ?? '',
    researchApproach: paper?.methodology.researchApproach ?? '',
    analyticalTechnique: paper?.methodology.analyticalTechnique ?? '',
    population: paper?.methodology.population ?? '',
    unitOfAnalysis: paper?.methodology.unitOfAnalysis ?? '',
    sourceVerification: unique(cell.verification.source).join(' | '),
    interpretationVerification: unique(cell.verification.interpretation).join(' | '),
    classificationVerification: unique(cell.verification.classification).join(' | '),
    stale: String(Boolean(
      paper?.staleness &&
      Object.values(paper.staleness).some(Boolean)
    )),
  }
}

function serializeRow(row: CsvRow): string {
  return COLUMNS.map(column => csvCell(row[column])).join(',')
}

function csvCell(value: string): string {
  const safe = preventFormula(value)
  return `"${safe.replace(/"/g, '""')}"`
}

function preventFormula(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}
