#!/usr/bin/env node
/**
 * Internal link and anchor checker.
 *
 * The manuscript chapters cross-reference each other constantly, and a
 * cross-reference written as a bare `#slug` silently resolves against the
 * *current* page — so "see Section 5.2" written inside Chapter 1 either lands on
 * the wrong heading or on nothing, and the build stays green either way. That
 * failure is invisible to type checking, so it is checked here instead.
 *
 * Runs over `dist/` after a build and exits non-zero on a broken target or a
 * missing anchor id. Wired into `npm run verify`.
 *
 *   node scripts/check-links.mjs [distDir]
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const distDir = resolve(process.argv[2] ?? 'dist');

if (!existsSync(distDir)) {
  console.error(`No build output at ${distDir}. Run \`npm run build\` first.`);
  process.exit(1);
}

/**
 * The subpath the site is served from, mirroring astro.config.ts.
 *
 * GitHub Pages reports a `base_path` and the build embeds it in every link, so
 * a `/CLOIE-Blog/chapter2` href in the built HTML points at
 * `dist/chapter2/index.html`, not at `dist/CLOIE-Blog/...`. Without stripping
 * it, every site-absolute reference looks missing on the production build.
 * `npm run verify` runs the checker against exactly that build, so this is the
 * configuration that matters most.
 */
const siteBase = (process.env.SITE_BASE ?? '/').trim().replace(/\/+$/, '');

/** Every built HTML page. */
function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/**
 * Map a site path to the file that serves it, or null.
 *
 * `sitePath` is a pathname with no base and no query. Astro's `format:
 * 'directory'` writes a directory with an `index.html`, but the `.html` form is
 * still accepted so a future flat build does not need this file changed.
 */
function resolveTarget(sitePath) {
  const target = join(distDir, sitePath);
  if (existsSync(target) && statSync(target).isFile()) return target;
  const index = join(target, 'index.html');
  if (existsSync(index)) return index;
  const flat = `${target}.html`;
  if (existsSync(flat)) return flat;
  return null;
}

/**
 * Split a raw href/src into the site path the checker should look for and the
 * anchor it should verify.
 *
 * Resolving through `URL` gets the browser's own semantics rather than an
 * approximation of them: query strings are excluded from the filename, a
 * relative reference resolves against the *source page* rather than the site
 * root, and percent-encoded fragments are decoded before the id lookup (so
 * `#a%20b` matches `id="a b"`).
 */
function parseReference(raw, fromPath) {
  const url = new URL(raw, `https://check.invalid${fromPath}`);
  let pathname = url.pathname;
  if (siteBase && pathname.startsWith(siteBase)) pathname = pathname.slice(siteBase.length);
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  return { pathname, hash: url.hash ? decodeURIComponent(url.hash.slice(1)) : '' };
}

const pages = htmlFiles(distDir);
const ids = new Map(
  pages.map((file) => [
    file,
    new Set([...readFileSync(file, 'utf8').matchAll(/id="([^"]+)"/g)].map((m) => m[1])),
  ])
);

const problems = [];
let checked = 0;

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const from = relative(distDir, file);
  // The page's own site path, so a relative reference resolves the way a
  // browser would resolve it. `build.format: 'directory'` means a bare
  // `index.html` is the site root.
  const fromPath = `/${from.replace(/index\.html$/, '')}`;

  for (const match of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
    const raw = match[1];
    if (/^(https?:|mailto:|data:|#$)/.test(raw)) continue;
    checked += 1;

    const { pathname, hash } = parseReference(raw, fromPath);
    const target = resolveTarget(pathname);

    if (!target) {
      problems.push(`${from} -> missing target: ${raw}`);
      continue;
    }
    if (hash && !ids.get(target)?.has(hash)) {
      problems.push(`${from} -> missing anchor: ${raw}`);
    }
  }
}

if (problems.length) {
  console.error(`${problems.length} broken internal reference(s):\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(`link check: ${pages.length} pages, ${checked} internal references, all resolve`);
