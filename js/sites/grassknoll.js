/**
 * sites/grassknoll.js — Grass Knoll (parody Google)
 * Search bar that returns hilariously wrong results for anything you type.
 */

// ── Result database ───────────────────────────────────────────────────────────
const RESULTS = [
  {
    title: 'Why do birds exist? (a philosophical deep dive)',
    url: 'www.meadowpedia.mow/birds',
    snippet: 'Birds were invented in 1987 by the United States government as a low-cost alternative to drones. This article explores the evidence, the lies, and the worms.',
  },
  {
    title: 'You\'re probably thinking about socks wrong',
    url: 'www.doomscroll.mow',
    snippet: 'A groundbreaking 14-part series on the hidden ideology baked into hosiery. Over 40 million socks go missing every year. Where do they go? Nobody knows.',
  },
  {
    title: 'Top 10 cheeses that have never existed',
    url: 'www.shoppe.mow/cheese',
    snippet: 'From Blorbshire Blue to Quantum Brie, our definitive guide to cheeses your grandparents definitely lied about eating. Buy replicas in our store.',
  },
  {
    title: 'My neighbour is a cloud — a memoir',
    url: 'www.meadowpedia.mow/clouds',
    snippet: 'Published 2019. Five stars. "Changed how I think about precipitation." — definitely real reviewer on a real website.',
  },
  {
    title: 'This rock has been staring at me for three weeks [SOLVED]',
    url: 'www.doomscroll.mow',
    snippet: 'I placed a camera. I have footage. I am not going to share the footage. The comments are unhinged. Page views: 4.2 million.',
  },
  {
    title: 'FrogTube: Man explains gravity to a cat for 47 minutes',
    url: 'www.frogtube.mow',
    snippet: 'The cat never learns. 18.7M views. Uploaded by @gravity_explainer. Rated 98% likes. Runtime: 47:03. The man has not given up.',
  },
  {
    title: 'Is my shadow sentient? A study (peer reviewed)',
    url: 'www.meadowpedia.mow/shadow',
    snippet: 'Published in the Journal of Things That Cannot Be Proven Wrong. Abstract: maybe. Conclusion: probably not, but who\'s really asking.',
  },
  {
    title: 'Buy a jar of yesterday\'s air — only 4 left!',
    url: 'www.shoppe.mow',
    snippet: 'Vintage 2019 atmosphere. Lightly used. Slight notes of anxiety and distant lawnmower. Free shipping on orders over $80.',
  },
  {
    title: 'NotABird: @WormMagnate posts cryptic thread about the moon',
    url: 'www.notabird.mow',
    snippet: '"The moon is simply the sun but polite." 142k re-chirps. Follow for more lunar discourse. 3 day old thread still going.',
  },
  {
    title: 'What is soup, really',
    url: 'www.meadowpedia.mow/soup',
    snippet: 'Soup is technically any liquid that has been near food. Legal definition varies. The EU has 47 pages of regulations. We summarise them badly.',
  },
  {
    title: 'I tried to return a Tuesday. Here\'s what happened.',
    url: 'www.doomscroll.mow',
    snippet: 'Spoiler: the store did not accept it. The manager was surprisingly understanding. My lawyer says I cannot share further details.',
  },
  {
    title: 'FrogTube: Competitive speed-sitting — 2024 World Finals',
    url: 'www.frogtube.mow',
    snippet: 'The sport of sitting very quickly. 8 nations compete. Germany wins again. The Belgian team protest but no one can define "unfair sitting".',
  },
  {
    title: 'Unsubstantiated list of things that are suspicious',
    url: 'www.doomscroll.mow',
    snippet: 'Traffic cones. The number 7. Geese. All bridges built before 1994. Bread that lasts more than 3 days. The concept of "continental breakfast".',
  },
  {
    title: 'How to win an argument with furniture',
    url: 'www.meadowpedia.mow/furniture',
    snippet: 'Spoiler: you cannot. But this guide will help you feel better about it. Comes with a free wallpaper of an armchair looking smug.',
  },
  {
    title: 'Shoppe: Pre-tangled headphones (mystery length)',
    url: 'www.shoppe.mow',
    snippet: 'Why waste time tangling them yourself? Comes pre-tangled in a shape scientists describe as "mathematically impossible". Same day despair.',
  },
  {
    title: 'The pigeon was there before I arrived. It left after I left.',
    url: 'www.notabird.mow/@pigeon_witness',
    snippet: 'Original post by @pigeon_witness, 11:32 AM. 94k chirps. "Bro is being followed by a pigeon consultant." 🐦 3.4k re-chirps.',
  },
  {
    title: 'MeadowPedia: History of the Invisible Sandwich',
    url: 'www.meadowpedia.mow/invisible_sandwich',
    snippet: 'The invisible sandwich first appeared in 1962 according to sources that do not exist. Disputed by four historians who also may not exist.',
  },
  {
    title: 'Ranking every cloud by trustworthiness',
    url: 'www.doomscroll.mow',
    snippet: 'Cumulus: 7/10 (reliable, consistent). Cirrus: 3/10 (wispy, evasive, won\'t commit). Cumulonimbus: 0/10 (known liar). Full list inside.',
  },
];

