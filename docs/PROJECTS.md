# Literature Projects

NodeGraph literature projects organize many existing paper graphs and their source PDFs without changing the paper files. Phase 1 provides the project structure, paper list, metadata search, source checks, safe writes, and rebuildable indexes. Phase 2 adds one authoritative standardized extraction per paper, governed construct and methodology registries, independent verification, a lazy synthesis matrix, and CSV matrix export.

Claims, conflict analysis, gap detection, research-question alignment, merge UI, and dissertation planning remain future work.

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

The project manifest and records under `synthesis/`, `taxonomy/`, `extractions/`, and `evidence/` are authoritative. `audit/events.jsonl` is the append-only operational record.

Files under `indexes/` are derived. You may delete them and rebuild them without losing paper registrations, evidence, or analysis.

## Register a paper

1. Place an existing `.nodegraph.json` file and its source PDF inside the project folder.
2. Make sure the graph's `source.pdf` value points to that PDF relative to the graph file.
3. Run `NodeGraph: Register Project Paper`.
4. Choose the project manifest, graph file, stable paper ID, and stable source ID.

Registration records the graph path, PDF path, current PDF SHA-256 hash, and per-paper extraction path in the manifest. The extraction starts in a clear not-yet-extracted state. The graph remains an independent single-paper file and is not rewritten.

Run `NodeGraph: Unregister Project Paper` to remove a registration. This does not delete the graph or PDF.

## Open and search

Run `NodeGraph: Open Literature Project` and choose `project.nodegraph.json`. Opening reads the manifest and lightweight indexes. It does not open every registered graph.

Run `NodeGraph: Search Project Papers` to search indexed title, author, publication year, DOI, paper ID, and tags. Missing optional metadata does not stop the project from opening.

## Upgrade a Phase 1 project

Project schema `1.0.0` is frozen. Phase 2 uses the additive `1.1.0` schema because the manifest now registers per-paper extraction files and the methodology registry.

Open a `1.0.0` project read-only, then run `NodeGraph: Upgrade Project for Extraction`. The upgrade is explicit and researcher-controlled. NodeGraph validates the complete proposal, creates the extraction and methodology documents, replaces the manifest last, removes disposable indexes, and records the migration in the audit log. A failure before manifest replacement leaves the original project unchanged.

Unsupported versions remain preserved and read-only.

## Import standardized extraction

Run `NodeGraph: Import Extraction Proposal` and choose a JSON extraction document for a registered paper. The document contains the common research, method, population, finding, limitation, boundary-condition, and recommendation fields. Original source wording and normalized terms are stored separately.

Agent-created extraction must remain an AI proposal. Evidence-bearing findings point to IDs in authoritative `evidence/records.json`. Invalid extraction is rejected before reference checks or indexing, and a stale document revision cannot overwrite the current extraction.

Reporting states remain distinct. `not-extracted`, `not-reported`, `unclear`, `absent`, and `not-applicable` do not mean the same thing. In particular, a missing extraction is never presented as evidence that a construct or population is absent.

## Review taxonomy and methodology

Run `NodeGraph: Propose Construct` to add a pending construct proposal and `NodeGraph: Review Construct Proposals` to approve or reject it as the researcher. Agents may propose constructs, source-term mappings, and project paradigms but cannot approve them.

Approved aliases resolve to their canonical construct. A merge accepts only an active, researcher-approved source, retains that construct as deprecated, and points it directly to the approved primary. Its former canonical term and aliases are normalized and added to the primary without duplicates. Existing references are not rewritten. Duplicate candidates are shown for review and are never merged automatically.

The initial methodology registry includes positivist, interpretive, critical, and pragmatist paradigms. Project additions use the same proposal and researcher-review boundary.

## Verify extracted evidence

Run `NodeGraph: Verify Extracted Sources` to choose pending evidence, open the registered PDF at its locator, and confirm or dispute the quotation. The source, interpretation, and classification states are independent. Confirming one never confirms another, and disputing one never clears the others.

Stale hashes, deleted sources, and missing locators remain visible as diagnostics. Every verification write uses the same per-document revision, validation, atomic replacement, and audit path as other authoritative writes.

## Use the synthesis matrix

Run `NodeGraph: Open Synthesis Matrix`. The primary view is papers by approved constructs. Pending mappings and unmapped source terms remain visible; matrix cells show findings, evidence availability, independent verification, and stale state without using Phase 3 labels such as “supports” or “contradicts.”

Filter by paper, construct, paradigm, approach, analytical technique, population, publication year, or verification state. The initial view reads the derived summary index and does not hydrate full paper graphs. Opening a cell reads only that paper's extraction detail. When stable node mappings are available, matrix and open graph selection can focus each other; missing or stale targets produce a diagnostic.

The cell detail shows AI origin and researcher approval separately. A researcher can approve or reject a pending construct mapping and can confirm or dispute its classification without changing source or interpretation verification.

Use the matrix export action to save the current filtered view as UTF-8 CSV. Columns have a fixed order, original and normalized terms are separate, every field is quoted, line breaks and commas are preserved, and spreadsheet formula prefixes are neutralized.

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

Diagnostics appear in the `NodeGraph Projects` output channel. Each diagnostic names the affected file, rule, and corrective action. NodeGraph preserves invalid or stale authoritative records for review; it does not silently repair them.

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

The application version is `0.0.0`. The current project persistence schema is independently versioned at `1.1.0`. Schema `1.0.0` remains readable and has one explicit researcher-invoked migration. Other unsupported project versions open read-only and are never rewritten.
