/**
 * sites/shoppe.js — The Shoppe (absurd fake e-commerce)
 * Selling things that shouldn't exist.
 */

// ── Product catalog ───────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 'ambient_noise',
    name: 'A Jar of Ambient Noise',
    price: 28.99,
    emoji: '🫙',
    rating: 4.2, reviews: 1847,
    badge: 'BESTSELLER',
    badgeColor: '#e65c00',
    tags: ['ambient', 'audio', 'jar'],
    desc: 'Captured in a mid-range suburban kitchen on a Tuesday at approximately 2pm. Notes of faint dishwasher, distant television, and someone sighing. Sealed in a premium mason jar. Open for instant ambiance.',
    reviews_data: [
      { user: 'GaryM.', stars: 5, text: 'Opened it in my office. Immediately felt like I was somewhere else. Somewhere with a dishwasher.' },
      { user: 'SoundEnthusiast', stars: 4, text: 'Good ambient noise. Slightly more dishwasher than advertised. Four stars.' },
      { user: 'JaniceFromAccounting', stars: 1, text: 'I thought this was a real product. I am still not sure if it is.' },
    ],
  },
  {
    id: 'tangled_headphones',
    name: 'Pre-Tangled Headphones (Mystery Length)',
    price: 14.99,
    emoji: '🎧',
    rating: 3.8, reviews: 4211,
    badge: 'LIMITED',
    badgeColor: '#9b2226',
    tags: ['audio', 'mystery', 'tangled'],
    desc: 'Why waste precious minutes tangling your own headphones? These come pre-tangled in a formation that our lead engineer described as "mathematically elegant" and our QA team described as "a bad omen." Cable length: unknown. Headphones: still in there somewhere.',
    reviews_data: [
      { user: 'AudioMike', stars: 3, text: 'Spent 45 minutes untangling. Actually works now. Probably.' },
      { user: 'ConfusedPurchaser', stars: 5, text: 'Gave it to my nemesis. Perfect.' },
      { user: 'Terrance', stars: 2, text: 'I think there are two pairs in here. I\'m not sure. Something is in here.' },
    ],
  },
  {
    id: 'yesterday_air',
    name: 'A Jar of Yesterday\'s Air (2019 Vintage)',
    price: 44.00,
    emoji: '💨',
    rating: 4.7, reviews: 622,
    badge: 'RARE',
    badgeColor: '#5c4033',
    tags: ['vintage', 'air', 'jar'],
    desc: 'Sourced from a Tuesday afternoon in March 2019. Tasting notes: mild anxiety, a hint of optimism that hadn\'t quite worn off yet, distant lawnmower, faint promise of plans that would be cancelled. Only 4 jars remaining.',
    reviews_data: [
      { user: 'NostalgiaFan', stars: 5, text: 'Smells exactly like 2019. I cried. Worth every penny.' },
      { user: 'AirConnoisseur', stars: 5, text: 'The lawnmower note really comes through. Exceptional vintage.' },
      { user: 'Sceptic', stars: 4, text: 'I opened it. Now it\'s just today\'s air. Still, good experience.' },
    ],
  },
  {
    id: 'invisible_cheese',
    name: 'Blorbshire Blue (Conceptual Cheese)',
    price: 19.99,
    emoji: '🧀',
    rating: 4.1, reviews: 389,
    badge: null,
    badgeColor: null,
    tags: ['cheese', 'conceptual', 'dairy'],
    desc: 'Blorbshire Blue is a cheese that has never existed but should have. We sell a replica. It is mostly foam. The flavour is a card that comes with the package that says "rich, earthy, slight notes of having been worth it." Pairs well with wines that also don\'t exist.',
    reviews_data: [
      { user: 'CheeseMongerBill', stars: 4, text: 'Conceptually delicious. I "ate" the whole card.' },
      { user: 'FoodPhilosopher', stars: 5, text: 'If Blorbshire Blue could exist, it would taste exactly like my imagination of this.' },
    ],
  },
  {
    id: 'confident_currency',
    name: 'One Unit of Confident Currency',
    price: 1.00,
    emoji: '💰',
    rating: 2.4, reviews: 8831,
    badge: 'INVEST NOW',
    badgeColor: '#1a7a1a',
    tags: ['finance', 'currency', 'confidence'],
    desc: 'This currency is backed entirely by confidence. Current exchange rate: 1 ConfidenceCoin = 1 unit of self-belief. Value fluctuates based on how you feel when you wake up. No refunds. No questions. Our whitepaper is a PDF that says "trust us." DM @CryptoFernandez on NotABird for more info.',
    reviews_data: [
      { user: 'InvestorGreg', stars: 1, text: 'Lost it all. Can\'t lose what you never had though, philosophically.' },
      { user: 'BullishMindset', stars: 5, text: 'I feel great about this. That\'s all I have.' },
      { user: 'FinancialAdvisor', stars: 1, text: 'Please do not buy this.' },
    ],
  },
  {
    id: 'socks',
    name: 'Missing Socks (Recovery Kit)',
    price: 9.99,
    emoji: '🧦',
    rating: 4.6, reviews: 12204,
    badge: 'TOP RATED',
    badgeColor: '#1a4a8a',
    tags: ['socks', 'laundry', 'mystery'],
    desc: 'You know the socks. They went in the wash. They did not come out. This kit does not find them — but it includes: a map of probable locations, a philosophical pamphlet titled "letting go," one replacement sock (not a pair), and a small certificate confirming the sock was real.',
    reviews_data: [
      { user: 'LaundryVictim', stars: 5, text: 'The pamphlet helped more than I expected. The map was useless. Five stars.' },
      { user: 'Phil.J.Thornton', stars: 4, text: 'Found one of my socks behind the dryer. Kit had nothing to do with it. Still good kit.' },
    ],
  },
];

