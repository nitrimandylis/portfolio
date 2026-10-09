// films page: one stats line and the diary, both from data/films.json (filled daily by a GitHub Action)
const SEED = 64;   // films watched before the Letterboxd account existed
// stars() and esc() come from footer.js, which loads first on every page
fetch('/data/films.json').then(r => r.json()).then(d => {
  const films = d.films, year = new Date().getFullYear();
  const thisYear = films.filter(f => f.watched.startsWith(year)).length;
  const rated = films.map(f => f.rating).filter(r => r != null).sort((a, b) => a - b);
  const typical = rated.length ? rated[Math.floor(rated.length / 2)] : null;
  document.querySelector('#stats').textContent =
    `${thisYear} films this year, ${SEED + films.length} that i know of` + (typical ? `, usually ` : '.');
  if (typical) {
    const s = document.createElement('span'); s.className = 'rating'; s.textContent = stars(typical);
    document.querySelector('#stats').append(s, typical === 5 ? '. i like films.' : '.');   // the joke only holds at five stars
  }
  // latest 20 only; films.json keeps the full history
  document.querySelector('#diary').innerHTML = films.slice(0, 20).map(f => `
    <li>
      <div class="line"><time datetime="${f.watched}">${f.watched}</time>
        <a href="${f.url}">${esc(f.title.toLowerCase())}</a> <span class="year">${f.year}</span>
        <span class="rating">${stars(f.rating)}</span>${f.rewatch ? ' <span class="mono">again</span>' : ''}</div>
      ${f.review ? `<div class="review">${f.review.split('\n').map(p => `<p>${esc(p)}</p>`).join('')}</div>` : ''}
    </li>`).join('');
});
