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

// ── shared repo fetch: one request, 30-min cache, monitor.js reuses this ──
window.BREAKOS_REPOS = (function () {
  const USER = "nitrimandylis";
  const CACHE_KEY = "breakos-repos-v1";
  const CACHE_TTL = 1000 * 60 * 30;
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (c && Date.now() - c.at < CACHE_TTL) return Promise.resolve(c.repos);
  } catch (_) {}
  return fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=100`)
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((repos) => {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos }));
      } catch (_) {}
      return repos;
    });
})();

// ── file manager: most recently committed repos, curated copy where it exists ──
const FILE_COPY = {
  "petal.ai": {
    label: "petal_ai.app",
    verdict: "teaches. actually.",
    voice: "An AI tutor that actually teaches.",
    body: "Built in SwiftUI with the Gemini API. The insight: students don't need answers — they need the next question. Petal structures learning as dialogue, not retrieval. Native iOS, deployed, used by real IBDP students.",
    kind: "swift · ai",
  },
  "llm-mafia": {
    label: "llm_mafia.py",
    verdict: "LLMs lie. proved it.",
    voice: "LLMs lie. Proved it.",
    body: "Multi-agent Mafia game where every player is an LLM. Given social incentive, will they produce strategic deception? Yes — and eerily well. Flask backend, async agent loop.",
    kind: "python · ai",
  },
  "j.a.r.v.i.s.": {
    label: "jarvis.ts",
    verdict: "siri wasn't enough",
    voice: "A personal AI that knows the context.",
    body: "Voice-activated personal assistant with persistent memory and tool-use scaffolding. Not a wrapper — a system. Built because I wanted something that remembered what we talked about yesterday.",
    kind: "typescript · ai",
  },
  kizuna: {
    label: "kizuna.app",
    verdict: "real users. terrifying.",
    voice: "A place for people between places.",
    body: "Community platform — real-time messaging, profiles, discovery. Built from scratch because no existing product fit. Full-stack TypeScript, PostgreSQL, deployed and used by real people.",
    kind: "typescript",
  },
  cosmos: {
    label: "cosmos.glsl",
    verdict: "math as vibes",
    voice: "Scroll velocity as texture.",
    body: "Simplex noise flow field driven by scroll velocity. Fast = chaos, rest = ambient drift. Built in a weekend through vibecoding. The wallpaper behind these windows is its descendant — third generation now.",
    kind: "glsl · webgl",
  },
  focal: {
    label: "focal.py",
    verdict: "photos, but organized",
    voice: "Photo management for a camera nobody makes software for.",
    body: "Desktop photo management app for Sony Cyber-shot libraries. Import, organize, browse — built because the official tooling stopped trying. Python, runs on the desk, not the cloud.",
    kind: "python · desktop",
  },
  portfolio: {
    label: "breakos.sys",
    verdict: "you are here",
    voice: "You are looking at it.",
    body: "This site. A portfolio disguised as an operating system. It builds. It breaks. It reboots. Opening this file from inside this file is the closest breakOS gets to recursion.",
    kind: "html · css · js",
  },
};

const FILE_EXT = {
  Swift: ".app",
  Python: ".py",
  TypeScript: ".ts",
  JavaScript: ".js",
  HTML: ".html",
  CSS: ".css",
  GLSL: ".glsl",
  Shell: ".sh",
  "C++": ".cpp",
  C: ".c",
  Rust: ".rs",
  Go: ".go",
};

const FILE_COUNT = 7;
const filesTable = document.getElementById("files-table");
const filesStatus = document.getElementById("files-status");
const overlay = document.getElementById("overlay");

function fileEntry(repo) {
  const curated = FILE_COPY[repo.name.toLowerCase()] || {};
  const slug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return {
    name: curated.label || slug + (FILE_EXT[repo.language] || ".bin"),
    kind: curated.kind || (repo.language || "vibes").toLowerCase(),
    year: new Date(repo.created_at).getFullYear(),
    verdict: curated.verdict || (repo.description ? repo.description.split(/[.!?]/)[0].toLowerCase() : "no description. bold."),
    voice: curated.voice || repo.description || "No description. The commits speak, allegedly.",
    body: curated.body || [repo.description || "Undocumented.", "Written mostly in " + (repo.language || "something GitHub can't classify") + ".", "Last commit " + new Date(repo.pushed_at).toLocaleDateString() + "."].join(" "),
    meta: "kind: " + (curated.kind || (repo.language || "unknown").toLowerCase()) + "\nlast commit: " + new Date(repo.pushed_at).toLocaleDateString() + "\nstatus: " + (curated.verdict || "see commit log"),
  };
}

function openFile(f) {
  document.getElementById("ov-title").textContent = "▤ " + f.name;
  document.getElementById("ov-name").textContent = f.name;
  document.getElementById("ov-voice").textContent = f.voice;
  document.getElementById("ov-body").textContent = f.body;
  document.getElementById("ov-meta").innerText = f.meta;
  overlay.classList.add("open");
}

window.BREAKOS_REPOS.then((repos) => {
  const entries = repos
    .filter((r) => !r.fork && r.name.toLowerCase() !== "nitrimandylis")
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, FILE_COUNT)
    .map(fileEntry);
  filesTable.textContent = "";
  entries.forEach((f) => {
    const row = document.createElement("button");
    row.className = "filerow";
    ["name", "kind", "year", "verdict"].forEach((k) => {
      const span = document.createElement("span");
      if (k === "name") span.className = "fname";
      if (k === "verdict") span.className = "fverdict";
      span.textContent = f[k];
      row.appendChild(span);
    });
    row.addEventListener("click", () => openFile(f));
    filesTable.appendChild(row);
  });
  filesStatus.textContent = entries.length + " items · sorted by last commit · click a file to open";
}).catch(() => {
  filesStatus.textContent = "directory unreadable. github api said no. the work exists — github.com/nitrimandylis";
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
