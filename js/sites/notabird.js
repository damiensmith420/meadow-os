/**
 * sites/notabird.js — NotABird (parody Twitter/X)
 * A timeline of absurd fake posts with SVG-drawn profile avatars.
 */

// ── Fake users ────────────────────────────────────────────────────────────────
const USERS = [
  { handle: '@WormMagnate',      name: 'The Worm Magnate',       color: '#8b4513', emoji: '🪱' },
  { handle: '@pigeon_witness',   name: 'Pigeon Witness',         color: '#888',    emoji: '🐦' },
  { handle: '@philosopherstone', name: 'Dave (Philosopher)',     color: '#9370db', emoji: '🪨' },
  { handle: '@CryptoFernandez',  name: 'Greg Fernandez (Crypto)',color: '#f0a500', emoji: '📈' },
  { handle: '@BlandOpinions',    name: 'Normal Gary',            color: '#4a90d9', emoji: '😐' },
  { handle: '@shrimpsorian',     name: 'Dr. Shrimp Sorian',      color: '#e95c5c', emoji: '🦐' },
  { handle: '@aunt_frequencies', name: 'Aunt Frequencies',       color: '#3aaa3a', emoji: '📡' },
  { handle: '@horoscope_error',  name: 'Horoscope Error 404',    color: '#c060c0', emoji: '⭐' },
  { handle: '@DryWallFan',       name: 'Drywall Appreciation',   color: '#b0904a', emoji: '🧱' },
  { handle: '@fog_investigator', name: 'Fog Investigator',       color: '#9ab',    emoji: '🌫️' },
];

// ── Post templates ─────────────────────────────────────────────────────────────
const POSTS = [
  { user: 0, text: 'The moon is simply the sun but polite.', chirps: 142800, rechirps: 38100, time: '2m' },
  { user: 1, text: 'I\'ve been watching the same crossroads for 6 years. Nothing has happened. Something will happen.', chirps: 94200, rechirps: 12400, time: '4m' },
  { user: 2, text: 'Hot take: rocks were here before us and they will outlast us and we have been very rude to them.', chirps: 230100, rechirps: 55000, time: '9m' },
  { user: 3, text: 'I have invented a new currency backed entirely by confidence. DM me to invest. No refunds. No questions.', chirps: 3200,   rechirps: 880,   time: '11m' },
  { user: 4, text: 'Had soup today. It was fine.', chirps: 1,      rechirps: 0,     time: '14m' },
  { user: 5, text: 'New paper: shrimp can technically win an argument if you define "winning" broadly enough and the other person leaves the room.', chirps: 87400, rechirps: 21000, time: '18m' },
  { user: 6, text: 'something is broadcasting from your microwave and it isn\'t recipes [THREAD 1/47]', chirps: 311000, rechirps: 74000, time: '22m' },
  { user: 7, text: 'Mercury is in retrograde which means you should not sign any contracts, speak to any birds, or make eye contact with soup.', chirps: 68900, rechirps: 19200, time: '31m' },
  { user: 8, text: 'Drywall update: still standing. Will report if situation changes.', chirps: 4400,  rechirps: 920,   time: '45m' },
  { user: 9, text: 'The fog has moved. I can\'t prove it moved but the fog knows what it did.', chirps: 125700, rechirps: 33000, time: '1h' },
  { user: 0, text: 'Asked a worm for advice. It declined to comment. This is the most honest thing anyone has said to me this year.', chirps: 88600, rechirps: 24100, time: '2h' },
  { user: 2, text: 'Philosophy final exam Q1: "Is a door still a door if nobody uses it?" I said "the door doesn\'t need your validation." I passed.', chirps: 198000, rechirps: 48000, time: '3h' },
  { user: 5, text: 'Update on the shrimp study: one of the shrimp has started filing paperwork. We don\'t know what it\'s filing. We\'re leaving it alone.', chirps: 204000, rechirps: 61000, time: '4h' },
  { user: 3, text: 'NotABird is NOT the same as Twitter. Twitter had a bird logo. Ours is a slightly different bird. Completely different company. All coincidences are legally distinct.', chirps: 6700, rechirps: 2100, time: '5h' },
  { user: 1, text: 'A pigeon landed on my car. It looked at me with the knowledge of something I will never understand. It left. The car started fine. I am not fine.', chirps: 310000, rechirps: 82000, time: '6h' },
  { user: 6, text: 'update: the microwave signal contains what appears to be a shopping list [THREAD 7/47]', chirps: 144000, rechirps: 38000, time: '8h' },
  { user: 7, text: 'Venus is now in alignment with your credit score. Pay your bills or face celestial consequences. Unfollow me if you disagree.', chirps: 55000, rechirps: 14000, time: '10h' },
  { user: 4, text: 'Watched a documentary. It was okay.', chirps: 2,      rechirps: 0,     time: '12h' },
  { user: 8, text: 'The drywall has a crack. I am monitoring the situation. Please hold.', chirps: 12400, rechirps: 3100,  time: '14h' },
  { user: 9, text: 'The fog came back. I believe it heard what I said. I am leaving town.', chirps: 290000, rechirps: 71000, time: '1d' },
  { user: 0, text: 'Worms don\'t use social media. Think about that. Think about who is more evolved.', chirps: 176000, rechirps: 44000, time: '1d' },
];