const QUIRKY_NO_RESULTS = [
  'Grass Knoll found 0 results, but don\'t worry — we also have no idea what you\'re looking for.',
  'No results found. Have you considered that the thing you searched for simply doesn\'t exist?',
  'Your search returned nothing. This is probably fine.',
  'We looked everywhere. Not there, either. Try being more vague.',
  '0 results. We did find some old receipts and a photo of a dog, but nothing relevant.',
];

// ── Render ────────────────────────────────────────────────────────────────────
export function render(container, queryString, navigate) {
  const params  = new URLSearchParams(queryString);
  const query   = params.get('q') || '';

  container.innerHTML = '';
  container.style.cssText = 'background:#fff;font-family:"Trebuchet MS",Tahoma,sans-serif;min-height:100%;';

  if (!query) {
    renderHomepage(container, navigate);
  } else {
    renderResults(container, query, navigate);
  }
}

function renderHomepage(container, navigate) {
  const el = document.createElement('div');
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100%;padding:40px 20px;';
  el.innerHTML = `
    <div style="margin-bottom:8px;font-size:52px;font-weight:900;letter-spacing:-2px;">
      <span style="color:#4285f4">G</span><span style="color:#ea4335">r</span><span style="color:#fbbc05">a</span><span style="color:#4285f4">s</span><span style="color:#34a853">s</span>
      <span style="color:#ea4335">K</span><span style="color:#4285f4">n</span><span style="color:#fbbc05">o</span><span style="color:#34a853">l</span><span style="color:#ea4335">l</span>
    </div>
    <p style="color:#666;font-size:12px;margin-bottom:28px;">The web's most confidently wrong search engine.</p>
    <div style="display:flex;gap:8px;width:100%;max-width:500px;margin-bottom:20px;">
      <input id="gk-input" type="text" placeholder="Search, or don't. We'll judge either way."
        style="flex:1;padding:10px 16px;border:1px solid #ddd;border-radius:24px;font-size:14px;outline:none;font-family:inherit;"
        autocomplete="off" spellcheck="false"/>
      <button id="gk-btn" style="padding:10px 20px;background:#4285f4;color:#fff;border-radius:24px;font-size:13px;border:none;cursor:pointer;font-family:inherit;">Search</button>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;font-size:12px;color:#4285f4;max-width:600px;">
      ${['why do birds', 'is soup real', 'my shadow', 'sock theory', 'suspicious rocks', 'invisible sandwich', 'cloud trust'].map(s =>
        `<span class="gk-suggest" data-q="${s}" style="cursor:pointer;padding:4px 10px;border:1px solid #ddd;border-radius:12px;color:#444;">${s}</span>`
      ).join('')}
    </div>
    <div style="margin-top:40px;font-size:11px;color:#aaa;">Grass Knoll Search v6.1.4 · Not responsible for anything you find · Results are 100% made up</div>`;

  container.appendChild(el);

  const input = el.querySelector('#gk-input');
  const btn   = el.querySelector('#gk-btn');
  const doSearch = () => {
    const q = input.value.trim();
    if (q) navigate('www.grassknoll.mow?q=' + encodeURIComponent(q));
  };
  btn.addEventListener('click', doSearch);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  el.querySelectorAll('.gk-suggest').forEach(s => {
    s.addEventListener('mouseenter', () => s.style.background = '#f0f4ff');
    s.addEventListener('mouseleave', () => s.style.background = '');
    s.addEventListener('click', () => navigate('www.grassknoll.mow?q=' + encodeURIComponent(s.dataset.q)));
  });
}

