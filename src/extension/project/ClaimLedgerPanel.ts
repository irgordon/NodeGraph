import * as path from 'path'
import * as vscode from 'vscode'
import { getNonce } from '../nonce'
import { PdfViewerPanel } from '../PdfViewerPanel'
import { Phase3MutationOutcome, Phase3ProjectService } from './Phase3ProjectService'

type LedgerMessage =
  | { type: 'ready' }
  | { type: 'openClaim'; claimId: string }
  | { type: 'openEvidence'; evidenceId: string }
  | { type: 'reviewClaim'; claimId: string; decision: 'approved' | 'rejected' }
  | { type: 'decideParadigm'; claimId: string; decision: 'approved' | 'rejected' }
  | { type: 'recalculateConfidence'; claimId: string }

export class ClaimLedgerPanel {
  private static readonly panels = new Map<string, ClaimLedgerPanel>()

  public static open(
    context: vscode.ExtensionContext,
    service: Phase3ProjectService,
    manifestPath: string
  ): void {
    const key = path.resolve(manifestPath)
    const existing = ClaimLedgerPanel.panels.get(key)
    if (existing) return existing.reveal()
    const panel = createPanel(context)
    const ledger = new ClaimLedgerPanel(context, service, key, panel)
    ClaimLedgerPanel.panels.set(key, ledger)
    ledger.register()
  }

  private constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly service: Phase3ProjectService,
    private readonly manifestPath: string,
    private readonly panel: vscode.WebviewPanel
  ) {}

  private reveal(): void {
    this.panel.reveal(vscode.ViewColumn.One, false)
    void this.refresh().catch(error => this.postProblem(errorMessage(error)))
  }

  private register(): void {
    this.panel.webview.html = ledgerHtml(this.panel.webview)
    const messages = this.panel.webview.onDidReceiveMessage(message =>
      this.handleMessage(message))
    this.panel.onDidDispose(() => {
      messages.dispose()
      ClaimLedgerPanel.panels.delete(this.manifestPath)
    })
  }

  private async handleMessage(value: unknown): Promise<void> {
    const message = parseMessage(value)
    if (!message) return this.postProblem('The claim-ledger request was invalid.')
    try {
      if (message.type === 'ready') await this.refresh()
      if (message.type === 'openClaim') await this.openClaim(message.claimId)
      if (message.type === 'openEvidence') await this.openEvidence(message.evidenceId)
      if (message.type === 'reviewClaim') await this.reviewClaim(message)
      if (message.type === 'decideParadigm') await this.decideParadigm(message)
      if (message.type === 'recalculateConfidence') {
        await this.recalculateConfidence(message.claimId)
      }
    } catch (error) {
      this.postProblem(errorMessage(error))
    }
  }

  private async refresh(): Promise<void> {
    const opened = await this.service.openLedger(this.manifestPath)
    this.panel.webview.postMessage({
      type: 'ledger',
      ledger: opened.ledger,
      diagnostics: opened.diagnostics,
      hydrationCount: opened.hydrationCount,
    })
  }

  private async openClaim(claimId: string): Promise<void> {
    const detail = await this.service.hydrateClaim(this.manifestPath, claimId)
    if (!detail) return this.postProblem('The selected claim is missing or invalid.')
    this.panel.webview.postMessage({ type: 'detail', detail })
  }

  private async openEvidence(evidenceId: string): Promise<void> {
    const target = await this.service.sourceNavigation(this.manifestPath, evidenceId)
    if (!target.sourcePath || !target.quote) {
      return this.postProblem(diagnosticProblem(
        'The source PDF or exact quotation is unavailable',
        target.diagnostics
      ))
    }
    await PdfViewerPanel.openAndSearch(
      this.context,
      vscode.Uri.file(target.sourcePath),
      target.quote,
      target.page
    )
  }

  private async reviewClaim(
    message: Extract<LedgerMessage, { type: 'reviewClaim' }>
  ): Promise<void> {
    const outcome = await this.service.reviewClaim(
      this.manifestPath,
      message.claimId,
      message.decision
    )
    if (!outcome.mutation.accepted) {
      return this.postProblem(outcomeProblem('Claim review rejected', outcome))
    }
    await this.refresh()
    await this.openClaim(message.claimId)
  }

  private async decideParadigm(
    message: Extract<LedgerMessage, { type: 'decideParadigm' }>
  ): Promise<void> {
    const rationale = await vscode.window.showInputBox({
      prompt: 'Explain the cross-paradigm decision',
      validateInput: value => value.trim() ? undefined : 'Enter a researcher rationale.',
    })
    if (!rationale?.trim()) return
    const outcome = await this.service.decideParadigm(
      this.manifestPath,
      message.claimId,
      message.decision,
      rationale.trim()
    )
    if (!outcome.mutation.accepted) {
      return this.postProblem(outcomeProblem('Cross-paradigm decision rejected', outcome))
    }
    await this.refresh()
    await this.openClaim(message.claimId)
  }

  private async recalculateConfidence(claimId: string): Promise<void> {
    const outcome = await this.service.recalculateConfidence(
      this.manifestPath,
      claimId
    )
    if (!outcome.mutation.accepted) {
      return this.postProblem(outcomeProblem('Confidence calculation rejected', outcome))
    }
    await this.refresh()
    await this.openClaim(claimId)
  }

  private postProblem(message: string): void {
    this.panel.webview.postMessage({ type: 'problem', message })
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function outcomeProblem(prefix: string, outcome: Phase3MutationOutcome): string {
  const detail = outcome.diagnostics[0]
  return detail
    ? `${prefix}: ${detail.rule} ${detail.action}`
    : `${prefix}: ${outcome.mutation.accepted ? 'unknown error' : outcome.mutation.code}`
}

function diagnosticProblem(
  prefix: string,
  diagnostics: Array<{ rule: string; action: string }>
): string {
  const detail = diagnostics[0]
  return detail ? `${prefix}: ${detail.rule} ${detail.action}` : `${prefix}.`
}

function createPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
  const panel = vscode.window.createWebviewPanel(
    'nodegraph.claimLedger',
    'NodeGraph Claim Ledger',
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true }
  )
  panel.iconPath = vscode.Uri.joinPath(context.extensionUri, 'resources', 'icon-hires.png')
  return panel
}

