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