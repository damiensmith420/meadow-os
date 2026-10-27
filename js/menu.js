/**
 * menu.js — Meadow menu popup (the green button)
 */

import { getIcon } from './icons.js';
import { showDisplayProperties } from './dialog.js';

let _repos = [];
let _openApp = null; // callback(appId)

export function initMenu(repos, openApp) {
  _repos = repos;
  _openApp = openApp;
  buildMenu();
  wireButton();
}

function wireButton() {
  const btn = document.getElementById('meadow-btn');
  const menu = document.getElementById('meadow-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !menu.classList.contains('hidden');
    if (open) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== btn) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

function openMenu() {
  const menu = document.getElementById('meadow-menu');
  const btn  = document.getElementById('meadow-btn');
  menu.classList.remove('hidden');
  btn.setAttribute('aria-expanded', 'true');
  menu.querySelector('[role="menuitem"]')?.focus();
}

function closeMenu() {
  const menu = document.getElementById('meadow-menu');
  const btn  = document.getElementById('meadow-btn');
  menu.classList.add('hidden');
  btn.setAttribute('aria-expanded', 'false');
}

function buildMenu() {
  const menu = document.getElementById('meadow-menu');
  if (!menu) return;

  const apps = [
    { id: 'downloads', label: 'Downloads',     sub: 'My GitHub releases',  icon: 'downloads' },
    { id: 'terminal',  label: 'Terminal',       sub: 'Command prompt',      icon: 'terminal'  },
    { id: 'about',     label: 'About Me',       sub: 'Read about.md',       icon: 'about'     },
    { id: 'game',      label: 'Snake',          sub: 'Built-in game',       icon: 'game'      },
    { id: 'breakout',  label: 'Breakout',        sub: 'Brick breaker game',  icon: 'breakout'  },
    { id: 'frogger',   label: 'Frogger',         sub: 'Cross the road!',     icon: 'frogger'   },
    { id: 'recycle',   label: 'Recycle Bin',    sub: '',                    icon: 'recycle'   },
    { id: 'display',   label: 'Display Props',  sub: 'Change theme',        icon: 'display'   },
  ];

  menu.innerHTML = `
    <div class="meadow-menu-header">
      ${getIcon('folder-code')}
      <div>
        <div>Meadow OS</div>
        <div class="meadow-menu-user">damiensmith420</div>
      </div>
    </div>
    <div class="meadow-menu-body">
      <div class="meadow-menu-left" role="menu" aria-label="Applications">
        ${apps.map(a => `
          <button class="menu-item" role="menuitem" data-app="${a.id}" aria-label="${escHtml(a.label)}">
            ${getIcon(a.icon)}
            <span class="mi-label">${escHtml(a.label)}<span class="mi-sub">${escHtml(a.sub)}</span></span>
          </button>`).join('')}
      </div>
    </div>
    <div class="meadow-menu-footer">
      <button class="menu-footer-btn shutdown" data-action="shutdown" aria-label="Shut Down">⏻ Shut Down</button>
    </div>`;

  menu.addEventListener('click', (e) => {
    const item = e.target.closest('[data-app]');
    if (item) {
      closeMenu();
      const appId = item.dataset.app;
      if (appId === 'display') {
        showDisplayProperties();
      } else {
        _openApp && _openApp(appId);
      }
      return;
    }
    const action = e.target.closest('[data-action]');
    if (action?.dataset.action === 'shutdown') {
      closeMenu();
      doShutdown();
    }
  });

  // Keyboard navigation within menu
  menu.addEventListener('keydown', (e) => {
    const items = [...menu.querySelectorAll('[role="menuitem"]')];
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(idx + 1) % items.length]?.focus(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); items[(idx - 1 + items.length) % items.length]?.focus(); }
  });
}

// ── Shut Down sequence ────────────────────────────────────────────────────────

export function doShutdown() {
  // Create a full-screen overlay that fades to black
  const overlay = document.createElement('div');
  overlay.className = 'shutdown-overlay';
  document.body.appendChild(overlay);

  // Trigger fade
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { overlay.classList.add('active'); });
  });

  // After fade, show login screen
  setTimeout(() => {
    document.getElementById('desktop')?.classList.add('hidden');
    document.getElementById('taskbar')?.classList.add('hidden');
    document.getElementById('meadow-menu')?.classList.add('hidden');
    document.getElementById('recent-gadget')?.classList.add('hidden');

    const login = document.getElementById('login-screen');
    login?.classList.remove('hidden');
    overlay.remove();
  }, 1500);

  // Wire login button
  document.getElementById('login-btn')?.addEventListener('click', () => {
    document.getElementById('login-screen')?.classList.add('hidden');
    document.getElementById('desktop')?.classList.remove('hidden');
    document.getElementById('taskbar')?.classList.remove('hidden');
  }, { once: true });
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
