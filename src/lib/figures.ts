import figContext from '../assets/figures/fig-4-1-context.webp';
import figUseCase from '../assets/figures/fig-4-2-use-case.webp';
import figArchitecture from '../assets/figures/fig-4-3-architecture.webp';
import figErd from '../assets/figures/fig-4-4-erd.webp';
import figTrustBoundary from '../assets/figures/fig-4-5-trust-boundary.webp';
import figDeployment from '../assets/figures/fig-4-6-deployment.webp';
import figKanban from '../assets/figures/fig-3-1-kanban.webp';
import figGantt from '../assets/figures/fig-3-2-gantt.webp';

export type FigureId =
  | 'fig-3-1-kanban'
  | 'fig-3-2-gantt'
  | 'fig-4-1-context'
  | 'fig-4-2-use-case'
  | 'fig-4-3-architecture'
  | 'fig-4-4-erd'
  | 'fig-4-5-trust-boundary'
  | 'fig-4-6-deployment';

export interface Figure {
  /** Registry key, also the asset basename. */
  id: FigureId;
  /** Printed number, numbered per chapter (Figure 4.1, 3.2, …). */
  number: string;
  /** Printed caption. */
  caption: string;
  /**
   * Alt text describing the *relationships* the diagram encodes, not just its
   * subject. The trust-boundary and deployment figures carry security claims;
   * their alt text is doing load-bearing explanatory work, so it is written
   * as a summary of the diagram rather than a label.
   */
  alt: string;
  /** Chapter the figure appears in. */
  chapter: 3 | 4;
  /** In-page anchor on the host chapter page. */
  anchor: string;
  /** Resolved image asset. */
  src: ImageMetadata;
}

/**
 * The manuscript figure registry.
 *
 * Centralised so the number and caption used inline on a chapter page and the
 * row on the List of Figures page cannot drift apart. Numbering is per chapter,
 * which the guide permits ("number consecutively by chapter or throughout").
 *
 * A registry entry is the single place a figure is declared; adding a figure
 * to the manuscript means adding one object here and one `<Figure>` in the
 * chapter body.
 */
