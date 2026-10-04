# Adapting the System CLOIE Design System to CLOIE-Blog

> **Status:** Implemented on branch `design-system/port-cloie-tokens`.
> The normative contract is now `docs/design.md`; this file is the migration record.
>
> **Delivered:** phases 0-7 complete. 158 token declarations; 0 raw colour literals
> outside the allowlist; 0 theme branches in any stylesheet; 0 of the original 57
> `[data-theme='dark']` overrides remaining; 0 rendered contrast failures across
> 10 routes x 2 themes (baseline: 712); layout within 1px of baseline on every
> probed block. Enforcement in `scripts/check-tokens.mjs` (6 gates) and
> `npm run verify`.
> **Source of truth for the design system:** `~/Documents/capstone/project-cloie` (`main` @ `511402d`)
> **Target:** this repository (Astro 7, static, MDX)
> **Reviewed:** 2026-09-11

---

## 1. Audit — System CLOIE (`project-cloie`)

### 1.1 Authority chain

The app treats design as a governed artifact, not as accumulated CSS. Three files, each with one job:

| Layer | File | Owns |
| --- | --- | --- |
| Normative | `docs/design.md` (591 lines) | roles, meaning, behavior, forbidden list |
| Values | `src/styles/tokens.css` (265 lines) | every hex/shadow/radius number |
| Mapping | `src/app/globals.css` (465 lines) | token → Tailwind/shadcn semantic classes |

`docs/design.md` §1 states the ownership rule explicitly: *"`tokens.css` owns numerical values — this file defines roles and usage, never competing hex values."* There is exactly one place a color value may appear.

### 1.2 Token model

A three-layer ladder (`docs/design.md` §5.1):

1. **Brand references** — institutional navy `#221d60`, ACD cyan `#0369a1`, bright cyan `#25aae1`, operational blue `#2563eb`. Values only; not consumed directly.
2. **Semantic UI roles** — `surface-primary/secondary/tertiary/muted/hover/input/popover/overlay`, `scrim`, `border-default/strong`, `input-border`, `text-primary/secondary/muted/disabled`, `primary` + `hover/active/on/soft/muted/border`, `link-color`, `focus-ring`, `selected-bg/fg`, `secondary-bg/hover/border/fg`.
3. **Status and visualization** — `success/warning/danger/info` each with `-main` and `-subtle`, plus `chart-1…5`.

Every role resolves twice — `:root` for light, `.dark` for dark — with the **pairing across themes treated as part of the contract** (§5.2). A role may not change meaning between themes; only its value may.

The mapping layer is bidirectional and explicit: CLOIE names get registered into `@theme inline`, and shadcn's 20 generic variables (`--background`, `--foreground`, `--card`, `--ring`, `--destructive`, …) are *pointed at CLOIE roles*. That is why no component ever writes a hex — `globals.css:§shadcn semantic mappings` is a single translation table.

### 1.3 Typography

- **Manrope 600/700** — display, headings, titles
- **Inter 400/500/600** — body, labels, controls
- **11-step scale** (`globals.css`): display-lg/md, heading-xl/lg/md, title-lg/md/sm, body-lg/md/sm, label-lg/md/sm, caption — each a `.text-*` utility pairing size + line-height + weight + family, so no call site ever assembles a type style.
- Hard floors: body copy ≥ 0.875rem, nothing below 0.75rem, decision text ≥ 0.875rem (§6.1).
- Fonts are self-hosted via `next/font` (`src/app/fonts.ts`) with a `--font-manrope` / `--font-inter` variable pair — no CDN, no FOUT variable name invented at the call site.

### 1.4 Foundations

