// ════════════════════════════════════════════════
      //  WebGL SHADER — simplex noise flow field
      // ════════════════════════════════════════════════
      (function initShader() {
        const canvas = document.getElementById("shader-canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return;

        const VS = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

        const FS = `
    precision mediump float;
    uniform vec2  u_res;
    uniform float u_time;
    uniform float u_vel;
    uniform float u_progress;

    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      float aspect = u_res.x / u_res.y;
      vec2 p = uv * vec2(aspect, 1.0);
      float t = u_time * 0.12;
      float vel = u_vel;
      float n1 = snoise(p * 1.4 + vec2(t * 0.6, t * 0.4)) * 0.5;
      float n2 = snoise(p * 3.2 + vec2(-t * 0.3, t * 0.8) + vel * 0.3) * 0.3;
      float n3 = snoise(p * 7.0 + vec2(t * 0.9, -t * 0.5) + vel * 0.6) * 0.2;
      float n  = n1 + n2 + n3;
      float turb = snoise(p * 5.0 + vec2(t * 2.0, vel * 4.0)) * vel * 0.4;
      n += turb;
      vec3 bg      = vec3(0.059, 0.055, 0.039);
      vec3 surface = vec3(0.110, 0.102, 0.078);
      vec3 glow    = vec3(0.145, 0.180, 0.055);
      float mixA = smoothstep(-0.4, 0.4, n);
      float mixB = smoothstep(0.0, 1.0, u_progress * 0.6);
      vec3 col = mix(bg, surface, mixA * 0.6);
      col = mix(col, glow, max(0.0, n) * 0.25 * (vel + 0.3));
      col = mix(col, bg, mixB * 0.15);
      float vign = 1.0 - smoothstep(0.3, 1.4, length(uv - 0.5) * 1.6);
      col *= mix(0.7, 1.0, vign);
      gl_FragColor = vec4(col, 1.0);
    }
  `;

        function compile(type, src) {
          const s = gl.createShader(type);
          gl.shaderSource(s, src);
          gl.compileShader(s);
          return s;
        }
        const prog = gl.createProgram();
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
          gl.STATIC_DRAW,
        );
        const aPos = gl.getAttribLocation(prog, "a_pos");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(prog, "u_res");
        const uTime = gl.getUniformLocation(prog, "u_time");
        const uVel = gl.getUniformLocation(prog, "u_vel");
        const uProg = gl.getUniformLocation(prog, "u_progress");

        function resize() {
          const dpr = Math.min(window.devicePixelRatio * 0.75, 1.5);
          canvas.width = window.innerWidth * dpr;
          canvas.height = window.innerHeight * dpr;
          canvas.style.width = window.innerWidth + "px";
          canvas.style.height = window.innerHeight + "px";
          gl.viewport(0, 0, canvas.width, canvas.height);
        }
        resize();
        window.addEventListener("resize", resize);

        let vel = 0,
          smoothVel = 0;
        window.__shaderVel = (v) => {
          vel = Math.abs(v);
        };

        const t0 = performance.now();
        function draw() {
          smoothVel += (vel - smoothVel) * 0.08;
          vel *= 0.88;
          const t = (performance.now() - t0) / 1000;
          const el = document.documentElement;
          const p01 = el.scrollTop / (el.scrollHeight - el.clientHeight) || 0;
          gl.uniform2f(uRes, canvas.width, canvas.height);
          gl.uniform1f(uTime, t);
          gl.uniform1f(uVel, smoothVel);
          gl.uniform1f(uProg, p01);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          requestAnimationFrame(draw);
        }
        draw();
      })();