export const FIGURES: Figure[] = [
  {
    id: 'fig-3-1-kanban',
    number: '3.1',
    caption: 'Kanban workflow used for Project CLOIE',
    alt: 'Kanban board workflow with columns for Backlog, Ready, In Progress, Review, Testing, and Done, showing work items moving left to right through the columns with pull-based limits on work in progress.',
    chapter: 3,
    anchor: '31-development-approach-and-lifecycle',
    src: figKanban,
  },
  {
    id: 'fig-3-2-gantt',
    number: '3.2',
    caption: 'Indicative milestone and work-package schedule',
    alt: 'Gantt chart of project milestones against calendar time, with bars for the analysis, requirements, design, implementation, testing, and documentation work packages and diamond markers at each milestone.',
    chapter: 3,
    anchor: '36-project-management-risks-and-milestones',
    src: figGantt,
  },
  {
    id: 'fig-4-1-context',
    number: '4.1',
    caption: 'System CLOIE context diagram',
    alt: 'Context diagram placing System CLOIE at the centre. Three actor groups connect to it: institutional users (Secretary, College Dean, General Education Coordinator, Program Head, Faculty Member) send administrative setup and academic management requests and receive authorized workspaces, reports, and insights; respondent users (Student, Alumni, Industry Partner) receive assigned evaluations and submission status and send evaluation responses; and external systems (Google OAuth for authentication, a self-hosted Supabase instance providing auth, PostgreSQL and storage, and an optional OpenAI-compatible AI provider) exchange authentication requests, data reads and writes, and bounded aggregate evidence.',
    chapter: 4,
    anchor: '41-system-context-and-stakeholders',
    src: figContext,
  },
  {
    id: 'fig-4-2-use-case',
    number: '4.2',
    caption: 'System CLOIE use case diagram',
    alt: 'Use case diagram showing institutional users — Secretary, College Dean, General Education Coordinator, Program Head and Faculty Member — and respondent users — Student, Alumni and Industry Partner — connected to use cases for managing academic structure, learning outcomes, evaluation instruments, deployments, responses, analytics, and review. A dashed boundary separates administrative use cases from respondent evaluation use cases.',
    chapter: 4,
    anchor: '43-use-case-and-user-interaction-model',
    src: figUseCase,
  },
  {
    id: 'fig-4-3-architecture',
    number: '4.3',
    caption: 'System CLOIE solution architecture',
    alt: 'Layered architecture diagram. The client and presentation layer is a Next.js web user interface. Below it a request and application boundary contains a request boundary for session refresh, server components for authorized reads, and server actions and route handlers for validated mutations. The System CLOIE modular monolith contains five modules — identity and access, academic management, learning outcomes, evaluation management, and analytics and oversight — connected to external services (self-hosted Supabase auth chaining to Google OAuth, plus an optional OpenAI-compatible AI provider). A Prisma data access layer connects the modules to a PostgreSQL database holding System CLOIE data.',
    chapter: 4,
    anchor: '44-solution-architecture',
    src: figArchitecture,
  },
  {
    id: 'fig-4-4-erd',
    number: '4.4',
    caption: 'System CLOIE conceptual entity relationship diagram',
    alt: 'Entity relationship diagram in three bands. Identity and academic scope: user account, user role, program, course, academic period, and course assignment. Learning outcomes: institutional learning outcome, program learning outcome, course intended learning outcome, and an outcome mapping join recording mapping type and status. Evaluation evidence: instrument template, instrument version, evaluation deployment, response, and answer, with a response belonging to a respondent user account and each deployment using a frozen instrument version.',
    chapter: 4,
    anchor: '45-data-design',
    src: figErd,
  },
  {
    id: 'fig-4-5-trust-boundary',
    number: '4.5',
    caption: 'System CLOIE trust boundaries and sensitive data flow',
    alt: 'Trust boundary diagram showing four zones. The client trust zone contains the user web browser, exchanging HTTPS session tokens and role context inbound and role-scoped pages, reports and status outbound. The System CLOIE application trust zone contains authentication and authorization, application services, and analytics and reporting, passing authorized identity and scope, authorized evaluation evidence, and sensitive evaluation data to the data services trust zone, which holds self-hosted Supabase auth and the System CLOIE data store. A separate external service trust zone holds Google OAuth and an optional OpenAI-compatible AI provider; only de-identified aggregate evidence, never raw respondent text, crosses into the AI provider, which returns supplementary interpretation only.',
    chapter: 4,
    anchor: '48-security-and-privacy-design',
    src: figTrustBoundary,
  },
  {
    id: 'fig-4-6-deployment',
    number: '4.6',
    caption: 'System CLOIE deployment and infrastructure topology',
    alt: 'Deployment topology. A user device web browser reaches the system over HTTPS through a Cloudflare Tunnel that provides public HTTPS routing to an Ubuntu server host. On that host a Coolify deployment runs the System CLOIE Next.js application at system-cloie.app alongside a self-hosted Supabase instance at api.system-cloie.app providing Supabase auth, PostgreSQL and storage; the two exchange application data, auth and storage. The self-hosted Supabase instance performs an OAuth exchange with Google OAuth as identity provider. An optional OpenAI-compatible AI provider sits outside the host, exchanging bounded aggregate evidence outward and supplementary interpretation inward.',
    chapter: 4,
    anchor: '49-deployment-and-infrastructure-design',
    src: figDeployment,
  },
];

const BY_ID = new Map(FIGURES.map((figure) => [figure.id, figure]));

/** Look up a single registered figure by id. */
export function getFigure(id: FigureId): Figure {
  const figure = BY_ID.get(id);
  if (!figure) throw new Error(`Unregistered figure id: ${id}`);
  return figure;
}

/** Every figure belonging to one chapter, in printed order. */
export function figuresForChapter(chapter: number): Figure[] {
  return FIGURES.filter((figure) => figure.chapter === chapter);
}
