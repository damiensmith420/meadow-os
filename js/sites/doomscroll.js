/**
 * sites/doomscroll.js — Doomscroll (parody Reddit/news)
 * Infinite scroll of increasingly unhinged fake headlines.
 */

// ── Post pool ─────────────────────────────────────────────────────────────────
const ALL_POSTS = [
  // TIER 1 — plausible
  { sub: 'r/mildlyinteresting',  title: 'This cloud looks exactly like another cloud',                         votes: 42100, comments: 312,  time: '3h',  flair: null,          icon: '☁️' },
  { sub: 'r/todayilearned',      title: 'TIL that socks were invented before feet. Feet came later.',          votes: 89400, comments: 1240, time: '5h',  flair: 'TIL',         icon: '🧦' },
  { sub: 'r/worldnews',          title: 'Man files formal complaint against Tuesday; court date set for Thursday', votes: 220000, comments: 4400, time: '1h', flair: 'BREAKING', icon: '📰' },
  { sub: 'r/lifeprotips',        title: 'LPT: If you are worried about something, simply stop. This is free.', votes: 156000, comments: 8800, time: '6h',  flair: 'LPT',         icon: '💡' },
  { sub: 'r/science',            title: 'Study: 94% of geese surveyed described themselves as "not your problem"', votes: 311000, comments: 5500, time: '2h', flair: 'SCIENCE',  icon: '🪿' },
  { sub: 'r/askreddit',          title: 'What is something that is technically legal but widely considered "a lot"?', votes: 445000, comments: 32000, time: '4h', flair: null,   icon: '❓' },

  // TIER 2 — getting weird
  { sub: 'r/conspiracy',         title: 'The traffic cone supply chain: what are they trying to tell us?',      votes: 28900, comments: 1100, time: '7h',  flair: 'MEGATHREAD', icon: '🚧' },
  { sub: 'r/drywall',            title: '[UPDATE] Day 48: The crack has a crack now. I am calling it Craig.',   votes: 67800, comments: 2200, time: '2h',  flair: 'UPDATE',      icon: '🧱' },
  { sub: 'r/news',               title: 'Local pigeon refuses to elaborate; local man refuses to accept this',  votes: 540000, comments: 9100, time: '45m', flair: 'DEVELOPING', icon: '🐦' },
  { sub: 'r/philosophy',         title: 'If a door isn\'t being used, is it still a door or just a wall with ambition?', votes: 198000, comments: 14200, time: '9h', flair: null, icon: '🚪' },
  { sub: 'r/personalfinance',    title: 'UPDATE: I invested everything in ConfidenceCoin. It is not going well.',votes: 78000, comments: 6600, time: '3h',  flair: null,          icon: '💰' },
  { sub: 'r/food',               title: 'The EU has released a 312-page document about soup. Page 47 is just the word "maybe."', votes: 284000, comments: 7700, time: '11h', flair: null, icon: '🍲' },

  // TIER 3 — fully unhinged
  { sub: 'r/wormscience',        title: 'BREAKING: A worm has been observed making a decision. Science community demands more worms.', votes: 890000, comments: 44000, time: '1h', flair: 'PEER REVIEWED', icon: '🪱' },
  { sub: 'r/TrueOff',            title: 'My shadow moved without me. I have footage. I will not share the footage. AMA.',            votes: 1400000, comments: 88000, time: '20m', flair: 'AMA',  icon: '👤' },
  { sub: 'r/birds',              title: '[Megathread] All evidence birds are government surveillance drones (citations)',              votes: 2200000, comments: 110000, time: '6h', flair: 'MEGATHREAD', icon: '🐦' },
  { sub: 'r/homeimprovement',    title: 'My house moved 3 feet to the left overnight. Contractor says "that\'s not how houses work." Update inside.', votes: 670000, comments: 31000, time: '8h', flair: 'UPDATE', icon: '🏠' },
  { sub: 'r/wellthatsucks',      title: 'Bought a jar of 2019 air. Opened it. Now it\'s 2025 air. Lesson learned.',                  votes: 440000, comments: 21000, time: '4h',  flair: null,          icon: '💨' },
  { sub: 'r/relationship_advice',title: 'My partner argues that soup is a drink. I have been awake for 3 days.',                     votes: 1100000, comments: 62000, time: '30m', flair: null,          icon: '💬' },

  // TIER 4 — existentially wrong
  { sub: 'r/Showerthoughts',     title: 'If a sock goes missing in the wash, is the matching sock now a widow?',                     votes: 3400000, comments: 145000, time: '12h', flair: null, icon: '🧦' },
  { sub: 'r/NotTheOnion',        title: 'Man attempts to return a Tuesday; store manager "surprisingly understanding"',              votes: 5600000, comments: 220000, time: '1d',  flair: 'NOT THE ONION', icon: '📰' },
  { sub: 'r/totallynotrobots',   title: 'Fellow humans: what is your favourite human food that you eat with your human mouth?',      votes: 8800000, comments: 440000, time: '2d',  flair: null, icon: '🤖' },
  { sub: 'r/fog',                title: 'I confronted the fog. The fog did not respond. The fog knows what it did.',                  votes: 12000000, comments: 880000, time: '3d', flair: 'DEVELOPING', icon: '🌫️' },
];

