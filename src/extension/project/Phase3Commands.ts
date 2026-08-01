import * as vscode from 'vscode'
import { ClaimLedgerPanel } from './ClaimLedgerPanel'
import { chooseManifest, runCommand, writeDiagnostics } from './ProjectCommands'
import { Phase3MutationOutcome, Phase3ProjectService } from './Phase3ProjectService'
import {
  ConflictRecord,
  ConflictType,
  EvidenceAppraisal,
  SynthesisClaim,
} from './types'

const AGENT_ACTOR = { type: 'agent' as const, id: 'proposal-import' }
const CONFLICT_TYPES: ConflictType[] = [
  'direct-empirical-inconsistency',
  'methodological-artifact',
  'contextual-divergence',
  'conceptual-disagreement',
]

export function registerPhase3Commands(
  context: vscode.ExtensionContext,
  service: Phase3ProjectService
): void {
  const output = vscode.window.createOutputChannel('NodeGraph Claim Ledger')
  context.subscriptions.push(
    output,
    vscode.commands.registerCommand('nodegraph.project.migratePhase3', uri =>
      runCommand(output, () => migrateProject(service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.importClaim', uri =>
      runCommand(output, () => importClaim(service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.openClaimLedger', uri =>
      runCommand(output, () => openLedger(context, service, uri))),
    vscode.commands.registerCommand('nodegraph.project.reviewClaims', uri =>
      runCommand(output, () => reviewClaim(service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.reviewConflicts', uri =>
      runCommand(output, () => reviewConflict(service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.reviewAppraisals', uri =>
      runCommand(output, () => reviewAppraisal(service, output, uri)))
  )
}

async function migrateProject(
  service: Phase3ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const confirmed = await vscode.window.showWarningMessage(
    'Upgrade this project from schema 1.1.0 to 1.2.0 for claims, conflicts, evidence appraisal, and the claim ledger?',
    { modal: true },
    'Upgrade project'
  )
  if (confirmed !== 'Upgrade project') return
  showOutcome(output, await service.migrate(manifest.fsPath))
}

async function importClaim(
  service: Phase3ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const selected = await vscode.window.showOpenDialog({
    canSelectMany: false,
    filters: { 'NodeGraph claim proposal': ['json'] },
    title: 'Import a claim proposal',
  })
  if (!selected?.[0]) return
  const proposal = await readJson(selected[0])
  showOutcome(output, await service.importClaim(
    manifest.fsPath,
    proposal,
    AGENT_ACTOR
  ))
}

async function openLedger(
  context: vscode.ExtensionContext,
  service: Phase3ProjectService,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (manifest) ClaimLedgerPanel.open(context, service, manifest.fsPath)
}

async function reviewClaim(
  service: Phase3ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const queues = await service.reviewQueues(manifest.fsPath)
  writeDiagnostics(output, queues.diagnostics)
  const selected = await vscode.window.showQuickPick(
    queues.claims.map(claim => ({
      label: safeLabel(claim.text),
      description: safeLabel(`${claim.claimId} · ${claim.reviewState.origin} proposal`),
      claim,
    })),
    { placeHolder: 'Choose a claim proposal' }
  )
  if (!selected) return
  const decision = await approvalChoice('Review this claim proposal')
  if (!decision) return
  if (decision === 'approved' && !await prepareParadigmDecision(
    service,
    output,
    manifest.fsPath,
    selected.claim
  )) return
  showOutcome(output, await service.reviewClaim(
    manifest.fsPath,
    selected.claim.claimId,
    decision
  ))
}

async function prepareParadigmDecision(
  service: Phase3ProjectService,
  output: vscode.OutputChannel,
  manifestPath: string,
  claim: SynthesisClaim
): Promise<boolean> {
  if (!claim.paradigmDecision.required || claim.paradigmDecision.status === 'approved') {
    return true
  }
  const decision = await paradigmDecisionChoice()
  if (!decision) return false
  const rationale = await researcherRationale('Explain the cross-paradigm decision')
  if (!rationale) return false
  const outcome = await service.decideParadigm(
    manifestPath,
    claim.claimId,
    decision,
    rationale
  )
  showOutcome(output, outcome)
  return outcome.mutation.accepted && decision === 'approved'
}

async function paradigmDecisionChoice() {
  const selected = await vscode.window.showQuickPick([
    { label: 'Approve synthesis across paradigms', decision: 'approved' as const },
    { label: 'Reject synthesis across paradigms', decision: 'rejected' as const },
  ], { placeHolder: 'Record the researcher cross-paradigm decision' })
  return selected?.decision
}

async function reviewConflict(
  service: Phase3ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const queues = await service.reviewQueues(manifest.fsPath)
  writeDiagnostics(output, queues.diagnostics)
  const selected = await vscode.window.showQuickPick(
    queues.conflicts.map(conflict => ({
      label: safeLabel(conflict.conflictType),
      description: safeLabel(`${conflict.conflictId} · ${conflict.findingRefs.length} preserved findings`),
      conflict,
    })),
    { placeHolder: 'Choose a conflict proposal' }
  )
  if (!selected) return
  writeConflictSummary(output, selected.conflict)
  const action = await vscode.window.showQuickPick([
    { label: 'Approve current classification', action: 'approve' as const },
    { label: 'Reject conflict proposal', action: 'reject' as const },
    { label: 'Reclassify and keep pending', action: 'reclassify' as const },
  ])
  if (!action) return
  if (action.action !== 'reclassify') {
    return showOutcome(output, await service.reviewConflict(
      manifest.fsPath,
      selected.conflict.conflictId,
      action.action === 'approve' ? 'approved' : 'rejected'
    ))
  }
  const type = await vscode.window.showQuickPick(
    CONFLICT_TYPES.map(value => ({ label: value, value }))
  )
  const rationale = type && await researcherRationale(
    'Explain the conflict reclassification'
  )
  if (!type || !rationale) return
  showOutcome(output, await service.reclassifyConflict(
    manifest.fsPath,
    selected.conflict.conflictId,
    type.value,
    rationale
  ))
}

async function reviewAppraisal(
  service: Phase3ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const queues = await service.reviewQueues(manifest.fsPath)
  writeDiagnostics(output, queues.diagnostics)
  const selected = await vscode.window.showQuickPick(
    queues.appraisals.map(appraisal => ({
      label: safeLabel(appraisal.paperId),
      description: safeLabel(appraisal.appraisalId),
      appraisal,
    })),
    { placeHolder: 'Choose an evidence appraisal proposal' }
  )
  if (!selected) return
  writeAppraisalSummary(output, selected.appraisal)
  const decision = await approvalChoice('Review this evidence appraisal')
  if (!decision) return
  showOutcome(output, await service.reviewAppraisal(
    manifest.fsPath,
    selected.appraisal.appraisalId,
    decision
  ))
}

function writeConflictSummary(
  output: vscode.OutputChannel,
  conflict: ConflictRecord
): void {
  output.appendLine(`Conflict ${conflict.conflictId}: ${conflict.conflictType}`)
  for (const finding of conflict.findingRefs) {
    output.appendLine(`- ${finding.relationship}: ${finding.paperId}/${finding.findingId}`)
  }
  for (const context of conflict.contextComparisons) {
    output.appendLine(`- Context: ${context.dimension} is ${context.result}; this is not a causal finding.`)
  }
  output.show(true)
}

function writeAppraisalSummary(
  output: vscode.OutputChannel,
  appraisal: EvidenceAppraisal
): void {
  output.appendLine(`Appraisal ${appraisal.appraisalId} for ${appraisal.paperId}`)
  output.appendLine(`Source hash: ${appraisal.sourceDocumentHash}`)
  output.appendLine(`Extraction revision: ${appraisal.extractionRevision}`)
  for (const [name, field] of Object.entries(appraisal.fields)) {
    output.appendLine(`- ${name}: ${field.status}${field.sourceText ? ` · ${field.sourceText}` : ''}`)
  }
  output.show(true)
}

async function researcherRationale(prompt: string): Promise<string | undefined> {
  const rationale = await vscode.window.showInputBox({
    prompt,
    validateInput: value => value.trim() ? undefined : 'Enter a researcher rationale.',
  })
  return rationale?.trim() || undefined
}

async function approvalChoice(placeHolder: string) {
  const selected = await vscode.window.showQuickPick([
    { label: 'Approve', decision: 'approved' as const },
    { label: 'Reject', decision: 'rejected' as const },
  ], { placeHolder })
  return selected?.decision
}

async function readJson(uri: vscode.Uri): Promise<unknown> {
  const bytes = await vscode.workspace.fs.readFile(uri)
  return JSON.parse(Buffer.from(bytes).toString('utf8'))
}

function showOutcome(
  output: vscode.OutputChannel,
  outcome: Phase3MutationOutcome
): void {
  output.appendLine(outcome.mutation.accepted
    ? `Accepted: ${outcome.mutation.targetDocument}`
    : `Rejected: ${outcome.mutation.code}`)
  writeDiagnostics(output, outcome.diagnostics)
  output.show(true)
}

function safeLabel(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\$\(/g, '＄(')
}
