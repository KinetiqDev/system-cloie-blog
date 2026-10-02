# CLOIE-Blog

The public site for **PROJECT CLOIE** — a capstone technical companion for
*System for Comprehensive Learning Outcomes and Instructional Evaluation*.

It publishes the project overview, the manuscript chapters, and the reference
bibliography as a fully static site. There is no CMS, no database and no server
runtime: every page is a Markdown (or MDX) file rendered to HTML at build time.

## Why Astro

The site was a Vite + React single-page app until this migration. That worked,
but it was the wrong shape for a document-first site:

- **The manuscript was trapped in JSX.** Chapters 1–3 were 120–180 line React
  components, with the prose, the card grids, the jump-link lists and the
  layout all tangled together. Rewriting a chapter meant editing a UI file.
- **Everything shipped to the browser.** A chapter that never changes was still
  parsed and hydrated as a React tree, and `framer-motion` shipped to animate
  things CSS already does.
- **Content was hand-registered.** The header, the footer, the home page chapter
  grid and the previous/next links each had their own hardcoded list of
  "Chapter 1 / Chapter 2 / Chapter 3".

Astro removes all three problems: prose lives in Markdown, presentation lives in
`.astro` components that render to static HTML, and routing is the filesystem.
Client JavaScript is now limited to the five behaviours that genuinely need a
browser (theme toggle, header disclosures, mobile drawer, scroll reveal,
back-to-top) and totals a few kilobytes.

The CLOIE visual identity — colours, typography, card system, chapter banners,
dark/light palettes — was carried over as-is.

## Project structure

```
src/
├── assets/                   Images, imported so Astro hashes them and
│                             applies the configured base path
├── components/
│   ├── chapter/              Presentational blocks used from chapter MDX
│   │   ├── Callout.astro       Key Insight / objective / synthesis panels
│   │   ├── Card.astro          A single cell inside a CardGrid
│   │   ├── CardGrid.astro      Column layout for a group of cards
│   │   ├── Chips.astro         Inline pill row
│   │   ├── Figure.astro        Figure + caption
│   │   └── Section.astro       One manuscript section, rendered as a card
│   ├── BackToTop.astro      Back-to-top button + top-of-page sentinel
│   ├── Footer.astro         Site footer
│   ├── Header.astro         Logo, top-level nav, theme toggle, mobile drawer
│   ├── Icon.astro           Renders the inline Lucide geometry
│   ├── NavMenu.astro        One top-level disclosure in the header bar
│   └── Reveal.astro         Scroll-triggered entrance wrapper
├── content/
│   ├── chapters/            ← THE MANUSCRIPT LIVES HERE
│   │   ├── chapter-1.mdx
│   │   ├── chapter-2.mdx
│   │   └── chapter-3.mdx
│   └── references/
│       └── bibliography.md  ← THE REFERENCE LIST LIVES HERE
├── content.config.ts        Content collection schemas (metadata contract)
├── layouts/
│   ├── BaseLayout.astro     <head>, theme bootstrap, header/footer shell
│   └── ChapterLayout.astro  Chapter banner, jump nav, CTA, prev/next
├── lib/
│   ├── chapters.ts          Chapter ordering, neighbour lookup, TOC labels
│   ├── icons.ts             Lucide icon path data (generated, do not edit)
│   └── url.ts               Base-path aware URL helpers
├── pages/
│   ├── [...slug].astro      Renders every chapter from its frontmatter slug
│   ├── 404.astro
│   ├── index.astro          Home page
│   └── references.astro     /references
├── scripts/                 The only client-side JavaScript
└── styles/                  CSS, one file per surface
```

### Routing

`src/pages/[...slug].astro` calls `getStaticPaths()` over the `chapters`
collection and emits one page per entry at the entry's **id**, which is set by
the frontmatter `slug`. That is what keeps the existing public URLs working:

| Source file          | Frontmatter `slug` | URL            |
| -------------------- | ------------------ | -------------- |
| `chapter-1.mdx`      | `chapter1`         | `/chapter1`    |
| `chapter-2.mdx`      | `chapter2`         | `/chapter2`    |
| `chapter-3.mdx`      | `chapter3`         | `/chapter3`    |

