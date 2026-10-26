/**
 * boot.js — Boot screen and first-visit welcome animation
 */

const BOOT_STEPS = [
  { msg: 'Loading Meadow OS…',      pct: 15,  delay: 300  },
  { msg: 'Reading configuration…',  pct: 35,  delay: 400  },
  { msg: 'Loading repository list…',pct: 55,  delay: 350  },
  { msg: 'Fetching release data…',  pct: 75,  delay: 500  },
  { msg: 'Starting desktop…',       pct: 92,  delay: 300  },
  { msg: 'Welcome!',                pct: 100, delay: 250  },
];

/**
 * Run the boot animation, then call onDone.
 * @param {function} onDone
 */
export function runBoot(onDone) {
  const screen = document.getElementById('boot-screen');
  const bar    = document.getElementById('boot-bar');
  const status = document.getElementById('boot-status');
  const skip   = document.getElementById('boot-skip');

  if (!screen) { onDone(); return; }

  // Skip button
  skip.addEventListener('click', () => finishBoot(screen, onDone), { once: true });
  skip.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); skip.click(); }
  });

  // Animate steps
  let totalDelay = 0;
  BOOT_STEPS.forEach(step => {
    totalDelay += step.delay;
    setTimeout(() => {
      if (bar)    bar.style.width = step.pct + '%';
      if (status) status.textContent = step.msg;
    }, totalDelay);
  });

  // Done
  setTimeout(() => finishBoot(screen, onDone), totalDelay + 400);
}

function finishBoot(screen, onDone) {
  screen.classList.add('fading');
  setTimeout(() => {
    screen.classList.add('hidden');
    onDone();
  }, 650);
}

/**
 * Check if this is the first visit (no localStorage key).
 * @returns {boolean}
 */
export function isFirstVisit() {
  try { return !localStorage.getItem('meadow-os-visited'); } catch { return true; }
}

export function markVisited() {
  try { localStorage.setItem('meadow-os-visited', '1'); } catch {}
}
