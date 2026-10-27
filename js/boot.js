/**
 * boot.js — Login screen → cinematic intro → desktop
 *
 * Flow:
 *  1. Login screen (pre-filled username/password, press Log In)
 *  2. "Authenticating…" shimmer on the password field
 *  3. Full-screen cinematic intro: particle burst → logo reveal → tagline → fade out
 *  4. Desktop appears
 */

// ── Login screen ──────────────────────────────────────────────────────────────

/**
 * Show the login screen and resolve when the user clicks Log In.
 * @returns {Promise<void>}
 */
export function showLogin() {
  return new Promise(resolve => {
    const screen = document.getElementById('login-screen');
    screen.classList.remove('hidden');
    screen.innerHTML = _buildLoginHTML();

    const btn      = screen.querySelector('#login-submit');
    const passWrap = screen.querySelector('#pass-wrap');
    const hint     = screen.querySelector('#login-hint');

    // Animate the password dots in after a short delay for polish
    setTimeout(() => {
      const dots = screen.querySelector('#pass-dots');
      if (dots) dots.style.opacity = '1';
    }, 400);

    // Show hint pulse after 1.5 s
    setTimeout(() => {
      if (hint) hint.classList.add('visible');
    }, 1500);

    btn.addEventListener('click', () => _doLogin(screen, passWrap, resolve));
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter') _doLogin(screen, passWrap, resolve);
    });

    // Enter on the whole screen also works
    screen.addEventListener('keydown', e => {
      if (e.key === 'Enter') _doLogin(screen, passWrap, resolve);
    });
  });
}

function _doLogin(screen, passWrap, resolve) {
  // Already animating
  if (screen.dataset.logging) return;
  screen.dataset.logging = '1';

  const btn = screen.querySelector('#login-submit');
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  // Shimmer on password bar
  passWrap.classList.add('auth-shimmer');

  setTimeout(() => {
    screen.classList.add('login-fadeout');
    setTimeout(() => {
      screen.classList.add('hidden');
      screen.innerHTML = '';
      resolve();
    }, 700);
  }, 1100);
}

function _buildLoginHTML() {
  return `
    <div class="login-panel" role="main" aria-label="Login">
      <div class="login-meadow-logo" aria-hidden="true">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <defs>
            <radialGradient id="lg1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#5ad65a"/>
              <stop offset="100%" stop-color="#1a7a1a"/>
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="34" fill="url(#lg1)" stroke="#0f4f0f" stroke-width="2"/>
          <ellipse cx="36" cy="19" rx="7" ry="12" fill="#90e840" transform="rotate(0 36 36)"/>
          <ellipse cx="36" cy="19" rx="7" ry="12" fill="#90e840" transform="rotate(60 36 36)"/>
          <ellipse cx="36" cy="19" rx="7" ry="12" fill="#90e840" transform="rotate(120 36 36)"/>
          <ellipse cx="36" cy="19" rx="7" ry="12" fill="#90e840" transform="rotate(180 36 36)"/>
          <ellipse cx="36" cy="19" rx="7" ry="12" fill="#90e840" transform="rotate(240 36 36)"/>
          <ellipse cx="36" cy="19" rx="7" ry="12" fill="#90e840" transform="rotate(300 36 36)"/>
          <circle cx="36" cy="36" r="10" fill="#ffe040"/>
        </svg>
      </div>
      <div class="login-os-name">Meadow OS</div>
      <div class="login-user-row" aria-label="User account">
        <div class="login-avatar" aria-hidden="true">
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="25" fill="#2a5a9a" stroke="#1a3a7a" stroke-width="1.5"/>
            <circle cx="26" cy="19" r="10" fill="#6aa8e8"/>
            <path d="M6 50 Q6 34 26 34 Q46 34 46 50" fill="#6aa8e8"/>
          </svg>
        </div>
        <div class="login-user-info">
          <div class="login-username" id="login-username">damiensmith420</div>
          <div class="login-user-label">Local Account</div>
        </div>
      </div>
      <div class="login-field-group">
        <div class="login-field">
          <label class="login-label">Username</label>
          <input class="login-input" type="text" value="damiensmith420" readonly aria-label="Username" />
        </div>
        <div class="login-field">
          <label class="login-label">Password</label>
          <div class="login-pass-wrap" id="pass-wrap">
            <span class="login-pass-dots" id="pass-dots" aria-hidden="true">••••••••••••</span>
            <input class="login-input login-pass-real" type="password" value="meadow2025" readonly aria-label="Password" tabindex="-1"/>
          </div>
        </div>
      </div>
      <button class="login-submit-btn" id="login-submit" aria-label="Log in">
        Log In  →
      </button>
      <div class="login-hint" id="login-hint" aria-live="polite">Press Log In or hit Enter to continue</div>
    </div>
    <div class="login-bg-orbs" aria-hidden="true">
      <div class="orb orb1"></div>
      <div class="orb orb2"></div>
      <div class="orb orb3"></div>
    </div>`;
}

