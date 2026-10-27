/**
 * breakout.js — Built-in Breakout game
 * Paddle + ball, randomised brick layouts each round, lives system.
 */

import { createWindow } from './windows.js';

const COLS   = 28;        // canvas columns in brick units
const ROWS   = 20;        // canvas rows in brick units
const CELL   = 18;        // px per unit
const W      = COLS * CELL;
const H      = ROWS * CELL;

const BRICK_COLS   = 12;
const BRICK_ROWS   = 6;
const BRICK_W      = Math.floor(W / BRICK_COLS);
const BRICK_H      = 14;
const BRICK_PAD    = 3;
const BRICK_OFFSET = 28;  // y offset from top

const PADDLE_W = 80;
const PADDLE_H = 10;
const BALL_R   = 7;
const INIT_SPEED = 4.2;

// Hue palette per brick row
const ROW_COLORS = ['#f84040','#f87030','#f8d040','#40d840','#40a8f8','#b040f8'];

export function openBreakout() {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;background:#0a0a12;height:100%;padding:8px;gap:8px;`;

  const scoreBar = document.createElement('div');
  scoreBar.style.cssText = 'color:#a0a0ff;font-family:monospace;font-size:13px;width:100%;display:flex;justify-content:space-between;';
  scoreBar.innerHTML = `
    <span>🧱 Breakout</span>
    <span id="bo-score">Score: 0</span>
    <span id="bo-lives">♥♥♥</span>
    <span id="bo-state">Press Enter to start</span>`;
  wrapper.appendChild(scoreBar);

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  canvas.style.cssText = `border:2px solid #2a2a5a;display:block;`;
  canvas.setAttribute('tabindex', '0');
  canvas.setAttribute('aria-label', 'Breakout game. Move mouse or use arrow keys to control paddle.');
  wrapper.appendChild(canvas);

  const hint = document.createElement('div');
  hint.style.cssText = 'color:#30305a;font-family:monospace;font-size:11px;';
  hint.textContent = 'Mouse or ← → to move paddle · Enter/Space to launch ball';
  wrapper.appendChild(hint);

  createWindow({
    id: 'game-breakout',
    title: 'Breakout',
    icon: 'breakout',
    width: W + 40,
    height: H + 110,
    resizable: false,
    content: wrapper,
  });

  setTimeout(() => canvas.focus(), 100);
  startBreakout(canvas, scoreBar);
}

// ── Core game logic ───────────────────────────────────────────────────────────

