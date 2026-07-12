// ════════════════════════════════════════════════
//  TERMINAL — fully functional. the whole portfolio, via CLI.
// ════════════════════════════════════════════════
(function terminal() {
  const out = document.getElementById("term-out");
  const input = document.getElementById("term-input");
  const body = document.getElementById("term-body");

  body.addEventListener("click", () => input.focus());

  function print(text, html = false) {
    const p = document.createElement("p");
    if (html) p.innerHTML = text;
    else p.textContent = text;
    out.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }

  // synced with FILE_COPY in os.js
  const FILES = {
    "petal_ai.swift":
      "iOS 17+ AI study companion. SwiftUI + Gemini. CSV-loaded curriculum, streak tracking, haptic feedback. a tutor with a system prompt and an agenda.",
    "llm_mafia.py":
      "fully autonomous Mafia — every player an LLM. parallel inference, game master narrator, LM Studio or NVIDIA NIM. you just watch the town burn.",
    "jarvis.ts":
      "personal AI assistant agent. multi-model (Claude + Gemini), TypeScript, Bun. persistent memory, tool use. not a wrapper — a system.",
    "kizuna.py":
      "CAS and events platform for the IBDP community. Flask + PostgreSQL, deployed on Render. club directory, event registration, admin dashboard. self-governing.",
    "tokenpilot.ts":
      "LLM spend auditor. reads Anthropic + OpenAI admin APIs, 6-rule detection engine, confidence-scored savings. Next.js 16. keys never leave the tab.",
    "pm_dashboard.js":
      "IB diploma mission control. five views, two-way Notion sync, vanilla ES modules, Bun proxy. no framework. no bundler. became load-bearing.",
    "ib_news_site.py":
      "the CGS IB Gazette — Flask + PostgreSQL CMS. submission portal, admin dashboard, tag system, search. EB Garamond. deployed. used by actual student journalists.",
    "starspace.html":
      "interactive CS education site: LLMs, quantum computing, robotics. available in English and Greek. zero frameworks. the students are the ones learning the complicated stuff.",
    "cosmos.js":
      "3D space observatory vibecoded by Claude Opus 4.6 in one session — Three.js starfield, mission cards, real-time stats. 900+ lines. one prompt. react + three.js + vite.",
    "focal.py":
      "desktop photo manager for Sony Cyber-shot libraries. Flask + pywebview (native window). EXIF on upload, SQLite, thumbnails via Pillow. IB CS internal assessment.",
    "breakos.sys":
      "this site. a portfolio disguised as an OS. opening this file is the closest it gets to recursion.",
    "about.txt":
      "nick trimandylis. IBDP student, CS HL. builder between languages. ships because finishing beats starting.",
  };

  // window map for 'open' command
  const WINS = {
    files: { sec: "#ws-files", win: "win-files" },
    "things-i-made": { sec: "#ws-files", win: "win-files" },
    monitor: { sec: "#ws-monitor", win: "win-monitor" },
    "system-monitor": { sec: "#ws-monitor", win: "win-monitor" },
    terminal: { sec: "#ws-terminal", win: "win-terminal" },
    about: { sec: "#ws-about", win: "win-about" },
    mail: { sec: "#ws-mail", win: "win-mail" },
    message: { sec: "#ws-mail", win: "win-mail" },
    contact: { sec: "#ws-mail", win: "win-mail" },
  };

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
          "                        windows: files · monitor · terminal · about · mail\n" +
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
        "guest. the OS belongs to nick trimandylis — swift · python · typescript · glsl.",
      ),

    uname: () =>
      print(
        "breakOS 2.6.11 'Definitely Stable' — human/1 SMP PREEMPT est.2007",
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
      print("  007  terminal.sh             running  ← you are here");
      print("  008  ego.check               not found");
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
    print("guest@breakos:~$ " + cmd);

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
            ": no such window. try: files · monitor · about · mail",
        );
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
      const s = cmd.slice(4).trim();
      return print(
        "man: no manual entry for " +
          s +
          ". breakOS ships without documentation. this is a feature.",
      );
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
