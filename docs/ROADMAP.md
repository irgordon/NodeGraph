# NodeGraph — Synthesis Layer Roadmap

**Status:** Phase 2 implemented in the 0.0.0 development baseline
**Related documents:** `ARCHITECTURE.md` · `SYNTHESIS_DOMAIN_MODEL.md` · `SYNTHESIS_WORKFLOWS.md`

Schema validation, provenance integrity, and taxonomy normalization are load-bearing for every later phase and are not deferred — data accumulated before they exist would require costly migration once governance is retrofitted. Phases below reflect that ordering.

---

## Task 0 — Fork and contract stabilization

Task 0 establishes a verified NodeGraph 0.7.2 fork and settles persistence contracts before synthesis runtime work begins.

- Preserve the existing single-paper editor, `.nodegraph.json` shape, PDF quote-jump behavior, and HTML export.
- Map existing code to the proposed component boundaries without refactoring runtime behavior.
- Define draft-07 schemas for the manifest and every manifest-owned or referenced document.
- Centralize identifiers, paths, hashes, timestamps, review state, relationships, and revision tokens.
- Settle evidence hashing, taxonomy redirects, per-document revisions, atomic writes, conflicts, migrations, and read-only fallback.
- Verify valid, invalid, traversal, stale-revision, cross-reference, approval, taxonomy, version, and canonical-hash fixtures.

Task 0 contains documentation, schemas, fixtures, and contract verification tooling only. It introduces no project repository, `IntegrityService`, synthesis UI, or other Phase 1 implementation.

Before Phase 1 runtime work began, the unimplemented `1.0.0` contract was corrected to add authoritative source records, authoritative evidence storage, and searchable paper-index metadata. This was a pre-runtime correction, not a migration. The first Phase 1 runtime that can write project data freezes schema `1.0.0`.

### Task 0 exit criteria

- A clean upstream checkout builds with the documented production command.
- All five shipped single-paper graphs validate, and existing source/export code remains behaviorally unchanged.
- Every path named by the project manifest maps to a draft-07 schema.
- Absolute and traversal paths fail schema and runtime containment checks.
- Evidence hashes are deterministic and exclude self-referential or mutable fields.
- Deprecated constructs resolve directly to an approved primary.
- Stale `baseRevision` values produce a no-write conflict response.
- Existing and proposed capabilities are explicitly distinguished.

## Phase 1 — Multi-paper project support + integrity foundation

**Status:** Implemented and covered by the Phase 1 integration suite.

- Project manifest + subordinate-document structure (`ARCHITECTURE.md` §7)
- Paper registry, shared templates, metadata indexing, cross-paper search
- Strict schema validation (syntactic + structural, `ARCHITECTURE.md` §10)
- `IntegrityService`: evidence-link and provenance checker (`ARCHITECTURE.md` §8)
- Per-document revision checks, atomic writes, and append-only operational audit events

### Phase 1 exit criteria

- A project containing 100 paper manifests opens without fully hydrating paper graphs.
- Invalid paper graphs are rejected with actionable diagnostics.
- Replacing a source PDF produces a stale-evidence warning.
- An index can be deleted and rebuilt without loss of authoritative state.
- A write based on a stale revision is rejected rather than overwritten.

The Phase 1 baseline surface is deliberately small: VS Code commands exercise project creation, opening, paper registration and removal, validation, full index recovery, and indexed metadata search. Phase 2 extends that baseline without changing its authority boundaries.

## Phase 2 — Standardized extraction + normalization + synthesis matrix

**Status:** Implemented and covered by the Phase 2 integration suite.

- Standardized extraction fields, methodological paradigm/technique tagging (`SYNTHESIS_DOMAIN_MODEL.md` §2–3)
- Construct taxonomy/registry (`SYNTHESIS_DOMAIN_MODEL.md` §4)
- Evidence cells, source verification workflow (`SYNTHESIS_WORKFLOWS.md` §4)
- Lazy-loaded summary index (`ARCHITECTURE.md` §9)
- CSV export
- Additive project schema `1.1.0` and an explicit researcher-invoked migration from frozen `1.0.0`

