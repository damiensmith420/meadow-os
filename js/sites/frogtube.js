/**
 * sites/frogtube.js — FrogTube (parody YouTube)
 * Fake video thumbnails, a fake player that shows a bouncing DVD logo animation.
 */

// ── Fake videos ───────────────────────────────────────────────────────────────
const VIDEOS = [
  {
    id:    'dvd_gravity',
    title: 'Man Explains Gravity to a Cat for 47 Minutes',
    channel: 'gravity_explainer',
    views: '18.7M', age: '3 years ago',
    duration: '47:03',
    desc: 'The cat never learns. I have not given up. Episode 1 of what is now a 200-episode series.',
    thumb: '#2a4a7a', thumbEmoji: '🐱',
    tags: ['science','cats','gravity'],
  },
  {
    id:    'dvd_sitting',
    title: '2024 World Competitive Speed-Sitting Finals (FULL EVENT)',
    channel: 'SpeedSitTV',
    views: '4.1M', age: '8 months ago',
    duration: '2:14:38',
    desc: 'Germany takes gold for the 11th consecutive year. The Belgian team has lodged a protest. Nobody can define "unfair sitting."',
    thumb: '#4a2a7a', thumbEmoji: '🪑',
    tags: ['sports','sitting','competition'],
  },
  {
    id:    'dvd_cloud',
    title: 'I Watched the Same Cloud for 6 Hours [TIMELAPSE]',
    channel: 'CloudWatcher4000',
    views: '9.2M', age: '1 year ago',
    duration: '6:00:01',
    desc: 'Nothing happened for 5 hours 58 minutes. Then something happened. I will not describe what happened. Watch to find out.',
    thumb: '#3a6a9a', thumbEmoji: '☁️',
    tags: ['nature','clouds','documentary'],
  },
  {
    id:    'dvd_worm',
    title: 'Worm Does Something (Compilation)',
    channel: 'WormMagnate',
    views: '22.4M', age: '2 years ago',
    duration: '1:12:04',
    desc: 'Four hundred clips of worms doing things. Scientifically classified. What are they doing? Nobody knows. I have theories.',
    thumb: '#5a3a1a', thumbEmoji: '🪱',
    tags: ['nature','worms','compilation'],
  },
  {
    id:    'dvd_soup',
    title: 'I Legally Challenged the Definition of Soup',
    channel: 'SoupLawyer',
    views: '31.8M', age: '6 months ago',
    duration: '28:44',
    desc: 'I took this to small claims court. They told me to leave. I appealed. It went to the second floor. Full update video.',
    thumb: '#6a3a2a', thumbEmoji: '🍲',
    tags: ['law','soup','vlog'],
  },
  {
    id:    'dvd_pigeon',
    title: 'This Pigeon Has Been Following Me for 3 Weeks',
    channel: 'pigeon_witness',
    views: '44.1M', age: '5 months ago',
    duration: '11:22',
    desc: 'I set up cameras. The pigeon also set up cameras. I don\'t know where it got cameras. This is the footage.',
    thumb: '#4a4a4a', thumbEmoji: '🐦',
    tags: ['mystery','pigeons','surveillance'],
  },
  {
    id:    'dvd_drywall',
    title: 'LIVE: Watching My Drywall (Hour 48)',
    channel: 'DrywallFan',
    views: '1.2M', age: '2 days ago',
    duration: 'LIVE',
    desc: 'It cracked at hour 31. I am monitoring the crack. The crack has not expanded. It is thinking.',
    thumb: '#8a7a6a', thumbEmoji: '🧱',
    tags: ['live','drywall','monitoring'],
  },
  {
    id:    'dvd_moon',
    title: 'Why is the Moon So Polite? (Documentary)',
    channel: 'WormMagnate',
    views: '7.7M', age: '10 months ago',
    duration: '1:04:22',
    desc: 'Explores the moon\'s history of courtesy, its refusal to make noise, and why it only shows us one face. Coward? Or just British?',
    thumb: '#2a2a4a', thumbEmoji: '🌕',
    tags: ['space','moon','documentary'],
  },
];

