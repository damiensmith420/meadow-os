/**
 * downloads.js — Downloads folder window
 *
 * Implements a multi-level file-system browser:
 *   Downloads\                     — root: one folder per manifest repo
 *   Downloads\<label>\             — repo folder: shortcuts + one folder per release tag
 *   Downloads\<label>\<tag>\       — version folder: each release asset as a file
 */

import { createWindow } from './windows.js';
import { getIcon, iconForFile } from './icons.js';
import { showDialog, showProperties, showError } from './dialog.js';
import { getCachedReleases, fetchRepoReleases, formatBytes, formatDate } from './github.js';

const WIN_ID = 'downloads';

/**
 * Open the Downloads window.
 * @param {Array} repos  - from repos.json
 * @param {Object} releasesData - keyed by "owner/repo"
 */
export function openDownloads(repos, releasesData) {
  const el = createWindow({
    id: WIN_ID,
    title: 'Downloads',
    icon: 'downloads',
    width: 680,
    height: 460,
    resizable: true,
    menuItems: ['File', 'View', 'Help'],
    onMenuClick: (label, win) => handleMenuClick(label, win, repos, releasesData),
  });

  // Toolbar + address bar + folder view injected into win-body
  buildFolderChrome(el, repos, releasesData);
  navigateTo(el, [], repos, releasesData);
}

// ── Chrome (toolbar + address bar) ──────────────────────────────────────────

function buildFolderChrome(winEl, repos, releasesData) {
  const body = winEl.querySelector('.win-body');
  body.style.display = 'flex';
  body.style.flexDirection = 'column';
  body.style.padding = '0';

  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'win-toolbar';
  toolbar.innerHTML = `
    <button class="win-toolbar-btn" data-action="back"    aria-label="Back"    disabled>◀ Back</button>
    <button class="win-toolbar-btn" data-action="up"      aria-label="Up"      disabled>▲ Up</button>
    <button class="win-toolbar-btn" data-action="refresh" aria-label="Refresh">⟳ Refresh</button>
    <span style="flex:1"></span>
    <button class="win-toolbar-btn" data-action="icons"   aria-label="Icons view"  title="Icons">⊞</button>
    <button class="win-toolbar-btn" data-action="details" aria-label="Details view" title="Details">☰</button>`;
  body.appendChild(toolbar);

  // Address bar
  const addrBar = document.createElement('div');
  addrBar.className = 'win-addressbar';
  addrBar.innerHTML = `<label for="addr-${WIN_ID}">Address:</label>
    <input id="addr-${WIN_ID}" type="text" readonly value="Downloads" aria-label="Current path" />`;
  body.appendChild(addrBar);

  // Folder content area
  const content = document.createElement('div');
  content.className = 'folder-view';
  content.dataset.viewMode = 'icons';
  body.appendChild(content);

  // Status bar
  const status = document.createElement('div');
  status.className = 'win-statusbar';
  status.innerHTML = `<span class="status-count"></span>
    <span class="win-statusbar-sep"></span>
    <span class="status-info"></span>`;
  body.appendChild(status);

  // Toolbar button wiring
  toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const state = getNavState(winEl);
    switch (btn.dataset.action) {
      case 'back':    navigateBack(winEl, repos, releasesData); break;
      case 'up':      navigateUp(winEl, repos, releasesData); break;
      case 'refresh': navigateTo(winEl, state.path, repos, releasesData, true); break;
      case 'icons':   setView(winEl, 'icons', repos, releasesData); break;
      case 'details': setView(winEl, 'details', repos, releasesData); break;
    }
  });
}

// ── Navigation state (stored on the window element) ─────────────────────────

function getNavState(winEl) {
  if (!winEl._navState) winEl._navState = { path: [], history: [] };
  return winEl._navState;
}

function navigateTo(winEl, path, repos, releasesData, force = false) {
  const state = getNavState(winEl);
  state.history.push([...state.path]);
  state.path = [...path];
  renderFolder(winEl, repos, releasesData);
  updateChrome(winEl);
}

