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
| `documents.paperIndex` | `paper-index.schema.json` |
| `documents.evidenceIndex` | `evidence-index.schema.json` |
| `documents.auditLog` | `audit-event.schema.json`, applied to each non-empty JSONL line |

`project.schema.json` validates the manifest. `evidence.schema.json`, `synthesis-claim.schema.json`, and `adversarial-pass.schema.json` validate reusable records. `mutation-envelope.schema.json` validates one single-document write request.

`common.schema.json` is the only definition site for identifiers, project-relative paths, lowercase `sha256:` hashes, timestamps, revision tokens, review states, actors, finding pointers, and relationship values. Runtime TypeScript interfaces must use the same names and values.

## Settled Persistence Terms

- `quoteContentHash` is the hash of normalized quotation text. `quoteHash` is not persisted.
- `sourceDocumentHash` is the hash of the source document bytes. `source.sha256` is not persisted.
- `locator` is the text-location object. `textLocator` is not persisted.
- `evidenceObjectHash` is a top-level evidence property calculated from the immutable projection defined in `ARCHITECTURE.md` §8. It excludes itself, paths, review state, timestamps, and descriptive source metadata.
- Relationship values are the ten kebab-case strings defined by `common.schema.json#/definitions/relationship`.
- A deprecated construct requires `primaryConstructId`; runtime validation requires that target to be distinct, approved, and non-deprecated.

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
