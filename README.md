# breakOS

> v2.6.11 — it builds. it breaks. it reboots.

My developer portfolio, disguised as a fictional operating system. Scrolling
boots it. Closing windows actually closes them. The terminal works. `rm -rf /`
does what you'd hope.

**Live**: open `index.html` — or `python3 -m http.server` and visit
`localhost:8000`. No build step, no dependencies to install.

## What's inside

| Window | What it does |
|---|---|
| boot log | scroll-driven; every line is a true diagnostic of your actual page load |
| `~/things-i-made` | file manager of curated projects — click a file to open it |
| System Monitor | **live** repos from the GitHub API as processes (real sizes, real push times), plus your real FPS and scroll depth |
| terminal | functional shell — try `help`, `sudo hire-nick`, or `rm -rf /` |
| About This Computer | the seal is the mascot. non-negotiable |
| Shut down? | [Yes] [Also Yes] → BSOD → reboot |

## Stack

Static HTML/CSS/JS. GSAP + ScrollTrigger for scroll choreography, Lenis for
smooth scroll (both via CDN), a `<canvas>` halftone wallpaper that reacts to
scroll velocity. Fonts: VT323, Atkinson Hyperlegible, IBM Plex Mono.

## Structure

```
index.html        the whole OS
css/breakos.css   design system (cream CRT, ink navy, coral, teal)
js/wallpaper.js   scroll-reactive halftone canvas
js/boot.js        scroll-driven boot log (honest diagnostics)
js/os.js          window manager, taskbar, shutdown/BSOD, easter eggs
js/monitor.js     live GitHub repos + real system stats
js/terminal.js    the shell
assets/seal.png   mascot.service
v1/               previous design (dark organic brutalism), kept for archaeology
```

## Easter eggs

There are several. Opening the browser console is a good start. Typing a
certain four-letter marine mammal is another.

---
built by [Nikolas Trimandylis](https://github.com/nitrimandylis) · nicktrim8@duck.com (yes, the email is a duck)
