# NodeGraph Synthesis Schemas

These schemas stabilize the proposed synthesis persistence contract without changing the existing single-paper `.nodegraph.json` format. They use NodeGraph's existing JSON Schema draft-07 dialect, camelCase property names, two-space JSON indentation, semantic schema versions, ISO 8601 timestamps, and explicit identifiers.

## Authoritative Document Map

| Manifest entry | Contract |
|---|---|
| `papers[].path` | Existing `schema/nodegraph.schema.json` |
| `documents.claims` | `synthesis-claims.schema.json` |
| `documents.conflicts` | `conflicts.schema.json` |
| `documents.gaps` | `gaps.schema.json` |
| `documents.researchQuestions` | `research-questions.schema.json` |
| `documents.constructs` | `construct-taxonomy.schema.json` |
| `documents.evidence` | `evidence-records.schema.json` |
| `documents.paperIndex` | `paper-index.schema.json` |
| `documents.evidenceIndex` | `evidence-index.schema.json` |
| `documents.auditLog` | `audit-event.schema.json`, applied to each non-empty JSONL line |

`project.schema.json` validates the manifest. Each paper registration owns an authoritative source-document identity through `papers[].source`. `evidence-records.schema.json` is the authoritative evidence collection, while `evidence.schema.json`, `synthesis-claim.schema.json`, and `adversarial-pass.schema.json` validate reusable records. `mutation-envelope.schema.json` validates one single-document write request.

`common.schema.json` is the only definition site for identifiers, project-relative paths, lowercase `sha256:` hashes, timestamps, revision tokens, review states, actors, finding pointers, and relationship values. Runtime TypeScript interfaces must use the same names and values.

## Settled Persistence Terms

- `quoteContentHash` is the hash of normalized quotation text. `quoteHash` is not persisted.
- `sourceDocumentHash` is the hash of the source document bytes. `source.sha256` is not persisted.
- `locator` is the text-location object. `textLocator` is not persisted.
- `evidenceObjectHash` is a top-level evidence property calculated from the immutable projection defined in `ARCHITECTURE.md` §8. It excludes itself, paths, review state, timestamps, and descriptive source metadata.
- Relationship values are the ten kebab-case strings defined by `common.schema.json#/definitions/relationship`.
- A deprecated construct requires `primaryConstructId`; runtime validation requires that target to be distinct, approved, and non-deprecated.
- Paper-index metadata is derived and searchable. Evidence-index entries are derived from `documents.evidence`; neither index owns source identity or evidence.

## Pre-runtime 1.0.0 Correction

Before the first synthesis-project runtime existed, the `1.0.0` contract was corrected to add authoritative source records, an authoritative evidence collection, and searchable paper-index metadata. No released runtime data used the incomplete shape, so this is not a migration. The first Phase 1 runtime that can create or modify a synthesis project freezes `1.0.0`. Later persisted-shape changes require a new semantic schema version and an explicit migration path.

## Runtime Validation Boundary

JSON Schema validates document shape. Runtime services must additionally enforce:

- canonical path containment after resolving a project-relative path;
- identifier uniqueness and cross-document reference resolution;
- per-document stale-revision rejection;
- canonical quotation and evidence-object hashing;
- approval-transition authority and audit requirements;
- deprecated-construct resolution to an active primary;
- supported schema versions and migration policy.

The reference contract runner is `tools/validate-synthesis-contracts.js`. Fixtures under `fixtures/` demonstrate schema-valid, schema-invalid, traversal, stale-revision, cross-reference, approval-authority, and canonical-hash cases. This runner is Task 0 verification tooling, not the Phase 1 repository or `IntegrityService` implementation.

Run it from the repository root:

```sh
npm run test:contracts
```
