# NodeGraph — Architecture

**Status:** Phase 3 implemented baseline (application 0.0.0)
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
| Task 0 synthesis schemas and contract fixtures | Defined, corrected before runtime use, and verified at schema 1.0.0 |
| Project manifest, registry, and project commands | Implemented in Phase 1 |
| Paper and synthesis repository boundaries | Implemented in Phase 1 |
| Layered validation and `IntegrityService` | Implemented in Phase 1 |
| Disposable indexes, partial rebuilds, and metadata search | Implemented in Phase 1 |
| Per-document revisions, atomic writes, and audit events | Implemented in Phase 1 |
| Standardized extraction and methodological classification | Implemented in Phase 2 |
| Governed construct taxonomy and independent verification | Implemented in Phase 2 |
| Lazy synthesis matrix and CSV matrix export | Implemented in Phase 2 |
| Claims, typed conflicts, evidence appraisal, explainable confidence, and claim ledger | Implemented in Phase 3 |
| Gap analysis, research-question alignment, and dissertation planning | Planned for Phases 4–5 |

Later-phase components in this document remain designs until the implementation-status table marks them as available.

### Existing 0.7.2 Implementation Map

| Existing code | Current responsibility | Architectural seam |
|---|---|---|
| `src/extension/extension.ts` | Extension activation and command coordination | Extension-host composition root |
| `src/extension/NodeGraphEditorProvider.ts` | Custom editor adapter, whole-file JSON load/save, link routing, PDF launch, image persistence, export dispatch, and a narrow stable-node selection bridge | Keeps single-paper persistence independent; project reads use `PaperGraphRepository` separately |
| `src/webview/types/graph.ts` and `schema/nodegraph.schema.json` | Existing single-paper in-memory and persisted shape | Paper-analysis contract; remains unchanged by synthesis persistence |
| `src/webview/hooks/useGraph.ts` | Webview editing state, history, dirty-state handling, save messages, and stable node-selection messages | Existing graph-editing logic; no project-state ownership |
| `src/extension/PdfViewerPanel.ts`, `src/pdfviewer/main.ts`, `src/pdfviewer/textMatch.ts` | PDF loading, quotation search, and visual verification | Existing interactive source adapter; Phase 1 adds separate persisted integrity checks without changing it |
| `src/extension/htmlExporter.ts` | Standalone single-paper HTML generation | Existing paper-graph exporter; the separate Phase 2 matrix exporter does not change it |
| `src/extension/imageManager.ts` | Sidecar image paths and file I/O | Paper-asset infrastructure |

`NodeGraphEditorProvider` currently spans several infrastructure concerns. Phase 2 adds only the stable selection bridge needed to synchronize an open paper graph with a matrix cell. Project persistence, integrity, indexing, taxonomy, and matrix policy remain outside the provider and webview.

Task 0 removes the obsolete requirement that every legacy node contain an `images` array from `schema/nodegraph.schema.json`; the 0.7.2 TypeScript model and shipped demos already treat that field as absent. This aligns validation with the existing format and changes no runtime or persisted graph.

### Phase 1 Runtime Map

| Phase 1 code | Responsibility |
|---|---|
| `src/extension/project/ProjectRegistry.ts` | Create and open projects; register paper and source identities; load lightweight indexes |
| `src/extension/project/PaperGraphRepository.ts` | Validate and hydrate one legacy paper graph on demand; expose metadata and nodes |
| `src/extension/project/SynthesisRepository.ts` | Load authoritative project documents and route mutation-envelope writes |
| `src/extension/project/ProjectPathResolver.ts` | Reject malformed paths and enforce canonical project-root containment |
| `src/extension/project/CrossDocumentValidator.ts` | Validate identifiers and references across authoritative project documents |
| `src/extension/project/IntegrityService.ts` | Report missing files, changed PDFs, stale quotations, broken references, and stale indexes |
| `src/extension/project/IndexBuilder.ts` | Rebuild disposable paper and evidence indexes, reusing unchanged paper entries |
| `src/extension/project/MutationRepository.ts` | Enforce per-document revisions, validation, atomic replacement, and mutation audit events |
| `src/extension/project/AtomicJsonWriter.ts` | Replace authoritative JSON safely and roll back paired derived-index replacements on failure |
| `src/extension/project/QueryService.ts` | Search normalized index metadata without hydrating paper graphs |
| `src/extension/project/AuditLog.ts` | Append and inspect JSONL events without rewriting history |
| `src/extension/project/SchemaVersionPolicy.ts` | Select current-version read-write or unsupported-version read-only behavior |
| `src/extension/project/Phase1ProjectService.ts` | Coordinate registry, integrity, indexing, and query operations without VS Code APIs |
| `src/extension/project/ProjectCommands.ts` | Provide the minimum VS Code commands needed to exercise Phase 1 |

