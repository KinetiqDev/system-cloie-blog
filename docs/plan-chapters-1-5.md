# Plan — Restructure the CLOIE site to the 2026 Capstone format (Chapters 1–5)

**Branch:** `docs/blog-content-refresh`
**Scope:** Chapters 1–5 + front matter + routing/layout. Appendices deliberately out of scope.

## 1. The situation in one paragraph

The site currently serves three chapters written against the **old** BSIT format (`1.1 Background of the Study` … `1.7 Conceptual Framework`, `2.1 Related Literature / 2.2 Related Studies / 2.3 Related Systems / 2.4 Synthesis`, `3.1 Framework / 3.2 Requirements / 3.3 Feasibility`). The 2026 guide (`Capstone_Technical_Document_Guide_2026.docx`) mandates a **five-chapter manuscript with a different section skeleton per chapter**, and it explicitly demotes several artifacts the site currently leads with (IPO conceptual framework, Gantt, per-study lit summaries). This is therefore a **restructure, not an edit**: Ch 1–3 get rewritten against the new skeletons, Ch 4–5 are new, and the guide's "evidence over volume" principle changes *how* each page is written, not just what it contains.

Two source documents, both fetched via Composio:

| Doc | Role | Status |
| --- | --- | --- |
| `Capstone_Technical_Document_Guide_2026.docx` | Normative format. All skeletons below derive from it. | Authoritative |
| `ProjectCLOIE-Technical-Document.md` (3.7 MB, 39 figures) | The actual CLOIE manuscript. The **content source** for chapters 1–5. | Content source |

Cached locally at `.tmp-docs/` (gitignored, delete before merge).

### The single most important editorial rule

The CLOIE manuscript is unusually honest: it reports **"Not reported"** wherever evidence is missing (Table 5.1 has no completion percentage; Table 5.2 shows 3,878/3,879 passing but leaves gated DB and E2E layers blank; performance is unverified). The guide rewards exactly this ("evidence over volume", "avoid unsupported claims"). **The site must not launder this into confident prose.** Every gap on the site stays visible. This drives the `EvidenceStatus` component in §5.

## 2. Target information architecture

```
/                                   Landing (existing, chapter index auto-extends to 5)
/abstract                           NEW  — front matter
/contents                           NEW  — full TOC (all ch, 3 levels)
/figures                            NEW  — List of Figures
/tables                             NEW  — List of Tables
/acronyms                           NEW  — List of Abbreviations
/chapter1  Project Context and Definition
/chapter2  Review of Related Literature, Technologies and Systems
/chapter3  Project Methodology and Engineering Process
/chapter4  Requirements and System Design      NEW
/chapter5  Implementation, Evaluation and Project Outcomes   NEW
/references                         existing
```

**URL stability is a hard constraint.** `/chapter1`–`/chapter3` must keep working. Front matter goes under its own routes, not under chapter slugs, so no existing URL changes.

⚠️ **Route fragility to fix first.** `chapterPath()` and `[...slug].astro` both use `chapter.id`, not `chapter.data.slug`. Today `id` coincidentally equals the declared slug (`chapter1`) because Astro's glob loader mangles `chapter-1.mdx` → `chapter1`. The `slug` field is declared in the schema and documented in comments but **never read**. Renaming a source file would silently change a public URL. Fix before adding files: have `chapterPath()` return `/${chapter.data.slug}` and `[...slug].astro` use `params: { slug: chapter.data.slug }`.

## 3. Content model changes

`src/content.config.ts` — add to the `chapters` schema:

| Field | Type | Purpose |
| --- | --- | --- |
| `part` | `'front' \| 'main'` | Drives page-numbering treatment (Roman vs Arabic) and header grouping |
| `sections` | `{ id, title, kind }[]` | **Optional.** Hand-curated sub-nav for chapters with >9 sections. Auto-derived from `headings` today; Ch 2/4/5 will overflow the jump row and need grouping |
| `updatedAt` | `date` | Freshness signal on Chapter 5, which is explicitly pre-final |

Add a second collection `frontMatter` (base `./src/content/front-matter`) with `{ title, navLabel, order, description }` — same loader pattern as `chapters`, so header/footer/home derive it with no hardcoding. Mirror the glob-loader pattern; do not special-case.

## 4. Chapter plans

Legend: **New** = new page · **Rewrite** = new skeleton, same subject matter · **Keep** = largely reusable prose.

