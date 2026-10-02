/**
 * The manuscript table registry.
 *
 * Mirrors `figures.ts` so a table's number and caption are declared once. The
 * List of Tables page reads this registry; `Table.astro` reads it too, so the
 * two cannot drift.
 *
 * Numbering is per chapter, as permitted by the capstone guide.
 */
export type TableId =
  | 'table-1-1-success-criteria'
  | 'table-2-1-system-comparison'
  | 'table-3-1-milestones'
  | 'table-3-2-risks'
  | 'table-4-1-modules'
  | 'table-4-2-security-controls'
  | 'table-4-3-deployment-config'
  | 'table-5-1-requirements-fulfillment'
  | 'table-5-2-automated-verification'
  | 'table-5-3-user-validation';

export interface ManuscriptTable {
  id: TableId;
  /** Printed number, numbered per chapter. */
  number: string;
  caption: string;
  chapter: 1 | 2 | 3 | 4 | 5;
  /** In-page anchor of the owning section, used by the List of Tables. */
  anchor: string;
  /** One-line note explaining what the table is and is not evidence of. */
  note?: string;
}

export const TABLES: ManuscriptTable[] = [
  {
    id: 'table-1-1-success-criteria',
    number: '1.1',
    caption: 'Project success criteria',
    chapter: 1,
    anchor: '16-success-criteria--expected-project-outcomes',
    note: 'These are targets to be evidenced by requirements verification, testing, and validation. They are not results already achieved.',
  },
  {
    id: 'table-2-1-system-comparison',
    number: '2.1',
    caption: 'Comparison of related assessment and evaluation systems',
    chapter: 2,
    anchor: '22-review-of-related-systems--existing-solutions',
  },
  {
    id: 'table-3-1-milestones',
    number: '3.1',
    caption: 'Milestone and release summary',
    chapter: 3,
    anchor: '36-project-management-risks-and-milestones',
  },
  {
    id: 'table-3-2-risks',
    number: '3.2',
    caption: 'Major project risk summary',
    chapter: 3,
    anchor: '36-project-management-risks-and-milestones',
  },
  {
    id: 'table-5-1-requirements-fulfillment',
    number: '5.1',
    caption: 'Requirements fulfillment summary',
    chapter: 5,
    anchor: '52-requirements-fulfillment',
    note: 'No completion percentage is calculated. The underlying traceability matrix does not yet contain a defensible total of approved requirements with final test links.',
  },
  {
    id: 'table-5-2-automated-verification',
    number: '5.2',
    caption: 'Automated verification summary',
    chapter: 5,
    anchor: '53-testing-and-quality-evaluation-results',
  },
  {
    id: 'table-5-3-user-validation',
    number: '5.3',
    caption: 'User validation summary by stakeholder group',
    chapter: 5,
    anchor: '54-alphabetapilotuser-acceptance-evaluation',
  },
];

const BY_ID = new Map(TABLES.map((table) => [table.id, table]));

export function getTable(id: TableId): ManuscriptTable {
  const table = BY_ID.get(id);
  if (!table) throw new Error(`Unregistered table id: ${id}`);
  return table;
}

export function tablesForChapter(chapter: number): ManuscriptTable[] {
  return TABLES.filter((table) => table.chapter === chapter);
}
