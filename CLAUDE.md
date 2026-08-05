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
  monitor, breakpkg, terminal, about, mail), app icons + decor icons +
  functional trash, start menu, shutdown dialog + `#sd-modal` shell, taskbar,
  file-detail overlay, f1 lights, BSOD overlay.
- `css/breakos.css` — single stylesheet. Design tokens in `:root` (cream
  `--paper`, navy `--ink`, `--coral`, `--teal`, `--ease-strong`); a
  `[data-theme="batman"]` block remaps them to the neon-noir "batman jazz"
  palette. Window chrome uses inset box-shadow bevels. The v3 desktop block
  (stage, WM states, start menu, breakpkg, f1, trash) sits above the 720px
  "breakOS Mobile" media query.
- `js/os.js` — core: Lenis smooth scroll, the window manager (`APPS`/`WM`,
  `openApp`/`closeApp`/`minimizeApp`/`focusApp`), boot→desktop handoff,
  curated gallery (`GALLERY` + `FILE_COPY`, six featured posters), trash
  drag with attempt counter (`breakos-trash-attempts`), f1 + seal cheat
  codes, appearance toggle (persisted to `breakos-theme`; exposed as
  `window.__setTheme`/`__getTheme`), shutdown → BSOD → reboot, toasts.
  Shared GitHub fetch lives here as `window.BREAKOS_REPOS` (30-min cache,
  `breakos-repos-v1`).
- `js/boot.js` — scroll-scrubbed boot log; lines computed from real
  diagnostics (`performance`, `navigator`). Keep lines truthful — that's the
  joke. Fires `__enterDesktop` at progress ≈ 1.
- `js/breakpkg.js` — the CLI-family registry (`window.BREAKPKG`): 8 packages,
  each a real repo. Renders the breakpkg window from `BREAKOS_REPOS` data;
  agent-wrapped's version is fetched live from registry.npmjs.org (30-min
  cache, `breakos-npm-v1`). terminal.js reads `window.BREAKPKG` for
  `pkg`/`man`.
- `js/monitor.js` — GitHub repos as "processes"; real FPS/uptime; the third
  stat is scroll depth on mobile and open-window count on the desktop
  (`window.__winCount`).
- `js/terminal.js` — command parser. Add commands to `CMDS` or as cases in
  `run()`. `FILES` (its `ls`/`cat` filesystem) mirrors the six gallery
  projects; `open` routes through `window.__openApp` when booted; `pkg` and
  `man` read `window.BREAKPKG`; `defrag` calls `window.__defrag`.
- `js/wallpaper.js` — canvas halftone dots; scroll velocity feeds dot size
  and drift. `window.__defrag()` packs the dots into a grid and releases
  them (guarded against resize mid-run). In the batman-jazz theme the canvas
  is hidden and `assets/batman-jazz.jpg` becomes the wallpaper.
- `v1/` — previous design + original prototype. Frozen; do not edit or load
  from the new site.

## Libraries

GSAP 3.12 + ScrollTrigger, Lenis 1.0 — CDN `<script>` tags at the bottom of
`index.html`. Load order matters: libs → wallpaper → os → boot → monitor →
breakpkg → terminal (terminal reads `window.BREAKPKG`).

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
  (scroll locks, boot screen hidden, files window auto-opens). Drag a window,
  minimize/restore from the taskbar, open breakpkg from its icon (8 rows,
  live npm version on agent-wrapped), run `pkg list` / `man swatch` /
  `defrag` in the terminal, drag a poster to the trash (counter increments,
  file survives), type `f1`, then start menu → shut down → BSOD → reboot
  must land back on a scrollable boot log.
- **Mobile (≤720px)**: linear scroll session — boot completes, windows drift
  in, close-to-tray works, minimize buttons hidden.
- Toggle appearance (taskbar `◐ theme` or `theme batman`) and confirm the
  batman-jazz wallpaper stays readable and the choice survives a reload.
