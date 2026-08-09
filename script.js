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
   9. CAKE CUTTING — Cinematic Sequence
   Step 1: Cake + balloons appear (CSS entrance)
   Step 2: User clicks "Cut the Cake"
   Step 3: Candles blow out one by one
   Step 4: Knife swings in, cake splits
   Step 5: Hearts burst out + Happy Birthday reveal
   ===================================================== */
(function initCakeCut() {
  const ckCutBtn   = document.getElementById('ck-cut-btn');
  const ckCakeWrap = document.getElementById('ck-cake-wrap');
  const ckBtnArea  = document.getElementById('ck-btn-area');
  const ckAfter    = document.getElementById('ck-after');
  const ckKnife    = document.getElementById('ck-knife');
  const ckAgainBtn = document.getElementById('ck-again-btn');
  const ckInstruct = document.getElementById('ck-instruction');
  const ckHearts   = document.getElementById('ck-hearts');
  const ckFlames   = document.querySelectorAll('.ck-flame');

  if (!ckCutBtn) return;

  // Change instruction text after 2s to invite the click
  setTimeout(() => {
    if (ckInstruct) {
      ckInstruct.textContent = '🎂 Now cut the cake!';
      ckInstruct.style.color = 'var(--color-rose)';
      ckInstruct.style.fontStyle = 'normal';
      ckInstruct.style.fontWeight = '600';
    }
  }, 2200);

  ckCutBtn.addEventListener('click', () => {
    ckCutBtn.disabled = true;

    // STEP 1: Blow candles out one by one
    ckFlames.forEach((flame, i) => {
      setTimeout(() => flame.classList.add('ck-blown'), i * 180);
    });

    // STEP 2: Knife swings in
    setTimeout(() => {
      ckKnife.classList.add('ck-knife--in');
    }, 300);

    // STEP 3: Cake shakes
    setTimeout(() => {
      ckCakeWrap.style.animation = 'ckShake 0.4s ease';
    }, 900);

    // STEP 4: Flip to after-cut state
    setTimeout(() => {
      ckCakeWrap.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      ckCakeWrap.style.opacity = '0';
      ckCakeWrap.style.transform = 'scale(0.85)';
      ckBtnArea.style.transition = 'opacity 0.3s ease';
      ckBtnArea.style.opacity = '0';
    }, 1250);

    setTimeout(() => {
      ckCakeWrap.style.display = 'none';
      ckBtnArea.style.display  = 'none';
      ckAfter.style.display    = 'flex';

      // Spawn heart particles
      spawnHearts();

      // Big confetti
      Confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 200);
      setTimeout(() => {
        Confetti.burst(window.innerWidth * 0.2, window.innerHeight * 0.5, 100);
        Confetti.burst(window.innerWidth * 0.8, window.innerHeight * 0.5, 100);
      }, 500);
    }, 1600);
  });

  // Spawn floating hearts
  function spawnHearts() {
    if (!ckHearts) return;
    const heartEmojis = ['❤️','💕','💖','💗','💓','💝','🩷','💞'];
    const count = 22;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const h = document.createElement('span');
        h.className = 'ck-heart-particle';
        h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        const leftPct = 5 + Math.random() * 90;
        const dur = 2.2 + Math.random() * 1.8;
        const rot = -30 + Math.random() * 60;
        h.style.left = leftPct + '%';
        h.style.setProperty('--rot', rot + 'deg');
        h.style.animationDuration = dur + 's';
        h.style.fontSize = (1.2 + Math.random() * 1.4) + 'rem';
        ckHearts.appendChild(h);
        setTimeout(() => h.remove(), dur * 1000 + 200);
      }, i * 90);
    }
    // Keep spawning hearts for 4s
    let waves = 0;
    const heartInterval = setInterval(() => {
      waves++;
      if (waves > 3) { clearInterval(heartInterval); return; }
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const h = document.createElement('span');
          h.className = 'ck-heart-particle';
          h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
          h.style.left = (5 + Math.random() * 90) + '%';
          const dur = 2 + Math.random() * 1.5;
          const rot = -30 + Math.random() * 60;
          h.style.setProperty('--rot', rot + 'deg');
          h.style.animationDuration = dur + 's';
          h.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
          ckHearts.appendChild(h);
          setTimeout(() => h.remove(), dur * 1000 + 200);
        }, i * 120);
      }
    }, 1200);
  }

  // Shake keyframe injected via JS (avoids extra CSS)
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `@keyframes ckShake {
    0%,100%{transform:translateX(0) rotate(0)}
    20%{transform:translateX(-8px) rotate(-2deg)}
    40%{transform:translateX(8px)  rotate(2deg)}
    60%{transform:translateX(-5px) rotate(-1deg)}
    80%{transform:translateX(5px)  rotate(1deg)}
  }`;
  document.head.appendChild(shakeStyle);

  // "Celebrate Again" button
  if (ckAgainBtn) {
    ckAgainBtn.addEventListener('click', () => {
      spawnHearts();
      Confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 200);
    });
  }
})();
