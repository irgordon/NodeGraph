import { PaperGraphRepository } from './PaperGraphRepository'
import { normalizeMetadataSearch } from './metadata'
import {
  PaperIndexDocument,
  PaperReadResult,
  PaperRegistration,
  ProjectManifest,
  SearchQuery,
  SearchResult,
} from './types'

export class QueryService {
  constructor(private readonly papers: PaperGraphRepository) {}

  public search(index: PaperIndexDocument, query: SearchQuery): SearchResult[] {
    return index.entries
      .filter(entry => matchesQuery(entry, query))
      .map(entry => ({
        paperId: entry.paperId,
        paperPath: entry.paperPath,
        title: entry.title,
        authors: entry.authors,
        ...(entry.publicationYear ? { publicationYear: entry.publicationYear } : {}),
        ...(entry.doi ? { doi: entry.doi } : {}),
        tags: entry.tags,
      }))
  }

  public async hydratePaper(
    projectRoot: string,
    manifest: ProjectManifest,
    paperId: string
  ): Promise<PaperReadResult> {
    const registration = findRegistration(manifest, paperId)
    return this.papers.read(projectRoot, registration)
  }
}

function matchesQuery(
  entry: PaperIndexDocument['entries'][number],
  query: SearchQuery
): boolean {
  return matchesText(entry, query.text) &&
    matchesYear(entry, query.publicationYear) &&
    matchesExact(entry.doi, query.doi) &&
    matchesTag(entry.tags, query.tag)
}

function matchesText(
  entry: PaperIndexDocument['entries'][number],
  text: string | undefined
): boolean {
  if (!text?.trim()) return true
  const needle = normalizeMetadataSearch(text)
  return searchableValues(entry)
    .some(value => normalizeMetadataSearch(value).includes(needle))
}

function searchableValues(entry: PaperIndexDocument['entries'][number]): string[] {
  return [
    entry.paperId,
    entry.title,
    ...entry.authors,
    ...(entry.publicationYear ? [String(entry.publicationYear)] : []),
    ...(entry.doi ? [entry.doi] : []),
    ...entry.tags,
  ]
}

function matchesYear(
  entry: PaperIndexDocument['entries'][number],
  year: number | undefined
): boolean {
  return year === undefined || entry.publicationYear === year
}

function matchesExact(value: string | undefined, expected: string | undefined): boolean {
  return expected === undefined ||
    (value !== undefined &&
      normalizeMetadataSearch(value) === normalizeMetadataSearch(expected))
}

function matchesTag(tags: string[], expected: string | undefined): boolean {
  return expected === undefined ||
    tags.some(tag => normalizeMetadataSearch(tag) === normalizeMetadataSearch(expected))
}

function findRegistration(manifest: ProjectManifest, paperId: string): PaperRegistration {
  const registration = manifest.papers.find(item => item.paperId === paperId)
  if (!registration) throw new Error(`paper-not-registered: ${paperId}`)
  return registration
}
