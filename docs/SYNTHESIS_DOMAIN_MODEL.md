# NodeGraph — Synthesis Domain Model

**Status:** v0.7 (Phase 3 claims and claim-ledger baseline)
**Related documents:** `ARCHITECTURE.md` · `SYNTHESIS_WORKFLOWS.md` · `ROADMAP.md`

This document owns the research concepts the synthesis layer models: evidence levels, constructs, findings, synthesis claims, conflict objects, mechanisms, context, boundary conditions, candidate gaps, research-question alignment, evidence appraisal, and methodological paradigms. It assumes the component boundaries, persistence model, and invariants defined in `ARCHITECTURE.md`.

---

## 1. Evidence Levels

Three levels, each linking to the one below via the provenance anchoring defined in `ARCHITECTURE.md` §8:

1. **Source evidence** — exact quotation from the paper.
2. **Paper-level interpretation** — a bounded statement about that one paper.
3. **Cross-paper synthesis** — a statement derived from multiple papers.

```
Synthesis claim
   |
   v
Paper-level findings
   |
   v
Exact quotations
   |
   v
Original PDFs
```

Levels 1–2 build on existing NodeGraph 0.7.2 capabilities — paper-level nodes, source quotations, and PDF quote-jump verification — formalized into explicit evidence and interpretation objects. Phase 3 implements Level 3 as authoritative claims that resolve through extracted findings to exact evidence.

## 2. Standardized Extraction Schema

Every paper in a literature-review project exposes a common field set, so that cross-paper comparison is possible at all:

- Research problem
- Purpose
- Research questions / hypotheses
- Theoretical framework
- Key constructs
- Population
- Setting
- Sample size
- Methodology
- Data collection
- Analysis method
- Findings
- Mechanisms
- Moderators
- Limitations
- Boundary conditions
- Recommendations
- Exact evidence quotations

**Rule:** original source language is preserved; normalization is additive, never a silent overwrite.

```json
{
  "sourceTerm": "distributed team leadership",
  "normalizedConstruct": "shared leadership",
  "mappingStatus": "pending"
}
```

Each field has an explicit reporting status. `not-extracted` is the neutral initialization state for a newly registered paper. It is distinct from `not-reported`, `unclear`, `absent`, and `not-applicable`, and the matrix never interprets it as proof of absence. Repeated items, findings, construct mappings, and evidence references use stable identifiers.

## 3. Methodological Paradigm & Analytical Technique

A quantitative paper that reports a statistical effect and a qualitative paper that reports themes should not be treated as directly comparable, even when both address the same construct. The paradigm tag keeps these different kinds of evidence visible.

```json
{
  "methodologicalParadigm": {
    "id": "interpretive",
    "label": "Interpretive",
    "registryVersion": 1
  },
  "researchApproach": "qualitative",
  "analyticalTechnique": "thematic-analysis",
  "sampleCharacteristics": {
    "n": 142,
    "unitOfAnalysis": "individual"
  }
}
```

The built-in paradigm registry may begin with `positivist`, `interpretive`, `critical`, and `pragmatist`, but those values are not universal or exhaustive. Project-approved additions use the same registry mechanism rather than bypassing normalization.

Paradigm and approach are visible in the Phase 2 matrix and the Phase 3 claim ledger. A claim that crosses paradigms needs an explicit researcher decision; NodeGraph never combines that evidence automatically (Core Invariant 12, `ARCHITECTURE.md` §4).

## 4. Construct Registry (Taxonomy)

If normalization is performed independently across 100–300 papers, prompt-level variance will split identical constructs into near-duplicate synonyms (e.g. "shared leadership" vs. "participative leadership" vs. "distributed leadership" treated as distinct).

The project's `constructTaxonomy` is the single source of truth for normalized construct names, owned at the architecture level by `TaxonomyService` (`ARCHITECTURE.md` §6). An agent may only:
- propose a mapping of a source term to an **existing** taxonomy entry, or
- propose a **new** taxonomy entry, which requires explicit researcher approval before it becomes usable anywhere else in synthesis.

