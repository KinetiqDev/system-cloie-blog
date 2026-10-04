/**
 * Dark/light toggle.
 *
 * The initial theme is applied by the inline script in `BaseLayout.astro` so
 * there is no flash before paint. This module only owns the button: it flips
 * the theme on <html> and persists the explicit choice under the same
 * `cloie-theme` key the React build used, so returning visitors keep their
 * preference across the migration.
 *
 * Both `dataset.theme` and the `.dark` class are written. `.dark` is what
 * `tokens.css` resolves its role set from; `data-theme` is the transitional
 * alias the not-yet-migrated component overrides still key off. Upstream's
 * "synchronous first-paint bootstrap" contract requires the two to stay in
 * step — the toggle must never leave one set without the other.
 *
 * When no choice has been stored, the OS preference continues to drive the
 * theme (handled by the inline bootstrap) — toggling simply records a choice.
 */
const STORAGE_KEY = 'cloie-theme';

function labelFor(theme: string): string {
  return theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
  const root = document.documentElement;

  const syncLabel = () =>
    button.setAttribute('aria-label', labelFor(root.dataset.theme ?? 'light'));

  syncLabel();

  button.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    root.classList.toggle('dark', next === 'dark');

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private-mode browsers can reject writes; the theme still applies for
      // this page view.
    }

    syncLabel();
  });
}