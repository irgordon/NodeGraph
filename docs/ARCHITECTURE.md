# NodeGraph — Architecture

**Status:** v0.5 (Task 0 contract baseline)
**Related documents:** `SYNTHESIS_DOMAIN_MODEL.md` · `SYNTHESIS_WORKFLOWS.md` · `ROADMAP.md`

This document is the stable technical contract for the NodeGraph synthesis extension. It defines system boundaries, component ownership, persistence, provenance, validation, and scale — the decisions that must hold regardless of which features are built on top of them. Feature requirements, domain rules, and sequencing live in the related documents above.

---

## 1. Purpose

NodeGraph extends from single-paper analysis (one `.nodegraph.json`, one paper as unit of analysis) into a multi-paper doctoral literature-review synthesis environment, where the claim, construct, method, population, and finding become the units of comparison. This document specifies how that extension is built without compromising NodeGraph's existing local-first, Git-friendly, plain-JSON model.

## 2. Architectural Drivers

- Individual paper graphs must remain independently valid and editable; synthesis is additive, not a rewrite.
- Every dissertation-level conclusion must remain traceable to exact source evidence in a version-identified document.
- The system must scale to 100–300 source papers without requiring the full corpus in memory.
- AI-generated content must be structurally distinguishable from researcher-approved content at every layer — not just visually flagged.
- Concurrent edits (human + agent, multiple agents) must not silently corrupt synthesis state.
- The architecture must not assume a single monolithic project document; it must survive projects with thousands of findings and evidence links.

## 3. System Context

NodeGraph 0.7.2 already provides much of the Level 1–2 foundation, including paper-level nodes, source quotations, PDF quote-jump verification, and HTML export. The synthesis extension formalizes these into explicit evidence and interpretation objects and adds a project-level layer above them. Individual paper `.nodegraph.json` files remain authoritative and keep their existing format; synthesis data is additive and lives in separate project documents.

### Implementation Status

| Capability | Status |
|---|---|
| Single-paper `.nodegraph.json` editor | Existing in 0.7.2 |
| Paper-level nodes and quotations | Existing in 0.7.2 |
| PDF quote-jump verification | Existing in 0.7.2 |
| Single-paper HTML export | Existing in 0.7.2 |
| Task 0 synthesis schemas and contract fixtures | Defined and verified |
| Project manifest repositories and runtime validation | Proposed for Phase 1 |
| Summary indexes and lazy project queries | Proposed for Phase 1–2 |
| Synthesis UI and synthesis exports | Proposed; intentionally absent in Task 0 |

Documentation of a proposed component does not imply that the component is already implemented. Runtime status should be updated as capabilities land.

### Existing 0.7.2 Implementation Map

| Existing code | Current responsibility | Proposed architectural seam |
|---|---|---|
| `src/extension/extension.ts` | Extension activation and command coordination | Extension-host composition root |
| `src/extension/NodeGraphEditorProvider.ts` | Custom editor adapter, whole-file JSON load/save, link routing, PDF launch, image persistence, and export dispatch | Keep as the single-paper adapter; future persistence delegates to `PaperGraphRepository`, while export and source verification delegate to their own services |
| `src/webview/types/graph.ts` and `schema/nodegraph.schema.json` | Existing single-paper in-memory and persisted shape | Paper-analysis contract; remains unchanged by synthesis persistence |
| `src/webview/hooks/useGraph.ts` | Webview editing state, history, dirty-state handling, and save messages | Existing graph-editing logic; no project-state ownership |
| `src/extension/PdfViewerPanel.ts`, `src/pdfviewer/main.ts`, `src/pdfviewer/textMatch.ts` | PDF loading, quotation search, and visual verification | Source-domain verification adapter; Task 0 does not add persisted synthesis verification |
| `src/extension/htmlExporter.ts` | Standalone single-paper HTML generation | Existing `ExportService` implementation for paper graphs; synthesis export remains proposed |
| `src/extension/imageManager.ts` | Sidecar image paths and file I/O | Paper-asset infrastructure |

`NodeGraphEditorProvider` currently spans several infrastructure concerns. Task 0 records those seams but does not refactor working 0.7.2 runtime code. Phase 1 must not add project repository, integrity, or taxonomy logic directly to that provider.

