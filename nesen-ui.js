// ============================================================
// nesen-ui.js — NESEN site shell UI
// SiteHeader — React 18 UMD, static navbar (auth deferred)
// Listens to: cw:auth:change (wired, ready for auth phase)
// Mount: <div id="nav_container"></div>
// ============================================================

// ── Nav link definitions ─────────────────────────────────────

const NAV_LINKS = [
  { label: 'Events',    href: '/events.html' },
  { label: 'Community', href: '/members.html' },
  { label: 'Calendar',  href: '/meetings.html' },
  { label: 'Resources', href: '/member-guide.html' },
];

// ── Site header component ────────────────────────────────────

const SiteHeader = function() {
  return ce('header', {
    className: 'navbar navbar-expand-lg sticky-top d-print-none',
    style: {
      background:   '#ffffff',
      borderBottom: '1px solid #E2E8F3',
      zIndex:       1030,
    },
  },
    ce('div', { className: 'container' },

      // Brand
      ce('a', {
        href: '/',
        className: 'navbar-brand d-flex align-items-center gap-2',
        style: { borderRight: '1px solid #E2E8F3', paddingRight: '1rem', marginRight: '1rem' },
      },
        ce('img', { src: '/logo.svg', alt: 'NESEN logo', height: 36, width: 36 }),
        ce('span', {
          className: 'navbar-brand-text',
          style: { color: '#123C7A', fontSize: '1.4rem' },
        }, 'NESEN')
      ),

      // Mobile toggler
      ce('button', {
        className: 'navbar-toggler',
        type: 'button',
        'data-bs-toggle': 'collapse',
        'data-bs-target': '#siteNav',
        'aria-controls': 'siteNav',
        'aria-expanded': 'false',
        'aria-label': 'Toggle navigation',
      }, ce('span', { className: 'navbar-toggler-icon' })),

      // Collapsible nav
      ce('div', { className: 'collapse navbar-collapse', id: 'siteNav' },
        ce('ul', { className: 'navbar-nav ms-auto align-items-lg-center' },

          // Main links
          NAV_LINKS.map(({ label, href }) =>
            ce('li', { key: href, className: 'nav-item' },
              ce('a', { className: 'nav-link', href }, label)
            )
          ),

          // Search
          ce('li', { className: 'nav-item ms-lg-2' },
            ce('a', {
              className: 'btn btn-sm btn-ghost-secondary',
              href: '/search.html',
              'aria-label': 'Search',
            },
              ce('i', { className: 'ti ti-search', style: { fontSize: '1rem' } })
            )
          ),

          // Join CTA
          ce('li', { className: 'nav-item ms-lg-2' },
            ce('a', {
              className: 'btn btn-sm btn-primary',
              href: '/apply.html',
            },
              ce('i', { className: 'ti ti-user-plus me-1' }),
              'Join'
            )
          )
        )
      )
    )
  );
};

// ── Render ───────────────────────────────────────────────────

let _headerRoot = null;

function _renderHeader() {
  if (!_headerRoot) {
    const el = document.getElementById('nav_container');
    if (!el) return;
    _headerRoot = ReactDOM.createRoot(el);
  }
  _headerRoot.render(ce(SiteHeader, {}));
}

// ── Auth change listener (ready for auth phase) ──────────────

globalThis.addEventListener('cw:auth:change', () => {
  _renderHeader();
});

// ── Expose ───────────────────────────────────────────────────

if (globalThis.CW) {
  globalThis.CW._renderHeader = _renderHeader;
}

globalThis._renderHeader = _renderHeader;

// ── Initial render ───────────────────────────────────────────

_renderHeader();

// console.log('✅ nesen-ui.js loaded');
