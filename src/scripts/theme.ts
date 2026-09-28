/**
 * Dark/light toggle.
 *
 * The initial theme is applied by the inline script in `BaseLayout.astro` so
 * there is no flash before paint. This module only owns the button: it flips
 * `data-theme` on <html> and persists the explicit choice under the same
 * `cloie-theme` key the React build used, so returning visitors keep their
 * preference across the migration.
 *
 * When no choice has been stored, the OS preference continues to drive the
 * theme (handled by the inline listener) — toggling simply records a choice.
 */
const STORAGE_KEY = 'cloie-theme';

function labelFor(theme: string): string {
  return theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
  const syncLabel = () =>
    button.setAttribute('aria-label', labelFor(document.documentElement.dataset.theme ?? 'light'));

  syncLabel();

  button.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private-mode browsers can reject writes; the theme still applies for
      // this page view.
    }

    syncLabel();
  });
}