Unapproved proposed constructs sit in a pending-merge queue; they are never silently instantiated.

**Non-destructive merges.** When Construct B is merged into Construct A, B may already be referenced by pending synthesis claims or by historical audit records. Merging never rewrites those references in place. Textual synonyms belong in A's `aliases`; identifier resolution is carried by retaining B as `deprecated` with `primaryConstructId` set to A:

```json
[
  {
    "constructId": "construct_shared_leadership",
    "canonicalName": "shared leadership",
    "aliases": ["distributed leadership", "participative leadership"],
    "status": "approved"
  },
  {
    "constructId": "construct_participative_leadership",
    "canonicalName": "participative leadership",
    "aliases": [],
    "status": "deprecated",
    "primaryConstructId": "construct_shared_leadership"
  }
]
```

Objects that referenced Construct B remain valid and resolve B → A through `primaryConstructId`; they are not rewritten to A. `ConstructResolver` rejects missing targets, self-references, deprecated-to-deprecated chains, and primaries that are not `approved`.

Only an active, researcher-approved construct can be the source of a merge. Its former canonical term and aliases are normalized and deduplicated into the approved primary's textual aliases. The taxonomy version increments once, and the audit event records both construct IDs.

## 5. Synthesis Matrix

The primary comparison interface. Not another large graph.

| Paper | Shared leadership | Trust | Pending / unmapped |
|---|---|---|---|
| Smith 2024 | 2 findings · source verified | No extracted data | — |
| Jones 2025 | 1 finding · interpretation pending | 1 finding · classification disputed | — |
| Lee 2023 | No extracted data | — | “distributed team influence” |

Clicking a cell opens the paper-level finding, supporting quotations, method and population, source and normalized terms, and independent verification status.

Phase 2 implements papers × approved constructs plus one visible pending/unmapped column when needed. Filtering covers paper, construct, paradigm, approach, analytical technique, population, year, and verification state. Research-question, claim, conflict, and evidence-quality modes remain planned for later phases.

**Sync requirement:** selecting a matrix cell focuses the corresponding evidence nodes in the graph view, and vice versa. The matrix renders from the lazy-loaded summary index defined in `ARCHITECTURE.md` §9, not from fully hydrated paper graphs.

**Rule:** Phase 2 matrix cells expose extraction content and review state. They never assign `supports`, `contradicts`, or another Phase 3 relationship.

## 6. Agreement and Conflict Objects

**Relationship types:**
`supports` · `partially-supports` · `contradicts` · `extends` · `qualifies` · `replicates` · `fails-to-replicate` · `uses-different-definition` · `uses-different-population` · `uses-different-method`

These ten kebab-case values are the complete persisted vocabulary. UI labels may replace hyphens with spaces, but repositories never persist alternate spellings.

A synthesis claim stores a stable identifier, text, claim type, explicit finding relationships, exact evidence references, approved construct references when applicable, a cross-paradigm decision, optional confidence explanation, multidimensional review state, origin, and timestamps. A normal `synthesis` claim needs findings from at least two distinct papers. `single-study-proposition` is the explicit one-paper exception. Every finding must exist in its paper's extraction and have at least one exact evidence record included by the claim.

```json
{
  "conflictId": "conflict_014",
  "claimId": "claim_shared_leadership",
  "conflictType": "contextual-divergence",
  "findingRefs": [
    {
      "paperId": "paper_001",
      "findingId": "finding_004",
      "relationship": "supports"
    },
    {
      "paperId": "paper_007",
      "findingId": "finding_019",
      "relationship": "qualifies"
    }
  ],
  "possibleExplanations": [
    {
      "explanationId": "explanation_command_context",
      "type": "context",
      "text": "Centralized command may explain the different result.",
      "contextComparisonIds": ["context_organization_type"],
      "reviewState": {
        "verification": { "source": "pending", "interpretation": "pending", "classification": "pending" },
        "approval": { "researcher": "not-reviewed", "advisor": "not-reviewed" },
        "origin": "ai"
      }
    }
  ],
  "contextComparisons": [],
  "reviewState": {
    "verification": { "source": "pending", "interpretation": "pending", "classification": "pending" },
    "approval": { "researcher": "not-reviewed", "advisor": "not-reviewed" },
    "origin": "ai"
  }
}
```