### Chapter 1 — Project Context and Definition `/chapter1` · **Rewrite**

Guide order: context → problem → objectives → scope → significance → success criteria → terms.

| § | Section | Action | Layout / component | Figures |
| --- | --- | --- | --- | --- |
| 1.1 | Background and Problem Context | Rewrite from old *1.1 Background of the Study*. Lead with ACD + OBE + CHED MO 46, 2012, not with "computerization". Add baseline evidence. | Prose + `Callout variant="insight"` ("Why an IT intervention is appropriate") | — |
| 1.2 | **Problem Statement** | **New section.** 6 numbered manifestations from the manuscript §1.2. | `CardGrid variant="method"` + 6 `Card` (numbered `tag`) | — |
| 1.3 | Project Objectives | Rewrite from old *1.2*. 1 general + OBJ-01…OBJ-04, each with an explicit measurability clause. | `Callout variant="objective"` for the general objective; `CardGrid variant="topic"` for the four | — |
| 1.4 | Scope, Boundaries and Constraints | Rewrite from old *1.4 Scope and Delimitation*. Subsections: scope / users & org scope / system boundaries / technical & operational constraints. Add the role-vs-scope distinction. | `CardGrid variant="scope"` split **In scope** (`tone="accent"`) vs **Does not replace** (`tone="warn"`) | — |
| 1.5 | Significance and Intended Beneficiaries | Rewrite from old *1.3*. Collapse the manuscript's 10 flat H3s into a beneficiary grid. | `CardGrid variant="significance"` — 10 `Card` | — |
| 1.6 | **Success Criteria / Expected Outcomes** | **New section.** Table 1.1, 4 rows. Must be framed as *targets to be evidenced*, not results. | **New `Table.astro`**, caption above | — |
| 1.7 | Definition of Terms | Keep, trimmed. 12 project-specific terms. | `CardGrid variant="term"` | — |

**Dropped:** old *1.5 Time and Place of the Study* (not in the guide) and old *1.7 Conceptual Framework*. The IPO figure (`conceptual-framework.png`) is on the guide's **conditional, not automatically required** list — do not carry it into Ch 1. `src/assets/conceptual-framework.png` and `src/assets/gantt-chart.png` can be deleted from the site.

### Chapter 2 — Review of Related Literature, Technologies and Systems `/chapter2` · **Rewrite**

The structural change is the point: the site currently presents lit and studies as two separate buckets (one-source-per-card). The guide requires **thematic synthesis**. The manuscript already does this in 8 themes — port them and drop the old bucket split.

| § | Section | Action | Layout / component | Figures |
| --- | --- | --- | --- | --- |
| 2.1 | Thematic Review of Literature and Technical Evidence | **Regroup** old *2.1 + 2.2* into 8 themes: OBE & CQI · outcome assessment & curriculum alignment · stakeholder-based evaluation · QA/accreditation/evidence management · learning analytics & attainment reporting · qualitative feedback analysis · privacy & security · usability & accessibility. Each theme = 2–3 **synthesizing** sources, one card per theme not per source. | `CardGrid variant="topic"` — 8 `Card` with `tag` = theme name | — |
| 2.2 | Review of Related Systems / Existing Solutions | Rewrite old *2.3*. Three systems: Nuventive/Penn State, OSU (Nuventive + Azure), UP Quality Assurance Portal. **Comparison table is the deliverable** — the cards are secondary. | 3 `Card` + **Table 2.1** comparison matrix (criteria: features, architecture, platform, usability, security, integration, limitations, cost) | Fig 2.1–2.6 (Penn State quick-start, Nuventive gradebook, Nuventive outcomes, UP QA system overview, UP survey environment, UP web QA portal) |
| 2.3 | Synthesis, Gap and Project Contribution | Rewrite old *2.4*. What the evidence collectively shows → what is unresolved for ACD → how CLOIE responds. | `Callout variant="synthesis"` for the gap statement | — |

**CardGrid variant additions needed:** `theme` (for 2.1) and `system` (exists, reuse for 2.2).

### Chapter 3 — Project Methodology and Engineering Process `/chapter3` · **Rewrite (major expansion)**

Goes from 3 sections to 7. This is the biggest delta in the plan.

