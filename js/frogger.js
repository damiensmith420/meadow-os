/**
 * frogger.js — Built-in Frog Crossing game
 * Hop across traffic lanes then log/lily-pad lanes to reach the home bays.
 * Random lane speeds/gaps per level, lives system, score.
 */

import { createWindow } from './windows.js';

// Grid
const COLS     = 15;   // tiles wide
const ROWS     = 14;   // tiles tall  (1 header row drawn above canvas)
const TILE     = 36;   // px per tile
const W        = COLS * TILE;
const H        = ROWS * TILE;

// Row roles (bottom = index 0)
// 0        : safe start zone
// 1–5      : road (cars)
// 6        : safe median strip
// 7–11     : river (logs / lily pads)
// 12       : home row (5 bays)
// 13+      : drawn above — score bar handles it

const ROAD_ROWS   = [1, 2, 3, 4, 5];
const RIVER_ROWS  = [7, 8, 9, 10, 11];
const SAFE_ROWS   = [0, 6];
const HOME_ROW    = 12;
const HOME_BAYS   = 5;            // evenly spaced across width

// Visual colours
const C_GRASS   = '#2a5a2a';
const C_ROAD    = '#303030';
const C_WATER   = '#1a3a6a';
const C_MEDIAN  = '#3a6a3a';
const C_HOME_BG = '#1a4a1a';
const C_LANE_LINE = '#505050';
const C_FROG    = '#50e050';
const C_FROG_EYE = '#c0ffc0';
const C_CAR     = ['#f84040','#f8a030','#f8f040','#a040f8','#40a8f8'];
const C_LOG     = '#8b4513';
const C_PAD     = '#2a8a2a';

export function openFrogger() {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;background:#0a120a;height:100%;padding:8px;gap:6px;`;

  const scoreBar = document.createElement('div');
  scoreBar.style.cssText = 'color:#80ff80;font-family:monospace;font-size:13px;width:100%;display:flex;justify-content:space-between;';
  scoreBar.innerHTML = `
    <span>🐸 Frog Crossing</span>
    <span id="fg-score">Score: 0</span>
    <span id="fg-lives">🐸🐸🐸</span>
    <span id="fg-level">Level 1</span>
    <span id="fg-state">Press Enter to start</span>`;
  wrapper.appendChild(scoreBar);

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  canvas.style.cssText = `border:2px solid #1a4a1a;display:block;`;
  canvas.setAttribute('tabindex', '0');
  canvas.setAttribute('aria-label', 'Frog Crossing game. Arrow keys to hop.');
  wrapper.appendChild(canvas);

  const hint = document.createElement('div');
  hint.style.cssText = 'color:#204020;font-family:monospace;font-size:11px;';
  hint.textContent = 'Arrow keys to hop · reach all 5 home bays to advance';
  wrapper.appendChild(hint);

  createWindow({
    id: 'game-frogger',
    title: 'Frog Crossing',
    icon: 'frogger',
    width: W + 40,
    height: H + 115,
    resizable: false,
    content: wrapper,
  });

  setTimeout(() => canvas.focus(), 100);
  startFrogger(canvas, scoreBar);
}

// ── Core ──────────────────────────────────────────────────────────────────────