`index.astro`, `references.astro` and `404.astro` are static routes and take
priority over the catch-all, so they are never shadowed.

## Chapter metadata

Each chapter is one file in `src/content/chapters/`. The schema in
`src/content.config.ts` is the contract — a missing or misspelled field fails
the build rather than rendering an empty label.

| Field        | Required | Purpose                                                                |
| ------------ | -------- | ---------------------------------------------------------------------- |
| `chapter`    | yes      | Chapter number as printed in the manuscript (`1`, `2`, …)               |
| `title`      | yes      | Chapter title — banner heading, `<h1>`, and the home card by default   |
| `navLabel`   | yes      | Short label for the header, footer and previous/next controls           |
| `description`| yes      | One-line summary shown under the banner title                           |
| `summary`    | yes      | Short blurb for the chapter card on the home page                       |
| `order`      | yes      | Sort order; drives the previous/next chain                              |
| `slug`       | yes      | URL segment, no leading slash — this becomes the entry id and the route |
| `cardTitle`  | no       | Shorter home-card title when `title` is too long                        |
| `toc`        | no       | `false` hides the in-page jump navigation. Defaults to `true`          |

### Adding a chapter

Copy an existing chapter file and edit it. For the remaining two chapters of
the five-chapter document:

```yaml
---
chapter: 4
title: 'Requirements and System Design'
navLabel: 'Chapter 4'
description: >-
  Functional and non-functional requirements, system design, and the
  architectural decisions behind CLOIE.
summary: >-
  Requirements, system design, architecture, and traceability.
order: 4
slug: chapter4
---
```

Nothing else needs to change. Adding the file automatically:

- emits `/chapter4` and adds it to the header, footer and home page chapter grid;
- wires it into the previous/next chain, so Chapter 3's "next" link retargets
  from References to Chapter 4, and Chapter 4's "next" becomes Chapter 5;
- generates its jump navigation from its own `##` headings.

Chapter 5 (the last one) then links forward to `/references`, as Chapter 3 does
today. Nothing in the code assumes the document ends at Chapter 3.

### Writing a chapter

Use plain **Markdown** headings and paragraphs for prose. A chapter's `##`
headings become its jump-navigation pills automatically (the leading `1.1`
number is stripped from the label) and receive the anchor ids the pills link to.

Reach for the components in `src/components/chapter/` when a block is
structural rather than prose:

```mdx
import Section from '../../components/chapter/Section.astro'
import Callout from '../../components/chapter/Callout.astro'
import Card from '../../components/chapter/Card.astro'
import CardGrid from '../../components/chapter/CardGrid.astro'
import Figure from '../../components/chapter/Figure.astro'
import diagram from '../../assets/my-diagram.png'

<Section>

## 4.1 Something

Prose goes here, and it is just Markdown.

<Callout variant="insight" title="Why this matters">
A highlighted aside.
</Callout>

</Section>
```

Two conventions matter, and both are MDX parsing rules rather than style
preferences:

1. **Keep component children flush left.** An indented Markdown list directly
   before a closing tag is swallowed by the list parser, and an indented body
   is not parsed as a paragraph.
2. **Surround a single-paragraph body with blank lines**, so MDX emits a
   `<p>`. Card and callout typography is scoped to paragraphs; a bare text node
   would inherit the page's base font size instead.

`CardGrid` supplies the layout and `Card` inherits its appearance from the
parent grid, so a variant name is only ever written once:

```mdx
<CardGrid variant="term">
<Card title="Accreditation">

Formal quality evaluation requiring evidence of outcome attainment.

</Card>
</CardGrid>
```

Available `CardGrid` variants: `topic`, `method`, `requirement`, `stack`,
`system`, `feasibility`, `scope`, `significance`, `term`, `ipo`.
`Card` takes an optional `tag` (small label above the title) and an optional
`tone` of `accent` or `warn` for grids whose cells differ.

`Callout` variants: `insight` (default), `objective`, `synthesis`.

### References

