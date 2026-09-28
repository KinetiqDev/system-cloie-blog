import mdx from '@astrojs/mdx';
import { satteri, type SatteriProcessorOptions } from '@astrojs/markdown-satteri';
import { defineConfig } from 'astro/config';
import type { Element } from 'hast';

/**
 * Citation links in the bibliography leave the site, so they get
 * `target`/`rel` and the external-link glyph the React build drew with a
 * Lucide icon. Only `http(s)` anchors are touched.
 */
type HastPlugin = NonNullable<SatteriProcessorOptions['hastPlugins']>[number];

const rehypeCitationLinks: HastPlugin = {
  name: 'rehype-citation-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href !== 'string' || !/^https?:\/\//.test(href)) return;
      ctx.setProperty(node, 'target', '_blank');
      ctx.setProperty(node, 'rel', 'noopener noreferrer');
      ctx.appendChild(node, externalLinkGlyph());
    },
  },
};

function externalLinkGlyph(): Element {
  const path = (d: string): Element => ({ type: 'element', tagName: 'path', properties: { d }, children: [] });

  return {
    type: 'element',
    tagName: 'svg',
    properties: {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 12,
      height: 12,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      class: 'citation__icon',
      ariaHidden: 'true',
    },
    children: [
      path('M15 3h6v6'),
      path('M10 14 21 3'),
      path('M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'),
    ],
  };
}

/**
 * Deployment notes (see .github/workflows/deploy.yml)
 * ---------------------------------------------------------------
 * The site is published with GitHub Pages. `actions/configure-pages`
 * reports the `base_path` the build must use:
 *   - `""`            -> served from a custom domain root
 *   - `"/CLOIE-Blog"` -> served from the project fallback URL
 * The workflow forwards it as `SITE_BASE`; local dev and non-Pages
 * builds fall back to `/`.
 */
const rawBase = (process.env.SITE_BASE ?? '/').trim();
const normalizedBase = rawBase.replace(/\/+$/, '');

export default defineConfig({
  // Only set when a real origin is known (used for the canonical link).
  site: process.env.SITE_URL || undefined,
  base: normalizedBase === '' ? '/' : normalizedBase,
  output: 'static',
  // `/chapter1` must resolve to `dist/chapter1/index.html`, which GitHub
  // Pages serves natively — no SPA fallback / 404.html copy required.
  build: { format: 'directory' },
  trailingSlash: 'ignore',
  integrations: [mdx()],
  // Kept from the Vite setup: the dev server is reachable from other devices
  // on the network / from a container. `npm run dev` is on :4321.
  server: { host: true },
  markdown: {
    processor: satteri({ hastPlugins: [rehypeCitationLinks] }),
  },
});
