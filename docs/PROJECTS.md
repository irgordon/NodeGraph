# Literature Projects

NodeGraph literature projects organize many existing paper graphs and their source PDFs without changing the paper files. Phase 1 provides the project structure, paper list, metadata search, source checks, safe writes, and rebuildable indexes.

It does not add a synthesis matrix or later research workflows.

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
evidence/
indexes/
audit/
```

The project manifest and records under `synthesis/`, `taxonomy/`, and `evidence/` are authoritative. `audit/events.jsonl` is the append-only operational record.

Files under `indexes/` are derived. You may delete them and rebuild them without losing paper registrations, evidence, or analysis.

## Register a paper

1. Place an existing `.nodegraph.json` file and its source PDF inside the project folder.
2. Make sure the graph's `source.pdf` value points to that PDF relative to the graph file.
3. Run `NodeGraph: Register Project Paper`.
4. Choose the project manifest, graph file, stable paper ID, and stable source ID.

Registration records the graph path, PDF path, and current PDF SHA-256 hash in the manifest. The graph remains an independent single-paper file and is not rewritten.

Run `NodeGraph: Unregister Project Paper` to remove a registration. This does not delete the graph or PDF.

## Open and search

Run `NodeGraph: Open Literature Project` and choose `project.nodegraph.json`. Opening reads the manifest and lightweight indexes. It does not open every registered graph.

Run `NodeGraph: Search Project Papers` to search indexed title, author, publication year, DOI, paper ID, and tags. Missing optional metadata does not stop the project from opening.

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

The paper index is rebuilt from the manifest and registered graph files. The evidence index is rebuilt from `evidence/records.json`. Neither index is an authority.

NodeGraph validates the complete replacement pair before changing either index. If either replacement fails, both earlier valid indexes remain in place. A registration or removal that already changed the authoritative manifest is reported as accepted even if its follow-up index rebuild fails; repair the file problem and run the rebuild command.

## Stale evidence

The manifest binds each source ID to a PDF hash. If the PDF bytes change, validation reports a source hash mismatch and preserves the prior identity for review.

Quotation evidence has separate quotation-content and evidence-object hashes. A mismatch is reported without changing the quotation or evidence record.

## Stale writes

Each authoritative project document owns its own revision. A write includes the revision it was based on. If that revision is no longer current, NodeGraph rejects the complete operation set and leaves the target unchanged.

Phase 1 does not include a merge screen. Refresh the document, review the rejected operations, and submit a new mutation against the current revision.

## Compatibility and versions

Existing `.nodegraph.json` files still open, edit, verify against PDFs, and export as before. A graph is never converted simply because it is registered with a project.

The application version is `0.0.0`. The project persistence schema is independently versioned at `1.0.0`. Unsupported project versions open read-only and are never rewritten.