function parseMessage(value: unknown): LedgerMessage | undefined {
  if (!value || typeof value !== 'object' || !('type' in value)) return undefined
  const message = value as Record<string, unknown>
  if (message.type === 'ready') return { type: 'ready' }
  if (message.type === 'openClaim' && typeof message.claimId === 'string') {
    return { type: 'openClaim', claimId: message.claimId }
  }
  if (message.type === 'openEvidence' && typeof message.evidenceId === 'string') {
    return { type: 'openEvidence', evidenceId: message.evidenceId }
  }
  if (message.type === 'recalculateConfidence' && typeof message.claimId === 'string') {
    return { type: 'recalculateConfidence', claimId: message.claimId }
  }
  if (
    message.type === 'decideParadigm' &&
    typeof message.claimId === 'string' &&
    (message.decision === 'approved' || message.decision === 'rejected')
  ) {
    return { type: 'decideParadigm', claimId: message.claimId, decision: message.decision }
  }
  if (
    message.type === 'reviewClaim' &&
    typeof message.claimId === 'string' &&
    (message.decision === 'approved' || message.decision === 'rejected')
  ) {
    return { type: 'reviewClaim', claimId: message.claimId, decision: message.decision }
  }
  return undefined
}

function ledgerHtml(webview: vscode.Webview): string {
  const nonce = getNonce()
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NodeGraph Claim Ledger</title>
  <style nonce="${nonce}">
    * { box-sizing: border-box; }
    body { margin: 0; color: var(--vscode-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family); }
    main { display: grid; grid-template-columns: minmax(0, 1fr) 390px; height: 100vh; }
    section, aside { overflow: auto; }
    aside { padding: 14px; border-left: 1px solid var(--vscode-panel-border); }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid var(--vscode-panel-border); vertical-align: top; }
    button { color: inherit; background: var(--vscode-button-secondaryBackground); border: 0; padding: 6px 8px; margin: 2px; cursor: pointer; }
    .warning { color: var(--vscode-editorWarning-foreground); }
    .error { color: var(--vscode-editorError-foreground); }
    .subtle { color: var(--vscode-descriptionForeground); }
    article { padding: 8px 0; border-bottom: 1px solid var(--vscode-panel-border); white-space: pre-wrap; }
    @media (max-width: 850px) { main { grid-template-columns: 1fr; } aside { display: none; } }
  </style>
