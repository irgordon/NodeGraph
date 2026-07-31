import { diagnostic } from './diagnostics'
import { normalizeMetadataSearch } from './metadata'
import {
  ConstructRecord,
  ConstructTaxonomyDocument,
  ProjectDiagnostic,
} from './types'

export type { ConstructTaxonomyDocument } from './types'

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

  public resolveTerm(
    taxonomy: ConstructTaxonomyDocument,
    sourceTerm: string,
    file: string
  ): { constructId?: string; diagnostics: ProjectDiagnostic[] } {
    const normalized = normalizeMetadataSearch(sourceTerm)
    const matches = taxonomy.constructs.filter(construct =>
      construct.status === 'approved' &&
      [construct.canonicalName, ...construct.aliases]
        .some(value => normalizeMetadataSearch(value) === normalized)
    )
    if (matches.length === 1) return { constructId: matches[0].constructId, diagnostics: [] }
    const code = matches.length ? 'ambiguous-construct-alias' : 'construct-alias-not-found'
    return { diagnostics: [constructDiagnostic(code, sourceTerm, file)] }
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