// ── Cart state ────────────────────────────────────────────────────────────────
const cart = {};

// ── Render ────────────────────────────────────────────────────────────────────
export function render(container, queryString, navigate) {
  const params     = new URLSearchParams(queryString);
  const productId  = params.get('product');
  const viewCart   = params.get('cart') === '1';

  container.innerHTML = '';
  // Don't overwrite position/inset set by .browser-viewport > * — use an inner scroll wrapper
  container.style.cssText = 'background:#fff;font-family:"Trebuchet MS",Tahoma,sans-serif;color:#1a1a1a;min-height:100%;';

  if (viewCart) {
    renderCart(container, navigate);
  } else if (productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) renderProduct(container, product, navigate);
    else renderHome(container, navigate);
  } else {
    renderHome(container, navigate);
  }
}

function renderHome(container, navigate) {
  // Banner
  const banner = document.createElement('div');
  banner.style.cssText = 'background:linear-gradient(135deg,#1a3a6a,#2a6a2a);color:#fff;padding:24px 24px 20px;margin-bottom:0;';
  banner.innerHTML = `
    <div style="max-width:900px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <div style="font-size:28px;font-weight:900;letter-spacing:-1px;">🛒 The Shoppe</div>
        <div style="font-size:13px;opacity:0.8;margin-top:4px;">Selling things that probably shouldn't exist since 2008.</div>
      </div>
      <button onclick="" style="padding:10px 20px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.4);border-radius:6px;color:#fff;font-size:13px;cursor:pointer;font-family:inherit;"
        id="cart-btn">🛒 Cart (${Object.values(cart).reduce((a,b)=>a+b,0)})</button>
    </div>`;
  container.appendChild(banner);

  // Nav strip
  const nav = document.createElement('div');
  nav.style.cssText = 'background:#f4f4f4;border-bottom:1px solid #e0e0e0;padding:8px 24px;font-size:12px;color:#555;display:flex;gap:16px;';
  nav.innerHTML = ['All Products','Jars of Stuff','Conceptual Food','Investments','Mystery Items','Socks','New Arrivals'].map(c =>
    `<span style="cursor:pointer;" onmouseenter="this.style.color='#1a3a6a'" onmouseleave="this.style.color='#555'">${c}</span>`
  ).join('');
  container.appendChild(nav);

  // Products grid
  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;padding:20px 24px;max-width:1100px;margin:0 auto;';

  PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.style.cssText = 'border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;cursor:pointer;transition:box-shadow 0.15s;';
    card.onmouseenter = () => card.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
    card.onmouseleave = () => card.style.boxShadow = '';

    card.innerHTML = `
      <div style="background:#f8f8f8;height:140px;display:flex;align-items:center;justify-content:center;font-size:60px;position:relative;">
        ${p.thumbEmoji || p.emoji}
        ${p.badge ? `<div style="position:absolute;top:8px;left:8px;background:${p.badgeColor};color:#fff;font-size:10px;font-weight:bold;padding:3px 7px;border-radius:3px;">${p.badge}</div>` : ''}
      </div>
      <div style="padding:12px;">
        <div style="font-size:14px;font-weight:600;margin-bottom:4px;line-height:1.3;">${escHtml(p.name)}</div>
        <div style="font-size:12px;color:#888;margin-bottom:8px;">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5-Math.round(p.rating))} ${p.rating} (${p.reviews.toLocaleString()})</div>
        <div style="font-size:18px;font-weight:bold;color:#1a3a6a;margin-bottom:10px;">$${p.price.toFixed(2)}</div>
        <div style="display:flex;gap:8px;">
          <button class="sp-view" data-id="${p.id}" style="flex:1;padding:8px;background:#1a3a6a;color:#fff;border:none;border-radius:5px;font-size:12px;cursor:pointer;font-family:inherit;">View</button>
          <button class="sp-add" data-id="${p.id}" style="padding:8px 12px;background:#f4f4f4;border:1px solid #ccc;border-radius:5px;font-size:12px;cursor:pointer;font-family:inherit;">🛒 Add</button>
        </div>
      </div>`;

    card.querySelector('.sp-view').addEventListener('click', e => { e.stopPropagation(); navigate('www.shoppe.mow?product=' + p.id); });
    card.querySelector('.sp-add').addEventListener('click', e => {
      e.stopPropagation();
      cart[p.id] = (cart[p.id] || 0) + 1;
      const btn = e.currentTarget;
      btn.textContent = '✓ Added!';
      btn.style.background = '#d4edda';
      setTimeout(() => { btn.textContent = '🛒 Add'; btn.style.background = '#f4f4f4'; }, 1200);
      updateCartBadge();
    });
    card.addEventListener('click', () => navigate('www.shoppe.mow?product=' + p.id));
    grid.appendChild(card);
  });

  container.appendChild(grid);

  // Footer
  const footer = document.createElement('div');
  footer.style.cssText = 'background:#f4f4f4;border-top:1px solid #e0e0e0;padding:16px 24px;font-size:11px;color:#888;text-align:center;';
  footer.innerHTML = `© The Shoppe 2025 · Free shipping on orders over $80 · Returns accepted if the item exists · <a href="#" style="color:#1a3a6a;">Privacy Policy (we have one)</a>`;
  container.appendChild(footer);

  const cartBtn = container.querySelector('#cart-btn');
  cartBtn?.addEventListener('click', () => navigate('www.shoppe.mow?cart=1'));

  function updateCartBadge() {
    if (cartBtn) cartBtn.textContent = `🛒 Cart (${Object.values(cart).reduce((a,b)=>a+b,0)})`;
  }
}

