// ════════════════════════════════════════════════
//  LIVE WALLPAPER — drifting halftone dots, scroll-reactive
//  The old site had a GLSL shader. This is its cream-colored cousin.
// ════════════════════════════════════════════════
(function wallpaper() {
  const canvas = document.getElementById("wallpaper");
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w, h, dots;
  const GAP = 46;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = [];
    for (let y = GAP / 2; y < h + GAP; y += GAP) {
      for (let x = GAP / 2; x < w + GAP; x += GAP) {
        dots.push({ x, y, seed: Math.random() * Math.PI * 2 });
      }
    }
  }
  resize();
  window.addEventListener("resize", resize);

  // scroll velocity feeds turbulence — same trick, new clothes
  let vel = 0;
  let smooth = 0;
  window.__wallVel = (v) => {
    vel = Math.min(Math.abs(v), 30);
  };
  let lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      vel = Math.min(Math.abs(window.scrollY - lastY) * 0.4, 30);
      lastY = window.scrollY;
    },
    { passive: true },
  );

  const t0 = performance.now();
  function draw() {
    smooth += (vel - smooth) * 0.06;
    vel *= 0.9;
    const t = (performance.now() - t0) / 1000;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(31, 138, 140, 0.18)";

    for (const d of dots) {
      const wob =
        Math.sin(t * 0.5 + d.seed + d.x * 0.004) *
        Math.cos(t * 0.3 + d.y * 0.005);
      const r = 1.1 + Math.abs(wob) * 1.6 + smooth * 0.18;
      const ox = Math.sin(t * 0.2 + d.seed) * (3 + smooth * 0.6);
      const oy = Math.cos(t * 0.25 + d.seed * 2) * (3 + smooth * 0.6);
      ctx.beginPath();
      ctx.arc(d.x + ox, d.y + oy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduced) requestAnimationFrame(draw);
  }
  draw();
})();
