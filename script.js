/* =====================================================
   BIRTHDAY CELEBRATION WEBSITE — script.js
   =====================================================

   QUICK EDIT GUIDE
   ─────────────────
   1. BIRTHDAY DATE  → Change BIRTHDAY_DATE below (YYYY-MM-DD)
   2. MUSIC FILE     → Replace assets/audio/bday-music.mp3 with your file
   3. PHOTOS         → Drop files into assets/images/ and
                       rename them photo1.jpg … photo6.jpg
                       (or update the src attributes in index.html)
   4. NAME           → Search for "Sarah" in index.html and replace it

   ===================================================== */

/* ── 0. CONFIG ──────────────────────────────────────
   Set this to the birthday person's birthday in the
   current or next calendar year (YYYY-MM-DD).
   ─────────────────────────────────────────────────── */
const BIRTHDAY_DATE = '2026-08-10'; // Abhilasha's birthday — August 10


/* =====================================================
   1. CONFETTI ENGINE
   A lightweight canvas-based confetti system —
   no external libraries required.
   ===================================================== */
const Confetti = (() => {
  const canvas  = document.getElementById('confetti-canvas');
  const ctx     = canvas.getContext('2d');
  let   pieces  = [];
  let   running = false;
  let   animId  = null;  /* stored so loop can be cancelled if needed */

  // Palette matching the site's color scheme
  const COLORS = [
    '#c9a84c', '#f2c4ce', '#e8788a', '#6b1f2a',
    '#f0d98a', '#fce4ea', '#b5c9b7', '#ffffff',
  ];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createPiece(x, y) {
    return {
      x,
      y,
      vx:    randomBetween(-4, 4),
      vy:    randomBetween(-14, -6),
      angle: randomBetween(0, Math.PI * 2),
      spin:  randomBetween(-0.2, 0.2),
      size:  randomBetween(6, 14),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      alpha: 1,
    };
  }

  /** Burst confetti from a point (defaults to page centre). */
  function burst(originX, originY, count = 120) {
    resize();
    const cx = originX ?? canvas.width  / 2;
    const cy = originY ?? canvas.height / 3;

    for (let i = 0; i < count; i++) {
      pieces.push(createPiece(cx, cy));
    }

    if (!running) {
      running = true;
      loop();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces = pieces.filter(p => p.alpha > 0.05);

    for (const p of pieces) {
      // Physics
      p.x     += p.vx;
      p.y     += p.vy;
      p.vy    += 0.35;          // gravity
      p.vx    *= 0.99;          // air resistance
      p.angle += p.spin;
      p.alpha -= 0.012;

      // Draw
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    if (pieces.length > 0) {
      animId = requestAnimationFrame(loop);
    } else {
      running = false;
      animId  = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  return { burst };
})();


/* =====================================================
   2. PAGE-LOAD CONFETTI BURST
   Fires once on load (after a short delay so the hero
   entrance animation finishes first).
   ===================================================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    Confetti.burst(window.innerWidth / 2, window.innerHeight / 3, 80);
  }, 900);
});


/* =====================================================
   3. CELEBRATE BUTTON — manual confetti burst
   ===================================================== */
const celebrateBtn = document.getElementById('celebrate-btn');

celebrateBtn.addEventListener('click', () => {
  // Burst from the button's position for a natural feel
  const rect = celebrateBtn.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  Confetti.burst(cx, cy, 160);
});


/* =====================================================
   4. SCROLL-DRIVEN ANIMATIONS
   Uses IntersectionObserver to add .is-visible to
   every element with class .animate-on-scroll.
   ===================================================== */
const observerOptions = {
  root:       null,
  rootMargin: '0px 0px -60px 0px',
  threshold:  0.12,
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Unobserve after reveal so it doesn't re-trigger
      scrollObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  scrollObserver.observe(el);
});


/* =====================================================
   5. MUSIC PLAYER
   The <audio> element auto-plays on user interaction
   (browser policy). The button triggers play/pause.
   ===================================================== */
const musicToggle = document.getElementById('music-toggle');
const bgMusic     = document.getElementById('bg-music');
const musicIcon   = musicToggle.querySelector('.music-icon');

let musicStarted = false;

function startMusic() {
  bgMusic.play().then(() => {
    musicToggle.classList.add('is-playing');
    musicToggle.setAttribute('aria-label', 'Pause background music');
    musicIcon.textContent = '♫';
    musicStarted = true;
  }).catch(() => {
    // Autoplay blocked — that's fine, user can click the button
  });
}

musicToggle.addEventListener('click', () => {
  if (bgMusic.paused) {
    startMusic();
  } else {
    bgMusic.pause();
    musicToggle.classList.remove('is-playing');
    musicToggle.setAttribute('aria-label', 'Play background music');
    musicIcon.textContent = '♪';
  }
});

// Attempt autoplay on first user interaction with the page
function onFirstInteraction() {
  if (!musicStarted) {
    startMusic();
  }
  document.removeEventListener('click',      onFirstInteraction);
  document.removeEventListener('keydown',    onFirstInteraction);
  document.removeEventListener('touchstart', onFirstInteraction);
}

document.addEventListener('click',      onFirstInteraction);
document.addEventListener('keydown',    onFirstInteraction);
document.addEventListener('touchstart', onFirstInteraction, { passive: true });


/* =====================================================
   6. BIRTHDAY BANNER / COUNTDOWN LOGIC
   Compares today's date to BIRTHDAY_DATE and shows
   the appropriate banner or countdown timer.
   ===================================================== */
(function initBanner() {
  const now      = new Date();
  const [, bmonth, bday] = BIRTHDAY_DATE.split('-').map(Number);

  // Build a birthday date in the current year for comparison
  const thisYearBirthday = new Date(now.getFullYear(), bmonth - 1, bday);

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const bannerToday    = document.getElementById('banner-today');
  const bannerCountdown = document.getElementById('banner-countdown');
  const bannerPast     = document.getElementById('banner-past');

  const diffMs = thisYearBirthday - todayStart; // milliseconds

  if (diffMs === 0) {
    // TODAY is the birthday 🎉
    bannerToday.style.display = 'flex';
    // Extra confetti burst for the banner section entering viewport
    const bannerSection = document.getElementById('banner');
    const bannerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 180);
          bannerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    bannerObserver.observe(bannerSection);

  } else if (diffMs > 0) {
    // Birthday is still coming up → show countdown
    bannerCountdown.style.display = 'flex';
    updateCountdown(thisYearBirthday);
    setInterval(() => updateCountdown(thisYearBirthday), 1000);

  } else {
    // Birthday has already passed this year
    bannerPast.style.display = 'flex';
  }

  function updateCountdown(target) {
    const now  = new Date();
    const diff = target - now;

    if (diff <= 0) {
      // Flip to birthday banner if countdown hits zero during session
      bannerCountdown.style.display = 'none';
      bannerToday.style.display     = 'flex';
      return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const days  = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins  = Math.floor((totalSecs % 3600)  / 60);
    const secs  = totalSecs % 60;

    document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
  }
})();


/* =====================================================
   7. FOOTER DATE
   Injects a formatted "Month D, YYYY" date string.
   ===================================================== */
(function setFooterDate() {
  const el = document.getElementById('footer-date');
  if (!el) return;
  const d = new Date();
  el.textContent = d.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  });
})();


/* =====================================================
   8. SMOOTH SCROLL POLYFILL
   Handles anchor link clicks for browsers that don't
   natively support scroll-behavior: smooth.
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    const target   = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* =====================================================
   9. CAKE CUTTING INTERACTION
   ===================================================== */
(function initCakeCut() {
  const cutBtn     = document.getElementById('cut-btn');
  const cakeUncut  = document.getElementById('cake-uncut');
  const cakeCut    = document.getElementById('cake-cut');
  const knife      = document.getElementById('cake-knife');
  const flames     = document.querySelectorAll('.flame');
  const againBtn   = document.getElementById('cake-confetti-btn');

  if (!cutBtn) return;

  cutBtn.addEventListener('click', () => {
    // Disable button immediately
    cutBtn.disabled = true;
    cutBtn.style.opacity = '0.6';

    // Step 1: Show knife swinging in
    knife.classList.add('active');

    // Step 2: Blow out candles one by one
    flames.forEach((flame, i) => {
      setTimeout(() => {
        flame.classList.add('blown-out');
      }, i * 120);
    });

    // Step 3: After knife animation — flip to cut state + confetti
    setTimeout(() => {
      cakeUncut.style.transition = 'opacity 0.4s ease';
      cakeUncut.style.opacity = '0';

      setTimeout(() => {
        cakeUncut.style.display = 'none';
        cakeCut.style.display   = 'block';

        // Big confetti burst!
        Confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 220);

        // Second burst for extra drama
        setTimeout(() => {
          Confetti.burst(window.innerWidth * 0.25, window.innerHeight * 0.4, 100);
          Confetti.burst(window.innerWidth * 0.75, window.innerHeight * 0.4, 100);
        }, 400);

      }, 400);
    }, 900);
  });

  // "Celebrate Again" button on the cut state
  if (againBtn) {
    againBtn.addEventListener('click', () => {
      Confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 200);
    });
  }
})();