function renderProduct(container, p, navigate) {
  const el = document.createElement('div');
  el.style.cssText = 'max-width:900px;margin:0 auto;padding:20px 24px;';

  // Breadcrumb
  el.innerHTML = `
    <div style="font-size:12px;color:#888;margin-bottom:16px;">
      <a class="sp-home-link" href="#" style="color:#1a3a6a;">The Shoppe</a> › ${escHtml(p.name)}
    </div>
    <div style="display:flex;gap:24px;flex-wrap:wrap;">
      <div style="flex-shrink:0;width:300px;background:#f8f8f8;border:1px solid #e0e0e0;border-radius:8px;height:280px;display:flex;align-items:center;justify-content:center;font-size:100px;">${p.emoji}</div>
      <div style="flex:1;min-width:220px;">
        ${p.badge ? `<div style="display:inline-block;background:${p.badgeColor};color:#fff;font-size:11px;font-weight:bold;padding:3px 8px;border-radius:3px;margin-bottom:8px;">${p.badge}</div>` : ''}
        <h1 style="font-size:20px;font-weight:600;margin-bottom:8px;line-height:1.3;">${escHtml(p.name)}</h1>
        <div style="font-size:13px;color:#888;margin-bottom:12px;">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5-Math.round(p.rating))} <span style="color:#1a3a6a;">${p.rating}</span> · ${p.reviews.toLocaleString()} reviews</div>
        <div style="font-size:26px;font-weight:bold;color:#1a3a6a;margin-bottom:16px;">$${p.price.toFixed(2)}</div>
        <p style="font-size:13px;color:#444;line-height:1.7;margin-bottom:20px;">${escHtml(p.desc)}</p>
        <div style="display:flex;gap:10px;">
          <button id="sp-add-btn" style="padding:12px 28px;background:#f0a500;border:none;border-radius:6px;font-size:14px;font-weight:bold;cursor:pointer;font-family:inherit;">Add to Cart</button>
          <button style="padding:12px 28px;background:#1a3a6a;color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:bold;cursor:pointer;font-family:inherit;">Buy Now</button>
        </div>
        <div style="margin-top:12px;font-size:11px;color:#888;">
          🚚 Free shipping on orders over $80 · 📦 Ships in 3–5 business days (or never, for conceptual products)
        </div>
      </div>
    </div>
    <hr style="margin:24px 0;border-color:#e0e0e0;"/>
    <h2 style="font-size:16px;margin-bottom:12px;">Customer Reviews</h2>`;

  p.reviews_data.forEach(r => {
    const rd = document.createElement('div');
    rd.style.cssText = 'border-bottom:1px solid #f0f0f0;padding:12px 0;';
    rd.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
        <b style="font-size:13px;">${escHtml(r.user)}</b>
        <span style="color:#f0a500;font-size:13px;">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</span>
      </div>
      <p style="font-size:13px;color:#444;line-height:1.6;">${escHtml(r.text)}</p>`;
    el.appendChild(rd);
  });

  container.appendChild(el);

  el.querySelector('.sp-home-link').addEventListener('click', e => { e.preventDefault(); navigate('www.shoppe.mow'); });

  const addBtn = el.querySelector('#sp-add-btn');
  addBtn.addEventListener('click', () => {
    cart[p.id] = (cart[p.id] || 0) + 1;
    addBtn.textContent = '✓ Added to Cart!';
    addBtn.style.background = '#4caf50';
    addBtn.style.color = '#fff';
    setTimeout(() => { addBtn.textContent = 'Add to Cart'; addBtn.style.background = '#f0a500'; addBtn.style.color = ''; }, 1500);
  });
}

function renderCart(container, navigate) {
  const el = document.createElement('div');
  el.style.cssText = 'max-width:700px;margin:0 auto;padding:24px;';
  el.innerHTML = `<h1 style="font-size:22px;margin-bottom:16px;">🛒 Your Cart</h1>`;

  const items = Object.entries(cart).filter(([,q]) => q > 0);

  if (items.length === 0) {
    el.innerHTML += `<div style="padding:40px;text-align:center;color:#888;font-size:15px;">
      Your cart is empty.<br><br>
      <a href="#" id="sp-shop-link" style="color:#1a3a6a;">← Keep shopping</a>
    </div>`;
  } else {
    let total = 0;
    items.forEach(([id, qty]) => {
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return;
      total += p.price * qty;
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #eee;';
      row.innerHTML = `
        <div style="font-size:36px;">${p.emoji}</div>
        <div style="flex:1;">
          <div style="font-size:14px;font-weight:600;">${escHtml(p.name)}</div>
          <div style="font-size:13px;color:#888;">Qty: ${qty} × $${p.price.toFixed(2)}</div>
        </div>
        <div style="font-size:16px;font-weight:bold;">$${(p.price * qty).toFixed(2)}</div>`;
      el.appendChild(row);
    });
    el.innerHTML += `
      <div style="text-align:right;margin-top:16px;">
        <div style="font-size:18px;font-weight:bold;">Total: $${total.toFixed(2)}</div>
        <div style="font-size:11px;color:#888;margin-bottom:16px;">+ shipping (calculated at checkout) + philosophical overhead</div>
        <button style="padding:12px 32px;background:#f0a500;border:none;border-radius:6px;font-size:15px;font-weight:bold;cursor:pointer;font-family:inherit;"
          onclick="this.textContent='Processing...';setTimeout(()=>{this.textContent='✓ Order Placed! (Probably)';this.style.background='#4caf50';this.style.color='#fff';},1200)">
          Proceed to Checkout
        </button>
      </div>`;
  }

  container.appendChild(el);
  const shopLink = container.querySelector('#sp-shop-link');
  shopLink?.addEventListener('click', e => { e.preventDefault(); navigate('www.shoppe.mow'); });
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
