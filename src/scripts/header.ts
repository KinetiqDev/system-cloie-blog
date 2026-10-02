/**
 * Header behaviour: the scrolled shadow state, the desktop top-level
 * disclosures and the mobile navigation panel.
 *
 * Replaces the React state effects in `Header.jsx`. Everything renders closed
 * and `inert`; this module opens it and manages the accessible bits a
 * router-driven SPA used to get for free: `aria-expanded`, background scroll
 * lock, Escape to dismiss, focus moved into the panel on open and returned to
 * the toggle on close.
 */

// One query, shared by the drawer and the disclosures: below this width the
// inline bar is hidden, so anything it owns must be dismissed.
const isDesktop = window.matchMedia('(min-width: 901px)');

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

  isDesktop.addEventListener('change', (event) => {
    if (event.matches && open) {
      open = false;
      render();
    }
  });
}

// --- Desktop top-level disclosures -------------------------------------------
// A dropdown, not a modal: the page keeps scrolling, so there is no scroll
// lock and no focus trap. Opening one closes the other. It opens on hover when
// the pointer really is a mouse, and on click for everything else — a tablet in
// landscape is wider than 900px, so the bar is on screen without a cursor.
const menus = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-menu]'));
const hoveredAt = new WeakMap<HTMLElement, number>();
let closeTimer: number | undefined;

const setMenuOpen = (menu: HTMLElement, open: boolean) => {
  const trigger = menu.querySelector<HTMLButtonElement>('[data-menu-trigger]');
  const disclosure = menu.querySelector<HTMLElement>('[data-menu-panel]');
  if (!trigger || !disclosure) return;
  menu.dataset.menuOpen = String(open);
  trigger.setAttribute('aria-expanded', String(open));
  disclosure.inert = !open;
};

const cancelPendingClose = () => {
  if (closeTimer !== undefined) window.clearTimeout(closeTimer);
  closeTimer = undefined;
};

const closeMenus = (except?: HTMLElement) => {
  cancelPendingClose();
  for (const menu of menus) {
    if (menu !== except) setMenuOpen(menu, false);
  }
};

for (const menu of menus) {
  setMenuOpen(menu, false);

  menu.querySelector<HTMLButtonElement>('[data-menu-trigger]')?.addEventListener('click', () => {
    // A tap on a hover-capable touchscreen fires pointerenter before click;
    // without this the tap would open the panel and immediately toggle it shut.
    if (Date.now() - (hoveredAt.get(menu) ?? 0) < 400) return;
    const open = menu.dataset.menuOpen !== 'true';
    closeMenus(open ? menu : undefined);
    setMenuOpen(menu, open);
    // A click is a deliberate act, so it takes focus; a hover must not, or the
    // panel would steal the caret just from passing the cursor over the bar.
    // Either way the panel fades in rather than sliding from off-screen, so
    // focus does not have to wait for a transition — unlike the drawer.
    if (open) requestAnimationFrame(() => menu.querySelector<HTMLElement>('a')?.focus());
  });

  menu.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse' || menu.dataset.menuOpen === 'true') return;
    cancelPendingClose();
    closeMenus(menu);
    setMenuOpen(menu, true);
    hoveredAt.set(menu, Date.now());
  });

  // Delayed so the cursor can cross the ten-pixel gap between the trigger and
  // the panel without the panel closing under it.
  menu.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    cancelPendingClose();
    closeTimer = window.setTimeout(() => closeMenus(), 180);
  });

  // Tabbing past an open panel must not leave it hanging over the page.
  menu.addEventListener('focusout', (event) => {
    if (!menu.contains((event as FocusEvent).relatedTarget as Node | null)) setMenuOpen(menu, false);
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const open = menus.find((menu) => menu.dataset.menuOpen === 'true');
  if (!open) return;
  closeMenus();
  open.querySelector<HTMLButtonElement>('[data-menu-trigger]')?.focus();
});

document.addEventListener('pointerdown', (event) => {
  if (menus.some((menu) => menu.contains(event.target as Node))) return;
  closeMenus();
});

isDesktop.addEventListener('change', (event) => {
  if (event.matches) closeMenus();
});
