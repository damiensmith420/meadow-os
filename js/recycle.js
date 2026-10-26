/**
 * recycle.js — Recycle Bin with a small easter egg
 */

import { createWindow } from './windows.js';
import { showDialog } from './dialog.js';
import { getIcon } from './icons.js';

const EASTER_THRESHOLD = 3; // open N times to trigger the egg
let _openCount = 0;

const EASTER_MESSAGES = [
  "You've opened the Recycle Bin. Nothing to see here.",
  "Still nothing. What were you hoping to find?",
  "Okay, since you asked so nicely… 🌱\n\n\"Every great developer you know got there by solving problems they were unqualified to solve until they did it.\"\n    — Patrick McKenzie",
  "You found the secret. Here's a flower: 🌼",
  "No, seriously, go build something cool.",
];

export function openRecycleBin() {
  _openCount++;

  const msg = EASTER_MESSAGES[Math.min(_openCount - 1, EASTER_MESSAGES.length - 1)];

  if (_openCount >= EASTER_THRESHOLD) {
    // Easter egg dialog after 3 opens
    showDialog({
      title: 'Recycle Bin',
      icon: 'recycle',
      body: `<p style="white-space:pre-wrap">${escHtml(msg)}</p>`,
      buttons: [
        { label: 'Empty Recycle Bin', cb: () => showDialog({ title: 'Recycle Bin', icon: 'info', body: 'The Recycle Bin is already empty.' }) },
        { label: 'Close', primary: true },
      ],
    });
    return;
  }

  const content = document.createElement('div');
  content.style.cssText = 'padding:16px;font-size:12px;color:#4a4a6a;display:flex;flex-direction:column;align-items:center;gap:12px;';
  content.innerHTML = `
    <div style="width:64px;height:64px;">${getIcon('recycle')}</div>
    <p style="text-align:center">${escHtml(msg)}</p>
    <p style="color:#8a8880;font-size:11px;">(Hint: try opening it a few more times…)</p>`;

  createWindow({
    id: 'recycle-bin',
    title: 'Recycle Bin',
    icon: 'recycle',
    width: 320,
    height: 220,
    resizable: false,
    content,
  });
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
