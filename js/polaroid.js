// tilt toward the cursor like a held card, sheen follows. hover-only: touch and reduced motion get static cards
const live = matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
if (live) for (const p of document.querySelectorAll('.pol')) {
  p.classList.add('live');
  p.addEventListener('pointermove', e => {
    const r = p.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    p.style.setProperty('--ry', (x - .5) * 16 + 'deg');   // max 8deg each way
    p.style.setProperty('--rx', (.5 - y) * 16 + 'deg');
    p.style.setProperty('--lift', '-6px');
    p.style.setProperty('--gx', x * 100 + '%'); p.style.setProperty('--gy', y * 100 + '%');
  });
  p.addEventListener('pointerleave', () => { p.style.setProperty('--rx', '0deg'); p.style.setProperty('--ry', '0deg'); p.style.setProperty('--lift', '0px'); });
}
