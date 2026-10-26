/**
 * dialog.js — Reusable modal dialogs: error, warning, info, confirm, properties, display
 */

import { getIcon } from './icons.js';
import { getThemes, applyTheme, getCurrentTheme } from './theme.js';

/**
 * Show a modal dialog overlay.
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.icon  - 'error'|'warning'|'info'
 * @param {string|HTMLElement} opts.body
 * @param {Array<{label,primary,cb}>} [opts.buttons]
 * @returns {HTMLElement} overlay element
 */
export function showDialog({ title, icon = 'info', body, buttons = [{ label: 'OK', primary: true }] }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'alertdialog');
  overlay.setAttribute('aria-modal', 'true');

  const win = document.createElement('div');
  win.className = 'dialog-window';

  win.innerHTML = `
    <div class="dialog-titlebar">
      ${getIcon(icon)}
      <span>${escHtml(title)}</span>
      <button class="dialog-close" aria-label="Close">✕</button>
    </div>
    <div class="dialog-body">
      <div class="dialog-icon-row">
        <div>${getIcon(icon)}</div>
        <div class="dialog-message"></div>
      </div>
    </div>
    <div class="dialog-footer"></div>`;

  const msgEl = win.querySelector('.dialog-message');
  if (typeof body === 'string') msgEl.innerHTML = body;
  else if (body instanceof HTMLElement) msgEl.appendChild(body);

  const footer = win.querySelector('.dialog-footer');
  buttons.forEach(({ label, primary, cb }) => {
    const btn = document.createElement('button');
    btn.className = 'dialog-btn' + (primary ? ' primary' : '');
    btn.textContent = label;
    btn.addEventListener('click', () => {
      overlay.remove();
      cb && cb();
    });
    footer.appendChild(btn);
  });

  win.querySelector('.dialog-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') overlay.remove();
  });
  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.appendChild(win);
  document.body.appendChild(overlay);
  win.querySelector('.dialog-btn, button').focus();
  return overlay;
}

/** Convenience: show an error dialog */
export function showError(title, message) {
  return showDialog({ title, icon: 'error', body: escHtml(message) });
}

/** Convenience: show a warning dialog */
export function showWarning(title, message) {
  return showDialog({ title, icon: 'warning', body: escHtml(message) });
}

/** Convenience: show a confirm dialog */
export function showConfirm(title, message, onOk, onCancel) {
  return showDialog({
    title, icon: 'warning', body: escHtml(message),
    buttons: [
      { label: 'Cancel', cb: onCancel },
      { label: 'OK', primary: true, cb: onOk },
    ],
  });
}

/**
 * Show a "Properties" dialog for a file or folder item.
 * @param {object} info - { name, type, size, date, tag, downloads, description }
 */
export function showProperties(info) {
  const rows = [
    ['Name',      info.name],
    ['Type',      info.type || 'File'],
    info.size    ? ['Size',      info.size]      : null,
    info.date    ? ['Published', info.date]      : null,
    info.tag     ? ['Tag',       info.tag]       : null,
    info.downloads !== undefined ? ['Downloads', String(info.downloads)] : null,
    info.description ? ['Description', info.description] : null,
  ].filter(Boolean);

  const html = `<dl class="props-grid">
    ${rows.map(([k, v]) => `<dt>${escHtml(k)}</dt><dd>${escHtml(String(v))}</dd>`).join('')}
  </dl>`;

  showDialog({ title: 'Properties — ' + info.name, icon: 'info', body: html });
}

/**
 * Show the Display Properties dialog (theme switcher).
 */
export function showDisplayProperties() {
  const themes = getThemes();
  const current = getCurrentTheme();

  const container = document.createElement('div');
  container.innerHTML = `<p style="margin-bottom:12px;font-size:12px;">Choose a desktop appearance:</p>
    <div class="theme-grid"></div>`;

  const grid = container.querySelector('.theme-grid');
  themes.forEach(t => {
    const swatch = document.createElement('div');
    swatch.className = 'theme-swatch' + (t.id === current ? ' active' : '');
    swatch.setAttribute('tabindex', '0');
    swatch.setAttribute('aria-label', t.label + ' theme');
    swatch.innerHTML = `
      <div class="theme-swatch-preview" style="background:linear-gradient(180deg,${t.colors.bar} 0%,${t.colors.bar} 30%,${t.colors.body} 30%,${t.colors.body} 70%,${t.colors.grass} 70%)"></div>
      <span>${t.label}</span>`;
    swatch.addEventListener('click', () => {
      grid.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      applyTheme(t.id);
    });
    swatch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); swatch.click(); }
    });
    grid.appendChild(swatch);
  });

  showDialog({
    title: 'Display Properties',
    icon: 'display',
    body: container,
    buttons: [{ label: 'Close', primary: true }],
  });
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