- **Radius:** 2 / 4 / 8 / 12 / 16 / 24 px, with role assignment (inputs `rounded-lg`, cards `rounded-xl`, portal/hero `rounded-2xl`).
- **Spacing:** 4/8 px rhythm; `gap-*` over `space-*`; 16 px component gap, 24 px section gap.
- **Elevation:** a 6-step minimal shadow scale. §6.3: *"Decorative blur is prohibited; backdrop blur is limited to overlays or approved landing chrome."* Strong elevation is overlay-only. Dark mode uses luminance and borders *before* shadow.
- **Control heights:** 24 / 32 / 40 / 48 px ladder, with `pointer-coarse:` (defined as `(any-pointer: coarse)`) raising touch targets to 44 px.

### 1.5 Forbidden list (§13) — the enforcement surface

This is the part worth stealing, because each entry is a specific failure the app had already made:

- raw hex in components
- component-local theme palettes or raw-color `dark:` overrides
- different component structure by theme
- **gold as a general UI family**
- **cyan as default secondary action**
- recolored/inverted logos
- **pure-black, neon, glow, glassmorphism, decorative gradients**
- Radix or another icon/chart/toast library; emoji icons
- per-page navigation; placeholder-only labels; color-only status
- decorative chart animation; arbitrary z-index; ad hoc type scales

Two escape hatches, both documented rather than silent:
- **§13 Exceptions** — must be documented, scoped, and tokenized when reusable (institutional navy on formal report cards is the canonical case).
- **`src/features/design-system/data/raw-color-allowlist.ts`** — a typed allowlist of path patterns → approved hex values → justification, covering logos, PWA iconography, and `theme_color` metadata.

### 1.6 Governance

- `src/features/design-system/CONTEXT.md` — domain vocabulary (semantic design token, appearance preference, synchronous first-paint bootstrap) plus four numbered invariants.
- **Appearance model:** Light / Dark / System (`src/features/design-system/lib/appearance.ts`), defaulting new users to System, persisted, resolved **before first paint** via a same-origin `public/appearance-bootstrap.js` — explicitly not a hydration-only provider.
- **Production-surface inventory** (`data/production-surface-inventory.ts`) — every UI file given exactly one disposition (`task`, `already_compliant`, `redirect`, `not_found_placeholder`, `generated`, `approved_exception`). No unowned surface.
- **Design System Showcase** (`/design-system`, protected) — a live reference route rendering tokens and components across themes, viewports, and every required state.
- **Accessibility floor (§11):** ≥4.5:1 text, ≥3:1 non-text, tinted surfaces carry their own verified ink, never inherited card ink; focus ring never removed; status never color-only.

---

## 2. Audit — CLOIE-Blog (current state)

### 2.1 Stack

Astro 7, `output: 'static'`, MDX, GitHub Pages. **No Tailwind, no React, no UI library.** Styling is hand-written CSS: 8 global stylesheets (2 764 lines) plus scoped `<style>` blocks inside 18 `.astro` components.

### 2.2 What already works

The blog is **not** starting from zero. There is already a token layer:

- 20 distinct `--cloie-*` custom properties in `src/styles/global.css`, resolved twice (`:root` / `[data-theme='dark']`).
- **222 references** across CSS, components, and pages — the primitives (`--cloie-text`, `--cloie-bg-card`, `--cloie-border`, `--cloie-shadow-md`, `--radius-lg`, `--transition-base`) are genuinely load-bearing and consistently used.
- Light/dark is theme-aware with a **pre-paint inline script** in `BaseLayout.astro`, OS-following until the visitor makes an explicit choice, persisted under `cloie-theme`. Functionally equivalent to the app's bootstrap.
- `prefers-reduced-motion` is honored globally, with an explicit carve-out so scroll-reveal content is never left hidden.
- The logo plate rule is already satisfied: circular white disc behind a dark vector mark, documented with the containing-block reasoning (`global.css:--cloie-logo-surface`).
- A real design vocabulary already exists in the components: `Callout` with `insight`/`objective`/`synthesis` variants, and `EvidenceStatus` — a 7-state evidence pill with a written tone rule (*"`unreported` and `unresolved` are muted, never red"*), which is exactly the "status never by color alone" discipline the app's §11 demands.