| § | Section | Action | Layout / component | Figures |
| --- | --- | --- | --- | --- |
| 3.1 | Development Approach and Lifecycle | Rewrite from old *3.1*. Justify Kanban, then describe *actual* implementation: iteration length, planning, reviews, retrospectives, release strategy, roles, artifacts. **A lifecycle diagram alone is explicitly insufficient.** | `Callout variant="insight"` ("Why Kanban was selected") + `CardGrid variant="method"` for the iterative cycle | `Kanban-workflow-figure.png` (have it) |
| 3.2 | Requirements Elicitation & Stakeholder Engagement | **New.** Elicitation methods, analysis, prioritization, validation, change control, approval. Point forward to Ch 4 for the artifacts themselves. | `CardGrid variant="method"` per activity + `Callout` on change management | — |
| 3.3 | Development Workflow, Collaboration & Configuration Management | **New.** Trunk-based integration, issue/vertical-slice workflow, code review & quality gates, environment/config management, dependency management, **individual contribution evidence**. | `CardGrid variant="method"` | — |
| 3.4 | Secure and Responsible Development | **New.** Identity/authorization/confidential data · validation, secrets, dependencies · backup & incident readiness · responsible AI-assisted interpretation. | 4 × `Card tone="accent"` | — |
| 3.5 | Verification, Validation & Testing Strategy | **New.** Strategy *before* results: layers, environments, responsibilities, entry/exit criteria, defect handling, retesting, evidence retention. | `CardGrid variant="method"` per test layer | — |
| 3.6 | Project Management, Risks and Milestones | Old *3.3 Feasibility Issues* is **demoted** here. Milestone/release table + risk register. | **Table 3.1** (milestones) + **Table 3.2** (risks: likelihood, impact, mitigation, owner, status) | `gantt-chart.png` — optional, collapsed behind a disclosure, since the guide says full Gantt belongs in appendices |
| 3.7 | Feasibility and Sustainability | Rehome old *3.3* here. Technical/operational · schedule/organizational · economic & sustainability. Only where it materially affects the project. | `CardGrid variant="feasibility"` (exists) | — |

**Note for 3.4:** the manuscript has a genuinely distinctive subsection — *Responsible AI-Assisted Interpretation*. The guide calls this out explicitly for AI-enabled projects. Give it a full card, not a bullet.

### Chapter 4 — Requirements and System Design `/chapter4` · **New page, heaviest on diagrams**

The guide's warning applies hard here: *"A diagram should answer a technical question, not exist merely because it appears in a template."* One figure per subsection, each with a stated question it answers.

| § | Section | Action | Layout / component | Figure (from `Figures/`) |
| --- | --- | --- | --- | --- |
| 4.1 | System Context and Stakeholders | New. Boundary, external actors, service dependencies, stakeholder responsibilities. | Prose + boundary list | `figure 4.1 - context diagram.png` |
| 4.2 | Requirements Specification | New. Prioritized functional requirements, measurable non-functional, security/privacy, data/integrity, integration/infrastructure, acceptance criteria, traceability pointers. | **New `Table.astro`** + `CardGrid variant="requirement"` (exists) | — |
| 4.3 | Use Case / User Interaction Model | New. Actor groups, major use cases, role-scoped interaction summary. | Actor chips (`Chips`) | `figure 4.2 - high level use case diagram.png` |
| 4.4 | Solution Architecture | New. Client/presentation layer, request & application boundary, modular monolith, data access, external services, **decisions & trade-offs**. | Layered prose + `Callout variant="insight"` per trade-off | `figure 4.3 - high level logical architecture diagram.png` |
| 4.5 | Data Design | New. Conceptual/logical model + core entities. Full data dictionary → appendix. | Prose + `Callout` on sensitive-data handling & retention | `figure 4.4 - high level erd.png` (or `erd.png` — pick one, see §5) |
| 4.6 | Component, API and Integration Design | New. Modules, Server Actions / app interfaces, auth integration, DB integration, analytics & text-processing pipeline, failure handling. | `CardGrid variant="method"` per module | — |
| 4.7 | User Experience and Interface Design | New. Key flows, navigation, conventions, responsive behaviour, feedback/error states, accessibility, **how stakeholder feedback changed the design**. | Prose + `Callout` on the feedback loop | — |
| 4.8 | Security and Privacy Design | New. Auth, role/scope authorization, response integrity, evaluation confidentiality, input/state validation, secrets & comms, logging/audit/backup, **threat & trust-boundary analysis**. | Prose + threat list | `figure 4.6 - Trust boundaries and sensitive data flow.png` |
| 4.9 | Deployment / Infrastructure Design | New. Runtime environment, app hosting, self-hosted Supabase backend, public routing & external services, config & secrets, migration/backup/recovery. | Prose + config table | `figure 4.7 - Deployment and infrastructure topology.png` |

