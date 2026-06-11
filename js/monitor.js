// ════════════════════════════════════════════════
//  SYSTEM MONITOR — real repos as processes, real stats as load
// ════════════════════════════════════════════════
(function monitor() {
  const USER = "nitrimandylis";
  const table = document.getElementById("mon-table");
  const loading = document.getElementById("mon-loading");

  const relTime = (iso) => {
    const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (days === 0) return "today. yes, today";
    if (days === 1) return "yesterday";
    if (days < 30) return days + "d ago";
    if (days < 365) return Math.floor(days / 30) + "mo ago";
    return Math.floor(days / 365) + "y — stable, not dead";
  };
  const fmtKb = (kb) =>
    kb > 1024 ? (kb / 1024).toFixed(1) + " MB" : kb + " KB";

  function render(repos) {
    loading.remove();
    repos
      .filter((r) => !r.fork && r.name.toLowerCase() !== USER)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
      .forEach((r, i) => {
        const row = document.createElement("div");
        row.className = "monrow";
        row.innerHTML = `
          <span>${String(i + 1).padStart(3, "0")}</span>
          <span><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a></span>
          <span>${r.language || "vibes"}</span>
          <span>${fmtKb(r.size)}</span>
          <span>${relTime(r.pushed_at)}</span>`;
        table.appendChild(row);
      });
  }

  function fail() {
    loading.textContent =
      "github api said no. rate limit, probably. the repos exist — github.com/" + USER;
  }

  // fetch + cache live in os.js (window.BREAKOS_REPOS) — one request for both windows
  window.BREAKOS_REPOS.then(render).catch(fail);

  // ── honest system load: real fps, real scroll depth, real uptime ──
  const fpsEl = document.getElementById("stat-fps");
  const depthEl = document.getElementById("stat-depth");
  const upEl = document.getElementById("stat-uptime");
  const t0 = performance.now();

  let frames = 0;
  let lastStamp = performance.now();
  function frame() {
    frames++;
    const now = performance.now();
    if (now - lastStamp >= 1000) {
      fpsEl.textContent = frames;
      frames = 0;
      lastStamp = now;
    }
    requestAnimationFrame(frame);
  }
  frame();

  setInterval(() => {
    const el = document.documentElement;
    const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100) || 0;
    depthEl.textContent = pct + "%";
    const s = Math.floor((performance.now() - t0) / 1000);
    upEl.textContent = s < 60 ? s + "s" : Math.floor(s / 60) + "m " + (s % 60) + "s";
  }, 1000);
})();
