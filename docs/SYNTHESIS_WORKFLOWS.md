# NodeGraph — Synthesis Workflows

**Status:** v0.5 (Task 0 contract baseline)
**Related documents:** `ARCHITECTURE.md` · `SYNTHESIS_DOMAIN_MODEL.md` · `ROADMAP.md`

This document owns the proposed user- and agent-facing synthesis operations that act on the domain model defined in `SYNTHESIS_DOMAIN_MODEL.md`, within the boundaries defined in `ARCHITECTURE.md`. NodeGraph 0.7.2 already opens and edits single-paper graphs, jumps from quotations to PDFs, and exports single-paper HTML; every synthesis workflow below remains proposed.

---

## 1. Importing Papers

1. User adds a paper `.nodegraph.json` (or a source PDF to be extracted) to `papers/`.
2. `IntegrityService` runs syntactic and structural validation (`ARCHITECTURE.md` §10) before the paper is indexed.
3. Source-document identity is recorded (`sourceId`, `sourceDocumentHash`, `doi`, `title`, `version`) so later replacement of a preprint with a published version is detectable rather than silent.
4. `IndexBuilder` produces a summary-index entry for the paper.

## 2. Extraction

1. Agent (or researcher) populates the standardized extraction fields (`SYNTHESIS_DOMAIN_MODEL.md` §2–3) from the paper's existing nodes and quotations.
2. Every extracted finding is linked to source evidence via the provenance object (`ARCHITECTURE.md` §8) — `evidenceId`, `quoteContentHash`, `sourceDocumentHash`, and `locator`.
3. Extraction output starts with `reviewState.origin: "ai"` and `reviewState.verification.source: "pending"`.

## 3. Construct Normalization

1. Agent proposes a mapping from a paper's source term to the project's construct taxonomy (`SYNTHESIS_DOMAIN_MODEL.md` §4), or proposes a new taxonomy entry.
2. `TaxonomyService` checks the proposal against existing approved entries; near-duplicates are surfaced for merge rather than silently accepted.
3. A new taxonomy entry sits in a pending-merge queue until a researcher approves it. Only then can it be used elsewhere in synthesis.

## 4. Verification

1. Researcher opens the **source-verification queue**: extracted quotations awaiting confirmation against the original PDF.
2. Confirming a quotation sets `reviewState.verification.source: "verified"`.
3. Confirming a paper-level interpretation sets `reviewState.verification.interpretation: "verified"` independently — one does not imply the other (`SYNTHESIS_DOMAIN_MODEL.md` §12).
4. Disputing a classification sets `reviewState.verification.classification: "disputed"` without blocking the other two dimensions.

## 5. Synthesis

1. Researcher (or agent proposal) creates a synthesis claim linking two or more paper-level findings.
2. `IntegrityService` domain validation checks that the claim references at least two distinct paper-level findings unless it is explicitly classified as a single-study proposition. Validation also requires complete, non-stale evidence chains and an explicit review decision when the claim crosses methodological paradigms. Passing validation does not itself change `reviewState.origin: "ai"` or grant approval.
3. Conflicting findings are captured as conflict objects with an explicit `conflictType` (`SYNTHESIS_DOMAIN_MODEL.md` §6) — never inferred silently from co-occurrence in the matrix.
4. Cross-paradigm synthesis (mixing incommensurable methodological paradigms into one claim) is flagged for explicit researcher decision rather than merged automatically.

## 6. Conflict Review

1. Researcher opens a conflict object, reviews `possibleExplanations` and `conflictType`.
2. Researcher may reclassify `conflictType`, add explanations, verify the classification, or approve the conflict through `ReviewStateService`.
3. Reclassification is recorded as an audit event (`ARCHITECTURE.md` §18, `conflict reclassified`).

## 7. Adversarial Gap Testing

Formalized as a required, separately-invoked pass — not a soft prompting suggestion:

> **Adversarial pass.** When evaluating a candidate gap, the agent runs a pass constrained as follows: *"Assume the proposed research gap IS ALREADY FILLED. Identify any extracted node across all project papers that provides partial or complete empirical coverage of it."* The pass output (covering nodes found, or none found) is stored against the candidate gap object and shown alongside it.

**Rule:** a candidate gap cannot set `reviewState.approval.researcher: "approved"` without at least one recorded adversarial-pass result (Core Invariant 10, `ARCHITECTURE.md` §4). A result of `no-coverage-identified` means only that no contrary evidence was found in the recorded project corpus under the recorded taxonomy, prompt, and agent versions. It is not proof that the gap exists.

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

1. Any object proposed by an agent (construct mapping, synthesis claim, conflict type, candidate gap, evidence relationship) is visible in a review queue.
2. Approval is a human action or a `ReviewStateService` transition — never an agent-writable field (Core Invariant 8, `ARCHITECTURE.md` §4, §12).
3. Approval events are recorded in the audit log with before/after object hashes.

## 9. Dissertation Planning

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

- APA evidence matrix
- Synthesis matrix (CSV / Excel)
- Claim ledger
- Thematic outline
- Research-gap evidence report (including adversarial-pass results, §7)
- Research-question alignment table
- Methodology comparison table
- Population coverage table
- Source-verification report
- BibTeX / RIS references
- Appendix-ready audit trail

The existing 0.7.2 HTML exporter (graph + images, standalone viewer) is retained unchanged for sharing/viewing. Every structured synthesis export listed above remains proposed and is outside Task 0. Future exported content passes through the same sanitization boundary as the webview (`ARCHITECTURE.md` §15) — no unescaped agent-authored HTML in exports.
