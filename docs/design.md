# DESIGN.md — Project CLOIE Blog

> **Status:** Implemented on `design-system/port-cloie-tokens`
> **Ported from:** System CLOIE (`project-cloie` `main`), `docs/design.md` + `src/styles/tokens.css`
> **Migration record:** `docs/design-system-adaptation.md`

## 1. Authority and Scope

| Subject | Source of truth |
| --- | --- |
| Roles, meaning, behaviour, forbidden list | this file |
| Every colour, shadow, radius, and type value | `src/styles/tokens.css` |
| Composition, shared primitives, type utilities | `src/styles/global.css` |
| Print behaviour | `src/styles/print.css` + the print block in `tokens.css` |
| Mechanical enforcement | `scripts/check-tokens.mjs` (`npm run check:tokens`) |

`tokens.css` owns values; this file defines roles and never states a competing colour. MUST/MUST NOT are binding; SHOULD/SHOULD NOT require a documented reason; MAY is optional.

**Scope note.** This is a public reading-and-presentation site, not an operational application. Upstream System CLOIE governs an authenticated back-office tool, and its restraint is right there. Section 3 explains why that restraint does not transfer wholesale, and what does.

## 2. Product Design Intent

- **Product:** the public capstone document for Project CLOIE at Assumption College of Davao
- **Audience:** capstone reviewers, academic readers, and the project client
- **Character:** institutional, calm, legible, honest; a document first, a showcase second
- **Non-negotiable:** the manuscript must survive printing, and a reader must be able to find and cite any figure, table, and evidence status

### Experience Principles

1. **The document comes first.** Reading surfaces carry no decoration.
2. **Semantic roles only.** Components consume roles, never raw values.
3. **Evidence over volume.** Status is stated, never estimated.
4. **Legible status.** Colour is paired with a text label and a shape.
5. **Accessible by default.** Contrast, focus, touch targets, reduced motion.
6. **Printable.** Anything on screen must survive a page.

## 3. Surface Classification

This is the site's central design decision, and the one place it deliberately diverges from upstream.

| Class | Surfaces | Rule |
| --- | --- | --- |
| **A — Document** | chapters, abstract, contents, references, figures, tables, acronyms, 404 | Full role discipline. No gradient, no glow, no backdrop blur, no hover lift. Print-exact. |
| **B — Presentation** | the home page: hero, about, benefits, stakeholders, chapter summaries, team, sponsor | Full role discipline for colour, type, radius, and elevation. Named exceptions permitted for decoration. |
| **Chrome** | header, footer, back-to-top, skip link, scroll reveal | Presentation treatment, on every route. |

Upstream forbids decorative gradients, glow, and glass outright. Applying that verbatim would delete the site's identity from the first screen. Upstream's own escape hatch covers this case: *"Exceptions must be documented, scoped, and tokenized when reusable."* Every surviving decoration is named, scoped, and resolved from a token — none is a literal in a component.

`scripts/check-tokens.mjs` enforces the boundary: a gradient, glow, or `backdrop-filter` declaration inside a Class A reading selector fails the build.

### 3.1 Exceptions Register

| Exception | Where | Why | Owner |
| --- | --- | --- | --- |
| `--gradient-hero` | `.hero` | the site's opening statement | home |
| `--gradient-primary` | `.btn-primary`, `.skip-link`, `.back-to-top`, active jump pill | one fill and one ink for every filled primary control | chrome |
| `--gradient-footer` | `.footer` | the single large brand field | chrome |
| `--gradient-glass` | `.header` | upstream permits backdrop blur on "approved landing chrome"; the fixed header is that chrome | chrome |
| Section-title gradient | `.section-title` | home only | home |
| Card top rule + hover lift | `.card` | home only | home |
| `--brand-gold` family | ACD seal surfaces: project-client role chip, sponsor panel | gold is the ACD institutional colour. Upstream forbids gold as a *general UI family*; here it is scoped to seal identity and is never interactive or a status colour | home |
| `.chapter-banner`, `.refs-banner` gradient + orbs | route mastheads | presentation chrome that happens to sit on a Class A route; explicitly named so the exemption is visible | chrome |