const COMMENTS = [
  'This is the most important post I have seen this year.',
  'Username checks out.',
  'I did not ask to read this on a Thursday morning.',
  'Source? No, I believe it. Just curious.',
  'My therapist is going to hear about this.',
  'This is fine.',
  'Petition to make this illegal.',
  'I showed this to my cat. The cat had opinions.',
  'There are 440,000 comments on this post and they are all the same.',
  'I have been staring at this for 12 minutes and I have more questions.',
  'Forwarded this to everyone I know. Two have responded. Both with "??".',
  'I am calling my senator.',
  '"That\'s not how houses work." Gonna be my ringtone.',
  'The sock widow thing broke me. I need a moment.',
  'The fog knows what it did. I feel that deeply.',
];

// ── Render ────────────────────────────────────────────────────────────────────
export function render(container, queryString, navigate) {
  container.innerHTML = '';
  container.style.cssText = 'background:#dae0e6;height:100%;overflow-y:auto;font-family:"IBM Plex Sans","Trebuchet MS",sans-serif;color:#1c1c1c;';

  const layout = document.createElement('div');
  layout.style.cssText = 'display:flex;max-width:1100px;margin:0 auto;gap:16px;padding:16px;';

  // ── Main column ─────────────────────────────────────────────────────────────
  const main = document.createElement('div');
  main.style.cssText = 'flex:1;min-width:0;';

  // Sort bar
  const sortBar = document.createElement('div');
  sortBar.style.cssText = 'background:#fff;border-radius:8px;padding:8px 12px;margin-bottom:10px;display:flex;gap:6px;align-items:center;font-size:13px;';
  sortBar.innerHTML = `<b>Sort by:</b> ` + ['🔥 Hot','⬆ Top','🆕 New','🚀 Rising'].map((s, i) =>
    `<button style="padding:4px 12px;border-radius:20px;border:none;cursor:pointer;font-size:12px;font-family:inherit;
      background:${i===0?'#ff4500':'#f6f7f8'};color:${i===0?'#fff':'#1c1c1c'};"
      onmouseenter="if(${i}!==0)this.style.background='#e8e8e8'" onmouseleave="if(${i}!==0)this.style.background='#f6f7f8'">${s}</button>`
  ).join('');
  main.appendChild(sortBar);

  // Posts
  const postsContainer = document.createElement('div');
  ALL_POSTS.forEach((post, idx) => {
    postsContainer.appendChild(buildPost(post, idx, navigate));
  });
  main.appendChild(postsContainer);

  // Infinite scroll sentinel
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'text-align:center;padding:16px;color:#888;font-size:13px;';
  sentinel.textContent = 'Loading more posts...';
  main.appendChild(sentinel);

  // Fake infinite scroll — append more after reaching the bottom
  let page = 0;
  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    page++;
    const shuffled = [...ALL_POSTS].sort(() => Math.random() - 0.5);
    shuffled.slice(0, 6).forEach((post, idx) => {
      const clone = { ...post, votes: Math.floor(post.votes * (0.5 + Math.random())), time: `${page * 2 + idx}h` };
      postsContainer.appendChild(buildPost(clone, page * 100 + idx, navigate));
    });
    if (page >= 5) { sentinel.textContent = 'You have reached the end of the internet. Go outside.'; observer.disconnect(); }
  }, { root: container, threshold: 0.1 });
  observer.observe(sentinel);

  layout.appendChild(main);

  // ── Sidebar ──────────────────────────────────────────────────────────────────
  const sidebar = document.createElement('div');
  sidebar.style.cssText = 'width:280px;flex-shrink:0;';

  // Community info
  const communityCard = document.createElement('div');
  communityCard.style.cssText = 'background:#fff;border-radius:8px;overflow:hidden;margin-bottom:12px;';
  communityCard.innerHTML = `
    <div style="background:linear-gradient(135deg,#ff4500,#ff6534);height:60px;"></div>
    <div style="padding:12px;padding-top:8px;">
      <div style="font-size:16px;font-weight:bold;margin-bottom:4px;">🌀 Doomscroll</div>
      <div style="font-size:12px;color:#666;margin-bottom:10px;">The internet, unfiltered and mostly wrong.</div>
      <div style="display:flex;gap:16px;margin-bottom:10px;font-size:12px;">
        <div><b>12.4M</b><br><span style="color:#888;">Members</span></div>
        <div><b>144k</b><br><span style="color:#888;">Online</span></div>
      </div>
      <button style="width:100%;padding:8px;background:#ff4500;border:none;border-radius:20px;color:#fff;font-size:13px;font-weight:bold;cursor:pointer;font-family:inherit;">Join (you already have)</button>
    </div>`;
  sidebar.appendChild(communityCard);

  // Trending communities
  const trending = document.createElement('div');
  trending.style.cssText = 'background:#fff;border-radius:8px;padding:12px;margin-bottom:12px;';
  trending.innerHTML = `<div style="font-size:14px;font-weight:bold;margin-bottom:10px;">🔥 Trending Communities</div>` +
    ['r/drywall','r/wormscience','r/fog','r/birds','r/souplaw','r/drywallcrackwatch'].map((c,i) => `
      <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:12px;cursor:pointer;"
        onmouseenter="this.style.background='#f8f8f8'" onmouseleave="this.style.background=''">
        <b style="color:#888;">${i+1}</b>
        <span style="color:#1a3a6a;">${c}</span>
        <span style="margin-left:auto;color:#888;">${Math.floor(Math.random()*500+50)}k members</span>
      </div>`).join('');
  sidebar.appendChild(trending);

  layout.appendChild(sidebar);
  container.appendChild(layout);
}

