// bottom-left: one random favourite song per page load (content/songs.txt), and the last film logged
const song = document.querySelector('#song'), film = document.querySelector('#film');
// a beamed eighth-note pair, same 22px slot as the film poster below it
const NOTE = '<svg class="note" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M9 3v11.6A3.6 3.6 0 1 0 11 18V8.3l8-2V12.6A3.6 3.6 0 1 0 21 16V3L9 6z"/></svg>';
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const stars = r => r == null ? '' : '★'.repeat(Math.floor(r)) + (r % 1 ? '½' : '');
fetch('/content/songs.txt').then(r => r.text()).then(t => {
  const songs = t.split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'));
  if (!songs.length) return;
  const pick = songs[Math.floor(Math.random() * songs.length)];
  const [title, ...artist] = pick.toLowerCase().split(',');
  song.innerHTML = `<i>on repeat</i>${NOTE}<span class="t"><b>${esc(title)}</b><em>${esc(artist.join(',').trim())}</em></span>`;
});
if (film) fetch('/data/films.json').then(r => r.json()).then(d => {
  const f = d.films[0];
  if (!f) return;
  film.innerHTML = `<i>last watched</i><a href="${f.url}">${f.poster ? `<img src="${f.poster}" alt="" width="22" height="33" onerror="this.remove()">` : ''}<b>${esc(f.title.toLowerCase())}</b></a><span class="rating">${stars(f.rating)}</span>`;
});