**Removed during the port:** `--shadow-glow`. It existed only for the hero and sponsor hover; once those moved onto the standard elevation scale it had no consumer. A decorative token with no consumer is a trap.

## 4. Semantic Token System

### 4.1 Ownership

- `tokens.css` is the **only** file permitted to contain a colour, shadow, radius, or type value.
- `check:tokens` fails the build on a raw literal anywhere else, against a typed allowlist (`scripts/check-tokens.mjs`).
- The allowlist covers exactly: the token owner itself, the official mark, the ACD seal, and figure artwork.
- Recolouring anything inside `src/assets/cloie-logo.svg` is a build failure, not a lint warning.

### 4.2 Layers

1. **Brand references** — `--brand-blue` `#1F62F0`, `--brand-navy` `#212160`, `--brand-cyan` `#0598E3`, `--brand-gold`.
2. **Semantic roles** — surfaces, borders, text, primary family, neutral secondary, focus, selection, washes.
3. **Status** — `success`, `warning`, `danger`, `info`, `caution`, each with `-main` / `-subtle`.
4. **Visualization** — `--chart-1…5`.

The brand references are sampled from the official mark itself. The site's previous accent, `#0fa8fb`, appeared nowhere in the logo; aligning to the mark's own blue is both the brand-fidelity fix and the step that made the site agree with System CLOIE.

### 4.3 Extensions over Upstream

Every extension is marked `EXTENSION:` in `tokens.css` with its justification. Upstream has no print contract and no manuscript requirement, so each originates here.

| Extension | Reason |
| --- | --- |
| `--border-subtle` | row dividers inside a card, where a full-weight rule would read as a grid |
| `--primary-wash-subtle/muted/border/strong` | replaces 72 hand-written `rgba(15,168,251,α)` literals, derived from the live brand so they track it per theme |
| `--status-caution-main/-subtle` | the manuscript's `unresolved` / `pending` are "action required, not failed"; amber is that meaning and red would misreport it. `partial` already occupies warning |
| `--heading-accent` | replaces 11 theme branches that all said "primary-hover in light, primary in dark" |
| `--surface-tinted` | a tinted plane: opaque in light, translucent brand wash in dark, so it separates by luminance rather than by an opaque block |
| `--text-muted-on-tint` | `--text-muted` clears AA on a card but measures 4.4:1 on the tinted bands; those surfaces carry their own verified ink |
| `--orb-opacity`, `--watermark-opacity` | the loudest decoration is the first thing that must give in dark mode |
| `--shadow-cta` | a brand-tinted shadow for the primary control; the one elevation allowed a brand cast, derived from the brand rather than a literal |
| `--gradient-footer`, `--color-on-brand`, `--on-brand-muted/subtle` | the footer's brand field and its own verified ink ramp |
| `--line-height-reading` | the manuscript's 1.7 rhythm. Deliberately a bare **number**, not a rem length: a number recomputes against each element's own font size, so a 12 px badge inherits 20.4 px and a 14.4 px table cell inherits 24.48 px. A length would hand every element the body line box |
| `--print-ink`, `--print-paper`, `--print-ink-muted`, `--print-rule*` | see section 8 |

## 5. Visual Foundations

### 5.1 Typography

- **Manrope 600/700** — display, headings, titles
- **Inter 400/500/600** — body, labels, controls
- Both self-hosted latin-subset **variable** fonts, 73 KB total, preloaded. No CDN, so the site has no third-party dependency at view *or* print time.
- The eleven-step scale (`.text-display-lg` … `.text-caption`) pairs size + line-height + weight + family so no component assembles a type style by hand.
- Floors: body copy never below 0.875rem; nothing below `--font-size-caption` (0.75rem). The former 11.5 px chapter-phase label is retired.
- Headings wear `--text-primary`. The one deliberate exception is the manuscript's brand-tinted heading, which resolves to `--heading-accent` rather than to a literal.
- `tabular-nums` on figure and table numbering and any aligned numeric column.

### 5.2 Radius, Borders, Elevation