function buildPost(post, idx, navigate) {
  const div = document.createElement('div');
  div.style.cssText = 'background:#fff;border-radius:8px;margin-bottom:8px;display:flex;overflow:hidden;';
  div.onmouseenter = () => div.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  div.onmouseleave = () => div.style.boxShadow = '';

  // Vote column
  const voteCol = document.createElement('div');
  voteCol.style.cssText = 'background:#f8f9fa;width:36px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;padding:8px 4px;gap:2px;font-size:11px;';
  voteCol.innerHTML = `
    <button style="background:none;border:none;cursor:pointer;font-size:16px;color:#888;padding:0;" title="Upvote"
      onclick="this.style.color='#ff4500'">▲</button>
    <span style="font-weight:bold;font-size:11px;color:#1c1c1c;">${fmt(post.votes)}</span>
    <button style="background:none;border:none;cursor:pointer;font-size:16px;color:#888;padding:0;" title="Downvote"
      onclick="this.style.color='#7193ff'">▼</button>`;
  div.appendChild(voteCol);

  // Content
  const content = document.createElement('div');
  content.style.cssText = 'padding:10px 12px;flex:1;min-width:0;';

  const flair = post.flair ? `<span style="background:#edeff1;color:#1c1c1c;font-size:10px;padding:2px 6px;border-radius:3px;margin-right:6px;font-weight:bold;">${escHtml(post.flair)}</span>` : '';
  content.innerHTML = `
    <div style="font-size:11px;color:#888;margin-bottom:4px;">
      <b style="color:#1c1c1c;">${escHtml(post.sub)}</b> · Posted by u/anonymous · ${post.time} ago
    </div>
    <div style="font-size:15px;font-weight:600;line-height:1.4;margin-bottom:8px;cursor:pointer;" class="ds-title">
      ${flair}${post.icon} ${escHtml(post.title)}
    </div>
    <div style="display:flex;gap:12px;font-size:12px;color:#888;">
      <span style="cursor:pointer;" onmouseenter="this.style.color='#1c1c1c'" onmouseleave="this.style.color='#888'">💬 ${fmt(post.comments)} Comments</span>
      <span style="cursor:pointer;" onmouseenter="this.style.color='#1c1c1c'" onmouseleave="this.style.color='#888'">🔗 Share</span>
      <span style="cursor:pointer;" onmouseenter="this.style.color='#1c1c1c'" onmouseleave="this.style.color='#888'">🔖 Save</span>
      <span style="cursor:pointer;" onmouseenter="this.style.color='#1c1c1c'" onmouseleave="this.style.color='#888'">⋯ More</span>
    </div>`;

  // Expand comments on click
  const titleEl = content.querySelector('.ds-title');
  let expanded = false;
  titleEl.addEventListener('click', () => {
    if (expanded) return;
    expanded = true;
    const cmtBox = document.createElement('div');
    cmtBox.style.cssText = 'margin-top:10px;padding-top:10px;border-top:1px solid #f0f0f0;';
    const picks = COMMENTS.sort(() => Math.random() - 0.5).slice(0, 3);
    picks.forEach(c => {
      const cd = document.createElement('div');
      cd.style.cssText = 'font-size:12px;color:#444;padding:5px 0;border-bottom:1px solid #f8f8f8;';
      cd.innerHTML = `<b style="color:#1a3a6a;">u/commentuser${Math.floor(Math.random()*9000+1000)}</b>: ${escHtml(c)}`;
      cmtBox.appendChild(cd);
    });
    content.appendChild(cmtBox);
  });

  div.appendChild(content);
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
