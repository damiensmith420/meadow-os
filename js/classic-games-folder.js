/**
 * classic-games-folder.js — "Classic Games" folder window
 * Opens an explorer-style window containing Snake, Breakout, Frog Crossing,
 * and a shortcut to the DISCLAIMER.txt file.
 */

import { createWindow } from './windows.js';
import { getIcon } from './icons.js';

const ITEMS = [
  { id: 'game',          label: 'Snake',          icon: 'game',          sub: 'Arrow keys'      },
  { id: 'breakout',      label: 'Breakout',        icon: 'breakout',      sub: 'Mouse / ← →'    },
  { id: 'frogger',       label: 'Frog Crossing',   icon: 'frogger',       sub: 'Arrow keys'      },
  { id: 'disclaimer',    label: 'DISCLAIMER.txt',  icon: 'file-text',     sub: 'IP notice'       },
];

export function openClassicGames(openApp) {
  const body = document.createElement('div');
  body.style.cssText = `
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--win-bg, #ffffff);
    font-family: var(--font-ui, system-ui, sans-serif);
  `;

  // ── Address bar ────────────────────────────────────────────────────────────
  const addrBar = document.createElement('div');
  addrBar.style.cssText = `
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-bottom: 1px solid var(--border, #d0d0d0);
    font-size: 12px;
    color: var(--text-muted, #666);
    background: var(--win-toolbar, #f4f4f4);
    flex-shrink: 0;
  `;
  addrBar.innerHTML = `
    <span style="opacity:0.6">${getIcon('folder-code')}</span>
    <span style="color:var(--text,#333);font-size:12px;">Meadow OS</span>
    <span style="opacity:0.4">›</span>
    <span style="color:var(--text,#333);font-size:12px;">Classic Games</span>`;
  body.appendChild(addrBar);

  // ── Icon grid ──────────────────────────────────────────────────────────────
  const grid = document.createElement('div');
  grid.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 8px;
    padding: 16px;
    flex: 1;
    overflow-y: auto;
  `;
  grid.setAttribute('role', 'list');
  grid.setAttribute('aria-label', 'Classic Games folder contents');

  ITEMS.forEach((item, idx) => {
    const tile = document.createElement('div');
    tile.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 88px;
      padding: 8px 4px 6px;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
      user-select: none;
      border: 1px solid transparent;
      transition: background 0.1s;
    `;
    tile.setAttribute('role', 'listitem');
    tile.setAttribute('aria-label', item.label + ' — double-click to open');
    tile.tabIndex = 0;
    tile.dataset.itemId = item.id;

    tile.innerHTML = `
      <div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
        ${getIcon(item.icon)}
      </div>
      <span style="font-size:11px;margin-top:4px;line-height:1.3;word-break:break-word;color:var(--text,#1f2328);">
        ${escHtml(item.label)}
      </span>
      <span style="font-size:10px;color:var(--text-muted,#888);margin-top:1px;">
        ${escHtml(item.sub)}
      </span>`;

    // Hover style
    tile.addEventListener('mouseenter', () => {
      tile.style.background = 'var(--hover-bg, rgba(0,0,0,0.06))';
      tile.style.borderColor = 'var(--border, #d0d0d0)';
    });
    tile.addEventListener('mouseleave', () => {
      if (!tile.classList.contains('selected')) {
        tile.style.background = '';
        tile.style.borderColor = 'transparent';
      }
    });

    // Single click: select
    tile.addEventListener('click', (e) => {
      e.stopPropagation();
      grid.querySelectorAll('[data-item-id]').forEach(t => {
        t.classList.remove('selected');
        t.style.background = '';
        t.style.borderColor = 'transparent';
      });
      tile.classList.add('selected');
      tile.style.background = 'var(--sel-bg, rgba(59,130,212,0.15))';
      tile.style.borderColor = 'var(--accent, #3b82d4)';
    });

    // Double-click / Enter: open
    const launch = () => launchItem(item, openApp);
    tile.addEventListener('dblclick', launch);
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); launch(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); focusTileAt(grid, idx + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); focusTileAt(grid, idx - 1); }
    });

    grid.appendChild(tile);
  });

  // Deselect on background click
  grid.addEventListener('click', (e) => {
    if (e.target === grid) {
      grid.querySelectorAll('[data-item-id]').forEach(t => {
        t.classList.remove('selected');
        t.style.background = '';
        t.style.borderColor = 'transparent';
      });
    }
  });

  body.appendChild(grid);

  // ── Status bar ─────────────────────────────────────────────────────────────
  const status = document.createElement('div');
  status.style.cssText = `
    padding: 3px 10px;
    border-top: 1px solid var(--border, #d0d0d0);
    font-size: 11px;
    color: var(--text-muted, #888);
    background: var(--win-toolbar, #f4f4f4);
    flex-shrink: 0;
  `;
  status.textContent = `${ITEMS.length} items`;
  body.appendChild(status);

  createWindow({
    id: 'folder-classic-games',
    title: 'Classic Games',
    icon: 'classic-games',
    width: 460,
    height: 340,
    resizable: true,
    content: body,
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function launchItem(item, openApp) {
  if (item.id === 'disclaimer') {
    openDisclaimer();
    return;
  }
  openApp(item.id);
}

function openDisclaimer() {
  fetch('data/classic-games/DISCLAIMER.txt')
    .then(r => r.text())
    .then(text => {
      const pre = document.createElement('pre');
      pre.style.cssText = `
        margin: 0;
        padding: 12px;
        font-family: monospace;
        font-size: 12px;
        line-height: 1.6;
        white-space: pre-wrap;
        word-break: break-word;
        color: var(--text, #1f2328);
        background: var(--win-bg, #fff);
        height: 100%;
        overflow-y: auto;
        box-sizing: border-box;
      `;
      pre.textContent = text;

      import('./windows.js').then(({ createWindow }) => {
        createWindow({
          id: 'disclaimer-txt',
          title: 'DISCLAIMER.txt — Notepad',
          icon: 'file-text',
          width: 620,
          height: 480,
          resizable: true,
          content: pre,
        });
      });
    })
    .catch(() => {
      import('./windows.js').then(({ createWindow }) => {
        createWindow({
          id: 'disclaimer-txt',
          title: 'DISCLAIMER.txt — Notepad',
          icon: 'file-text',
          width: 620,
          height: 480,
          resizable: true,
          content: '<pre style="padding:12px;font-family:monospace;font-size:12px;">Could not load DISCLAIMER.txt</pre>',
        });
      });
    });
}

function focusTileAt(grid, idx) {
  const tiles = [...grid.querySelectorAll('[data-item-id]')];
  const i = Math.max(0, Math.min(tiles.length - 1, idx));
  tiles[i]?.focus();
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