Task 0 removes the obsolete requirement that every legacy node contain an `images` array from `schema/nodegraph.schema.json`; the 0.7.2 TypeScript model and shipped demos already treat that field as absent. This aligns validation with the existing format and changes no runtime or persisted graph.

## 4. Core Invariants

These are the rules the system **MUST NOT** violate. Every component design in this document exists to enforce them.

1. Source evidence is never overwritten by normalized interpretation.
2. Synthesis objects never mutate paper graphs.
3. Every synthesis claim resolves to one or more paper-level findings.
4. Every evidence-bearing paper-level finding resolves to source evidence.
5. Every source evidence object is bound to a specific source-document hash.
6. Derived indexes are disposable and never authoritative.
7. Agent-created objects begin as proposals.
8. Approval cannot be assigned by an agent.
9. Construct normalization requires an approved taxonomy entry.
10. A candidate gap cannot become approved without an adversarial-pass record.
11. Invalid or stale evidence is surfaced, never silently repaired.
12. Cross-paradigm evidence is never merged without an explicit synthesis decision.

## 5. Logical Architecture

Four **domain layers** (not necessarily separate storage engines or UI screens):

| Domain | Owns |
|---|---|
| Source | PDF, extracted evidence, source-document identity |
| Paper-analysis | Findings and interpretations within one paper |
| Synthesis | Relationships across papers — claims, conflicts, taxonomy, gaps |
| Argument | Dissertation-level claims and research-question alignment |

**Dependency direction is one-way and non-negotiable:**

```
Source does not depend on paper interpretation.
Paper interpretation does not depend on synthesis.
Synthesis does not rewrite source evidence.
Argument objects reference synthesis but do not alter it.
```

```
+---------------------------------------------------------------------------------+
|                             ARGUMENT DOMAIN                                     |
|                 (Chapter Outline, Gap-to-Question Alignment)                    |
+---------------------------------------------------------------------------------+
                                       |
                                       v  (references, does not mutate)
+---------------------------------------------------------------------------------+
|                             SYNTHESIS DOMAIN                                    |
|  * Taxonomy / Construct Registry                                                |
|  * Synthesis Matrix (Constructs x Papers)                                       |
|  * Disagreement / Conflict Objects                                              |
|  * Candidate Gap & Quality Engine                                               |
+---------------------------------------------------------------------------------+
                   |                                             |
                   | (Lazy-Loaded Queries)                       | (Ref Integrity Check)
                   v                                             v
+------------------------------------+         +----------------------------------+
| PAPER-ANALYSIS DOMAIN (Smith 2024) |         | PAPER-ANALYSIS DOMAIN (Jones 2025)|
|  * Local .nodegraph.json           |         |  * Local .nodegraph.json          |
+------------------------------------+         +----------------------------------+
                   |                                             |
                   v                                             v
+------------------------------------+         +----------------------------------+
| SOURCE DOMAIN                      |         | SOURCE DOMAIN                    |
|  * PDF Page Text & Quotation Hash  |         |  * PDF Page Text & Quotation Hash|
+------------------------------------+         +----------------------------------+
```

## 6. Component Responsibilities

```
VS Code Extension Host
├── ProjectRegistry
├── PaperGraphRepository
├── SynthesisRepository
├── IntegrityService
├── TaxonomyService
├── ConstructResolver
├── IndexBuilder
├── QueryService
├── ReviewStateService
├── SchemaMigrationService
├── ExportService
└── AgentWorkspaceService
Webview
├── MatrixView
├── ClaimLedgerView
├── GraphView
├── EvidenceInspector
├── GapAlignmentView
└── ReviewDashboard
```

Each proposed component has one abstraction level and one reason to change. The safety-critical boundaries are specified below:

**PaperGraphRepository**
- Reads paper graph files.
- Exposes paper metadata.
- Resolves nodes.
- Does **not** create synthesis claims.

**SynthesisRepository**
- Owns Level-3 (synthesis) and Level-4 (argument) objects.
- Persists synthesis state.
- Does **not** rewrite individual paper graphs.

**IntegrityService**
- Validates hashes and references.
- Detects stale or missing evidence.
- Never silently repairs a changed quotation without review.

**TaxonomyService**
- Owns construct proposal, approval, deprecation, and merge policy.
- Delegates identifier resolution to `ConstructResolver`.
- Does **not** write approval state directly.