function navigateBack(winEl, repos, releasesData) {
  const state = getNavState(winEl);
  if (state.history.length === 0) return;
  state.path = state.history.pop();
  renderFolder(winEl, repos, releasesData);
  updateChrome(winEl);
}

function navigateUp(winEl, repos, releasesData) {
  const state = getNavState(winEl);
  if (state.path.length === 0) return;
  const prev = [...state.path];
  state.history.push(prev);
  state.path = state.path.slice(0, -1);
  renderFolder(winEl, repos, releasesData);
  updateChrome(winEl);
}

function updateChrome(winEl) {
  const state = getNavState(winEl);
  const addr = winEl.querySelector('.win-addressbar input');
  if (addr) addr.value = ['Downloads', ...state.path].join('\\');
  const backBtn = winEl.querySelector('[data-action="back"]');
  const upBtn   = winEl.querySelector('[data-action="up"]');
  if (backBtn) backBtn.disabled = state.history.length === 0;
  if (upBtn)   upBtn.disabled   = state.path.length === 0;
}

function setView(winEl, mode, repos, releasesData) {
  const content = winEl.querySelector('.folder-view');
  if (content) content.dataset.viewMode = mode;
  renderFolder(winEl, repos, releasesData);
}

// ── Render helpers ────────────────────────────────────────────────────────────

function renderFolder(winEl, repos, releasesData) {
  const state = getNavState(winEl);
  const content = winEl.querySelector('.folder-view');
  const status  = winEl.querySelector('.win-statusbar');
  if (!content) return;

  const mode = content.dataset.viewMode || 'icons';
  content.innerHTML = '';

  const path = state.path;

  // Depth 0: root — show all repo folders
  if (path.length === 0) {
    renderRootLevel(content, status, mode, repos, releasesData, winEl);
    return;
  }

  // Depth 1: repo folder
  const repoEntry = repos.find(r => r.label === path[0]);
  if (!repoEntry) {
    renderError(content, 'Folder not found: ' + path[0]);
    return;
  }
  const releases = releasesData[repoEntry.repo] || getCachedReleases(repoEntry.repo) || null;

  if (path.length === 1) {
    renderRepoLevel(content, status, mode, repoEntry, releases, winEl, repos, releasesData);
    return;
  }

  // Depth 2: version folder
  if (path.length === 2) {
    if (!releases) {
      renderLoading(content);
      fetchRepoReleases(repoEntry.repo).then(data => {
        releasesData[repoEntry.repo] = data;
        renderFolder(winEl, repos, releasesData);
      }).catch(err => renderError(content, err.message));
      return;
    }
    const release = releases.find(r => r.tag_name === path[1]);
    if (!release) {
      renderError(content, 'Release not found: ' + path[1]);
      return;
    }
    renderVersionLevel(content, status, mode, repoEntry, release, winEl, repos, releasesData);
    return;
  }

  renderError(content, 'Path not found.');
}

// ── Root level ───────────────────────────────────────────────────────────────

function renderRootLevel(content, status, mode, repos, releasesData, winEl) {
  if (repos.length === 0) {
    content.innerHTML = `<div class="empty-state">${getIcon('downloads')}<p>No repos in manifest yet.<br>Edit <code>data/repos.json</code> to add some.</p></div>`;
    setStatus(status, 0, '');
    return;
  }
  const items = repos.map(r => ({
    icon: r.icon || 'folder',
    label: r.label,
    description: r.description,
    type: 'folder',
    onOpen: () => navigateTo(winEl, [r.label], repos, releasesData),
    onProps: () => showProperties({ name: r.label, type: 'Folder', description: r.description }),
  }));
  renderItems(content, mode, items);
  setStatus(status, items.length, `${items.length} folder(s)`);
}

// ── Repo level ───────────────────────────────────────────────────────────────

