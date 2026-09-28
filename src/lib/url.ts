/**
 * Base-path aware URL helpers.
 *
 * The site is published to GitHub Pages, which may serve it from a custom
 * domain root (`base: '/'`) or from the project subpath (`base: '/CLOIE-Blog'`).
 * Every internal link therefore has to go through `withBase()` instead of
 * hardcoding a leading slash.
 */
const basePath = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Prefix an internal, root-relative path with the configured base path. */
export function withBase(path: string): string {
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${suffix}` || '/';
}

/**
 * Strip the base path and any trailing slash from a URL pathname so routes can
 * be compared reliably (e.g. `currentPath` vs. a chapter's slug).
 */
export function toRoutePath(pathname: string): string {
  let path = pathname;
  if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length);
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path || '/';
}
