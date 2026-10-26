/**
 * gadget.js — Recent Activity desktop gadget
 * Fetches public events for the configured GitHub user and renders them
 * in the corner gadget widget.
 */

import { fetchUserEvents, relativeTime } from './github.js';
import { getIcon } from './icons.js';

/**
 * Initialise and populate the gadget.
 * @param {string} username
 * @param {number} count
 */
export async function initGadget(username, count = 8) {
  const gadget = document.getElementById('recent-gadget');
  if (!gadget) return;

  gadget.innerHTML = `
    <div class="gadget-title">${getIcon('github')} Recent Activity</div>
    <div class="gadget-loading" style="text-align:center;padding:12px;color:#7090a0;font-size:11px;">
      <div class="spinner" style="width:16px;height:16px;margin:0 auto 6px;"></div>
      Loading…
    </div>`;

  try {
    const events = await fetchUserEvents(username, count);
    renderEvents(gadget, events, username);
  } catch {
    gadget.innerHTML = `<div class="gadget-title">${getIcon('github')} Recent Activity</div>
      <div style="font-size:11px;color:#9a7060;padding:4px;">Could not load activity.</div>`;
  }
}

function renderEvents(gadget, events, username) {
  gadget.innerHTML = `<div class="gadget-title">${getIcon('github')} Recent Activity</div>`;

  if (!events || events.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'font-size:11px;color:#8090a0;padding:4px;';
    empty.textContent = 'No recent public activity.';
    gadget.appendChild(empty);
    return;
  }

  events.forEach(ev => {
    const item = document.createElement('div');
    item.className = 'gadget-item';

    const repoName = ev.repo?.name?.replace(username + '/', '') || ev.repo?.name || '?';
    const msg = describeEvent(ev);
    const time = relativeTime(ev.created_at);

    item.innerHTML = `
      <span class="gi-repo">${escHtml(repoName)}</span>
      <span class="gi-msg">${escHtml(msg)}</span>
      <span class="gi-time">${escHtml(time)}</span>`;
    gadget.appendChild(item);
  });
}

function describeEvent(ev) {
  switch (ev.type) {
    case 'PushEvent': {
      const n = ev.payload?.commits?.length || 0;
      return `Pushed ${n} commit${n !== 1 ? 's' : ''}`;
    }
    case 'CreateEvent':
      return `Created ${ev.payload?.ref_type || 'ref'}: ${ev.payload?.ref || ''}`;
    case 'PullRequestEvent':
      return `PR ${ev.payload?.action}: ${ev.payload?.pull_request?.title || ''}`;
    case 'IssuesEvent':
      return `Issue ${ev.payload?.action}: ${ev.payload?.issue?.title || ''}`;
    case 'WatchEvent':
      return 'Starred a repository';
    case 'ForkEvent':
      return `Forked to ${ev.payload?.forkee?.full_name || ''}`;
    case 'ReleaseEvent':
      return `Released ${ev.payload?.release?.tag_name || ''}`;
    case 'IssueCommentEvent':
      return 'Commented on an issue';
    case 'DeleteEvent':
      return `Deleted ${ev.payload?.ref_type} ${ev.payload?.ref}`;
    default:
      return ev.type?.replace('Event', '') || 'Activity';
  }
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