function renderRepoLevel(content, status, mode, repo, releases, winEl, repos, releasesData) {
  if (!releases) {
    renderLoading(content);
    fetchRepoReleases(repo.repo).then(data => {
      releasesData[repo.repo] = data;
      renderFolder(winEl, repos, releasesData);
    }).catch(err => showError('Fetch error', err.message));
    return;
  }

  if (releases.length === 0) {
    content.innerHTML = `<div class="empty-state">${getIcon('info')}<p>No releases published yet for <strong>${escHtml(repo.label)}</strong>.</p>
      <a href="https://github.com/${repo.repo}/releases" target="_blank" rel="noopener">Open releases on GitHub ↗</a></div>`;
    setStatus(status, 0, 'No releases');
    return;
  }

  const latest = releases[0];
  const items = [
    // "Download latest" shortcut
    {
      icon: 'link-shortcut',
      label: 'Download latest',
      description: `Latest: ${latest.tag_name}`,
      type: 'shortcut',
      badge: null,
      onOpen: () => handleDownloadLatest(repo, latest),
      onProps: () => showProperties({
        name: 'Download latest',
        type: 'Shortcut',
        description: `Points to latest release: ${latest.tag_name}`,
        date: formatDate(latest.published_at),
        tag: latest.tag_name,
      }),
    },
    // "View on GitHub" shortcut
    {
      icon: 'github',
      label: 'View on GitHub',
      type: 'shortcut',
      onOpen: () => window.open(`https://github.com/${repo.repo}`, '_blank', 'noopener'),
      onProps: () => showProperties({ name: 'View on GitHub', type: 'Shortcut', description: `https://github.com/${repo.repo}` }),
    },
    // "Releases page" shortcut
    {
      icon: 'link-shortcut',
      label: 'Releases page',
      type: 'shortcut',
      onOpen: () => window.open(`https://github.com/${repo.repo}/releases`, '_blank', 'noopener'),
      onProps: () => showProperties({ name: 'Releases page', type: 'Shortcut', description: `https://github.com/${repo.repo}/releases` }),
    },
    // One folder per release
    ...releases.map((rel, idx) => ({
      icon: 'folder',
      label: rel.tag_name,
      description: rel.name || rel.tag_name,
      type: 'folder',
      badge: idx === 0 ? 'latest' : null,
      onOpen: () => navigateTo(winEl, [repo.label, rel.tag_name], repos, releasesData),
      onProps: () => showProperties({
        name: rel.tag_name,
        type: 'Release folder',
        date: formatDate(rel.published_at),
        tag: rel.tag_name,
        description: rel.name || rel.tag_name,
      }),
    })),
  ];
  renderItems(content, mode, items);
  setStatus(status, releases.length, `${releases.length} release(s)`);
}

// ── Version level ────────────────────────────────────────────────────────────

