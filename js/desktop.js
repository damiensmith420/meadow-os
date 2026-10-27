/**
 * desktop.js — Desktop icon registration, keyboard navigation, right-click menu
 */

import { getIcon } from './icons.js';

const DESKTOP_APPS = [
  { id: 'downloads', label: 'Downloads',  icon: 'downloads' },
  { id: 'about',     label: 'About Me',   icon: 'about'     },
  { id: 'terminal',  label: 'Terminal',   icon: 'terminal'  },
  { id: 'recycle',   label: 'Recycle Bin',icon: 'recycle'   },
  { id: 'game',      label: 'Snake',      icon: 'game'      },
  { id: 'breakout',  label: 'Breakout',   icon: 'breakout'  },
  { id: 'display',   label: 'Display',    icon: 'display'   },
];

/**
 * Render desktop icons.
 * @param {function} openApp - callback(appId)
 */
export function initDesktop(openApp) {
  const container = document.getElementById('desktop-icons');
  if (!container) return;
  container.innerHTML = '';

  DESKTOP_APPS.forEach((app, idx) => {
    const icon = document.createElement('div');
    icon.className = 'desktop-icon';
    icon.dataset.appId = app.id;
    icon.tabIndex = 0;
    icon.setAttribute('role', 'listitem');
    icon.setAttribute('aria-label', app.label + ' — double-click to open');
    icon.innerHTML = `${getIcon(app.icon)}<span>${escHtml(app.label)}</span>`;

    // Single click: select
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      container.querySelectorAll('.desktop-icon.selected').forEach(s => s.classList.remove('selected'));
      icon.classList.add('selected');
    });

    // Double click: open
    icon.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      openApp(app.id);
    });

    // Keyboard: Enter to open
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); openApp(app.id); }
      if (e.key === 'ArrowDown') { e.preventDefault(); focusIconAt(container, idx + 1); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); focusIconAt(container, idx - 1); }
    });

    // Right-click: context menu
    icon.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showDesktopIconMenu(e, app, openApp);
    });

    container.appendChild(icon);
  });

  // Click on desktop deselects all
  document.getElementById('desktop')?.addEventListener('click', () => {
    container.querySelectorAll('.desktop-icon.selected').forEach(s => s.classList.remove('selected'));
  });

  // Right-click on desktop background
  document.getElementById('desktop')?.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.desktop-icon') || e.target.closest('.os-window') || e.target.closest('.recent-gadget')) return;
    e.preventDefault();
    showDesktopBgMenu(e, openApp);
  });
}

function focusIconAt(container, idx) {
  const icons = [...container.querySelectorAll('.desktop-icon')];
  const i = Math.max(0, Math.min(icons.length - 1, idx));
  icons[i]?.focus();
}

function showDesktopIconMenu(e, app, openApp) {
  const menu = document.getElementById('ctx-menu');
  menu.innerHTML = '';
  [
    { label: 'Open', cb: () => openApp(app.id) },
    { sep: true },
    { label: 'Properties', cb: () => {
        import('./dialog.js').then(({ showProperties }) => {
          showProperties({ name: app.label, type: 'Application shortcut' });
        });
    }},
  ].forEach(a => appendCtxItem(menu, a));
  positionCtxMenu(menu, e.clientX, e.clientY);
}

function showDesktopBgMenu(e, openApp) {
  const menu = document.getElementById('ctx-menu');
  menu.innerHTML = '';
  [
    { label: 'Display Properties', cb: () => import('./dialog.js').then(m => m.showDisplayProperties()) },
    { sep: true },
    { label: 'Open Downloads', cb: () => openApp('downloads') },
    { label: 'Open Terminal',  cb: () => openApp('terminal')  },
  ].forEach(a => appendCtxItem(menu, a));
  positionCtxMenu(menu, e.clientX, e.clientY);
}

function appendCtxItem(menu, a) {
  if (a.sep) {
    const sep = document.createElement('div');
    sep.className = 'ctx-menu-separator';
    menu.appendChild(sep);
  } else {
    const btn = document.createElement('button');
    btn.className = 'ctx-menu-item';
    btn.textContent = a.label;
    btn.setAttribute('role', 'menuitem');
    btn.addEventListener('click', () => { hideCtxMenu(); a.cb && a.cb(); });
    btn.addEventListener('keydown', ev => { if (ev.key === 'Enter') btn.click(); });
    menu.appendChild(btn);
  }
}

function positionCtxMenu(menu, x, y) {
  menu.classList.remove('hidden');
  const maxX = window.innerWidth - 170;
  const maxY = window.innerHeight - (menu.children.length * 26 + 10);
  menu.style.left = Math.min(x, maxX) + 'px';
  menu.style.top  = Math.min(y, maxY) + 'px';
  document.addEventListener('click', hideCtxMenu, { once: true });
  document.addEventListener('contextmenu', hideCtxMenu, { once: true });
}

function hideCtxMenu() {
  document.getElementById('ctx-menu')?.classList.add('hidden');
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
