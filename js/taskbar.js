/**
 * taskbar.js — Taskbar app button manager and system clock
 */

const appsEl = () => document.getElementById('taskbar-apps');
const clockEl = () => document.getElementById('tray-clock');

let _activeId = null;

// Lazily-stored button references: winId → button element
const buttons = new Map();

function importWin() {
  // Avoid circular dependency at module load time
  return import('./windows.js');
}

/**
 * Add a taskbar button for an open window.
 */
function addWindow(id, title, icon, winEl) {
  const btn = document.createElement('button');
  btn.className = 'taskbar-app-btn';
  btn.dataset.winId = id;
  btn.setAttribute('role', 'listitem');
  btn.setAttribute('aria-label', title);
  btn.innerHTML = `<span>${escHtml(title)}</span>`;
  btn.addEventListener('click', async () => {
    const { focusWindow, minimizeWindow, restoreWindow } = await importWin();
    if (winEl.classList.contains('minimized')) {
      restoreWindow(winEl);
    } else if (_activeId === id) {
      minimizeWindow(winEl);
    } else {
      restoreWindow(winEl);
      focusWindow(winEl);
    }
  });
  buttons.set(id, btn);
  appsEl().appendChild(btn);
}

/** Remove a taskbar button */
function removeWindow(id) {
  const btn = buttons.get(id);
  if (btn) { btn.remove(); buttons.delete(id); }
  if (_activeId === id) _activeId = null;
}

/** Mark a window's button as active */
function setActive(id) {
  _activeId = id;
  buttons.forEach((btn, bid) => {
    btn.classList.toggle('active', bid === id);
  });
}

/** Update a window's title on its taskbar button */
function updateTitle(id, title) {
  const btn = buttons.get(id);
  if (btn) btn.querySelector('span').textContent = title;
}

/** Start the live clock ticker */
function startClock() {
  const el = clockEl();
  if (!el) return;
  function tick() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    el.innerHTML = `<span class="clock-time">${timeStr}</span><span class="clock-date">${dateStr}</span>`;
    el.title = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  tick();
  setInterval(tick, 10000);
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

export const taskbar = { addWindow, removeWindow, setActive, updateTitle, startClock };
