import * as path from 'path'
import * as vscode from 'vscode'
import { AuditLogError } from './AuditLog'
import { MutationAuditError } from './MutationRepository'
import {
  Phase1ProjectError,
  Phase1ProjectService,
  ProjectMutationOutcome,
} from './Phase1ProjectService'
import { ProjectDiagnostic, ProjectOpenResult } from './types'

export function registerProjectCommands(
  context: vscode.ExtensionContext,
  service: Phase1ProjectService
): void {
  const output = vscode.window.createOutputChannel('NodeGraph Projects')
  context.subscriptions.push(
    output,
    vscode.commands.registerCommand('nodegraph.project.create', uri =>
      runCommand(output, () => createProject(service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.open', uri =>
      runCommand(output, () => openProject(service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.registerPaper', uri =>
      runCommand(output, () => registerPaper(service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.unregisterPaper', uri =>
      runCommand(output, () => unregisterPaper(service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.validate', uri =>
      runCommand(output, () => validateProject(service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.rebuildIndexes', uri =>
      runCommand(output, () => rebuildIndexes(service, output, uri))),
    vscode.commands.registerCommand('nodegraph.project.search', uri =>
      runCommand(output, () => searchProject(service, output, uri)))
  )
}

async function createProject(
  service: Phase1ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const folder = clicked ?? await chooseFolder('Choose a folder for the NodeGraph project')
  if (!folder) return
  const projectId = await vscode.window.showInputBox({
    prompt: 'Project ID',
    value: `project_${path.basename(folder.fsPath).replace(/[^A-Za-z0-9_-]/g, '_')}`,
    validateInput: validateProjectId,
  })
  if (!projectId) return
  const title = await vscode.window.showInputBox({ prompt: 'Project title' })
  if (!title) return
  const opened = await service.create(folder.fsPath, projectId, title)
  showProjectReport(output, opened)
}

async function openProject(
  service: Phase1ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  showProjectReport(output, await service.open(manifest.fsPath))
}

async function registerPaper(
  service: Phase1ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const paper = await choosePaper(path.dirname(manifest.fsPath))
  if (!paper) return
  const paperId = await vscode.window.showInputBox({
    prompt: 'Stable paper ID',
    value: `paper_${path.basename(paper.fsPath, '.nodegraph.json').replace(/[^A-Za-z0-9_-]/g, '_')}`,
    validateInput: value => /^paper_[A-Za-z0-9_-]+$/.test(value) ? undefined : 'Use paper_<letters, numbers, _ or ->',
  })
  if (!paperId) return
  const sourceId = await vscode.window.showInputBox({
    prompt: 'Stable source ID',
    value: `source_${paperId.slice('paper_'.length)}`,
    validateInput: value => /^source_[A-Za-z0-9_-]+$/.test(value) ? undefined : 'Use source_<letters, numbers, _ or ->',
  })
  if (!sourceId) return
  const paperPath = toProjectRelative(path.dirname(manifest.fsPath), paper.fsPath)
  const outcome = await service.registerPaper(manifest.fsPath, { paperId, paperPath, sourceId })
  showMutationReport(output, outcome)
}

async function unregisterPaper(
  service: Phase1ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const opened = await service.open(manifest.fsPath)
  if (!opened.manifest) return showProjectReport(output, opened)
  const selected = await vscode.window.showQuickPick(
    opened.manifest.papers.map(paper => ({
      label: safeLabel(paper.paperId),
      description: safeLabel(paper.path),
      paperId: paper.paperId,
    })),
    { placeHolder: 'Choose a paper registration to remove' }
  )
  if (!selected) return
  const outcome = await service.unregisterPaper(manifest.fsPath, selected.paperId)
  showMutationReport(output, outcome)
}

async function validateProject(
  service: Phase1ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const report = await service.validate(manifest.fsPath)
  writeDiagnostics(output, report.diagnostics)
  vscode.window.showInformationMessage(
    report.valid ? 'NodeGraph project validation passed.' : 'NodeGraph project validation found errors.'
  )
}

async function rebuildIndexes(
  service: Phase1ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const result = await service.rebuildIndexes(manifest.fsPath, true)
  writeDiagnostics(output, result.diagnostics)
  output.appendLine(`Processed: ${result.processedPaperIds.length}; reused: ${result.reusedPaperIds.length}; removed: ${result.removedPaperIds.length}`)
  output.show(true)
}

async function searchProject(
  service: Phase1ProjectService,
  output: vscode.OutputChannel,
  clicked?: vscode.Uri
): Promise<void> {
  const manifest = await chooseManifest(clicked)
  if (!manifest) return
  const text = await vscode.window.showInputBox({ prompt: 'Search indexed paper metadata' })
  if (text === undefined) return
  const results = await service.search(manifest.fsPath, { text })
  output.appendLine(`Search results: ${results.length}`)
  for (const result of results) {
    output.appendLine(`${safeText(result.paperId)} | ${safeText(result.title)} | ${safeText(result.paperPath)}`)
  }
  output.show(true)
}

export async function chooseManifest(clicked?: vscode.Uri): Promise<vscode.Uri | undefined> {
  if (clicked?.fsPath.endsWith('project.nodegraph.json')) return clicked
  const selected = await vscode.window.showOpenDialog({
    canSelectMany: false,
    filters: { 'NodeGraph Project': ['json'] },
    title: 'Open project.nodegraph.json',
  })
  return selected?.[0]
}

async function chooseFolder(title: string): Promise<vscode.Uri | undefined> {
  const selected = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    title,
  })
  return selected?.[0]
}

async function choosePaper(projectRoot: string): Promise<vscode.Uri | undefined> {
  const selected = await vscode.window.showOpenDialog({
    canSelectMany: false,
    defaultUri: vscode.Uri.file(path.join(projectRoot, 'papers')),
    filters: { 'NodeGraph Paper': ['json'] },
    title: 'Register a .nodegraph.json paper',
  })
  return selected?.[0]
}

export async function runCommand(
  output: vscode.OutputChannel,
  action: () => Promise<void>
): Promise<void> {
  try {
    await action()
  } catch (error) {
    showCommandError(output, error)
  }
}

function showProjectReport(output: vscode.OutputChannel, opened: ProjectOpenResult): void {
  if (opened.manifest) {
    output.appendLine(`${safeText(opened.manifest.title)} (${safeText(opened.manifest.projectId)})`)
    output.appendLine(`Mode: ${opened.mode}; registered papers: ${opened.manifest.papers.length}; hydrated papers: ${opened.hydrationCount}`)
  }
  writeDiagnostics(output, opened.diagnostics)
  output.show(true)
}

function showMutationReport(
  output: vscode.OutputChannel,
  outcome: ProjectMutationOutcome
): void {
  output.appendLine(outcome.mutation.accepted ? 'Mutation accepted.' : 'Mutation rejected.')
  writeDiagnostics(output, outcome.diagnostics)
  output.show(true)
}

function showCommandError(output: vscode.OutputChannel, error: unknown): void {
  if (error instanceof Phase1ProjectError) {
    output.appendLine(`[error] ${safeText(error.code)} | ${safeText(error.message)}`)
    writeDiagnostics(output, error.diagnostics)
  } else if (error instanceof MutationAuditError) {
    output.appendLine(
      `[error] ${error.code} | ${safeText(error.targetDocument)} | committed revision ${safeText(error.resultingRevision)}`
    )
  } else if (error instanceof AuditLogError) {
    output.appendLine(`[error] ${safeText(error.code)} | audit log is not writable`)
    writeDiagnostics(output, error.diagnostics)
  } else {
    output.appendLine(`[error] unexpected-project-error | ${safeText(errorMessage(error))}`)
  }
  output.show(true)
  vscode.window.showErrorMessage(commandErrorMessage(error))
}

function commandErrorMessage(error: unknown): string {
  if (error instanceof MutationAuditError) {
    return 'NodeGraph saved the document, but could not record its audit event. Further writes are blocked until the audit log is repaired.'
  }
  if (error instanceof AuditLogError) {
    return 'NodeGraph project operation failed: repair or restore the audit log before writing.'
  }
  if (error instanceof Phase1ProjectError) {
    return `NodeGraph project operation failed: ${safeText(error.message)}`
  }
  return `NodeGraph project operation failed: ${safeText(errorMessage(error))}`
}

export function writeDiagnostics(output: vscode.OutputChannel, diagnostics: ProjectDiagnostic[]): void {
  for (const item of diagnostics) {
    output.appendLine(
      `[${item.severity}] ${safeText(item.code)} | ${safeText(item.file)} | ${safeText(item.rule)} | ${safeText(item.action)}`
    )
  }
}

function validateProjectId(value: string): string | undefined {
  return /^project_[A-Za-z0-9_-]+$/.test(value)
    ? undefined
    : 'Use project_<letters, numbers, _ or ->'
}

function toProjectRelative(projectRoot: string, target: string): string {
  return path.relative(projectRoot, target).split(path.sep).join('/')
}

function safeLabel(value: string): string {
  return safeText(value).replace(/\$\(/g, '＄(')
}

function safeText(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ')
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