`conflictType` distinguishes `direct-empirical-inconsistency` (opposite-signed effects under materially identical conditions) from `contextual-divergence` (e.g. peacetime vs. active-combat samples), `methodological-artifact` (different instruments/analytic techniques), or `conceptual-disagreement` (different definitions of the same construct name). These require different researcher responses and are never collapsed into one undifferentiated `contradicts` bucket.

**Rule:** disagreement is never flattened into a vote count. Five studies agreeing and one disagreeing does not mean the five are correct — the dissenting study may have the stronger design or more relevant population.

Conflict creation is explicit, never inferred from relationship co-occurrence. Reclassification changes `conflictType` and records rationale but preserves every finding relationship, including dissent. Possible explanations remain separately reviewable proposals.

## 7. Context and Boundary-Condition Model

Every finding links to structured context fields, answering *"under what conditions does this finding hold?"*:

Country · Sector · Organization type · Military or civilian · Operational tempo · Team size · Hierarchy level · Workforce composition · Remote or colocated · Task complexity · Study year · Technology environment · Crisis or routine operations

Phase 3 comparisons emit `same`, `different`, `missing`, `not-reported`, or `unclear`, preserving source values beside normalized values. Values that are not recorded by the extraction contract remain `missing`; they are not invented. Context is surfaced as a possible explanation for divergent findings and can inform researcher classification of `conflictType` (§6). It never sets the type automatically and is never asserted as causal.

## 8. Mechanism Mapping

Node types for causal/explanatory chains:
`mediator` · `moderator` · `antecedent` · `outcome` · `boundary condition` · `proposed mechanism` · `empirically tested mechanism`

```
Transformational leadership
        |
        v
Psychological safety
        |
        v
Knowledge sharing
        |
        v
Incident-response coordination
```

**Rule:** proposed mechanisms (conceptual/discussion-paper claims) and empirically tested mechanisms never receive equal evidentiary weight or equivalent visual treatment.

## 9. Population and Evidence-Gap Model

| Population | # Studies | Evidence quality | Coverage |
|---|---|---|---|
| Private-sector software teams | 28 | Moderate | Strong |
| Civilian government cyber teams | 7 | Mixed | Limited |
| Active-duty military cyber teams | 2 | Low | Sparse |
| Mixed military-civilian-contractor teams | 0 | None | Absent |

Also surfaces: populations never studied, countries overrepresented, methods overused, theories repeatedly assumed but untested, outcomes measured only via self-report, missing longitudinal research, missing operational environments.

Population coverage distinguishes absence from missing or ambiguous reporting:

```json
{
  "populationCoverage": {
    "status": "present",
    "value": "active-duty military cyber personnel"
  }
}
```

Allowed analytical statuses are `present`, `absent`, `not-reported`, `unclear`, and `not-applicable`. Phase 2 also uses `not-extracted` as an internal initialization state. A missing or not-yet-extracted value must not be converted automatically into an absent population.

**Rule:** these are **candidate gaps**, never **confirmed gaps**. A candidate gap is not usable in Chapter 1/2 until it has an adversarial-pass record (`SYNTHESIS_WORKFLOWS.md` §7).

## 10. Evidence-Quality Weighting

The authoritative `synthesis/evidence-appraisals-v1.2.json` document stores per-paper appraisal records. Each record is bound to a source-document hash and extraction revision and carries structured fields for peer-reviewed status, study design, sample size, sampling method, measurement validity, reliability, study timing, self-report dependence, replication status, methodological limitations, target-population relevance, methodological paradigm, and analytical technique. Source wording is retained beside normalized values. `absent`, `not-reported`, `unclear`, and `not-assessed` remain distinct.

```
Supporting studies: 8
High-relevance studies: 3
High-quality studies: 2
Contradicting studies: 2
Confidence: Moderate
```

