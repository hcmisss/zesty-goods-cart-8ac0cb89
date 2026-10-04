import { useEffect, useRef } from "react";

const VERT = `attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.0,1.0);}`;

const readColor = (name: string, fallback: [number, number, number]): [number, number, number] => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return fallback;
  const [h, s, l] = raw.replace(/%/g, "").split(/\s+/).map(Number);
  if ([h, s, l].some((n) => Number.isNaN(n))) return fallback;
  const sat = s / 100, lig = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) => lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
};

interface ShaderCanvasProps {
  fragment: string;
  colors?: string[];
  className?: string;
}

/** Raw WebGL 1 full-screen quad. Provides u_resolution, u_time, u_dpr, u_pointer, u_trail[8], u_color0..3. */
export const ShaderCanvas = ({ fragment, colors = ["--primary", "--foreground", "--accent", "--secondary"], className }: ShaderCanvasProps) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true, antialias: false });
    if (!gl) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("u_resolution"), uTime = u("u_time"), uDpr = u("u_dpr"), uPtr = u("u_pointer"), uTrail = u("u_trail");
    colors.forEach((c, i) => {
      const [r, g, b] = readColor(c, [1, 0.4, 0.1]);
      gl.uniform3f(u(`u_color${i}`), r, g, b);
    });

    const pointer = [0.5, 0.5];
    const trail = new Float32Array(16).fill(0.5);
    const onMove = (e: PointerEvent) => {
      pointer[0] = e.clientX / window.innerWidth;
      pointer[1] = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr * 0.5);
      canvas.height = Math.floor(canvas.clientHeight * dpr * 0.5);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let raf = 0;
    const start = performance.now();
    const draw = () => {
      trail.copyWithin(2, 0, 14);
      trail[0] = pointer[0]; trail[1] = pointer[1];
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 0 : (performance.now() - start) / 1000);
      gl.uniform1f(uDpr, dpr);
      gl.uniform2f(uPtr, pointer[0], pointer[1]);
      gl.uniform2fv(uTrail, trail);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduced && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const onVis = () => { if (!document.hidden && !reduced) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } };
    document.addEventListener("visibilitychange", onVis);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [fragment, colors]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
};
