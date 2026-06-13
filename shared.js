/* Snack Ninja Vending — Shared JS */

/* ── Nav toggle ─────────────────────────────── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const hb1 = document.getElementById('hb1');
const hb2 = document.getElementById('hb2');
const hb3 = document.getElementById('hb3');
let navOpen = false;

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navOpen = !navOpen;
    mobileMenu.classList.toggle('open', navOpen);
    if (hb1) {
      hb1.style.transform = navOpen ? 'translateY(7px) rotate(45deg)' : '';
      hb2.style.opacity   = navOpen ? '0' : '1';
      hb3.style.transform = navOpen ? 'translateY(-7px) rotate(-45deg)' : '';
    }
  });
}

function closeNav() {
  navOpen = false;
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (hb1) { hb1.style.transform = ''; hb2.style.opacity = '1'; hb3.style.transform = ''; }
}

/* ── Scroll reveal ──────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.01, rootMargin: '0px 0px 60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Immediately reveal anything already in the viewport on page load
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 60) {
      el.classList.add('visible');
    }
  });
});

/* ── FAQ accordion ──────────────────────────── */
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-q.open').forEach(b => {
    b.classList.remove('open');
    b.nextElementSibling.classList.remove('open');
  });

  // Open this one if it was closed
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

/* ── Animated stat counters ─────────────────── */
function animateCount(el) {
  const target  = parseInt(el.dataset.count, 10);
  const suffix  = el.dataset.suffix || '';
  const prefix  = el.dataset.prefix || '';
  if (isNaN(target)) return;
  const duration = 1200;
  const step = 16;
  const steps = duration / step;
  let current = 0;
  const inc = target / steps;
  const timer = setInterval(() => {
    current = Math.min(current + inc, target);
    el.textContent = prefix + Math.round(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      animateCount(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── Lightbox ────────────────────────────────── */
const lightboxOverlay = document.createElement('div');
lightboxOverlay.className = 'lightbox-overlay';
lightboxOverlay.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img src="" alt="" />';
document.body.appendChild(lightboxOverlay);

const lightboxImg = lightboxOverlay.querySelector('img');
const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightboxOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-lightbox]').forEach(el => {
  el.addEventListener('click', () => openLightbox(el.dataset.lightbox, el.dataset.lightboxAlt));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', e => { if (e.target === lightboxOverlay) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ── Hero Gallery Slider ─────────────────────── */
(function () {
  const track = document.querySelector('.hero-gallery-track');
  const dotsContainer = document.querySelector('.hero-gallery-dots');
  if (!track || !dotsContainer) return;

  const slides = track.querySelectorAll('.hero-gallery-slide');
  const total = slides.length;
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'hero-gallery-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dotsContainer.querySelectorAll('.hero-gallery-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }

  function startTimer() { timer = setInterval(next, 3500); }
  function resetTimer() { clearInterval(timer); startTimer(); }

  startTimer();

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) { delta > 0 ? goTo(current + 1) : goTo(current - 1); resetTimer(); }
  });
})();
