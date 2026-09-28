import { getCollection, type CollectionEntry } from 'astro:content';

export type Chapter = CollectionEntry<'chapters'>;

/**
 * A chapter paired with its neighbours in the manuscript. The chain is
 * derived from the collection on every build, so the document is not capped
 * at Chapter 3: adding `chapter-4.mdx` / `chapter-5.mdx` extends the header,
 * footer, home page, prev/next navigation and the chapter index automatically.
 */
export interface ChapterNeighbours {
  current: Chapter;
  index: number;
  total: number;
  previous: Chapter | undefined;
  next: Chapter | undefined;
}

/** All chapters in manuscript order. */
export async function getChapters(): Promise<Chapter[]> {
  const chapters = await getCollection('chapters');
  return chapters.sort((a, b) => a.data.order - b.data.order || a.data.chapter - b.data.chapter);
}

/** Public URL of a chapter, driven by its frontmatter `slug`. */
export function chapterPath(chapter: Chapter): string {
  return `/${chapter.id}`;
}

/** Locate a chapter and its previous/next siblings in the manuscript. */
export async function getChapterNeighbours(id: string): Promise<ChapterNeighbours> {
  const chapters = await getChapters();
  const index = chapters.findIndex((chapter) => chapter.id === id);
  if (index === -1) throw new Error(`Unknown chapter id: ${id}`);
  return {
    current: chapters[index]!,
    index,
    total: chapters.length,
    previous: chapters[index - 1],
    next: chapters[index + 1],
  };
}

/**
 * Short label for a section heading, used by the in-chapter jump navigation.
 * Headings are numbered in the manuscript ("1.1 Background of the Study");
 * the leading number is dropped so the pill row stays scannable.
 */
export function sectionLabel(text: string): string {
  return text.replace(/^\d+(?:\.\d+)*\.?\s+/, '').trim() || text;
}
