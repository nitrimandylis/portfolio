// ════════════════════════════════════════════════
//  EXTRAS — the quirky, meta, possibly unnecessary layer
// ════════════════════════════════════════════════
(function extras() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── console easter egg — for the 0.4% who open devtools ──
  console.log(
    "%cnicktrim.%c\n\noh hey, you opened the console.\nthat's the most flattering thing a visitor can do.\n\n// the shader background reacts to your scroll velocity\n// the repos section is live from the GitHub API\n// this message is hardcoded, like all sincerity on the web\n\n+ source: https://github.com/nitrimandylis",
    "color:#d4ff47;font-size:24px;font-weight:bold;font-family:monospace",
    "color:#c8c0ae;font-family:monospace;font-size:12px",
  );

  // ── tab title gag — the page misses you ──
  const realTitle = document.title;
  document.addEventListener("visibilitychange", () => {
    document.title = document.hidden
      ? "// paused. it's fine. take your time."
      : realTitle;
  });

  // ── scroll-speed judge — the site has opinions ──
  const judge = document.getElementById("speed-judge");
  if (judge && !reduced) {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let cooldown = 0;
    const REMARKS_FAST = [
      "// whoa. speed-reading or speed-judging?",
      "// the animations worked hard on themselves, you know",
      "// 88mph. the page is now in 1955.",
    ];
    const REMARKS_IDLE = [
      "// still here? the shader appreciates the company.",
      "// no rush. the pixels aren't going anywhere.",
    ];
    let shown = false;
    function show(text) {
      if (shown) return;
      shown = true;
      judge.textContent = text;
      judge.classList.add("visible");
      setTimeout(() => {
        judge.classList.remove("visible");
        shown = false;
      }, 2600);
    }
    window.addEventListener(
      "scroll",
      () => {
        const now = performance.now();
        const v = Math.abs(window.scrollY - lastY) / Math.max(now - lastT, 1);
        lastY = window.scrollY;
        lastT = now;
        if (v > 7 && now > cooldown) {
          cooldown = now + 15000; // judge sparingly — comedy needs spacing
          show(REMARKS_FAST[Math.floor(Math.random() * REMARKS_FAST.length)]);
        }
      },
      { passive: true },
    );
    // idle remark, once, after 45s of nothing
    let idleTimer;
    const armIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(
        () => show(REMARKS_IDLE[Math.floor(Math.random() * REMARKS_IDLE.length)]),
        45000,
      );
    };
    ["scroll", "mousemove", "keydown"].forEach((e) =>
      window.addEventListener(e, armIdle, { passive: true }),
    );
    armIdle();
  }

  // ── multi-layer parallax — depth via data-speed ──
  // entry numbers drift slower than content; section labels drift faster
  if (!reduced && window.gsap && window.ScrollTrigger) {
    document.querySelectorAll(".entry-num").forEach((el) => {
      gsap.to(el, {
        y: -30,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
    });
    document.querySelectorAll(".entry-year").forEach((el) => {
      gsap.to(el, {
        y: 24,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
    });
    const seal = document.getElementById("about-seal");
    if (seal) {
      gsap.to(seal, {
        y: -40,
        rotation: 3,
        ease: "none",
        scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: 1 },
      });
    }
    // contact headline parallax drift
    gsap.to("#contact-head", {
      y: -50,
      ease: "none",
      scrollTrigger: { trigger: "#contact", start: "top bottom", end: "bottom top", scrub: 1 },
    });
  }

  // ── honest visit counter — localStorage, so it only counts you ──
  const counter = document.getElementById("visit-counter");
  if (counter) {
    let n = 1;
    try {
      n = (parseInt(localStorage.getItem("visits") || "0", 10) || 0) + 1;
      localStorage.setItem("visits", String(n));
    } catch (_) {}
    counter.innerHTML =
      n === 1
        ? `<span class="a">// </span>visit #1. localStorage says we've never met. hi.`
        : `<span class="a">// </span>visit #${n} — according to your own localStorage. I don't track anyone; you track yourself.`;
  }

  // ── end-section reveal ──
  if (window.ScrollTrigger) {
    document.querySelectorAll("#the-end .end-line").forEach((el, i) => {
      ScrollTrigger.create({
        trigger: "#the-end",
        start: "top 90%",
        once: true,
        onEnter: () => setTimeout(() => el.classList.add("revealed"), i * 200),
      });
    });
  }

  // ── konami-lite: type "seal" anywhere → the mascot takes over ──
  let buffer = "";
  document.addEventListener("keydown", (e) => {
    if (e.key.length !== 1) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-4);
    if (buffer === "seal") {
      const seal = document.getElementById("about-seal");
      if (!seal) return;
      const clone = seal.cloneNode();
      clone.id = "";
      clone.className = "seal-takeover";
      document.body.appendChild(clone);
      setTimeout(() => clone.remove(), 4000);
    }
  });
})();