**ConstructResolver**
- Resolves approved construct identifiers.
- Resolves a deprecated identifier through its `primaryConstructId`.
- Rejects missing targets, self-references, chains, and non-approved primaries.

**SchemaMigrationService**
- Owns supported synthesis schema migrations.
- Invalidates derived indexes after migration.
- Emits migration audit events.
- Does **not** modify an unsupported newer-version document.

Without this ownership model, synthesis logic tends to accumulate inside the custom editor provider or view components, where it is harder to test and to keep on the correct side of the invariants in §4.

## 7. Persistence Model

A single monolithic `.nodegraph-project.json` file is workable for prototyping but does not hold at scale — a 300-paper project can contain thousands of findings and evidence links, hundreds of synthesis claims, review histories, taxonomy mappings, cached indexes, and export settings, all in one file, which increases merge-conflict surface in Git and makes partial rebuilds impossible.

**Persisted structure (manifest + subordinate documents):**

```
literature-project/
├── project.nodegraph.json        # manifest: papers, schema version, settings
├── papers/
│   ├── smith-2024.nodegraph.json
│   └── jones-2025.nodegraph.json
├── synthesis/
│   ├── claims.json
│   ├── conflicts.json
│   ├── gaps.json
│   └── research-questions.json
├── taxonomy/
│   └── constructs.json
├── indexes/
│   ├── papers.index.json
│   └── evidence.index.json
└── audit/
    └── events.jsonl
```

`project.nodegraph.json` is a **manifest**, not a database document: it points to subordinate documents rather than embedding their content. This is the architectural decision — the alternative (monolithic document or append-only project store) was considered and rejected for merge-conflict and rebuild-granularity reasons.

Every persisted path has a draft-07 contract. Paper paths continue to use `schema/nodegraph.schema.json`; claims, conflicts, gaps, research questions, constructs, paper indexes, and evidence indexes use their corresponding files under `docs/schemas/`; each non-empty audit-log line uses `audit-event.schema.json`. Indexes have schemas so corrupt caches are rejected, but they remain derived and disposable rather than authoritative.

## 8. Provenance and Referential Integrity

**Problem.** Synthesis objects reference paper files and nodes. Because paper files are local-first and agent-editable, renaming, moving, or re-editing a node can break evidence links, and concurrent agent edits can orphan synthesis claims.

**Design.** Evidence references use durable provenance anchoring built from stable evidence identifiers, source-document hashes, quotation-content hashes, and relocatable locators — not relative paths or mutable node IDs alone. A content hash detects that content changed; it is not by itself an identity or location mechanism, so identity, integrity, and relocation are tracked separately:

```json
{
  "evidenceId": "evidence_6f974...",
  "paperId": "paper_001",
  "nodeId": "node_claim_04",
  "source": {
    "sourceId": "source_001",
    "relativePath": "pdfs/smith-2024.pdf",
    "sourceDocumentHash": "sha256:..."
  },
  "quote": {
    "text": "Quoted statement...",
    "quoteContentHash": "sha256:..."
  },
  "locator": {
    "page": 14,
    "prefix": "Earlier sentence...",
    "exact": "Quoted statement...",
    "suffix": "Following sentence..."
  },
  "evidenceObjectHash": "sha256:..."
}
```

The persisted names are final: `quoteContentHash`, `sourceDocumentHash`, and `locator`. The aliases `quoteHash`, `source.sha256`, and `textLocator` are not valid persisted fields.

**Quotation canonicalization** is deterministic:

```
1. normalize Unicode to NFC
2. convert CRLF to LF
3. trim leading/trailing whitespace
4. collapse every internal Unicode whitespace run to one ASCII space
5. retain punctuation
6. encode as UTF-8
7. hash with SHA-256
```

`sourceDocumentHash` is calculated from the original document bytes without text normalization. All persisted hashes use lowercase `sha256:<64 hexadecimal characters>`.

`evidenceObjectHash` is calculated from this immutable projection only:

```json
{
  "evidenceId": "...",
  "paperId": "...",
  "source": {
    "sourceId": "...",
    "sourceDocumentHash": "..."
  },
  "quote": {
    "text": "<canonical quotation text>",
    "quoteContentHash": "<recalculated value>"
  },
  "locator": {
    "page": 14,
    "prefix": "<canonical text when present>",
    "exact": "<canonical text>",
    "suffix": "<canonical text when present>",
    "section": "<canonical text when present>"
  }
}
```

