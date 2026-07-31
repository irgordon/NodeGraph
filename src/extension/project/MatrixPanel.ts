import * as path from 'path'
import * as vscode from 'vscode'
import { NodeGraphEditorProvider } from '../NodeGraphEditorProvider'
import { PdfViewerPanel } from '../PdfViewerPanel'
import { getNonce } from '../nonce'
import { Phase2ProjectService } from './Phase2ProjectService'
import { MatrixFilters, ProjectDiagnostic } from './types'

type MatrixMessage =
  | { type: 'ready' }
  | { type: 'filter'; filters: Record<string, unknown> }
  | { type: 'openCell'; paperId: string; constructId: string }
  | { type: 'openEvidence'; evidenceId: string }
  | { type: 'focusGraph'; paperId: string; nodeId: string }
  | { type: 'exportCsv'; filters: Record<string, unknown> }
  | {
    type: 'verifySource'
    evidenceId: string
    state: 'verified' | 'rejected'
    paperId: string
    constructId: string
    filters: Record<string, unknown>
  }
  | {
    type: 'verifyFinding'
    paperId: string
    constructId: string
    findingId: string
    dimension: 'interpretation' | 'classification'
    state: 'verified' | 'rejected' | 'disputed'
    filters: Record<string, unknown>
  }
  | {
    type: 'verifyMapping'
    paperId: string
    constructId: string
    mappingId: string
    state: 'verified' | 'disputed'
    filters: Record<string, unknown>
  }
  | {
    type: 'reviewMapping'
    paperId: string
    constructId: string
    mappingId: string
    decision: 'approved' | 'rejected'
    filters: Record<string, unknown>
  }

export class MatrixPanel {
  private static readonly panels = new Map<string, MatrixPanel>()

  public static open(
    context: vscode.ExtensionContext,
    service: Phase2ProjectService,
    manifestPath: string
  ): void {
    const key = path.resolve(manifestPath)
    const existing = MatrixPanel.panels.get(key)
    if (existing) {
      existing.panel.reveal(vscode.ViewColumn.One, false)
      return
    }
    const panel = createPanel(context)
    const matrix = new MatrixPanel(context, service, key, panel)
    MatrixPanel.panels.set(key, matrix)
    matrix.register()
  }

