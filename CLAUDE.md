# breakOS — developer portfolio

Static site, no build step. A portfolio styled as a fictional operating system
("breakOS"). Serve with `python3 -m http.server` for local dev; opening
`index.html` directly also works.

## Architecture

Two modes, one markup, decided once per page load at the 720px breakpoint:

- **Desktop (>720px)**: scroll drives only the boot log. At 100% boot,
  `boot.js` calls `window.__enterDesktop()` (os.js): body gets `.booted`,
  scroll locks, windows are adopted into a fixed `#stage` and managed by a
  real window manager — drag by titlebar, z-order on pointerdown anywhere in
  a window, minimize/maximize/close, taskbar app switcher, start menu,
  shutdown modal. `exitDesktop()` (via BSOD reboot) reverses all of it.
- **Mobile (≤720px)**: the original linear scroll session, untouched — windows
  in `.ws` sections, drift-in on scroll, close-to-tray buttons.

Files:

- `index.html` — all markup: boot section, six `.window` sections (files,
  monitor, breakpkg, terminal, about, mail), desktop icons (app launchers,
  coursework `.docx` icons, decor, functional trash), start menu, shutdown
  dialog + `#sd-modal` shell, taskbar, file-detail overlay, f1 lights, BSOD
  overlay.
- `css/breakos.css` — single stylesheet. Design tokens in `:root` (cream
  `--paper`, navy `--ink`, `--coral`, `--teal`, `--ease-strong`); a
  `[data-theme="batman"]` block remaps them to the neon-noir "batman jazz"
  palette. Window chrome uses inset box-shadow bevels. The v3 desktop block
  (stage, WM states, start menu, breakpkg, f1, trash) sits above the 720px
  "breakOS Mobile" media query.
