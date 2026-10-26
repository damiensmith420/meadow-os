/**
 * github.js — GitHub data fetching, caching, and rate-limit handling
 *
 * Strategy:
 *  1. Try to load data/releases.json (pre-built by GitHub Actions).
 *  2. If missing/empty, fetch live from the GitHub REST API per repo.
 *  3. Cache live results in sessionStorage to survive navigation without
 *     burning rate-limit quota (60 req/hr unauthenticated).
 */

const SESSION_KEY = 'meadow-releases-cache';
const RELEASES_PATH = 'data/releases.json';

let _cache = null; // module-level in-memory cache

/**
 * Load all release data. Returns an object keyed by "owner/repo".
 * @returns {Promise<Object>}
 */
export async function loadAllReleases(repos) {
  // 1. Try pre-built releases.json
  try {
    const res = await fetch(RELEASES_PATH);
    if (res.ok) {
      const data = await res.json();
      // releases.json must have at least one populated key to be considered valid
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        _cache = data;
        return data;
      }
    }
  } catch {}

  // 2. Check sessionStorage cache
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached && Object.keys(cached).length > 0) {
        _cache = cached;
        return cached;
      }
    }
  } catch {}

  // 3. Fetch live from GitHub API
  const result = {};
  for (const repo of repos) {
    try {
      const releases = await fetchRepoReleases(repo.repo);
      result[repo.repo] = releases;
    } catch (err) {
      if (err.status === 403 || err.status === 429) {
        // Rate limited — return what we have and surface the error
        err.rateLimited = true;
        err.partialData = result;
        _cache = result;
        saveSessionCache(result);
        throw err;
      }
      // Other error (e.g. repo not found) — store empty array
      result[repo.repo] = [];
    }
  }

  _cache = result;
  saveSessionCache(result);
  return result;
}

/**
 * Fetch releases for a single repo slug ("owner/name").
 * @returns {Promise<Array>}
 */
export async function fetchRepoReleases(repoSlug) {
  const url = `https://api.github.com/repos/${repoSlug}/releases?per_page=30`;
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) {
    const err = new Error(`GitHub API error ${res.status} for ${repoSlug}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/**
 * Return cached releases for a single repo (from module cache).
 * @param {string} repoSlug
 * @returns {Array}
 */
export function getCachedReleases(repoSlug) {
  if (_cache && _cache[repoSlug]) return _cache[repoSlug];
  return null;
}

/** Save to sessionStorage (best effort) */
function saveSessionCache(data) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch {}
}

/**
 * Fetch recent public events for a GitHub user.
 * @param {string} username
 * @param {number} count
 */
export async function fetchUserEvents(username, count = 8) {
  const url = `https://api.github.com/users/${username}/events/public?per_page=${count}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`Events API error ${res.status}`);
  return res.json();
}

/** Format bytes to human-readable string */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1) + ' ' + units[i];
}

/** Format ISO date string to short locale string */
export function formatDate(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Relative time string ("3 days ago") */
export function relativeTime(isoStr) {
  if (!isoStr) return '';
  const diff = Date.now() - new Date(isoStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return formatDate(isoStr);
}