// ── Render ────────────────────────────────────────────────────────────────────
export function render(container, queryString, navigate) {
  const params  = new URLSearchParams(queryString);
  const videoId = params.get('v');

  container.innerHTML = '';
  container.style.cssText = 'background:#0f0f0f;font-family:"Roboto",Arial,sans-serif;color:#fff;min-height:100%;';

  if (videoId) {
    const video = VIDEOS.find(v => v.id === videoId) || VIDEOS[0];
    renderPlayer(container, video, navigate);
  } else {
    renderHomepage(container, navigate);
  }
}

function renderHomepage(container, navigate) {
  // Top bar
  const topbar = document.createElement('div');
  topbar.style.cssText = 'background:#0f0f0f;padding:10px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #272727;position:sticky;top:0;z-index:10;';
  topbar.innerHTML = `
    <span style="font-size:20px;font-weight:900;color:#ff0000;letter-spacing:-1px;">🐸 FrogTube</span>
    <div style="flex:1;max-width:500px;display:flex;gap:6px;">
      <input id="ft-search" placeholder="Search FrogTube..." style="flex:1;padding:7px 14px;background:#121212;border:1px solid #333;border-radius:20px 0 0 20px;color:#fff;font-size:13px;outline:none;font-family:inherit;"/>
      <button style="padding:7px 14px;background:#272727;border:1px solid #333;border-radius:0 20px 20px 0;color:#fff;font-size:13px;cursor:pointer;">🔍</button>
    </div>
    <div style="margin-left:auto;display:flex;gap:8px;font-size:12px;color:#aaa;">
      <span style="cursor:pointer;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='#aaa'">📤 Upload</span>
      <span style="cursor:pointer;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='#aaa'">🔔 Alerts</span>
    </div>`;
  container.appendChild(topbar);

  // Category pills
  const pills = document.createElement('div');
  pills.style.cssText = 'padding:10px 16px;display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;';
  ['All','Nature & Worms','Science','Surveillance','Sports','Food Law','Mystery','Live'].forEach((cat, i) => {
    const p = document.createElement('button');
    p.style.cssText = `padding:5px 14px;border-radius:20px;border:none;cursor:pointer;font-size:12px;font-family:inherit;white-space:nowrap;
      background:${i === 0 ? '#fff' : '#272727'};color:${i === 0 ? '#0f0f0f' : '#fff'};`;
    p.textContent = cat;
    p.addEventListener('mouseenter', () => { if(i!==0) p.style.background='#383838'; });
    p.addEventListener('mouseleave', () => { if(i!==0) p.style.background='#272727'; });
    pills.appendChild(p);
  });
  container.appendChild(pills);

  // Video grid
  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;padding:16px;';

  VIDEOS.forEach(v => {
    const card = document.createElement('div');
    card.style.cssText = 'cursor:pointer;';
    card.onmouseenter = () => thumb.style.opacity = '0.8';
    card.onmouseleave = () => thumb.style.opacity = '1';

    const thumb = document.createElement('div');
    thumb.style.cssText = `background:${v.thumb};border-radius:8px;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;font-size:40px;position:relative;transition:opacity 0.15s;overflow:hidden;`;
    thumb.textContent = v.thumbEmoji;

    const dur = document.createElement('div');
    dur.style.cssText = 'position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,0.8);color:#fff;font-size:11px;padding:2px 5px;border-radius:3px;font-family:inherit;';
    dur.textContent = v.duration;
    thumb.appendChild(dur);

    if (v.duration === 'LIVE') {
      dur.style.background = '#ff0000';
      dur.textContent = '● LIVE';
    }

    const info = document.createElement('div');
    info.style.cssText = 'padding:8px 4px 4px;';
    info.innerHTML = `
      <div style="font-size:13px;font-weight:500;line-height:1.4;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escHtml(v.title)}</div>
      <div style="font-size:12px;color:#aaa;">${escHtml(v.channel)}</div>
      <div style="font-size:12px;color:#aaa;">${v.views} views · ${v.age}</div>`;

    card.appendChild(thumb);
    card.appendChild(info);
    card.addEventListener('click', () => navigate('www.frogtube.mow?v=' + v.id));
    grid.appendChild(card);
  });
  container.appendChild(grid);

  // Search handler
  const searchInput = topbar.querySelector('#ft-search');
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') navigate('www.grassknoll.mow?q=' + encodeURIComponent(searchInput.value));
  });
}