- `js/os.js` — core: Lenis smooth scroll, the window manager (`APPS`/`WM`,
  `openApp`/`closeApp`/`minimizeApp`/`focusApp`; maximize parks inline
  left/top in `st.premax`, dragging a maximized titlebar unsnaps it), the
  desktop icon system (single click selects, double-click opens, drag with
  positions persisted to `breakos-icons-v1` as vw/vh, background marquee;
  no parallax — parallax used to scrub icons off-screen), boot→desktop
  handoff, curated gallery (`GALLERY` + `FILE_COPY`), coursework overlay
  (`DOC_COPY` — described, never downloadable), trash drag with attempt
  counter (`breakos-trash-attempts`), f1 + seal + claude + mafia cheat codes
  (clawd renders the canonical pixel grid on a canvas, `window.__clawd`; the
  mafia night phase uses llm-mafia.vercel.app's shell tokens and cast, and
  its vote closes a real open window via `closeApp` — case numbers continue
  the site's library from 037, `breakos-mafia`), appearance
  toggle (persisted to `breakos-theme`), shutdown → BSOD → reboot, toasts.
  Shared GitHub fetch lives here as `window.BREAKOS_REPOS` (30-min cache,
  `breakos-repos-v1`).
- `js/boot.js` — scroll-scrubbed boot log; lines computed from real
  diagnostics (`performance`, `navigator`). Keep lines truthful — that's the
  joke. Fires `__enterDesktop` at progress ≈ 1.
- `js/breakpkg.js` — the CLI-family registry (`window.BREAKPKG`): 12 packages,
  each a real repo, with `manUrl` for the nine repos that ship `man/<bin>.1`
  and a `quip` for running the bin in a tab. (sealfetch is not in it — that
  repo is wallpapers, not a CLI.) Renders the breakpkg window
  from `BREAKOS_REPOS` data; the npm versions (agent-wrapped, brushwork) are
  fetched live from registry.npmjs.org (30-min cache, `breakos-npm-v1`).
  Non-npm rows show `chan` if set (aidetect is `pypi`), else "source".
- `js/monitor.js` — GitHub repos as "processes"; real FPS/uptime; the third
  stat is scroll depth on mobile and open-window count on the desktop
  (`window.__winCount`).
- `js/terminal.js` — command parser. Add commands to `CMDS` or as cases in
  `run()`. `FILES` (its `ls`/`cat` filesystem) mirrors the six gallery
  projects; `open` routes through `window.__openApp` when booted; `pkg
  list`/`pkg info` read `window.BREAKPKG` (there is no `pkg install` —
  everything is preinstalled, that's the joke); `man <bin>` fetches the
  repo's real `man/<bin>.1` (30-min cache, `breakos-man-<bin>`) and renders
  it via `renderRoff` (a roff-lite formatter, only the macros those pages
  use); typing a bin name runs its deadpan refusal quip; `defrag` calls
  `window.__defrag`; `claude` enters a scripted interactive Claude Code
  mode (`mode` state machine, keyword-matched responses + a fake permission
  flow — no API behind it, keep it that way). Its startup renders a
  recreation of the real Claude Code TTY (`.cc-*` classes: bordered banner,
  clawd sprite via `window.__clawdSprite`, status block with a real-uptime
  session bar), and the prompt becomes a terracotta `❯` with a pink caret.
- `js/swatchbook.js` — lazy theme registry (`window.BREAKOS_SWATCHBOOK()`):
  fetches the real `palette.toml` files from the swatchbook repo (24h cache,
  `breakos-swatchbook-v1`, minimal TOML parser). batman-jazz is skipped —
  the site ships a hand-tuned build of it. os.js maps roles → CSS vars
  (`varsFromRoles`), stamps `data-theme="swatch"` + `data-variant`, and
  snapshots vars to `breakos-theme-vars` so the head script can restore a
  custom theme before first paint with no fetch. `[data-variant="dark"]`
  carries the dark-theme CSS overrides.
- `js/wallpaper.js` — canvas halftone dots; scroll velocity feeds dot size
  and drift. Dot colour follows the theme via `window.__setWallDot`.
  `window.__defrag()` packs the dots into a grid and releases
  them (guarded against resize mid-run). In the batman-jazz theme the canvas
  is hidden and `assets/batman-jazz.jpg` becomes the wallpaper.
- `v1/` — previous design + original prototype. Frozen; do not edit or load
  from the new site.

## Libraries

GSAP 3.12 + ScrollTrigger, Lenis 1.0 — CDN `<script>` tags at the bottom of
`index.html`. Load order matters: libs → wallpaper → swatchbook → os → boot →
monitor → breakpkg → terminal (terminal reads `window.BREAKPKG` and
`window.BREAKOS_SWATCHBOOK`).

## Conventions

- Tone of all copy: deadpan, self-aware, never random. Jokes must emerge from
  a real working feature (the BSOD reboots, the stats are real, the terminal
  executes, the trash counts). No popup-spam gags. No fake version numbers —
  GitHub-only CLIs show "source", not an invented semver.
- Honor `prefers-reduced-motion` (`REDUCED` flag in os.js) for any new
  animation. UI enters ~200ms strong ease-out from scale ≈ .94; exits faster
  (~140ms); animate transform/opacity only.
- VT323 for OS chrome text, Atkinson Hyperlegible for body copy, IBM Plex
  Mono for data tables.
- No frameworks, no build tooling — keep it static.

## Verify changes

`node --check js/*.js` for syntax; then serve and check both modes:

- **Desktop (>720px)**: scroll the boot to 100% — desktop must take over
  (scroll locks, boot screen hidden, files window auto-opens). Drag a
  window; maximize one (must fill the stage, body must wheel-scroll), drag
  its titlebar (must unsnap), close it maximized and reopen (must come back
  normal with a □ glyph). Drag an icon (position must survive reload),
  marquee-select a few, double-click a `.docx` (overlay, no download). Run
  `pkg list` (12 rows) / `pkg info swatch` / `man juke` (real man page) /
  `swatch` / `defrag` in the terminal, drag a poster to the trash (counter
  increments, file survives), type `f1`, then start menu → shut down →
  BSOD → reboot must land back on a scrollable boot log.
- **Mobile (≤720px)**: linear scroll session — boot completes, windows drift
  in, close-to-tray works, minimize buttons hidden.
- Toggle appearance (taskbar `◐ theme` or `theme batman`) and confirm the
  batman-jazz wallpaper stays readable and the choice survives a reload.
