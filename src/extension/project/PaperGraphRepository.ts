import { readFile } from 'fs/promises'
import { NodeGraph } from '../../webview/types/graph'
import { calculateByteHash } from './canonical'
import { diagnostic, hasErrors } from './diagnostics'
import { cleanMetadataValue, cleanMetadataValues } from './metadata'
import { ProjectPathResolver } from './ProjectPathResolver'
import { SchemaValidator } from './SchemaValidator'
import {
  PaperHydrationSnapshot,
  PaperIndexEntry,
  PaperReadResult,
  PaperRegistration,
  ProjectDiagnostic,
} from './types'

interface GraphWithTags extends NodeGraph {
  tags?: unknown
}

export class PaperGraphRepository {
  private hydratedPaperIds: string[] = []

  constructor(
    private readonly paths: ProjectPathResolver,
    private readonly schemas: SchemaValidator
  ) {}

  public async read(projectRoot: string, registration: PaperRegistration): Promise<PaperReadResult> {
    const target = await this.paths.resolve(projectRoot, registration.path, true)
    this.hydratedPaperIds.push(registration.paperId)
    const text = await readFile(target, 'utf8')
    const parsed = this.schemas.parseJson(text, registration.path)
    if (!parsed.value) return { diagnostics: parsed.diagnostics }
    const diagnostics = this.validateGraph(parsed.value, registration)
    return hasErrors(diagnostics)
      ? { diagnostics }
      : { graph: parsed.value as NodeGraph, diagnostics }
  }

  public async calculateGraphHash(projectRoot: string, paperPath: string): Promise<string> {
    const target = await this.paths.resolve(projectRoot, paperPath, true)
    return calculateByteHash(await readFile(target))
  }

  public resolveNode(graph: NodeGraph, nodeId: string): NodeGraph['nodes'][number] | undefined {
    return graph.nodes.find(node => node.id === nodeId)
  }

  public buildIndexMetadata(
    registration: PaperRegistration,
    graph: NodeGraph,
    graphHash: string,
    taxonomyVersion: number,
    indexedAt: string,
    extractorVersion: string
  ): PaperIndexEntry {
    return {
      paperId: registration.paperId,
      paperPath: registration.path,
      paperGraphHash: graphHash,
      sourceDocumentHash: registration.source.sourceDocumentHash,
      title: cleanMetadataValue(graph.title),
      authors: getAuthors(graph),
      ...getOptionalMetadata(graph),
      tags: getTags(graph as GraphWithTags),
      taxonomyVersion,
      extractorVersion,
      indexedAt,
    }
  }

  public instrumentation(): PaperHydrationSnapshot {
    return { count: this.hydratedPaperIds.length, paperIds: [...this.hydratedPaperIds] }
  }

  public resetInstrumentation(): void {
    this.hydratedPaperIds = []
  }

  private validateGraph(value: unknown, registration: PaperRegistration): ProjectDiagnostic[] {
    const diagnostics = this.schemas.validate('nodegraph.schema.json', value, registration.path)
    if (hasErrors(diagnostics)) return diagnostics
    return validateGraphReferences(value as NodeGraph, registration)
  }
}

function validateGraphReferences(
  graph: NodeGraph,
  registration: PaperRegistration
): ProjectDiagnostic[] {
  const diagnostics: ProjectDiagnostic[] = []
  const nodeIds = collectUniqueIds(graph.nodes.map(node => node.id), registration, diagnostics)
  collectUniqueEdgeIds(graph, registration, diagnostics)
  validateNodeReferences(graph, nodeIds, registration, diagnostics)
  return diagnostics
}

function collectUniqueIds(
  identifiers: string[],
  registration: PaperRegistration,
  diagnostics: ProjectDiagnostic[]
): Set<string> {
  const unique = new Set<string>()
  for (const identifier of identifiers) {
    if (unique.has(identifier)) diagnostics.push(duplicateNodeDiagnostic(registration, identifier))
    unique.add(identifier)
  }
  return unique
}

function collectUniqueEdgeIds(
  graph: NodeGraph,
  registration: PaperRegistration,
  diagnostics: ProjectDiagnostic[]
): void {
  const edgeIds = new Set<string>()
  for (const edge of graph.edges) {
    if (edgeIds.has(edge.id)) diagnostics.push(duplicateEdgeDiagnostic(registration, edge.id))
    edgeIds.add(edge.id)
  }
}

function validateNodeReferences(
  graph: NodeGraph,
  nodeIds: Set<string>,
  registration: PaperRegistration,
  diagnostics: ProjectDiagnostic[]
): void {
  for (const node of graph.nodes) {
    for (const child of node.children) {
      if (!nodeIds.has(child)) diagnostics.push(missingNodeDiagnostic(registration, child))
    }
  }
  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.source)) diagnostics.push(missingNodeDiagnostic(registration, edge.source))
    if (!nodeIds.has(edge.target)) diagnostics.push(missingNodeDiagnostic(registration, edge.target))
  }
}

function getAuthors(graph: NodeGraph): string[] {
  return graph.source?.authors ? cleanMetadataValues([graph.source.authors]) : []
}

function getOptionalMetadata(graph: NodeGraph): { publicationYear?: number; doi?: string } {
  const publicationYear = parsePublicationYear(graph.source?.venue)
  const doi = graph.source?.doi ? cleanMetadataValue(graph.source.doi) : undefined
  return {
    ...(publicationYear ? { publicationYear } : {}),
    ...(doi ? { doi } : {}),
  }
}

function parsePublicationYear(venue: string | undefined): number | undefined {
  const match = venue?.match(/\b(1[0-9]{3}|2[0-9]{3})\b/)
  return match ? Number(match[1]) : undefined
}

function getTags(graph: GraphWithTags): string[] {
  if (!Array.isArray(graph.tags)) return []
  return cleanMetadataValues(graph.tags.filter((tag): tag is string => typeof tag === 'string'))
}

function duplicateNodeDiagnostic(
  registration: PaperRegistration,
  nodeId: string
): ProjectDiagnostic {
  return structuralDiagnostic(registration, 'duplicate-node-id', nodeId, 'Make every node ID unique.')
}

function duplicateEdgeDiagnostic(
  registration: PaperRegistration,
  edgeId: string
): ProjectDiagnostic {
  return structuralDiagnostic(registration, 'duplicate-edge-id', edgeId, 'Make every edge ID unique.')
}

function missingNodeDiagnostic(
  registration: PaperRegistration,
  nodeId: string
): ProjectDiagnostic {
  return structuralDiagnostic(registration, 'missing-node-reference', nodeId, 'Restore the node or remove the broken reference.')
}

function structuralDiagnostic(
  registration: PaperRegistration,
  code: string,
  objectId: string,
  action: string
): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code,
    file: registration.path,
    objectId,
    rule: `${objectId} violates paper graph reference rules.`,
    action,
  })
}
