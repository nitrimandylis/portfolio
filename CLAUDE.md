# breakOS — developer portfolio

Static site, no build step. A portfolio styled as a fictional operating system
("breakOS"). Serve with `python3 -m http.server` for local dev; opening
`index.html` directly also works.

## Architecture

- `index.html` — all markup: boot section, five `.window` sections, shutdown
  dialog, taskbar, file-detail overlay, BSOD overlay.
- `css/breakos.css` — single stylesheet. Design tokens in `:root` (cream
  `--paper`, navy `--ink`, `--coral`, `--teal`). Window chrome uses inset
  box-shadow bevels. Mobile breakpoint at 720px ("breakOS Mobile").
- `js/os.js` — core: Lenis smooth scroll, GSAP drift-in animations, icon
  parallax, window manager (close → taskbar tray button, maximize), file
  manager data (`FILES`), shutdown → BSOD → reboot, toasts, easter eggs.
- `js/boot.js` — scroll-scrubbed boot log; lines computed from real
  diagnostics (`performance`, `navigator`). Keep lines truthful — that's the
  joke.
- `js/monitor.js` — GitHub repos for `nitrimandylis` as "processes";
  30-min localStorage cache (`breakos-repos-v1`); real FPS/scroll/uptime stats.
- `js/terminal.js` — command parser. Add commands to `CMDS` or as cases in
  `run()`.
- `js/wallpaper.js` — canvas halftone dots; scroll velocity feeds dot size and
  drift.
- `v1/` — previous design + original prototype. Frozen; do not edit or load
  from the new site.

## Libraries

GSAP 3.12 + ScrollTrigger, Lenis 1.0 — CDN `<script>` tags at the bottom of
`index.html`. Load order matters: libs → wallpaper → os → boot → monitor →
terminal.

## Conventions

- Tone of all copy: deadpan, self-aware, never random. Jokes must emerge from
  a real working feature (the BSOD reboots, the stats are real, the terminal
  executes). No popup-spam gags.
- Honor `prefers-reduced-motion` (`REDUCED` flag in os.js) for any new
  animation.
- VT323 for OS chrome text, Atkinson Hyperlegible for body copy, IBM Plex
  Mono for data tables.
- No frameworks, no build tooling — keep it static.

## Verify changes

`node --check js/*.js` for syntax; then load the page and scroll the full
length: boot must complete, windows drift in, monitor populates, terminal
accepts input, shutdown BSODs and reboots to top.