function renderVersionLevel(content, status, mode, repo, release, winEl, repos, releasesData) {
  const assets = release.assets || [];

  const items = [
    // Release notes
    {
      icon: 'release-notes',
      label: 'Release notes.txt',
      description: 'Markdown release body',
      type: 'text',
      onOpen: () => openReleaseNotes(repo, release),
      onProps: () => showProperties({
        name: 'Release notes.txt',
        type: 'Text document',
        date: formatDate(release.published_at),
        tag: release.tag_name,
      }),
    },
    // "View on GitHub" shortcut
    {
      icon: 'github',
      label: 'View on GitHub',
      type: 'shortcut',
      onOpen: () => window.open(release.html_url, '_blank', 'noopener'),
      onProps: () => showProperties({ name: 'View on GitHub', type: 'Shortcut', description: release.html_url }),
    },
    // GitHub auto-generated source code archives (always present on every release)
    ...(release.zipball_url ? [{
      icon: 'file-zip',
      label: 'Source code.zip',
      description: 'Auto-generated source archive',
      type: 'file',
      size: '',
      downloads: null,
      onOpen: () => window.open(release.zipball_url, '_blank', 'noopener'),
      onProps: () => showProperties({
        name: 'Source code.zip',
        type: 'ZIP archive — source code',
        date: formatDate(release.published_at),
        tag: release.tag_name,
        description: 'Auto-generated by GitHub for every release',
      }),
    }] : []),
    ...(release.tarball_url ? [{
      icon: 'file-zip',
      label: 'Source code.tar.gz',
      description: 'Auto-generated source archive',
      type: 'file',
      size: '',
      downloads: null,
      onOpen: () => window.open(release.tarball_url, '_blank', 'noopener'),
      onProps: () => showProperties({
        name: 'Source code.tar.gz',
        type: 'TAR archive — source code',
        date: formatDate(release.published_at),
        tag: release.tag_name,
        description: 'Auto-generated by GitHub for every release',
      }),
    }] : []),
    // Each asset
    ...assets.map(asset => ({
      icon: iconForFile(asset.name),
      label: asset.name,
      description: `${formatBytes(asset.size)} · ${asset.download_count} downloads`,
      type: 'file',
      size: formatBytes(asset.size),
      downloads: asset.download_count,
      onOpen: () => window.open(asset.browser_download_url, '_blank', 'noopener'),
      onProps: () => showProperties({
        name: asset.name,
        type: 'Release asset',
        size: formatBytes(asset.size),
        date: formatDate(asset.updated_at),
        tag: release.tag_name,
        downloads: asset.download_count,
      }),
    })),
  ];

  if (assets.length === 0) {
    items.push({
      icon: 'info',
      label: '(no assets)',
      type: 'empty',
      onOpen: () => {},
      onProps: () => {},
    });
  }

  renderItems(content, mode, items);
  const totalDL = assets.reduce((s, a) => s + (a.download_count || 0), 0);
  setStatus(status, assets.length, `${assets.length} file(s) · ${totalDL} total downloads`);
}

// ── Item rendering ────────────────────────────────────────────────────────────

function renderItems(container, mode, items) {
  if (mode === 'details') {
    renderDetailsView(container, items);
  } else {
    renderIconsView(container, items);
  }
}

function renderIconsView(container, items) {
  const grid = document.createElement('div');
  grid.className = 'folder-view-icons';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'file-icon' + (item.badge ? ' badge-' + item.badge : '');
    el.tabIndex = 0;
    el.setAttribute('role', 'listitem');
    el.setAttribute('aria-label', item.label + (item.description ? ', ' + item.description : ''));
    el.innerHTML = `${getIcon(item.icon)}<span>${escHtml(item.label)}</span>`;

    el.addEventListener('dblclick', () => item.onOpen && item.onOpen());
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') item.onOpen && item.onOpen();
    });
    el.addEventListener('click', () => {
      container.querySelectorAll('.file-icon.selected').forEach(s => s.classList.remove('selected'));
      el.classList.add('selected');
    });
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showItemContextMenu(e, item);
    });
    grid.appendChild(el);
  });
  container.appendChild(grid);
}

function renderDetailsView(container, items) {
  const table = document.createElement('table');
  table.className = 'folder-view-details';
  table.innerHTML = `<thead><tr>
    <th>Name</th><th>Type</th><th>Size</th><th>Description</th>
  </tr></thead><tbody></tbody>`;
  const tbody = table.querySelector('tbody');
  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.tabIndex = 0;
    tr.setAttribute('role', 'row');
    tr.innerHTML = `
      <td><span style="display:flex;align-items:center;gap:4px">${getIcon(item.icon)}<span>${escHtml(item.label)}</span></span></td>
      <td>${escHtml(item.type || '')}</td>
      <td>${escHtml(item.size || '')}</td>
      <td>${escHtml(item.description || '')}</td>`;
    tr.addEventListener('dblclick', () => item.onOpen && item.onOpen());
    tr.addEventListener('keydown', (e) => { if (e.key === 'Enter') item.onOpen && item.onOpen(); });
    tr.addEventListener('click', () => {
      tbody.querySelectorAll('tr.selected').forEach(s => s.classList.remove('selected'));
      tr.classList.add('selected');
    });
    tr.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showItemContextMenu(e, item);
    });
    tbody.appendChild(tr);
  });
  container.appendChild(table);
}