### 2.3 Where it diverges from the app's system

| Dimension | System CLOIE | CLOIE-Blog |
| --- | --- | --- |
| Palette | 3 families, ~60 semantic roles, navy + cyan + operational blue | 2 accents: cyan `#0fa8fb` + gold `#ffd700` |
| Tint discipline | named `-soft`/`-muted` roles | 72 raw `rgba(15, 168, 251, α)` variants, α hand-picked 0.02–0.5 |
| Theme mechanism | `.dark` class, roles re-resolve | `[data-theme='dark']`, **57 component-level overrides** |
| Type | Manrope + Inter, 11-step token scale | Plus Jakarta Sans + Inter via Google CDN; ad-hoc `clamp()` per surface |
| Radius | 2/4/8/12/16/24 | 8/12/16/24 + `full` (2 and 4 missing) |
| Elevation | 6-step minimal, no glow | 5 shadows + a dedicated **glow** shadow, glass gradient, 7 × `blur()`, 21 gradient refs, 39 orb refs |
| Status | 4 semantic status roles | ad-hoc per-component hexes in `EvidenceStatus.astro` |
| Docs | `design.md` + `CONTEXT.md` + inventory + allowlist + showcase | one unrelated plan doc |
| Enforcement | allowlist + inventory + showcase | none (`verify` = lint/check/build/links) |

Quantified: **~100 raw color literals**, **57 dark overrides**, **72 cyan alpha tints**, **5 shadow tints plus glow**, **6 `background-clip: text`** treatments (gradient wordmarks in `header__logo-text` and `section-title`).

### 2.4 The honest read

Two of these divergences are defects and should be fixed: the 57 scattered dark overrides and the hand-picked alpha tints both exist *because there is no semantic layer to consume*. The rest — hero orbs, gradient wordmark, glow on hover — are **deliberate, load-bearing identity on a public-facing marketing/manuscript surface**, not accidents.

This is the central finding of the audit, and it means the adaptation must **not** be a 1:1 copy of §13's forbidden list.

---

## 3. Position: one system, two surface classes

System CLOIE's §13 already anticipates this. Its escape hatch reads: *"Exceptions must be documented, scoped, and tokenized when reusable. Institutional navy on formal report cards is the canonical example; ordinary cards do not qualify."*

So the blog adopts the **system** and classifies its **surfaces**, rather than adopting the app's restraint wholesale:

- **Class A — Document surfaces** (chapters, front matter, references, figures, tables, contents, 404). Reading and citation. Rules: full token discipline, no decoration, print-exact, WCAG AA floor. These are ~70% of the site and the part a capstone reviewer actually reads.
- **Class B — Presentation surfaces** (hero, about, team, sponsor, benefits). Identity and persuasion. Rules: token discipline for *color, type, radius, elevation*; documented named exceptions for orbs, gradient wordmark, and hero lift.

Gold and glow are therefore not deleted and not blessed — they are **named, scoped, tokenized exceptions** with an owner, which is precisely what the app's own governance demands of itself.

---

## 4. Plan

Seven phases, each independently shippable and verifiable with the repo's existing `npm run verify`. Phases 0–2 carry nearly all the value.

### Phase 0 — Governance (docs only, no visual change)

- `docs/design.md` for the blog: normative roles and behavior, Class A/B surface rule, the forbidden list *as scoped to Class A*, the named exceptions, and MUST/SHOULD/MAY keywords matching the app's §1.
- `docs/design-system-adaptation.md` (this file) retained as the migration record.
- Capture a **raw-color baseline**: a script that enumerates every hex/rgba in `src/` and diffs it against a checked-in allowlist, so drift is visible before it is enforced.
- Inventory every styling surface with one disposition each, mirroring `production-surface-inventory.ts`.

*Exit:* `npm run check:tokens` reports the current count; no visual diff.