### Phase 2 Runtime Map

| Phase 2 code | Responsibility |
|---|---|
| `src/extension/project/ExtractionService.ts` | Validate and import authoritative per-paper extraction proposals |
| `src/extension/project/TaxonomyService.ts` | Propose, review, remap, and non-destructively merge constructs and paradigms |
| `src/extension/project/ReviewStateService.ts` | Enforce researcher authority and independent verification transitions |
| `src/extension/project/VerificationService.ts` | Build the source-verification queue, open source locations, and persist verification decisions |
| `src/extension/project/SchemaMigrationService.ts` | Perform the explicit researcher-invoked `1.0.0` to `1.1.0` project upgrade |
| `src/extension/project/IndexBuilder.ts` | Build extraction, methodology, construct, verification, and staleness summaries without retaining paper graphs |
| `src/extension/project/QueryService.ts` | Filter matrix summaries and hydrate only selected extraction detail |
| `src/extension/project/MatrixCsvExporter.ts` | Produce stable, quoted, spreadsheet-safe UTF-8 matrix CSV |
| `src/extension/project/Phase2ProjectService.ts` | Coordinate Phase 2 operations without VS Code APIs |
| `src/extension/project/MatrixPanel.ts` | Render matrix state and translate webview messages into service calls |
| `src/extension/project/Phase2Commands.ts` | Collect researcher input, call Phase 2 services, and present structured results |

### Phase 3 Runtime Map

| Phase 3 code | Responsibility |
|---|---|
| `src/extension/project/ClaimService.ts` | Propose and review claims; mutate explicit finding relationships and paradigm decisions through revision-checked writes |
| `src/extension/project/ConflictService.ts` | Propose, review, and reclassify typed conflicts while preserving dissenting finding references |
| `src/extension/project/EvidenceAppraisalService.ts` | Persist per-paper appraisal proposals and researcher decisions independently from source verification |
| `src/extension/project/ConfidenceService.ts` | Apply the versioned, rule-based confidence policy and expose its inputs, reasons, limitations, and freshness |
| `src/extension/project/ContextComparisonService.ts` | Compare reported context values without asserting causation or converting missing data to absence |
| `src/extension/project/ClaimLedgerQueryService.ts` | Rebuild disposable claim summaries and hydrate one selected claim's authoritative evidence chain |
| `src/extension/project/Phase3ProjectService.ts` | Coordinate Phase 3 services without duplicating validation or persistence policy |
| `src/extension/project/ClaimLedgerPanel.ts` | Render claim summaries and selected detail; translate validated webview messages into service calls |
| `src/extension/project/Phase3Commands.ts` | Collect Phase 3 command input and present structured results |

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
├── ExtractionService
├── TaxonomyService
├── ConstructResolver
├── IndexBuilder
├── QueryService
├── ReviewStateService
├── VerificationService
├── SchemaMigrationService
├── MatrixCsvExporter
├── Phase2ProjectService
├── MatrixPanel
├── ClaimService
├── ConflictService
├── EvidenceAppraisalService
├── ConfidenceService
├── ContextComparisonService
├── ClaimLedgerQueryService
├── Phase3ProjectService
├── ClaimLedgerPanel
└── AgentWorkspaceService
Webview
├── MatrixView
├── ClaimLedgerView
├── GraphView
├── EvidenceInspector
├── GapAlignmentView
└── ReviewDashboard
```

The Phase 3 runtime implements claims, typed conflicts, evidence appraisal, context comparison, explainable confidence, and the claim ledger. Gap alignment, a broader review dashboard, and dissertation planning remain planned.

Each component has one abstraction level and one reason to change. The safety-critical boundaries are specified below:

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
- Adds a merged construct's canonical term and aliases to the primary using shared normalization and deduplication.
- Delegates identifier resolution to `ConstructResolver`.
- Does **not** write approval state directly.

**ConstructResolver**
- Resolves approved construct identifiers.
- Resolves a deprecated identifier through its `primaryConstructId`.
- Rejects missing targets, self-references, chains, and non-approved primaries.

**SchemaMigrationService**
- Owns the explicit `1.0.0` → `1.1.0` and `1.1.0` → `1.2.0` synthesis migrations.
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
│   ├── smith-2024.pdf
│   ├── jones-2025.nodegraph.json
│   └── jones-2025.pdf
├── extractions/
│   ├── paper_001.json            # authoritative standardized extraction
│   └── paper_002.json            # authoritative standardized extraction
├── synthesis/
│   ├── claims-v1.2.json          # authoritative synthesis claims and confidence explanations
│   ├── conflicts-v1.2.json       # authoritative typed conflicts and context comparisons
│   ├── evidence-appraisals-v1.2.json # authoritative per-paper evidence appraisal
│   ├── gaps.json                 # authoritative; Phase 4 workflow deferred
│   └── research-questions.json   # authoritative; Phase 4 workflow deferred
├── taxonomy/
│   ├── constructs.json           # authoritative construct taxonomy
│   └── methodologies.json        # authoritative methodology registry
├── evidence/
│   └── records.json              # authoritative evidence collection
├── indexes/
│   ├── papers.index.json         # derived and rebuildable
│   ├── evidence.index.json       # derived and rebuildable
│   └── claims.index.json         # derived and rebuildable claim-ledger summary
└── audit/
    └── events.jsonl
```

