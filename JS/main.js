// ── Animations génériques via IntersectionObserver ─────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  animateOnScroll('.poke-card',    5);
  animateOnScroll('.podium-card', 120);
  animateOnScroll('.lb-row',       10);
  animateOnScroll('.rules-card',   80);
  animateOnScroll('.home-card',    100);
});

function animateOnScroll(selector, staggerDelay) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.index || 0) * staggerDelay;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach((el, i) => {
    el.dataset.index = i;
    observer.observe(el);
  });
}


// ── Tri : manquants en premier ─────────────────────────────────────────────

let missingFirst = false;

function toggleMissingFirst() {
  const grids = document.querySelectorAll('.dex-grid');
  const btn   = document.getElementById('btn-sort');
  if (!grids.length) return;

  missingFirst = !missingFirst;

  grids.forEach(grid => {
    const cards = Array.from(grid.querySelectorAll('.poke-card'));

    if (missingFirst) {
      const missing = cards.filter(c => c.classList.contains('missing'));
      const found   = cards.filter(c => !c.classList.contains('missing'));
      [...missing, ...found].forEach(c => grid.appendChild(c));
    } else {
      cards
        .sort((a, b) => parseInt(a.dataset.index) - parseInt(b.dataset.index))
        .forEach(c => grid.appendChild(c));
    }
  });

  if (missingFirst) {
    btn.classList.add('active');
    btn.innerHTML = '<span class="sort-icon">✦</span> Ordre original';
  } else {
    btn.classList.remove('active');
    btn.innerHTML = '<span class="sort-icon">❓</span> Afficher les manquants en premier';
  }
}
