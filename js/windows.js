/**
 * windows.js — Window Manager
 * Creates, manages, focuses, minimizes, maximizes, restores, and closes
 * draggable/resizable OS-style windows.
 */

import { getIcon } from './icons.js';
import { taskbar } from './taskbar.js';

let zCounter = 100;

/** Map of all open window instances keyed by id */
const openWindows = new Map();

/**
 * Create and show a new window.
 * @param {object} opts
 * @param {string}   opts.id         - Unique window ID
 * @param {string}   opts.title      - Title bar text
 * @param {string}   opts.icon       - Icon name for getIcon()
 * @param {number}   [opts.width]    - Initial width px
 * @param {number}   [opts.height]   - Initial height px
 * @param {number}   [opts.x]        - Initial left px
 * @param {number}   [opts.y]        - Initial top px
 * @param {string|HTMLElement} opts.content - Inner HTML or element for win-body
 * @param {function} [opts.onClose]  - Called when window is closed
 * @param {boolean}  [opts.resizable] - Whether resize handle is shown
 * @param {string[]} [opts.menuItems] - Menubar items (labels)
 * @param {function} [opts.onMenuClick] - callback(label)
 * @returns {HTMLElement} The window element
 */
export function createWindow(opts) {
  const {
    id,
    title = 'Window',
    icon = 'folder',
    width = 580,
    height = 420,
    x,
    y,
    content = '',
    onClose,
    resizable = true,
    menuItems = [],
    onMenuClick,
  } = opts;

  // If already open, just focus it
  if (openWindows.has(id)) {
    const existing = openWindows.get(id);
    restoreWindow(existing.el);
    focusWindow(existing.el);
    return existing.el;
  }

  const layer = document.getElementById('window-layer');
  const desktop = document.getElementById('desktop');
  const dw = desktop.clientWidth;
  const dh = desktop.clientHeight;

  // Default position: centered with slight offset per window
  const count = openWindows.size;
  const startX = x !== undefined ? x : Math.max(20, (dw - width) / 2 + count * 24);
  const startY = y !== undefined ? y : Math.max(20, (dh - height) / 2 + count * 18);

  const el = document.createElement('div');
  el.className = 'os-window';
  el.dataset.winId = id;
  el.style.width = width + 'px';
  el.style.height = height + 'px';
  el.style.left = Math.min(startX, dw - 60) + 'px';
  el.style.top = Math.min(startY, dh - 40) + 'px';

  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', title);
  el.setAttribute('aria-modal', 'false');
  el.tabIndex = -1;

  // ── Title bar ──
  const titlebar = document.createElement('div');
  titlebar.className = 'win-titlebar';
  titlebar.setAttribute('aria-label', 'Title bar — drag to move');
  titlebar.innerHTML = `
    <span class="win-icon">${getIcon(icon)}</span>
    <span class="win-title">${escHtml(title)}</span>
    <div class="win-controls" role="group" aria-label="Window controls">
      <button class="win-btn win-btn-min"  aria-label="Minimize" title="Minimize">─</button>
      <button class="win-btn win-btn-max"  aria-label="Maximize" title="Maximize/Restore">□</button>
      <button class="win-btn win-btn-close" aria-label="Close"   title="Close">✕</button>
    </div>`;
  el.appendChild(titlebar);

  // ── Menubar (optional) ──
  if (menuItems.length) {
    const menubar = document.createElement('div');
    menubar.className = 'win-menubar';
    menuItems.forEach(label => {
      const item = document.createElement('button');
      item.className = 'win-menubar-item';
      item.textContent = label;
      item.addEventListener('click', () => onMenuClick && onMenuClick(label, el));
      menubar.appendChild(item);
    });
    el.appendChild(menubar);
  }

  // ── Body ──
  const body = document.createElement('div');
  body.className = 'win-body';
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }
  el.appendChild(body);

  // ── Resize handle ──
  if (resizable) {
    const rh = document.createElement('div');
    rh.className = 'win-resize-handle';
    rh.setAttribute('aria-hidden', 'true');
    el.appendChild(rh);
    setupResize(el, rh);
  }

  // ── Button handlers ──
  titlebar.querySelector('.win-btn-min').addEventListener('click', (e) => {
    e.stopPropagation();
    minimizeWindow(el);
  });
  titlebar.querySelector('.win-btn-max').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMaximize(el);
  });
  titlebar.querySelector('.win-btn-close').addEventListener('click', (e) => {
    e.stopPropagation();
    closeWindow(el);
  });

  // Keyboard: Escape closes
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeWindow(el);
  });

  // Focus on click
  el.addEventListener('mousedown', () => focusWindow(el));

  // Drag
  setupDrag(el, titlebar);

  layer.appendChild(el);
  focusWindow(el);

  const state = { el, id, title, icon, minimized: false, maximized: false, onClose };
  openWindows.set(id, state);

  taskbar.addWindow(id, title, icon, el);
  el.focus();

  return el;
}