// ── Render ────────────────────────────────────────────────────────────────────
export function render(container, queryString, navigate) {
  container.innerHTML = '';
  container.style.cssText = 'position:absolute;inset:0;overflow-y:auto;background:#15202b;font-family:"Trebuchet MS",Tahoma,sans-serif;color:#fff;';

  const layout = document.createElement('div');
  layout.style.cssText = 'display:flex;max-width:1000px;margin:0 auto;min-height:100%;';

  // ── Left sidebar ─────────────────────────────────────────────────────────────
  const sidebar = document.createElement('div');
  sidebar.style.cssText = 'width:220px;flex-shrink:0;padding:16px 12px;border-right:1px solid #2d3741;position:sticky;top:0;height:100vh;overflow-y:auto;';
  sidebar.innerHTML = `
    <div style="font-size:28px;font-weight:900;color:#1d9bf0;margin-bottom:24px;letter-spacing:-1px;">NotABird 🐦</div>
    <div style="font-size:12px;color:#8899a6;font-style:italic;margin-bottom:24px;">definitely not a bird website</div>
    ${['🏠 Home','🔎 Explore','🔔 Notifications','✉️ Messages','🔖 Bookmarks','⭐ Premium (fake)','👤 Profile'].map(item =>
      `<div style="padding:10px 8px;border-radius:8px;cursor:pointer;font-size:14px;color:#e7e9ea;margin-bottom:2px;transition:background 0.1s;"
        onmouseenter="this.style.background='#1e2a37'" onmouseleave="this.style.background=''">${item}</div>`
    ).join('')}
    <button style="margin-top:16px;width:100%;padding:12px;background:#1d9bf0;border:none;border-radius:24px;color:#fff;font-size:14px;font-weight:bold;cursor:pointer;font-family:inherit;">
      Chirp
    </button>`;
  layout.appendChild(sidebar);

  // ── Main feed ─────────────────────────────────────────────────────────────────
  const feed = document.createElement('div');
  feed.style.cssText = 'flex:1;border-right:1px solid #2d3741;min-width:0;';

  // Header
  const header = document.createElement('div');
  header.style.cssText = 'padding:14px 16px;border-bottom:1px solid #2d3741;font-size:18px;font-weight:bold;position:sticky;top:0;background:rgba(21,32,43,0.9);backdrop-filter:blur(8px);';
  header.innerHTML = `<span>Home</span> <span style="font-size:12px;color:#8899a6;margin-left:8px;">✓ Authentic timeline</span>`;
  feed.appendChild(header);

  // Compose box
  const compose = document.createElement('div');
  compose.style.cssText = 'padding:12px 16px;border-bottom:1px solid #2d3741;display:flex;gap:10px;';
  compose.innerHTML = `
    <div style="width:40px;height:40px;border-radius:50%;background:#1d9bf0;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">😶</div>
    <div style="flex:1;">
      <input placeholder="What's chirping?" style="width:100%;background:transparent;border:none;border-bottom:1px solid #2d3741;color:#fff;font-size:15px;padding:8px 0;outline:none;font-family:inherit;"/>
      <div style="display:flex;justify-content:flex-end;margin-top:8px;">
        <button style="padding:8px 18px;background:#1d9bf0;border:none;border-radius:20px;color:#fff;font-size:13px;font-weight:bold;cursor:pointer;font-family:inherit;">Chirp</button>
      </div>
    </div>`;
  feed.appendChild(compose);

  // Posts
  POSTS.forEach(post => {
    feed.appendChild(buildPost(post));
  });

  layout.appendChild(feed);

  // ── Right sidebar ──────────────────────────────────────────────────────────────
  const rsidebar = document.createElement('div');
  rsidebar.style.cssText = 'width:280px;flex-shrink:0;padding:12px;';
  rsidebar.innerHTML = `
    <div style="background:#1e2a37;border-radius:12px;padding:14px;margin-bottom:12px;">
      <div style="font-size:16px;font-weight:bold;margin-bottom:10px;">Trending on NotABird</div>
      ${['#WormRights','#MoonIsTooPolite','#FogGate','#ShrimpPaperwork','#DrywallWatch2025','#MicrowaveSignal'].map((tag, i) => `
        <div style="padding:8px 0;border-bottom:1px solid #2d3741;cursor:pointer;" onmouseenter="this.style.opacity=0.7" onmouseleave="this.style.opacity=1">
          <div style="font-size:11px;color:#8899a6;">${i+1} · Trending</div>
          <div style="font-size:14px;font-weight:bold;color:#1d9bf0;">${tag}</div>
          <div style="font-size:11px;color:#8899a6;">${Math.floor(Math.random()*80+10)}k Chirps</div>
        </div>`).join('')}
    </div>
    <div style="background:#1e2a37;border-radius:12px;padding:14px;">
      <div style="font-size:16px;font-weight:bold;margin-bottom:10px;">Who to follow</div>
      ${USERS.slice(0,3).map(u => `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <div style="width:36px;height:36px;border-radius:50%;background:${u.color};display:flex;align-items:center;justify-content:center;font-size:16px;">${u.emoji}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(u.name)}</div>
            <div style="font-size:12px;color:#8899a6;">${escHtml(u.handle)}</div>
          </div>
          <button style="padding:5px 12px;background:transparent;border:1px solid #fff;border-radius:20px;color:#fff;font-size:12px;cursor:pointer;font-family:inherit;"
            onmouseenter="this.style.background='rgba(255,255,255,0.1)'" onmouseleave="this.style.background='transparent'">Follow</button>
        </div>`).join('')}
    </div>`;
  layout.appendChild(rsidebar);

  container.appendChild(layout);
}