// ── Context menu for items ───────────────────────────────────────────────────

function showItemContextMenu(e, item) {
  const menu = document.getElementById('ctx-menu');
  menu.innerHTML = '';
  const actions = [
    { label: 'Open', cb: item.onOpen },
    ...(item.type === 'file' ? [{ label: 'Download', cb: item.onOpen }] : []),
    { sep: true },
    { label: 'Properties', cb: item.onProps },
  ];
  actions.forEach(a => {
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
      btn.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
      menu.appendChild(btn);
    }
  });
  const maxX = window.innerWidth - 180;
  const maxY = window.innerHeight - (actions.length * 28 + 10);
  menu.style.left = Math.min(e.clientX, maxX) + 'px';
  menu.style.top  = Math.min(e.clientY, maxY) + 'px';
  menu.classList.remove('hidden');
  document.addEventListener('click', hideCtxMenu, { once: true });
}

function hideCtxMenu() {
  document.getElementById('ctx-menu')?.classList.add('hidden');
}

// ── Download latest handler ──────────────────────────────────────────────────

function handleDownloadLatest(repo, release) {
  const assets = release.assets || [];
  if (assets.length === 0) {
    showDialog({
      title: 'No assets',
      icon: 'warning',
      body: `The latest release <strong>${escHtml(release.tag_name)}</strong> has no downloadable assets.`,
    });
    return;
  }
  if (assets.length === 1) {
    window.open(assets[0].browser_download_url, '_blank', 'noopener');
    return;
  }
  // Multiple assets — show picker
  const ul = document.createElement('ul');
  ul.className = 'asset-list';
  assets.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `${getIcon(iconForFile(a.name))}<span>${escHtml(a.name)}</span><span class="asset-size">${formatBytes(a.size)}</span>`;
    li.addEventListener('click', () => { overlay.remove(); window.open(a.browser_download_url, '_blank', 'noopener'); });
    ul.appendChild(li);
  });
  const overlay = showDialog({
    title: `Download — ${release.tag_name}`,
    icon: 'downloads',
    body: ul,
    buttons: [{ label: 'Cancel' }],
  });
}

// ── Release notes window ─────────────────────────────────────────────────────

function openReleaseNotes(repo, release) {
  importWindows().then(({ createWindow }) => {
    const body = document.createElement('div');
    body.className = 'notepad-body';
    body.innerHTML = parseMarkdown(release.body || '_No release notes._');
    createWindow({
      id: `notes-${repo.repo}-${release.tag_name}`,
      title: `Release notes — ${release.tag_name}`,
      icon: 'release-notes',
      width: 500,
      height: 380,
      resizable: true,
      content: body,
    });
  });
}

async function importWindows() {
  return import('./windows.js');
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderLoading(container) {
  container.innerHTML = `<div class="loading-state"><div class="spinner"></div><span>Loading release data…</span></div>`;
}
function renderError(container, msg) {
  container.innerHTML = `<div class="empty-state">${getIcon('error')}<p>${escHtml(msg)}</p></div>`;
}
function setStatus(status, count, text) {
  if (!status) return;
  const c = status.querySelector('.status-count');
  const i = status.querySelector('.status-info');
  if (c) c.textContent = `${count} object(s)`;
  if (i) i.textContent = text;
}

function handleMenuClick(label, win, repos, releasesData) {
  if (label === 'View') {
    const content = win.querySelector('.folder-view');
    const mode = content?.dataset.viewMode === 'icons' ? 'details' : 'icons';
    setView(win, mode, repos, releasesData);
  }
}

// ── Minimal Markdown renderer ─────────────────────────────────────────────────
export function parseMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^#{3} (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2} (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```[\s\S]*?```/gm, m => '<pre>' + m.slice(3, -3) + '</pre>')
    .replace(/^\s*[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/, '<p>$1</p>');
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
