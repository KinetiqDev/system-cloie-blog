/**
 * Front matter of the manuscript.
 *
 * The capstone guide lists these as preliminary pages: Abstract, Table of
 * Contents, List of Figures, List of Tables, List of Abbreviations. They sit
 * outside the numbered chapter sequence and use Roman page numbers in the
 * printed manuscript.
 *
 * Two of the five are *authored* prose (abstract, acronyms) and live in
 * `src/content/front-matter/`. The other three are *derived* — the contents,
 * figure list and table list are generated from the chapter collection and the
 * figure/table registries, so they can never fall out of step with the chapters.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type FrontMatter = CollectionEntry<'frontMatter'>;

export interface FrontMatterLink {
  /** Route path, without the site base. */
  path: string;
  /** Label used in the header, footer and home page. */
  label: string;
  /** One-line description for the home page and the contents page. */
  description: string;
  /** Sort order within the front-matter block. */
  order: number;
}

/**
 * Every front-matter page, derived and authored alike, in manuscript order.
 *
 * A single list keeps the home page strip, the footer column, and the contents
 * page consistent — adding a page means adding one entry here.
 */
export const FRONT_MATTER: FrontMatterLink[] = [
  {
    path: '/abstract',
    label: 'Abstract',
    description: 'A self-contained summary of the problem, the developed solution, and the measured results.',
    order: 1,
  },
  {
    path: '/contents',
    label: 'Contents',
    description: 'The full section hierarchy of the five-chapter manuscript.',
    order: 2,
  },
  {
    path: '/figures',
    label: 'List of Figures',
    description: 'Every numbered figure in the manuscript, linked to the section that explains it.',
    order: 3,
  },
  {
    path: '/tables',
    label: 'List of Tables',
    description: 'Every numbered table in the manuscript, linked to the section that interprets it.',
    order: 4,
  },
  {
    path: '/acronyms',
    label: 'Abbreviations',
    description: 'Project-specific acronyms and terms, defined once and used consistently.',
    order: 5,
  },
];

export async function getFrontMatter(): Promise<FrontMatter[]> {
  const entries = await getCollection('frontMatter');
  return entries.sort((a, b) => a.data.order - b.data.order);
}
