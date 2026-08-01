import { AtomicJsonWriter } from './AtomicJsonWriter'
import { calculateDocumentRevision } from './canonical'
import { createHash } from 'crypto'
import { ConfidenceService } from './ConfidenceService'
import { diagnostic, hasErrors } from './diagnostics'
import { IntegrityService } from './IntegrityService'
import { ProjectPathResolver } from './ProjectPathResolver'
import { SchemaValidator } from './SchemaValidator'
import { SynthesisRepository } from './SynthesisRepository'
import { readFile } from 'fs/promises'
import {
  ClaimLedgerDetail,
  ClaimLedgerEntry,
  ClaimLedgerIndexDocument,
  Clock,
  ConflictRecord,
  EvidenceAppraisalsDocument,
  EvidenceRecordsDocument,
  ExtractionDocument,
  ConflictsDocument,
  PHASE3_DOCUMENT_SCHEMA_VERSION,
  ProjectDiagnostic,
  ProjectManifest,
  SynthesisClaim,
  SynthesisClaimsDocument,
  systemClock,
} from './types'

const SUPPORTING = new Set(['supports', 'partially-supports', 'extends', 'replicates'])
const DISSENTING = new Set([
  'contradicts',
  'qualifies',
  'fails-to-replicate',
  'uses-different-definition',
  'uses-different-population',
  'uses-different-method',
])

export interface ClaimLedgerOpenResult {
  index?: ClaimLedgerIndexDocument
  diagnostics: ProjectDiagnostic[]
  paperGraphHydrationCount: number
}

export class ClaimLedgerQueryService {
  constructor(
    private readonly paths: ProjectPathResolver,
    private readonly schemas: SchemaValidator,
    private readonly writer: AtomicJsonWriter,
    private readonly synthesis: SynthesisRepository,
    private readonly integrity: IntegrityService,
    private readonly confidence: ConfidenceService,
    private readonly clock: Clock = systemClock
  ) {}

