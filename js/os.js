// ════════════════════════════════════════════════
//  OS CORE — smooth scroll, window manager, taskbar,
//  file manager, shutdown/BSOD, and the humor runtime
// ════════════════════════════════════════════════
gsap.registerPlugin(ScrollTrigger);
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Lenis smooth scroll ──
if (!REDUCED) {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ── kernel log (console easter egg) ──
console.log(
  "%cbreakOS kernel 2.6.11%c\n[ ok ] devtools detected — promoting visitor to power user\n[ ok ] this console is the only part of the site with no CSS. enjoy the silence\n[warn] the OS is a metaphor. the repos are real: https://github.com/nitrimandylis\n[ ok ] try typing `seal` on the page. or `rm -rf /` in the terminal window. coward.",
  "color:#f25c4a;font-size:20px;font-family:monospace;font-weight:bold",
  "color:#1f8a8c;font-family:monospace;font-size:12px",
);

// ── tab title gag ──
const REAL_TITLE = document.title;
document.addEventListener("visibilitychange", () => {
  document.title = document.hidden ? "breakOS — suspended (it'll keep)" : REAL_TITLE;
});

// ── clock ──
function tickClock() {
  const d = new Date();
  document.getElementById("tb-clock").textContent =
    String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}
tickClock();
setInterval(tickClock, 10000);

// ── scroll progress in taskbar ──
window.addEventListener(
  "scroll",
  () => {
    const el = document.documentElement;
    const pct = el.scrollTop / (el.scrollHeight - el.clientHeight) || 0;
    document.getElementById("tb-progress-fill").style.width = pct * 100 + "%";
  },
  { passive: true },
);

// ── OS toast (speed judge + system notices) ──
const toast = document.getElementById("os-toast");
let toastBusy = false;
function notify(msg, ms = 2800) {
  if (toastBusy) return;
  toastBusy = true;
  toast.textContent = msg;
  toast.classList.add("visible");
  setTimeout(() => {
    toast.classList.remove("visible");
    toastBusy = false;
  }, ms);
}
window.__notify = notify;

if (!REDUCED) {
  let lastY = window.scrollY,
    lastT = performance.now(),
    cool = 0;
  const FAST = [
    "notice: scroll velocity exceeds reading speed",
    "the windows drift in nicely, you know. if you let them.",
    "achievement unlocked: speedrun (portfolio%)",
  ];
  window.addEventListener(
    "scroll",
    () => {
      const now = performance.now();
      const v = Math.abs(window.scrollY - lastY) / Math.max(now - lastT, 1);
      lastY = window.scrollY;
      lastT = now;
      if (v > 7 && now > cool) {
        cool = now + 18000;
        notify(FAST[Math.floor(Math.random() * FAST.length)]);
      }
    },
    { passive: true },
  );
}

// ── window drift-in + icon parallax ──
if (!REDUCED) {
  document.querySelectorAll(".window[data-drift]").forEach((win) => {
    const fromLeft = win.dataset.drift === "left";
    gsap.from(win, {
      x: fromLeft ? -160 : 160,
      y: 80,
      rotation: fromLeft ? -2.5 : 2.5,
      opacity: 0,
      ease: "power3.out",
      duration: 1.1,
      scrollTrigger: { trigger: win, start: "top 85%" },
    });
  });
  document.querySelectorAll(".icon").forEach((icon) => {
    const depth = parseFloat(icon.dataset.depth || 0.05);
    gsap.to(icon, {
      y: () => -window.innerHeight * depth * 8,
      ease: "none",
      scrollTrigger: { trigger: "#desktop", start: "top top", end: "bottom bottom", scrub: 1.2 },
    });
  });
  gsap.from(".shutdown-dialog", {
    scale: 0.7,
    opacity: 0,
    ease: "back.out(1.6)",
    duration: 0.7,
    scrollTrigger: { trigger: "#ws-shutdown", start: "top 70%" },
  });
}

// ── window manager: close / maximize / tray ──
const tray = document.getElementById("tb-tray");
const CLOSE_QUIPS = {
  "things-i-made": "things-i-made moved to Trash. the projects remain shipped.",
  "system-monitor": "monitor closed. the processes keep running. they always do.",
  terminal: "terminal closed. it whispered 'logout' as it went.",
  about: "about.app moved to Trash. bold move.",
  "new-message": "draft discarded. the duck email waits patiently.",
};

document.querySelectorAll(".window .tb-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const win = btn.closest(".window");
    if (win.classList.contains("overlay-win")) return; // overlay handles itself
    const app = win.dataset.app;
    if (btn.dataset.act === "close") {
      win.classList.add("closed");
      win.classList.remove("maximized");
      notify(CLOSE_QUIPS[app] || app + " closed.");
      const b = document.createElement("button");
      b.className = "tb-app";
      b.textContent = "▣ " + app;
      b.title = "reopen " + app;
      b.addEventListener("click", () => {
        win.classList.remove("closed");
        b.remove();
        notify(app + " restored from Trash. no questions asked.");
        win.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
      });
      tray.appendChild(b);
    } else if (btn.dataset.act === "max") {
      win.classList.toggle("maximized");
      btn.textContent = win.classList.contains("maximized") ? "❐" : "□";
    }
  });
});

