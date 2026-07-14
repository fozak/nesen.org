// ============================================================
// nesen-ui.js — NESEN marketing site shell UI
// NavBar — React 18 UMD, reads pb.authStore directly
// No Alpine dependency
// Listens to: cw:auth:change
// Mount: <div id="nav_container"></div>
// ============================================================

// ── Nav link definitions ─────────────────────────────────────

const NAV_LINKS = [
  { label: 'About',          href: '/about.html' },
  { label: 'Weekly Meeting', href: '/weekly-meeting.html' },
  { label: 'Members',        href: '/members.html' },
  { label: 'Events',         href: '/events.html' },
];

const FOR_YOU_LINKS = [
  { label: 'Entrepreneurs',          href: '/for-entrepreneurs.html' },
  { label: 'Startup Founders',       href: '/for-founders.html' },
  { label: 'Executives',             href: '/for-executives.html' },
  { label: 'Scientists & Researchers', href: '/for-scientists.html' },
];

// ── Avatar helpers ───────────────────────────────────────────

const Avatar = function({ profile }) {
  if (profile.avatar) {
    return ce('span', {
      className: 'avatar avatar-sm rounded-circle',
      style: { backgroundImage: `url(${profile.avatar})` },
    });
  }
  return ce('span', {
    className: 'avatar avatar-sm rounded-circle d-flex align-items-center justify-content-center text-white fw-bold',
    style: { backgroundColor: profile.avatarColor, fontSize: '0.75rem' },
  }, profile.initials);
};

// ── For You dropdown ─────────────────────────────────────────

const ForYouDropdown = function() {
  return ce('li', { className: 'nav-item dropdown' },
    ce('a', {
      className: 'nav-link dropdown-toggle',
      href: '#',
      role: 'button',
      'data-bs-toggle': 'dropdown',
      'aria-expanded': 'false',
    }, 'For You'),
    ce('ul', { className: 'dropdown-menu shadow-sm', style: { minWidth: '210px' } },
      FOR_YOU_LINKS.map(({ label, href }) =>
        ce('li', { key: href },
          ce('a', { className: 'dropdown-item', href }, label)
        )
      )
    )
  );
};

// ── Avatar dropdown (logged in) ──────────────────────────────

const AvatarDropdown = function({ profile }) {
  const handleResendVerification = (e) => {
    e.preventDefault();
    globalThis.pb?.collection('users').requestVerification(profile.email)
      .then(() => globalThis.cwToast?.('Verification email sent!', 'success'))
      .catch(() => globalThis.cwToast?.('Failed to send verification email', 'error'));
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    globalThis.authLogout?.();
    window.location.href = '/login.html';
  };

  return ce('li', { className: 'nav-item dropdown' },
    ce('a', {
      href: '#',
      className: 'd-flex align-items-center text-decoration-none dropdown-toggle gap-2',
      'data-bs-toggle': 'dropdown',
      'aria-expanded': 'false',
    },
      ce(Avatar, { profile }),
      ce('span', { className: 'd-none d-lg-inline small text-body' }, profile.name)
    ),

    ce('div', { className: 'dropdown-menu dropdown-menu-end shadow-sm', style: { minWidth: '220px' } },

      // User info header
      ce('div', { className: 'dropdown-header' },
        ce('div', { className: 'fw-semibold' }, profile.name),
        ce('div', { className: 'text-muted small' }, profile.email),
        !profile.verified && ce('div', { className: 'mt-1' },
          ce('span', { className: 'badge bg-warning-lt text-warning' },
            ce('i', { className: 'ti ti-mail me-1' }),
            'Email not verified'
          )
        )
      ),

      ce('div', { className: 'dropdown-divider' }),

      ce('a', { className: 'dropdown-item', href: '/profile.html' },
        ce('i', { className: 'ti ti-user me-2' }), 'Profile'
      ),
      ce('a', { className: 'dropdown-item', href: '/settings.html' },
        ce('i', { className: 'ti ti-settings me-2' }), 'Settings'
      ),

      // Resend verification (unverified only)
      !profile.verified && ce('div', null,
        ce('div', { className: 'dropdown-divider' }),
        ce('a', {
          className: 'dropdown-item text-warning',
          href: '#',
          onClick: handleResendVerification,
        },
          ce('i', { className: 'ti ti-mail-forward me-2' }), 'Resend verification'
        )
      ),

      ce('div', { className: 'dropdown-divider' }),

      ce('a', {
        className: 'dropdown-item text-danger',
        href: '#',
        onClick: handleSignOut,
      },
        ce('i', { className: 'ti ti-logout me-2' }), 'Sign out'
      )
    )
  );
};

// ── Main NavBar component ────────────────────────────────────

