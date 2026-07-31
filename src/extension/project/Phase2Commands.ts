import * as vscode from 'vscode'
import { PdfViewerPanel } from '../PdfViewerPanel'
import { MatrixPanel } from './MatrixPanel'
import { Phase2MutationOutcome, Phase2ProjectService } from './Phase2ProjectService'
import {
  chooseManifest,
  runCommand,
  writeDiagnostics,
} from './ProjectCommands'
import { ExtractionDocument } from './types'

const HUMAN_ACTOR = { type: 'human' as const, id: 'researcher' }

export function registerPhase2Commands(
  context: vscode.ExtensionContext,
  service: Phase2ProjectService
): void {
  const output = vscode.window.createOutputChannel('NodeGraph Synthesis')
  context.subscriptions.push(
    output,
    vscode.commands.registerCommand('nodegraph.project.migratePhase2', uri =>
      runCommand(output, () => migrateProject(service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.importExtraction', uri =>
      runCommand(output, () => importExtraction(service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.openMatrix', uri =>
      runCommand(output, () => openMatrix(context, service, uri))),
    vscode.commands.registerCommand('nodegraph.project.verifySources', uri =>
      runCommand(output, () => verifySource(context, service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.proposeConstruct', uri =>
      runCommand(output, () => proposeConstruct(service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.reviewConstructs', uri =>
      runCommand(output, () => reviewConstruct(service, output, uri)))
  )
}

async function migrateProject(
  service: Phase2ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const confirmed = await vscode.window.showWarningMessage(
    'Upgrade this project from schema 1.0.0 to 1.1.0? The manifest is replaced only after new extraction files validate.',
    { modal: true },
    'Upgrade project'
  )
  if (confirmed !== 'Upgrade project') return
  showOutcome(output, await service.migrate(manifest.fsPath))
}

async function importExtraction(
  service: Phase2ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const selected = await vscode.window.showOpenDialog({
    canSelectMany: false,
    filters: { 'NodeGraph extraction': ['json'] },
    title: 'Import a validated extraction proposal',
  })
  if (!selected?.[0]) return
  const proposal = await readExtraction(selected[0])
  showOutcome(
    output,
    await service.importExtraction(
      manifest.fsPath,
      proposal,
      HUMAN_ACTOR
    )
  )
}

async function openMatrix(
  context: vscode.ExtensionContext,
  service: Phase2ProjectService,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (manifest) MatrixPanel.open(context, service, manifest.fsPath)
}

async function verifySource(
  context: vscode.ExtensionContext,
  service: Phase2ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const queue = await service.sourceQueue(manifest.fsPath)
  writeDiagnostics(output, queue.diagnostics)
  const selected = await vscode.window.showQuickPick(
    queue.items.map(item => ({
      label: safeLabel(item.paperId),
      description: safeLabel(`${item.state}${item.stale ? ' · stale' : ''}`),
      detail: safeLabel(item.quote),
      item,
    })),
    { placeHolder: 'Choose pending evidence to verify at its source' }
  )
  if (!selected) return
  const target = await service.sourceNavigation(
    manifest.fsPath,
    selected.item.evidenceId
  )
  writeDiagnostics(output, target.diagnostics)
  if (target.sourcePath && target.quote) {
    await PdfViewerPanel.openAndSearch(
      context,
      vscode.Uri.file(target.sourcePath),
      target.quote,
      target.page
    )
  }
  const decision = await vscode.window.showQuickPick([
    { label: 'Confirm quotation', state: 'verified' as const },
    { label: 'Dispute quotation', state: 'rejected' as const },
  ], { placeHolder: 'Record source verification independently' })
  if (!decision) return
  showOutcome(
    output,
    await service.verifySource(
      manifest.fsPath,
      selected.item.evidenceId,
      decision.state
    )
  )
}

async function proposeConstruct(
  service: Phase2ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const constructId = await vscode.window.showInputBox({
    prompt: 'Stable construct ID',
    validateInput: value => /^[a-z][a-z0-9-]*$/.test(value)
      ? undefined
      : 'Use lower-case letters, numbers, and hyphens.',
  })
  if (!constructId) return
  const canonicalName = await vscode.window.showInputBox({
    prompt: 'Construct name',
  })
  if (!canonicalName) return
  const definition = await vscode.window.showInputBox({
    prompt: 'Definition (optional)',
  })
  showOutcome(output, await service.proposeConstruct(
    manifest.fsPath,
    { constructId, canonicalName, ...(definition ? { definition } : {}) },
    HUMAN_ACTOR
  ))
}

async function reviewConstruct(
  service: Phase2ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const taxonomy = await service.taxonomy(manifest.fsPath)
  writeDiagnostics(output, taxonomy.diagnostics)
  const pending = taxonomy.value?.constructs.filter(
    construct => construct.status === 'proposed' &&
      construct.reviewState.approval.researcher === 'not-reviewed'
  ) ?? []
  const selected = await vscode.window.showQuickPick(
    pending.map(construct => ({
      label: safeLabel(construct.canonicalName),
      description: safeLabel(construct.constructId),
      constructId: construct.constructId,
    })),
    { placeHolder: 'Choose a proposed construct' }
  )
  if (!selected) return
  const decision = await vscode.window.showQuickPick([
    { label: 'Approve construct', value: 'approved' as const },
    { label: 'Reject construct', value: 'rejected' as const },
  ])
  if (!decision) return
  showOutcome(
    output,
    await service.reviewConstruct(
      manifest.fsPath,
      selected.constructId,
      decision.value
    )
  )
}

async function readExtraction(uri: vscode.Uri): Promise<ExtractionDocument> {
  const bytes = await vscode.workspace.fs.readFile(uri)
  return JSON.parse(Buffer.from(bytes).toString('utf8')) as ExtractionDocument
}

function showOutcome(
  output: vscode.OutputChannel,
  outcome: Phase2MutationOutcome
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
