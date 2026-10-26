/**
 * game.js — Built-in Snake game
 * A minimal canvas-based Snake implementation in a window.
 */

import { createWindow } from './windows.js';

const CELL = 16;
const COLS = 22;
const ROWS = 18;
const W = COLS * CELL;
const H = ROWS * CELL;

export function openGame() {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;background:#0a0a0a;height:100%;padding:8px;gap:8px;`;

  const scoreBar = document.createElement('div');
  scoreBar.style.cssText = 'color:#80ff80;font-family:monospace;font-size:13px;width:100%;display:flex;justify-content:space-between;';
  scoreBar.innerHTML = `<span>🐍 Snake</span><span id="snake-score">Score: 0</span><span id="snake-state">Press Enter or Space to start</span>`;
  wrapper.appendChild(scoreBar);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  canvas.style.cssText = `border:2px solid #3a5a3a;display:block;`;
  canvas.setAttribute('tabindex', '0');
  canvas.setAttribute('aria-label', 'Snake game. Use arrow keys to control.');
  wrapper.appendChild(canvas);

  const hint = document.createElement('div');
  hint.style.cssText = 'color:#406040;font-family:monospace;font-size:11px;';
  hint.textContent = 'Arrow keys to move · Enter/Space to start/restart';
  wrapper.appendChild(hint);

  createWindow({
    id: 'game-snake',
    title: 'Snake',
    icon: 'game',
    width: W + 40,
    height: H + 100,
    resizable: false,
    content: wrapper,
  });

  // Focus canvas for keyboard input
  setTimeout(() => canvas.focus(), 100);
  startSnake(canvas, scoreBar);
}

function startSnake(canvas, scoreBar) {
  const ctx = canvas.getContext('2d');
  let snake, dir, nextDir, food, score, state, interval;

  function init() {
    snake = [{ x: 11, y: 9 }, { x: 10, y: 9 }, { x: 9, y: 9 }];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    state = 'idle'; // idle | running | dead
    placeFood();
    updateScore();
    draw();
  }

  function placeFood() {
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    food = pos;
  }

  function updateScore() {
    const el = scoreBar.querySelector('#snake-score');
    if (el) el.textContent = `Score: ${score}`;
    const st = scoreBar.querySelector('#snake-state');
    if (st) st.textContent = state === 'idle' ? 'Press Enter to start' : state === 'dead' ? 'Game over! Press Enter' : '';
  }

  function step() {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) { die(); return; }
    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) { die(); return; }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      updateScore();
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }

  function die() {
    clearInterval(interval);
    state = 'dead';
    updateScore();
    draw();
  }

  function draw() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    // Grid dots
    ctx.fillStyle = '#1a1a1a';
    for (let x = 0; x < COLS; x++)
      for (let y = 0; y < ROWS; y++)
        ctx.fillRect(x * CELL + 7, y * CELL + 7, 2, 2);

    // Food
    ctx.fillStyle = '#f84040';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 1, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snake.forEach((seg, i) => {
      const grad = ctx.createLinearGradient(seg.x * CELL, seg.y * CELL, (seg.x + 1) * CELL, (seg.y + 1) * CELL);
      grad.addColorStop(0, i === 0 ? '#a0ff40' : '#40d040');
      grad.addColorStop(1, i === 0 ? '#60e000' : '#208020');
      ctx.fillStyle = grad;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });

    // Dead overlay
    if (state === 'dead') {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#f84040';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', W / 2, H / 2 - 10);
      ctx.fillStyle = '#80a080';
      ctx.font = '13px monospace';
      ctx.fillText(`Score: ${score}`, W / 2, H / 2 + 16);
    }

    // Idle overlay
    if (state === 'idle') {
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#80ff80';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SNAKE', W / 2, H / 2 - 10);
      ctx.fillStyle = '#406040';
      ctx.font = '12px monospace';
      ctx.fillText('Press Enter or Space to start', W / 2, H / 2 + 14);
    }
  }

  canvas.addEventListener('keydown', (e) => {
    const map = {
      ArrowUp:    { x:  0, y: -1 },
      ArrowDown:  { x:  0, y:  1 },
      ArrowLeft:  { x: -1, y:  0 },
      ArrowRight: { x:  1, y:  0 },
    };
    if (map[e.key]) {
      e.preventDefault();
      const d = map[e.key];
      // Prevent reversing
      if (d.x !== -dir.x || d.y !== -dir.y) nextDir = d;
    }
    if ((e.key === 'Enter' || e.key === ' ') && state !== 'running') {
      e.preventDefault();
      clearInterval(interval);
      init();
      state = 'running';
      updateScore();
      interval = setInterval(step, 130);
    }
  });

  init();
}
