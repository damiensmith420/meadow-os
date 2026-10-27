/**
 * icons.js — Inline SVG icon helper
 * Returns SVG markup strings for icons used throughout the UI.
 */

/** Map of icon names to their SVG path data */
const ICONS = {
  folder: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="2" y="12" width="36" height="24" rx="2" fill="#f0c830" stroke="#c09010" stroke-width="1.5"/>
    <path d="M2 14 Q2 12 4 12 L16 12 L19 8 L36 8 Q38 8 38 10 L38 14 Z" fill="#fad840" stroke="#c09010" stroke-width="1.5"/>
  </svg>`,

  'folder-code': `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="2" y="12" width="36" height="24" rx="2" fill="#f0c830" stroke="#c09010" stroke-width="1.5"/>
    <path d="M2 14 Q2 12 4 12 L16 12 L19 8 L36 8 Q38 8 38 10 L38 14 Z" fill="#fad840" stroke="#c09010" stroke-width="1.5"/>
    <text x="20" y="29" text-anchor="middle" font-size="10" font-family="monospace" fill="#2a6a2a" font-weight="bold">&lt;/&gt;</text>
  </svg>`,

  downloads: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="2" y="12" width="36" height="24" rx="2" fill="#4a80d0" stroke="#1a40a0" stroke-width="1.5"/>
    <path d="M2 14 Q2 12 4 12 L16 12 L19 8 L36 8 Q38 8 38 10 L38 14 Z" fill="#6aa0f0" stroke="#1a40a0" stroke-width="1.5"/>
    <path d="M20 15 L20 27 M15 22 L20 28 L25 22" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>`,

  about: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="6" y="3" width="28" height="34" rx="2" fill="#fff" stroke="#9a9890" stroke-width="1.5"/>
    <rect x="6" y="3" width="28" height="8" rx="2" fill="#4a80d8"/>
    <line x1="10" y1="18" x2="30" y2="18" stroke="#c8c4b8" stroke-width="1.5"/>
    <line x1="10" y1="23" x2="30" y2="23" stroke="#c8c4b8" stroke-width="1.5"/>
    <line x1="10" y1="28" x2="22" y2="28" stroke="#c8c4b8" stroke-width="1.5"/>
    <circle cx="29" cy="9" r="3" fill="#ffe040"/>
  </svg>`,

  terminal: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="2" y="4" width="36" height="32" rx="3" fill="#0a0a14" stroke="#3a5a3a" stroke-width="1.5"/>
    <rect x="2" y="4" width="36" height="8" rx="3" fill="#1a3a1a"/>
    <circle cx="9" cy="8" r="2" fill="#f84040"/>
    <circle cx="16" cy="8" r="2" fill="#f8d040"/>
    <circle cx="23" cy="8" r="2" fill="#40c840"/>
    <text x="6" y="25" font-size="9" font-family="monospace" fill="#60e060">&gt; _</text>
  </svg>`,

  recycle: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <path d="M20 6 L28 18 L24 18 C24 26 18 30 14 32 C18 29 24 25 24 18 L28 18 Z" fill="#5a9a5a"/>
    <path d="M20 6 L12 18 L16 18 C16 26 22 30 26 32 C22 29 16 25 16 18 L12 18 Z" fill="#3a7a3a"/>
    <path d="M10 30 Q6 24 10 18 L14 22 Z" fill="#5a9a5a"/>
    <path d="M30 30 Q34 24 30 18 L26 22 Z" fill="#3a7a3a"/>
    <ellipse cx="20" cy="33" rx="6" ry="3" fill="#2a6a2a"/>
  </svg>`,

  game: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="4" y="13" width="32" height="18" rx="9" fill="#5a5a8a" stroke="#3a3a6a" stroke-width="1.5"/>
    <rect x="9" y="19" width="4" height="2" fill="#fff"/>
    <rect x="10" y="17" width="2" height="6" fill="#fff"/>
    <circle cx="28" cy="18" r="2" fill="#f84040"/>
    <circle cx="32" cy="22" r="2" fill="#40a840"/>
    <circle cx="24" cy="22" r="2" fill="#4040f8"/>
    <circle cx="28" cy="26" r="2" fill="#f8d040"/>
  </svg>`,

  breakout: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="4" y="5" width="32" height="5" rx="1" fill="#f84040"/>
    <rect x="4" y="12" width="32" height="5" rx="1" fill="#f87030"/>
    <rect x="4" y="19" width="32" height="5" rx="1" fill="#f8d040"/>
    <rect x="11" y="33" width="18" height="4" rx="2" fill="#6060d0"/>
    <circle cx="20" cy="28" r="3" fill="#ffffff"/>
  </svg>`,

  frogger: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="2" y="28" width="36" height="7" rx="2" fill="#303030"/>
    <rect x="2" y="19" width="36" height="7" rx="2" fill="#1a3a6a"/>
    <rect x="2" y="10" width="36" height="7" rx="2" fill="#2a5a2a"/>
    <ellipse cx="20" cy="6" rx="5" ry="4" fill="#50e050"/>
    <circle cx="17.5" cy="4.5" r="1.5" fill="#fff"/>
    <circle cx="22.5" cy="4.5" r="1.5" fill="#fff"/>
    <circle cx="17.5" cy="4.5" r="0.7" fill="#204020"/>
    <circle cx="22.5" cy="4.5" r="0.7" fill="#204020"/>
  </svg>`,

  display: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="4" y="4" width="32" height="24" rx="3" fill="#3a3a5a" stroke="#1a1a3a" stroke-width="1.5"/>
    <rect x="7" y="7" width="26" height="18" rx="1" fill="#88ccf8"/>
    <rect x="15" y="29" width="10" height="4" fill="#3a3a5a"/>
    <rect x="10" y="33" width="20" height="2" rx="1" fill="#1a1a3a"/>
  </svg>`,

  'file-zip': `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="6" y="2" width="24" height="30" rx="2" fill="#fff" stroke="#9a9890" stroke-width="1.5"/>
    <path d="M24 2 L30 8 L24 8 Z" fill="#d4d0c8" stroke="#9a9890" stroke-width="1"/>
    <rect x="24" y="2" width="6" height="6" rx="1" fill="#d4d0c8" stroke="#9a9890" stroke-width="1"/>
    <rect x="14" y="2" width="5" height="5" fill="#c8d8f8" opacity="0.7"/>
    <rect x="14" y="7" width="5" height="5" fill="#fff"/>
    <rect x="14" y="12" width="5" height="5" fill="#c8d8f8" opacity="0.7"/>
    <text x="18" y="30" text-anchor="middle" font-size="7" fill="#4a4a8a" font-weight="bold">ZIP</text>
  </svg>`,

  'file-exe': `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="6" y="2" width="24" height="30" rx="2" fill="#fff8e8" stroke="#d09030" stroke-width="1.5"/>
    <path d="M24 2 L30 8 L24 8 Z" fill="#f0d880" stroke="#d09030" stroke-width="1"/>
    <rect x="24" y="2" width="6" height="6" rx="1" fill="#f0d880" stroke="#d09030" stroke-width="1"/>
    <text x="18" y="24" text-anchor="middle" font-size="8" fill="#a06010" font-weight="bold">EXE</text>
  </svg>`,

  'file-text': `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="6" y="2" width="24" height="30" rx="2" fill="#fff" stroke="#9a9890" stroke-width="1.5"/>
    <path d="M24 2 L30 8 L24 8 Z" fill="#e8e4dc" stroke="#9a9890" stroke-width="1"/>
    <rect x="24" y="2" width="6" height="6" rx="1" fill="#e8e4dc" stroke="#9a9890" stroke-width="1"/>
    <line x1="10" y1="16" x2="26" y2="16" stroke="#c8c4b8" stroke-width="1.5"/>
    <line x1="10" y1="21" x2="26" y2="21" stroke="#c8c4b8" stroke-width="1.5"/>
    <line x1="10" y1="26" x2="20" y2="26" stroke="#c8c4b8" stroke-width="1.5"/>
  </svg>`,

  'file-generic': `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="6" y="2" width="24" height="30" rx="2" fill="#f4f2ec" stroke="#9a9890" stroke-width="1.5"/>
    <path d="M24 2 L30 8 L24 8 Z" fill="#dddac8" stroke="#9a9890" stroke-width="1"/>
    <rect x="24" y="2" width="6" height="6" rx="1" fill="#dddac8" stroke="#9a9890" stroke-width="1"/>
  </svg>`,

  github: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="18" fill="#1a1a1a"/>
    <circle cx="20" cy="16" r="7" fill="#fff"/>
    <path d="M9 37 Q9 27 20 27 Q31 27 31 37" fill="#fff"/>
    <circle cx="15.5" cy="14" r="2" fill="#1a1a1a"/>
    <circle cx="24.5" cy="14" r="2" fill="#1a1a1a"/>
  </svg>`,

  error: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="16" r="14" fill="#e03030" stroke="#a01010" stroke-width="1.5"/>
    <line x1="10" y1="10" x2="22" y2="22" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <line x1="22" y1="10" x2="10" y2="22" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  warning: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 3 L30 28 L2 28 Z" fill="#f0c030" stroke="#c09010" stroke-width="1.5"/>
    <text x="16" y="25" text-anchor="middle" font-size="16" font-weight="bold" fill="#5a3000">!</text>
  </svg>`,

  info: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="16" r="14" fill="#4a80d8" stroke="#1a50a8" stroke-width="1.5"/>
    <text x="16" y="23" text-anchor="middle" font-size="18" font-weight="bold" fill="#fff">i</text>
  </svg>`,

  'release-notes': `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="6" y="2" width="24" height="30" rx="2" fill="#fffbf0" stroke="#c09020" stroke-width="1.5"/>
    <path d="M24 2 L30 8 L24 8 Z" fill="#f8e890" stroke="#c09020" stroke-width="1"/>
    <rect x="24" y="2" width="6" height="6" rx="1" fill="#f8e890" stroke="#c09020" stroke-width="1"/>
    <line x1="10" y1="16" x2="26" y2="16" stroke="#d4c080" stroke-width="1.5"/>
    <line x1="10" y1="21" x2="26" y2="21" stroke="#d4c080" stroke-width="1.5"/>
    <line x1="10" y1="26" x2="20" y2="26" stroke="#d4c080" stroke-width="1.5"/>
    <circle cx="28" cy="30" r="5" fill="#f0c030" stroke="#c09010" stroke-width="1"/>
    <text x="28" y="33" text-anchor="middle" font-size="7" fill="#5a3000" font-weight="bold">★</text>
  </svg>`,

  'link-shortcut': `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="6" y="2" width="24" height="30" rx="2" fill="#e8f0ff" stroke="#7a9ad0" stroke-width="1.5"/>
    <path d="M24 2 L30 8 L24 8 Z" fill="#c8d8f8" stroke="#7a9ad0" stroke-width="1"/>
    <rect x="24" y="2" width="6" height="6" rx="1" fill="#c8d8f8" stroke="#7a9ad0" stroke-width="1"/>
    <path d="M12 20 Q12 14 18 14 L22 14 M20 12 L24 14 L20 16" stroke="#1a50a0" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M24 22 Q24 28 18 28 L14 28 M16 26 L12 28 L16 30" stroke="#1a50a0" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

/**
 * Get an icon's SVG markup by name.
 * Falls back to 'file-generic' for unknown names.
 * @param {string} name
 * @returns {string} SVG HTML string
 */
export function getIcon(name) {
  return ICONS[name] || ICONS['file-generic'];
}

/**
 * Return the best icon name for a file by its extension.
 * @param {string} filename
 * @returns {string}
 */
export function iconForFile(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const map = {
    zip: 'file-zip', gz: 'file-zip', tar: 'file-zip', '7z': 'file-zip', rar: 'file-zip',
    exe: 'file-exe', msi: 'file-exe', dmg: 'file-exe', pkg: 'file-exe', deb: 'file-exe', rpm: 'file-exe', appimage: 'file-exe',
    txt: 'file-text', md: 'file-text', log: 'file-text', csv: 'file-text',
  };
  return map[ext] || 'file-generic';
}
