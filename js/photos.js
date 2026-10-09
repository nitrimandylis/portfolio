// photos page: a grid from data/photos.json (written by tools/photos.py), newest first; click opens the lightbox
const grid = document.querySelector('#grid');
const box = document.querySelector('#lightbox');
const big = box.querySelector('img');
const caption = box.querySelector('p');
let photos = [];
let current = 0;

function show(i) {
  current = (i + photos.length) % photos.length;   // wrap at both ends
  const p = photos[current];
  big.src = `/img/photos/${p.file}-1600.webp`;
  big.alt = p.name;
  caption.textContent = `${p.name}  ${current + 1}/${photos.length}`;
  if (!box.open) box.showModal();
}

fetch('/data/photos.json').then(r => r.json()).then(d => {
  photos = d.photos;
  if (!photos.length) { grid.innerHTML = '<li><p class="lede">nothing here yet.</p></li>'; return; }
  grid.innerHTML = photos.map((p, i) => `
    <li><button data-i="${i}" aria-label="open ${p.name}">
      <img src="/img/photos/${p.file}-600.webp" width="600" height="600" alt="${p.name}" loading="lazy">
    </button></li>`).join('');
});

grid.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (b) show(Number(b.dataset.i));
});
box.querySelector('.prev').addEventListener('click', () => show(current - 1));
box.querySelector('.next').addEventListener('click', () => show(current + 1));
box.querySelector('.close').addEventListener('click', () => box.close());
box.addEventListener('click', e => { if (e.target === box) box.close(); });   // click outside the photo closes
box.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});   // Esc closes natively