Projection keys are serialized recursively in lexicographic order, array order is preserved, no insignificant whitespace is emitted, and the result is encoded as UTF-8 before SHA-256. The projection excludes `evidenceObjectHash` itself, mutable `nodeId`, relocatable paths, DOI/title/version metadata, review state, origin, and timestamps. The canonical fixture in `docs/schemas/fixtures/runtime/canonical-hash.json` fixes the expected bytes and digest.

Three hashes protect different boundaries:

- `sourceDocumentHash` — identifies the PDF itself.
- `quoteContentHash` — identifies the extracted quotation text.
- `evidenceObjectHash` — identifies the stable evidence anchor projection.

**Source-document identity** is recorded independently of file path, so a preprint cannot be silently replaced by a published version while old page/quotation references remain attached:

```json
{
  "sourceId": "source_001",
  "relativePath": "pdfs/smith-2024.pdf",
  "sourceDocumentHash": "sha256:...",
  "doi": "...",
  "title": "...",
  "version": "publisher-version"
}
```

A project-level `IntegrityService` check runs before any synthesis pass, reports broken or stale evidence links, and flags orphaned claims. This is a Phase 1 requirement (see `ROADMAP.md`), not a later hardening pass.

## 9. Indexing and Query Architecture

**Invariant:** paper graphs and synthesis objects are authoritative. Indexes **MUST NOT** be treated as authoritative state and **MUST** be rebuildable from authoritative project objects.

Each index entry records enough to determine staleness without opening the full paper graph:

```json
{
  "paperId": "paper_001",
  "paperGraphHash": "sha256:...",
  "taxonomyVersion": 12,
  "extractorVersion": "0.3.0",
  "indexedAt": "2026-07-29T23:40:00-04:00"
}
```

`IndexBuilder` produces a compiled per-paper summary index (standardized extraction fields + taxonomy-mapped constructs) that the matrix and dashboards query directly. `QueryService` fetches and hydrates full Level 2 detail (quotation nodes, source text) only when a specific matrix cell or graph node is opened.

**Partial re-indexing.** When a single paper graph changes (e.g. `smith-2024.nodegraph.json` is edited), `IndexBuilder` compares the file's current content hash against the `paperGraphHash` already stored in `papers.index.json` and rebuilds only the index entries for papers whose hash changed. It does not rebuild the full project index on every edit; this keeps background CPU/IO cost proportional to the size of the change, not the size of the corpus. Fully hydrating 100–300 paper graphs at project open would create unnecessary startup latency and memory pressure, particularly for graphs containing quotations, tables, and images — the incremental summary index exists to avoid that, not because it has been benchmarked as impossible.

## 10. Validation and Trust Boundaries

Validation is layered; each layer catches a different class of failure and should produce distinct diagnostics.

**Syntactic validation**
- Valid JSON.
- Supported schema version.
- Required fields present.
- Correct data types.

**Structural validation**
- Unique identifiers.
- Valid references.
- No illegal cycles.
- Valid taxonomy mappings.
- Valid state transitions.

**Integrity validation**
- Source hash matches.
- Quotation-content hash matches.
- Index freshness.
- Evidence chain complete.

**Domain validation**
- Cross-paradigm synthesis flagged.
- Synthesis claim has adequate evidence.
- Approved gap has an adversarial-pass result.
- Approved research question has a complete upstream evidence chain.

All synthesis schemas use JSON Schema draft-07, matching `schema/nodegraph.schema.json`. `common.schema.json` owns shared identifiers, project-relative paths, hashes, timestamps, revision tokens, review state, actors, finding pointers, and relationship values.

JSON Schema is only the shape boundary. Runtime services own rules that require filesystem or cross-document state:

| Runtime rule | Owner |
|---|---|
| Resolve and contain project-relative paths beneath the canonical project root | Repository infrastructure |
| Resolve cross-document identifiers and require uniqueness | `IntegrityService` |
| Compare `baseRevision` with the current target-document revision | Repository infrastructure |
| Recalculate quotation and evidence-object hashes using §8 | `IntegrityService` |
| Authorize `approval.*` transitions | `ReviewStateService` |
| Resolve deprecated constructs to one approved primary | `ConstructResolver` |
| Select migrations or read-only fallback from schema version | `SchemaMigrationService` |

