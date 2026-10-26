/**
 * theme.js — Theme switching and persistence
 */

const THEMES = ['theme-meadow', 'theme-dark', 'theme-silver'];
const STORAGE_KEY = 'meadow-os-theme';

/** Apply a theme to <body> and save to localStorage */
export function applyTheme(name) {
  const theme = THEMES.includes(name) ? name : THEMES[0];
  document.body.classList.remove(...THEMES);
  document.body.classList.add(theme);
  try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
}

/** Load saved theme (or default) */
export function loadTheme() {
  let saved = 'theme-meadow';
  try { saved = localStorage.getItem(STORAGE_KEY) || 'theme-meadow'; } catch {}
  applyTheme(saved);
  return saved;
}

/** Return all theme definitions for the Display Properties dialog */
export function getThemes() {
  return [
    {
      id: 'theme-meadow',
      label: 'Meadow',
      colors: { bar: '#1a6ecf', body: '#ece9d8', sky: '#4aa8f0', grass: '#3cb84a' },
    },
    {
      id: 'theme-dark',
      label: 'Midnight',
      colors: { bar: '#2a2a3a', body: '#1e1e2a', sky: '#040810', grass: '#0a2a0a' },
    },
    {
      id: 'theme-silver',
      label: 'Silver',
      colors: { bar: '#888888', body: '#f0f0f0', sky: '#b0c8e0', grass: '#d0d8c0' },
    },
  ];
}

export function getCurrentTheme() {
  for (const t of THEMES) {
    if (document.body.classList.contains(t)) return t;
  }
  return THEMES[0];
}
