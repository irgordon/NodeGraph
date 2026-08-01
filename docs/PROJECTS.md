# Literature Projects

NodeGraph literature projects organize many existing paper graphs and their source PDFs without changing the paper files. Phase 1 provides the project structure, paper list, metadata search, source checks, safe writes, and rebuildable indexes. Phase 2 adds a shared extraction format, researcher-controlled terms, separate review steps, a synthesis matrix, and CSV export. Phase 3 adds source-backed claims, disagreements grouped by type, study appraisal, explained confidence labels, and a claim ledger that loads details only when needed.

Gap detection, research-question alignment, merge UI, and dissertation planning remain future work.

## Create a project

1. Open the Command Palette.
2. Run `NodeGraph: Create Literature Project`.
3. Choose the project folder.
4. Enter a stable project ID and a title.

NodeGraph creates `project.nodegraph.json` and these folders:

```text
papers/
synthesis/
taxonomy/
extractions/
evidence/
indexes/
audit/
```

The project manifest and records under `synthesis/`, `taxonomy/`, `extractions/`, and `evidence/` are the saved source of truth. `audit/events.jsonl` adds a new line for each recorded action and never rewrites earlier lines.

Files under `indexes/` are working copies made for faster viewing and search. You may delete and rebuild them without losing paper registrations, evidence, or analysis.

## Register a paper

1. Place an existing `.nodegraph.json` file and its source PDF inside the project folder.
2. Make sure the graph's `source.pdf` value points to that PDF relative to the graph file.
3. Run `NodeGraph: Register Project Paper`.
4. Choose the project manifest, graph file, stable paper ID, and stable source ID.

Registration records the graph path, PDF path, current PDF SHA-256 hash, and per-paper extraction path in the manifest. The extraction starts in a clear not-yet-extracted state. The graph remains an independent single-paper file and is not rewritten.

You may move the complete project folder to another drive, account, or computer. Keep the files together and the saved relative paths continue to resolve; NodeGraph does not save the old workspace or home-folder location in the project.

Run `NodeGraph: Unregister Project Paper` to remove a registration. This does not delete the graph or PDF.

## Open and search

Run `NodeGraph: Open Literature Project` and choose `project.nodegraph.json`. Opening reads the manifest and lightweight indexes. It does not open every registered graph.

Run `NodeGraph: Search Project Papers` to search indexed title, author, publication year, DOI, paper ID, and tags. Missing optional metadata does not stop the project from opening.

## Upgrade a Phase 1 project

Project schema `1.0.0` is frozen. Phase 2 uses the additive `1.1.0` schema because the manifest now registers per-paper extraction files and the methodology registry.

Open a `1.0.0` project read-only, then run `NodeGraph: Upgrade Project for Extraction`. The upgrade is explicit and researcher-controlled. NodeGraph validates the complete proposal, creates the extraction and methodology documents, replaces the manifest last, removes disposable indexes, and records the migration in the audit log. A failure before manifest replacement leaves the original project unchanged.

Unsupported versions remain preserved and read-only.

## Upgrade a Phase 2 project for claims

Project schema `1.1.0` remains frozen and usable for Phase 2 work. Phase 3 uses schema `1.2.0` because it adds saved appraisal, claim, and conflict records.

Run `NodeGraph: Upgrade Project for Claims` on a `1.1.0` project. NodeGraph validates the complete Phase 2 project, creates the Phase 3 documents without overwriting the Phase 2 files, replaces the manifest last, removes disposable indexes, and records the migration. A `1.0.0` project must first use the Phase 2 upgrade; migration is never silent on project open.

Phase 3 write commands refuse an unmigrated or unsupported project and explain which upgrade is needed.

## Import standardized extraction

Run `NodeGraph: Import Extraction Proposal` and choose a JSON extraction document for a registered paper. The document contains the common research, method, population, finding, limitation, boundary-condition, and recommendation fields. Original source wording and normalized terms are stored separately.

Agent-created extraction must remain an AI proposal. Findings that use evidence point to saved records in `evidence/records.json`. Invalid extraction is rejected before reference checks or indexing, and an edit based on an old revision cannot overwrite the current extraction.

Reporting states remain distinct. `not-extracted`, `not-reported`, `unclear`, `absent`, and `not-applicable` do not mean the same thing. In particular, a missing extraction is never presented as evidence that a construct or population is absent.

## Review taxonomy and methodology

Run `NodeGraph: Propose Construct` to add a pending construct proposal and `NodeGraph: Review Construct Proposals` to approve or reject it as the researcher. Agents may propose constructs, source-term mappings, and project paradigms but cannot approve them.

Approved aliases resolve to the project's main construct term. A merge accepts only an active, researcher-approved source, keeps the old construct as deprecated, and points it to the approved primary construct. Its former name and aliases are added to the primary without duplicates. Existing references are not rewritten. Possible duplicates are shown for review and are never merged automatically.

The initial methodology registry includes positivist, interpretive, critical, and pragmatist paradigms. Project additions use the same proposal and researcher-review boundary.

## Verify extracted evidence

Run `NodeGraph: Verify Extracted Sources` to choose pending evidence, open the registered PDF at its locator, and confirm or dispute the quotation. The source, interpretation, and classification states are independent. Confirming one never confirms another, and disputing one never clears the others.

Stale hashes, deleted sources, and missing locators remain visible as diagnostics. Every verification write uses the same per-document revision, validation, atomic replacement, and audit path as other authoritative writes.

## Use the synthesis matrix

Run `NodeGraph: Open Synthesis Matrix`. The primary view is papers by approved constructs. Pending mappings and unmapped source terms remain visible; matrix cells show findings, evidence availability, independent verification, and stale state without using Phase 3 labels such as “supports” or “contradicts.”