**Deferred to appendices:** `Figure C.1. Detailed UML use-case model` — the guide explicitly lists "detailed sequence diagrams for every use case" as conditional. Also the manuscript's component architecture (App E.1) and all 15 UI screenshots (E.18–E.32) — 5.1 says the manuscript must not become a screen-by-screen manual.

### Chapter 5 — Implementation, Evaluation and Project Outcomes `/chapter5` · **New page, highest editorial risk**

This is where the site's honesty rule is load-bearing. 5.2–5.5 are full of "Not reported" and "in progress". That is the correct content and it must survive into the site.

| § | Section | Action | Layout / component | Evidence state |
| --- | --- | --- | --- | --- |
| 5.1 | Implemented Solution & Key Technical Features | New. 11 capability areas (identity/auth, academic structure, learning outcomes, course assignment & rosters, instrument management, deployment & response collection, stakeholder workflows, analytics, qualitative feedback, Gen Ed) + a **small** curated UI screenshot set. | `CardGrid variant="system"` — 10 `Card` | Screenshots: pick ≤4 from E.18–E.32, no more |
| 5.2 | Requirements Fulfillment | New. **No completion percentage.** Report status honestly: FR-01/02/03 exist but Appendix F links are incomplete. Note the curriculum-versioning removal as a recorded architecture decision. | **Table 5.1** using the new `EvidenceStatus` values (`Verified` / `Partial` / `Deferred` / `Changed` / `Unresolved`), many cells **"Not reported"** | ⚠️ Incomplete by design |
| 5.3 | Testing & Quality Evaluation Results | New. Headline: **429 files, 3,879 tests, 3,878 passed, 1 skipped, 0 failed.** Then per-characteristic status, all keyed to ISO/IEC 25010:2023 with only the characteristics that matter here justified. Gated DB suites, browser E2E, accessibility, and **performance** all unverified. | **Table 5.2** + `CardGrid variant="method"` per quality characteristic | ⚠️ Mixed — one strong row, four blank |
| 5.4 | Alpha/Beta/Pilot/User Acceptance | New. **12 participants, 5 stakeholder groups, 99 task ratings, 76.77% Accepted.** Participants, tasks, instruments, results, feedback, revisions, retesting, acceptance. Privacy: no personal data. | **Table 5.3** + `CardGrid variant="method"` per session phase | Strongest evidence in the manuscript |
| 5.5 | Discussion of Results & Limitations | New. Results vs objectives, vs success criteria, vs related work. Technical strengths, remaining limitations, known defects & technical debt, institutional constraints, residual risks. | `Callout variant="insight"` for strengths; `Card tone="warn"` for limitations | Candid by design |
| 5.6 | Deployment, Handover & Operational Readiness | New. Deployment status, production config, DB migration, backup/recovery, user documentation, training, maintenance ownership. | Checklist-style `CardGrid` | — |
| 5.7 | Conclusions & Recommendations | New. Evidence-based: which objectives were met, which were not, and what must happen before Final Defense. Recommendations for scaling/integration/maintenance/future work. | Prose + `Callout variant="synthesis"` | — |

## 5. Figure and table inventory

### Figures to copy into `src/assets/`

| Source (`Figures/`) | Destination section | Notes |
| --- | --- | --- |
| `figure 4.1 - context diagram.png` | 4.1 | |
| `figure 4.2 - high level use case diagram.png` | 4.3 | |
| `figure 4.3 - high level logical architecture diagram.png` | 4.4 | |
| `figure 4.4 - high level erd.png` | 4.5 | Rename on copy — spaces and `4.4` in filenames are a nuisance |
| `figure 4.6 - Trust boundaries and sensitive data flow.png` | 4.8 | |
| `figure 4.7 - Deployment and infrastructure topology.png` | 4.9 | |
| `Kanban-workflow-figure.png` | 3.1 | Already in `src/assets/` |
| `gantt-chart.png` | 3.6 | Optional/collapsible. Guide prefers appendices |
| `erd.png` | — | **Duplicate** of figure 4.4. Pick one, discard the other |
| `conceptual-framework.png` | — | **Drop.** IPO frameworks are on the guide's conditional list. Remove from `src/assets/` |
| `Figure C.1. Detailed System CLOIE UML use-case model.png` | — | **Defer to appendices** |