## 11. State and Review Model

A single review-state enum cannot represent reality: an object can be simultaneously source-verified and classification-disputed. Verification, approval, and origin are tracked as independent dimensions:

```json
{
  "verification": {
    "source": "verified",
    "interpretation": "pending",
    "classification": "disputed"
  },
  "approval": {
    "researcher": "approved",
    "advisor": "not-reviewed"
  },
  "origin": "ai"
}
```

`ReviewStateService` owns valid transitions between these states and is the only component permitted to write `approval.*` fields (see §12).

## 12. Agent Integration Boundary

**Invariant:** agents may create proposals. Only deterministic services or human actions may commit approved analytical state.

An agent may propose:
- a construct mapping;
- a synthesis claim;
- a conflict type;
- a candidate gap;
- an evidence relationship.

An agent **MUST NOT** directly set `approval.researcher` to `approved`. Proposals are written with `approval.researcher: "not-reviewed"`; `ReviewStateService` and human action are the only path to approval. This is the mechanism that enforces Core Invariants 7–8 (§4), not just a policy statement.

## 13. Performance and Scale

Scale strategy is the combination of §7 (decomposed persistence, reducing what must be parsed at all) and §9 (lazy-loaded indexes, reducing what must be hydrated). No component **SHOULD** require the full project — all papers, all synthesis objects, all audit history — resident in memory simultaneously for normal operation (opening the project, rendering the matrix, browsing the claim ledger).

## 14. Failure Handling

The safe default for every failure mode below is the same: **mark the dependent object stale or invalid, preserve it for inspection, and never silently delete or silently rebind it.**

Failure modes requiring an explicit, user-visible state:
- A paper file is missing.
- A PDF changed (source-document hash mismatch).
- A quotation no longer matches (`quoteContentHash` mismatch).
- A taxonomy item was deleted.
- An index is stale.
- A synthesis claim loses its final evidence link.
- An agent output fails validation.
- A project contains an unsupported schema version.

## 15. Security and Privacy

Because agent output can be rendered in a webview and exported to HTML, the following are architecture invariants, not deferred implementation guidance:

- Escaped Markdown output.
- Allowlisted link protocols.
- Forward-slash project-relative paths that reject absolute paths, backslashes, empty segments, `.` segments, and `..` traversal.
- Image size limits.
- No arbitrary HTML.
- No executable script content.
- Sanitization in both editor and exporter.
- Content Security Policy parity between views.
- Untrusted handling of imported JSON.

## 16. Evolution and Compatibility

Persisted schema version is tracked independently of extension version:

```json
{
  "schema": {
    "name": "nodegraph-project",
    "version": "1.0.0"
  }
}
```

`SchemaMigrationService` exclusively owns synthesis migrations. Repositories may detect versions but may not embed migration logic.

- The current supported synthesis contract is `1.0.0`.
- A current-version document opens read-write after validation.
- A known older version with a registered migration opens read-only until the user explicitly runs that migration.
- Migration writes use the same mutation and revision contract as ordinary writes, invalidate both indexes, and append a migration audit event.
- A newer version, or an older version without a registered migration path, opens read-only with an actionable unsupported-version diagnostic.
- Unsupported documents are never rewritten, downgraded, or partially loaded into writable state.
- The existing single-paper schema/version remains independent from synthesis schema versions.

## 17. Concurrency and Transaction Model

Revisions are owned per authoritative document, not project-wide. A document revision is the SHA-256 hash of its recursively key-sorted canonical JSON, excluding formatting differences. The manifest revision changes only when the manifest changes. A corpus revision used by adversarial passes is a separate digest over sorted authoritative document-path/revision pairs plus the taxonomy version.

Every write targets exactly one authoritative document and **MUST** use `mutation-envelope.schema.json`. `baseRevision` is that target document's current revision; creation uses the literal `absent`. A write whose base revision does not match **MUST** fail before any operation is applied.

This envelope applies to future synthesis repositories. The existing single-paper editor continues its 0.7.2 `WorkspaceEdit` whole-file save path unchanged; Task 0 does not retrofit project concurrency behavior into `NodeGraphEditorProvider`.

