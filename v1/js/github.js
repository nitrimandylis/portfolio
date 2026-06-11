// ════════════════════════════════════════════════
//  GITHUB — live receipts
//  Fetches real repos so nobody has to take my word for it.
// ════════════════════════════════════════════════
(function githubReceipts() {
  const USER = "nitrimandylis";
  const CACHE_KEY = "gh-repos-v1";
  const CACHE_TTL = 1000 * 60 * 30; // 30 min — the API has feelings (rate limits)

  const grid = document.getElementById("gh-grid");
  const count = document.getElementById("gh-count");
  const footnote = document.getElementById("gh-footnote");
  if (!grid) return;

  const LANG_QUIPS = {
    Swift: "written on a mac, obviously",
    Python: "import everything",
    TypeScript: "javascript with trust issues",
    JavaScript: "typescript without the seatbelt",
    HTML: "yes, HTML counts",
    CSS: "centered a div for this one",
    GLSL: "math pretending to be art",
  };

  const relTime = (iso) => {
    const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (days === 0) return "today (yes, today)";
    if (days === 1) return "yesterday";
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)}y ago — it's stable, not abandoned`;
  };

  function render(repos) {
    const shown = repos
      .filter((r) => !r.fork && r.name.toLowerCase() !== USER)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    count.innerHTML = `<em>${String(shown.length).padStart(2, "0")} public repos</em>`;
    grid.innerHTML = "";

    shown.forEach((r, i) => {
      const card = document.createElement("a");
      card.className = "gh-card";
      card.href = r.html_url;
      card.target = "_blank";
      card.rel = "noopener";
      card.style.transitionDelay = `${(i % 6) * 60}ms`;

      const lang = r.language || "vibes";
      const quip = LANG_QUIPS[r.language] || "language: unclear, energy: high";
      const desc = r.description || "// no description. the code speaks for itself. allegedly.";
      const stars = r.stargazers_count
        ? `★ ${r.stargazers_count}`
        : "★ 0 (star it, change a life)";

      card.innerHTML = `
        <p class="gh-card-top"><span class="a">+ </span>${lang} · ${stars}</p>
        <h3 class="gh-card-name">${r.name}<em>.</em></h3>
        <p class="gh-card-desc">${desc}</p>
        <p class="gh-card-meta"><span class="a">// </span>${quip}<br>
        <span class="a">+ </span>last touched ${relTime(r.pushed_at)}</p>`;
      grid.appendChild(card);

      if (window.ScrollTrigger) {
        ScrollTrigger.create({
          trigger: card,
          start: "top 92%",
          once: true,
          onEnter: () => card.classList.add("revealed"),
        });
      } else {
        card.classList.add("revealed");
      }
    });

    footnote.innerHTML = `<span class="a">// </span>fetched live from api.github.com. zero curation. what you see is what got committed.`;
  }

  function fail() {
    count.innerHTML = "<em>rate limited</em>";
    grid.innerHTML = `
      <div class="gh-card revealed gh-card-error">
        <h3 class="gh-card-name">503-ish<em>.</em></h3>
        <p class="gh-card-desc">GitHub said no. This is either a rate limit or
        a sign. Visit the source directly:</p>
        <p class="gh-card-meta"><a href="https://github.com/${USER}" target="_blank" rel="noopener" class="contact-link">github.com/${USER}</a></p>
      </div>`;
  }

  // cache first — repeat visitors don't burn the rate limit
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached && Date.now() - cached.at < CACHE_TTL) {
      render(cached.repos);
      return;
    }
  } catch (_) {}

  fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=100`)
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((repos) => {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos }));
      } catch (_) {}
      render(repos);
    })
    .catch(fail);
})();
