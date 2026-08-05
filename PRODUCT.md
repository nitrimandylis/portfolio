# PRODUCT — breakOS (portfolio)

## What it is

Nick's developer portfolio at nitrimandylis.github.io/portfolio, styled as a
fictional operating system called breakOS. Static site, zero build step,
vanilla JS + GSAP/Lenis from CDN. The bit is commitment: the boot log prints
real diagnostics, the system monitor streams real GitHub repos, the package
manager shows a real live npm version, and every joke grows out of a working
feature.

## Current state (v3.0, Aug 2026)

- Scroll-scrubbed boot → real desktop session on >720px: draggable windows,
  z-order, minimize/maximize, taskbar app switcher, start menu, shutdown →
  BSOD → reboot loop.
- Mobile (≤720px) keeps the linear scroll session, branded breakOS Mobile.
- Curated six in the file manager: petal.ai, tokenpilot, apex, llm-mafia,
  agent-wrapped, ib-news-site.
- breakpkg window + terminal `pkg`/`man` commands cover the CLI family:
  swatch, juke, jazz, bacpack, dt, cine, agent-wrapped. (sealfetch looked
  like one but is a wallpaper repo — it stays out.)
- Easter eggs: seal, f1 start lights, trash-attempt counter, defrag, console
  kernel, rm -rf /, vim.
- Two themes: cream (default) and batman-jazz (dark), persisted.

## Where it's headed

- Rotate the curated six as projects ship; the CLI family grows in breakpkg
  (excali and ai-detect are candidates when they mature).
- Possible v3.x: window resize handles, visitor-presence gimmick, a real
  `screensaver` after idle.
- Constraint that will not move: no frameworks, no build step, every stat
  shown must be true.