### Phase 1 — Token layer port (the core)

- Port `tokens.css` structure and role names verbatim — surfaces, borders, text, primary/hover/active/on/soft/border, brand accent, status ×4 with subtle surfaces, chart 1–5, focus ring, selected, scrim, sidebar-equivalent, the 6-step shadow scale, the 6-step radius scale, spacing reference.
- Adopt `.dark` as the class, **keeping `[data-theme='dark']` working** via a single alias rule so the 57 existing overrides do not break on day one. Retire the old selector in a later phase.
- **Compatibility layer:** keep all 20 `--cloie-*` names as aliases onto the new roles (`--cloie-blue: var(--color-primary)` etc.). This is the key migration-safety decision: the 222 existing references keep rendering while the codebase migrates to semantic names at its own pace. No big-bang rewrite, no flash of unstyled content.
- Re-key the cyan: `#0fa8fb` is a *brand mark* color; `#2563eb` is the app's operational primary. Adopt `#2563eb` as `primary` for interaction and keep bright cyan `#25aae1` available as a brand reference for the mark, the logo plate glow, and hero — so identity is preserved through a reference token rather than through a hardcoded hex.
- Re-key gold: `--brand-gold` as an **institutional seal reference** (ACD identity), explicitly *not* a general accent, per the app's "gold as a general UI family" prohibition. Its 5 current call sites (client badge, project-client role, two about-panel rules, sponsor role chip) are all institutional — the demotion is a rename, not a redesign.

*Exit:* `npm run verify` green; light and dark render identically to today; zero raw color literals outside `tokens.css` for the roles already ported.

### Phase 2 — Typography

