# NodeGraph Synthesis Schemas

These schemas define the implemented project persistence contracts without changing the existing single-paper `.nodegraph.json` format. They use NodeGraph's existing JSON Schema draft-07 dialect, camelCase property names, two-space JSON indentation, semantic schema versions, ISO 8601 timestamps, and explicit identifiers.

## Authoritative Document Map

| Manifest entry | Contract |
|---|---|
| `papers[].path` | Existing `schema/nodegraph.schema.json` |
| `papers[].extractionPath` in projects `1.1.0` and `1.2.0` | `extraction.schema.json` |
| `documents.claims` in projects `1.0.0` and `1.1.0` | `synthesis-claims.schema.json` |
| `documents.conflicts` in projects `1.0.0` and `1.1.0` | `conflicts.schema.json` |
| `documents.claims` in project `1.2.0` | `synthesis-claims-v1.2.schema.json` |
| `documents.conflicts` in project `1.2.0` | `conflicts-v1.2.schema.json` |
| `documents.appraisals` in project `1.2.0` | `evidence-appraisals.schema.json` |
| `documents.gaps` | `gaps.schema.json` |
| `documents.researchQuestions` | `research-questions.schema.json` |
| `documents.constructs` | `construct-taxonomy.schema.json` |
| `documents.methodologies` in project `1.1.0` | `methodology-registry.schema.json` |
| `documents.evidence` | `evidence-records.schema.json` |
| `documents.paperIndex` in project `1.0.0` | `paper-index.schema.json` |
| `documents.paperIndex` in projects `1.1.0` and `1.2.0` | `paper-index-v1.1.schema.json` |
| `documents.evidenceIndex` | `evidence-index.schema.json` |
| `documents.claimLedgerIndex` in project `1.2.0` | `claim-ledger-index.schema.json` |
| `documents.auditLog` | `audit-event.schema.json`, applied to each non-empty JSONL line |

`project.schema.json` validates frozen project schema `1.0.0`; `project-v1.1.schema.json` validates frozen Phase 2 schema `1.1.0`; and `project-v1.2.schema.json` validates the current Phase 3 contract. Each paper registration owns an authoritative source-document identity through `papers[].source`; `1.1.0` and `1.2.0` also point to one authoritative extraction through `papers[].extractionPath`. `evidence-records.schema.json` is the authoritative evidence collection. Phase 3 claims use `synthesis-claim-v1.2.schema.json`; `synthesis-claim.schema.json` remains the frozen earlier record shape. `mutation-envelope.schema.json` validates one single-document write request.

`common.schema.json` is the only definition site for identifiers, project-relative paths, lowercase `sha256:` hashes, timestamps, revision tokens, review states, actors, finding pointers, and relationship values. Runtime TypeScript interfaces must use the same names and values.

## Settled Persistence Terms

- `quoteContentHash` is the hash of normalized quotation text. `quoteHash` is not persisted.
- `sourceDocumentHash` is the hash of the source document bytes. `source.sha256` is not persisted.
- `locator` is the text-location object. `textLocator` is not persisted.
- `evidenceObjectHash` is a top-level evidence property calculated from the immutable projection defined in `ARCHITECTURE.md` §8. It excludes itself, paths, review state, timestamps, and descriptive source metadata.
- Relationship values are the ten kebab-case strings defined by `common.schema.json#/definitions/relationship`.
- A deprecated construct requires `primaryConstructId`; runtime validation requires that target to be distinct, approved, and non-deprecated.
- A construct merge accepts only an active researcher-approved source, moves its canonical term and textual aliases to the primary with normalized deduplication, and records both IDs in the audit event.
- Paper-index metadata is derived and searchable. Evidence-index entries are derived from `documents.evidence`; neither index owns source identity or evidence.
- Per-paper extraction documents and the methodology registry are authoritative in `1.1.0`. Their paper-index summaries are disposable.
- Phase 3 appraisals are authoritative in `documents.appraisals`; confidence explanations are authoritative on claims; the claim-ledger index is disposable.

## Pre-runtime 1.0.0 Correction

Before the first synthesis-project runtime existed, the `1.0.0` contract was corrected to add authoritative source records, an authoritative evidence collection, and searchable paper-index metadata. No released runtime data used the incomplete shape, so this is not a migration. The first Phase 1 runtime that can create or modify a synthesis project freezes `1.0.0`. Later persisted-shape changes require a new semantic schema version and an explicit migration path.

## Phase 2 schema 1.1.0

Phase 2 adds an authoritative extraction registration to each paper and an authoritative methodology registry to the manifest. These are additive persisted-shape changes, so Phase 2 uses schema `1.1.0`; frozen `1.0.0` files are unchanged.

`SchemaMigrationService` owns the single explicit migration from `1.0.0`. A researcher invokes it, complete proposed documents validate before replacement, subordinate extraction and methodology documents are created first, the manifest is replaced last, derived indexes are invalidated, and the result is audited. Unsupported versions remain preserved and read-only.

## Phase 3 schema 1.2.0

Phase 3 adds an authoritative evidence-appraisal document, versioned claim and conflict documents, and a disposable claim-ledger index. Claims store explicit finding relationships, exact evidence references, cross-paradigm decisions, separate review fields, and structured confidence explanations. Conflicts use one kebab-case `conflictType` vocabulary and retain dissenting finding relationships, proposed explanations, and context comparisons that never claim cause and effect.

`SchemaMigrationService` owns the explicit sequential migration from `1.1.0` to `1.2.0`. It validates the complete Phase 2 source, constructs and validates all Phase 3 documents before writing, creates versioned subordinate files without overwriting Phase 2 authority, replaces the manifest last, invalidates derived indexes, and appends an audit event. A `1.0.0` project must first migrate to `1.1.0`. Unsupported versions remain preserved and read-only.

Evidence appraisal is authoritative only in `documents.appraisals`. Confidence explanations are authoritative only on claims. `documents.claimLedgerIndex` speeds up display but can be rebuilt from claims, conflicts, appraisals, extractions, evidence, taxonomy, and the manifest. Its raw source-file hashes allow a current ledger to be checked without loading the full evidence collection.

## Runtime Validation Boundary

JSON Schema validates document shape. Runtime services must additionally enforce:

- canonical path containment after resolving a project-relative path;
- identifier uniqueness and cross-document reference resolution;
- per-document stale-revision rejection;
- canonical quotation and evidence-object hashing;
- approval-transition authority and audit requirements;
- deprecated-construct resolution to an active primary;
- supported schema versions and migration policy;
- actual finding resolution, evidence-to-paper ownership, conflict dissent, and appraisal freshness;
- explicit researcher decisions for cross-paradigm claims;
- confidence policy evaluation and stale-explanation detection.

The reference contract runner is `tools/validate-synthesis-contracts.js`. Fixtures under `fixtures/` demonstrate schema-valid, schema-invalid, extraction, methodology, claim, conflict, appraisal, ledger, traversal, stale-revision, cross-reference, approval-authority, and canonical-hash cases. Runtime behavior, migration, taxonomy, verification, matrix, confidence, and ledger invariants are covered by the Phase 1, Phase 2, and Phase 3 integration suites.

Run it from the repository root:

```sh
npm run test:contracts
```