</head>
<body>
  <main><section><div id="status"></div><table id="ledger"></table></section><aside id="detail">Select a claim.</aside></main>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi()
    window.addEventListener('message', event => receive(event.data))
    vscode.postMessage({ type: 'ready' })

    function receive(message) {
      if (message.type === 'ledger') renderLedger(message)
      if (message.type === 'detail') renderDetail(message.detail)
      if (message.type === 'problem') setStatus(message.message, 'error')
    }

    function renderLedger(message) {
      const table = document.getElementById('ledger')
      table.replaceChildren()
      if (!message.ledger) return setStatus(diagnosticText(message.diagnostics), 'error')
      const head = row(['Claim', 'Relationships', 'Conflict', 'Confidence', 'Review'])
      table.appendChild(head)
      message.ledger.entries.forEach(entry => table.appendChild(entryRow(entry)))
      setStatus(message.ledger.entries.length + ' claims · graph hydration ' + message.hydrationCount)
    }

    function entryRow(entry) {
      const tr = document.createElement('tr')
      const claim = document.createElement('td')
      claim.appendChild(action(entry.text, () => post('openClaim', { claimId: entry.claimId })))
      claim.appendChild(text('div', entry.claimType + ' · origin ' + entry.origin, 'subtle'))
      tr.appendChild(claim)
      tr.appendChild(text('td', entry.supportingPaperIds.length + ' supporting · ' + entry.dissentingPaperIds.length + ' dissenting'))
      tr.appendChild(text('td', entry.conflictTypes.join(', ') || 'none'))
      const confidence = text('td', entry.confidenceLabel)
      if (entry.confidenceStale) confidence.appendChild(text('div', 'stale', 'error'))
      tr.appendChild(confidence)
      const review = text('td', entry.reviewState.approval.researcher)
      if (entry.warnings.length) review.appendChild(text('div', entry.warnings.join(', '), 'warning'))
      tr.appendChild(review)
      return tr
    }

    function renderDetail(detail) {
      const panel = document.getElementById('detail')
      panel.replaceChildren()
      panel.appendChild(text('h2', detail.claim.text))
      panel.appendChild(text('p', reviewText(detail.claim.reviewState), 'subtle'))
      panel.appendChild(text('p', paradigmText(detail.claim.paradigmDecision), 'warning'))
      if (detail.claim.paradigmDecision.required) {
        panel.appendChild(action('Approve cross-paradigm synthesis', () => post('decideParadigm', { claimId: detail.claim.claimId, decision: 'approved' })))
        panel.appendChild(action('Reject cross-paradigm synthesis', () => post('decideParadigm', { claimId: detail.claim.claimId, decision: 'rejected' })))
      }
      panel.appendChild(action('Approve claim', () => post('reviewClaim', { claimId: detail.claim.claimId, decision: 'approved' })))
      panel.appendChild(action('Reject claim', () => post('reviewClaim', { claimId: detail.claim.claimId, decision: 'rejected' })))
      panel.appendChild(action('Recalculate confidence', () => post('recalculateConfidence', { claimId: detail.claim.claimId })))
      panel.appendChild(text('h3', 'Confidence'))
      panel.appendChild(text('article', confidenceText(detail.claim.confidence)))
      panel.appendChild(text('h3', 'Findings and exact evidence'))
      detail.findings.forEach(item => panel.appendChild(finding(item)))
      panel.appendChild(text('h3', 'Conflicts and context'))
      detail.conflicts.forEach(item => panel.appendChild(text('article', conflictText(item))))
      panel.appendChild(text('h3', 'Evidence appraisals'))
      detail.appraisals.forEach(item => panel.appendChild(text('article', appraisalText(item))))
      if (detail.diagnostics.length) {
        panel.appendChild(text('h3', 'Integrity and provenance warnings'))
        panel.appendChild(text('article', diagnosticText(detail.diagnostics), 'warning'))
      }
      panel.appendChild(text('h3', 'Current document revisions'))
      panel.appendChild(text('article', JSON.stringify(detail.revisions, null, 2)))
    }

    function finding(item) {
      const article = text('article', item.paperTitle + '\\n' + item.finding.sourceText)
      article.appendChild(text('div', 'Relationship: ' + item.relationship, 'subtle'))
      article.appendChild(text('div', 'DOI: ' + (item.paperMetadata.doi || 'not reported'), 'subtle'))
      article.appendChild(text('div', 'Population: ' + reportedText(item.population), 'subtle'))
      article.appendChild(text('div', 'Setting: ' + reportedText(item.setting), 'subtle'))
      article.appendChild(text('div', 'Paradigm: ' + (item.methodology.methodologicalParadigm.paradigmId || 'not reported'), 'subtle'))
      article.appendChild(text('div', 'Approach: ' + (item.methodology.researchApproach.normalizedValue || item.methodology.researchApproach.sourceTerm || 'not reported'), 'subtle'))
      article.appendChild(text('div', 'Technique: ' + (item.methodology.analyticalTechnique.normalizedValue || item.methodology.analyticalTechnique.sourceTerm || 'not reported'), 'subtle'))
      item.evidence.forEach(evidence => {
        article.appendChild(text('blockquote', evidence.quote.text))
        article.appendChild(action('Open source PDF, p. ' + evidence.locator.page, () => post('openEvidence', { evidenceId: evidence.evidenceId })))
      })
      return article
    }

    function confidenceText(confidence) {
      if (!confidence) return 'not-assessed · no explanation has been calculated'
      return confidence.label + ' · ' + confidence.policyId + ' ' + confidence.policyVersion + '\\n' +
        confidence.reasons.join(' ') + '\\nLimitations: ' + confidence.limitations.join(' ') +
        '\\nInputs: ' + JSON.stringify(confidence.inputs) +
        '\\nFreshness: ' + JSON.stringify(confidence.freshness) +
        '\\nCalculated: ' + confidence.calculatedAt +
        (confidence.stale ? '\\nStale: ' + confidence.staleReasons.join(', ') : '')
    }

    function conflictText(conflict) {
      return conflict.conflictType + ' · ' + reviewText(conflict.reviewState) + '\\n' +
        conflict.findingRefs.map(ref => ref.relationship + ': ' + ref.paperId + '/' + ref.findingId).join('\\n') + '\\n' +
        conflict.contextComparisons.map(item => item.dimension + ': ' + item.result + ' (not causal)').join('\\n') + '\\n' +
        conflict.possibleExplanations.map(item => 'Possible explanation: ' + item.text + ' · ' + reviewText(item.reviewState)).join('\\n')
    }

    function reviewText(review) {
      return 'origin ' + review.origin + ' · researcher ' + review.approval.researcher +
        ' · source ' + review.verification.source + ' · interpretation ' + review.verification.interpretation +
        ' · classification ' + review.verification.classification
    }

    function paradigmText(decision) {
      if (!decision.required) return 'Cross-paradigm decision: not required'
      return 'Cross-paradigm decision: ' + decision.status +
        (decision.rationale ? ' · ' + decision.rationale : '')
    }

    function appraisalText(appraisal) {
      const fields = Object.entries(appraisal.fields).map(([name, field]) =>
        name + ': ' + field.status +
        (field.sourceText ? ' · source: ' + field.sourceText : '') +
        (field.normalizedValue ? ' · normalized: ' + field.normalizedValue : ''))
      return appraisal.paperId + ' · ' + reviewText(appraisal.reviewState) +
        '\\nSource hash: ' + appraisal.sourceDocumentHash +
        '\\nExtraction revision: ' + appraisal.extractionRevision +
        '\\n' + fields.join('\\n')
    }

    function reportedText(field) {
      return field.normalizedValue || field.sourceText || field.reportingStatus
    }

    function diagnosticText(diagnostics) {
      if (!Array.isArray(diagnostics) || !diagnostics.length) return 'The ledger could not be rebuilt.'
      return diagnostics.map(item => item.rule + ' ' + item.action).join('\\n')
    }

    function row(values) {
      const tr = document.createElement('tr')
      values.forEach(value => tr.appendChild(text('th', value)))
      return tr
    }

    function action(label, callback) {
      const button = text('button', label)
      button.addEventListener('click', callback)
      return button
    }

    function text(tag, value, className) {
      const element = document.createElement(tag)
      element.textContent = String(value)
      if (className) element.className = className
      return element
    }

    function post(type, payload) { vscode.postMessage({ type, ...payload }) }
    function setStatus(value, className) {
      const status = document.getElementById('status')
      status.textContent = value
      status.className = className || ''
    }
  </script>
</body>
</html>`
}
