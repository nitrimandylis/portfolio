// photos page: the stream from data/photos.json (written by tools/photos.py), newest first
fetch('/data/photos.json').then(r => r.json()).then(d => {
  const el = document.querySelector('#stream');
  if (!d.photos.length) { el.innerHTML = '<li><p class="lede">nothing here yet.</p></li>'; return; }
  el.innerHTML = d.photos.map(p => `
    <li><figure style="margin:0">
      <img src="/img/photos/${p.file}-1600.webp" srcset="/img/photos/${p.file}-600.webp 600w, /img/photos/${p.file}-1600.webp 1600w"
           sizes="(max-width:720px) 100vw, 1100px" width="${p.w}" height="${p.h}" alt="${p.name}" loading="lazy">
      <figcaption>${p.name}</figcaption>
    </figure></li>`).join('');
});