`project.nodegraph.json` is a **manifest**, not a database document: it points to subordinate documents rather than embedding their content. Each `papers[]` registration also owns the paper's stable source identity:

```json
{
  "paperId": "paper_001",
  "path": "papers/smith-2024.nodegraph.json",
  "extractionPath": "extractions/paper_001.json",
  "source": {
    "sourceId": "source_001",
    "relativePath": "papers/smith-2024.pdf",
    "sourceDocumentHash": "sha256:...",
    "doi": "10.0000/example",
    "title": "Example Paper",
    "version": "publisher-version"
  }
}
```

The source record is authoritative and remains available when either index is deleted. Each `extractionPath` points to that paper's authoritative standardized extraction. `documents.methodologies` points to the governed paradigm registry. The manifest still points to subordinate documents rather than embedding their content; the alternative monolithic model remains rejected.

Every persisted path has a draft-07 contract. Paper paths continue to use `schema/nodegraph.schema.json`; extractions use `extraction.schema.json`; methodologies use `methodology-registry.schema.json`; claims, conflicts, gaps, research questions, constructs, authoritative evidence records, appraisals, paper indexes, evidence indexes, and the claim-ledger index use their corresponding files under `docs/schemas/`; each non-empty audit-log line uses `audit-event.schema.json`. Indexes have schemas so corrupt caches are rejected, but they remain derived and disposable rather than authoritative. `evidence/records.json` owns evidence; `indexes/evidence.index.json` only accelerates lookup. Per-paper extraction files own standardized extraction; `synthesis/evidence-appraisals-v1.2.json` owns appraisals; the paper and claim-ledger indexes only summarize authority.

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
    "relativePath": "papers/smith-2024.pdf",
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
  "relativePath": "papers/smith-2024.pdf",
  "sourceDocumentHash": "sha256:...",
  "doi": "...",
  "title": "...",
  "version": "publisher-version"
}
```

The Phase 1 `IndexBuilder` calls `IntegrityService` while rebuilding. Integrity checks report broken or stale evidence links and flag orphaned references. Invalid records remain available for inspection.

## 9. Indexing and Query Architecture

**Invariant:** paper graphs and synthesis objects are authoritative. Indexes **MUST NOT** be treated as authoritative state and **MUST** be rebuildable from authoritative project objects.

Each index entry records enough to determine staleness without opening the full paper graph:

```json
{
  "paperId": "paper_001",
  "paperPath": "papers/smith-2024.nodegraph.json",
  "paperGraphHash": "sha256:...",
  "sourceDocumentHash": "sha256:...",
  "title": "Example Paper",
  "authors": ["A. Researcher", "B. Scholar"],
  "publicationYear": 2024,
  "doi": "10.0000/example",
  "tags": ["leadership", "trust"],
  "taxonomyVersion": 12,
  "extractorVersion": "0.3.0",
  "indexedAt": "2026-07-29T23:40:00-04:00"
}
```

In Phase 1, `IndexBuilder` produces searchable metadata already present in paper graphs: title, authors, publication year when available, DOI, and tags. Phase 2 extends each paper entry with its extraction revision, taxonomy and extractor versions, approved and pending mappings, methodology, population context, finding/evidence identifiers, independent verification summaries, and staleness. Indexing and query code share the same whitespace, Unicode, and case normalization rules. `QueryService` opens no paper graphs to render or filter the matrix and reads only the selected extraction when a cell is opened.

**Partial re-indexing.** When a single paper graph changes (e.g. `smith-2024.nodegraph.json` is edited), `IndexBuilder` compares current graph, extraction, source, taxonomy, path, and extractor state against `papers.index.json`. A current PDF hash that differs from the registered source identity prevents reuse and produces a stale entry. Removed registrations are omitted from the completed result. It does not rebuild the full project index on every edit; this keeps background CPU/IO cost proportional to the size of the change, not the size of the corpus. Fully hydrating 100–300 paper graphs at project open would create unnecessary startup latency and memory pressure, particularly for graphs containing quotations, tables, and images — the incremental summary index exists to avoid that, not because it has been benchmarked as impossible.

The paper and evidence indexes are fully built and validated in memory before either target changes. `AtomicJsonWriter` stages the pair in the target filesystems and restores both prior indexes if replacement fails. A failed rebuild therefore cannot leave one new index beside one old index. Because both files are derived, a missing or invalid pair remains recoverable from the manifest, paper graphs, and authoritative evidence records.

Phase 3 adds one disposable claim-ledger index. It records revisions of the manifest, claims, conflicts, appraisals, and every extraction used to build it. It also stores raw file hashes so a normal open can check freshness without loading the full evidence collection or all extraction objects. A missing, invalid, or stale ledger index is rebuilt from authoritative records. Opening the ledger reads no paper graph; selecting one claim reads only its referenced extraction and evidence detail.

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
| Resolve and contain project-relative paths beneath the canonical project root | `ProjectPathResolver` |
| Resolve cross-document identifiers and require uniqueness | `CrossDocumentValidator` |
| Compare `baseRevision` with the current target-document revision | `MutationRepository` |
| Recalculate quotation and evidence-object hashes using §8 | `IntegrityService` |
| Authorize `approval.*` transitions | `ReviewStateService` |
| Resolve deprecated constructs to one approved primary | `ConstructResolver` |
| Select current-version or unsupported-version read-only behavior | `SchemaVersionPolicy` |
| Resolve claim findings, evidence ownership, conflict dissent, and appraisal freshness | `CrossDocumentValidator` |
| Calculate versioned confidence labels and structured explanations | `ConfidenceService` |
| Compare reported context values without causal inference | `ContextComparisonService` |

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

**Invariant:** agents may create proposals. Only a researcher-authorized action may approve analytical state, and the service layer enforces that rule.

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

### Portability boundary

Installed assets are resolved from VS Code's `extensionUri`. Saved project paths use the forward-slash, project-relative format enforced by `ProjectPathResolver`; local checkout, home-folder, temporary, drive, and installed-extension paths are never stored in authoritative records. Runtime tool checks use the operating system's executable search path without starting a shell. The reviewed cross-platform rules and dependency-owned bundle exception are recorded in `PORTABILITY.md`.

An adversarial pass identifies its corpus through stable project IDs, evidence IDs, project-relative document paths, the corpus revision, and the taxonomy version. It never stores the machine's PDF path or workspace location.

## 16. Evolution and Compatibility

Persisted schema version is tracked independently of extension version:

```json
{
  "schema": {
    "name": "nodegraph-project",
    "version": "1.2.0"
  }
}
```

`SchemaMigrationService` exclusively owns synthesis migrations. Repositories may detect versions but may not embed migration logic.

- The current supported synthesis contract is `1.2.0`.
- Schemas `1.0.0` and `1.1.0` remain frozen.
- Schema `1.0.0` opens read-only until the researcher invokes its `1.0.0` → `1.1.0` migration.
- Schema `1.1.0` remains writable for Phase 2 operations, but every Phase 3 mutation returns an actionable `1.2.0` migration-required diagnostic.
- A current-version document opens read-write after validation.
- A known older version with a registered migration opens read-only until the user explicitly runs that migration.
- The `1.0.0` → `1.1.0` migration adds per-paper extraction registrations and the methodology registry.
- The sequential `1.1.0` → `1.2.0` migration validates all Phase 2 authority, creates versioned claim, conflict, and appraisal documents without overwriting their `1.1.0` counterparts, replaces the manifest last through `MutationRepository`, invalidates disposable indexes, and appends a migration audit event.
- Failure before manifest replacement removes files created by the attempt and preserves the original `1.0.0` project. Failure while recording the post-replacement audit is reported as a committed write requiring recovery; it is not falsely reported as a rollback.
- A failure to remove a derived index after manifest replacement is reported without removing the newly authoritative extraction or methodology documents. A normal index rebuild remains the recovery.
- A newer version, or an older version without a registered migration path, opens read-only with an actionable unsupported-version diagnostic.
- Unsupported documents are never rewritten, downgraded, or partially loaded into writable state.
- The existing single-paper schema/version remains independent from synthesis schema versions.
- The corrected `1.0.0` contract was frozen by the first Phase 1 write-capable runtime. Phase 2 uses additive schema `1.1.0`, and Phase 3 uses additive schema `1.2.0`, rather than editing either frozen contract in place.

## 17. Concurrency and Transaction Model

Revisions are owned per authoritative document, not project-wide. A document revision is the SHA-256 hash of its recursively key-sorted canonical JSON, excluding formatting differences. The manifest revision changes only when the manifest changes. A corpus revision used by adversarial passes is a separate digest over sorted authoritative document-path/revision pairs plus the taxonomy version.

Every write targets exactly one authoritative document and **MUST** use `mutation-envelope.schema.json`. `baseRevision` is that target document's current revision. The literal `absent` is accepted only while `ProjectRegistry` initializes a new project. Later mutation paths cannot recreate a missing authoritative document with `absent`. A write whose base revision does not match **MUST** fail before any operation is applied.

Phases 1–3 apply this envelope in `SynthesisRepository`, `ProjectRegistry`, `ExtractionService`, `TaxonomyService`, `VerificationService`, `ClaimService`, `ConflictService`, `EvidenceAppraisalService`, `SchemaMigrationService`, and `MutationRepository`. The existing single-paper editor continues its 0.7.2 `WorkspaceEdit` whole-file save path unchanged.

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

After the initial revision comparison, the repository applies all operations in memory and validates the complete candidate document. It writes and flushes a temporary sibling, compares the target revision again immediately before replacement, atomically renames the temporary file over the target, and flushes the containing directory where the platform supports it. A concurrent revision change is returned as a stale-write conflict with the original operation set. Validation or I/O failure leaves the prior target intact. Multi-document authoritative mutations are not atomic and are not supported by this envelope.

Project creation preflights every manifest-owned target before writing. If initialization fails, `ProjectRegistry` removes the files created by that attempt so the same empty project root can be retried. It does not treat an existing subordinate file as disposable project state.

A stale request applies no operations and changes no authoritative target. Phase 1 appends an operational rejection event so the conflict remains visible, but it does not record a successful analytical change. The request returns:

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

Before replacement, the repository verifies that the audit log exists and has a complete final line. A known missing or truncated log blocks the write without changing the authoritative target. Project initialization is the only operation allowed to create a missing audit log.

After a successful atomic target replacement, the repository checks the log again, then appends and flushes the audit event. If the log changes or that append otherwise fails after replacement, the document remains committed, the failure reports the committed revision and original audit error, and the active runtime blocks later writes for that project in recovery mode. Other open projects are not blocked. Phase 1 does not attempt an unsafe rollback over a possibly newer document.

This contract prevents silent last-write-wins behavior for offline multi-agent and human-plus-agent edits. A future merge UI may replay a rejected operation set against the new revision; Phase 2 preserves the rejected operations but introduces no merge UI.

## 18. Audit and Decision Provenance

Git history is useful but insufficient because users may not commit after every analytical decision. The system therefore maintains an append-only audit log at `audit/events.jsonl`.

Phase 1 emits project creation, paper registration and removal, source-hash change, index rebuild, accepted document mutation, and rejected stale-revision events. Phase 2 adds extraction import, independent verification, construct and paradigm proposal/review/remap/merge, and schema-migration events. Phase 3 adds claim proposal and relationship changes, claim review and paradigm decisions, conflict proposal/reclassification/explanation changes, appraisal changes, and confidence recalculation. A construct-merge event records both the deprecated construct ID and the approved primary ID. Later phases may add gap, research-question, and advisor events.

```json
{
  "eventId": "evt_01J...",
  "timestamp": "2026-07-29T23:40:00-04:00",
  "actor": { "type": "service", "id": "IndexBuilder", "version": "0.0.0" },
  "action": "index.rebuilt",
  "objectId": "project_dissertation",
  "metadata": { "full": true }
}
```

Audit events **MUST NOT** be rewritten in place. Corrections are recorded as later events that identify the superseded event or object revision.

## 19. Known Risks

1. **Ontology design** — consistent categories without forcing every discipline into one structure.
2. **Entity normalization** — mitigated by the construct taxonomy/registry (`SYNTHESIS_DOMAIN_MODEL.md`), not eliminated by it.
3. **Evidence weighting** — Phase 3 provides a transparent versioned policy without a universal numeric score; field-specific academic judgments still require researcher review.
4. **Contradiction handling** — distinguishing real disagreement from population, method, measurement, or definition differences; mitigated by `conflictType` (`SYNTHESIS_DOMAIN_MODEL.md`).
5. **Human review workflow** — keeping AI-produced synthesis transparent and contestable under real usage load, not only in the data model.
6. **Merge-interface complexity** — presenting concurrent JSON operations in a form researchers can resolve safely.
7. **Audit growth and recovery** — retaining a long-running event stream while supporting integrity checks, compaction projections, and recovery from a truncated final line.
8. **Multi-process locking** — optimistic locking detects stale writes but does not by itself coordinate every filesystem or editor process.

## 20. Related Documents

- `PROJECTS.md` — project commands, extraction and matrix operations, Phase 3 claim workflows, authority boundaries, index recovery, and compatibility.
- `PORTABILITY.md` — cross-platform path, installed-resource, tool-discovery, bundle, and VSIX rules.
- `SYNTHESIS_DOMAIN_MODEL.md` — evidence levels, constructs, findings, synthesis claims, conflict objects, mechanisms, context, boundary conditions, candidate gaps, research-question alignment, evidence appraisal, methodological paradigms.
- `SYNTHESIS_WORKFLOWS.md` — import, extraction, normalization, verification, synthesis, conflict review, adversarial gap testing, researcher approval, dissertation planning, exports.
- `ROADMAP.md` — implementation phases, MVP scope, sequencing rationale.
- `schemas/` — JSON Schema contracts for project manifests, evidence objects, synthesis claims, construct taxonomies, and audit events.
- `SYNTHESIS_UI.md` *(not yet written)* — matrix, claim ledger, dashboards, filters, graph synchronization.

---

## Architectural Contract (summary)

> NodeGraph preserves individual paper graphs as independent evidence sources. A project-level synthesis layer creates normalized, reviewable relationships across those sources. Every dissertation-level conclusion remains traceable through paper-level interpretation to exact evidence in a version-identified source document.

The Phase 2 matrix and Phase 3 claim ledger are applications built on top of this contract. The adversarial pass and paragraph planner remain planned applications; they are not the architecture itself.