function startFrogger(canvas, scoreBar) {
  const ctx = canvas.getContext('2d');

  let frog, lanes, homes, score, lives, level, state, raf;
  let deathTimer = 0;          // frames to show death flash
  let winTimer   = 0;          // frames to show win flash

  // ── Lane generation ───────────────────────────────────────────────────────

  function makeLanes(lvl) {
    const laneData = {};
    const speedScale = 1 + (lvl - 1) * 0.18;

    ROAD_ROWS.forEach((row, i) => {
      const dir    = i % 2 === 0 ? 1 : -1;
      const speed  = (1.4 + Math.random() * 1.2) * speedScale * dir;
      const carW   = (2 + Math.floor(Math.random() * 2)) * TILE;  // 2–3 tiles wide
      const gap    = (2 + Math.random() * 3) * TILE;               // gap between cars
      const color  = C_CAR[Math.floor(Math.random() * C_CAR.length)];
      const objs   = [];
      let x = Math.random() * W;
      // Fill the lane with evenly-ish spaced cars, wrapping around
      for (let n = 0; n < 5; n++) {
        objs.push({ x: ((x + n * (carW + gap)) % (W + carW)) - (dir < 0 ? carW : 0), w: carW, color });
      }
      laneData[row] = { type: 'road', speed, objs, objH: TILE * 0.65 };
    });

    RIVER_ROWS.forEach((row, i) => {
      const dir   = i % 2 === 0 ? 1 : -1;
      const speed = (1.1 + Math.random() * 1.0) * speedScale * dir;
      // Alternate logs and lily pads per lane
      const isLog = i % 3 !== 2;
      const objW  = isLog ? (3 + Math.floor(Math.random() * 3)) * TILE : TILE * 1.4;
      const gap   = (1.5 + Math.random() * 2.5) * TILE;
      const objs  = [];
      let x = Math.random() * W;
      for (let n = 0; n < 4; n++) {
        objs.push({ x: ((x + n * (objW + gap)) % (W + objW)) - (dir < 0 ? objW : 0), w: objW, isLog });
      }
      laneData[row] = { type: 'river', speed, objs, objH: TILE * 0.7 };
    });

    return laneData;
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  function init(fullReset = true) {
    if (fullReset) { score = 0; lives = 3; level = 1; }
    homes = Array(HOME_BAYS).fill(false);
    lanes = makeLanes(level);
    spawnFrog();
    state = 'idle';
    updateHUD();
    draw();
  }

  function spawnFrog() {
    frog = {
      col: Math.floor(COLS / 2),
      row: 0,                    // row 0 = bottom safe zone
      riding: null,              // { laneRow, offsetOnObj } when on a log/pad
      dead: false,
    };
  }

  // ── HUD ───────────────────────────────────────────────────────────────────

  function updateHUD() {
    scoreBar.querySelector('#fg-score').textContent  = `Score: ${score}`;
    scoreBar.querySelector('#fg-lives').textContent  = '🐸'.repeat(lives);
    scoreBar.querySelector('#fg-level').textContent  = `Level ${level}`;
    const st = scoreBar.querySelector('#fg-state');
    if      (state === 'idle')    st.textContent = 'Press Enter to start';
    else if (state === 'dead')    st.textContent = 'Game Over · Enter to restart';
    else if (state === 'levelup') st.textContent = `Level ${level}! Press Enter`;
    else                          st.textContent = '';
  }

  // ── Movement ──────────────────────────────────────────────────────────────

  function moveFrog(dc, dr) {
    if (state !== 'running') return;
    const newCol = frog.col + dc;
    const newRow = frog.row + dr;
    if (newCol < 0 || newCol >= COLS) return;  // wall
    if (newRow < 0 || newRow > HOME_ROW) return;

    frog.col    = newCol;
    frog.row    = newRow;
    frog.riding = null;  // recalculated in step

    // Stepped forward — small score bonus
    if (dr > 0) score += 5;
    updateHUD();

    // Reached home row
    if (frog.row === HOME_ROW) {
      landHome();
      return;
    }

    checkDeath();
  }

  function landHome() {
    // Map col to bay index (5 bays evenly distributed)
    const bayW = COLS / HOME_BAYS;
    const bay  = Math.floor(frog.col / bayW);
    if (bay < 0 || bay >= HOME_BAYS) { die(); return; }
    if (homes[bay]) { die(); return; }  // already occupied

    homes[bay] = true;
    score += 50;
    updateHUD();

    if (homes.every(Boolean)) {
      // All bays filled — next level
      winTimer = 80;
      state = 'levelup';
      level++;
      updateHUD();
    } else {
      spawnFrog();
    }
  }

  // ── Collision / death ─────────────────────────────────────────────────────

  function checkDeath() {
    const row = frog.row;

    if (ROAD_ROWS.includes(row)) {
      const lane = lanes[row];
      const fx   = frog.col * TILE + TILE / 2;
      const fy   = rowY(row) + TILE / 2;
      for (const obj of lane.objs) {
        if (fx > obj.x + 4 && fx < obj.x + obj.w - 4) {
          die(); return;
        }
      }
    }

    if (RIVER_ROWS.includes(row)) {
      const lane = lanes[row];
      const fx   = frog.col * TILE + TILE / 2;
      let onSomething = false;
      for (const obj of lane.objs) {
        if (fx >= obj.x + 2 && fx <= obj.x + obj.w - 2) {
          onSomething = true;
          frog.riding = { laneRow: row, obj };
          break;
        }
      }
      if (!onSomething) { die(); return; }
    }
  }

  function die() {
    lives--;
    deathTimer = 45;
    updateHUD();
    if (lives <= 0) {
      state = 'dead';
      updateHUD();
    } else {
      spawnFrog();
    }
  }

  // ── Physics step ─────────────────────────────────────────────────────────

  function step() {
    if (state !== 'running') return;

    if (deathTimer > 0) { deathTimer--; return; }
    if (winTimer   > 0) { winTimer--;   return; }

    // Move lane objects
    for (const row of [...ROAD_ROWS, ...RIVER_ROWS]) {
      const lane = lanes[row];
      const wrap = W + 200;  // generous wrap buffer
      for (const obj of lane.objs) {
        obj.x += lane.speed;
        // Wrap around
        if (lane.speed > 0 && obj.x > W + obj.w)  obj.x -= wrap + obj.w;
        if (lane.speed < 0 && obj.x < -obj.w - 200) obj.x += wrap + obj.w;
      }
    }

    // Carry frog if riding a log/pad
    if (frog.riding) {
      const { laneRow, obj } = frog.riding;
      const lane = lanes[laneRow];
      // Sync: move frog by lane speed in column space
      const newFX = frog.col * TILE + lane.speed;
      frog.col = newFX / TILE;

      // Check still on object
      const fx = frog.col * TILE + TILE / 2;
      if (fx < obj.x + 2 || fx > obj.x + obj.w - 2) {
        frog.riding = null;
        die(); return;
      }
      // Fell off screen
      if (frog.col < 0 || frog.col >= COLS) { frog.riding = null; die(); return; }
    }

    // Re-check river death each frame (in case log moved out from under frog)
    if (RIVER_ROWS.includes(frog.row) && frog.row !== HOME_ROW) {
      const lane = lanes[frog.row];
      const fx   = frog.col * TILE + TILE / 2;
      let onSomething = false;
      for (const obj of lane.objs) {
        if (fx >= obj.x + 2 && fx <= obj.x + obj.w - 2) {
          onSomething = true;
          frog.riding = { laneRow: frog.row, obj };
          break;
        }
      }
      if (!onSomething && frog.riding === null) { die(); return; }
    }
  }

  // ── Coordinate helper ─────────────────────────────────────────────────────

  function rowY(row) {
    // row 0 = bottom, row HOME_ROW = top
    return H - (row + 1) * TILE;
  }

  // ── Draw ─────────────────────────────────────────────────────────────────

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background rows
    for (let row = 0; row <= HOME_ROW; row++) {
      const y = rowY(row);
      if (ROAD_ROWS.includes(row)) {
        ctx.fillStyle = C_ROAD;
        ctx.fillRect(0, y, W, TILE);
        // Lane divider dashes
        ctx.strokeStyle = C_LANE_LINE;
        ctx.setLineDash([12, 10]);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        ctx.setLineDash([]);
      } else if (RIVER_ROWS.includes(row)) {
        ctx.fillStyle = C_WATER;
        ctx.fillRect(0, y, W, TILE);
        // Ripple lines
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (let rx = 0; rx < W; rx += 20) {
          ctx.beginPath();
          ctx.moveTo(rx, y + TILE * 0.4);
          ctx.bezierCurveTo(rx + 5, y + TILE * 0.35, rx + 10, y + TILE * 0.45, rx + 20, y + TILE * 0.4);
          ctx.stroke();
        }
      } else if (row === HOME_ROW) {
        ctx.fillStyle = C_HOME_BG;
        ctx.fillRect(0, y, W, TILE);
        // Draw bays
        const bayW = W / HOME_BAYS;
        for (let b = 0; b < HOME_BAYS; b++) {
          const bx = b * bayW + 4;
          const bw = bayW - 8;
          ctx.fillStyle = homes[b] ? '#40a840' : '#0a2a0a';
          ctx.beginPath();
          ctx.roundRect(bx, y + 4, bw, TILE - 8, 4);
          ctx.fill();
          ctx.strokeStyle = homes[b] ? '#60d060' : '#1a4a1a';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          if (homes[b]) {
            // Draw a little frog in the bay
            drawFrogAt(ctx, bx + bw / 2 - TILE * 0.35, y + 4, TILE * 0.7, '#30c030');
          }
        }
      } else {
        // Safe grass
        ctx.fillStyle = row === 6 ? C_MEDIAN : C_GRASS;
        ctx.fillRect(0, y, W, TILE);
      }
    }

    // Lane objects (cars & logs/pads)
    for (const row of ROAD_ROWS) {
      const lane = lanes[row];
      const y    = rowY(row);
      for (const obj of lane.objs) {
        drawCar(ctx, obj, y, lane.objH);
      }
    }
    for (const row of RIVER_ROWS) {
      const lane = lanes[row];
      const y    = rowY(row);
      for (const obj of lane.objs) {
        if (obj.isLog) drawLog(ctx, obj, y, lane.objH);
        else           drawPad(ctx, obj, y, lane.objH);
      }
    }

    // Death flash
    if (deathTimer > 0 && deathTimer % 8 < 4) {
      ctx.fillStyle = 'rgba(255,60,60,0.18)';
      ctx.fillRect(0, 0, W, H);
    }

    // Frog
    if (state !== 'dead' || deathTimer > 0) {
      const fc = frog.col;  // may be fractional when riding
      const fx = fc * TILE;
      const fy = rowY(frog.row);
      drawFrogAt(ctx, fx, fy, TILE, C_FROG);
    }

    // Win flash
    if (winTimer > 0 && winTimer % 10 < 5) {
      ctx.fillStyle = 'rgba(80,255,80,0.15)';
      ctx.fillRect(0, 0, W, H);
    }

    // Overlays
    if (state === 'idle' || state === 'dead' || state === 'levelup') {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, W, H);

      if (state === 'dead') {
        ctx.fillStyle = '#f84040';
        ctx.font = 'bold 26px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', W / 2, H / 2 - 14);
        ctx.fillStyle = '#80b080';
        ctx.font = '14px monospace';
        ctx.fillText(`Score: ${score}`, W / 2, H / 2 + 12);
        ctx.font = '12px monospace';
        ctx.fillText('Press Enter to play again', W / 2, H / 2 + 34);
      } else if (state === 'levelup') {
        ctx.fillStyle = '#40ff80';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`LEVEL ${level - 1} CLEAR!`, W / 2, H / 2 - 14);
        ctx.fillStyle = '#80b080';
        ctx.font = '13px monospace';
        ctx.fillText(`Score: ${score}`, W / 2, H / 2 + 12);
        ctx.font = '12px monospace';
        ctx.fillText('Press Enter for next level', W / 2, H / 2 + 34);
      } else {
        ctx.fillStyle = '#80ff80';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('FROG CROSSING', W / 2, H / 2 - 14);
        ctx.fillStyle = '#406040';
        ctx.font = '12px monospace';
        ctx.fillText('Arrow keys to hop', W / 2, H / 2 + 10);
        ctx.fillText('Reach all 5 home bays', W / 2, H / 2 + 28);
        ctx.fillStyle = '#304830';
        ctx.fillText('Press Enter to start', W / 2, H / 2 + 50);
      }
    }
  }

  // ── Drawing helpers ───────────────────────────────────────────────────────

  function drawFrogAt(ctx, x, y, size, color) {
    const s  = size;
    const cx = x + s / 2;
    const cy = y + s / 2;
    const r  = s * 0.28;

    // Body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(cx, cy + s * 0.05, r, r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Back legs
    ctx.strokeStyle = color;
    ctx.lineWidth   = s * 0.1;
    ctx.lineCap     = 'round';
    // left
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.8, cy + r * 0.4);
    ctx.lineTo(cx - r * 1.6, cy + r * 1.0);
    ctx.lineTo(cx - r * 2.0, cy + r * 0.7);
    ctx.stroke();
    // right
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.8, cy + r * 0.4);
    ctx.lineTo(cx + r * 1.6, cy + r * 1.0);
    ctx.lineTo(cx + r * 2.0, cy + r * 0.7);
    ctx.stroke();

    // Front legs
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.6, cy - r * 0.3);
    ctx.lineTo(cx - r * 1.3, cy - r * 0.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.6, cy - r * 0.3);
    ctx.lineTo(cx + r * 1.3, cy - r * 0.9);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - r * 0.45, cy - r * 0.55, r * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + r * 0.45, cy - r * 0.55, r * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#204020';
    ctx.beginPath();
    ctx.arc(cx - r * 0.45, cy - r * 0.55, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + r * 0.45, cy - r * 0.55, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCar(ctx, obj, y, h) {
    const pad  = (TILE - h) / 2;
    const cr   = 5;
    ctx.fillStyle = obj.color;
    ctx.beginPath();
    ctx.roundRect(obj.x + 2, y + pad, obj.w - 4, h, cr);
    ctx.fill();
    // Windscreen shine
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(obj.x + obj.w * 0.3, y + pad + 3, obj.w * 0.35, h * 0.4);
    // Wheels
    ctx.fillStyle = '#111';
    const wy = y + pad + h - 5;
    ctx.fillRect(obj.x + 6,         wy, 10, 5);
    ctx.fillRect(obj.x + obj.w - 16, wy, 10, 5);
  }

  function drawLog(ctx, obj, y, h) {
    const pad = (TILE - h) / 2;
    ctx.fillStyle = C_LOG;
    ctx.beginPath();
    ctx.roundRect(obj.x + 2, y + pad, obj.w - 4, h, 6);
    ctx.fill();
    // Wood grain lines
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1.5;
    for (let i = 1; i < 3; i++) {
      const lx = obj.x + obj.w * (i / 3);
      ctx.beginPath();
      ctx.moveTo(lx, y + pad + 3);
      ctx.lineTo(lx, y + pad + h - 3);
      ctx.stroke();
    }
  }

  function drawPad(ctx, obj, y, h) {
    const pad = (TILE - h) / 2;
    const cx  = obj.x + obj.w / 2;
    const cy  = y + pad + h / 2;
    const rx  = (obj.w - 6) / 2;
    const ry  = h / 2 - 2;
    ctx.fillStyle = C_PAD;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    // Spots
    ctx.fillStyle = '#1a6a1a';
    ctx.beginPath();
    ctx.arc(cx - rx * 0.4, cy - ry * 0.2, ry * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + rx * 0.35, cy + ry * 0.15, ry * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Game loop ─────────────────────────────────────────────────────────────

  function loop() {
    step();
    draw();
    raf = requestAnimationFrame(loop);
  }

  // ── Input ─────────────────────────────────────────────────────────────────

  canvas.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp')    { e.preventDefault(); moveFrog( 0,  1); }
    if (e.key === 'ArrowDown')  { e.preventDefault(); moveFrog( 0, -1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); moveFrog(-1,  0); }
    if (e.key === 'ArrowRight') { e.preventDefault(); moveFrog( 1,  0); }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (state === 'idle') {
        state = 'running';
        updateHUD();
      } else if (state === 'dead') {
        cancelAnimationFrame(raf);
        init(true);
        loop();
      } else if (state === 'levelup') {
        lanes = makeLanes(level);
        homes = Array(HOME_BAYS).fill(false);
        spawnFrog();
        state = 'running';
        updateHUD();
      }
    }
  });

  // ── Kick off ──────────────────────────────────────────────────────────────
  init(true);
  raf = requestAnimationFrame(loop);
}