Filter by paper, construct, paradigm, approach, analytical technique, population, publication year, or verification state. The initial view reads a rebuildable summary and does not load full paper graphs. Opening a cell reads only that paper's extraction detail. When stable node mappings are available, the matrix and an open graph can focus each other; missing or stale targets produce a clear error.

The cell detail shows AI origin and researcher approval separately. A researcher can approve or reject a pending construct mapping and can confirm or dispute its classification without changing source or interpretation verification.

Use the matrix export action to save the current filtered view as UTF-8 CSV. Columns have a fixed order, original and normalized terms are separate, every field is quoted, line breaks and commas are preserved, and spreadsheet formula prefixes are neutralized.

## Create and review synthesis claims

Run `NodeGraph: Import Claim Proposal` to import a claim that follows the saved format. A normal synthesis claim links findings from at least two different papers; use `single-study-proposition` when one study is intentionally represented alone. Every relationship is named, and every finding must lead to exact saved evidence from the same paper.

Agent-created claims remain proposals. Run `NodeGraph: Review Claim Proposals` to approve or reject them as a researcher. For a cross-paradigm claim, the review flow asks for a separate decision and a written reason before approval. The claim ledger offers the same decision without treating the claim itself as approved. Stale or rejected evidence, unapproved constructs, and unresolved cross-paradigm decisions remain visible and block approval. Claim relationship changes and cross-paradigm decisions are revision checked and audited.

## Review conflicts and evidence appraisal

Run `NodeGraph: Review Conflicts` to inspect explicit conflict objects. Conflict types are direct empirical inconsistency, methodological artifact, contextual divergence, or conceptual disagreement. Reclassifying a conflict records a rationale and preserves every dissenting or divergent finding.

Run `NodeGraph: Review Evidence Appraisal` to approve or reject structured per-paper appraisal proposals. The review output and claim detail show the PDF hash and extraction revision used by the appraisal. Appraisal fields retain the source wording and distinguish absent, not reported, unclear, and not assessed. Appraisal approval remains separate from source, interpretation, and classification verification.

Confidence is calculated with the published `nodegraph-evidence-confidence` policy. The result is `not-assessed`, `low`, `moderate`, or `high` and includes the rule inputs, reasons, limitations, and source/revision freshness. Unknown inputs do not lower confidence; missing minimum inputs produce `not-assessed`. A changed source, extraction, appraisal, conflict, or taxonomy state makes the prior result stale until recalculated.

## Use the claim ledger

Run `NodeGraph: Open Claim Ledger`. Rows show each claim's text, type, support, dissent, conflict state, context, confidence, origin, approval, and warnings. AI proposals, disputed classifications, unresolved cross-paradigm decisions, and stale confidence remain visibly distinct from reviewed conclusions.

The initial ledger reads a rebuildable summary and opens no complete paper graph. A current summary is checked with file hashes, so NodeGraph does not load the full evidence collection just to open the ledger. Selecting a claim loads only its related findings, relationship types, paper metadata, exact evidence, methods, appraisals, conflicts, confidence inputs, and revisions. If a source PDF has changed, NodeGraph blocks the old evidence jump and explains that the saved PDF hash no longer matches. Delete `indexes/claims.index.json` to test recovery: NodeGraph rebuilds it from the saved claims, conflicts, appraisals, extractions, and evidence without losing analysis.

## Validate and repair

Run `NodeGraph: Validate Literature Project` to check:

- JSON and schema shape
- IDs and project-relative paths
- missing paper graphs or PDFs
- PDF identity and source replacement
- quotation and evidence hashes
- evidence, finding, claim, gap, and taxonomy references
- index freshness
- missing or truncated audit history

Messages appear in the `NodeGraph Projects` output channel. Each message names the affected file, the broken rule, and what to do next. NodeGraph preserves invalid or stale saved records for review; it does not silently repair them.

Repair the named file or restore the missing source, then validate again. If only an index is missing or stale, run `NodeGraph: Rebuild Project Indexes`.

## Rebuild indexes

The rebuild command performs a deliberate full recovery rebuild. Paper registration and removal use a partial rebuild that reuses entries whose graph hash, source identity, paper path, taxonomy version, and indexer version have not changed.

The paper index is rebuilt from the manifest, registered graph files, authoritative extraction files, and taxonomy registries. The evidence index is rebuilt from `evidence/records.json`. Neither index is an authority. Deleting an index never deletes extraction or evidence.

NodeGraph validates the complete replacement pair before changing either index. If either replacement fails, both earlier valid indexes remain in place. A registration or removal that already changed the authoritative manifest is reported as accepted even if its follow-up index rebuild fails; repair the file problem and run the rebuild command.

## Stale evidence

The manifest binds each source ID to a PDF hash. If the PDF bytes change, validation reports a source hash mismatch and preserves the prior identity for review.

Quotation evidence has separate quotation-content and evidence-object hashes. A mismatch is reported without changing the quotation or evidence record.

## Stale writes

Each authoritative project document owns its own revision. A write includes the revision it was based on. If that revision is no longer current, NodeGraph rejects the complete operation set and leaves the target unchanged.

NodeGraph does not yet include a merge screen. Refresh the document, review the rejected operations, and submit a new mutation against the current revision.

## Compatibility and versions

Existing `.nodegraph.json` files still open, edit, verify against PDFs, and export as before. A graph is never converted simply because it is registered with a project.

The application version is `0.0.0`. The current project persistence schema is independently versioned at `1.2.0`. Schemas `1.0.0` and `1.1.0` remain frozen, with explicit researcher-invoked sequential migrations. Other unsupported project versions open read-only and are never rewritten.
