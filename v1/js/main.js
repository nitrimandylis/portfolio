// ════════════════════════════════════════════════
      //  SCROLL + INTERACTIONS
      // ════════════════════════════════════════════════
      gsap.registerPlugin(ScrollTrigger);
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Lenis
      if (!reduced) {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1.5,
        });
        lenis.on("scroll", ({ velocity }) => {
          if (window.__shaderVel) window.__shaderVel(velocity * 0.04);
        });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }

      // Rail
      window.addEventListener(
        "scroll",
        () => {
          const el = document.documentElement;
          const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
          document.getElementById("rail-fill").style.width =
            (isNaN(pct) ? 0 : pct * 100) + "%";
        },
        { passive: true },
      );

      // Active nav
      const navAs = document.querySelectorAll(".nav-links a[data-section]");
      window.addEventListener(
        "scroll",
        () => {
          ["log", "about", "contact"].forEach((id) => {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top <= 130)
              navAs.forEach((a) =>
                a.classList.toggle("active", a.dataset.section === id),
              );
          });
        },
        { passive: true },
      );

      // Cursor
      const glow = document.getElementById("cursor-glow");
      window.addEventListener("mousemove", (e) => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      });

      // Ambient parallax
      const ghostN = document.getElementById("ghost-n");
      window.addEventListener(
        "scroll",
        () => {
          if (!reduced)
            ghostN.style.transform = `translateY(${window.scrollY * 0.06}px)`;
        },
        { passive: true },
      );

      // Log entries reveal
      document.querySelectorAll(".entry").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => setTimeout(() => el.classList.add("revealed"), i * 90),
        });
      });

      // About reveals
      function onEnterReveal(selector, trigger, delay) {
        ScrollTrigger.create({
          trigger: trigger || selector,
          start: "top 80%",
          once: true,
          onEnter: () => {
            setTimeout(() => {
              const el = document.querySelector(selector);
              if (el) el.classList.add("revealed");
            }, delay || 0);
          },
        });
      }
      onEnterReveal("#about-seal", "#about", 0);
      onEnterReveal("#about-heading", "#about", 60);
      onEnterReveal("#about-pull", "#about", 120);
      onEnterReveal("#about-para", "#about", 180);
      onEnterReveal("#about-notes", "#about", 240);
      onEnterReveal("#about-quote", "#about", 300);
      onEnterReveal("#setup-table", "#about", 360);
      onEnterReveal("#about-quote", "#about", 280);
      onEnterReveal(".setup-table", "#about", 340);
      onEnterReveal("#contact-head", "#contact", 0);

