import { diagnostic } from './diagnostics'
import { ProjectDiagnostic } from './types'

export interface ConstructRecord {
  constructId: string
  status: 'proposed' | 'approved' | 'deprecated'
  primaryConstructId?: string
}

export interface ConstructTaxonomyDocument {
  schema: { name: string; version: string }
  taxonomyVersion: number
  constructs: ConstructRecord[]
  modified: string
}

export class ConstructResolver {
  public resolve(
    taxonomy: ConstructTaxonomyDocument,
    constructId: string,
    file: string
  ): { constructId?: string; diagnostics: ProjectDiagnostic[] } {
    const construct = taxonomy.constructs.find(item => item.constructId === constructId)
    if (!construct) return { diagnostics: [constructDiagnostic('construct-not-found', constructId, file)] }
    if (construct.status === 'approved') return { constructId, diagnostics: [] }
    if (construct.status !== 'deprecated') {
      return { diagnostics: [constructDiagnostic('construct-not-approved', constructId, file)] }
    }
    return this.resolveDeprecated(taxonomy, construct, file)
  }

  private resolveDeprecated(
    taxonomy: ConstructTaxonomyDocument,
    construct: ConstructRecord,
    file: string
  ): { constructId?: string; diagnostics: ProjectDiagnostic[] } {
    const primaryId = construct.primaryConstructId
    if (!primaryId) {
      return { diagnostics: [constructDiagnostic('missing-primary-construct', construct.constructId, file)] }
    }
    if (primaryId === construct.constructId) {
      return { diagnostics: [constructDiagnostic('self-referential-primary', construct.constructId, file)] }
    }
    const primary = taxonomy.constructs.find(item => item.constructId === primaryId)
    if (!primary || primary.status !== 'approved') {
      return { diagnostics: [constructDiagnostic('primary-construct-not-active', construct.constructId, file)] }
    }
    return { constructId: primary.constructId, diagnostics: [] }
  }
}

function constructDiagnostic(code: string, constructId: string, file: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code,
    file,
    objectId: constructId,
    rule: `${constructId} does not resolve directly to an approved construct.`,
    action: 'Map the identifier to one distinct approved primary construct.',
  })
}