### Phase 2 exit criteria

- Standardized extraction records validate against the documented domain rules.
- Unapproved construct proposals cannot enter approved synthesis objects.
- Matrix views load from the summary index and hydrate source detail on demand.
- Source, interpretation, and classification verification remain independently visible.
- Matrix CSV has stable columns, full quoting, Unicode support, and spreadsheet-formula protection.
- Phase 1 and legacy single-paper tests remain unchanged and green.

## Phase 3 — Claims, conflicts, and evidence-quality weighting

- Synthesis claim objects
- Support/contradiction relationships with `conflictType` (`SYNTHESIS_DOMAIN_MODEL.md` §6)
- Context comparisons, evidence-quality weighting (`SYNTHESIS_DOMAIN_MODEL.md` §7, §10)
- Claim ledger

### Phase 3 exit criteria

- Every synthesis claim resolves through paper-level findings to source evidence.
- Conflicts carry an explicit type and preserve dissenting evidence.
- Confidence explanations expose their rule inputs rather than only a score.

## Phase 4 — Gap-to-question alignment + adversarial red-teaming

- Population coverage, methodological gap analysis
- Candidate gap detection
- Formalized adversarial pass (`SYNTHESIS_WORKFLOWS.md` §7)
- Gap-to-question graph, alignment report

### Phase 4 exit criteria

- Candidate gaps distinguish absence from non-reporting and extraction uncertainty.
- Gaps with `reviewState.approval.researcher: "approved"` have a reproducible adversarial-pass record.
- Every research question exposes a complete upstream evidence chain.

## Phase 5 — Dissertation planning

- Thematic section builder, paragraph evidence bundles (`SYNTHESIS_WORKFLOWS.md` §9)
- APA-ready tables
- Outline and appendix exports
- Audit trail (`ARCHITECTURE.md` §18) — present from Phase 1 onward operationally, formalized in export form here

### Phase 5 exit criteria

- Section plans contain only approved claims or explicitly marked unresolved claims.
- APA-ready and appendix exports preserve evidence identifiers and review status.
- Audit export can reconstruct each approval and reclassification decision.

## Minimum Viable Synthesis Version

The MVP is a product milestone assembled from selected capabilities across Phases 1–4; it is not expected at the completion of Phase 2. The first useful version does not require every feature above. A strong MVP:

1. Import several `.nodegraph.json` paper files, with integrity checking on import.
2. Extract standardized metadata and findings against a project construct taxonomy.
3. Display a paper-by-theme synthesis matrix, rendered from a lazy-loaded summary index.
4. Allow the researcher to mark findings as support / conflict / qualification, with conflict type.
5. Create a synthesis claim linked to source quotations via provenance-anchored evidence links.
6. Show population and methodology coverage.
7. Link each research question to supporting gap evidence, including at least a manual adversarial-pass note.

This scope is sufficient to make the application materially useful for a doctoral literature review, without deferring the integrity/normalization work that would otherwise require migration later.

## Sequencing Rationale

The original phase ordering (draft v0.1) placed schema validation and provenance checking in a later "governance" phase. This was revised because:

- Data written before validation exists cannot be trusted retroactively without a migration pass.
- Construct-taxonomy drift compounds the longer normalization is left ungoverned — early papers processed without a taxonomy produce duplicate constructs that must be manually merged later.
- The adversarial pass and researcher-approval boundary are trust mechanisms, not UI polish; shipping gap detection without them risks candidate gaps being treated as established findings in early usage.

Everything after Phase 2 builds on a corpus that is already validated, normalized, and provenance-checked.

## Future / Not Yet Scoped

- `SYNTHESIS_UI.md` — matrix, claim ledger, dashboards, filters, graph synchronization in detail.
- Concurrency/merge UI for simultaneous human + agent edits: `baseRevision` optimistic-locking mechanism is specified (`ARCHITECTURE.md` §17), but the side-by-side diff/merge view for resolving conflicts is not yet designed.
- Cross-project taxonomy sharing (e.g. reusing a construct registry across multiple dissertations/literature reviews).