**Rule:** confidence labels are rule-based and explainable, never an unexplained model score. Agent-created appraisals remain proposals. Researcher approval of an appraisal is independent from source, interpretation, and classification verification.

```
Moderate confidence because the minimum evidence and reviewed appraisal inputs are available, but the high-confidence rule is not fully satisfied.
```

### Confidence policy

Phase 3 uses policy `nodegraph-evidence-confidence` version `1.0.0`. It returns only `not-assessed`, `low`, `moderate`, or `high` and stores the full explanation on the claim.

- `not-assessed`: no supporting relationship exists; a referenced evidence record is missing, stale, or rejected; a current researcher-approved appraisal is missing; target-population relevance or methodological limitations are not assessed; or a required cross-paradigm decision is not approved.
- `low`: minimum inputs are available, but reviewed high-relevance dissent has fewer than major limitations, all reviewed evidence has low target-population relevance, or all reviewed supporting evidence reports major methodological limitations.
- `high`: at least two supporting papers remain, no dissenting paper or unresolved conflict remains, at least one reviewed appraisal has high target-population relevance, and reviewed measurement validity or reliability is adequate.
- `moderate`: the minimum inputs are available and neither the low nor high rule applies.

Unknown inputs never count as weak inputs. Study count alone cannot select a label, and a numerical majority cannot erase stronger dissent. The saved explanation includes the policy and version, finding references, appraisal IDs, support and dissent counts, appraisal statuses, conflict and paradigm state, stale/disputed/rejected/missing counts, plain-language reasons, reported limitations, source hashes, extraction/appraisal/conflict revisions, taxonomy version, and calculation time. A changed source, extraction, appraisal, conflict, or taxonomy state makes the prior explanation stale until it is explicitly recalculated.

## 11. Gap-to-Question Model

```
Observed problem
   |
   v
Established knowledge
   |
   v
Conflicting or incomplete evidence
   |
   v
Population/context gap
   |
   v
Research question
   |
   v
Planned method
```

Example instantiation:
- **Established:** Shared leadership is associated with trust in civilian technical teams.
- **Boundary:** Results are mixed in highly hierarchical settings.
- **Population gap:** Mixed military-civilian-contractor cybersecurity teams are rarely studied.
- **Unresolved issue:** It is unclear how formal authority and distributed expertise jointly shape trust.
- **Research question:** How do members of mixed military cybersecurity teams describe the relationship between formal authority, distributed expertise, and trust?

A committee member can click any research question and see the full evidence chain that justified it, including the adversarial-pass result supporting the underlying gap (`SYNTHESIS_WORKFLOWS.md` §7).

## 12. Review State Dimensions

An object's review status is not one enum — it can be simultaneously source-verified and classification-disputed:

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

Dashboard summary example:
```
412 extracted quotations
287 source-verified
164 interpreted findings
91 interpretation-verified
23 synthesis claims
8 researcher-approved
```

**Rule:** the UI never visually equates an agent-generated classification with a researcher-approved conclusion.

## 13. Claim Ledger

The backbone artifact for Chapter 2 drafting. One row per synthesis claim:

| Synthesis claim | Support | Conflict | Context | Quality | Status |
|---|---|---|---|---|---|
| Shared leadership increases trust | 7 papers | 2 papers | Mostly civilian | Moderate | Reviewed |
| Trust improves knowledge sharing | 9 papers | 1 paper | Broadly consistent | High | Reviewed |
| Formal hierarchy suppresses expertise | 3 papers | 3 papers | Context dependent | Low | Open |

Each thematic paragraph in the dissertation traces to one or more ledger claims.

Phase 3 implements this as a rebuildable summary index backed by saved claims, conflicts, appraisals, extractions, and evidence. Opening a current ledger checks file hashes and loads no paper graph or exact evidence record. Selecting one row reads only that claim's related extraction and evidence detail. The ledger keeps AI origin, disputed classifications, unresolved conflicts, cross-paradigm decisions, `not-assessed`, and stale confidence visible rather than presenting them as approved conclusions.
