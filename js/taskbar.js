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

/** Init the wifi tray icon and popup */
function initWifi() {
  const btn = document.getElementById('tray-wifi');
  if (!btn) return;

  // Build popup element once
  const popup = document.createElement('div');
  popup.id = 'wifi-popup';
  popup.className = 'wifi-popup hidden';
  popup.innerHTML = `
    <div class="wifi-popup-header">
      <svg width="14" height="14" viewBox="0 0 16 16" style="flex-shrink:0;">
        <path d="M8 12.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="#e8eeff"/>
        <path d="M4.5 9.5a5 5 0 0 1 7 0" fill="none" stroke="#e8eeff" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M2 7a8 8 0 0 1 12 0" fill="none" stroke="#e8eeff" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M0 4.5a11 11 0 0 1 16 0" fill="none" stroke="#e8eeff" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
      <span>Wireless Network Connection</span>
    </div>
    <div class="wifi-network connected">
      <div class="wifi-network-icon">
        <svg width="20" height="20" viewBox="0 0 16 16">
          <path d="M8 12.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="#1a6ecf"/>
          <path d="M4.5 9.5a5 5 0 0 1 7 0" fill="none" stroke="#1a6ecf" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M2 7a8 8 0 0 1 12 0" fill="none" stroke="#1a6ecf" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M0 4.5a11 11 0 0 1 16 0" fill="none" stroke="#1a6ecf" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="wifi-network-info">
        <div class="wifi-network-name">McDonald's WiFi</div>
        <div class="wifi-network-status">Connected</div>
      </div>
      <div class="wifi-signal">
        <div class="wifi-bar" style="height:4px;"></div>
        <div class="wifi-bar" style="height:7px;"></div>
        <div class="wifi-bar" style="height:10px;"></div>
        <div class="wifi-bar active" style="height:13px;"></div>
      </div>
    </div>
    <div class="wifi-other-label">Other available networks</div>
    <div class="wifi-network other">
      <div class="wifi-network-icon muted">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 12.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="#888"/>
          <path d="M4.5 9.5a5 5 0 0 1 7 0" fill="none" stroke="#888" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M2 7a8 8 0 0 1 12 0" fill="none" stroke="#ccc" stroke-width="1.4" stroke-linecap="round" opacity="0.3"/>
          <path d="M0 4.5a11 11 0 0 1 16 0" fill="none" stroke="#ccc" stroke-width="1.4" stroke-linecap="round" opacity="0.15"/>
        </svg>
      </div>
      <div class="wifi-network-info">
        <div class="wifi-network-name">NETGEAR_5G_EXT</div>
        <div class="wifi-network-status">Security: WPA2</div>
      </div>
    </div>
    <div class="wifi-network other">
      <div class="wifi-network-icon muted">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 12.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="#888"/>
          <path d="M4.5 9.5a5 5 0 0 1 7 0" fill="none" stroke="#888" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M2 7a8 8 0 0 1 12 0" fill="none" stroke="#ccc" stroke-width="1.4" stroke-linecap="round" opacity="0.3"/>
          <path d="M0 4.5a11 11 0 0 1 16 0" fill="none" stroke="#ccc" stroke-width="1.4" stroke-linecap="round" opacity="0.15"/>
        </svg>
      </div>
      <div class="wifi-network-info">
        <div class="wifi-network-name">xfinitywifi</div>
        <div class="wifi-network-status">Open network</div>
      </div>
    </div>
    <div class="wifi-network other">
      <div class="wifi-network-icon muted">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 12.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="#888"/>
          <path d="M4.5 9.5a5 5 0 0 1 7 0" fill="none" stroke="#888" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="wifi-network-info">
        <div class="wifi-network-name">Pretty Fly for a WiFi</div>
        <div class="wifi-network-status">Security: WPA2</div>
      </div>
    </div>
    <div class="wifi-popup-footer">
      <button class="wifi-footer-btn" onclick="this.textContent='Disconnecting...';setTimeout(()=>this.textContent='Connect',1200)">Disconnect</button>
      <button class="wifi-footer-btn">Network Settings</button>
    </div>`;
  document.body.appendChild(popup);

  // Toggle on click
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const hidden = popup.classList.toggle('hidden');
    btn.classList.toggle('active', !hidden);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && e.target !== btn) {
      popup.classList.add('hidden');
      btn.classList.remove('active');
    }
  });
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

export const taskbar = { addWindow, removeWindow, setActive, updateTitle, startClock, initWifi };
