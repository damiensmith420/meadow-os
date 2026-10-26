/**
 * terminal.js — Fake terminal emulator window
 *
 * Supported commands:
 *   help, ls, cd <label>, download <label>, about, clear, theme <name>
 */

import { createWindow } from './windows.js';
import { applyTheme } from './theme.js';
import { getCachedReleases, formatBytes, formatDate } from './github.js';

let _repos = [];
let _releasesData = {};

/** Initialise terminal data (call from main.js after data loads) */
export function initTerminal(repos, releasesData) {
  _repos = repos;
  _releasesData = releasesData;
}

export function openTerminal() {
  const body = document.createElement('div');
  body.className = 'terminal-body';
  body.id = 'terminal-output';

  const el = createWindow({
    id: 'terminal',
    title: 'Meadow Terminal',
    icon: 'terminal',
    width: 560,
    height: 360,
    resizable: true,
    content: body,
  });

  // Print banner
  const out = el.querySelector('.terminal-body');
  printLines(out, [
    { text: '  Meadow OS Terminal v1.0', cls: 'info' },
    { text: '  Type "help" for available commands.', cls: 'info' },
    { text: '' },
  ]);

  addInputRow(out);
}

// ── Output helpers ────────────────────────────────────────────────────────────

function printLines(out, lines) {
  lines.forEach(({ text = '', cls = '' }) => {
    const div = document.createElement('div');
    div.className = 'terminal-line' + (cls ? ' ' + cls : '');
    div.textContent = text;
    out.insertBefore(div, out.querySelector('.terminal-input-row'));
  });
  scrollBottom(out);
}

function scrollBottom(out) {
  out.scrollTop = out.scrollHeight;
}

function addInputRow(out) {
  // Remove old input row if present
  out.querySelector('.terminal-input-row')?.remove();
  const row = document.createElement('div');
  row.className = 'terminal-input-row';
  row.innerHTML = `<span class="terminal-prompt">C:\\Meadow&gt;</span>
    <input class="terminal-input" type="text" autocomplete="off" spellcheck="false" aria-label="Terminal input" />`;
  out.appendChild(row);
  const input = row.querySelector('input');
  input.focus();

  // Command history
  const history = [];
  let histIdx = -1;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      input.value = '';
      histIdx = -1;
      if (cmd) history.unshift(cmd);

      // Echo
      const echo = document.createElement('div');
      echo.className = 'terminal-line';
      echo.textContent = `C:\\Meadow> ${cmd}`;
      out.insertBefore(echo, row);

      handleCommand(cmd, out);
      scrollBottom(out);
    }
    if (e.key === 'ArrowUp') {
      histIdx = Math.min(histIdx + 1, history.length - 1);
      input.value = history[histIdx] || '';
    }
    if (e.key === 'ArrowDown') {
      histIdx = Math.max(histIdx - 1, -1);
      input.value = histIdx >= 0 ? history[histIdx] : '';
    }
  });
}

// ── Command dispatcher ────────────────────────────────────────────────────────

function handleCommand(raw, out) {
  const parts = raw.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':     cmdHelp(out); break;
    case 'ls':
    case 'dir':      cmdLs(out, args); break;
    case 'cd':       cmdCd(out, args); break;
    case 'download': cmdDownload(out, args); break;
    case 'about':    cmdAbout(out); break;
    case 'clear':    cmdClear(out); break;
    case 'theme':    cmdTheme(out, args); break;
    case 'echo':     print(out, args.join(' ')); break;
    case 'ver':      print(out, 'Meadow OS Terminal 1.0.0', 'info'); break;
    case '':         break;
    default:
      print(out, `'${cmd}' is not recognized. Type "help".`, 'error');
  }
}

function cmdHelp(out) {
  printLines(out, [
    { text: 'Available commands:', cls: 'info' },
    { text: '  help              — show this message' },
    { text: '  ls [label]        — list repos or releases for a repo' },
    { text: '  cd <label>        — show info about a repo' },
    { text: '  download <label>  — open latest download for a repo' },
    { text: '  about             — open the About Me document' },
    { text: '  theme [name]      — set theme: meadow | dark | silver' },
    { text: '  clear             — clear screen' },
    { text: '  ver               — version info' },
    { text: '' },
  ]);
}

