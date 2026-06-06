// Popups (genérico — Charme, Pack, Antes & Depois)
(function () {
  function closePopup(overlay) {
    overlay.classList.remove('open');
  }

  // Botões de fechar
  document.querySelectorAll('.popup-close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const overlay = btn.closest('.popup-overlay');
      if (overlay) closePopup(overlay);
    });
  });

  // Clique fora do box fecha
  document.querySelectorAll('.popup-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup(overlay);
    });
  });

  // Escape fecha qualquer popup aberto
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.popup-overlay.open').forEach(closePopup);
    }
  });

  // Acessibilidade — Enter/Space nos cards clicáveis
  document.querySelectorAll('.work-card.clickable').forEach(function (card) {
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Lógica Antes & Depois
  const baImg = document.getElementById('baImg');
  if (baImg) {
    const baBadge = document.getElementById('baBadge');
    const baStage = document.getElementById('baStage');
    const btns = document.querySelectorAll('.ba-btn');
    const sources = { antes: 'assets/images/PRODUTO_ANTES.jpg', depois: 'assets/images/PRODUTO_DEPOIS.jpg' };
    let current = 'depois';

    function setState(state) {
      current = state;
      baImg.src = sources[state];
      baBadge.textContent = state === 'antes' ? 'Antes' : 'Depois';
      btns.forEach(function (b) {
        b.classList.toggle('active', b.dataset.state === state);
      });
    }

    baStage.addEventListener('click', function () {
      setState(current === 'depois' ? 'antes' : 'depois');
    });

    btns.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        setState(b.dataset.state);
      });
    });
  }
})();

// Slider antes/depois do Card 3
(function () {
  const container = document.getElementById('meu-slider-comparador');
  if (!container) return;

  const beforeLayer = document.getElementById('slider-before-layer');
  const trigger = document.getElementById('slider-handle-button');
  const clickOverlay = document.getElementById('slider-click-overlay');

  let isDragging = false;

  function updatePosition(clientX) {
    const rect = container.getBoundingClientRect();
    let pos = ((clientX - rect.left) / rect.width) * 100;

    pos = Math.max(0, Math.min(100, pos));

    container.style.setProperty('--slider-pos', pos + '%');
    beforeLayer.style.clipPath = `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)`;
  }

  function stopCardClick(e) {
    e.stopPropagation();
  }

  container.addEventListener('click', stopCardClick);

  trigger.addEventListener('mousedown', function (e) {
    isDragging = true;
    stopCardClick(e);
  });
  window.addEventListener('mouseup', function () {
    isDragging = false;
  });
  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    updatePosition(e.clientX);
  });

  trigger.addEventListener('touchstart', function (e) {
    isDragging = true;
    stopCardClick(e);
  }, { passive: true });
  window.addEventListener('touchend', function () {
    isDragging = false;
  });
  window.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    updatePosition(e.touches[0].clientX);
  }, { passive: true });

  clickOverlay.addEventListener('click', function (e) {
    stopCardClick(e);
    updatePosition(e.clientX);
  });
})();

// Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
});

function lerp(a, b, t) { return a + (b - a) * t; }
function animateRing() {
  rx = lerp(rx, mx, 0.12);
  ry = lerp(ry, my, 0.12);
  ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .work-card, .service-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform += ' scale(2)';
    ring.style.width = '56px'; ring.style.height = '56px';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '36px'; ring.style.height = '36px';
  });
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const tls = document.querySelectorAll('.tl-item');

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.15 });

reveals.forEach(el => observer.observe(el));
tls.forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.12}s`;
  observer.observe(el);
});

// Stats counter animation
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const dur = 1500;
  const t0 = performance.now();
  function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const nums = e.target.querySelectorAll('.stat-num');
      const targets = [100, 4, 96];
      const suffixes = ['+', '+', '+'];
      nums.forEach((n, i) => {
        if (targets[i] !== undefined) {
          n.innerHTML = '0';
          setTimeout(() => {
            let c = 0, max = targets[i];
            const iv = setInterval(() => {
              c = Math.min(c + Math.ceil(max / 20), max);
              n.innerHTML = c + `<span>${suffixes[i]}</span>`;
              if (c >= max) clearInterval(iv);
            }, 60);
          }, 300);
        }
      });
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObs.observe(statsGrid);