  private constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly service: Phase2ProjectService,
    private readonly manifestPath: string,
    private readonly panel: vscode.WebviewPanel
  ) {}

  private register(): void {
    this.panel.webview.html = matrixHtml(this.panel.webview)
    const messages = this.panel.webview.onDidReceiveMessage(message =>
      this.handleMessage(message as MatrixMessage)
    )
    const selections = NodeGraphEditorProvider.onDidSelectNode(selection =>
      this.handleGraphSelection(selection.paperPath, selection.nodeId)
    )
    this.panel.onDidDispose(() => {
      messages.dispose()
      selections.dispose()
      MatrixPanel.panels.delete(this.manifestPath)
    })
  }

  private async handleMessage(message: MatrixMessage): Promise<void> {
    try {
      if (message.type === 'ready') await this.refresh({})
      if (message.type === 'filter') await this.refresh(parseFilters(message.filters))
      if (message.type === 'openCell') {
        await this.openCell(message.paperId, message.constructId)
      }
      if (message.type === 'openEvidence') await this.openEvidence(message.evidenceId)
      if (message.type === 'focusGraph') {
        await this.focusGraph(message.paperId, message.nodeId)
      }
      if (message.type === 'exportCsv') {
        await this.exportCsv(parseFilters(message.filters))
      }
      if (message.type === 'verifySource') await this.verifySource(message)
      if (message.type === 'verifyFinding') await this.verifyFinding(message)
      if (message.type === 'verifyMapping') await this.verifyMapping(message)
      if (message.type === 'reviewMapping') await this.reviewMapping(message)
    } catch (error) {
      this.postProblem(errorMessage(error))
    }
  }

  private async refresh(filters: MatrixFilters): Promise<void> {
    const opened = await this.service.openMatrix(this.manifestPath, filters)
    this.postDiagnostics(opened.diagnostics)
    this.panel.webview.postMessage({
      type: 'matrix',
      matrix: opened.matrix,
      hydrationCount: opened.hydrationCount,
    })
  }

  private async openCell(paperId: string, constructId: string): Promise<void> {
    const detail = await this.service.hydrateCell(
      this.manifestPath,
      paperId,
      constructId
    )
    if (!detail) {
      this.postProblem('The selected matrix detail is missing or invalid.')
      return
    }
    this.postDiagnostics(detail.diagnostics)
    this.panel.webview.postMessage({ type: 'detail', detail })
  }

  private async openEvidence(evidenceId: string): Promise<void> {
    const target = await this.service.sourceNavigation(
      this.manifestPath,
      evidenceId
    )
    this.postDiagnostics(target.diagnostics)
    if (!target.sourcePath || !target.quote) {
      this.postProblem('The source PDF or quotation is unavailable.')
      return
    }
    await PdfViewerPanel.openAndSearch(
      this.context,
      vscode.Uri.file(target.sourcePath),
      target.quote,
      target.page
    )
  }

  private async focusGraph(paperId: string, nodeId: string): Promise<void> {
    const target = await this.service.paperGraphTarget(
      this.manifestPath,
      paperId
    )
    if (target && NodeGraphEditorProvider.focusNode(target, nodeId)) return
    this.postProblem('Open the registered paper graph before focusing this evidence node.')
  }

  private async handleGraphSelection(
    paperPath: string,
    nodeId: string
  ): Promise<void> {
    const cell = await this.service.locateMatrixCell(
      this.manifestPath,
      paperPath,
      nodeId
    )
    if (cell) {
      this.panel.webview.postMessage({ type: 'focusCell', cell })
      return
    }
    this.postProblem(
      'The selected graph node has no stable mapping in the current matrix.'
    )
  }

  private async exportCsv(filters: MatrixFilters): Promise<void> {
    const exported = await this.service.exportCsv(this.manifestPath, filters)
    this.postDiagnostics(exported.diagnostics)
    if (!exported.csv) return
    const target = await vscode.window.showSaveDialog({
      filters: { 'CSV': ['csv'] },
      saveLabel: 'Export matrix',
      title: 'Export NodeGraph synthesis matrix',
    })
    if (!target) return
    await vscode.workspace.fs.writeFile(
      target,
      Buffer.from(exported.csv, 'utf8')
    )
    vscode.window.showInformationMessage(`Matrix exported: ${target.fsPath}`)
  }

  private async verifySource(
    message: Extract<MatrixMessage, { type: 'verifySource' }>
  ): Promise<void> {
    const outcome = await this.service.verifySource(
      this.manifestPath,
      message.evidenceId,
      message.state
    )
    await this.refreshAfterReview(message, outcome)
  }

  private async verifyFinding(
    message: Extract<MatrixMessage, { type: 'verifyFinding' }>
  ): Promise<void> {
    const outcome = await this.service.verifyFinding(
      this.manifestPath,
      message.paperId,
      message.findingId,
      message.dimension,
      message.state
    )
    await this.refreshAfterReview(message, outcome)
  }

  private async verifyMapping(
    message: Extract<MatrixMessage, { type: 'verifyMapping' }>
  ): Promise<void> {
    const outcome = await this.service.verifyMappingClassification(
      this.manifestPath,
      message.paperId,
      message.mappingId,
      message.state
    )
    await this.refreshAfterReview(message, outcome)
  }

  private async reviewMapping(
    message: Extract<MatrixMessage, { type: 'reviewMapping' }>
  ): Promise<void> {
    const outcome = await this.service.reviewMapping(
      this.manifestPath,
      message.paperId,
      message.mappingId,
      message.decision
    )
    await this.refreshAfterReview(message, outcome)
  }

  private async refreshAfterReview(
    message: {
      paperId: string
      constructId: string
      filters: Record<string, unknown>
    },
    outcome: Awaited<ReturnType<Phase2ProjectService['verifySource']>>
  ): Promise<void> {
    this.postDiagnostics(outcome.diagnostics)
    if (!outcome.mutation.accepted) {
      this.postProblem(`Review was rejected: ${outcome.mutation.code}`)
      return
    }
    await this.refresh(parseFilters(message.filters))
    await this.openCell(message.paperId, message.constructId)
  }

  private postDiagnostics(diagnostics: ProjectDiagnostic[]): void {
    this.panel.webview.postMessage({ type: 'diagnostics', diagnostics })
  }

  private postProblem(message: string): void {
    this.panel.webview.postMessage({ type: 'problem', message })
  }
}

function createPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
  const panel = vscode.window.createWebviewPanel(
    'nodegraph.synthesisMatrix',
    'NodeGraph Synthesis Matrix',
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true }
  )
  panel.iconPath = vscode.Uri.joinPath(
    context.extensionUri,
    'resources',
    'icon-hires.png'
  )
  return panel
}

function parseFilters(input: Record<string, unknown>): MatrixFilters {
  const filters: MatrixFilters = {}
  assignText(filters, 'paper', input.paper)
  assignText(filters, 'constructId', input.constructId)
  assignText(filters, 'paradigm', input.paradigm)
  assignText(filters, 'approach', input.approach)
  assignText(filters, 'technique', input.technique)
  assignText(filters, 'population', input.population)
  assignText(filters, 'verification', input.verification)
  const year = Number(input.publicationYear)
  if (Number.isInteger(year) && year > 0) filters.publicationYear = year
  return filters
}

function assignText(
  filters: MatrixFilters,
  key: keyof MatrixFilters,
  value: unknown
): void {
  if (typeof value === 'string' && value.trim()) {
    Object.assign(filters, { [key]: value.trim() })
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function matrixHtml(webview: vscode.Webview): string {
  const nonce = getNonce()
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NodeGraph Synthesis Matrix</title>
  <style nonce="${nonce}">
    * { box-sizing: border-box; }
    body { margin: 0; color: var(--vscode-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family); }
    button, input, select { color: inherit; background: var(--vscode-input-background); border: 1px solid var(--vscode-input-border, transparent); padding: 6px 8px; }
    button { cursor: pointer; background: var(--vscode-button-secondaryBackground); }
    button:hover { background: var(--vscode-button-secondaryHoverBackground); }
    #toolbar { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; padding: 10px; border-bottom: 1px solid var(--vscode-panel-border); }
    #status { min-height: 28px; padding: 6px 10px; color: var(--vscode-descriptionForeground); }
    #layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; height: calc(100vh - 104px); }
    #matrixScroll { overflow: auto; }
    table { border-collapse: separate; border-spacing: 0; width: max-content; min-width: 100%; }
    th, td { min-width: 145px; border-right: 1px solid var(--vscode-panel-border); border-bottom: 1px solid var(--vscode-panel-border); padding: 7px; text-align: left; vertical-align: top; }
    th { position: sticky; top: 0; z-index: 2; background: var(--vscode-editorWidget-background); }
    th:first-child, td:first-child { position: sticky; left: 0; z-index: 1; min-width: 210px; background: var(--vscode-editorWidget-background); }
    th:first-child { z-index: 3; }
    .cell { width: 100%; min-height: 58px; text-align: left; border-left: 4px solid transparent; }
    .cell.pending, .cell.unmapped { border-left-color: var(--vscode-editorWarning-foreground); }
    .cell.stale, .cell.invalid { border-left-color: var(--vscode-editorError-foreground); }
    .cell.extracted { border-left-color: var(--vscode-testing-iconPassed); }
    .cell.focused { outline: 2px solid var(--vscode-focusBorder); }
    .subtle { color: var(--vscode-descriptionForeground); font-size: 0.9em; }
    #detail { overflow: auto; padding: 12px; border-left: 1px solid var(--vscode-panel-border); background: var(--vscode-sideBar-background); }
    #detail h2, #detail h3 { margin: 8px 0; }
    #detail article { padding: 8px 0; border-bottom: 1px solid var(--vscode-panel-border); white-space: pre-wrap; }
    #diagnostics { color: var(--vscode-editorWarning-foreground); }
    @media (max-width: 850px) { #layout { grid-template-columns: 1fr; } #detail { display: none; } }
  </style>
</head>
<body>
  <form id="toolbar">
    <input id="paper" placeholder="Paper or author">
    <input id="constructId" placeholder="Construct ID">
    <input id="paradigm" placeholder="Paradigm">
    <input id="approach" placeholder="Approach">
    <input id="technique" placeholder="Technique">
    <input id="population" placeholder="Population">
    <input id="publicationYear" inputmode="numeric" placeholder="Year">
    <select id="verification">
      <option value="">Any review state</option>
      <option value="pending-source">Source pending</option>
      <option value="pending-interpretation">Interpretation pending</option>
      <option value="pending-classification">Classification pending</option>
      <option value="disputed-classification">Classification disputed</option>
    </select>
    <button type="submit">Apply filters</button>
    <button type="button" id="clear">Clear</button>
    <button type="button" id="export">Export CSV</button>
  </form>
  <div id="status"><span id="summary"></span> <span id="diagnostics"></span></div>
  <main id="layout">
    <div id="matrixScroll"><table id="matrix"></table></div>
    <aside id="detail"><p class="subtle">Select a cell to inspect its extraction and evidence.</p></aside>
  </main>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi()
    let currentDetail = null
    const ids = ['paper', 'constructId', 'paradigm', 'approach', 'technique', 'population', 'publicationYear', 'verification']
    const filters = () => Object.fromEntries(ids.map(id => [id, document.getElementById(id).value]))
    document.getElementById('toolbar').addEventListener('submit', event => {
      event.preventDefault()
      vscode.postMessage({ type: 'filter', filters: filters() })
    })
    document.getElementById('clear').addEventListener('click', () => {
      ids.forEach(id => { document.getElementById(id).value = '' })
      vscode.postMessage({ type: 'filter', filters: {} })
    })
    document.getElementById('export').addEventListener('click', () => {
      vscode.postMessage({ type: 'exportCsv', filters: filters() })
    })
    window.addEventListener('message', event => receive(event.data))
    vscode.postMessage({ type: 'ready' })

    function receive(message) {
      if (message.type === 'matrix') renderMatrix(message.matrix, message.hydrationCount)
      if (message.type === 'detail') renderDetail(message.detail)
      if (message.type === 'diagnostics') renderDiagnostics(message.diagnostics)
      if (message.type === 'problem') renderProblem(message.message)
      if (message.type === 'focusCell') focusCell(message.cell)
    }

    function renderMatrix(matrix, hydrationCount) {
      const table = document.getElementById('matrix')
      table.replaceChildren()
      if (!matrix) return renderProblem('The matrix index is unavailable. Rebuild the project indexes.')
      const head = document.createElement('tr')
      head.appendChild(cellElement('th', 'Paper'))
      matrix.constructs.forEach(construct => head.appendChild(cellElement('th', construct.canonicalName)))
      const thead = document.createElement('thead')
      thead.appendChild(head)
      table.appendChild(thead)
      const tbody = document.createElement('tbody')
      matrix.papers.forEach(paper => tbody.appendChild(paperRow(paper, matrix)))
      table.appendChild(tbody)
      document.getElementById('summary').textContent =
        matrix.papers.length + ' papers × ' + matrix.constructs.length + ' constructs · graph hydration ' + hydrationCount
    }

    function paperRow(paper, matrix) {
      const row = document.createElement('tr')
      const label = cellElement('td', paper.title)
      label.appendChild(textElement('div', paper.paperId, 'subtle'))
      row.appendChild(label)
      matrix.constructs.forEach(construct => {
        const cell = matrix.cells.find(item => item.paperId === paper.paperId && item.constructId === construct.constructId)
        row.appendChild(matrixCell(cell))
      })
      return row
    }

    function matrixCell(cell) {
      const container = document.createElement('td')
      if (!cell) return container
      const button = document.createElement('button')
      button.className = 'cell ' + cell.state
      button.dataset.paperId = cell.paperId
      button.dataset.constructId = cell.constructId
      button.textContent = cell.state === 'empty' ? '—' : cell.state
      if (cell.findingIds.length) button.appendChild(textElement('div', cell.findingIds.length + ' findings', 'subtle'))
      if (cell.evidenceIds.length) button.appendChild(textElement('div', cell.evidenceIds.length + ' evidence records', 'subtle'))
      if (cell.sourceTerms.length) button.appendChild(textElement('div', cell.sourceTerms.join('; '), 'subtle'))
      button.addEventListener('click', () => vscode.postMessage({
        type: 'openCell',
        paperId: cell.paperId,
        constructId: cell.constructId,
      }))
      container.appendChild(button)
      return container
    }

    function renderDetail(detail) {
      currentDetail = detail
      const panel = document.getElementById('detail')
      panel.replaceChildren()
      panel.appendChild(textElement('h2', detail.constructName))
      panel.appendChild(textElement('p', detail.paperId + ' · ' + detail.extractionId, 'subtle'))
      panel.appendChild(textElement('h3', 'Method and population'))
      panel.appendChild(textElement('p', methodText(detail.methodology)))
      panel.appendChild(textElement('h3', 'Source and normalized terms'))
      detail.mappings.forEach(mapping => {
        panel.appendChild(mappingArticle(detail, mapping))
      })
      panel.appendChild(textElement('h3', 'Findings'))
      detail.findings.forEach(finding => panel.appendChild(findingArticle(detail, finding)))
      panel.appendChild(textElement('h3', 'Evidence'))
      detail.evidence.forEach(evidence => panel.appendChild(evidenceArticle(evidence)))
    }

    function mappingArticle(detail, mapping) {
      const text = mapping.sourceTerm + ' → ' +
        (mapping.constructId || 'unmapped') + ' (' + mapping.mappingStatus + ')'
      const article = textElement('article', text)
      article.appendChild(textElement('div', reviewText(mapping.reviewState), 'subtle'))
      if (mapping.mappingStatus === 'pending') {
        article.appendChild(reviewButton('Approve mapping', () => reviewMapping(detail, mapping, 'approved')))
        article.appendChild(reviewButton('Reject mapping', () => reviewMapping(detail, mapping, 'rejected')))
      }
      article.appendChild(reviewButton('Confirm classification', () => verifyMapping(detail, mapping, 'verified')))
      article.appendChild(reviewButton('Dispute classification', () => verifyMapping(detail, mapping, 'disputed')))
      return article
    }

    function findingArticle(detail, finding) {
      const article = textElement('article', finding.sourceText)
      article.appendChild(textElement('div', reviewText(finding.reviewState), 'subtle'))
      article.appendChild(reviewButton('Confirm interpretation', () => verifyFinding(detail, finding, 'interpretation', 'verified')))
      article.appendChild(reviewButton('Dispute interpretation', () => verifyFinding(detail, finding, 'interpretation', 'rejected')))
      article.appendChild(reviewButton('Confirm classification', () => verifyFinding(detail, finding, 'classification', 'verified')))
      article.appendChild(reviewButton('Dispute classification', () => verifyFinding(detail, finding, 'classification', 'disputed')))
      if (finding.nodeId) {
        const button = textElement('button', 'Focus graph node')
        button.addEventListener('click', () => vscode.postMessage({
          type: 'focusGraph',
          paperId: detail.paperId,
          nodeId: finding.nodeId,
        }))
        article.appendChild(button)
      }
      return article
    }

    function evidenceArticle(evidence) {
      const article = textElement('article', evidence.quote.text)
      article.appendChild(textElement('div', 'p. ' + evidence.locator.page + ' · source ' + evidence.reviewState.verification.source, 'subtle'))
      const button = textElement('button', 'Open source PDF')
      button.addEventListener('click', () => vscode.postMessage({
        type: 'openEvidence',
        evidenceId: evidence.evidenceId,
      }))
      article.appendChild(button)
      article.appendChild(reviewButton('Confirm quotation', () => verifySource(evidence, 'verified')))
      article.appendChild(reviewButton('Dispute quotation', () => verifySource(evidence, 'rejected')))
      return article
    }

    function verifySource(evidence, state) {
      const detail = currentDetail
      if (!detail) return
      vscode.postMessage({
        type: 'verifySource',
        evidenceId: evidence.evidenceId,
        state,
        paperId: detail.paperId,
        constructId: detail.constructId,
        filters: filters(),
      })
    }

    function verifyFinding(detail, finding, dimension, state) {
      vscode.postMessage({
        type: 'verifyFinding',
        paperId: detail.paperId,
        constructId: detail.constructId,
        findingId: finding.findingId,
        dimension,
        state,
        filters: filters(),
      })
    }

    function verifyMapping(detail, mapping, state) {
      vscode.postMessage({
        type: 'verifyMapping',
        paperId: detail.paperId,
        constructId: detail.constructId,
        mappingId: mapping.mappingId,
        state,
        filters: filters(),
      })
    }

    function reviewMapping(detail, mapping, decision) {
      vscode.postMessage({
        type: 'reviewMapping',
        paperId: detail.paperId,
        constructId: detail.constructId,
        mappingId: mapping.mappingId,
        decision,
        filters: filters(),
      })
    }

    function reviewButton(label, action) {
      const button = textElement('button', label)
      button.addEventListener('click', action)
      return button
    }

    function renderDiagnostics(diagnostics) {
      const visible = (diagnostics || []).filter(item => item.severity === 'error' || item.code.includes('stale'))
      document.getElementById('diagnostics').textContent =
        visible.length ? visible.map(item => item.code + ': ' + item.action).join(' · ') : ''
    }

    function renderProblem(message) {
      document.getElementById('diagnostics').textContent = message
    }

    function focusCell(cell) {
      document.querySelectorAll('.cell.focused').forEach(item => item.classList.remove('focused'))
      const selector = '.cell[data-paper-id="' + CSS.escape(cell.paperId) + '"][data-construct-id="' + CSS.escape(cell.constructId) + '"]'
      const button = document.querySelector(selector)
      if (!button) return renderProblem('The selected graph node is outside the current matrix filters.')
      button.classList.add('focused')
      button.scrollIntoView({ block: 'center', inline: 'center' })
    }

    function methodText(method) {
      return [
        method.paradigmLabel || method.paradigmSourceTerm,
        method.researchApproach,
        method.analyticalTechnique,
        method.population,
        method.unitOfAnalysis,
      ].filter(Boolean).join(' · ') || 'Not extracted'
    }

    function reviewText(review) {
      return 'origin ' + review.origin +
        ' · researcher approval ' + review.approval.researcher +
        ' · source ' + review.verification.source +
        ' · interpretation ' + review.verification.interpretation +
        ' · classification ' + review.verification.classification
    }

    function cellElement(tag, text) {
      return textElement(tag, text)
    }

    function textElement(tag, text, className) {
      const element = document.createElement(tag)
      element.textContent = String(text)
      if (className) element.className = className
      return element
    }
  </script>
</body>
</html>`
}
