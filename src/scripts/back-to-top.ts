/**
 * Back-to-top control, replacing the Framer Motion `BackToTop` component.
 *
 * Visibility is driven by a 1px sentinel at the top of the document rather
 * than a scroll listener, so nothing runs while the page is still. Smooth
 * scrolling comes from `html { scroll-behavior: smooth }`, which the global
 * stylesheet already resets under `prefers-reduced-motion`.
 */
const sentinel = document.querySelector<HTMLElement>('[data-back-to-top-sentinel]');
const button = document.querySelector<HTMLButtonElement>('[data-back-to-top]');

if (sentinel && button) {
  new IntersectionObserver(
    ([entry]) => {
      // Hidden while the top of the page is on screen.
      button.hidden = Boolean(entry?.isIntersecting);
    },
    { threshold: 0 },
  ).observe(sentinel);

  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