// ── Cinematic intro ───────────────────────────────────────────────────────────

/**
 * Play the cinematic intro animation, then call onDone.
 * @param {function} onDone
 */
export function runIntro(onDone) {
  const overlay = document.createElement('div');
  overlay.id = 'intro-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <canvas id="intro-canvas"></canvas>
    <div class="intro-content">
      <div class="intro-logo-wrap" id="intro-logo">
        <svg width="90" height="90" viewBox="0 0 90 90">
          <defs>
            <radialGradient id="ig1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#6adf6a"/>
              <stop offset="100%" stop-color="#1a7a1a"/>
            </radialGradient>
          </defs>
          <circle cx="45" cy="45" r="42" fill="url(#ig1)" stroke="#0f4f0f" stroke-width="2"/>
          <ellipse cx="45" cy="24" rx="9" ry="15" fill="#a0f060" transform="rotate(0 45 45)"/>
          <ellipse cx="45" cy="24" rx="9" ry="15" fill="#a0f060" transform="rotate(60 45 45)"/>
          <ellipse cx="45" cy="24" rx="9" ry="15" fill="#a0f060" transform="rotate(120 45 45)"/>
          <ellipse cx="45" cy="24" rx="9" ry="15" fill="#a0f060" transform="rotate(180 45 45)"/>
          <ellipse cx="45" cy="24" rx="9" ry="15" fill="#a0f060" transform="rotate(240 45 45)"/>
          <ellipse cx="45" cy="24" rx="9" ry="15" fill="#a0f060" transform="rotate(300 45 45)"/>
          <circle cx="45" cy="45" r="13" fill="#ffe040"/>
        </svg>
      </div>
      <div class="intro-title" id="intro-title">Meadow OS</div>
      <div class="intro-tagline" id="intro-tagline">Personal Downloads Hub</div>
      <div class="intro-user" id="intro-user">Welcome, damiensmith420</div>
    </div>`;
  document.body.appendChild(overlay);

  const canvas = document.getElementById('intro-canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  // --- Particle burst ---
  const particles = _spawnParticles(canvas.width, canvas.height);
  let frame = 0;
  let animId;

  const logo    = document.getElementById('intro-logo');
  const title   = document.getElementById('intro-title');
  const tagline = document.getElementById('intro-tagline');
  const user    = document.getElementById('intro-user');

  // Timeline (ms)
  const T = {
    particleStart: 0,
    logoIn:        500,
    titleIn:       900,
    taglineIn:     1300,
    userIn:        1700,
    holdEnd:       2800,
    fadeStart:     3000,
    done:          3700,
  };

  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    frame++;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update + draw particles
    _drawParticles(ctx, particles, elapsed);

    // CSS class reveals on timeline
    if (elapsed >= T.logoIn    && !logo.classList.contains('in'))    logo.classList.add('in');
    if (elapsed >= T.titleIn   && !title.classList.contains('in'))   title.classList.add('in');
    if (elapsed >= T.taglineIn && !tagline.classList.contains('in')) tagline.classList.add('in');
    if (elapsed >= T.userIn    && !user.classList.contains('in'))    user.classList.add('in');

    if (elapsed >= T.fadeStart && !overlay.classList.contains('intro-fading')) {
      overlay.classList.add('intro-fading');
    }

    if (elapsed >= T.done) {
      cancelAnimationFrame(animId);
      overlay.remove();
      onDone();
      return;
    }

    animId = requestAnimationFrame(tick);
  }

  animId = requestAnimationFrame(tick);
}

// ── Particle system ───────────────────────────────────────────────────────────

function _spawnParticles(w, h) {
  const cx = w / 2, cy = h / 2;
  const count = 120;
  const particles = [];
  const colours = ['#60e060','#a0f040','#ffe040','#4ab8f8','#ffffff','#80ff80'];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 4;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 4,
      colour: colours[Math.floor(Math.random() * colours.length)],
      life: 0.8 + Math.random() * 0.2,
      decay: 0.008 + Math.random() * 0.012,
      alpha: 1,
    });
  }
  return particles;
}

function _drawParticles(ctx, particles, elapsed) {
  const t = elapsed / 1000;
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.alpha = Math.max(0, p.life - t * p.decay * 60);
    if (p.alpha <= 0) return;
    ctx.globalAlpha = p.alpha * 0.85;
    ctx.fillStyle = p.colour;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function isFirstVisit() {
  try { return !localStorage.getItem('meadow-os-visited'); } catch { return true; }
}

export function markVisited() {
  try { localStorage.setItem('meadow-os-visited', '1'); } catch {}
}