`src/content/references/bibliography.md` is an ordinary ordered list. Citation
links are detected during the Markdown → HTML pass and given
`target="_blank" rel="noopener noreferrer"` plus an external-link glyph, so
there is nothing special to add when citing a new source.

## Assets

- **`src/assets/`** — images imported from a component or an `.mdx` file
  (`import logo from '../assets/cloie-logo.svg'`). Astro emits a hashed filename
  and rewrites the URL for the configured base path, which is what makes them
  work from a GitHub Pages project subpath. Use this for anything the page
  references.
- **`public/`** — files copied verbatim to the site root and served at the
  configured base path. Currently just `favicon.svg`. Reference these through
  `withBase()` from `src/lib/url.ts`, never a hardcoded `/`.

`src/lib/icons.ts` holds the Lucide icon geometry used by `Icon.astro`. It was
generated from `lucide-react@1.31.0` so the site keeps the same icon set without
depending on a React component library. Add a new icon by regenerating that
file rather than hand-editing it.

## Commands

| Command           | What it does                                                   |
| ----------------- | -------------------------------------------------------------- |
| `npm install`     | Install dependencies                                            |
| `npm run dev`     | Dev server on <http://localhost:4321> with hot reload           |
| `npm run build`   | Production build into `dist/`                                  |
| `npm run preview` | Serve the built `dist/` locally                                 |
| `npm run check`   | `astro check` — TypeScript and template diagnostics            |
| `npm run lint`    | `oxlint` over the TypeScript sources                           |
| `npm run verify`  | `lint` + `check` + `build`, the same gate CI runs               |

## Deployment

The site is published to **GitHub Pages** by `.github/workflows/deploy.yml` on
every push to `master`, and the same workflow runs lint and type checks before
building.

Two build-time environment variables matter:

| Variable    | Set by                          | Effect                                                        |
| ----------- | ------------------------------- | ------------------------------------------------------------- |
| `SITE_BASE` | `actions/configure-pages`       | `""` for a custom domain, `"/CLOIE-Blog"` for the fallback URL |
| `SITE_URL`  | (optional, manual)              | Absolute origin; enables the `<link rel="canonical">`           |

`SITE_BASE` is the mechanism the previous Vite build used as `VITE_BASE`, and it
is what lets one codebase serve both `https://tugeru.github.io/CLOIE-Blog/` and a
future custom domain. Locally both default to `/`.

Two consequences of the migration are worth knowing about:

- **The SPA fallback is gone.** The old workflow copied `index.html` to
  `404.html` so a hard reload of `/chapter1` would fall back to the React entry
  point. Astro emits a real `dist/chapter1/index.html` and a real
  `dist/404.html`, so GitHub Pages serves deep links and bookmarks natively.
- **Serving is a plain static host.** `output: 'static'` is deliberate: nothing
  in the site needs a server, and no adapter is installed. If the manuscript
  ever needs per-request behaviour, that is a separate decision.

`.astro/` (generated types) and `dist/` are build output and are gitignored.

## 2026 manuscript edition

The site now contains Chapters 1–5 from the current CLOIE technical manuscript,
with the 2026 guide's chapter structure. Appendix records are not published in
this edition. Source inconsistencies and pending verification remain visible.

Front matter is available at `/abstract`, `/contents`, `/figures`, `/tables`, and
`/acronyms`. Chapter routes remain `/chapter1` through `/chapter5` and use their
frontmatter `slug`. Contents derive from rendered headings. Figure and table
lists use `src/lib/figures.ts` and `src/lib/tables.ts`.

Diagrams live in `src/assets/figures/` as WebP files. `Figure.astro` now accepts a
registry ID, for example `<Figure id="fig-4-1-context" />`, rather than the older
`src`, `alt`, and `caption` props shown above. Alt text and captions live in the
registry. The converted asset set is approximately 772 KB.

`npm run verify` runs lint, Astro checks, the build, and the internal link checker.
The print stylesheet uses Letter pages with one-inch margins and disables page
entrance animations so PDF output cannot capture partially transparent content.
It does not generate a combined manuscript PDF or Roman/Arabic page numbering.