const NavBarNesen = function({ profile }) {
  const isValid = !!profile;

  return ce('header', {
    className: 'navbar navbar-expand-lg sticky-top d-print-none',
    style: {
      background:   '#123C7A',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      zIndex:       1030,
    },
  },
    ce('div', { className: 'container-xl' },

      // Brand
      ce('a', {
        href: '/',
        className: 'navbar-brand pe-4 me-2',
        style: { borderRight: '1px solid rgba(255,255,255,0.15)' },
      },
        ce('span', { className: 'navbar-brand-text', style: { color: '#fff' } }, 'NESEN')
      ),

      // Mobile toggler
      ce('button', {
        className: 'navbar-toggler border-0',
        type: 'button',
        'data-bs-toggle': 'collapse',
        'data-bs-target': '#navbarNesen',
        'aria-controls': 'navbarNesen',
        'aria-expanded': 'false',
        'aria-label': 'Toggle navigation',
        style: { filter: 'invert(1)' },
      },
        ce('span', { className: 'navbar-toggler-icon' })
      ),

      // Collapsible content
      ce('div', { className: 'collapse navbar-collapse', id: 'navbarNesen' },

        // Left nav links
        ce('ul', { className: 'navbar-nav me-auto align-items-lg-center' },

          NAV_LINKS.map(({ label, href }) =>
            ce('li', { key: href, className: 'nav-item' },
              ce('a', { className: 'nav-link text-white-50', href,
                style: { '--bs-nav-link-hover-color': '#fff' }
              }, label)
            )
          ),

          ce(ForYouDropdown)
        ),

        // Right side
        ce('ul', { className: 'navbar-nav ms-auto align-items-lg-center gap-2' },

          // Primary CTA — always visible
          ce('li', { className: 'nav-item' },
            ce('a', {
              className: 'btn btn-sm',
              href: '/visit.html',
              style: {
                background:   '#D4541A',
                color:        '#fff',
                borderColor:  '#D4541A',
                fontWeight:   600,
              },
            },
              ce('i', { className: 'ti ti-calendar-event me-1' }),
              'Attend Meeting'
            )
          ),

          // Unverified warning (logged in, not verified)
          isValid && !profile.verified && ce('li', { className: 'nav-item' },
            ce('a', {
              href: '/auth/verify-reminder.html',
              className: 'nav-link px-2 text-warning',
              title: 'Please verify your email',
            },
              ce('i', { className: 'ti ti-mail-exclamation', style: { fontSize: '1.1rem' } })
            )
          ),

          // Logged out: Sign in + Apply
          !isValid && ce('li', { className: 'nav-item' },
            ce('div', { className: 'd-flex align-items-center gap-2' },
              ce('a', {
                className: 'btn btn-sm',
                href: '/login.html',
                style: {
                  color:        'rgba(255,255,255,0.75)',
                  border:       '1px solid rgba(255,255,255,0.25)',
                  background:   'transparent',
                  fontWeight:   500,
                },
              }, 'Sign in'),
              ce('a', {
                className: 'btn btn-sm btn-primary',
                href: '/apply.html',
              }, 'Apply')
            )
          ),

          // Logged in: avatar dropdown
          isValid && ce(AvatarDropdown, { profile })
        )
      )
    )
  );
};

// ── Render function ──────────────────────────────────────────

let _navRoot = null;

function _renderNav(profile) {
  if (!_navRoot) {
    const el = document.getElementById('nav_container');
    if (!el) return;
    _navRoot = ReactDOM.createRoot(el);
  }
  _navRoot.render(ce(NavBarNesen, { profile }));
}

// ── Listen for auth changes ──────────────────────────────────

globalThis.addEventListener('cw:auth:change', (e) => {
  _renderNav(e.detail);
});

// ── Expose globals ───────────────────────────────────────────

if (globalThis.CW) {
  globalThis.CW._renderNav = _renderNav;
}

globalThis._renderNav = _renderNav;

// ── Initial render ───────────────────────────────────────────

(function () {
  const model = globalThis.pb?.authStore?.isValid ? globalThis.pb.authStore.model : null;
  if (model) {
    const cached  = typeof loadProfile === 'function' ? loadProfile(model.id) : null;
    const profile = cached || {
      id:          model.id,
      name:        model.name || model.email || '',
      email:       model.email,
      avatar:      null,
      initials:    typeof getInitials === 'function'    ? getInitials(model.name || model.email || '') : '?',
      avatarColor: typeof getAvatarColor === 'function' ? getAvatarColor(model.id) : '#123C7A',
      verified:    model.verified || false,
    };
    _renderNav(profile);
  } else {
    _renderNav(null);
  }
})();

// console.log('✅ nesen-ui.js loaded');
