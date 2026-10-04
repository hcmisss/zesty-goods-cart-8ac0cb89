import { ShaderCanvas } from "./shader";

const FRAG = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color0;
uniform vec3 u_color1;
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = uv * 4.0;
  float t = u_time * 0.3;
  vec2 c = vec2(2.0 + sin(t) * 1.5, 2.0 + cos(t * 0.7) * 1.5);
  float v = sin(p.x + t) + sin(p.y + t * 1.3) + sin(p.x + p.y + t * 0.8) + sin(length(p - c) * 1.5 - t);
  v *= 0.25;
  float a = smoothstep(0.0, 1.0, 0.5 + 0.5 * sin(v * 3.14159));
  vec3 col = mix(u_color1, u_color0, 0.5 + 0.5 * sin(v * 3.14159 + 1.57));
  float mask = 1.0 - smoothstep(0.35, 0.75, length(uv - 0.5));
  gl_FragColor = vec4(col, a * mask * 0.28);
}`;

const COLORS = ["--primary", "--accent"];

/** Animated plasma layer, fixed behind all page content. */
const Plasma = () => (
  <ShaderCanvas fragment={FRAG} colors={COLORS} className="pointer-events-none fixed inset-0 -z-[1] h-screen w-screen" />
);

export default Plasma;