- Self-host **Manrope 600/700** (display, headings, titles) and **Inter 400/500/600** (body, labels, controls) as local woff2 with `font-display: swap` and preload, replacing the Google Fonts CDN link — matching the app's `next/font` variable pattern (`--font-manrope` / `--font-inter`) without Next.
- Port the 11-step scale as `.text-*` utilities with paired size/line-height/weight/family, then retire the ad-hoc `clamp()` scales on Class A surfaces.
- Manrope is a geometric grotesque and a closer sibling to Plus Jakarta Sans than Inter is, so the visual delta on headings is small; body copy becomes Inter, which raises legibility at the manuscript's 15 px / 1.8.
- Add `tabular-nums` to numeric surfaces (figure/table numbering, evidence counts, the abstract's objective count).

*Exit:* no class in the codebase sets a raw `font-size` for a *role*; roles resolve to tokens.

### Phase 3 — Interaction, status, and accessibility floor

- Replace the 3 px cyan outline with the app's `--focus-ring` (`#0284c7` light / `#38bdf8` dark) at the app's 2 px + 3 px offset.
- Adopt the control-height ladder and the `pointer-coarse` custom variant so touch targets reach 44 px — the header burger, mobile nav, chips, and back-to-top all qualify today.
- Motion budget 150–300 ms on opacity/transform; keep the existing reduced-motion blanket, and extend it to `scroll-behavior` (already present).
- **Rework `EvidenceStatus.astro` onto the four status roles.** The 7 states map cleanly: `verified` → success, `partial` → warning, `unresolved`/`pending` → a documented amber-orange that needs a *named fifth role* (`status-caution`) since the app's four do not cover it; `deferred`/`changed` → info; `unreported` → neutral muted. This is the single highest-value adaptation: it turns the manuscript's defining idiom from hand-picked hex into contract-governed tokens, and preserves the written tone rule that `unreported` is never red.
- Verify every status pairing at ≥4.5:1 on its own tint in both themes — the app's §11 rule that tinted surfaces carry their own verified ink.
- Add `--status-caution` to `tokens.css` on both themes and record it as an extension of the app's status contract, with justification, in `design.md`.

*Exit:* contrast audit passes in both themes; no color-only status anywhere.

### Phase 4 — Component recipes on semantic tokens

- Re-key `.btn` (3 variants), `.card`, `.chip`, `.badge`, `.section-title`, `.focus`, and the grid utilities onto semantic roles.
- Complete the radius scale: introduce 2 px and 4 px where 8 px is currently doing quiet work, and reserve `full` for pills only.
- Re-key the shadow scale to the app's 6 steps and confine the app's rule that strong elevation is overlay-only.
- Preserve the blog's own documented layout intelligence while doing this — the `Reveal > * { height: 100% }` grid fix, the `.badge { align-self: flex-start }` blockification fix, the `--ms-bleed` full-bleed table that cannot introduce a horizontal scrollbar. These are load-bearing and must survive the re-key untouched.

*Exit:* every component selector resolves only semantic roles.

### Phase 5 — Decoration governance (the contested phase)

Per-surface decisions, Class A strict / Class B exempt:

| Treatment | Class A | Class B | Action |
| --- | --- | --- | --- |
| Hero orbs + float animation | ✗ | ✓ documented | keep, retint to brand references |
| Gradient wordmark (`background-clip: text`) | ✗ | ✓ documented | keep, retint |
| `--cloie-shadow-glow` on hover | ✗ | ✓ scoped to hero/sponsor only | confine, don't delete |
| `gradient-glass` + header `backdrop-filter` | ✗ (reading) | header chrome only | keep as approved landing chrome, per §6.3's own carve-out |
| Hover `translateY(-4px)` on cards | ✗ | ✓ documented | keep |
| Section-title gradient on reading pages | ✗ | ✓ | scope to home |
| Reading-surface `clamp()` type | → tokens | → tokens | Phase 2 |

Everything removed from Class A moves to the allowlist if it survives anywhere, so nothing disappears without a recorded decision.

*Exit:* `docs/design.md` exceptions table lists every surviving decorative treatment with its owner and scope; zero undocumented decoration on a Class A route.

### Phase 6 — Print (the blog leads here)

`print.css` is 259 lines of manuscript-print rules — letter margins, unclipped tables, forced-open disclosures. **System CLOIE has no print contract at all**, because a dashboard never needs one. The blog should own this and specify it explicitly:

- print tokens resolve to a light-only set (no `color-scheme` reset leaks, no orb/glow printing)
- Class A surfaces print exactly as the Class A screen contract specifies
- The allowlist's canonical justification is extended to cover print-only overrides

*Exit:* `print.css` consumes tokens rather than raw values, and `design.md` has a print section the app could adopt.

### Phase 7 — Enforcement

- Add `npm run check:tokens` to the existing `verify` chain: fails on a raw color literal outside `tokens.css` unless the path matches the allowlist, and warns on any `[data-theme='dark']` component override.
- Ship a static `design.md`-driven token reference page, the Astro equivalent of the app's protected Showcase — on the blog it can be public, since a token reference contains nothing secret.
- Freeze the retired `--cloie-*` aliases and `[data-theme]` selector; new code has no path to them.

*Exit:* the audit that was manual in Phase 0 is now a build step.

---

## 5. Decisions needed before Phase 1

1. **Cyan identity.** Adopt `#2563eb` as interaction primary, keeping bright cyan `#25aae1` as a brand reference for the mark and hero? *Recommended: yes* — it is the app's own split between operational primary and brand accent, and it removes the largest single raw-color cluster.
2. **Gold.** Demote to a documented institutional-seal reference, or remap entirely to navy/cyan? *Recommended: demote.* All 5 call sites are ACD-institutional, so this is a rename plus a doc entry, not a redesign.
3. **Print contract.** Confirm the blog should own a print section in `design.md` that the app has no equivalent for.
4. **Tailwind.** *Recommended: no.* The design system lives in tokens plus semantic roles, which is framework-agnostic; the blog's scoped-style model already works, and Tailwind v4 would add a build dependency for no design-system gain. Port the **semantics**, not the toolchain.

## 6. Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| 57 dark overrides break on `.dark` migration | high | dual-selector alias in Phase 1, retire per-file later |
| Print output regresses | high | Phase 6 gated on a print diff; `print.css` untouched until Phase 6 |
| Hero identity lost to over-strict application of §13 | high | Class A/B split in Phase 0, before any visual work |
| 222 alias references never migrate to semantic names | medium | Phase 7 freezes the aliases; the check script reports legacy usage |
| Self-hosted fonts add weight / regress FOUT | low | `swap` + preload; only 5 weights |
| Status mapping needs a role the app lacks | low | `--status-caution` added deliberately and documented |

---

## 7. What actually shipped, and what changed from the plan

Recorded after implementation, because two findings moved the work.

### The accent was never a brand colour

The plan assumed the old accent `#0fa8fb` was a brand colour to be retargeted. Sampling the official mark showed it appears **nowhere** in `src/assets/cloie-logo.svg` — the mark's own colours are `#1F62F0` blue, `#212160` navy, `#0598E3` cyan, and the same file is byte-identical to System CLOIE's. The site had been styled with an invented cyan that did not match its own logo. Phase 1 therefore sampled the brand references from the mark itself, which made the alignment both a brand-fidelity fix and the thing that brought the two surfaces into agreement.

### The largest accessibility win was incidental, not designed

Darkening the footer from a light cyan to the brand blue took white footer text from ~3.4:1 to ~8:1. That one change removed roughly 380 of the 712 baseline contrast failures. The remainder came from three real defects the token layer exposed: white ink on a light-blue dark-theme primary (2.5:1), muted ink at 4.4:1 on the tinted banner bands, and `--text-muted` inherited by a tinted panel it was never verified against.

### Two bugs the new tooling caught in me

Both were written specifically to fail on something, and both did:

- **Token cycles.** The colour migration rewrote `--scrim: rgba(15,23,42,0.5)` into `--scrim: var(--scrim)` — a self-reference that silently invalidates every consumer. Check 3 was added during phase 1 and caught it immediately.
- **A compounding rename.** Retiring the `--radius-*` aliases used a placeholder that the next rule in the chain matched inside, collapsing all four radius names onto the final step and injecting NUL bytes into 8 files. Recoverable only because replacement was in-place and the originals were in git. A per-file rendered-pixel comparison against the baseline build now confirms all 26 radius sites still compute to their original value.

### Deviations from the plan

- **No Tailwind**, as recommended. Confirmed unnecessary: the design system lives in tokens and roles, and the scoped-style model was untouched.
- **The compatibility layer was not needed as a bridge.** The `--cloie-*` aliases existed for one commit's worth of migration and were deleted outright within the same phase rather than carried as debt. Phase 1's stated benefit — "the 222 existing references keep rendering" — was achieved by the alias block during the intermediate commits, not by keeping it afterwards.
- **An eleventh token surfaced during verification**: `--line-height-reading`, a bare number rather than a rem length. Pairing the 16px body with the 18px step's `1.8rem` added 1.6px to every text line and grew the page 4.5%. A number recomputes against each element's own size; a length does not.
- **`--shadow-glow` was deleted rather than scoped.** Phase 5 proposed confining it. Once the surfaces that used it moved onto the standard elevation scale it had no consumer, and an unused decorative token is worse than none.

### Not done

- **Phase 7's public token-reference page.** The upstream Showcase has no equivalent here yet. A token reference is cheap and static, but it adds a route to a document site whose value is its navigation, so it wants a decision rather than a default.
- **The authored chapter components are unexercised.** `Section`, `Callout`, `Table`, `Chips`, `Keywords`, `EvidenceStatus`, `Disclosure`, `CardGrid` are in the library but the shipped MDX only imports `Figure`. They were re-keyed and verified by reading, not by rendering; the first chapter that uses them is the real test.
