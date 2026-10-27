/**
 * browser.js — MeadowExplorer Web Browser
 * A fake browser window that routes .mow domains to built-in fake sites.
 */

import { createWindow } from './windows.js';

// ── Site registry ─────────────────────────────────────────────────────────────
// Each site is a lazy-loaded module that exports render(container, query)
const SITES = {
  'www.grassknoll.mow':   () => import('./sites/grassknoll.js'),
  'grassknoll.mow':       () => import('./sites/grassknoll.js'),
  'www.notabird.mow':     () => import('./sites/notabird.js'),
  'notabird.mow':         () => import('./sites/notabird.js'),
  'www.meadowpedia.mow':  () => import('./sites/meadowpedia.js'),
  'meadowpedia.mow':      () => import('./sites/meadowpedia.js'),
  'www.frogtube.mow':     () => import('./sites/frogtube.js'),
  'frogtube.mow':         () => import('./sites/frogtube.js'),
  'www.shoppe.mow':       () => import('./sites/shoppe.js'),
  'shoppe.mow':           () => import('./sites/shoppe.js'),
  'www.doomscroll.mow':   () => import('./sites/doomscroll.js'),
  'doomscroll.mow':       () => import('./sites/doomscroll.js'),
};

const HOME_URL = 'www.grassknoll.mow';

// ── Bookmarks ─────────────────────────────────────────────────────────────────
const BOOKMARKS = [
  { label: 'Grass Knoll',  url: 'www.grassknoll.mow'  },
  { label: 'NotABird',     url: 'www.notabird.mow'     },
  { label: 'MeadowPedia',  url: 'www.meadowpedia.mow'  },
  { label: 'FrogTube',     url: 'www.frogtube.mow'     },
  { label: 'The Shoppe',   url: 'www.shoppe.mow'       },
  { label: 'Doomscroll',   url: 'www.doomscroll.mow'   },
];

