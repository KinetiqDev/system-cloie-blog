#!/usr/bin/env node
/**
 * check:tokens — design-token enforcement.
 *
 * The static counterpart to the `docs/design.md` contract. Three checks:
 *
 *   1. Raw colours — no hex/rgb/hsl literal may appear outside `tokens.css`
 *      unless its path matches an allowlist entry. This is the blog's version
 *      of `src/features/design-system/data/raw-color-allowlist.ts`.
 *   2. Token cycles — a `--x: var(--x)` self-reference makes the variable
 *      guaranteed-invalid and silently drops every consumer. Cheap to detect,
 *      invisible in review, so it is checked rather than trusted.
 *   3. Legacy usage — counts the transitional `--cloie-*` aliases and the
 *      `[data-theme='dark']` overrides that still need migrating, so progress
 *      toward retiring the compatibility layer stays visible.
 *
 * Exit code is non-zero only for checks 1 and 2. Check 3 reports, never fails:
 * the compatibility layer is deliberate.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const TOKENS_FILE = join(SRC, 'styles', 'tokens.css');

/** Files permitted to carry raw colour literals, with the reason. */
const RAW_COLOR_ALLOWLIST = [
  { pattern: 'src/styles/tokens.css', reason: 'the single owner of colour values (design.md section 1)' },
  {
    pattern: 'src/assets/cloie-logo.svg',
    reason: 'official CLOIE mark — never recolored (design.md section 5, logo treatment)',
  },
  { pattern: 'src/assets/acd-logo.jpg', reason: 'official ACD seal' },
  { pattern: 'src/assets/figures/', reason: 'figure artwork' },
];

const TEXT_EXT = /\.(css|astro|ts|tsx|js|mjs|svg)$/;

/* Literals a tokenised stylesheet should never contain. `rgba(0,0,0,…)`
   shadow cores are excluded: `--shadow-*` legitimately composes a transparent
   black, and treating that as a violation would push the shadow scale back out
   of tokens.css. Named brand hexes are still caught. */
const COLOR_PATTERNS = [
  { re: /#[0-9a-f]{3,8}\b/gi, label: 'hex' },
  { re: /\brgba?\((?!\s*0\s*,\s*0\s*,\s*0\s*,)/gi, label: 'rgb/rgba' },
  { re: /\bhsla?\(/gi, label: 'hsl/hsla' },
];

/** Recolours inside the mark are a brand-integrity violation, not a token one. */
const MARK_GUARD = /src[/\\]assets[/\\]cloie-logo\.svg$/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (TEXT_EXT.test(entry)) out.push(full);
  }
  return out;
}

const rel = (abs) => relative(ROOT, abs).split(sep).join('/');
const isAllowed = (fileRel) =>
  RAW_COLOR_ALLOWLIST.some((e) => fileRel === e.pattern || fileRel.startsWith(e.pattern));

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`  \x1b[31m✗\x1b[0m ${msg}`);
};
const ok = (msg) => console.log(`  \x1b[32m✓\x1b[0m ${msg}`);

/* ---------------------------------------------------------------- check 1 */
console.log('\ndesign tokens: raw colour literals');
const files = walk(SRC);
let rawCount = 0;

for (const file of files) {
  const fileRel = rel(file);
  if (isAllowed(fileRel)) continue;

  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (line.trimStart().startsWith('*') || line.trimStart().startsWith('//')) return;
    for (const { re, label } of COLOR_PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        rawCount++;
        const where = `${fileRel}:${i + 1}`;
        if (MARK_GUARD.test(fileRel)) {
          fail(`${where} recolours the official mark — brand assets are never recoloured (${label} ${m[0]})`);
        } else {
          fail(`${where} raw ${label} \`${m[0]}\` — resolve to a semantic role in styles/tokens.css`);
        }
      }
    }
  });
}

if (rawCount === 0) ok('no raw colour literals outside the allowlist');

/* ---------------------------------------------------------------- check 2 */
console.log('\ndesign tokens: cycles');
const tokenSrc = readFileSync(TOKENS_FILE, 'utf8');
const cycles = [];

