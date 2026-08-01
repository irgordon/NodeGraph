# Changelog

All notable changes to this project will be documented in this file.

## [0.0.0] - Unreleased

### Fork Baseline

- Established a new application lineage from NodeGraph 0.7.2.
- Reset application versioning to 0.0.0.
- Retained compatibility with existing single-paper `.nodegraph.json` files.
- Adopted the Task 0 architecture, domain model, workflows, schemas, and contract tests.
- Kept the existing NodeGraph name and extension identifiers until a replacement identity is approved.

### Added

- Multi-paper project creation, opening, paper registration, and paper removal.
- Project-relative path checks, including canonical containment after symbolic links are resolved.
- Layered project validation with file, object, rule, and recovery details.
- Source PDF, quotation, evidence-link, and derived-index integrity checks.
- Disposable paper and evidence indexes with full and partial rebuilding.
- Indexed paper search by title, author, year, DOI, paper ID, and tags.
- Per-document revision checks, atomic JSON writes, and stale-write rejection.
- Append-only Phase 1 audit events with visible handling of a truncated final line.
- Integration coverage for lazy opening, legacy graphs, recovery, provenance, and safe writes.
- Authoritative standardized extraction records with source language, normalized values, methodology, findings, evidence references, and distinct reporting states.
- Governed construct and methodological-paradigm proposals with researcher-only approval, alias resolution, and non-destructive construct merging.
- Independent source, interpretation, and classification verification with a PDF-backed source-review queue.
- A disposable Phase 2 matrix summary index, lazy cell hydration, normalized filters, and graph-selection synchronization.
- Deterministic UTF-8 matrix CSV with stable identifiers, fixed columns, full quoting, and spreadsheet-formula protection.
- An explicit researcher-invoked project migration from schema `1.0.0` to additive schema `1.1.0`.
- Phase 2 contract fixtures and integration coverage for extraction, taxonomy, verification, migration, lazy matrix behavior, index recovery, and CSV safety.
- Authoritative Phase 3 synthesis claims with explicit finding relationships, exact evidence references, researcher review, and cross-paradigm decisions.
- Typed conflict records with preserved dissent, reviewable explanations, structured context comparisons, and audited reclassification.
- Authoritative per-paper evidence appraisal bound to source hashes and extraction revisions.
- Explainable confidence policy `nodegraph-evidence-confidence` version `1.0.0`, with structured inputs, limitations, freshness, and `not-assessed`, `low`, `moderate`, or `high` labels.
- A disposable claim-ledger index and view that open without paper-graph hydration and load selected claim evidence on demand.
- An explicit researcher-invoked project migration from frozen schema `1.1.0` to additive schema `1.2.0`.
- Phase 3 contract fixtures and integration coverage for migration safety, provenance, conflicts, appraisal, confidence, revision rejection, auditing, and lazy ledger recovery.
- A portability gate covering project movement, cross-platform path construction, installed assets, shell-free tool discovery, generated bundles, runtime templates, and VSIX contents.

### Changed

- Reframed the fork as an independent application expected to diverge substantially from upstream NodeGraph.
- Corrected the unimplemented Task 0 `1.0.0` persistence contract before its first runtime use. Paper registrations now retain authoritative source identity, evidence has an authoritative collection, and the paper index includes searchable metadata.
- Established the first Phase 1 write-capable runtime as the freeze point for project schema `1.0.0`. Later schema changes require a new semantic schema version and an explicit migration path.
- Rechecked authoritative revisions immediately before replacement so a concurrent edit is returned as a stale conflict instead of being overwritten.
- Made paired paper/evidence index replacement restore both prior indexes after a failed rebuild.
- Routed paper-relative PDF paths and source hashing through the shared path and integrity boundaries.
- Kept accepted manifest mutations visible when their disposable index rebuild fails.
- Preserved structured service and audit errors through the command presentation boundary.
- Reported missing audit history and blocked known-unrecordable writes before replacement.
- Normalized indexed and queried metadata with one shared policy.
- Limited audit recovery blocking to the affected project and cleaned up files created by failed project initialization.
- Extended the paper index through schema `1.1.0` with reconstructible extraction, taxonomy, methodology, finding, verification, and staleness summaries.
- Kept matrix rendering and filtering on derived summaries while reading authoritative detail only for the selected cell.
- Added a narrow stable-node selection bridge without moving project or persistence policy into the existing editor webview.
- Prevented partial index rebuilds from reusing a matrix entry after its registered PDF changes.
- Kept migrated extraction and methodology documents intact when derived-index invalidation reports a failure.
- Routed registration-time extraction creation through the same absent-revision mutation and audit boundary as other authoritative initialization.
- Required agent extraction classifications to retain AI origin and strengthened evidence-to-source registration checks.
- Kept successful Phase 2 mutations visible when their follow-up disposable-index rebuild fails.
- Preserved merged constructs' canonical terms as normalized primary aliases, rejected inactive merge sources, and recorded both construct IDs in merge audit events.
- Defined a reviewable VSIX boundary that keeps runtime schemas, compiled assets, public templates, and graph examples while excluding internal instructions, generated environment copies, contract fixtures, source papers, generated demo exports, and unreferenced media.
- Aligned Phase 3 schemas, TypeScript types, runtime validation, and documentation on kebab-case conflict types and separate review fields.
- Required claim references to resolve to real extraction findings and exact evidence owned by the same paper.
- Kept stronger dissent visible in confidence decisions instead of allowing study counts to select a conclusion.
- Marked confidence explanations stale after source, extraction, appraisal, conflict, or taxonomy changes.
- Kept claims, conflicts, appraisals, and confidence explanations authoritative outside the reconstructible claim-ledger index.
- Added a researcher-facing cross-paradigm decision step before claim approval.
- Kept relationship types, appraisal source details, and integrity warnings visible in claim detail.
- Blocked evidence-to-PDF navigation when the registered source hash no longer matches the file.
- Resolved installed schemas from VS Code's extension URI instead of an extension or checkout path assumption.
- Replaced shell command strings in environment checks with executable and argument discovery through the operating system search path.
- Replaced the tracked machine-generated environment snapshot with a neutral placeholder; workspace reports remain generated at runtime.
- Made the batch HTML tool default to the caller's current folder and removed its redundant Bash-only wrapper.
- Made the Extension Development Host launch configuration use the current workspace folder.
- Corrected the claim-ledger webview so its script loads, renders the first lazy summary, and refreshes retained panels when reopened.

The Task 0 correction is not a migration. No released runtime created data using the incomplete contract.

The Phase 2 schema change is a migration. Project schema `1.0.0` remains frozen; `1.1.0` adds authoritative extraction registrations and the methodology registry without changing legacy single-paper graphs.

The Phase 3 schema change is a sequential migration. Project schemas `1.0.0` and `1.1.0` remain frozen; `1.2.0` adds authoritative appraisal and versioned claim/conflict documents without changing legacy single-paper graphs.

### Compatibility

- Existing single-paper graphs remain independently valid and editable.
- Existing PDF quote checks and single-paper HTML export remain unchanged.
- Opening a legacy graph does not register, migrate, or rewrite it.
- Application version `0.0.0` remains independent from current project schema version `1.2.0`.

### Deferred

- Product renaming and extension-identifier changes await an approved replacement identity.
- Gap analysis, adversarial gap testing, research-question alignment, dissertation planning, merge UI, Excel export, and multi-document transactions remain later-phase work.
