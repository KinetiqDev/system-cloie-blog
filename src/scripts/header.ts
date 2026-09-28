/**
 * Header behaviour: the scrolled shadow state and the mobile navigation panel.
 *
 * Replaces the React state effects in `Header.jsx`. The panel is rendered
 * closed and `inert`; this module opens it and manages the accessible bits a
 * router-driven SPA used to get for free: `aria-expanded`, background scroll
 * lock, Escape to dismiss, focus moved into the panel on open and returned to
 * the toggle on close.
 */

const header = document.querySelector<HTMLElement>('[data-header]');
const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const overlay = document.querySelector<HTMLElement>('[data-nav-overlay]');
const panel = document.querySelector<HTMLElement>('[data-nav-panel]');

// --- Scrolled header state -------------------------------------------------
if (header) {
  const setScrolled = () => header.classList.toggle('header--scrolled', window.scrollY > 20);
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });
}

// --- Mobile navigation -----------------------------------------------------
if (toggle && overlay && panel) {
  let open = false;

  const render = () => {
    document.documentElement.dataset.navOpen = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.inert = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };

  // Establish the closed state without touching focus — calling focus() here
  // would move focus to the menu button on page load.
  open = false;
  render();

  toggle.addEventListener('click', () => {
    open = !open;
    render();

    if (!open) {
      toggle.focus();
      return;
    }

    // The drawer slides in from off-screen, and Chromium refuses to focus an
    // element that is still outside the viewport — so focus has to wait until
    // the transform has landed. `transitionend` handles the animated case; the
    // timer is the fallback for reduced motion, where transitions are ~0ms.
    const focusFirstLink = () => {
      if (open) panel.querySelector<HTMLElement>('a, button')?.focus();
    };
    requestAnimationFrame(() => {
      panel.addEventListener('transitionend', focusFirstLink, { once: true });
      window.setTimeout(focusFirstLink, 400);
    });
  });

  // Tapping the dimmed backdrop closes the panel; links inside must not.
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay && open) {
      open = false;
      render();
      toggle.focus();
    }
  });

  panel.addEventListener('click', (event) => {
    if (open && (event.target as HTMLElement).closest('a')) {
      open = false;
      render();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) {
      open = false;
      render();
      toggle.focus();
    }
  });

  // A resize past the desktop breakpoint reveals the inline menu, so the panel
  // must not keep the page locked if it is open when that happens.
  window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches && open) {
      open = false;
      render();
    }
  });
}
