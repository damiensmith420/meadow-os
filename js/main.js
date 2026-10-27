/**
 * main.js — Meadow OS entry point
 *
 * Orchestrates: boot → data load → desktop init → app dispatch
 */

import { showLogin, runIntro, isFirstVisit, markVisited } from './boot.js';
import { loadTheme } from './theme.js';
import { taskbar } from './taskbar.js';
import { initDesktop } from './desktop.js';
import { initMenu } from './menu.js';
import { initTerminal } from './terminal.js';
import { initGadget } from './gadget.js';
import { loadAllReleases } from './github.js';
import { renderMobileLayout } from './mobile.js';
import { showError } from './dialog.js';

// ── Mobile detection ──────────────────────────────────────────────────────────
const IS_MOBILE = () => window.innerWidth < 700;

// ── Global state ──────────────────────────────────────────────────────────────
let repos = [];
let releasesData = {};
let config = {};

// ── Startup ───────────────────────────────────────────────────────────────────
async function main() {
  // Apply saved theme first (before anything renders)
  loadTheme();

  // If mobile, skip the desktop entirely
  if (IS_MOBILE()) {
    document.getElementById('boot-screen')?.classList.add('hidden');
    await loadData();
    renderMobileLayout(repos, releasesData);
    return;
  }

  // Always show login → cinematic intro → desktop
  document.getElementById('boot-screen')?.classList.add('hidden');
  await showLogin();
  runIntro(startDesktop);
}

async function startDesktop() {
  // Show desktop + taskbar
  document.getElementById('desktop')?.classList.remove('hidden');
  document.getElementById('taskbar')?.classList.remove('hidden');

  // Start clock
  taskbar.startClock();

  // Load data
  await loadData();

  // Init desktop icons
  initDesktop(openApp);

  // Init Meadow menu
  initMenu(repos, openApp);

  // Init terminal data
  initTerminal(repos, releasesData);

  // Init recent activity gadget
  if (config.github_username) {
    initGadget(config.github_username, config.recent_activity_count || 8);
  }

  // Wire login button
  document.getElementById('login-btn')?.addEventListener('click', () => {
    document.getElementById('login-screen')?.classList.add('hidden');
    document.getElementById('desktop')?.classList.remove('hidden');
    document.getElementById('taskbar')?.classList.remove('hidden');
  });
}

// ── Data loading ──────────────────────────────────────────────────────────────

async function loadData() {
  // 1. Config
  try {
    const res = await fetch('data/config.json');
    if (res.ok) config = await res.json();
  } catch {}

  // 2. Repos manifest
  try {
    const res = await fetch('data/repos.json');
    if (res.ok) repos = await res.json();
  } catch {
    console.warn('[Meadow OS] Could not load data/repos.json — are you running from file://?');
  }

  // 3. Releases data
  if (repos.length > 0) {
    try {
      releasesData = await loadAllReleases(repos);
    } catch (err) {
      if (err.rateLimited) {
        showError(
          'GitHub Rate Limit',
          'The GitHub API rate limit has been reached.\n\n'
          + 'Release data may be incomplete. The pre-built releases.json was not found.\n\n'
          + 'To fix this, run the GitHub Actions workflow (Actions → Update Releases → Run workflow) '
          + 'or wait an hour for the rate limit to reset.'
        );
      }
      // Use partial data if available
      releasesData = err.partialData || {};
    }
  }
}

// ── App dispatcher ────────────────────────────────────────────────────────────

async function openApp(id) {
  switch (id) {
    case 'downloads': {
      const { openDownloads } = await import('./downloads.js');
      openDownloads(repos, releasesData);
      break;
    }
    case 'about': {
      const { openAbout } = await import('./notepad.js');
      openAbout();
      break;
    }
    case 'terminal': {
      const { openTerminal } = await import('./terminal.js');
      openTerminal();
      break;
    }
    case 'recycle': {
      const { openRecycleBin } = await import('./recycle.js');
      openRecycleBin();
      break;
    }
    case 'game': {
      const { openGame } = await import('./game.js');
      openGame();
      break;
    }
    case 'display': {
      const { showDisplayProperties } = await import('./dialog.js');
      showDisplayProperties();
      break;
    }
    default:
      console.warn('[Meadow OS] Unknown app id:', id);
  }
}

// ── Kick off ──────────────────────────────────────────────────────────────────
main().catch(err => {
  console.error('[Meadow OS] Fatal error during startup:', err);
});