function renderPlayer(container, video, navigate) {
  const layout = document.createElement('div');
  layout.style.cssText = 'display:flex;gap:16px;padding:16px;max-width:1100px;';

  // ── Video area ─────────────────────────────────────────────────────────────
  const main = document.createElement('div');
  main.style.cssText = 'flex:1;min-width:0;';

  // DVD bounce player
  const playerWrap = document.createElement('div');
  playerWrap.style.cssText = `background:#000;aspect-ratio:16/9;border-radius:8px;overflow:hidden;position:relative;`;
  const dvd = document.createElement('div');
  dvd.style.cssText = 'position:absolute;font-size:52px;cursor:default;user-select:none;';
  dvd.textContent = video.thumbEmoji;
  playerWrap.appendChild(dvd);

  // DVD bounce logic
  let px = 20, py = 20;
  let vx = 2.5, vy = 2.2;
  let dvdRaf;
  const bounceDVD = () => {
    const pw = playerWrap.offsetWidth  - 60;
    const ph = playerWrap.offsetHeight - 60;
    px += vx; py += vy;
    if (px <= 0 || px >= pw) { vx = -vx; px = Math.max(0, Math.min(px, pw)); }
    if (py <= 0 || py >= ph) { vy = -vy; py = Math.max(0, Math.min(py, ph)); }
    dvd.style.left = px + 'px';
    dvd.style.top  = py + 'px';
    dvdRaf = requestAnimationFrame(bounceDVD);
  };
  dvdRaf = requestAnimationFrame(bounceDVD);

  // Fake progress bar
  const controls = document.createElement('div');
  controls.style.cssText = 'padding:8px 0 4px;';
  controls.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
      <div style="flex:1;height:4px;background:#333;border-radius:2px;cursor:pointer;">
        <div id="ft-progress" style="height:100%;background:#ff0000;border-radius:2px;width:0%;transition:width 0.1s;"></div>
      </div>
      <span id="ft-time" style="font-size:12px;color:#aaa;">0:00 / ${video.duration === 'LIVE' ? 'LIVE' : video.duration}</span>
    </div>
    <div style="display:flex;align-items:center;gap:12px;font-size:14px;">
      <button style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;">▶</button>
      <button style="background:none;border:none;color:#fff;font-size:14px;cursor:pointer;">⏭</button>
      <button style="background:none;border:none;color:#fff;font-size:14px;cursor:pointer;">🔊</button>
      <span style="flex:1;"></span>
      <button style="background:none;border:none;color:#fff;font-size:14px;cursor:pointer;">⚙️</button>
      <button style="background:none;border:none;color:#fff;font-size:14px;cursor:pointer;">⛶</button>
    </div>`;
  main.appendChild(playerWrap);
  main.appendChild(controls);

  // Fake progress tick
  let progress = 0;
  const progressEl = controls.querySelector('#ft-progress');
  const timeEl     = controls.querySelector('#ft-time');
  const tick = setInterval(() => {
    progress = Math.min(100, progress + 0.05);
    progressEl.style.width = progress + '%';
    if (video.duration !== 'LIVE') {
      const [m, s] = video.duration.split(':').map(Number);
      const total  = m * 60 + s;
      const elapsed = Math.floor(total * progress / 100);
      const em = Math.floor(elapsed / 60);
      const es = elapsed % 60;
      timeEl.textContent = `${em}:${String(es).padStart(2,'0')} / ${video.duration}`;
    }
  }, 300);

  // Info
  const info = document.createElement('div');
  info.style.cssText = 'margin-top:12px;';
  info.innerHTML = `
    <h2 style="font-size:18px;font-weight:500;margin-bottom:8px;">${escHtml(video.title)}</h2>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <div style="font-size:13px;color:#aaa;">${video.channel} · <span style="color:#fff;">${video.views} views</span> · ${video.age}</div>
      <div style="flex:1;"></div>
      <button style="padding:7px 16px;background:#272727;border:none;border-radius:20px;color:#fff;font-size:12px;cursor:pointer;font-family:inherit;">👍 Like</button>
      <button style="padding:7px 16px;background:#272727;border:none;border-radius:20px;color:#fff;font-size:12px;cursor:pointer;font-family:inherit;">🔗 Share</button>
    </div>
    <div style="background:#272727;border-radius:8px;padding:12px;font-size:13px;color:#ccc;line-height:1.6;">
      ${escHtml(video.desc)}
    </div>`;
  main.appendChild(info);

  // Comments
  const comments = document.createElement('div');
  comments.style.cssText = 'margin-top:16px;';
  const COMMENT_DATA = [
    { user: '🐦 pigeon_witness', text: 'The pigeon in this video is NOT me. I have an alibi.', likes: '14.2k' },
    { user: '🪱 WormMagnate',    text: 'As a worm scientist I can confirm this is accurate.', likes: '8.9k'  },
    { user: '😐 NormalGary',     text: 'I watched this. It was a video.', likes: '1'       },
    { user: '🏠 HouseHaverJim',  text: 'my house did the same thing but with the ENTIRE FOUNDATION please reply', likes: '44.1k' },
    { user: '🧱 DrywallFan',     text: 'Structural concern noted. Adding to my watch list. Stay safe.', likes: '2.2k' },
  ];
  comments.innerHTML = `<div style="font-size:15px;font-weight:500;margin-bottom:12px;">${COMMENT_DATA.length * 1847 + 203} Comments</div>`;
  COMMENT_DATA.forEach(c => {
    const cd = document.createElement('div');
    cd.style.cssText = 'display:flex;gap:10px;margin-bottom:14px;';
    cd.innerHTML = `
      <div style="font-size:24px;">${c.user.split(' ')[0]}</div>
      <div>
        <div style="font-size:13px;font-weight:500;margin-bottom:2px;">${escHtml(c.user.slice(c.user.indexOf(' ')+1))}</div>
        <div style="font-size:13px;color:#ccc;line-height:1.5;">${escHtml(c.text)}</div>
        <div style="font-size:12px;color:#888;margin-top:4px;">👍 ${c.likes}</div>
      </div>`;
    comments.appendChild(cd);
  });
  main.appendChild(comments);

  layout.appendChild(main);

  // ── Sidebar ──────────────────────────────────────────────────────────────────
  const sidebar = document.createElement('div');
  sidebar.style.cssText = 'width:280px;flex-shrink:0;';
  sidebar.innerHTML = '<div style="font-size:14px;font-weight:500;margin-bottom:10px;">Up next</div>';
  VIDEOS.filter(v => v.id !== video.id).slice(0, 5).forEach(v => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;margin-bottom:10px;cursor:pointer;';
    row.onmouseenter = () => row.style.background = '#1a1a1a';
    row.onmouseleave = () => row.style.background = '';
    row.innerHTML = `
      <div style="width:120px;flex-shrink:0;aspect-ratio:16/9;background:${v.thumb};border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:24px;">${v.thumbEmoji}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:12px;line-height:1.4;margin-bottom:3px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escHtml(v.title)}</div>
        <div style="font-size:11px;color:#aaa;">${v.channel}</div>
        <div style="font-size:11px;color:#aaa;">${v.views} views</div>
      </div>`;
    row.addEventListener('click', () => {
      clearInterval(tick);
      cancelAnimationFrame(dvdRaf);
      navigate('www.frogtube.mow?v=' + v.id);
    });
    sidebar.appendChild(row);
  });
  layout.appendChild(sidebar);

  container.appendChild(layout);

  // Clean up DVD bounce when navigating away (observer)
  const observer = new MutationObserver(() => {
    if (!document.contains(playerWrap)) {
      cancelAnimationFrame(dvdRaf);
      clearInterval(tick);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Back button
  const back = document.createElement('button');
  back.style.cssText = 'position:absolute;top:8px;left:8px;padding:5px 12px;background:rgba(0,0,0,0.6);border:1px solid #555;border-radius:4px;color:#fff;font-size:12px;cursor:pointer;font-family:inherit;';
  back.textContent = '← FrogTube';
  back.addEventListener('click', () => {
    cancelAnimationFrame(dvdRaf);
    clearInterval(tick);
    navigate('www.frogtube.mow');
  });
  container.style.position = 'relative';
  container.appendChild(back);
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
