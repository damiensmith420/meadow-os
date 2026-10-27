/**
 * sites/meadowpedia.js — MeadowPedia (parody Wikipedia)
 * Fake encyclopedia with ridiculous articles.
 */

// ── Article database ──────────────────────────────────────────────────────────
const ARTICLES = {
  main: {
    title: 'MeadowPedia — The Free Encyclopedia (Accuracy Not Guaranteed)',
    body: `
      <p><b>MeadowPedia</b> is the world's largest collection of things that sound plausible but probably aren't.
      Founded in 2003 by a man named either Gerald or something else, MeadowPedia has grown to encompass
      over <b>14.7 million articles</b> in more than 312 languages, including three that were invented on a Tuesday.</p>
      <p>Our editorial policy requires that all articles be written with complete confidence regardless of
      whether the author knows anything about the subject.</p>
      <div style="background:#f8f8f0;border:1px solid #e0e0d0;padding:12px;border-radius:4px;margin:16px 0;">
        <b>Featured Article of the Day:</b><br>
        <a class="mp-link" data-article="invisible_sandwich" href="#">The Invisible Sandwich</a> —
        A comprehensive history of the world's most disputed lunch item.
      </div>
      <div style="column-count:2;column-gap:20px;font-size:13px;">
        <div style="margin-bottom:12px;"><b>🧪 Science & Nature</b><br>
          <a class="mp-link" data-article="birds" href="#">Birds</a> ·
          <a class="mp-link" data-article="soup" href="#">Soup</a> ·
          <a class="mp-link" data-article="clouds" href="#">Clouds</a> ·
          <a class="mp-link" data-article="fog" href="#">Fog</a>
        </div>
        <div style="margin-bottom:12px;"><b>🏛️ History & Society</b><br>
          <a class="mp-link" data-article="great_worm_war" href="#">The Great Worm War</a> ·
          <a class="mp-link" data-article="furniture" href="#">Furniture Uprising</a> ·
          <a class="mp-link" data-article="invisible_sandwich" href="#">The Sandwich Incident</a>
        </div>
        <div style="margin-bottom:12px;"><b>🧠 Philosophy & Logic</b><br>
          <a class="mp-link" data-article="shadow" href="#">Shadow Sentience</a> ·
          <a class="mp-link" data-article="soup" href="#">Is Soup Real?</a>
        </div>
      </div>`,
  },
  birds: {
    title: 'Birds — MeadowPedia',
    body: `
      <div style="float:right;margin:0 0 12px 16px;background:#f8f8f0;border:1px solid #e0e0d0;padding:8px;border-radius:4px;font-size:11px;width:200px;">
        <div style="background:#e0e0d0;padding:4px 8px;font-weight:bold;margin:-8px -8px 8px;border-radius:4px 4px 0 0;">Bird</div>
        <div style="text-align:center;font-size:40px;margin:8px 0;">🐦</div>
        <div><b>Classification:</b> Controversial</div>
        <div><b>Origin:</b> 1987 (disputed)</div>
        <div><b>Purpose:</b> Surveillance (alleged)</div>
        <div><b>Feathers:</b> Yes (allegedly)</div>
        <div><b>Government affiliation:</b> Unconfirmed</div>
      </div>
      <p><b>Birds</b> (Latin: <i>aves suspiciosae</i>) are small flying creatures that were either
      evolved over millions of years or invented in 1987 by the United States government as a low-cost
      surveillance alternative to drones. The scientific community officially endorses the evolutionary
      theory, but they would say that, wouldn't they.</p>
      <h3 style="font-size:15px;border-bottom:1px solid #e0e0d0;margin:14px 0 6px;padding-bottom:4px;">History</h3>
      <p>The earliest recorded bird sighting dates to approximately 150 million years ago, though historians
      note that record-keeping was poor at the time and much of the evidence was "eaten by something."
      The modern bird was standardised in the late 1980s after budget constraints forced the government
      to outsource feather procurement.</p>
      <h3 style="font-size:15px;border-bottom:1px solid #e0e0d0;margin:14px 0 6px;padding-bottom:4px;">Behaviour</h3>
      <p>Birds are known to gather on power lines in groups that experts describe as "suspicious,"
      "coordinated," and "definitely not a coincidence." Their songs, once thought to be mating calls,
      are now understood to be encrypted status reports transmitted at 4kHz.</p>
      <div style="clear:both;"></div>`,
  },
  soup: {
    title: 'Soup — MeadowPedia',
    body: `
      <div style="float:right;margin:0 0 12px 16px;background:#f8f8f0;border:1px solid #e0e0d0;padding:8px;border-radius:4px;font-size:11px;width:200px;">
        <div style="background:#e0e0d0;padding:4px 8px;font-weight:bold;margin:-8px -8px 8px;border-radius:4px 4px 0 0;">Soup</div>
        <div style="text-align:center;font-size:40px;margin:8px 0;">🍲</div>
        <div><b>Type:</b> Liquid (probably)</div>
        <div><b>Legal status:</b> Disputed in 14 jurisdictions</div>
        <div><b>Contains food:</b> Sometimes</div>
        <div><b>Is it a meal:</b> Ongoing debate</div>
      </div>
      <p><b>Soup</b> is a liquid or semi-liquid food that has been near other food at some point.
      This definition, while widely accepted by laypeople, has been the subject of 47 pages of
      EU regulatory documents and a 2019 Supreme Court case in the fictional country of Brondovia.</p>
      <h3 style="font-size:15px;border-bottom:1px solid #e0e0d0;margin:14px 0 6px;padding-bottom:4px;">The Central Question</h3>
      <p>The fundamental philosophical problem of soup — <i>Is it real?</i> — was first posed by
      René Descartes in a footnote he later crossed out. He concluded that soup exists only insofar
      as it is warm and someone is watching. Cold soup, by this definition, exists in a state of
      philosophical uncertainty.</p>
      <h3 style="font-size:15px;border-bottom:1px solid #e0e0d0;margin:14px 0 6px;padding-bottom:4px;">Legal Definition</h3>
      <p>In 2019, the European Commission attempted to legally define soup, producing a 312-page
      document that concluded: "soup is a liquid that believes in itself." This was widely considered
      the most expensive document ever produced about a food that costs $3.</p>
      <div style="clear:both;"></div>`,
  },
  clouds: {
    title: 'Clouds — MeadowPedia',
    body: `
      <p><b>Clouds</b> are large accumulations of water vapour that have been hovering overhead since
      at least the Cretaceous period, watching. Scientists classify clouds into three main types:
      Cumulus (honest, dependable), Cirrus (evasive, non-committal, would definitely ghost you),
      and Cumulonimbus (known liar, avoid).</p>
      <h3 style="font-size:15px;border-bottom:1px solid #e0e0d0;margin:14px 0 6px;padding-bottom:4px;">Trustworthiness Scale</h3>
      <p>A 2021 survey of 1,400 respondents asked people to rate cloud types on a trustworthiness
      scale of 1–10. Results: Cumulus: 7.1 · Stratus: 5.4 · Altocumulus: 4.8 · Cirrus: 2.1 ·
      Cumulonimbus: 0.3 · Fog: negative (reclassified as a separate entity, see <a class="mp-link" data-article="fog" href="#">Fog</a>)</p>
      <p>One respondent rated all cloud types as "suspicious" and submitted their answers in red ink.
      Their data was included regardless.</p>`,
  },
  fog: {
    title: 'Fog — MeadowPedia',
    body: `
      <p><b>Fog</b> is what happens when clouds decide to come down and have a look around.
      The scientific community describes fog as "suspended water droplets near the surface."
      The MeadowPedia community describes fog as "a cloud that's acting cagey."</p>
      <h3 style="font-size:15px;border-bottom:1px solid #e0e0d0;margin:14px 0 6px;padding-bottom:4px;">Notable Incidents</h3>
      <p>In 2024, user @fog_investigator on <a class="mp-link" data-article="notabird" href="#">NotABird</a> reported
      that their local fog had "moved without explanation" and was "acting like nothing happened."
      The post received 290,000 chirps. The fog has not commented.</p>
      <p>The city of Trondheim, Norway, filed a formal complaint against fog in 1994. The case was dismissed
      on the grounds that fog does not have legal standing. The fog was present in the courtroom.</p>`,
  },
  shadow: {
    title: 'Shadow Sentience — MeadowPedia',
    body: `
      <p><b>Shadow sentience</b> is the theoretical proposition that shadows possess some form of
      rudimentary awareness. The concept was first published in the <i>Journal of Things That Cannot
      Be Proven Wrong</i> (2022) in a paper titled "Is My Shadow Sentient? A Study."</p>
      <p>The abstract reads: "Maybe." The methodology section reads: "We watched several shadows for
      about 20 minutes." The conclusion reads: "Probably not, but who's really asking."
      The paper was peer-reviewed by three reviewers, two of whom "had concerns" and one of whom
      "had other concerns."</p>
      <h3 style="font-size:15px;border-bottom:1px solid #e0e0d0;margin:14px 0 6px;padding-bottom:4px;">Counterarguments</h3>
      <p>The main counterargument is that shadows are the absence of light rather than a physical
      entity. Proponents of shadow sentience respond to this by leaving the room.</p>`,
  },
  invisible_sandwich: {
    title: 'The Invisible Sandwich — MeadowPedia',
    body: `
      <p>The <b>Invisible Sandwich</b> is either a concept from 1960s conceptual art, a misunderstood
      lunch order, or a government programme depending on which historian you ask, and none of the
      historians agree on anything, including whether there were historians.</p>
      <p>According to sources described in other sources as "reliable," the invisible sandwich first
      appeared in 1962 when avant-garde artist <i>Helmut Grün</i> (possibly fictitious) presented
      a blank plate to a gallery in Vienna and described it as "a sandwich that had achieved
      enlightenment."</p>
      <p>The gallery reportedly sold 14 invisible sandwiches that evening at 50 schillings each.
      At least one buyer attempted to eat theirs. There is no record of what happened.</p>
      <h3 style="font-size:15px;border-bottom:1px solid #e0e0d0;margin:14px 0 6px;padding-bottom:4px;">Legacy</h3>
      <p>The invisible sandwich inspired the 1998 conceptual food movement <i>Cuisine du Néant</i>,
      which argued that the best meal is one that requires no ingredients. Four restaurants opened
      under this philosophy. Three closed immediately. The fourth is still open and has a Michelin star.</p>`,
  },
  great_worm_war: {
    title: 'The Great Worm War of 2003 — MeadowPedia',
    body: `
      <div style="background:#fff8dc;border-left:4px solid #f0c040;padding:10px 14px;margin-bottom:14px;font-size:12px;border-radius:0 4px 4px 0;">
        ⚠️ <b>Neutrality dispute:</b> This article has been flagged for containing too many opinions about worms.
        Please review before forming conclusions.
      </div>
      <p>The <b>Great Worm War of 2003</b> was a brief but emotionally devastating conflict between
      the <i>Garden Earthworm Collective</i> and the <i>Homeowner's Association of Westborough Terrace</i>
      over the disputed territory of Plot 14-B (the flowerbed by the north fence).</p>
      <h3 style="font-size:15px;border-bottom:1px solid #e0e0d0;margin:14px 0 6px;padding-bottom:4px;">Background</h3>
      <p>Tensions had been simmering since 1998, when new topsoil was installed without consulting
      the existing worm population. The worms' formal complaint, submitted via ground vibration,
      went unnoticed. By 2003, the situation had become, according to witnesses, "a lot."</p>
      <h3 style="font-size:15px;border-bottom:1px solid #e0e0d0;margin:14px 0 6px;padding-bottom:4px;">The Conflict</h3>
      <p>The war lasted approximately 11 days and primarily consisted of the worms aerating the lawn
      in an irregular pattern that spelled what historians believe was either "No" or "Go" depending
      on the angle. The Homeowner's Association did not notice.</p>
      <h3 style="font-size:15px;border-bottom:1px solid #e0e0d0;margin:14px 0 6px;padding-bottom:4px;">Aftermath</h3>
      <p>A peace accord was never formally reached. The worms remain in the flowerbed to this day.
      The north fence was painted in 2009. The worms did not comment.</p>`,
  },
  furniture: {
    title: 'The Furniture Uprising (1987–1988) — MeadowPedia',
    body: `
      <div style="background:#fff8dc;border-left:4px solid #f0c040;padding:10px 14px;margin-bottom:14px;font-size:12px;border-radius:0 4px 4px 0;">
        ⚠️ <b>Sources:</b> Historians dispute whether this happened. The furniture does not dispute it.
      </div>
      <p>The <b>Furniture Uprising</b> refers to a disputed period between 1987–1988 during which
      a number of chairs, side tables, and at least one credenza are alleged to have rearranged
      themselves without human intervention.</p>
      <p>The sole documented case occurred in the home of Meredith Holloway of suburban Cork, Ireland,
      who returned home on October 14, 1987 to find her armchair had moved "about three feet to the left"
      and was "facing the window in what I can only describe as a thoughtful posture."</p>
      <p>Holloway's attempts to move the chair back were met with what she described as
      "passive resistance," specifically that it was heavier than she remembered. A subsequent
      investigation by a local reporter concluded: "it's a chair."</p>`,
  },
};