// ── start button ──
document.getElementById("tb-start").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
  notify("start menu not found. there is only scroll.");
});

// ── file manager: curated projects ──
const FILES = [
  {
    name: "petal_ai.app",
    voice: "An AI tutor that actually teaches.",
    body: "Built in SwiftUI with the Gemini API. The insight: students don't need answers — they need the next question. Petal structures learning as dialogue, not retrieval. Native iOS, deployed, used by real IBDP students.",
    meta: "kind: swift · swiftui · gemini api · ai\nstatus: deployed. used. improved.",
  },
  {
    name: "llm_mafia.py",
    voice: "LLMs lie. Proved it.",
    body: "Multi-agent Mafia game where every player is an LLM. Given social incentive, will they produce strategic deception? Yes — and eerily well. Flask backend, async agent loop.",
    meta: "kind: python · flask · ai\nstatus: the models are still lying somewhere",
  },
  {
    name: "jarvis.ts",
    voice: "A personal AI that knows the context.",
    body: "Voice-activated personal assistant with persistent memory and tool-use scaffolding. Not a wrapper — a system. Built because I wanted something that remembered what we talked about yesterday.",
    meta: "kind: typescript · next.js · ai\nstatus: remembers more than I do",
  },
  {
    name: "kizuna.app",
    voice: "A place for people between places.",
    body: "Community platform — real-time messaging, profiles, discovery. Built from scratch because no existing product fit. Full-stack TypeScript, PostgreSQL, deployed and used by real people.",
    meta: "kind: typescript · next.js · postgres\nstatus: production. real users. terrifying.",
  },
  {
    name: "cosmos.glsl",
    voice: "Scroll velocity as texture.",
    body: "Simplex noise flow field driven by scroll velocity. Fast = chaos, rest = ambient drift. Built in a weekend through vibecoding. The wallpaper behind these windows is its descendant — third generation now.",
    meta: "kind: glsl · webgl · typescript\nstatus: ancestor of this very page",
  },
];

const overlay = document.getElementById("overlay");
document.querySelectorAll(".filerow[data-file]").forEach((row) => {
  row.addEventListener("click", () => {
    const f = FILES[+row.dataset.file];
    if (!f) return;
    document.getElementById("ov-title").textContent = "▤ " + f.name;
    document.getElementById("ov-name").textContent = f.name;
    document.getElementById("ov-voice").textContent = f.voice;
    document.getElementById("ov-body").textContent = f.body;
    document.getElementById("ov-meta").innerText = f.meta;
    overlay.classList.add("open");
  });
});
document.getElementById("ov-close").addEventListener("click", () => overlay.classList.remove("open"));
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.classList.remove("open");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") overlay.classList.remove("open");
});

// ── shutdown → BSOD → reboot ──
const bsod = document.getElementById("bsod");
function crash() {
  bsod.classList.add("on");
  bsod.setAttribute("aria-hidden", "false");
  let pct = 0;
  const pctEl = document.getElementById("bsod-pct");
  const iv = setInterval(() => {
    pct = Math.min(pct + Math.floor(Math.random() * 22), 100);
    pctEl.textContent = pct + "% complete";
    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(reboot, 700);
    }
  }, 350);
}
function reboot() {
  bsod.classList.remove("on");
  bsod.setAttribute("aria-hidden", "true");
  window.scrollTo({ top: 0, behavior: "auto" });
  notify("rebooted. welcome back. it's still a portfolio.");
}
window.__crash = crash;
document.getElementById("sd-yes").addEventListener("click", crash);
document.getElementById("sd-alsoyes").addEventListener("click", crash);
bsod.addEventListener("click", reboot);

// ── uptime (honest visit counter, reborn) ──
let visits = 1;
try {
  visits = (parseInt(localStorage.getItem("breakos-visits") || "0", 10) || 0) + 1;
  localStorage.setItem("breakos-visits", String(visits));
} catch (_) {}
document.getElementById("sd-uptime").textContent =
  visits === 1
    ? "boot #1 on this machine — localStorage says we've never met. hi."
    : `boot #${visits} — counted by your own localStorage. you surveil yourself.`;

// ── seal cheat code ──
let kbuf = "";
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.key.length !== 1) return;
  kbuf = (kbuf + e.key.toLowerCase()).slice(-4);
  if (kbuf === "seal") {
    const img = document.createElement("img");
    img.src = "assets/seal.png";
    img.alt = "";
    img.className = "seal-takeover";
    document.body.appendChild(img);
    notify("mascot.service activated");
    setTimeout(() => img.remove(), 4000);
  }
});
