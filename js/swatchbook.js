// ════════════════════════════════════════════════
//  SWATCHBOOK — the site's extra themes are the real palette.toml
//  files from the swatchbook repo, fetched lazily and cached a day.
//  os.js maps roles → CSS vars; terminal.js exposes `swatch apply`.
// ════════════════════════════════════════════════
(function swatchbook() {
  const REPO = "nitrimandylis/swatchbook";
  const CACHE_KEY = "breakos-swatchbook-v1";
  const TTL = 1000 * 60 * 60 * 24;
  // the repo's palette directories. batman-jazz is skipped — the site
  // already ships a hand-tuned build of it as the `batman` theme.
  const NAMES = [
    "catppuccin",
    "firewatch",
    "mafia",
    "mclaren",
    "night-city",
    "nord",
    "seal",
    "spider-verse",
    "tokyo-night",
  ];

  // just enough TOML for these files: [section] headers, key = "value"
  function parseToml(src) {
    const doc = {};
    let section = null;
    src.split("\n").forEach((line) => {
      const l = line.trim();
      if (!l || l.startsWith("#")) return;
      const sec = l.match(/^\[([\w.-]+)\]$/);
      if (sec) {
        section = {};
        doc[sec[1]] = section;
        return;
      }
      const kv = l.match(/^([\w-]+)\s*=\s*"(.*)"/);
      if (kv && section) section[kv[1]] = kv[2];
    });
    return doc;
  }

  let loading = null;
  window.BREAKOS_SWATCHBOOK = function () {
    if (loading) return loading;
    try {
      const c = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (c && Date.now() - c.at < TTL)
        return (loading = Promise.resolve(c.themes));
    } catch (_) {}
    loading = Promise.all(
      NAMES.map((n) =>
        fetch(
          "https://raw.githubusercontent.com/" +
            REPO +
            "/main/" +
            n +
            "/palette.toml",
        )
          .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
          .then((t) => {
            const doc = parseToml(t);
            const meta = doc.meta || {};
            return {
              id: n,
              name: meta.name || n,
              variant: meta.variant || "dark",
              description: meta.description || "",
              roles: doc.roles || {},
            };
          })
          .catch(() => null),
      ),
    ).then((list) => {
      const themes = {};
      list.filter(Boolean).forEach((t) => (themes[t.id] = t));
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ at: Date.now(), themes }),
        );
      } catch (_) {}
      return themes;
    });
    return loading;
  };
})();
