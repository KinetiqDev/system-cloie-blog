/**
 * Scroll-triggered entrance animations for `[data-reveal]` elements
 * (see `src/components/Reveal.astro`), replacing Framer Motion's `useInView`.
 *
 * The offset/hidden state only exists while `.js` is on <html> and motion is
 * allowed, so the content is always readable without JavaScript or under
 * `prefers-reduced-motion: reduce`.
 */
const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const revealAll = () => {
  for (const target of targets) target.classList.add('is-revealed');
};

if (targets.length > 0) {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      },
      // Matches the "-60px" viewport margin the Framer Motion version used.
      { rootMargin: '0px 0px -60px 0px' },
    );

    for (const target of targets) observer.observe(target);

    // Honour a mid-session change of the OS motion preference.
    reducedMotion.addEventListener('change', (event) => {
      if (event.matches) revealAll();
    });
  }
}