function cmdLs(out, args) {
  if (args.length === 0) {
    if (_repos.length === 0) { print(out, '(empty)'); return; }
    printLines(out, [
      { text: 'Downloads\\', cls: 'info' },
      ..._repos.map(r => ({ text: `  [DIR]  ${r.label}  — ${r.description || ''}` })),
      { text: '' },
    ]);
    return;
  }
  const label = args.join(' ');
  const repo = _repos.find(r => r.label.toLowerCase() === label.toLowerCase());
  if (!repo) { print(out, `ls: no repo named "${label}"`, 'error'); return; }
  const releases = _releasesData[repo.repo] || getCachedReleases(repo.repo) || [];
  if (releases.length === 0) { print(out, `(no releases for ${repo.label})`); return; }
  printLines(out, [
    { text: `Downloads\\${repo.label}\\`, cls: 'info' },
    { text: '  Download latest   [shortcut]' },
    { text: '  View on GitHub    [shortcut]' },
    ...releases.map((r, i) => ({
      text: `  [DIR]  ${r.tag_name}${i === 0 ? '  (latest)' : ''}  — ${formatDate(r.published_at)}`
    })),
    { text: '' },
  ]);
}

function cmdCd(out, args) {
  const label = args.join(' ');
  const repo = _repos.find(r => r.label.toLowerCase() === label.toLowerCase());
  if (!repo) { print(out, `cd: not found: "${label}"`, 'error'); return; }
  const releases = _releasesData[repo.repo] || getCachedReleases(repo.repo) || [];
  printLines(out, [
    { text: `─── ${repo.label} ───`, cls: 'info' },
    { text: `Repo:        ${repo.repo}` },
    { text: `Description: ${repo.description || '(none)'}` },
    { text: `Releases:    ${releases.length}` },
    releases.length > 0 ? { text: `Latest:      ${releases[0].tag_name} (${formatDate(releases[0].published_at)})` } : { text: '' },
    { text: '' },
  ]);
}

function cmdDownload(out, args) {
  const label = args.join(' ');
  const repo = _repos.find(r => r.label.toLowerCase() === label.toLowerCase());
  if (!repo) { print(out, `download: repo not found: "${label}"`, 'error'); return; }
  const releases = _releasesData[repo.repo] || getCachedReleases(repo.repo) || [];
  if (releases.length === 0) { print(out, `No releases for ${repo.label}.`, 'warn'); return; }
  const assets = releases[0].assets || [];
  if (assets.length === 0) { print(out, `Latest release has no assets.`, 'warn'); return; }
  if (assets.length === 1) {
    window.open(assets[0].browser_download_url, '_blank', 'noopener');
    print(out, `Opening ${assets[0].name} (${formatBytes(assets[0].size)})…`, 'info');
    return;
  }
  printLines(out, [
    { text: `Multiple assets for ${releases[0].tag_name}:`, cls: 'info' },
    ...assets.map(a => ({ text: `  ${a.name}  (${formatBytes(a.size)})  — ${a.download_count} downloads` })),
    { text: 'Use the Downloads window to choose one.', cls: 'warn' },
    { text: '' },
  ]);
}

function cmdAbout(out) {
  import('./notepad.js').then(({ openAbout }) => openAbout());
  print(out, 'Opening About Me…', 'info');
}

function cmdClear(out) {
  out.querySelectorAll('.terminal-line').forEach(l => l.remove());
}

function cmdTheme(out, args) {
  const name = args[0]?.toLowerCase();
  const map = { meadow: 'theme-meadow', dark: 'theme-dark', silver: 'theme-silver' };
  if (!name || !map[name]) {
    print(out, `theme: available themes: meadow, dark, silver`, 'info');
    return;
  }
  applyTheme(map[name]);
  print(out, `Theme changed to: ${name}`, 'info');
}

function print(out, text, cls = '') {
  printLines(out, [{ text, cls }]);
}