- Radius ladder: 2 / 4 / 8 / 12 / 16 / 24, plus `full` for pills.
- Cards and document panels: `rounded-xl` (16 px). `rounded-2xl` is reserved for portal and hero.
- Six-step minimal shadow scale. Strong elevation is overlay-only.
- Dark mode relies on luminance and borders before shadow; its scale is flatter and deeper rather than a copy of light.

### 5.3 Controls

Upstream's ladder — xs 24 / sm 32 / default 40 / lg 48 — with `@media (any-pointer: coarse)` raising interactive controls to 44 px. Viewport width does not identify an input method.

`.btn` carries the `lg` floor with padding landing it at 54 px, because the site's primary action is a presentation-scale control.

### 5.4 Motion

150–300 ms on opacity and transform. `prefers-reduced-motion` is honoured globally, and scroll-reveal content is forced visible rather than left hidden, so nothing depends on animation to be read.

## 6. Theme

Light and Dark, resolved before first paint by a synchronous inline script (upstream's first-paint bootstrap contract). Default follows the OS; an explicit choice persists under `cloie-theme` and wins.

**`.dark` is the only theme selector in any stylesheet.** No component branches on the theme. What used to be 57 component-level `[data-theme='dark']` overrides are now semantic roles that resolve per theme; five of them were pure no-ops and were deleted outright. `data-theme` survives as *state* for the toggle to read and write, and as nothing else. `check:tokens` fails the build if a selector reappears.

A role's meaning never changes across themes — only its value.

## 7. Accessibility

- Normal text ≥ 4.5:1; large text and meaningful non-text boundaries ≥ 3:1.
- Tinted surfaces carry their own verified ink, never the card's by inheritance.
- Focus is a 2 px `--focus-ring` at 3 px offset, on every surface, never removed.
- Status never relies on colour alone: `EvidenceStatus` pairs every colour with a text label and a dot.
- Touch targets meet the 44 px coarse-pointer floor.
- `scrollbar-gutter: stable` prevents the content jump when navigating between a scrolling and a non-scrolling route.
- Every tinted-surface pairing in section 4.3 was verified at its computed value, in both themes, by a rendered-DOM contrast pass over all ten routes — not by reading hex values.

## 8. Print Contract

Upstream has no print contract, because a dashboard never prints. This site leads here.

- `@page` is Letter with 1in margins; body 11pt at 1.5.
- The dark palette can never leak into paper. `tokens.css` re-asserts a light-only role set inside `@media print` — surfaces, ink, links, focus, shadows, and every gradient set to `none` — so the guarantee lives in the token layer rather than depending on each component having a print rule.
- Print greys are roles (`--print-ink`, `--print-ink-muted`, `--print-rule`, `--print-rule-hairline`, `--print-rule-strong`), because a printed document distinguishes structure by ink density and rule weight rather than by hue.
- A printed manuscript is the one place pure black and pure white are correct.
- Print keeps the fills that carry meaning: diagram plates and evidence-status pills print their fills so the distinction survives on paper.
- Nothing may be hidden that exists only on screen, and no scroll container may clip a wide table.

## 9. Forbidden

On **Class A** surfaces, without exception:

- raw colour, shadow, radius, or type values
- gradient, glow, backdrop blur, hover lift, or any other decoration
- a stylesheet selector that branches on the theme
- a tinting step chosen by hand instead of a `--primary-wash-*` role
- colour-only status
- text below `--font-size-caption`
- removing or replacing a visible focus ring

On **all** surfaces:

- recolouring, inverting, filtering, or cropping the official mark
- gold as an interactive or status colour
- a decorative token with no consumer
- a new token that duplicates an existing role's meaning

## 10. Enforcement

`npm run verify` runs `lint → check → check:tokens → build → check:links`. `check:tokens` fails on:

1. a raw colour literal outside the allowlist
2. a recolour inside the official mark
3. a cyclic token reference (a `--x: var(--x)` chain, which silently invalidates every consumer)
4. any stylesheet branching on `[data-theme]`
5. any reference to a retired `--cloie-*` alias
6. decoration inside a Class A reading selector

Checks 3 and 6 were both written after they caught a real defect during this migration.