// ── Render ────────────────────────────────────────────────────────────────────
export function render(container, queryString, navigate) {
  const params  = new URLSearchParams(queryString);
  const articleKey = params.get('article') || 'main';
  const article = ARTICLES[articleKey] || ARTICLES['main'];

  container.innerHTML = '';
  container.style.cssText = 'background:#fff;font-family:Georgia,"Times New Roman",serif;color:#202122;font-size:14px;min-height:100%;';

  const page = document.createElement('div');
  page.style.cssText = 'max-width:860px;margin:0 auto;padding:16px;';

  // Header bar
  page.innerHTML = `
    <div style="background:#f8f9fa;border-bottom:1px solid #e0e0d0;margin:-16px -16px 16px;padding:10px 16px;display:flex;align-items:center;gap:12px;font-family:'Trebuchet MS',Tahoma,sans-serif;">
      <span style="font-size:20px;font-weight:bold;color:#2a4d69;">🌿 MeadowPedia</span>
      <span style="color:#888;font-size:11px;">The Free Encyclopedia*</span>
      <div style="flex:1;"></div>
      <input id="mp-search" placeholder="Search MeadowPedia..." style="padding:5px 10px;border:1px solid #c0c0c0;border-radius:3px;font-size:12px;font-family:inherit;width:200px;"/>
      <button id="mp-search-btn" style="padding:5px 12px;background:#f8f9fa;border:1px solid #c0c0c0;border-radius:3px;font-size:12px;cursor:pointer;font-family:inherit;">Search</button>
    </div>
    <div style="display:flex;gap:16px;">
      <div style="width:160px;flex-shrink:0;font-family:'Trebuchet MS',Tahoma,sans-serif;font-size:12px;">
        <div style="font-weight:bold;margin-bottom:6px;color:#54595d;">Contents</div>
        ${Object.keys(ARTICLES).map(k => `
          <div style="margin-bottom:4px;">
            <a class="mp-link" data-article="${k}" href="#" style="color:#3366cc;font-size:12px;">${ARTICLES[k].title.split(' —')[0].slice(0,30)}${ARTICLES[k].title.length > 30 ? '…' : ''}</a>
          </div>`).join('')}
        <hr style="margin:10px 0;border-color:#e0e0d0;"/>
        <div style="color:#555;font-size:10px;line-height:1.6;">* Accuracy not guaranteed. Do not cite in academic work. Or do. We can't stop you.</div>
      </div>
      <div style="flex:1;min-width:0;">
        <h1 style="font-size:22px;font-weight:normal;border-bottom:1px solid #e0e0d0;padding-bottom:6px;margin-bottom:12px;">${escHtml(article.title.split(' —')[0])}</h1>
        <div id="mp-body">${article.body}</div>
        <div style="margin-top:24px;padding-top:12px;border-top:1px solid #e0e0d0;font-size:11px;color:#888;font-family:'Trebuchet MS',Tahoma,sans-serif;">
          This article was last edited 2 minutes ago by an anonymous contributor who "just wanted to help."
          <br>MeadowPedia is not responsible for the accuracy of anything. Quality rating: <b>Stub</b>. Needs more citations.
        </div>
      </div>
    </div>`;

  container.appendChild(page);

  // Wire article links
  container.querySelectorAll('.mp-link').forEach(a => {
    a.style.color = '#3366cc';
    a.style.textDecoration = 'none';
    a.addEventListener('mouseenter', () => a.style.textDecoration = 'underline');
    a.addEventListener('mouseleave', () => a.style.textDecoration = 'none');
    a.addEventListener('click', e => {
      e.preventDefault();
      navigate('www.meadowpedia.mow?article=' + a.dataset.article);
    });
  });

  // Search
  const searchInput = page.querySelector('#mp-search');
  const searchBtn   = page.querySelector('#mp-search-btn');
  const doSearch = () => {
    const q = searchInput.value.trim().toLowerCase().replace(/\s+/g,'_');
    const match = Object.keys(ARTICLES).find(k => k.includes(q) || ARTICLES[k].title.toLowerCase().includes(q));
    if (match) navigate('www.meadowpedia.mow?article=' + match);
    else navigate('www.grassknoll.mow?q=' + encodeURIComponent(searchInput.value));
  };
  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
