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

  const PROJECTS = {
    "petal_ai.app": "An AI tutor that actually teaches. SwiftUI + Gemini API. Deployed, used by real students.",
    "llm_mafia.py": "Multi-agent Mafia where every player is an LLM. They lied. Eerily well. Python + Flask.",
    "jarvis.ts": "Personal assistant with persistent memory + tool use. TypeScript, Next.js.",
    "kizuna.app": "Community platform, real-time, production, real users. TS + Postgres.",
    "cosmos.glsl": "Scroll velocity as texture. GLSL flow field. Ancestor of this page's wallpaper.",
  };

  const CMDS = {
    help: () =>
      print(
        "commands: ls · cat <file> · whoami · uname · uptime · github · contact · clear · sudo hire-nick · rm -rf /",
      ),
    ls: () => print(Object.keys(PROJECTS).join("   ") + "   about.txt"),
    whoami: () => print("guest. but the OS is nick trimandylis — swift, python, typescript, glsl."),
    uname: () => print("breakOS 2.6.11 'Definitely Stable' — human/1 SMP PREEMPT est.2007"),
    uptime: () => {
      const s = Math.floor(performance.now() / 1000);
      print(`up ${Math.floor(s / 60)}m ${s % 60}s — load average: enthusiasm, curiosity, 1 open tab too many`);
    },
    github: () =>
      print(
        'opening <a href="https://github.com/nitrimandylis" target="_blank" rel="noopener" style="color:#f8b26a">github.com/nitrimandylis</a> — the receipts',
        true,
      ),
    contact: () =>
      print(
        'mail: <a href="mailto:nicktrim8@duck.com" style="color:#f8b26a">nicktrim8@duck.com</a> (yes, a duck)',
        true,
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
    print("guest@breakos:~$ " + cmd);

    if (cmd === "sudo hire-nick") {
      print("[sudo] password for guest: (accepted. flattery counts)");
      print("generating offer letter…");
      print(
        'Dear Nick, we were going to interview other candidates but the\nfake operating system broke us. Start Monday?\n→ send it: <a href="mailto:nicktrim8@duck.com?subject=re: sudo hire-nick" style="color:#f8b26a">nicktrim8@duck.com</a>',
        true,
      );
      return;
    }
    if (cmd === "rm -rf /" || cmd === "sudo rm -rf /") {
      print("removing /… removing /home… removing /humor… wait—");
      setTimeout(() => window.__crash && window.__crash(), 800);
      return;
    }
    if (cmd.startsWith("cat ")) {
      const f = cmd.slice(4).trim();
      if (f === "about.txt")
        return print(
          "Neither a purist nor a generalist — a builder between languages.\nVibecodes for fun, ships because finishing beats starting.\nKnown issues: starts side projects at 1am. Will not patch.",
        );
      if (PROJECTS[f]) return print(PROJECTS[f]);
      return print(`cat: ${f}: no such file. try ls first. everyone does eventually.`);
    }
    if (cmd === "sudo") return print("sudo: you're already root here. it's a portfolio. take anything.");
    if (cmd === "exit" || cmd === "logout") return print("there is no exit. only the shutdown dialog below. scroll.");
    if (cmd === "vim" || cmd === "vi") return print("vim opened. session ends when you figure out how to quit. (:q!)");

    const fn = CMDS[cmd];
    if (fn) return fn();
    print(`breaksh: ${cmd}: command not found. 'help' lists real ones.`);
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      run(input.value);
      input.value = "";
    }
    e.stopPropagation(); // don't trigger the seal cheat while typing
  });
})();