Figures 2.1–2.6 are third-party screenshots (Penn State, UP). Copyright and hotlinking make these the highest-risk assets. **Resolve before publishing** — either link out with attribution, use a fair-use excerpt, or drop and describe in prose.

### ⚠️ Figure numbering reconciliation

The manuscript numbers the trust-boundary figure **4.5** and deployment **4.6**. The `Figures/` directory names them **4.6** and **4.7**. Settle on one continuous Ch 4 sequence (4.1–4.7) and apply it in the site, the manuscript, and the figure filenames simultaneously. Numbering by chapter throughout (guide: "Number consecutively by chapter or throughout") — pick per-chapter.

Also: every file is 1.1–3 MB PNG. These will be the site's largest assets by far. Convert to WebP/AVIF with a sane max width (the diagrams are read at ~800px in a ~760px container, so 2× is plenty) before committing.

### Tables to build

New `Table.astro` component, **caption above** (the guide is explicit; the existing `Figure.astro` already has caption-below, so the two components will be deliberately asymmetric).

| Table | Section | Shape |
| --- | --- | --- |
| 1.1 Project Success Criteria | 1.6 | Objective ID · Criterion · Measurement/Evidence · Acceptance Threshold |
| 2.1 Comparison of Related Systems | 2.2 | System × criteria matrix |
| 3.1 Milestone and Release Summary | 3.6 | Milestone · Release · Status · Date |
| 3.2 Major Project Risk Summary | 3.6 | Risk · Likelihood · Impact · Mitigation · Owner · Status |
| 5.1 Requirements Fulfillment Summary | 5.2 | Status · Count · Percentage · Basis — **most cells "Not reported"** |
| 5.2 Automated Verification Summary | 5.3 | Test category · Executed scope · Passed · Failed · Evidence status |
| 5.3 User Validation Summary | 5.4 | Group · n · Ratings · Accepted · Needs revision · Failed |

Tables 5.1–5.3 should be horizontally scrollable on mobile with a sticky first column, and use `<caption>`, `<th scope>` and a `<caption>`-linked id for screen readers.

## 6. New components and layouts

| Component | Purpose | Why it can't be prose |
| --- | --- | --- |
| `chapter/Table.astro` | Manuscript table with caption above, sticky header, mobile scroll | 7 tables, all wide, all needing identical semantics |
| `chapter/EvidenceStatus.astro` | Status pill: `Verified` / `Partial` / `Deferred` / `Changed` / `Unresolved` / `Not reported` | This is the manuscript's defining visual idiom. It must be scannable, not buried in prose |
| `chapter/Disclosure.astro` | Collapsed block for deep detail (Gantt, screenshots, data dictionary excerpts) | Keeps "evidence over volume" literal — detail is present, not the default |
| `FrontMatterLayout.astro` | Shared shell for abstract/contents/figures/tables/acronyms | 5 near-identical pages |
| `lib/figures.ts` | Registry: slug → number, caption, alt, section, file | Powers `/figures`, and auto-numbers without hardcoding |

**`EvidenceStatus` is the design centerpiece.** The manuscript's credibility rests on visibly marking what is and isn't proven. Give it a restrained treatment: neutral for `Verified`, amber for `Partial`, muted grey for `Not reported`, never red — red would read as failure where the content says "not yet evidenced."

## 7. Home page and navigation

`index.astro` already derives its chapter index, hero range, and first/last chapter from `getChapters()` — it will pick up Ch 4–5 automatically. Needed changes:

- **Chapter cards**: the `#chapters` section is currently a flat list. With 5 chapters spanning "problem" → "method" → "design" → "results", add a phase label per card (`Context` · `Evidence` · `Process` · `Design` · `Outcomes`) so the card list reads as an argument, not a list.
- **Front matter block**: a compact strip linking abstract / contents / figures / tables / acronyms, above the chapter cards.
- **Honesty strip**: the home page currently implies a finished system. Add one line stating validation status (e.g. "3,878 of 3,879 automated tests passing · validation in progress") and link to 5.2/5.3. This is the guide's principle applied to the landing page.
- **Header**: with 5 chapters + 5 front-matter pages, the header nav will overflow. Collapse chapters behind a "Chapters" disclosure on narrow viewports; keep front matter in the footer.
- **Footer**: extend the auto-derived column to include front matter.
- **`revenue`/`home.css`**: add grid styles for the new `phase` labels and the front-matter strip.