/** Focus (bring to front) a window */
export function focusWindow(el) {
  el.style.zIndex = ++zCounter;
  document.querySelectorAll('.os-window').forEach(w => w.classList.remove('focused'));
  el.classList.add('focused');
  taskbar.setActive(el.dataset.winId);
}

/** Minimize a window (hide it, keep taskbar button) */
export function minimizeWindow(el) {
  el.classList.add('minimized');
  const state = openWindows.get(el.dataset.winId);
  if (state) state.minimized = true;
  taskbar.setActive(null);
}

/** Restore a window from minimized state */
export function restoreWindow(el) {
  el.classList.remove('minimized');
  const state = openWindows.get(el.dataset.winId);
  if (state) state.minimized = false;
  focusWindow(el);
}

/** Toggle maximize / restore */
export function toggleMaximize(el) {
  const state = openWindows.get(el.dataset.winId);
  if (!state) return;
  if (state.maximized) {
    el.classList.remove('maximized');
    el.style.width  = state._prevW  + 'px';
    el.style.height = state._prevH  + 'px';
    el.style.left   = state._prevX  + 'px';
    el.style.top    = state._prevY  + 'px';
    state.maximized = false;
  } else {
    state._prevW = el.offsetWidth;
    state._prevH = el.offsetHeight;
    state._prevX = el.offsetLeft;
    state._prevY = el.offsetTop;
    el.classList.add('maximized');
    state.maximized = true;
  }
  focusWindow(el);
}

/** Close and remove a window */
export function closeWindow(el) {
  const id = el.dataset.winId;
  const state = openWindows.get(id);
  if (state?.onClose) state.onClose();
  el.remove();
  openWindows.delete(id);
  taskbar.removeWindow(id);
}

/** Get the body element of a window */
export function getWindowBody(el) {
  return el.querySelector('.win-body');
}

/** Update the title of an open window */
export function setWindowTitle(id, title) {
  const state = openWindows.get(id);
  if (!state) return;
  const titleEl = state.el.querySelector('.win-title');
  if (titleEl) titleEl.textContent = title;
  taskbar.updateTitle(id, title);
}

// ── Drag implementation ──────────────────────────────────────────────────────
function setupDrag(el, handle) {
  let startX, startY, startL, startT;
  let dragging = false;

  handle.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (el.classList.contains('maximized')) return;
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    startL = el.offsetLeft; startT = el.offsetTop;
    e.preventDefault();
    focusWindow(el);
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    el.style.left = Math.max(0, startL + dx) + 'px';
    el.style.top  = Math.max(0, startT + dy) + 'px';
  });

  document.addEventListener('mouseup', () => { dragging = false; });

  // Touch support for mobile (not shown in window mode, but keeps drag sane)
  handle.addEventListener('touchstart', (e) => {
    if (el.classList.contains('maximized')) return;
    const t = e.touches[0];
    dragging = true;
    startX = t.clientX; startY = t.clientY;
    startL = el.offsetLeft; startT = el.offsetTop;
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    el.style.left = Math.max(0, startL + (t.clientX - startX)) + 'px';
    el.style.top  = Math.max(0, startT + (t.clientY - startY)) + 'px';
  }, { passive: true });
  document.addEventListener('touchend', () => { dragging = false; });
}

// ── Resize implementation ────────────────────────────────────────────────────
function setupResize(el, handle) {
  let resizing = false;
  let startX, startY, startW, startH;

  handle.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (el.classList.contains('maximized')) return;
    resizing = true;
    startX = e.clientX; startY = e.clientY;
    startW = el.offsetWidth; startH = el.offsetHeight;
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', (e) => {
    if (!resizing) return;
    const nw = Math.max(280, startW + (e.clientX - startX));
    const nh = Math.max(120, startH + (e.clientY - startY));
    el.style.width  = nw + 'px';
    el.style.height = nh + 'px';
  });

  document.addEventListener('mouseup', () => { resizing = false; });
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/** Double-click titlebar to toggle maximize */
document.addEventListener('dblclick', (e) => {
  const tb = e.target.closest('.win-titlebar');
  if (!tb) return;
  const win = tb.closest('.os-window');
  if (win) toggleMaximize(win);
});
