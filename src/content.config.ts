import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Manuscript chapters.
 *
 * One file per chapter in `src/content/chapters/`. `.md` and `.mdx` are both
 * accepted: use plain Markdown when a chapter is only prose, and MDX when it
 * needs the presentational blocks in `src/components/chapter/` (card grids,
 * callouts, figures).
 *
 * Adding a chapter — for example the remaining chapters of the five-chapter
 * capstone document — means adding one file here. Routes, the header and
 * footer menus, the home page chapter index and previous/next navigation are
 * all derived from this collection at build time; nothing is hardcoded to
 * three chapters.
 */
const chapters = defineCollection({
  loader: glob({ base: './src/content/chapters', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    /** Chapter number as printed in the manuscript (1, 2, 3, ...). */
    chapter: z.number().int().positive(),
    /**
     * The phase of the engineering argument this chapter belongs to, shown as
     * a label on the home page chapter card so the list reads as a sequence
     * (context → evidence → process → design → outcomes) rather than a menu.
     */
    phase: z.enum(['context', 'evidence', 'process', 'design', 'outcomes']),
    /** Chapter title shown in the banner and page title. */
    title: z.string(),
    /** Short label used in the header, footer and previous/next controls. */
    navLabel: z.string(),
    /** One-line summary shown under the chapter title in the banner. */
    description: z.string(),
    /** Short blurb used for the chapter card on the home page. */
    summary: z.string(),
    /**
     * Optional shorter title for the home-page card, for chapters whose full
     * title is too long for a card. Falls back to `title`.
     */
    cardTitle: z.string().optional(),
    /** Sort order of the chapter in the manuscript. */
    order: z.number().int().positive(),
    /**
     * URL segment for the chapter, without a leading slash. This is the
     * published route — `chapterPath()` and `[...slug].astro` both key on it,
     * never on the loader-generated entry `id`, so renaming a source file can
     * never republish a public URL. Existing links stay valid.
     */
    slug: z.string().regex(/^[a-z0-9][a-z0-9-/]*$/),
    /** Set to `false` to hide the in-page jump navigation. Defaults to `true`. */
    toc: z.boolean().default(true),
    /**
     * Evidence state of the chapter, surfaced on the home page and in the
     * banner. The CLOIE manuscript deliberately reports unfinished validation
     * rather than estimating a completion rate, and the capstone guide rewards
     * exactly that — so the state is stated, not hidden.
     */
    evidenceState: z
      .enum(['verified', 'partial', 'unresolved', 'unreported'])
      .optional(),
    /** Optional short caveat shown next to `evidenceState`. */
    evidenceNote: z.string().optional(),
  }),
});

/**
 * Authored front matter of the manuscript.
 *
 * Only the pages that are genuinely prose live here — the abstract and the
 * acronym list. The table of contents, list of figures and list of tables are
 * *derived* from the chapter collection and the figure/table registries, so
 * they are pages rather than content files and cannot fall out of step.
 */
const frontMatter = defineCollection({
  loader: glob({ base: './src/content/front-matter', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    /** Route segment, without a leading slash. */
    slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
    /** Page title, used in the banner and the document title. */
    title: z.string(),
    /** Short label for navigation. */
    navLabel: z.string(),
    /** One-line summary shown in the banner. */
    description: z.string(),
    /** Sort order within the front-matter block. */
    order: z.number().int().positive(),
  }),
});

/**
 * Site bibliography backing the `/references` page.
 *
 * A collection (rather than a hardcoded array) so citations can be edited as
 * plain Markdown without touching a page component.
 */
const references = defineCollection({
  loader: glob({ base: './src/content/references', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Short labels rendered as chips in the references banner. */
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { chapters, frontMatter, references };
