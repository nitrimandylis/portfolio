// ════════════════════════════════════════════════
//  TERMINAL — fully functional. the whole portfolio, via CLI.
// ════════════════════════════════════════════════
(function terminal() {
  const out = document.getElementById("term-out");
  const input = document.getElementById("term-input");
  const body = document.getElementById("term-body");

  body.addEventListener("click", () => input.focus());

  function print(text, html = false, cls = "") {
    const p = document.createElement("p");
    if (cls) p.className = cls;
    if (html) p.innerHTML = text;
    else p.textContent = text;
    out.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }

  // user input goes through innerHTML when echoed — escape it
  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // synced with FILE_COPY in os.js — the curated six, plus this site
  const FILES = {
    "petal_ai.swift":
      "iOS 17+ AI study companion. SwiftUI + Gemini. CSV-loaded curriculum, streak tracking, haptic feedback. a tutor with a system prompt and an agenda.",
    "tokenpilot.ts":
      "LLM spend auditor. reads Anthropic + OpenAI admin APIs, 6-rule detection engine, confidence-scored savings. Next.js 16. keys never leave the tab.",
    "apex.ts":
      "F1 dashboard — real standings and replayable telemetry from Jolpica + OpenF1. scrub a session lap by lap. TypeScript, real data, no fake numbers.",
    "llm_mafia.py":
      "fully autonomous Mafia — every player an LLM. parallel inference, game master narrator, LM Studio or NVIDIA NIM. you just watch the town burn.",
    "agent_wrapped.ts":
      "your Claude Code month as a scored, shareable card. reads ~30 days of local transcripts, offline, assigns an archetype, prices the month at API rates. on npm: bunx @nitrimandylis/agent-wrapped.",
    "ib_news_site.py":
      "the CGS IB Gazette — Flask + PostgreSQL CMS. submission portal, admin dashboard, tag system, search. EB Garamond. deployed. used by actual student journalists.",
    "breakos.sys":
      "this site. a portfolio disguised as an OS. opening this file is the closest it gets to recursion.",
    "about.txt":
      "nick trimandylis. builds things useful or interesting, ideally both. python · typescript · swift, lately in the terminal. starts a repo most weeks, ships most of them.",
  };

  // window map for 'open' command — app key drives the desktop WM,
  // sec/win drive the mobile scroll fallback
  const WINS = {
    files: { app: "things-i-made", sec: "#ws-files", win: "win-files" },
    "things-i-made": { app: "things-i-made", sec: "#ws-files", win: "win-files" },
    monitor: { app: "system-monitor", sec: "#ws-monitor", win: "win-monitor" },
    "system-monitor": { app: "system-monitor", sec: "#ws-monitor", win: "win-monitor" },
    packages: { app: "breakpkg", sec: "#ws-pkg", win: "win-pkg" },
    breakpkg: { app: "breakpkg", sec: "#ws-pkg", win: "win-pkg" },
    pkg: { app: "breakpkg", sec: "#ws-pkg", win: "win-pkg" },
    terminal: { app: "terminal", sec: "#ws-terminal", win: "win-terminal" },
    about: { app: "about", sec: "#ws-about", win: "win-about" },
    mail: { app: "new-message", sec: "#ws-mail", win: "win-mail" },
    message: { app: "new-message", sec: "#ws-mail", win: "win-mail" },
    contact: { app: "new-message", sec: "#ws-mail", win: "win-mail" },
  };

  // roff-lite: enough of man(7) to render the repos' real man pages.
  // not a troff implementation — just the macros these six pages use.
  function renderRoff(src) {
    const clean = (s) =>
      s
        .replace(/\\f[BIRP]/g, "")
        .replace(/\\-/g, "-")
        .replace(/\\\(bu/g, "•")
        .replace(/\\&/g, "")
        .replace(/\\ /g, " ");
    const unquote = (s) => s.replace(/^"|"$/g, "");
    const out = [];
    src.split("\n").forEach((ln) => {
      if (ln.startsWith('.\\"')) return; // comment
      if (ln.startsWith(".TH ")) {
        const parts = ln.slice(4).match(/"[^"]*"|\S+/g) || [];
        const name = unquote(parts[0] || "").toUpperCase();
        const sec = unquote(parts[1] || "1");
        const extra = parts
          .slice(2)
          .map(unquote)
          .filter(Boolean)
          .join("  ·  ");
        out.push(name + "(" + sec + ")" + (extra ? "   " + extra : ""));
        return;
      }
      if (ln.startsWith(".SH ")) {
        out.push("");
        out.push(clean(unquote(ln.slice(4))));
        return;
      }
      if (ln.startsWith(".SS ")) {
        out.push("");
        out.push("  " + clean(unquote(ln.slice(4))));
        return;
      }
      if (/^\.(TP|PP|P|LP)\b/.test(ln)) {
        out.push("");
        return;
      }
      if (/^\.(B|I|BR|IR|BI|IB|RB|RI)\s/.test(ln)) {
        out.push(
          "  " + clean(ln.replace(/^\.\w+\s+/, "").replace(/"/g, "")),
        );
        return;
      }
      if (ln.startsWith(".")) return; // any other macro: drop the line
      out.push(clean(ln));
    });
    return out
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  // command history
  const hist = [];
  let histIdx = -1;

  const CMDS = {
    help: () =>
      print(
        "commands:\n" +
          "  ls [-la]              list files\n" +
          "  cat <file>            read a file\n" +
          "  open <window>         open a window\n" +
          "                        windows: files · packages · monitor · terminal · about · mail\n" +
          "  pkg list              installed command-line tools\n" +
          "  pkg info <name>       details on one of them\n" +
          "  man <tool>            the real man page, fetched from the repo\n" +
          "  defrag                defragment the wallpaper\n" +
          "  whoami                identify current user\n" +
          "  pwd                   print working directory\n" +
          "  ps                    running processes\n" +
          "  uname                 kernel info\n" +
          "  uptime                session uptime\n" +
          "  date                  current date\n" +
          "  ping <host>           network diagnostics\n" +
          "  echo <text>           print text\n" +
          "  theme [batman|default] switch appearance\n" +
          "  git log               commit history\n" +
          "  github                open github profile\n" +
          "  contact               get email address\n" +
          "  clear                 clear terminal\n" +
          "  sudo hire-nick        (try it)",
      ),

    ls: () => print(Object.keys(FILES).join("   ")),

    pwd: () => print("/home/guest/breakOS"),

    whoami: () =>
      print(
        "guest. the OS belongs to nick trimandylis — python · typescript · swift. builds things useful or interesting, ideally both.",
      ),

    uname: () =>
      print(
        "breakOS 3.0 'Now With Windows' — human/1 SMP PREEMPT est.2007",
      ),

    uptime: () => {
      const s = Math.floor(performance.now() / 1000);
      print(
        "up " +
          Math.floor(s / 60) +
          "m " +
          (s % 60) +
          "s — load: enthusiasm, curiosity, 1 tab too many",
      );
    },

    date: () =>
      print(
        new Date().toLocaleString("en-GB", {
          dateStyle: "full",
          timeStyle: "medium",
        }),
      ),

    ps: () => {
      print("  PID  NAME                    STATUS");
      print("  001  boot.service            exited (success)");
      print("  002  wallpaper.canvas        running");
      print("  003  lenis.scroll            running");
      print("  004  gsap.timeline           running");
      print("  005  github.api              sleeping (30m cache)");
      print("  006  icon.parallax           running");
      print("  007  wm.service              running (windows drag now)");
      print("  008  breakpkg.registry       running (7 packages)");
      print("  009  terminal.sh             running  ← you are here");
      print("  010  ego.check               not found");
    },

    github: () => {
      window.open("https://github.com/nitrimandylis", "_blank", "noopener");
      print("opened github.com/nitrimandylis — the receipts are there.");
    },

    contact: () =>
      print(
        "mail: nicktrim8@duck.com\n// yes, the email is a duck. ducks are trustworthy.",
      ),

    clear: () => {
      out.innerHTML = "";
    },

    seal: () => {
      print("mascot.service: deploying");
      const img = document.createElement("img");
      img.src = "assets/seal.png";
      img.className = "seal-takeover";
      document.body.appendChild(img);
      setTimeout(() => img.remove(), 4000);
    },
  };

  function run(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    hist.unshift(cmd);
    histIdx = -1;
    // echo mirrors the live prompt — coral prompt, bold command — so you
    // can see where input starts and output ends
    print(
      '<span class="echo-prompt">guest@breakos:~$</span> <b>' +
        esc(cmd) +
        "</b>",
      true,
      "term-echo",
    );

    if (cmd === "sudo hire-nick") {
      print("[sudo] password for guest: (accepted. flattery counts)");
      print("generating offer letter…");
      print(
        "Dear Nick, we were going to interview other candidates but the\n" +
          "fake operating system broke us. Start Monday?\n" +
          "→ nicktrim8@duck.com  subject: re: sudo hire-nick",
      );
      return;
    }

    if (cmd === "rm -rf /" || cmd === "sudo rm -rf /") {
      print("removing /… removing /home… removing /humor… wait—");
      setTimeout(() => window.__crash && window.__crash(), 800);
      return;
    }

    if (cmd === "ls -la" || cmd === "ls -al") {
      print("total " + Object.keys(FILES).length);
      Object.entries(FILES).forEach(([name]) => {
        const size = String(Math.floor(Math.random() * 8000 + 512)).padStart(6);
        print("-rw-r--r--  1 nick  nick  " + size + "  Jun 2026  " + name);
      });
      return;
    }

    if (cmd.startsWith("cat ")) {
      const f = cmd.slice(4).trim();
      if (FILES[f]) return print(FILES[f]);
      return print("cat: " + f + ": no such file. try ls first.");
    }

    if (cmd.startsWith("open ")) {
      const target = cmd.slice(5).trim().toLowerCase();
      const w = WINS[target];
      if (!w)
        return print(
          "open: " +
            target +
            ": no such window. try: files · packages · monitor · about · mail",
        );
      if (document.body.classList.contains("booted") && window.__openApp) {
        // desktop session: the WM handles it
        window.__openApp(w.app, "taskbar");
        print("opening " + target + "…");
        return;
      }
      const win = document.getElementById(w.win);
      if (win) win.classList.remove("closed");
      const sec = document.querySelector(w.sec);
      if (sec) {
        if (window.__lenis) window.__lenis.scrollTo(sec);
        else sec.scrollIntoView({ behavior: "smooth" });
      }
      print("opening " + target + "…");
      return;
    }

    // ── breakpkg: same registry as the Packages window ──
    if (cmd === "pkg" || cmd === "pkg list" || cmd === "pkg ls") {
      const pkgs = window.BREAKPKG || [];
      if (cmd === "pkg") return print("usage: pkg list · pkg info <name>");
      print("breakpkg registry — " + pkgs.length + " packages, all preinstalled:");
      pkgs.forEach((p) =>
        print(
          "  " +
            p.bin.padEnd(14) +
            (p.npm ? "[npm]    " : "[source] ") +
            p.desc,
        ),
      );
      print(
        "(everything ships with the OS — this is a portfolio, not a store. try: pkg info swatch)",
      );
      return;
    }

    if (cmd.startsWith("pkg info ")) {
      const name = cmd.slice(9).trim().toLowerCase();
      const p = (window.BREAKPKG || []).find(
        (x) => x.bin === name || x.repo === name,
      );
      if (!p)
        return print(
          "pkg: " +
            name +
            ": not in the registry. nick hasn't built that yet. give him a weekend.",
        );
      print(
        p.bin +
          "\n  " +
          p.desc +
          "\n  channel: " +
          (p.npm ? "npm (" + p.npm + ")" : "source") +
          "\n  repo: " +
          '<a href="' +
          p.url +
          '" target="_blank" rel="noopener">' +
          p.url +
          "</a>" +
          (p.manUrl ? "\n  docs: man " + p.bin : ""),
        true,
      );
      return;
    }
    if (cmd.startsWith("pkg install "))
      return print(
        "pkg: install: everything is already installed. it's a portfolio — the packages come with the person. try: pkg list",
      );

    if (cmd === "defrag") {
      if (window.__getTheme && window.__getTheme() === "batman")
        return print(
          "defrag: the batman-jazz wallpaper is a photograph. photographs do not fragment.",
        );
      const started = window.__defrag && window.__defrag();
      if (!started)
        return print(
          "defrag: wallpaper unavailable (reduced motion, or already defragmenting).",
        );
      print("defragmenting wallpaper… watch the dots.");
      setTimeout(() => print("consolidating free space… looks great."), 1400);
      setTimeout(
        () =>
          print(
            "defrag complete. 0 fragments moved. everything was already where it belonged.",
          ),
        3600,
      );
      return;
    }

    if (cmd === "theme" || cmd.startsWith("theme ")) {
      const arg = cmd.length > 5 ? cmd.slice(6).trim() : "";
      if (!arg)
        return print(
          "appearance: " +
            window.__getTheme() +
            " — try: theme batman | theme default",
        );
      if (["batman", "jazz", "dark"].includes(arg)) {
        window.__setTheme("batman");
        return print("appearance → batman jazz. gotham loaded.");
      }
      if (["default", "cream", "light"].includes(arg)) {
        window.__setTheme("default");
        return print("appearance → default. the cream returns.");
      }
      return print("theme: " + arg + ": unknown. try: batman | default");
    }

    if (cmd.startsWith("echo ")) return print(cmd.slice(5));

    if (cmd.startsWith("ping ")) {
      const host = cmd.slice(5).trim();
      print("PING " + host + " (0.0.0.0): 56 bytes of data");
      [11, 13, 10, 14].forEach((ms, i) =>
        setTimeout(
          () =>
            i < 4
              ? print(
                  "64 bytes from " +
                    host +
                    ": icmp_seq=" +
                    i +
                    " ttl=64 time=" +
                    ms +
                    " ms",
                )
              : print(
                  "--- " +
                    host +
                    " ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss",
                ),
          i * 350,
        ),
      );
      setTimeout(
        () =>
          print(
            "--- " +
              host +
              " ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss",
          ),
        1500,
      );
      return;
    }

    if (cmd.startsWith("man ")) {
      const s = cmd.slice(4).trim().toLowerCase();
      const p = (window.BREAKPKG || []).find(
        (x) => x.bin === s || x.repo === s,
      );
      if (!p)
        return print(
          "man: no manual entry for " +
            s +
            ". breakOS documents its packages and nothing else. try: man swatch",
        );
      const fallback = () =>
        print(
          p.bin.toUpperCase() +
            "(1)\n\nNAME\n  " +
            p.bin +
            " — " +
            p.desc +
            "\n\nDESCRIPTION\n  " +
            p.man +
            "\n\nSOURCE\n  " +
            p.url,
        );
      if (!p.manUrl) return fallback();
      // the real man page, straight from the repo (30-min cache)
      const key = "breakos-man-" + p.bin;
      try {
        const c = JSON.parse(localStorage.getItem(key) || "null");
        if (c && Date.now() - c.at < 1000 * 60 * 30)
          return print(renderRoff(c.txt));
      } catch (_) {}
      print("fetching the real man page from " + p.repo + "…");
      fetch(p.manUrl)
        .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
        .then((txt) => {
          try {
            localStorage.setItem(
              key,
              JSON.stringify({ at: Date.now(), txt }),
            );
          } catch (_) {}
          print(renderRoff(txt));
        })
        .catch(fallback);
      return;
    }

    if (cmd === "cd" || cmd.startsWith("cd ")) {
      const dir = cmd.length > 3 ? cmd.slice(3).trim() : "~";
      if (dir === "~" || dir === "/home/guest" || dir === "/home/guest/breakOS")
        return print("you were already here.");
      if (dir === "..") return print("cd: ..: there is nothing above breakOS.");
      return print(
        "cd: " + dir + ": you can't go there. the OS is the destination.",
      );
    }

    if (cmd === "git log") {
      print("commit 13c89d6  breakOS v3: boot into a real desktop");
      print(
        "commit 196e964  feat: overhaul things-i-made window and parallax icons",
      );
      print("commit a881ce8  feat: file manager driven by live GitHub repos");
      print(
        "commit 3d495f9  docs: add MIT license, give README actual personality",
      );
      print("commit 9a0bf35  chore: rename repo to portfolio");
      print(
        "commit 0e7c154  feat: breakOS — portfolio as a fictional operating system",
      );
      print("(end of log. the commits are real.)");
      return;
    }

    if (cmd === "git status")
      return print("On branch main. Nothing to commit. Shipped.");
    if (cmd === "sudo")
      return print(
        "sudo: you're already root. it's a portfolio. take anything.",
      );
    if (cmd === "exit" || cmd === "logout")
      return print("no exit. only the shutdown dialog at the bottom. scroll.");
    if (cmd === "vim" || cmd === "vi")
      return print("vim opened. session ends when you figure out :q!");
    if (cmd === "pwd") return CMDS.pwd();

    const fn = CMDS[cmd];
    if (fn) return fn();

    // the installed CLIs exist as commands — they just can't do much in a tab
    const bin = cmd.split(" ")[0];
    const pk = (window.BREAKPKG || []).find((x) => x.bin === bin);
    if (pk)
      return print(
        (pk.quip || pk.bin + ": cannot run inside a browser tab.") +
          "\n→ " +
          (pk.manUrl ? "man " + pk.bin + "  ·  " : "") +
          pk.url,
      );

    print("breaksh: " + cmd + ": command not found. 'help' lists real ones.");
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      run(input.value);
      input.value = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx < hist.length - 1) histIdx++;
      input.value = hist[histIdx] || "";
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        input.value = hist[histIdx] || "";
      } else {
        histIdx = -1;
        input.value = "";
      }
    }
    e.stopPropagation();
  });
})();
