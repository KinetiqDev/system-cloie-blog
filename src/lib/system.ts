/**
 * Where System CLOIE runs.
 *
 * This site is the manuscript; the system it documents is deployed three times,
 * and the difference matters. Production is the one a reader should open. The
 * other two belong to the team, and they are listed so a reviewer can ask for
 * them rather than guess at a hostname.
 *
 * One list, imported by the header, the hero and the footer, so those three can
 * never point a visitor at different environments than each other. Change a
 * hostname here and the whole site follows.
 */
export interface Deployment {
  /** Stable key, so a caller can pick one without matching on the label. */
  id: 'prod' | 'staging' | 'dev';
  /** What the site calls it. */
  label: string;
  url: string;
}

export const DEPLOYMENTS: Deployment[] = [
  { id: 'prod', label: 'Production system', url: 'https://system-cloie.app' },
  { id: 'staging', label: 'Staging build', url: 'https://preview.system-cloie.app' },
  { id: 'dev', label: 'Staging dev', url: 'https://dev.system-cloie.app' },
];

/** The deployment a visitor is meant to open. */
export const PRODUCTION = DEPLOYMENTS[0]!;