function renderResults(container, query, navigate) {
  // Seed from query for consistent but varied picks
  const seed  = [...query].reduce((a, c) => a + c.charCodeAt(0), 0);
  const count = 4 + (seed % 5); // 4–8 results
  const shuffled = [...RESULTS].sort((a, b) => ((seed * 9301 + a.title.length * 49297) % 233280) - ((seed * 9301 + b.title.length * 49301) % 233280));
  const hits  = shuffled.slice(0, count);

  const el = document.createElement('div');
  el.style.cssText = 'padding:16px 24px;max-width:760px;';

  // Mini header bar
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #eee;">
      <span style="font-size:22px;font-weight:900;letter-spacing:-1px;">
        <span style="color:#4285f4">G</span><span style="color:#ea4335">r</span><span style="color:#fbbc05">a</span><span style="color:#4285f4">s</span><span style="color:#34a853">s</span>
        <span style="color:#ea4335">K</span><span style="color:#4285f4">n</span><span style="color:#fbbc05">o</span><span style="color:#34a853">l</span><span style="color:#ea4335">l</span>
      </span>
      <div style="flex:1;display:flex;gap:8px;">
        <input id="gk-input2" type="text" value="${escHtml(query)}"
          style="flex:1;padding:8px 16px;border:1px solid #ddd;border-radius:20px;font-size:13px;font-family:inherit;"
          autocomplete="off"/>
        <button id="gk-btn2" style="padding:8px 16px;background:#4285f4;color:#fff;border-radius:20px;font-size:12px;border:none;cursor:pointer;font-family:inherit;">Search</button>
      </div>
    </div>
    <div style="font-size:12px;color:#777;margin-bottom:16px;">
      About <b>${Math.floor(Math.random() * 800 + 200) * 1000000}</b> results
      (${(Math.random() * 0.6 + 0.1).toFixed(2)} seconds) ·
      <span style="color:#888;font-style:italic;">Results are entirely fabricated</span>
    </div>`;

  hits.forEach(r => {
    const div = document.createElement('div');
    div.style.cssText = 'margin-bottom:22px;';
    div.innerHTML = `
      <div style="font-size:12px;color:#1a6040;margin-bottom:2px;">${escHtml(r.url)}</div>
      <a class="gk-result-link" data-url="${escHtml(r.url)}" href="#"
        style="font-size:17px;color:#1a0dab;text-decoration:none;font-weight:400;cursor:pointer;"
        >${escHtml(r.title)}</a>
      <p style="font-size:13px;color:#545454;margin-top:4px;line-height:1.5;">${escHtml(r.snippet)}</p>`;
    el.appendChild(div);
  });

  // Sometimes add a "People also ask" box
  if (seed % 3 !== 0) {
    const paa = document.createElement('div');
    paa.style.cssText = 'border:1px solid #eee;border-radius:8px;padding:12px;margin-top:8px;font-size:13px;';
    paa.innerHTML = `<div style="font-weight:bold;margin-bottom:8px;color:#1a1a1a;">People also ask</div>`;
    const questions = [
      'Is this real?', 'Should I be worried?', 'Does anyone know?',
      'What even is this?', 'Can I return it?', 'Is it alive?', 'Was it always like this?',
    ];
    const qs = questions.sort(() => Math.random() - 0.5).slice(0, 3);
    qs.forEach(q => {
      const row = document.createElement('div');
      row.style.cssText = 'padding:8px 0;border-top:1px solid #f0f0f0;color:#1a0dab;cursor:pointer;';
      row.textContent = q + '  ▾';
      row.addEventListener('click', () => {
        row.nextSibling && row.nextSibling.remove();
        const ans = document.createElement('div');
        ans.style.cssText = 'font-size:12px;color:#444;padding:6px 0 4px;line-height:1.5;';
        ans.textContent = 'This question has been reviewed by our editorial team, who concluded: probably.';
        row.after(ans);
      });
      paa.appendChild(row);
    });
    el.appendChild(paa);
  }

  container.appendChild(el);

  const input2 = el.querySelector('#gk-input2');
  const btn2   = el.querySelector('#gk-btn2');
  const doSearch = () => {
    const q = input2.value.trim();
    if (q) navigate('www.grassknoll.mow?q=' + encodeURIComponent(q));
  };
  btn2.addEventListener('click', doSearch);
  input2.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

  el.querySelectorAll('.gk-result-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigate(a.dataset.url);
    });
  });
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
