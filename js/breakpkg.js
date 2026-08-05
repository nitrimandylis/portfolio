// ════════════════════════════════════════════════
//  BREAKPKG — package manager for the CLI family.
//  every row is a real repo; agent-wrapped's version is
//  fetched live from the npm registry. no fake numbers.
//  terminal.js reads window.BREAKPKG for pkg/man commands.
// ════════════════════════════════════════════════
(function breakpkg() {
  const PKGS = [
    {
      bin: "swatch",
      repo: "swatch",
      desc: "themes the whole macOS desktop from one palette.toml — 20 surfaces, one command.",
      man: "swatch apply <palette> — writes Ghostty, btop, sketchybar, Zen, Cider, Legcord, yazi, zed, vscode and friends from a single palette file. swatch build <image> starts a theme from a wallpaper.",
    },
    {
      bin: "juke",
      repo: "jukebox",
      desc: "Apple Music in the terminal. search, queue, and control playback without leaving the shell.",
      man: "juke play <query> — plays via Music.app or Cider. juke queue, juke skip, juke now. the prompt becomes a now-playing screen.",
    },
    {
      bin: "jazz",
      repo: "jazz",
      desc: "focus videos rendered into the terminal via the Kitty graphics protocol. loops forever.",
      man: "jazz <file|url> — renders video into Ghostty, local files or anything yt-dlp can reach. made for lo-fi loops behind work.",
    },
    {
      bin: "bacpack",
      repo: "bacpack",
      desc: "ManageBac from the terminal: what's due, class files, CAS logging, portfolio entries.",
      man: "bacpack due — lists deadlines. bacpack files <class> downloads handouts. bacpack cas logs experiences and reflections without opening a browser.",
    },
    {
      bin: "dt",
      repo: "dovetail",
      desc: "finds, backs up, diffs and restores macOS app configs through a local git store.",
      man: "dt track <app> — snapshots configs into ~/.dotfiles. dt diff shows what changed, dt restore puts it back. for the day you break your zshrc.",
    },
    {
      bin: "cine",
      repo: "cine",
      desc: "Village Cinemas showtimes with IMDB + RT verdicts, and a streaming tab that plays into IINA.",
      man: "cine — what's playing in Athens, with verdicts attached. cine watch <title> streams into IINA. can alert when booking opens.",
    },
    {
      bin: "agent-wrapped",
      repo: "agent-wrapped",
      npm: "@nitrimandylis/agent-wrapped",
      desc: "your Claude Code month as a scored, shareable card. offline, nothing uploaded.",
      man: "bunx @nitrimandylis/agent-wrapped — reads ~30 days of local transcripts, scores them, assigns an archetype, renders a PNG/SVG card with the would-be API cost.",
    },
  ];

  const GH = "https://github.com/nitrimandylis/";
  // repos that ship a real man page at man/<bin>.1 (agent-wrapped
  // doesn't — its `man` falls back to the blurb above)
  const HAS_MAN = ["swatch", "juke", "jazz", "bacpack", "dt", "cine"];
  // what happens when you run the bin inside a browser tab
  const RUN_QUIPS = {
    swatch: "swatch: no desktop surfaces found to theme. ironic, given the surroundings.",
    juke: "juke: Music.app not found in this browser. the silence continues.",
    jazz: "jazz: this terminal cannot render video. it can barely render text.",
    bacpack: "bacpack: no ManageBac session. lucky you.",
    dt: "dt: found 0 dotfiles. this machine is a tab.",
    cine: "cine: no cinemas within reach of this sandbox. Athens has several.",
    "agent-wrapped":
      "agent-wrapped: no transcripts in here. run it on your own machine: bunx @nitrimandylis/agent-wrapped",
  };
  PKGS.forEach((p) => {
    p.url = GH + p.repo;
    if (HAS_MAN.includes(p.bin))
      p.manUrl =
        "https://raw.githubusercontent.com/nitrimandylis/" +
        p.repo +
        "/main/man/" +
        p.bin +
        ".1";
    p.quip = RUN_QUIPS[p.bin];
  });

  // live npm version, 30-min cache — same pattern as the repos fetch
  const NPM_KEY = "breakos-npm-v1";
  const NPM_TTL = 1000 * 60 * 30;
  function npmVersion(pkg) {
    try {
      const c = JSON.parse(localStorage.getItem(NPM_KEY) || "null");
      if (c && Date.now() - c.at < NPM_TTL && c.v[pkg])
        return Promise.resolve(c.v[pkg]);
    } catch (_) {}
    return fetch(
      "https://registry.npmjs.org/" + encodeURIComponent(pkg) + "/latest",
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        try {
          const c = JSON.parse(localStorage.getItem(NPM_KEY) || "null") || {
            at: Date.now(),
            v: {},
          };
          c.v[pkg] = j.version;
          c.at = Date.now();
          localStorage.setItem(NPM_KEY, JSON.stringify(c));
        } catch (_) {}
        return j.version;
      });
  }

  const relTime = (iso) => {
    const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 30) return days + "d ago";
    if (days < 365) return Math.floor(days / 30) + "mo ago";
    return Math.floor(days / 365) + "y ago";
  };

  const table = document.getElementById("pkg-table");
  const loading = document.getElementById("pkg-loading");

  function render(repoIndex) {
    loading.remove();
    PKGS.forEach((p) => {
      const r = repoIndex[p.repo.toLowerCase()];
      const row = document.createElement("a");
      row.className = "pkgrow pkgpkg";
      row.href = p.url;
      row.target = "_blank";
      row.rel = "noopener";
      const chan = document.createElement("span");
      chan.className = "pkg-chan";
      chan.textContent = p.npm ? "npm" : "source";
      if (p.npm)
        npmVersion(p.npm)
          .then((v) => (chan.textContent = "npm v" + v))
          .catch(() => {});
      const name = document.createElement("span");
      name.className = "pkg-name";
      name.textContent = p.bin;
      const lang = document.createElement("span");
      lang.textContent = r ? r.language || "vibes" : "—";
      const pushed = document.createElement("span");
      pushed.textContent = r ? relTime(r.pushed_at) : "—";
      row.append(name, chan, lang, pushed);
      const desc = document.createElement("span");
      desc.className = "pkg-desc";
      desc.textContent = p.desc;
      row.appendChild(desc);
      table.appendChild(row);
    });
  }

  function fail() {
    loading.textContent =
      "registry unreachable. the packages exist — github.com/nitrimandylis";
  }

  window.BREAKOS_REPOS.then((repos) => {
    const idx = {};
    repos.forEach((r) => (idx[r.name.toLowerCase()] = r));
    render(idx);
  }).catch(fail);

  window.BREAKPKG = PKGS;
})();