  public async open(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<ClaimLedgerOpenResult> {
    if (!manifest.documents.claimLedgerIndex) {
      return { diagnostics: [missingLedgerRegistration()], paperGraphHydrationCount: 0 }
    }
    const current = await this.synthesis.readDocument<ClaimLedgerIndexDocument>(
      projectRoot,
      manifest.documents.claimLedgerIndex,
      'claim-ledger-index.schema.json'
    )
    if (!current.value) return this.rebuild(projectRoot, manifest)
    const freshness = await this.readFreshness(projectRoot, manifest)
    if (!freshness.values) {
      return { diagnostics: freshness.diagnostics, paperGraphHydrationCount: 0 }
    }
    if (indexIsCurrent(current.value, freshness.values)) return {
      index: current.value,
      diagnostics: freshness.diagnostics,
      paperGraphHydrationCount: 0,
    }
    return this.rebuild(projectRoot, manifest)
  }

  public async rebuild(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<ClaimLedgerOpenResult> {
    const source = await this.readSource(projectRoot, manifest, true)
    if (!source.values || hasErrors(source.diagnostics)) {
      return { diagnostics: source.diagnostics, paperGraphHydrationCount: 0 }
    }
    const candidate = buildIndex(source.values, this.clock.now(), this.confidence)
    const schemaDiagnostics = this.schemas.validate(
      'claim-ledger-index.schema.json',
      candidate,
      manifest.documents.claimLedgerIndex!
    )
    if (hasErrors(schemaDiagnostics)) {
      return {
        diagnostics: [...source.diagnostics, ...schemaDiagnostics],
        paperGraphHydrationCount: 0,
      }
    }
    const target = await this.paths.resolve(projectRoot, manifest.documents.claimLedgerIndex!)
    await this.writer.write(target, candidate)
    return {
      index: candidate,
      diagnostics: [...source.diagnostics, ...schemaDiagnostics],
      paperGraphHydrationCount: 0,
    }
  }

  public async hydrate(
    projectRoot: string,
    manifest: ProjectManifest,
    claimId: string
  ): Promise<ClaimLedgerDetail | undefined> {
    const [claims, conflicts, appraisals, evidence, taxonomy] = await Promise.all([
      this.synthesis.readClaims(projectRoot, manifest),
      this.synthesis.readConflicts(projectRoot, manifest),
      this.synthesis.readAppraisals(projectRoot, manifest),
      this.synthesis.readEvidence(projectRoot, manifest),
      this.synthesis.readTaxonomy(projectRoot, manifest),
    ])
    const claim = claims.value?.claims.find(item => item.claimId === claimId)
    if (!claim || !claims.value || !conflicts.value || !appraisals.value ||
      !evidence.value || !taxonomy.value) return undefined
    const extractions = await readClaimExtractions(
      this.synthesis,
      projectRoot,
      manifest,
      claim
    )
    const sourceHashes = await readSourceHashes(this.integrity, projectRoot, manifest)
    const evidenceById = new Map(evidence.value.evidence.map(item => [item.evidenceId, item]))
    const source: LedgerSource = {
      manifest,
      claims: claims.value,
      conflicts: conflicts.value,
      appraisals: appraisals.value,
      evidence: evidence.value,
      taxonomyVersion: taxonomy.value.taxonomyVersion,
      extractions: extractions.values,
      currentSourceHashes: sourceHashes.values,
      sourceFileHashes: {},
    }
    return {
      claim: claimWithCurrentFreshness(this.confidence, source, claim),
      conflicts: conflicts.value.conflicts.filter(item => item.claimId === claimId),
      appraisals: appraisals.value.appraisals.filter(item =>
        claim.findingRefs.some(ref => ref.paperId === item.paperId)),
      findings: claim.findingRefs.flatMap(ref => {
        const extraction = extractions.values.get(ref.paperId)
        const finding = extraction?.fields.findings.items?.find(item =>
          item.findingId === ref.findingId)
        const registration = manifest.papers.find(item => item.paperId === ref.paperId)
        if (!extraction || !finding || !registration) return []
        return [{
          paperId: ref.paperId,
          paperTitle: registration.source.title ?? ref.paperId,
          relationship: ref.relationship,
          paperMetadata: {
            ...(registration.source.doi ? { doi: registration.source.doi } : {}),
            ...(registration.source.version
              ? { sourceVersion: registration.source.version }
              : {}),
          },
          finding,
          population: extraction.fields.population,
          setting: extraction.fields.setting,
          methodology: extraction.methodology,
          evidence: finding.evidenceIds.flatMap(id => {
            const record = evidenceById.get(id)
            return record ? [record] : []
          }),
        }]
      }),
      revisions: {
        claims: calculateDocumentRevision(claims.value),
        conflicts: calculateDocumentRevision(conflicts.value),
        appraisals: calculateDocumentRevision(appraisals.value),
      },
      diagnostics: [
        ...claims.diagnostics,
        ...conflicts.diagnostics,
        ...appraisals.diagnostics,
        ...evidence.diagnostics,
        ...taxonomy.diagnostics,
        ...extractions.diagnostics,
        ...sourceHashes.diagnostics,
      ],
    }
  }

  private async readSource(
    projectRoot: string,
    manifest: ProjectManifest,
    includeExtractions: boolean
  ): Promise<{ values?: LedgerSource; diagnostics: ProjectDiagnostic[] }> {
    const [claims, conflicts, appraisals, evidence, taxonomy] = await Promise.all([
      this.synthesis.readClaims(projectRoot, manifest),
      this.synthesis.readConflicts(projectRoot, manifest),
      this.synthesis.readAppraisals(projectRoot, manifest),
      this.synthesis.readEvidence(projectRoot, manifest),
      this.synthesis.readTaxonomy(projectRoot, manifest),
    ])
    const extractions = includeExtractions
      ? await readAllExtractions(this.synthesis, projectRoot, manifest)
      : { values: new Map<string, ExtractionDocument>(), diagnostics: [] }
    const [sourceHashes, sourceFileHashes] = await Promise.all([
      readSourceHashes(this.integrity, projectRoot, manifest),
      readSourceFileHashes(this.paths, projectRoot, manifest),
    ])
    const diagnostics = [
      ...claims.diagnostics,
      ...conflicts.diagnostics,
      ...appraisals.diagnostics,
      ...evidence.diagnostics,
      ...taxonomy.diagnostics,
      ...extractions.diagnostics,
      ...sourceHashes.diagnostics,
      ...sourceFileHashes.diagnostics,
    ]
    if (!claims.value || !conflicts.value || !appraisals.value ||
      !evidence.value || !taxonomy.value) return { diagnostics }
    return {
      values: {
        manifest,
        claims: claims.value,
        conflicts: conflicts.value,
        appraisals: appraisals.value,
        evidence: evidence.value,
        taxonomyVersion: taxonomy.value.taxonomyVersion,
        extractions: extractions.values,
        currentSourceHashes: sourceHashes.values,
        sourceFileHashes: sourceFileHashes.values,
      },
      diagnostics,
    }
  }

  private async readFreshness(
    projectRoot: string,
    manifest: ProjectManifest
  ): Promise<{ values?: LedgerFreshness; diagnostics: ProjectDiagnostic[] }> {
    const [sourceHashes, sourceFileHashes] = await Promise.all([
      readSourceHashes(this.integrity, projectRoot, manifest),
      readSourceFileHashes(this.paths, projectRoot, manifest),
    ])
    const diagnostics = [...sourceHashes.diagnostics, ...sourceFileHashes.diagnostics]
    if (hasErrors(diagnostics)) return { diagnostics }
    return {
      values: {
        manifestRevision: calculateDocumentRevision(manifest),
        sourceDocumentHashes: sourceHashes.values,
        sourceFileHashes: sourceFileHashes.values,
      },
      diagnostics,
    }
  }
}

interface LedgerSource {
  manifest: ProjectManifest
  claims: SynthesisClaimsDocument
  conflicts: ConflictsDocument
  appraisals: EvidenceAppraisalsDocument
  evidence: EvidenceRecordsDocument
  taxonomyVersion: number
  extractions: Map<string, ExtractionDocument>
  currentSourceHashes: Record<string, string>
  sourceFileHashes: Record<string, string>
}

interface LedgerFreshness {
  manifestRevision: string
  sourceDocumentHashes: Record<string, string>
  sourceFileHashes: Record<string, string>
}

function buildIndex(
  source: LedgerSource,
  now: string,
  confidence: ConfidenceService
): ClaimLedgerIndexDocument {
  return {
    schema: {
      name: 'nodegraph-claim-ledger-index',
      version: PHASE3_DOCUMENT_SCHEMA_VERSION,
    },
    generatedAt: now,
    manifestRevision: calculateDocumentRevision(source.manifest),
    claimsRevision: calculateDocumentRevision(source.claims),
    conflictsRevision: calculateDocumentRevision(source.conflicts),
    appraisalsRevision: calculateDocumentRevision(source.appraisals),
    taxonomyVersion: source.taxonomyVersion,
    sourceDocumentHashes: source.currentSourceHashes,
    sourceFileHashes: source.sourceFileHashes,
    extractionRevisions: Object.fromEntries([...source.extractions].map(
      ([paperId, extraction]) => [paperId, calculateDocumentRevision(extraction)]
    )),
    entries: source.claims.claims.map(claim => buildEntry(source, claim, confidence)),
  }
}

function buildEntry(
  source: LedgerSource,
  claim: SynthesisClaim,
  confidence: ConfidenceService
): ClaimLedgerEntry {
  const conflicts = source.conflicts.conflicts.filter(item => item.claimId === claim.claimId)
  const confidenceStale = confidenceStaleReasons(confidence, source, claim).length > 0
  return {
    claimId: claim.claimId,
    text: claim.text,
    claimType: claim.claimType,
    supportingPaperIds: paperIds(claim, SUPPORTING),
    dissentingPaperIds: paperIds(claim, DISSENTING),
    conflictTypes: [...new Set(conflicts.map(item => item.conflictType))],
    conflictReviewStates: conflicts.map(item => item.reviewState.approval.researcher),
    contextSummary: contextSummaries(conflicts),
    confidenceLabel: claim.confidence?.label ?? 'not-assessed',
    confidenceStale,
    confidenceExplanationAvailable: Boolean(claim.confidence),
    reviewState: claim.reviewState,
    origin: claim.reviewState.origin,
    warnings: ledgerWarnings(source, claim, conflicts, confidenceStale),
  }
}

function paperIds(claim: SynthesisClaim, relationships: Set<string>): string[] {
  return [...new Set(claim.findingRefs
    .filter(ref => relationships.has(ref.relationship))
    .map(ref => ref.paperId))]
}

function contextSummaries(conflicts: ConflictRecord[]): string[] {
  return conflicts.flatMap(conflict => conflict.contextComparisons.map(comparison =>
    `${comparison.dimension}: ${comparison.result}`))
}

function ledgerWarnings(
  source: LedgerSource,
  claim: SynthesisClaim,
  conflicts: ConflictRecord[],
  confidenceStale: boolean
): string[] {
  const warnings: string[] = []
  if (claim.reviewState.origin === 'ai' &&
    claim.reviewState.approval.researcher !== 'approved') warnings.push('ai-proposal')
  if (claim.reviewState.verification.classification === 'disputed') {
    warnings.push('disputed-classification')
  }
  if (claim.paradigmDecision.required && claim.paradigmDecision.status !== 'approved') {
    warnings.push('cross-paradigm-decision-required')
  }
  if (conflicts.some(item => item.reviewState.approval.researcher !== 'approved')) {
    warnings.push('unresolved-conflict')
  }
  if (confidenceStale) warnings.push('stale-confidence')
  const evidence = new Map(source.evidence.evidence.map(item => [item.evidenceId, item]))
  if (claim.evidenceRefs.some(id => {
    const state = evidence.get(id)?.reviewState.verification.source
    return !state || state === 'stale' || state === 'rejected'
  })) warnings.push('invalid-evidence')
  if (hasDisputedFinding(source, claim)) warnings.push('disputed-finding-classification')
  return warnings
}

function hasDisputedFinding(source: LedgerSource, claim: SynthesisClaim): boolean {
  return claim.findingRefs.some(ref => source.extractions.get(ref.paperId)
    ?.fields.findings.items?.find(item => item.findingId === ref.findingId)
    ?.reviewState.verification.classification === 'disputed')
}

function confidenceStaleReasons(
  service: ConfidenceService,
  source: LedgerSource,
  claim: SynthesisClaim
): string[] {
  if (!claim.confidence) return []
  const current = service.staleReasons(claim.confidence, {
    claim,
    conflicts: source.conflicts.conflicts.filter(item => item.claimId === claim.claimId),
    appraisals: source.appraisals.appraisals,
    evidence: source.evidence.evidence,
    extractions: source.extractions,
    manifest: source.manifest,
    appraisalsRevision: calculateDocumentRevision(source.appraisals),
    conflictsRevision: calculateDocumentRevision(source.conflicts),
    taxonomyVersion: source.taxonomyVersion,
    currentSourceHashes: source.currentSourceHashes,
  })
  if (!claim.confidence.stale) return current
  const stored = claim.confidence.staleReasons.length
    ? claim.confidence.staleReasons
    : ['stored-confidence-stale']
  return [...new Set([...stored, ...current])]
}

function claimWithCurrentFreshness(
  service: ConfidenceService,
  source: LedgerSource,
  claim: SynthesisClaim
): SynthesisClaim {
  const reasons = confidenceStaleReasons(service, source, claim)
  if (!claim.confidence || !reasons.length) return claim
  return {
    ...claim,
    confidence: { ...claim.confidence, stale: true, staleReasons: reasons },
  }
}

function indexIsCurrent(
  index: ClaimLedgerIndexDocument,
  freshness: LedgerFreshness
): boolean {
  return index.manifestRevision === freshness.manifestRevision &&
    equalRecords(index.sourceDocumentHashes, freshness.sourceDocumentHashes) &&
    equalRecords(index.sourceFileHashes, freshness.sourceFileHashes)
}

async function readAllExtractions(
  synthesis: SynthesisRepository,
  projectRoot: string,
  manifest: ProjectManifest
) {
  const reads = await Promise.all(manifest.papers.map(async paper => ({
    paperId: paper.paperId,
    read: await synthesis.readExtraction(projectRoot, paper),
  })))
  return {
    values: new Map(reads.flatMap(item => item.read.value
      ? [[item.paperId, item.read.value] as const]
      : [])),
    diagnostics: reads.flatMap(item => item.read.diagnostics),
  }
}

async function readSourceHashes(
  integrity: IntegrityService,
  projectRoot: string,
  manifest: ProjectManifest
): Promise<{ values: Record<string, string>; diagnostics: ProjectDiagnostic[] }> {
  const reads = []
  for (const paper of manifest.papers) {
    reads.push({ paper, result: await integrity.inspectSource(projectRoot, paper) })
  }
  return {
    values: Object.fromEntries(reads.map(({ paper, result }) => [
      paper.paperId,
      result.currentHash ?? paper.source.sourceDocumentHash,
    ])),
    diagnostics: reads.flatMap(item => item.result.diagnostics),
  }
}

async function readSourceFileHashes(
  paths: ProjectPathResolver,
  projectRoot: string,
  manifest: ProjectManifest
): Promise<{ values: Record<string, string>; diagnostics: ProjectDiagnostic[] }> {
  const entries: Array<{ relativePath: string; hash?: string }> = []
  for (const relativePath of ledgerSourcePaths(manifest)) {
    try {
      const target = await paths.resolve(projectRoot, relativePath, true)
      entries.push({ relativePath, hash: hashBytes(await readFile(target)) })
    } catch {
      entries.push({ relativePath })
    }
  }
  const missing = entries.filter(entry => !entry.hash)
  return {
    values: Object.fromEntries(entries.flatMap(entry =>
      entry.hash ? [[entry.relativePath, entry.hash]] : [])),
    diagnostics: missing.map(entry => missingLedgerSource(entry.relativePath)),
  }
}

function ledgerSourcePaths(manifest: ProjectManifest): string[] {
  return [
    manifest.documents.claims,
    manifest.documents.conflicts,
    manifest.documents.appraisals!,
    manifest.documents.evidence,
    manifest.documents.constructs,
    ...manifest.papers.flatMap(paper => paper.extractionPath ? [paper.extractionPath] : []),
  ]
}

function hashBytes(value: Uint8Array): string {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`
}

function equalRecords(
  left: Record<string, string>,
  right: Record<string, string>
): boolean {
  return JSON.stringify(left) === JSON.stringify(right)
}

async function readClaimExtractions(
  synthesis: SynthesisRepository,
  projectRoot: string,
  manifest: ProjectManifest,
  claim: SynthesisClaim
) {
  const paperIds = new Set(claim.findingRefs.map(ref => ref.paperId))
  const registrations = manifest.papers.filter(item => paperIds.has(item.paperId))
  const reads = await Promise.all(registrations.map(async paper => ({
    paperId: paper.paperId,
    read: await synthesis.readExtraction(projectRoot, paper),
  })))
  return {
    values: new Map(reads.flatMap(item => item.read.value
      ? [[item.paperId, item.read.value] as const]
      : [])),
    diagnostics: reads.flatMap(item => item.read.diagnostics),
  }
}

function missingLedgerRegistration(): ProjectDiagnostic {
  return diagnostic({
    layer: 'structural',
    code: 'phase3-document-not-registered',
    file: 'project.nodegraph.json',
    objectId: 'claimLedgerIndex',
    rule: 'The disposable claim-ledger index is not registered.',
    action: 'Run the explicit Phase 3 project migration.',
  })
}

function missingLedgerSource(relativePath: string): ProjectDiagnostic {
  return diagnostic({
    layer: 'integrity',
    code: 'missing-ledger-source',
    file: relativePath,
    rule: 'A file needed to check or rebuild the claim ledger is unavailable.',
    action: 'Restore the file or repair its project registration before opening the ledger.',
  })
}
