# NodeGraph — Synthesis Workflows

**Status:** v0.7 (Phase 3 claims and claim-ledger baseline)
**Related documents:** `ARCHITECTURE.md` · `SYNTHESIS_DOMAIN_MODEL.md` · `ROADMAP.md`

This document owns the user- and agent-facing synthesis operations that act on the domain model defined in `SYNTHESIS_DOMAIN_MODEL.md`, within the boundaries defined in `ARCHITECTURE.md`. The 0.0.0 development baseline preserves single-paper editing, PDF quote checks, and HTML export; implements the Phase 1 project foundation and Phase 2 extraction/matrix workflows; and implements the Phase 3 claim, conflict, appraisal, confidence, and claim-ledger workflows below. Gap testing and dissertation planning remain planned for Phases 4–5.

---

## 1. Importing Papers

1. User adds a paper `.nodegraph.json` (or a source PDF to be extracted) to `papers/`.
2. `IntegrityService` runs syntactic and structural validation (`ARCHITECTURE.md` §10) before the paper is indexed.
3. Source-document identity is recorded (`sourceId`, `sourceDocumentHash`, `doi`, `title`, `version`) so later replacement of a preprint with a published version is detectable rather than silent.
4. `IndexBuilder` produces a summary-index entry for the paper.

## 2. Extraction

1. Agent (or researcher) prepares a per-paper extraction document containing the standardized fields (`SYNTHESIS_DOMAIN_MODEL.md` §2–3).
2. Every extracted finding is linked to source evidence via the provenance object (`ARCHITECTURE.md` §8) — `evidenceId`, `quoteContentHash`, `sourceDocumentHash`, and `locator`.
3. Agent output starts with `reviewState.origin: "ai"`, researcher approval not reviewed, and source verification pending.
4. `ExtractionService` validates the complete proposal before cross-document checks and writes it through the revision-checked mutation boundary.
5. Original source wording remains beside normalized values. `not-extracted`, `not-reported`, `unclear`, `absent`, and `not-applicable` remain distinct.

## 3. Construct Normalization

1. Agent proposes a mapping from a paper's source term to the project's construct taxonomy (`SYNTHESIS_DOMAIN_MODEL.md` §4), or proposes a new taxonomy entry.
2. `TaxonomyService` checks the proposal against existing approved entries; near-duplicates are surfaced for merge rather than silently accepted.
3. A new taxonomy entry remains pending until a researcher approves it. Only then can it be used as an approved mapping.
4. Construct merges accept only active, researcher-approved source and primary constructs. They preserve the old identifier as deprecated, resolve it directly to the approved primary, and add the old canonical term and aliases to the primary after normalization and deduplication. Historical references are not rewritten.
5. The methodology registry uses the same agent-proposal and researcher-approval boundary.

## 4. Verification

1. Researcher opens the **source-verification queue**: extracted quotations awaiting confirmation against the original PDF.
2. Confirming a quotation sets `reviewState.verification.source: "verified"`.
3. Confirming a paper-level interpretation sets `reviewState.verification.interpretation: "verified"` independently — one does not imply the other (`SYNTHESIS_DOMAIN_MODEL.md` §12).
4. Disputing a classification sets `reviewState.verification.classification: "disputed"` without blocking the other two dimensions.
5. Every verification change is revision checked, schema validated, atomically replaced, and audited.
6. Missing or stale evidence remains in the queue with an actionable diagnostic.

PDF locations in this workflow remain project-relative. Opening or moving the complete project does not rewrite evidence records with a local workspace or home-folder path.

## 4A. Synthesis Matrix

1. `IndexBuilder` summarizes paper metadata, extraction revision, taxonomy version, approved and pending mappings, methods, population, findings, evidence, verification, and staleness.
2. The matrix opens from that rebuildable summary without loading complete paper graphs.
3. Filters use the same normalization as index construction.
4. Opening one cell reads only the selected paper's extraction detail.
5. A stable paper-node mapping may synchronize an open graph with the matching matrix cell. Missing editors, sources, nodes, or locators fail visibly.
6. Cells expose extracted findings and verification state. They do not classify evidence as support, contradiction, qualification, or conflict.

## 5. Synthesis

1. Researcher (or agent proposal) creates a synthesis claim linking two or more paper-level findings.
2. `CrossDocumentValidator` checks that a normal claim references findings from at least two distinct papers. A one-paper claim must be explicitly typed `single-study-proposition`. Every finding and evidence ID must resolve, and evidence must belong to the finding's paper.
3. Conflicting findings are captured as conflict objects with an explicit `conflictType` (`SYNTHESIS_DOMAIN_MODEL.md` §6) — never inferred silently from co-occurrence in the matrix.
4. Stale or rejected evidence remains visible. It may remain on an unapproved proposal with a warning, but it blocks researcher approval until the evidence chain is current.
5. Cross-paradigm synthesis is flagged for an explicit researcher decision and rationale rather than merged automatically.
6. Claim proposals, reviews, relationship additions/removals/reclassifications, and paradigm decisions use the claim document's current revision and append audit events.

## 6. Conflict Review

1. Researcher opens a conflict object, reviews `possibleExplanations` and `conflictType`.
2. Researcher may reclassify `conflictType`, add or review explanations, verify the classification, or approve the conflict through `ReviewStateService`.
3. Reclassification records the old and new type and never removes supporting, dissenting, qualifying, or methodologically divergent finding references.
4. Context comparisons may be attached as possible explanations, but they never assert causation or set `conflictType` automatically.
5. Conflict proposals, explanation changes, reviews, and reclassifications are revision checked and audited.