// ════════════════════════════════════════════════
      //  PROJECT DATA + OVERLAY
      // ════════════════════════════════════════════════
      const PROJECTS = [
        {
          num: "01",
          title: "Petal",
          accent: ".AI",
          voice: "An AI tutor that actually teaches.",
          note: "// built for IBDP students who needed something that explains — not just answers\n+ deployed. used. improved.",
          body: "Built in SwiftUI with the Gemini API. The insight: students don't need answers — they need the next question. Petal structures learning as dialogue, not retrieval. Native iOS.",
          tags: ["swift", "swiftui", "gemini api", { l: "ai", hi: true }],
        },
        {
          num: "02",
          title: "LLM",
          accent: "-Mafia",
          voice: "LLMs lie. Proved it.",
          note: "// built to see if language models would deceive each other\n+ they did — better than expected",
          body: "Multi-agent Mafia game where every player is an LLM. Given social incentive, will they produce strategic deception? Yes — and eerily well. Flask backend, async agent loop.",
          tags: ["python", "flask", { l: "ai", hi: true }],
        },
        {
          num: "03",
          title: "J.A.R.V.I.S",
          accent: ".",
          voice: "A personal AI that knows the context.",
          note: "// because Siri wasn't enough\n+ persistent memory, tool use, voice",
          body: "Voice-activated personal assistant with persistent memory and tool-use scaffolding. Not a wrapper — a system. Built because I wanted something that actually remembered what we talked about yesterday.",
          tags: ["typescript", "next.js", { l: "ai", hi: true }],
        },
        {
          num: "04",
          title: "kizuna",
          accent: ".",
          voice: "A place for people between places.",
          note: "// full-stack, real-time, production\n+ built from scratch because I needed it",
          body: "Community platform — real-time messaging, profiles, discovery. Built because no existing product quite fit the need. Full-stack TypeScript, PostgreSQL, deployed and used by real people.",
          tags: ["typescript", "next.js", "postgres"],
        },
        {
          num: "05",
          title: "cosmos",
          accent: ".",
          voice: "Scroll velocity as texture.",
          note: "// a tech demo built through vibecoding\n+ the background of this page is a descendant",
          body: "Simplex noise flow field driven by Lenis scroll velocity. Turbulence amplitude maps to scroll speed — fast = chaos, rest = ambient drift. Built in a weekend to see what would happen.",
          tags: ["glsl", "webgl", "typescript"],
        },
      ];

      function openProject(idx) {
        const p = PROJECTS[idx];
        if (!p) return;
        document.getElementById("ov-num").innerHTML =
          `<span class="a">// </span>entry ${p.num}`;
        document.getElementById("ov-title").innerHTML =
          `${p.title}<em>${p.accent}</em>`;
        document.getElementById("ov-voice").textContent = p.voice;
        document.getElementById("ov-note").innerHTML = p.note
          .replace(/\n/g, "<br>")
          .replace(/\/\/ /g, '<span class="a">// </span>')
          .replace(/\+ /g, '<span class="a">+ </span>');
        document.getElementById("ov-body").textContent = p.body;
        const tagsEl = document.getElementById("ov-tags");
        tagsEl.innerHTML = "";
        p.tags.forEach((t) => {
          const s = document.createElement("span");
          const label = typeof t === "string" ? t : t.l;
          const hi = typeof t === "object" && t.hi;
          s.className = "tag" + (hi ? " hi" : "");
          s.textContent = label;
          tagsEl.appendChild(s);
        });
        document.getElementById("overlay").classList.add("open");
        document.body.style.overflow = "hidden";
      }
      function closeOverlay() {
        document.getElementById("overlay").classList.remove("open");
        document.body.style.overflow = "";
      }

      document.querySelectorAll(".entry[data-project]").forEach((el) => {
        el.addEventListener("click", () => openProject(+el.dataset.project));
      });
      document
        .getElementById("overlay-close")
        .addEventListener("click", closeOverlay);
      document.getElementById("overlay").addEventListener("click", (e) => {
        if (e.target.id === "overlay") closeOverlay();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeOverlay();
      });

      // ── TWEAKS ──
      const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
        accentColor: "#bb10f9",
        marqueePaused: true,
      }; /*EDITMODE-END*/

      let tweaks = Object.assign({}, TWEAK_DEFAULTS);
      function applyTweaks() {
        document.documentElement.style.setProperty(
          "--accent",
          tweaks.accentColor,
        );
        const m = document.querySelector(".marquee");
        if (m)
          m.style.animationPlayState = tweaks.marqueePaused
            ? "paused"
            : "running";
      }
      applyTweaks();

      let tweakPanel = null;
      function buildTweakPanel() {
        if (tweakPanel) {
          tweakPanel.remove();
          tweakPanel = null;
          return;
        }
        tweakPanel = document.createElement("div");
        tweakPanel.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:200;background:var(--surface);border:1px solid var(--border);padding:20px 24px;border-radius:2px;min-width:230px;font-family:var(--ff-mono);font-size:.63rem;color:var(--body);`;
        tweakPanel.innerHTML = `
    <p style="color:var(--accent);letter-spacing:.06em;margin-bottom:14px;font-size:.58rem">// tweaks</p>
    <label style="display:block;margin-bottom:12px">
      <span style="color:var(--muted);display:block;margin-bottom:4px">accent color</span>
      <input id="tw-color" type="color" value="${tweaks.accentColor}" style="width:100%;height:26px;border:1px solid var(--border);background:var(--bg);cursor:pointer;border-radius:2px">
    </label>
    <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
      <input id="tw-marquee" type="checkbox" ${tweaks.marqueePaused ? "checked" : ""}>
      <span>pause marquee</span>
    </label>`;
        document.body.appendChild(tweakPanel);
        tweakPanel.querySelector("#tw-color").addEventListener("input", (e) => {
          tweaks.accentColor = e.target.value;
          applyTweaks();
          window.parent.postMessage(
            {
              type: "__edit_mode_set_keys",
              edits: { accentColor: e.target.value },
            },
            "*",
          );
        });
        tweakPanel
          .querySelector("#tw-marquee")
          .addEventListener("change", (e) => {
            tweaks.marqueePaused = e.target.checked;
            applyTweaks();
            window.parent.postMessage(
              {
                type: "__edit_mode_set_keys",
                edits: { marqueePaused: e.target.checked },
              },
              "*",
            );
          });
      }
      window.addEventListener("message", (e) => {
        if (e.data?.type === "__activate_edit_mode") buildTweakPanel();
        if (e.data?.type === "__deactivate_edit_mode") {
          if (tweakPanel) {
            tweakPanel.remove();
            tweakPanel = null;
          }
        }
      });
      window.parent.postMessage({ type: "__edit_mode_available" }, "*");

      // ── CYCLING CONTACT WORD ──────────────────────
      (function () {
        const words = [
          "weird.",
          "cursed.",
          "unhinged.",
          "beautiful.",
          "chaotic.",
          "strange.",
          "alive.",
          "broken.",
          "unexpected.",
          "necessary.",
          "impossible.",
          "fun.",
          "haunted.",
          "excellent.",
          "disturbing.",
          "delightful.",
          "snollygoster.",
          "ultracrepidarian.",
          "lethologica.",
          "slubberdegullion.",
          "frowzy.",
          "gonzo.",
          "widdershins.",
          "lollygagging.",
          "bumfuzzled.",
          "collywobbles.",
          "gobsmacking.",
          "kerfuffled.",
          "limerent.",
          "noctivagant.",
          "petrichor-scented.",
          "quixotic.",
          "rambunctious.",
          "sonder-inducing.",
          "taradiddle.",
          "ultroneous.",
          "vellichor.",
          "wamble-cropped.",
          "xenodochial.",
          "yarborough.",
          "zugzwang-adjacent.",
        ];
        let i = 0;
        const el = document.getElementById("cycle-word");
        if (!el) return;
        setInterval(() => {
          el.classList.add("swap-out");
          setTimeout(() => {
            i = (i + 1) % words.length;
            el.textContent = words[i];
            el.classList.remove("swap-out");
            el.classList.add("swap-in");
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                el.classList.add("active");
                setTimeout(() => el.classList.remove("swap-in", "active"), 400);
              }),
            );
          }, 300);
        }, 2200);
      })();
