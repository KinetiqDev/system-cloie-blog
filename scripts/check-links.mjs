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

/** Map a site-absolute path to the file that serves it, or null. */
function resolveTarget(pathname) {
  const target = join(distDir, pathname);
  if (existsSync(target) && statSync(target).isFile()) return target;
  const index = join(target, 'index.html');
  if (existsSync(index)) return index;
  const flat = `${target}.html`;
  if (existsSync(flat)) return flat;
  return null;
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

  for (const match of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
    const raw = match[1];
    if (/^(https?:|mailto:|data:|#$)/.test(raw)) continue;
    checked += 1;

    const [pathname, hash] = raw.split('#');
    const target = resolveTarget(pathname || from.replace(/index\.html$/, '') || '/');

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