```json
{
  "mutationId": "mutation_01J...",
  "targetDocument": "synthesis/claims.json",
  "baseRevision": "sha256:...",
  "operations": [
    { "op": "add", "path": "/claims/-", "value": {} }
  ],
  "requestedAt": "2026-07-30T12:00:00Z",
  "actor": { "type": "human", "id": "researcher" }
}
```

After revision comparison, the repository applies all operations in memory, validates the complete candidate document, writes a temporary sibling file, flushes it, atomically renames it over the target, and flushes the containing directory where the platform supports it. Validation or I/O failure leaves the prior target intact. Multi-document mutations are not atomic and are not supported by this envelope.

A stale request applies no operations, changes no file, and appends no analytical audit event. It returns:

```json
{
  "accepted": false,
  "code": "stale-revision",
  "targetDocument": "synthesis/claims.json",
  "currentRevision": "sha256:...",
  "receivedBaseRevision": "sha256:...",
  "retryable": true
}
```

After a successful atomic target replacement, the repository appends and flushes the audit event. If that append fails, the document remains committed, the project enters read-only recovery mode, and recovery records the missing event against the mutation ID and resulting revision before writes resume. The system never attempts an unsafe rollback over a possibly newer document.

This contract prevents silent last-write-wins behavior for offline multi-agent and human-plus-agent edits. A future merge UI may replay a rejected operation set against the new revision, but Task 0 introduces no merge or synthesis UI.

## 18. Audit and Decision Provenance

Git history is useful but insufficient because users may not commit after every analytical decision. The system therefore maintains an append-only audit log at `audit/events.jsonl`.

Events include paper import, source-hash change, quotation verification, construct remapping, synthesis-claim creation, evidence addition or removal, conflict reclassification, candidate-gap approval, adversarial-pass execution, research-question linking, advisor review, and schema migration.

```json
{
  "eventId": "evt_01J...",
  "timestamp": "2026-07-29T23:40:00-04:00",
  "actor": { "type": "human", "id": "researcher" },
  "action": "construct.mapping.approved",
  "objectId": "mapping_042",
  "beforeHash": "sha256:...",
  "afterHash": "sha256:..."
}
```

Audit events **MUST NOT** be rewritten in place. Corrections are recorded as later events that identify the superseded event or object revision.

## 19. Known Risks

1. **Ontology design** — consistent categories without forcing every discipline into one structure.
2. **Entity normalization** — mitigated by the construct taxonomy/registry (`SYNTHESIS_DOMAIN_MODEL.md`), not eliminated by it.
3. **Evidence weighting** — comparing study quality without collapsing it to one universal score.
4. **Contradiction handling** — distinguishing real disagreement from population, method, measurement, or definition differences; mitigated by `conflictType` (`SYNTHESIS_DOMAIN_MODEL.md`).
5. **Human review workflow** — keeping AI-produced synthesis transparent and contestable under real usage load, not only in the data model.
6. **Merge-interface complexity** — presenting concurrent JSON operations in a form researchers can resolve safely.
7. **Audit growth and recovery** — retaining a long-running event stream while supporting integrity checks, compaction projections, and recovery from a truncated final line.
8. **Multi-process locking** — optimistic locking detects stale writes but does not by itself coordinate every filesystem or editor process.

## 20. Related Documents

- `SYNTHESIS_DOMAIN_MODEL.md` — evidence levels, constructs, findings, synthesis claims, conflict objects, mechanisms, context, boundary conditions, candidate gaps, research-question alignment, evidence appraisal, methodological paradigms.
- `SYNTHESIS_WORKFLOWS.md` — import, extraction, normalization, verification, synthesis, conflict review, adversarial gap testing, researcher approval, dissertation planning, exports.
- `ROADMAP.md` — implementation phases, MVP scope, sequencing rationale.
- `schemas/` — JSON Schema contracts for project manifests, evidence objects, synthesis claims, construct taxonomies, and audit events.
- `SYNTHESIS_UI.md` *(not yet written)* — matrix, claim ledger, dashboards, filters, graph synchronization.

---

## Architectural Contract (summary)

> NodeGraph preserves individual paper graphs as independent evidence sources. A project-level synthesis layer creates normalized, reviewable relationships across those sources. Every dissertation-level conclusion remains traceable through paper-level interpretation to exact evidence in a version-identified source document.

The matrix, claim ledger, adversarial pass, and paragraph planner are applications built on top of this contract. They are not the architecture itself.