function buildPost(post) {
  const user = USERS[post.user];
  const div  = document.createElement('div');
  div.style.cssText = 'padding:14px 16px;border-bottom:1px solid #2d3741;display:flex;gap:10px;cursor:pointer;';
  div.onmouseenter = () => div.style.background = 'rgba(255,255,255,0.03)';
  div.onmouseleave = () => div.style.background = '';

  div.innerHTML = `
    <div style="width:40px;height:40px;border-radius:50%;background:${user.color};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${user.emoji}</div>
    <div style="flex:1;min-width:0;">
      <div style="display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
        <span style="font-weight:bold;font-size:14px;">${escHtml(user.name)}</span>
        <span style="color:#8899a6;font-size:13px;">${escHtml(user.handle)}</span>
        <span style="color:#8899a6;font-size:12px;">· ${post.time}</span>
      </div>
      <div style="font-size:14px;line-height:1.6;color:#e7e9ea;white-space:pre-wrap;word-break:break-word;">${escHtml(post.text)}</div>
      <div style="display:flex;gap:24px;margin-top:10px;color:#8899a6;font-size:12px;">
        <span style="cursor:pointer;" onmouseenter="this.style.color='#1d9bf0'" onmouseleave="this.style.color='#8899a6'">💬 ${fmt(Math.floor(post.rechirps * 0.2))}</span>
        <span style="cursor:pointer;" onmouseenter="this.style.color='#00ba7c'" onmouseleave="this.style.color='#8899a6'">🔄 ${fmt(post.rechirps)}</span>
        <span style="cursor:pointer;" onmouseenter="this.style.color='#f91880'" onmouseleave="this.style.color='#8899a6'">❤️ ${fmt(post.chirps)}</span>
        <span style="cursor:pointer;" onmouseenter="this.style.color='#1d9bf0'" onmouseleave="this.style.color='#8899a6'">📊</span>
      </div>
    </div>`;

  return div;
}

function fmt(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1)+'M';
  if (n >= 1000)    return (n/1000).toFixed(1)+'k';
  return String(n);
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