## 8. Accessibility and print

- Every diagram needs real alt text describing the *relationships* it shows, not "architecture diagram". The trust-boundary and deployment figures in particular encode security claims — their alt text is doing load-bearing explanatory work.
- Add `<figure>` + `<figcaption>` semantics (already present in `Figure.astro`); extend to tables.
- Add a **print stylesheet** (`@media print`). The guide mandates Letter, 1in margins, 1.5 body spacing, Roman prelim / Arabic main page numbers. A docs site that prints correctly is a genuine differentiator, and the manuscript will be submitted as PDF from somewhere.
- Heading order: MDX `##` → `h2`. The banner uses `h1`, so chapter sections must stay at `h2` to keep the outline valid for screen readers.
- The `Reveal.astro` scroll animation must be disabled under `prefers-reduced-motion` **and** in print.

## 9. Work order

Each step is independently shippable; the site builds green throughout.

1. **Fix route identity** — `chapterPath()` and `[...slug].astro` to use `data.slug`. Verify `/chapter1`–`/chapter3` still resolve. *Do this first; everything after depends on it.*
2. **Copy + optimize figures** into `src/assets/figures/`, settle the 4.5/4.6 vs 4.6/4.7 numbering, delete `conceptual-framework.png`, resolve the 2.1–2.6 copyright question.
3. **Build `Table.astro` + `EvidenceStatus.astro` + `Disclosure.astro`** against a real table from Ch 1 so the components are proven before 5 chapters depend on them.
4. **Front matter**: new collection, `FrontMatterLayout`, the 5 routes. TOC and List of Figures should generate from content, not be hand-written.
5. **Ch 4** (new page, all 6 figures) — do it before the rewrites; it exercises every new component at once.
6. **Ch 5** (new page, 3 tables, all the evidence-status content).
7. **Ch 1 rewrite** → **Ch 3 rewrite** → **Ch 2 rewrite** (longest-to-shortest, so the pattern is established by the time Ch 2 needs it).
8. **Home page + header/footer** updates.
9. **Print stylesheet, a11y pass, `Reveal` reduced-motion.**
10. Remove `.tmp-docs/`.

## 10. Open questions for you

1. **Figures 2.1–2.6** are screenshots of Penn State's and UP's live systems. Publish as images, link out, or describe in prose? This affects whether Ch 2 §2.2 has any visual content at all.
2. **The 4.5/4.6 vs 4.6/4.7 mismatch** — which numbering is canonical, the manuscript's or the figure filenames'?
3. **"Not reported" cells on the public site.** The manuscript is internal. Does the public site show the incomplete status, or a completed-status version once validation finishes? The plan assumes honest-and-current; if the site must present a finished project, that changes Ch 5 substantially and I want to know before writing it.
4. **Numbering scheme**: per-chapter (Figure 4.1, 5.2) or continuous through the manuscript? The plan assumes per-chapter.
5. **Where do the appendices land?** `/appendix/a`–`/appendix/f` as peer routes, or a single `/appendices` index? Out of scope now, but it constrains the front-matter work in step 4.
6. **Print/PDF.** Want a print stylesheet, or should the site instead link a generated PDF of the manuscript?

## Implementation reconciliation

The implementation uses the actual manuscript prose rather than speculative
rewrites. Requirement identifiers in Chapter 4 and Chapter 5 disagree in the
source document. Both are retained with the manuscript's reconciliation warning.
The beta participant table is Faculty, Students, Secretary, Alumni, and Program
Heads. Industry Partners were not a participant group in that recorded cycle.

Seven manuscript tables are listed. No new Chapter 4 tables or acceptance claims
were invented. The eight converted figures total about 772 KB. The external
systems screenshots and appendix content remain excluded. Print animation is
disabled; combined PDF generation and manuscript page-numbering are not provided.

Temporary Composio exports were removed after the source reconciliation. The
working branch is not committed or deployed by this task.