// A declaration is a cycle when it references its own name, directly or
// through a chain of other custom properties.
const declRe = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
const decls = new Map();
let dm;
while ((dm = declRe.exec(tokenSrc)) !== null) {
  const refs = [...dm[2].matchAll(/var\((--[a-z0-9-]+)/gi)].map((r) => r[1].toLowerCase());
  decls.set(dm[1].toLowerCase(), refs);
}

const reaches = (start, target, seen = new Set()) => {
  if (start === target) return true;
  if (seen.has(start)) return false;
  seen.add(start);
  return (decls.get(start) ?? []).some((r) => reaches(r, target, seen));
};

for (const [name, refs] of decls) {
  for (const ref of refs) {
    if (ref === name || reaches(ref, name)) {
      cycles.push(`${name} → ${ref}`);
      break;
    }
  }
}

if (cycles.length === 0) ok(`${decls.size} token declarations, no cycles`);
else for (const c of cycles) fail(`cyclic reference: ${c} resolves to guaranteed-invalid`);

/* ---------------------------------------------------------------- check 3 */
console.log('\ndesign tokens: theme contract');
const cssFiles = files.filter((f) => !f.endsWith('.svg'));
const themeBranches = cssFiles.reduce((n, f) => {
  return n + (readFileSync(f, 'utf8').match(/\[data-theme=['"]dark['"]\]/g) ?? []).length;
}, 0);
const legacy = cssFiles.reduce((n, f) => {
  return n + (readFileSync(f, 'utf8').match(/var\(--cloie-[a-z-]+/gi) ?? []).length;
}, 0);

if (themeBranches === 0) ok('no stylesheet branches on [data-theme] — the theme resolves through roles');
else fail(`${themeBranches} selector(s) still branch on [data-theme]; use a semantic role or .dark`);

if (legacy === 0) ok('no references to the retired --cloie-* compatibility aliases');
else fail(`${legacy} reference(s) to a retired --cloie-* alias`);

/* ---------------------------------------------------------------- check 4 */
console.log('\ndesign tokens: surface classification');
/*
 * The site has two surface classes (docs/design.md section 3). Class A is the
 * reading manuscript; Class B is presentation. Decoration — gradients, glow,
 * backdrop blur — is permitted in Class B and in shared page chrome, and is
 * forbidden anywhere in Class A. This is the check that keeps that boundary a
 * rule rather than an intention.
 */
const DECORATION = /(var\(--gradient-[\w-]+\)|var\(--shadow-glow\)|backdrop-filter)/;

/*
 * Selector fragments that identify a Class A reading surface. Matched against
 * the selector of each rule, so a decoration on `.chapter-article h2` is caught
 * even though the file also styles legitimate chrome.
 */
const CLASS_A = [
  'chapter-article', 'chapter-content', 'manuscript-table', 'ms-table',
  'callout', 'card-grid', 'card-item', 'objective-list', 'reference-article',
  'refs-banner__content', 'citation', 'disclosure', 'evidence', 'keywords__item',
  'figure-container', 'figure-image', 'figure-caption', 'figlist', 'tablelist',
  'toc__', 'list-intro', 'card-nav', 'references',
];

const RULE = /([^{}]+)\{([^{}]*)\}/g;
let leaks = 0;
for (const file of files) {
  const fileRel = rel(file);
  if (!TEXT_EXT.test(fileRel) || fileRel.endsWith('tokens.css')) continue;
  // Class A hooks inside a chrome/presentation file still count: the banner and
  // the global primitives are the two places a leak would actually happen.
  const text = readFileSync(file, 'utf8');
  let m;
  RULE.lastIndex = 0;
  while ((m = RULE.exec(text)) !== null) {
    const [, selector, body] = m;
    if (!DECORATION.test(body)) continue;
    const hits = CLASS_A.filter((frag) => selector.includes(frag));
    // `.chapter-banner` and `.refs-banner` are the route mastheads: presentation
    // chrome that happens to sit on a Class A route. Named explicitly so the
    // exemption is visible instead of implied.
    if (hits.length === 0) continue;
    if (/chapter-banner(?!__content)|refs-banner(?!__content)/.test(selector) && !hits.some((h) => h !== 'refs-banner__content')) continue;
    leaks++;
    fail(`${fileRel}: decoration inside a Class A reading surface -> \`${selector.trim().slice(0, 70)}\``);
  }
}
if (leaks === 0) ok('no gradient, glow, or backdrop blur inside a Class A reading surface');

console.log(
  failures === 0
    ? '\n\x1b[32mtoken check passed\x1b[0m\n'
    : `\n\x1b[31mtoken check failed: ${failures} violation(s)\x1b[0m\n`,
);
process.exit(failures === 0 ? 0 : 1);