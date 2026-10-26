/**
 * mobile.js — Simplified mobile layout for narrow screens
 * Renders an expandable list of repos and their release assets.
 */

import { getCachedReleases, formatBytes, formatDate } from './github.js';
import { getIcon, iconForFile } from './icons.js';

/**
 * Build and display the mobile layout.
 * @param {Array}  repos
 * @param {Object} releasesData  - keyed by "owner/repo"
 */
export function renderMobileLayout(repos, releasesData) {
  const layout  = document.getElementById('mobile-layout');
  const content = document.getElementById('mobile-content');
  if (!layout || !content) return;

  layout.classList.remove('hidden');
  content.innerHTML = '';

  if (repos.length === 0) {
    content.innerHTML = '<p style="padding:16px;color:#7a8898;">No repos in manifest. Edit data/repos.json.</p>';
    return;
  }

  repos.forEach(repo => {
    const releases = releasesData[repo.repo] || getCachedReleases(repo.repo) || [];
    content.appendChild(buildRepoBlock(repo, releases));
  });
}

function buildRepoBlock(repo, releases) {
  const block = document.createElement('div');
  block.className = 'mobile-repo';

  const header = document.createElement('div');
  header.className = 'mobile-repo-header';
  header.setAttribute('role', 'button');
  header.setAttribute('aria-expanded', 'false');
  header.setAttribute('tabindex', '0');
  header.innerHTML = `
    <div style="display:inline-flex;align-items:center;gap:8px;">
      <div style="width:28px;height:28px;">${getIcon(repo.icon || 'folder')}</div>
      <div>
        <div class="mobile-repo-title">${escHtml(repo.label)}</div>
        <div class="mobile-repo-desc">${escHtml(repo.description || '')}</div>
      </div>
    </div>
    <div class="mobile-repo-toggle" aria-hidden="true">▶</div>`;

  const body = document.createElement('div');
  body.className = 'mobile-repo-body';

  // Actions
  const latest = releases[0];
  if (latest) {
    const actions = document.createElement('div');
    actions.className = 'mobile-actions';
    if (latest.assets?.length > 0) {
      const dlBtn = document.createElement('a');
      dlBtn.className = 'mobile-action-btn';
      dlBtn.textContent = '⬇ Download latest';
      dlBtn.href = latest.assets.length === 1 ? latest.assets[0].browser_download_url : latest.html_url;
      dlBtn.target = '_blank';
      dlBtn.rel = 'noopener';
      actions.appendChild(dlBtn);
    }
    const ghBtn = document.createElement('a');
    ghBtn.className = 'mobile-action-btn secondary';
    ghBtn.textContent = '↗ GitHub';
    ghBtn.href = `https://github.com/${repo.repo}`;
    ghBtn.target = '_blank';
    ghBtn.rel = 'noopener';
    actions.appendChild(ghBtn);
    body.appendChild(actions);
  }

  // Versions
  if (releases.length > 0) {
    const versionsEl = document.createElement('div');
    versionsEl.className = 'mobile-versions';
    releases.forEach((rel, idx) => {
      versionsEl.appendChild(buildVersionBlock(rel, idx === 0));
    });
    body.appendChild(versionsEl);
  } else {
    body.innerHTML += '<p style="padding:10px 12px;font-size:12px;color:#8a90a0;">No releases yet.</p>';
  }

  block.appendChild(header);
  block.appendChild(body);

  // Toggle
  function toggle() {
    const open = body.classList.toggle('open');
    header.setAttribute('aria-expanded', String(open));
    header.querySelector('.mobile-repo-toggle').classList.toggle('open', open);
  }
  header.addEventListener('click', toggle);
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });

  return block;
}

function buildVersionBlock(release, isLatest) {
  const block = document.createElement('div');
  block.className = 'mobile-version';

  const header = document.createElement('div');
  header.className = 'mobile-version-header';
  header.setAttribute('role', 'button');
  header.setAttribute('tabindex', '0');
  header.innerHTML = `
    <span class="mobile-version-tag">${escHtml(release.tag_name)}</span>
    ${isLatest ? '<span class="mobile-latest-badge">latest</span>' : ''}
    <span class="mobile-version-date">${formatDate(release.published_at)}</span>`;

  const assets = document.createElement('div');
  assets.className = 'mobile-version-assets';
  const assetList = release.assets || [];
  if (assetList.length === 0) {
    assets.innerHTML = '<p style="color:#8a90a0;font-size:12px;">No assets.</p>';
  } else {
    assetList.forEach(a => {
      const link = document.createElement('a');
      link.className = 'mobile-asset';
      link.href = a.browser_download_url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.innerHTML = `
        <span style="width:20px;height:20px;display:inline-flex;">${getIcon(iconForFile(a.name))}</span>
        <span>${escHtml(a.name)}</span>
        <span class="mobile-asset-size">${formatBytes(a.size)}</span>`;
      assets.appendChild(link);
    });
  }

  block.appendChild(header);
  block.appendChild(assets);

  header.addEventListener('click', () => {
    assets.classList.toggle('open');
  });
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); assets.classList.toggle('open'); }
  });

  return block;
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