## 6A. Evidence Appraisal and Confidence

1. An agent or researcher records one structured per-paper appraisal bound to the current source hash and extraction revision. Source language remains beside normalized values.
2. Agent records begin as proposals. A researcher separately approves or rejects the appraisal; that decision does not change evidence source verification.
3. The researcher explicitly requests confidence calculation for a claim. `ConfidenceService` applies policy `nodegraph-evidence-confidence` version `1.0.0` without an AI call.
4. The stored result exposes every input, reason, limitation, freshness value, and label. Missing minimum inputs yield `not-assessed`; unknown data is not scored as weak.
5. A changed source, extraction, appraisal, conflict, or taxonomy revision makes the prior result visibly stale. Recalculation is explicit and audited when it changes the claim document.

## 6B. Claim Ledger

1. The researcher runs **NodeGraph: Open Claim Ledger**.
2. The ledger opens from a rebuildable index of claim, conflict, appraisal, extraction, and source revision summaries. A current index is checked with file hashes and reads no complete paper graph or exact evidence record.
3. A row keeps claim type, support, dissent, conflict status, context, confidence, origin, approval, and integrity warnings visible.
4. Selecting a claim loads only its finding relationships, referenced extraction documents, paper metadata, exact evidence, appraisal inputs, conflict explanations, confidence details, and saved revisions.
5. A missing, invalid, deleted, or stale ledger index is rebuilt from the saved source records. Deleting it cannot delete a claim, conflict, appraisal, or confidence explanation.

## 7. Adversarial Gap Testing *(planned for Phase 4)*

Formalized as a required, separately-invoked pass — not a soft prompting suggestion:

> **Adversarial pass.** When evaluating a candidate gap, the agent runs a pass constrained as follows: *"Assume the proposed research gap IS ALREADY FILLED. Identify any extracted node across all project papers that provides partial or complete empirical coverage of it."* The pass output (covering nodes found, or none found) is stored against the candidate gap object and shown alongside it.

**Rule:** a candidate gap cannot set `reviewState.approval.researcher: "approved"` without at least one recorded adversarial-pass result (Core Invariant 10, `ARCHITECTURE.md` §4). A result of `no-coverage-identified` means only that no contrary evidence was found in the recorded project corpus under the recorded taxonomy, prompt, and agent versions. It is not proof that the gap exists.

The pass records stable paper, finding, and evidence IDs plus project-relative document references. `corpusRevision` is calculated from sorted project-relative authoritative document paths and revisions with the taxonomy version. It never records an absolute PDF, workspace, home-folder, or temporary path, so another researcher can reproduce the corpus identity after moving the project.

```json
{
  "adversarialPassId": "adversarial_014",
  "gapId": "gap_014",
  "corpusRevision": "sha256:...",
  "taxonomyVersion": 12,
  "executedBy": {
    "type": "agent",
    "id": "provider/model",
    "version": "model-version"
  },
  "promptVersion": "gap-redteam-1.0",
  "executedAt": "2026-07-30T00:00:00-04:00",
  "candidateCoverage": [],
  "result": "no-coverage-identified"
}
```

Example surfaced output:
```
"You claim mixed military cybersecurity teams are understudied.
Three papers appear potentially relevant. Review them before
treating the gap as established."
```

## 8. Researcher Approval

1. Any object proposed by an agent (construct mapping, synthesis claim, conflict type or explanation, evidence appraisal, candidate gap, evidence relationship) is visible in a review queue.
2. Approval is a human action or a `ReviewStateService` transition — never an agent-writable field (Core Invariant 8, `ARCHITECTURE.md` §4, §12).
3. Approval events are recorded in the audit log with before/after object hashes.

## 9. Dissertation Planning *(planned for Phase 5)*

1. Researcher selects approved claims from the claim ledger for a section.
2. Section-planning mode arranges them into a scaffold:

```
Section thesis
   |
   v
Established finding
   |
   v
Supporting evidence
   |
   v
Contradictory evidence
   |
   v
Boundary condition
   |
   v
Unresolved issue
   |
   v
Transition to next section
```

3. Output is an evidence-backed outline. NodeGraph does not generate finished dissertation prose as a primary function — the researcher writes from the outline.

## 10. Exports

Phase 2 implements synthesis-matrix CSV export for either the current filtered view or the full view selected in the matrix. The exporter uses stable columns, includes traceable paper, construct, extraction, finding, and evidence identifiers, keeps source and normalized terms separate, fully quotes UTF-8 cells, preserves commas and line breaks, and neutralizes spreadsheet-formula prefixes. It streams rows from summary entries instead of hydrating the full corpus.

The following exports remain planned:

- APA evidence matrix
- Synthesis matrix (Excel)
- Claim ledger export
- Thematic outline
- Research-gap evidence report (including adversarial-pass results, §7)
- Research-question alignment table
- Methodology comparison table
- Population coverage table
- Source-verification report
- BibTeX / RIS references
- Appendix-ready audit trail

The existing 0.7.2 HTML exporter (graph + images, standalone viewer) is retained unchanged for sharing/viewing. Planned exported content passes through the same sanitization boundary as the webview (`ARCHITECTURE.md` §15) — no unescaped agent-authored HTML in exports.
