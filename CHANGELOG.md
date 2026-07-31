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

The Task 0 correction is not a migration. No released runtime created data using the incomplete contract.

### Compatibility

- Existing single-paper graphs remain independently valid and editable.
- Existing PDF quote checks and single-paper HTML export remain unchanged.
- Opening a legacy graph does not register, migrate, or rewrite it.
- Application version `0.0.0` remains independent from project schema version `1.0.0`.

### Deferred

- Product renaming and extension-identifier changes await an approved replacement identity.
- Synthesis matrices, standardized extraction, claim and conflict review, gap workflows, merge UI, and synthesis exports remain later-phase work.
