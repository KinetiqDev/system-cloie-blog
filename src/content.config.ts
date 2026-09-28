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
     * URL segment for the chapter, without a leading slash. Overrides the
     * generated entry id, which is how `/chapter1` … `/chapterN` are defined.
     * Existing links stay valid as chapters are added.
     */
    slug: z.string().regex(/^[a-z0-9][a-z0-9-/]*$/),
    /** Set to `false` to hide the in-page jump navigation. Defaults to `true`. */
    toc: z.boolean().default(true),
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

export const collections = { chapters, references };
