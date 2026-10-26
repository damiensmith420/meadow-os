/**
 * notepad.js — Notepad-style Markdown viewer
 * Used for About Me (data/about.md) and release notes.
 */

import { createWindow } from './windows.js';
import { parseMarkdown } from './downloads.js';

/**
 * Open a Notepad window with Markdown content.
 * @param {string} id      - Unique window ID
 * @param {string} title   - Title bar text
 * @param {string} content - Markdown string
 */
export function openNotepad(id, title, content) {
  const body = document.createElement('div');
  body.className = 'notepad-body';
  body.innerHTML = parseMarkdown(content);

  createWindow({
    id,
    title,
    icon: 'about',
    width: 520,
    height: 400,
    resizable: true,
    content: body,
    menuItems: ['File'],
    onMenuClick: (label, win) => {
      if (label === 'File') {
        // Nothing to save in read-only mode; show a friendly note
        import('./dialog.js').then(({ showDialog }) => {
          showDialog({ title: 'File', icon: 'info', body: 'This document is read-only.' });
        });
      }
    },
  });
}

/**
 * Fetch and display data/about.md in a Notepad window.
 */
export async function openAbout() {
  let md = '';
  try {
    const res = await fetch('data/about.md');
    if (res.ok) md = await res.text();
    else md = '# About\n\nCould not load about.md.';
  } catch {
    md = '# About\n\nCould not load about.md (network error or file:// restriction).\n\n'
       + 'Try running `python -m http.server` and opening http://localhost:8000.';
  }
  openNotepad('about-me', 'About Me — Notepad', md);
}