function startBreakout(canvas, scoreBar) {
  const ctx = canvas.getContext('2d');
  let paddle, ball, bricks, score, lives, round, state, raf;

  // ── Init / reset ─────────────────────────────────────────────────────────

  function init(keepScore = false) {
    paddle = { x: W / 2 - PADDLE_W / 2, y: H - 30, w: PADDLE_W, h: PADDLE_H };
    resetBall();
    bricks = generateBricks(round);
    if (!keepScore) { score = 0; lives = 3; round = 1; }
    state = 'idle';
    updateHUD();
    draw();
  }

  function resetBall() {
    ball = {
      x: W / 2,
      y: H - 60,
      vx: (Math.random() < 0.5 ? 1 : -1) * INIT_SPEED * 0.7,
      vy: -INIT_SPEED,
      attached: true,   // sits on paddle before launch
    };
  }

  // ── Brick generation (random pattern each round) ──────────────────────────

  function generateBricks(roundNum) {
    const brickSet = [];
    // More bricks / denser as rounds increase
    const density = Math.min(0.55 + roundNum * 0.07, 1.0);
    // Random pattern seed affects which bricks are present
    const patternSeed = Math.random();

    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        // Each round uses a different random shape:
        //  pattern 0: checkerboard holes
        //  pattern 1: random scatter
        //  pattern 2: diamond / wave cutout
        const pattern = Math.floor(patternSeed * 3);
        let include = true;

        if (pattern === 0) {
          // checkerboard with random offset
          const shift = roundNum % 2;
          include = (r + c + shift) % 2 === 0 || Math.random() < density - 0.3;
        } else if (pattern === 1) {
          include = Math.random() < density;
        } else {
          // wave: sine curve cuts a channel through the grid
          const mid = BRICK_ROWS / 2;
          const wave = Math.sin((c / BRICK_COLS) * Math.PI * (1 + roundNum % 3)) * 1.5;
          include = Math.abs(r - mid - wave) > 0.8 || Math.random() < density - 0.25;
        }

        if (!include) continue;

        // Harder bricks (need 2 hits) start appearing round 3+
        const maxHp = roundNum >= 3 ? (Math.random() < 0.25 ? 2 : 1) : 1;

        brickSet.push({
          c, r,
          x: c * BRICK_W + BRICK_PAD,
          y: BRICK_OFFSET + r * (BRICK_H + BRICK_PAD),
          w: BRICK_W - BRICK_PAD * 2,
          h: BRICK_H,
          hp: maxHp,
          maxHp,
          color: ROW_COLORS[r % ROW_COLORS.length],
        });
      }
    }
    return brickSet;
  }

  // ── HUD ───────────────────────────────────────────────────────────────────

  function updateHUD() {
    scoreBar.querySelector('#bo-score').textContent = `Score: ${score}`;
    scoreBar.querySelector('#bo-lives').textContent = '♥'.repeat(lives) + '♡'.repeat(Math.max(0, 3 - lives));
    const st = scoreBar.querySelector('#bo-state');
    if      (state === 'idle')    st.textContent = 'Press Enter to launch';
    else if (state === 'dead')    st.textContent = `Game over! Enter to restart`;
    else if (state === 'win')     st.textContent = `Round ${round} clear! Enter for next`;
    else                          st.textContent = `Round ${round}`;
  }

  // ── Physics step ─────────────────────────────────────────────────────────

  function step() {
    if (state !== 'running') return;

    if (ball.attached) {
      // Ball rides the paddle until launch
      ball.x = paddle.x + paddle.w / 2;
      ball.y = paddle.y - BALL_R;
      return;
    }

    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall bounces
    if (ball.x - BALL_R < 0)  { ball.x = BALL_R;     ball.vx = Math.abs(ball.vx); }
    if (ball.x + BALL_R > W)  { ball.x = W - BALL_R; ball.vx = -Math.abs(ball.vx); }
    if (ball.y - BALL_R < 0)  { ball.y = BALL_R;     ball.vy = Math.abs(ball.vy); }

    // Ball lost
    if (ball.y - BALL_R > H) {
      lives--;
      updateHUD();
      if (lives <= 0) {
        state = 'dead';
        updateHUD();
        return;
      }
      resetBall();
      state = 'idle';
      updateHUD();
      return;
    }

    // Paddle collision
    if (
      ball.y + BALL_R >= paddle.y &&
      ball.y + BALL_R <= paddle.y + paddle.h &&
      ball.x >= paddle.x - BALL_R &&
      ball.x <= paddle.x + paddle.w + BALL_R
    ) {
      // Angle based on where it hits the paddle (adds some spin)
      const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2); // -1 to 1
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      ball.vx = hit * speed * 0.9;
      ball.vy = -Math.sqrt(Math.max(0, speed * speed - ball.vx * ball.vx));
      ball.y  = paddle.y - BALL_R;
    }

    // Brick collision
    for (let i = bricks.length - 1; i >= 0; i--) {
      const b = bricks[i];
      if (
        ball.x + BALL_R > b.x &&
        ball.x - BALL_R < b.x + b.w &&
        ball.y + BALL_R > b.y &&
        ball.y - BALL_R < b.y + b.h
      ) {
        // Which face did we hit?
        const overlapLeft   = (ball.x + BALL_R) - b.x;
        const overlapRight  = (b.x + b.w) - (ball.x - BALL_R);
        const overlapTop    = (ball.y + BALL_R) - b.y;
        const overlapBottom = (b.y + b.h) - (ball.y - BALL_R);
        const minH = Math.min(overlapLeft, overlapRight);
        const minV = Math.min(overlapTop,  overlapBottom);
        if (minH < minV) ball.vx = -ball.vx; else ball.vy = -ball.vy;

        b.hp--;
        if (b.hp <= 0) {
          score += b.maxHp * 10;
          bricks.splice(i, 1);
        }
        updateHUD();
        break; // one brick per frame
      }
    }

    // Clear round
    if (bricks.length === 0) {
      state = 'win';
      updateHUD();
    }
  }

  // ── Draw ─────────────────────────────────────────────────────────────────

  function draw() {
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, W, H);

    // Subtle grid
    ctx.strokeStyle = '#14142a';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= W; x += CELL) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += CELL) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Bricks
    bricks.forEach(b => {
      const alpha = b.hp < b.maxHp ? 0.5 : 1;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      // Highlight edge
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(b.x, b.y, b.w, 3);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(b.x, b.y + b.h - 3, b.w, 3);
      // 2-hit indicator
      if (b.maxHp === 2) {
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('2', b.x + b.w / 2, b.y + b.h - 3);
      }
      ctx.globalAlpha = 1;
    });

    // Paddle
    ctx.fillStyle = '#6060d0';
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 4);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(paddle.x + 4, paddle.y + 2, paddle.w - 8, 3);

    // Ball
    const grad = ctx.createRadialGradient(ball.x - 2, ball.y - 2, 1, ball.x, ball.y, BALL_R);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#a0a0ff');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    // Overlays
    if (state === 'idle' || state === 'dead' || state === 'win') {
      ctx.fillStyle = 'rgba(0,0,0,0.52)';
      ctx.fillRect(0, 0, W, H);

      if (state === 'dead') {
        ctx.fillStyle = '#f84040';
        ctx.font = 'bold 26px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', W / 2, H / 2 - 12);
        ctx.fillStyle = '#8080b0';
        ctx.font = '14px monospace';
        ctx.fillText(`Final Score: ${score}`, W / 2, H / 2 + 16);
        ctx.font = '12px monospace';
        ctx.fillText('Press Enter to play again', W / 2, H / 2 + 38);
      } else if (state === 'win') {
        ctx.fillStyle = '#40f880';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`ROUND ${round} CLEAR!`, W / 2, H / 2 - 12);
        ctx.fillStyle = '#8080b0';
        ctx.font = '13px monospace';
        ctx.fillText(`Score: ${score}`, W / 2, H / 2 + 14);
        ctx.font = '12px monospace';
        ctx.fillText('Press Enter for next round', W / 2, H / 2 + 36);
      } else {
        ctx.fillStyle = '#a0a0ff';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BREAKOUT', W / 2, H / 2 - 14);
        ctx.fillStyle = '#50507a';
        ctx.font = '12px monospace';
        ctx.fillText('Press Enter or Space to launch', W / 2, H / 2 + 12);
      }
    }
  }

  // ── Game loop ─────────────────────────────────────────────────────────────

  function loop() {
    step();
    draw();
    raf = requestAnimationFrame(loop);
  }

  // ── Input ─────────────────────────────────────────────────────────────────

  // Mouse / touch: move paddle
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const mx = (e.clientX - rect.left) * scaleX;
    paddle.x = Math.max(0, Math.min(W - paddle.w, mx - paddle.w / 2));
  });

  // Arrow keys: move paddle
  const keys = { ArrowLeft: false, ArrowRight: false };
  canvas.addEventListener('keydown', (e) => {
    if (e.key in keys) { keys[e.key] = true; e.preventDefault(); }

    if ((e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      if (state === 'idle') {
        // Launch ball
        state = 'running';
        ball.attached = false;
        ball.vx = (Math.random() < 0.5 ? 1 : -1) * INIT_SPEED * 0.65;
        ball.vy = -INIT_SPEED;
        updateHUD();
      } else if (state === 'dead') {
        cancelAnimationFrame(raf);
        round = 1;
        init();
        loop();
      } else if (state === 'win') {
        round++;
        resetBall();
        bricks = generateBricks(round);
        state = 'idle';
        updateHUD();
      }
    }
  });
  canvas.addEventListener('keyup', (e) => { if (e.key in keys) keys[e.key] = false; });

  // Paddle keyboard movement injected into the loop
  const PADDLE_SPEED = 7;
  const _origStep = step;
  // Wrap step to also handle key-based paddle movement
  function stepWithKeys() {
    if (keys.ArrowLeft)  paddle.x = Math.max(0,          paddle.x - PADDLE_SPEED);
    if (keys.ArrowRight) paddle.x = Math.min(W - paddle.w, paddle.x + PADDLE_SPEED);
    _origStep();
  }

  // ── Kick off ──────────────────────────────────────────────────────────────
  init();
  // Replace loop's step reference with the key-aware one
  cancelAnimationFrame(raf);
  function loopFull() {
    if (keys.ArrowLeft)  paddle.x = Math.max(0,            paddle.x - PADDLE_SPEED);
    if (keys.ArrowRight) paddle.x = Math.min(W - paddle.w, paddle.x + PADDLE_SPEED);
    step();
    draw();
    raf = requestAnimationFrame(loopFull);
  }
  raf = requestAnimationFrame(loopFull);
}
