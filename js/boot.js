// ════════════════════════════════════════════════
//  BOOT — scroll-driven boot log with TRUE diagnostics
//  Every line is real. That's the joke.
// ════════════════════════════════════════════════
(function boot() {
  const log = document.getElementById("boot-log");
  const hint = document.getElementById("boot-hint");

  // gather honest facts about this very page load
  const nav = performance.getEntriesByType("navigation")[0];
  const loadMs = nav ? Math.round(nav.responseEnd - nav.startTime) : null;
  const ua = (() => {
    const u = navigator.userAgent;
    if (u.includes("Firefox")) return "Firefox";
    if (u.includes("Edg")) return "Edge";
    if (u.includes("Chrome")) return "Chrome";
    if (u.includes("Safari")) return "Safari";
    return "a browser of mystery";
  })();
  const vw = window.innerWidth + "×" + window.innerHeight;
  const mem = navigator.deviceMemory ? navigator.deviceMemory + "GB ram (allegedly)" : "ram: unknowable";
  const cores = navigator.hardwareConcurrency
    ? navigator.hardwareConcurrency + " cores detected. using 1 for vibes."
    : "core count withheld";

  const LINES = [
    ["ok", "BIOS handshake… firm, confident"],
    ["ok", `html parsed${loadMs ? " in " + loadMs + "ms — real number, check the network tab" : ""}`],
    ["ok", `display: ${vw} on ${ua} — diagnostics, not tracking`],
    ["ok", `${mem} · ${cores}`],
    ["ok", "mounting /dev/projects… 5 entries, 0 abandoned (public ones, anyway)"],
    ["warn", "mounting github api… rate limit: hopefully fine"],
    ["ok", "wallpaper.service started — it reacts to your scroll. test it later"],
    ["ok", "mascot.service loaded (seal, 284KB, worth it)"],
    ["warn", "humor.daemon running — cannot be killed, even with -9"],
    ["ok", "login: guest (you). password skipped. we trust you"],
    ["ok", "welcome to breakOS. keep scrolling — the desktop is below"],
  ];

  LINES.forEach(([cls, text]) => {
    const p = document.createElement("p");
    p.className = cls;
    p.textContent = `[ ${cls === "ok" ? " ok " : "warn"} ] ${text}`;
    log.appendChild(p);
  });

  const ps = Array.from(log.children);

  if (window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: "#boot",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const n = Math.floor(self.progress * (ps.length + 1));
        ps.forEach((p, i) => p.classList.toggle("lit", i < n));
        hint.style.opacity = self.progress > 0.92 ? 0 : 1;
        hint.textContent = self.progress > 0.05 ? "▼ keep scrolling — booting ▼" : "▼ scroll to boot ▼";
      },
    });
  } else {
    ps.forEach((p) => p.classList.add("lit"));
  }
})();
