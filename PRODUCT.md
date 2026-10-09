# nicktrim.com

Nick's personal site. Replaces breakOS (nitrimandylis/portfolio) as the
link he hands people. Grilled 2026-10-08/09, built 2026-10-09 (this folder is
the site root: `python3 -m http.server` here and open /).

## Status (2026-10-09)

Done (layout pass 3, 2026-10-09: home is an organised 3x2 grid sized to the viewport, base type 21px, centred subpages): home table, five pages, nav, footer (songs + last film), print CSS,
handwriting SVGs (tools/handwrite_svg.py from the rm-handwrite glyphs), cv
and work content, films.json seeded from Letterboxd + daily Action, Chillax
self-hosted (fonts/, FFL licence alongside), CNAME, .nojekyll.

Deviation: photos are published by a LOCAL script, not an Action. Originals
pushed to a public repo are public whatever an Action does afterwards, so
`originals/` is gitignored and `uv run --with pillow tools/photos.py` writes
img/photos/*.webp + data/photos.json before the push. (`photos/` holds the page.)

Still placeholder (the Rome photo): img/home/* (six) and the about card.
Done 2026-10-09: work stills are real (four live-app screenshots at
1000x1000; aidetect is its README sample output and bacpack its --help in a
rendered terminal, because `due` would publish real school tasks); film
images are Letterboxd backdrops (stills, no text), square-cropped by hand;
posters were rejected because square crops cut their titles.
og.png renders from tools/og.html at 1200x630. favicon.svg, 404.html, og tags
on every page. Night shift points at nitrimandylis.github.io/os/ (live once
the repo is renamed). The handwriting has no "w" sample, so "work" borrows his
"u"; the reMarkable rewrite (Grill 2) replaces all seven SVGs. About copy is a
first draft for Nick to rewrite.
Gloss is hover-only and softer since 2026-10-09: always-on, it turned dark images silver.

## Locked

- **Audience:** business contacts and clients first, peers second.
  LinkedIn rules carry over: half business, half code; Omilia only as an
  Experience line; no F1; photography allowed.
- **Identity:** the offline Nick: films and music, lo-fi cinematic photos,
  "free-time enjoyer" voice. Lowercase, deadpan. The seal is not the personality.
- **References:** oklama.com, asaprocky.com, ionaskolonis.com.
- **Palette E3, espresso + tungsten:** base #17110d, text #efe6d6,
  muted #8f7e6c, accent #e0a35a, polaroid frame #efe9dc.
- **Home:** the polaroid table. 5 polaroids scattered on espresso, each a
  nav link: about, work, cv, films, night shift. (old site).
- **Polaroids:** CSS, Polaroid 600 proportions (88x107, image 79x79),
  SVG paper grain, recessed image, cursor-following gloss, Balatro-style
  tilt (max 8deg), lift and spring on hover. Static on touch. Reduced
  motion turns it all off. Prototype: proto/index.html.
- **Type:** Chillax (Fontshare, self-hosted) for all text. Mono only for
  data (years, dates, ratings). Nick's own handwriting (rm-handwrite strokes,
  small SVGs) for the polaroid captions and the name top-left, like a
  signature. Instrument Sans/Serif, Geist, Sentient, Bespoke Serif rejected.
- **Home chrome:** handwritten name top-left, nothing top-right (no clock:
  that is Ionas's move), song/film line bottom-left, email + linkedin bottom-right.
- **Mobile home:** loose two-column stack, 3 rows, each card slightly rotated
  and offset; normal flow (grid), no absolute positions; static cards on touch.
- **Physics stops there:** no idle sway, no drag/toss, no holo foil.
- **Footer line:** content/songs.txt (16 songs), one random song per page load, no cycling (changed 2026-10-09: the 8s rotation distracted); a hand-picked list of favourite songs
  (not live), plus last Letterboxd film (public RSS, nick_trim8).
- **Films page:** top four as polaroid posters (hand-set: The Odyssey,
  Pacific Rim, Across the Spider-Verse, Shutter Island); one stats line (films this
  year, lifetime = seeded 64 + logged, typical rating); diary list with
  his reviews verbatim. Data: a daily GitHub Action reads
  letterboxd.com/nick_trim8/rss/ (20 items, no CORS, browser fetch verified
  blocked 2026-10-09) and APPENDS to films.json so history outlives the feed.
  Footer "last watched" reads the same file.
- **About page:** one polaroid (not a headshot) + three short lowercase
  paragraphs: who/where (Athens, final-year IB, free-time enjoyer); what he
  does (starts things then builds them; Akademix JA national 2nd, MIT
  FutureBuilders, ACSTAC 3rd in one sentence; link /work); off the keyboard
  (films, music, photography; link /films). No skills grid, no Omilia, no
  UCL/uni plans, no F1. Copy through writing-style; Nick's rewrites win.
- **Photos page:** prints on the table: real-shape photos on cream print borders, slight tilts, in a grid (2026-10-09: the one-per-row stream scrolled too long, square crops looked generic and cut the portraits),
  click opens a native <dialog> lightbox with arrow keys, filename as caption, newest first. Nick drops files in photos/ and pushes;
  a GitHub Action makes WebP copies (~1600 and ~600px), STRIPS EXIF/GPS,
  writes photos.json. Originals never published. No Instagram source
  (private account, API dead since Dec 2024).
- **CV page:** Ionas-style. One line per entry, key results in tungsten,
  "as of" date in the header, small languages table, closing "email me for
  the full one". Draft: content/cv.txt (from Drive CV Draft 3). Public cuts:
  DOB, address, phone, averages, EE/IA titles, CS50, ASKUS, duty paragraphs,
  interests. JA promotion award kept (Nick). HTML is the public master; the
  docx stays the private full version. Print stylesheet for PDF.
- **Pages:** about, work, cv, films, photos. Home has six polaroids:
  about, work, cv, films, photos, night shift. (-> os.nicktrim.com). Contact = email + LinkedIn in the footer.
- **Work:** featured + index. Featured (polaroid still + two sentences):
  tokenpilot, llm-mafia, aidetect, bacpack, gridcast, blither. Featured ==
  GitHub pins (Nick swaps WhimprFlow -> blither in the pins). Below: a
  quiet credits-style index of every other live project (apex, petal.ai,
  whimprflow, swatch, the CLIs...). The work page is the only full list.
  Off: amtf, pitch, cosmos, blacksite, deeplarp until v1.
  F1 projects (apex, gridcast) are listed plainly as F1: the no-F1 rule
  covers personal bios, not the work page (decided 2026-10-09).
- **Domain:** nicktrim.com (.com, paid, Nick buys at Cloudflare or Porkbun).
  Live Vercel projects get subdomains (x.nicktrim.com); GitHub Pages
  projects ride along as paths if this repo is nitrimandylis.github.io.
- **Stack:** static, GitHub Pages, no framework, no build step, no
  component library (shadcn / 21st.dev rejected: React + build step for
  a site with no interactive components).

## breakOS (decided 2026-10-09)

- Repo `portfolio` is renamed `os`, served at **os.nicktrim.com** (CNAME
  file + DNS `os` CNAME nitrimandylis.github.io). Fix og:url (index.html:11).
  A NEW repo named `portfolio` hosts nicktrim.com. Separate repos: Pages is
  one domain per repo.
- Linked from the night-shift polaroid. Start menu gets "back to nicktrim.com".
- Goal: zero hand-kept facts. Cut list:
  - file manager: projects replaced by fixed joke files + `the_real_list.url`
    -> nicktrim.com/work. Trash + terminal `ls` use the same joke files.
    GALLERY / FILE_COPY / TRASH_QUIPS / FILES pin mirror goes away.
  - breakpkg: list generated from the GitHub API (CLI repos, e.g. those with
    man/), not hand-kept. Jokes stay.
  - About window: keep the joke spec lines and seal; cut peripherals count,
    stack line, bio paragraph.
  - coursework .docx icons: cut.
  - Everything else stays (monitor, terminal, mail, decor, themes, eggs).
  - Bump boot-ver to v4.
  - **One theme: E3.** Remap the :root vars in css/breakos.css to espresso +
    tungsten (paper #17110d, ink #efe6d6, ink-soft #8f7e6c, coral #e0a35a;
    teal and bevels re-derived). Remove theming entirely: js/swatchbook.js,
    the dark-theme block, the taskbar theme button, the head restore script,
    terminal `theme` and `swatch apply`/`swatch list` (swatch becomes a
    refusal quip like the other CLIs). VT323/Plex chrome fonts stay.

## Grill 2 (2026-10-09): polish and launch gate

- **Home line:** one muted lowercase line under the handwritten name, top-left.
  Matches his GitHub and LinkedIn bios. Draft: "athens, final-year ib. builds
  tools, ships them, occasionally finishes them." Nick rewrites.
- **og:image:** handwritten name on espresso (og.png) now; swap to a home-table
  crop once real photos land. Plus og:title/description on every page.
- **Favicon:** tiny tilted polaroid SVG, tungsten photo square.
- **Night shift:** links to nitrimandylis.github.io/os/ after the rename, then
  os.nicktrim.com at step 7. Never a dead link.
- **Photos page:** launch blocker, ~8 photos in the stream before go-live.
- **Films stats:** "usually ★★★★★. i like films." The joke suffix only while the
  median is 5. Diary shows the latest 20; films.json keeps everything.
- **Handwriting:** home only (name + six doors). Work/films captions stay in
  Chillax. Nick writes the 7 words on one reMarkable page, 2-3 takes each;
  strokes are extracted to SVG (replaces the glyph-assembled SVGs).
- **Stills:** Claude generates work stills (app/terminal screenshots, square)
  and the top-four film posters. Nick's camera roll covers home x6 + about.
- **Palette:** suspected, judged only after real photos. Candidates vs E3:
  darker espresso #0f0b09, warm charcoal #141312, cool night #0d1014.
  Side-by-side screenshots of home/about/films. Lamp-light background rejected.
- **Launch gate:** real photos (7 + stream), reMarkable handwriting, about and
  home line in Nick's words, palette settled, domain + repo rename, stills,
  code batch (og, favicon, 404, films fixes, mobile footer wrap, escaping).
  Work blurb rewrites are NOT a blocker.

## Open

- Photos: six for the home polaroids, his own, TBD (build with placeholders).
- kizuna and amtf stay off the domain.

Research: ~/cc/reports/Minimal dark personal sites.md

## Build order (proposed 2026-10-09)

1. Nick buys nicktrim.com (only blocks step 7).
2. Rename repo portfolio -> os; create new repo portfolio.
3. ~~Site skeleton~~ done 2026-10-09.
4. ~~Handwriting SVGs~~ done 2026-10-09.
5. Content: ~~cv, work~~ done; about copy awaits Nick's rewrite; real stills and photos.
6. ~~films Action~~ done; photos is a local script (see Status).
7. breakOS v4 cut + E3 theme, os.nicktrim.com; DNS for apex, os, and project
   subdomains; update LinkedIn, GitHub blog field, pins (blither in).
