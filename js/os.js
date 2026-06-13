// ════════════════════════════════════════════════
//  OS CORE — smooth scroll, window manager, taskbar,
//  file manager, shutdown/BSOD, and the humor runtime
// ════════════════════════════════════════════════
gsap.registerPlugin(ScrollTrigger);
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Lenis smooth scroll ──
if (!REDUCED) {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  window.__lenis = lenis;
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
  const ICON_TOASTS = {
    "my_computer":            "no drives found. the computer is fine.",
    "recycle bin (full)":     "85 items. you'll need those someday.",
    "untitled_final_v2_REAL": "there are 11 more versions. this is the real one.",
    "do_not_open.txt":        "too late.",
    "dial_up.exe":            "connecting… 56k… connected. do not pick up the phone.",
    "passwords.txt":          "hunter2. always hunter2.",
    "shortcut to shortcut":   "this is a shortcut to a shortcut. the original was lost.",
    "important_FINAL_v3.zip": "contains: important_FINAL_v2.zip.",
  };

  const icons = document.querySelectorAll(".icon");

  // quickTo setters — one per icon, created once
  const xTo = Array.from(icons).map((icon) =>
    gsap.quickTo(icon, "x", { duration: 0.7, ease: "power1.out" })
  );

  window.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    icons.forEach((icon, i) => {
      const depth = parseFloat(icon.dataset.depth || 0.05) * 110;
      xTo[i]((e.clientX - cx) * depth / window.innerWidth);
    });
  }, { passive: true });

  icons.forEach((icon, i) => {
    const depth = parseFloat(icon.dataset.depth || 0.05);
    const float = icon.querySelector(".icon-float");

    // scroll parallax on outer .icon (Y only — no conflict with float)
    gsap.to(icon, {
      y: () => -window.innerHeight * depth * 8,
      ease: "none",
      scrollTrigger: { trigger: "#desktop", start: "top top", end: "bottom bottom", scrub: 1.2 },
    });

    // ambient float on inner .icon-float (separate element — no Y conflict)
    gsap.to(float, {
      y: "+=" + (5 + i * 1.4),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      duration: 2.6 + i * 0.38,
      delay: i * 0.32,
    });

    // click toast
    const label = icon.querySelector(".icon-label")?.textContent || "";
    const quip  = ICON_TOASTS[label];
    if (quip) icon.addEventListener("click", () => notify(quip, 3200));
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

// ── file manager ──
const FILE_COPY = {
  "petal.ai": {
    label: "petal_ai.swift",
    year: 2025,
    verdict: "teaches. actually.",
    voice: "An AI tutor that actually teaches.",
    body: "Built in SwiftUI with the Gemini API. The insight: students don't need answers — they need the next question. Petal structures learning as dialogue, not retrieval. Native iOS, deployed, used by real IBDP students.",
    kind: "swift · ai",
  },
  "llm-mafia": {
    label: "llm_mafia.py",
    year: 2025,
    verdict: "LLMs lie. proved it.",
    voice: "LLMs lie. Proved it.",
    body: "Multi-agent Mafia game where every player is an LLM. Given social incentive, will they produce strategic deception? Yes — and eerily well. Flask backend, async agent loop.",
    kind: "python · ai",
  },
  "j.a.r.v.i.s.": {
    label: "jarvis.ts",
    year: 2026,
    verdict: "siri wasn't enough",
    voice: "A personal AI that knows the context.",
    body: "Voice-activated personal assistant with persistent memory and tool-use scaffolding. Not a wrapper — a system. Built because I wanted something that remembered what we talked about yesterday.",
    kind: "typescript · ai",
  },
  kizuna: {
    label: "kizuna.html",
    year: 2026,
    verdict: "real users. terrifying.",
    voice: "A place for people between places.",
    body: "Community platform — real-time messaging, profiles, discovery. Built from scratch because no existing product fit. Full-stack TypeScript, PostgreSQL, deployed and used by real people.",
    kind: "typescript",
  },
  tokenpilot: {
    label: "tokenpilot.ts",
    year: 2026,
    verdict: "money, but for tokens",
    voice: "LLM spend analysis for people who actually check.",
    body: "Cost analysis and optimization tool for Anthropic and OpenAI admin APIs. Because 'it's just an API call' is what you say before the bill arrives. CLI-first, TypeScript. Built for the kind of developer who audits usage before shipping.",
    kind: "typescript · cli",
  },
  "pm-dashboard": {
    label: "pm_dashboard.js",
    year: 2026,
    verdict: "the IB, managed",
    voice: "Mission control for surviving the IB Diploma.",
    body: "Industrial-brutalist dashboard built for the IB Diploma. Two-way Notion sync, real-time task tracking, deadline visibility. Vanilla JS, Bun backend. Started as a productivity experiment. Became load-bearing.",
    kind: "javascript · bun",
  },
  "ib-news-site": {
    label: "ib_news_site.html",
    year: 2025,
    verdict: "a CMS. for a school.",
    voice: "The school newspaper needed a website.",
    body: "Full content management system for the school newspaper — articles, editing, publishing workflow. IB CS internal assessment project. Deployed. Used by actual student journalists. The CMS manages content. This felt like a reasonable achievement at the time.",
    kind: "html · css · js",
  },
  starspace: {
    label: "starspace.html",
    year: 2025,
    verdict: "cs education, but cooler",
    voice: "Three cutting-edge CS fields, explained interactively.",
    body: "Interactive educational website introducing ML, quantum computing, and computer vision to middle and high school students. Built for a science outreach project. Proves that plain HTML and good copy can compete with React.",
    kind: "html · js",
  },
  cosmos: {
    label: "cosmos.js",
    year: 2026,
    verdict: "math as vibes",
    voice: "Scroll velocity as texture.",
    body: "Simplex noise flow field driven by scroll velocity. Fast = chaos, rest = ambient drift. Built in a weekend through vibecoding. The wallpaper behind these windows is its descendant — third generation now.",
    kind: "glsl · webgl",
  },
  focal: {
    label: "focal.py",
    year: 2026,
    verdict: "photos, but organized",
    voice: "Photo management for a camera nobody makes software for.",
    body: "Desktop photo management app for Sony Cyber-shot libraries. Import, organize, browse — built because the official tooling stopped trying. Python, runs on the desk, not the cloud.",
    kind: "python · desktop",
  },
  portfolio: {
    label: "breakos.sys",
    year: 2026,
    verdict: "you are here",
    voice: "You are looking at it.",
    body: "This site. A portfolio disguised as an operating system. It builds. It breaks. It reboots. Opening this file from inside this file is the closest breakOS gets to recursion.",
    kind: "html · css · js",
  },
};

const PROJECTS = {
  featured: ["petal.ai", "kizuna", "llm-mafia", "ib-news-site"],
  folders: {
    "ai/": ["petal.ai", "llm-mafia", "tokenpilot", "j.a.r.v.i.s."],
    "web/": ["kizuna", "pm-dashboard", "ib-news-site", "starspace"],
    "creative/": ["cosmos", "portfolio"],
    "desktop/": ["focal"],
  },
};

const filesStatus = document.getElementById("files-status");
const overlay = document.getElementById("overlay");
const folderRoot = document.getElementById("folder-root");
const folderContents = document.getElementById("folder-contents");

function projectEntry(key) {
  const c = FILE_COPY[key];
  return {
    name: c.label,
    kind: c.kind,
    year: c.year,
    verdict: c.verdict,
    voice: c.voice,
    body: c.body,
    meta: "kind: " + c.kind + "\nyear: " + c.year + "\nstatus: " + c.verdict,
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

// featured cards
PROJECTS.featured.forEach((key) => {
  const c = FILE_COPY[key];
  const card = document.createElement("button");
  card.className = "feat-card";
  card.innerHTML =
    '<span class="feat-name">' + c.label + "</span>" +
    '<span class="feat-kind">' + c.kind + "</span>" +
    '<span class="feat-verdict">' + c.verdict + "</span>";
  card.addEventListener("click", () => openFile(projectEntry(key)));
  document.getElementById("feat-grid").appendChild(card);
});

// folder navigation
Object.entries(PROJECTS.folders).forEach(([folder, keys]) => {
  const btn = document.createElement("button");
  btn.className = "folder-btn";
  btn.textContent = "▸ " + folder;
  btn.addEventListener("click", () => {
    folderRoot.hidden = true;
    folderContents.hidden = false;
    folderContents.innerHTML = "";

    const back = document.createElement("button");
    back.className = "folder-back";
    back.textContent = "← " + folder;
    back.addEventListener("click", () => {
      folderRoot.hidden = false;
      folderContents.hidden = true;
      filesStatus.textContent = "4 pinned · browse by folder";
    });
    folderContents.appendChild(back);

    const head = document.createElement("div");
    head.className = "filerow filehead";
    head.innerHTML = "<span>name</span><span>kind</span><span>year</span><span>verdict</span>";
    folderContents.appendChild(head);

    keys.forEach((key) => {
      const c = FILE_COPY[key];
      const row = document.createElement("button");
      row.className = "filerow";
      row.innerHTML =
        '<span class="fname">' + c.label + "</span>" +
        "<span>" + c.kind + "</span>" +
        "<span>" + c.year + "</span>" +
        '<span class="fverdict">' + c.verdict + "</span>";
      row.addEventListener("click", () => openFile(projectEntry(key)));
      folderContents.appendChild(row);
    });

    filesStatus.textContent = folder + " · " + keys.length + " items";
  });
  folderRoot.appendChild(btn);
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