export function openBrowser(startUrl) {
  // ── Outer chrome ────────────────────────────────────────────────────────────
  const chrome = document.createElement('div');
  chrome.style.cssText = 'display:flex;flex-direction:column;height:100%;background:#ece9d8;';

  // ── Toolbar row ─────────────────────────────────────────────────────────────
  const toolbar = document.createElement('div');
  toolbar.className = 'browser-toolbar';
  toolbar.innerHTML = `
    <button class="win-toolbar-btn" id="br-back"    title="Back">◀</button>
    <button class="win-toolbar-btn" id="br-fwd"     title="Forward">▶</button>
    <button class="win-toolbar-btn" id="br-refresh" title="Refresh">↺</button>
    <button class="win-toolbar-btn" id="br-home"    title="Home">⌂</button>
    <div class="browser-addr-wrap">
      <span class="browser-lock" id="br-lock">🔒</span>
      <input class="browser-addr" id="br-addr" type="text" spellcheck="false" />
      <button class="browser-go win-toolbar-btn" id="br-go">Go</button>
    </div>`;
  chrome.appendChild(toolbar);

  // ── Favourites bar ───────────────────────────────────────────────────────────
  const favBar = document.createElement('div');
  favBar.className = 'browser-favbar';
  BOOKMARKS.forEach(bm => {
    const btn = document.createElement('button');
    btn.className = 'browser-fav-btn';
    btn.textContent = bm.label;
    btn.addEventListener('click', () => navigate(bm.url));
    favBar.appendChild(btn);
  });
  chrome.appendChild(favBar);

  // ── Loading bar ──────────────────────────────────────────────────────────────
  const loadBar = document.createElement('div');
  loadBar.className = 'browser-loadbar';
  const loadFill = document.createElement('div');
  loadFill.className = 'browser-loadbar-fill';
  loadBar.appendChild(loadFill);
  chrome.appendChild(loadBar);

  // ── Page viewport ────────────────────────────────────────────────────────────
  const viewport = document.createElement('div');
  viewport.className = 'browser-viewport';
  // Sites render as normal block content inside this scroll container
  viewport.style.cssText = 'flex:1;overflow-y:auto;overflow-x:hidden;min-height:0;position:relative;';
  chrome.appendChild(viewport);

  // ── Status bar ───────────────────────────────────────────────────────────────
  const statusBar = document.createElement('div');
  statusBar.className = 'win-statusbar browser-status';
  statusBar.id = 'br-status';
  statusBar.textContent = 'Ready';
  chrome.appendChild(statusBar);

  // ── Window ───────────────────────────────────────────────────────────────────
  const win = createWindow({
    id: 'meadow-browser',
    title: 'MeadowExplorer',
    icon: 'browser',
    width: 960,
    height: 680,
    resizable: true,
    content: chrome,
  });

  // ── State ────────────────────────────────────────────────────────────────────
  const history = [];
  let histIdx = -1;
  let currentUrl = '';
  let loading = false;

  const addrInput = chrome.querySelector('#br-addr');
  const backBtn   = chrome.querySelector('#br-back');
  const fwdBtn    = chrome.querySelector('#br-fwd');
  const lockIcon  = chrome.querySelector('#br-lock');

  // ── Navigation ───────────────────────────────────────────────────────────────
  async function navigate(rawUrl, pushHistory = true) {
    if (loading) return;

    // Normalise URL
    let url = rawUrl.trim().toLowerCase();
    if (!url) return;
    if (!url.includes('.')) url = 'www.grassknoll.mow/?q=' + encodeURIComponent(rawUrl.trim());

    addrInput.value = url;
    statusBar.textContent = `Connecting to ${url}...`;
    lockIcon.textContent = '🔒';

    // Start fake loading animation
    startLoading();

    if (pushHistory) {
      history.splice(histIdx + 1);
      history.push(url);
      histIdx = history.length - 1;
    }
    currentUrl = url;
    updateNavBtns();

    // Update window title
    win.querySelector('.win-title').textContent = `${url} — MeadowExplorer`;

    // Parse host and query
    const [hostPart, ...qParts] = url.split('?');
    const host  = hostPart.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const query = qParts.join('?');

    const loader = SITES[host];
    if (!loader) {
      finishLoading();
      viewport.innerHTML = '';
      viewport.appendChild(error404(host));
      statusBar.textContent = 'Page not found.';
      return;
    }

    try {
      const mod = await loader();
      finishLoading();
      viewport.innerHTML = '';
      // Pass a navigate callback so sites can link to each other
      mod.render(viewport, query, navigate);
      statusBar.textContent = `Done · ${url}`;
    } catch (err) {
      finishLoading();
      viewport.innerHTML = `<div style="padding:24px;font-family:monospace;color:#a00;">
        <b>MeadowExplorer Error</b><br><br>${err.message}</div>`;
      statusBar.textContent = 'Error loading page.';
    }
  }

  function startLoading() {
    loading = true;
    loadFill.style.transition = 'none';
    loadFill.style.width = '0%';
    requestAnimationFrame(() => {
      loadFill.style.transition = 'width 0.6s ease';
      loadFill.style.width = '70%';
    });
    loadBar.style.opacity = '1';
  }

  function finishLoading() {
    loadFill.style.transition = 'width 0.2s ease';
    loadFill.style.width = '100%';
    setTimeout(() => {
      loadBar.style.opacity = '0';
      loadFill.style.width = '0%';
      loading = false;
    }, 250);
  }

  function updateNavBtns() {
    backBtn.disabled = histIdx <= 0;
    fwdBtn.disabled  = histIdx >= history.length - 1;
  }

  // ── Button wiring ────────────────────────────────────────────────────────────
  backBtn.addEventListener('click', () => {
    if (histIdx > 0) { histIdx--; navigate(history[histIdx], false); }
  });
  fwdBtn.addEventListener('click', () => {
    if (histIdx < history.length - 1) { histIdx++; navigate(history[histIdx], false); }
  });
  chrome.querySelector('#br-refresh').addEventListener('click', () => navigate(currentUrl, false));
  chrome.querySelector('#br-home').addEventListener('click', () => navigate(HOME_URL));
  chrome.querySelector('#br-go').addEventListener('click', () => navigate(addrInput.value));
  addrInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') navigate(addrInput.value);
  });
  addrInput.addEventListener('focus', () => addrInput.select());

  // ── Boot ─────────────────────────────────────────────────────────────────────
  navigate(startUrl || HOME_URL);
}

// ── 404 page ─────────────────────────────────────────────────────────────────
function error404(host) {
  const el = document.createElement('div');
  el.style.cssText = 'padding:40px;font-family:"Trebuchet MS",sans-serif;text-align:center;';
  el.innerHTML = `
    <div style="font-size:64px;margin-bottom:16px;">🌿</div>
    <h2 style="font-size:22px;color:#1a3a6a;margin-bottom:8px;">Cannot find server</h2>
    <p style="color:#4a4a6a;margin-bottom:16px;">
      MeadowExplorer cannot display the webpage
      <strong>${escHtml(host)}</strong>
    </p>
    <p style="color:#6a6a6a;font-size:12px;">
      Make sure you typed <code>.mow</code> at the end.<br>
      Known sites: grassknoll · notabird · meadowpedia · frogtube · shoppe · doomscroll
    </p>`;
  return el;
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
