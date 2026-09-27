"use client";

/*
 * Leaf garden: procedural tendrils that grow leaves, drawn with three.js.
 *
 * Ported from "Procedural leaf growth with three.js" by Onload
 * (https://codepen.io/onload/pen/bNVxOrZ), used under the MIT License:
 *
 *   Copyright (c) 2026 Onload (https://codepen.io/onload/pen/bNVxOrZ)
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a
 *   copy of this software and associated documentation files (the
 *   "Software"), to deal in the Software without restriction, including
 *   without limitation the rights to use, copy, modify, merge, publish,
 *   distribute, sublicense, and/or sell copies of the Software, and to permit
 *   persons to whom the Software is furnished to do so, subject to the
 *   following conditions:
 *
 *   The above copyright notice and this permission notice shall be included
 *   in all copies or substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 *   OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *   MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 *   NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *   DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 *   OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 *   USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * The leaf shapes, palettes, stem and growth curves are the original's. What
 * changed for a footer:
 *   - It fills its container instead of the window, in pixel units, so leaves
 *     keep a sensible size in a short strip. Leaf length, stem width and leaf
 *     count scale with each stem's length.
 *   - Each tendril's leaves are one merged mesh that grows in the vertex
 *     shader from a shared clock: two draw calls a tendril instead of eighty.
 *   - A seeded random, so the garden grows the same way on every visit.
 *   - It grows once it scrolls into view and pauses off screen. While on
 *     screen a light breeze keeps it swaying (rendered at 30fps when nothing
 *     else is moving).
 *   - The plants answer the pointer: they lean away from it, sway when it
 *     brushes through them (a damped spring per stem), and their leaves
 *     flutter for a moment after. Clicking plants a new tendril there.
 *   - Reduced motion shows it fully grown and still. Dark mode gets a night
 *     palette.
 *   - three.js loads only when the garden nears the viewport.
 *   - The original's click sound was an mp3 on onload.agency; planting here
 *     plays a small synthesised one instead (a twig tick and two bell notes),
 *     so there's no external asset.
 */

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export type LeafGardenHandle = {
  /** Grow a new tendril at a point across the garden (0 to 1). Random if omitted. */
  plant: (x?: number) => void;
};

type LeafGardenProps = {
  className?: string;
  /** Same seed, same garden. */
  seed?: number;
  /** Tendrils per 1000px of width. */
  density?: number;
  /** How tall stems grow, as a fraction of the garden's height. */
  reach?: [number, number];
  /** "night" keeps the dark palette whatever the site theme is. */
  tone?: "auto" | "night";
  /** Plant a tendril wherever the garden is clicked or tapped. */
  interactive?: boolean;
  /** Play the sprout sound when a tendril is planted. */
  sound?: boolean;
};

const PALETTES = [
  ["#B5E0B5", "#C7E9C0", "#D9F2D9", "#A9D8A9", "#CCE5CC"], // Greens
  ["#E6E3B3", "#D9D9A6", "#F2EFD0"], // Yellows & Olives
  ["#B3D9D2", "#C9E3DE", "#A6CFC6", "#E0F2EE"], // Blue-Greens
];
const ACCENT_PALETTE = ["#E0CFC4", "#D4BFA7"];
const STEM_DAY = "#503214";
const STEM_NIGHT = "#8a6a4a";

/** Planted tendrils kept at once; the oldest fades out past this. */
const MAX_PLANTED = 20;

// Pointer response. Bend is the tip's sideways offset as a fraction of the
// stem's length; the spring pulls it back with a little overshoot.
const REACH_PX = 110; // how close the pointer has to come
const SPRING = 28; // stiffness: roughly one sway a second
const DAMPING = 2.4; // settles in about two seconds
const LEAN = 2.4; // how far stems lean away from a resting pointer
const DRAG = 0.3; // how much of the pointer's speed a brushed stem picks up
const MAX_BEND = 0.32;
/** Breeze strength: the tip sways about 3% of its stem's length. */
const BREEZE = 0.03;

// A seedling cursor over plantable soil, with the point at its root.
const PLANT_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' stroke-linecap='round' stroke-linejoin='round'>" +
    "<g fill='none' stroke='white' stroke-width='3.5'><path d='M12 21.5v-8'/><path d='M12 14c0-3.5 2.5-6 6.5-6 0 3.5-2.5 6-6.5 6z'/><path d='M12 16.5c0-3-2-5-5.5-5 0 3 2 5 5.5 5z'/></g>" +
    "<g stroke='#3d5a36' stroke-width='1.5'><path d='M12 21.5v-8' fill='none'/><path d='M12 14c0-3.5 2.5-6 6.5-6 0 3.5-2.5 6-6.5 6z' fill='#b5e0b5'/><path d='M12 16.5c0-3-2-5-5.5-5 0 3 2 5 5.5 5z' fill='#cce5cc'/></g>" +
    "</svg>",
)}") 12 21, crosshair`;

// Both shaders bend a point by where it sits along its stem (h, 0 at the root
// to 1 at the tip): sideways by bend·length·h², dipping a little as it leans.
const BEND_GLSL = /* glsl */ `
  uniform float uClock;
  uniform float uWind;
  uniform float uPhase;
  uniform float uRootX;

  vec2 bendAt(float h, float bend, float len) {
    float h2 = h * h;
    return vec2(bend * len * h2, -abs(bend) * len * h2 * h * 0.25);
  }

  // The breeze, as extra bend: each stem sways on its own phase, and a slow
  // gust rolls across the garden, leaning the stems it passes a little.
  float breeze() {
    float gust = 0.5 + 0.5 * sin(uClock * 0.45 - uRootX * 0.0035);
    float sway = 0.7 * sin(uClock * 1.1 + uPhase) + 0.3 * sin(uClock * 2.7 + uPhase * 1.7);
    return uWind * ((0.35 + 0.65 * gust) * sway + 0.6 * gust);
  }
`;

const stemVertexShader = /* glsl */ `
  attribute float segmentT;
  uniform float uTime;
  uniform float uBirth;
  uniform float uDuration;
  uniform float uMaxWidth;
  uniform float uMinWidth;
  uniform float uBend;
  uniform float uLength;
  varying float vT;
  varying float vProgress;
  ${BEND_GLSL}

  void main() {
    vT = segmentT;
    vProgress = clamp((uTime - uBirth) / uDuration, 0.0, 1.0);
    float width = mix(uMaxWidth, uMinWidth, segmentT);
    vec3 displaced = position + normal * width;
    displaced.xy += bendAt(segmentT, uBend + breeze(), uLength);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const stemFragmentShader = /* glsl */ `
  uniform vec3 uDay;
  uniform vec3 uNightColor;
  uniform float uNight;
  uniform float uAlpha;
  varying float vT;
  varying float vProgress;

  void main() {
    if (vT > vProgress) discard;
    gl_FragColor = vec4(mix(uDay, uNightColor, uNight), 0.8 * uAlpha);
  }
`;

const leafVertexShader = /* glsl */ `
  attribute vec2 aOrigin;
  attribute float aAngle;
  attribute float aStart;
  attribute float aDuration;
  attribute float aT;
  attribute float aPhase;
  attribute vec3 aDay;
  attribute vec3 aNightColor;
  uniform float uTime;
  uniform float uNight;
  uniform float uBend;
  uniform float uLength;
  uniform float uRustle;
  uniform vec2 uPointer;
  uniform float uHover;
  uniform float uReach;
  varying vec3 vColor;
  ${BEND_GLSL}

  void main() {
    float t = clamp((uTime - aStart) / aDuration, 0.0, 1.0);
    float grow = 1.0 - pow(1.0 - t, 3.0);
    vec2 p = position.xy;
    p.x *= grow;
    p.y *= pow(grow, 1.5); // Width grows slightly slower

    // Ride the stem's bend (and the breeze), and tilt with it.
    float bend = uBend + breeze();
    vec2 origin = aOrigin + bendAt(aT, bend, uLength);
    float angle = aAngle - bend * 2.0 * aT;
    angle += uWind * 1.6 * sin(uClock * 2.2 + aPhase + aOrigin.x * 0.02);

    // Turn away from a nearby pointer, and flutter while rustled.
    vec2 away = origin - uPointer;
    float dist = length(away);
    float near = uHover * smoothstep(uReach, 0.0, dist);
    vec2 dir = vec2(cos(angle), sin(angle));
    float side = (dir.x * away.y - dir.y * away.x) / max(dist, 1.0);
    angle += near * 0.4 * clamp(side * 2.0, -1.0, 1.0);
    angle += uRustle * 0.22 * sin(uClock * 13.0 + aPhase);

    float c = cos(angle);
    float s = sin(angle);
    p = vec2(p.x * c - p.y * s, p.x * s + p.y * c) + origin;
    vColor = mix(aDay, aNightColor, uNight);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  }
`;

const leafFragmentShader = /* glsl */ `
  uniform float uAlpha;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 0.8 * uAlpha);
  }
`;

// ── Sprout sound ──
// A woody tick and two soft bell notes, a step apart on a pentatonic scale,
// so a run of plantings sounds like a tune rather than one repeated click.
const SPROUT_NOTES = [659.25, 783.99, 880, 987.77, 1174.66, 1318.51, 1567.98]; // E5 G5 A5 B5 D6 E6 G6
let audio: AudioContext | null = null;

function playSprout() {
  try {
    const Context =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) return;
    audio ??= new Context();
    if (audio.state === "suspended") void audio.resume();
    const ctx = audio;
    const now = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.value = 0.2;
    out.connect(ctx.destination);

    // Tick: 30ms of decaying noise through a band-pass, like a snapped twig.
    const length = Math.floor(ctx.sampleRate * 0.03);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2;
    const tick = ctx.createBufferSource();
    tick.buffer = buffer;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 2400;
    band.Q.value = 1.2;
    const tickLevel = ctx.createGain();
    tickLevel.gain.value = 0.5;
    tick.connect(band).connect(tickLevel).connect(out);
    tick.start(now);

    // Bells: sine partials that rise a touch as they sound, the second note
    // one step up and 70ms later.
    const step = Math.floor(Math.random() * (SPROUT_NOTES.length - 1));
    const bells: [number, number, number][] = [
      [SPROUT_NOTES[step], 0, 0.34],
      [SPROUT_NOTES[step + 1], 0.07, 0.2],
    ];
    for (const [note, delay, level] of bells) {
      for (const [ratio, share, decay] of [
        [1, 1, 0.6],
        [2.01, 0.3, 0.25],
        [3.02, 0.12, 0.12],
      ] as const) {
        const at = now + delay;
        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(note * ratio * 0.97, at);
        osc.frequency.exponentialRampToValueAtTime(note * ratio, at + 0.05);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(level * share, at + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
        osc.connect(gain).connect(out);
        osc.start(at);
        osc.stop(at + decay + 0.05);
      }
    }
    window.setTimeout(() => out.disconnect(), 1000);
  } catch {
    // No audio: plant silently.
  }
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Spec = { seed: number; x: number; birth: number; planted: boolean };

export const LeafGarden = forwardRef<LeafGardenHandle, LeafGardenProps>(function LeafGarden(
  { className, seed = 7, density = 7, reach = [0.45, 0.95], tone = "auto", interactive = false, sound = true },
  ref,
) {
  const hostRef = useRef<HTMLDivElement>(null);
  const plantRef = useRef<(x?: number) => void>(() => {});
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const [reachMin, reachMax] = reach;

  useImperativeHandle(ref, () => ({ plant: (x) => plantRef.current(x) }), []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let teardown = () => {};

    // Fetch three.js a little before the garden scrolls in.
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        near.disconnect();
        import("three").then((THREE) => {
          if (!disposed) teardown = start(THREE, host);
        });
      },
      { rootMargin: "400px 0px" },
    );
    near.observe(host);

    function start(THREE: typeof import("three"), host: HTMLDivElement) {
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      } catch {
        return () => {}; // No WebGL: the garden just isn't there.
      }
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const canvas = renderer.domElement;
      canvas.setAttribute("aria-hidden", "true");
      Object.assign(canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      host.appendChild(canvas);

      let W = Math.max(1, host.clientWidth);
      let H = Math.max(1, host.clientHeight);
      renderer.setSize(W, H, false);
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(0, W, H, 0, -1, 1);

      const isDark = () => tone === "night" || document.documentElement.classList.contains("dark");
      // Shared by every material: the uniform objects are the same references.
      const uTime = { value: 0 };
      const uClock = { value: 0 };
      const uNight = { value: isDark() ? 1 : 0 };
      const uPointer = { value: new THREE.Vector2(-1e5, -1e5) };
      const uHover = { value: 0 };
      const uReach = { value: REACH_PX };
      const uWind = { value: reduced ? 0 : BREEZE };

      // The first tendrils: spread across the width, sprouting from the
      // middle outwards.
      const rand = mulberry32(seed);
      const count = Math.max(3, Math.round((W / 1000) * density));
      const specs: Spec[] = Array.from({ length: count }, (_, i) => ({
        seed: Math.floor(rand() * 1e9),
        x: (i + 0.5 + (rand() - 0.5) * 0.7) / count,
        birth: 0,
        planted: false,
      }));
      [...specs]
        .sort((a, b) => Math.abs(a.x - 0.5) - Math.abs(b.x - 0.5))
        .forEach((spec, rank) => (spec.birth = reduced ? -1e3 : 0.1 + rank * 0.22 + rand() * 0.1));

      type Tendril = {
        spec: Spec;
        stem: import("three").Mesh;
        leaves: import("three").Mesh;
        end: number;
        length: number;
        /** Points along the stem for pointer hit tests: x, y, h triples. */
        samples: Float32Array;
        bend: number;
        velocity: number;
        rustle: number;
        /** Clock time it started fading out, once evicted. */
        dying: number | null;
        uBend: { value: number };
        uRustle: { value: number };
        uAlpha: { value: number };
      };
      let tendrils: Tendril[] = [];
      let order = 0;

      function build(spec: Spec): Tendril {
        const r = mulberry32(spec.seed);
        const between = (min: number, max: number) => min + r() * (max - min);

        const start = new THREE.Vector3(spec.x * W, -6, 0);
        const endY = Math.min(start.y + H * between(reachMin, reachMax), H - 8);
        const sway = Math.min(W * 0.4, H * 1.1);
        const end = new THREE.Vector3(start.x + (r() - 0.5) * sway, endY, 0);
        const control = new THREE.Vector3(
          (start.x + end.x) / 2 + (r() - 0.5) * sway,
          (start.y + end.y) / 2 + r() * H * 0.1,
          0,
        );
        const curve = new THREE.QuadraticBezierCurve3(start, control, end);
        const length = curve.getLength();
        const duration = 1 / between(0.3, 0.9);

        const basePalette = PALETTES[Math.floor(r() * PALETTES.length)];
        const palette = [...basePalette, ...basePalette, ...basePalette, ...ACCENT_PALETTE];

        const uBend = { value: 0 };
        const uRustle = { value: 0 };
        const uAlpha = { value: 1 };
        const uLength = { value: length };
        const uPhase = { value: r() * Math.PI * 2 };
        const uRootX = { value: start.x };

        // Stem: a ribbon along the curve, revealed from the root up.
        const segments = 100;
        const points = curve.getPoints(segments);
        const vertices: number[] = [];
        const normals: number[] = [];
        const segmentTs: number[] = [];
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const p = points[i];
          const tangent = curve.getTangent(t).normalize();
          vertices.push(p.x, p.y, 0, p.x, p.y, 0);
          normals.push(-tangent.y, tangent.x, 0, tangent.y, -tangent.x, 0);
          segmentTs.push(t, t);
        }
        const stemIndex: number[] = [];
        for (let i = 0; i < segments; i++) {
          const i2 = i * 2;
          stemIndex.push(i2, i2 + 1, i2 + 2, i2 + 1, i2 + 3, i2 + 2);
        }
        const stemGeometry = new THREE.BufferGeometry();
        stemGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        stemGeometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
        stemGeometry.setAttribute("segmentT", new THREE.Float32BufferAttribute(segmentTs, 1));
        stemGeometry.setIndex(stemIndex);
        const maxWidth = Math.min(2.6, Math.max(1.1, length * 0.007));
        const stem = new THREE.Mesh(
          stemGeometry,
          new THREE.ShaderMaterial({
            vertexShader: stemVertexShader,
            fragmentShader: stemFragmentShader,
            uniforms: {
              uTime,
              uClock,
              uWind,
              uPhase,
              uRootX,
              uNight,
              uBend,
              uLength,
              uAlpha,
              uBirth: { value: spec.birth },
              uDuration: { value: duration },
              uMaxWidth: { value: maxWidth },
              uMinWidth: { value: maxWidth * 0.25 },
              uDay: { value: new THREE.Color(STEM_DAY) },
              uNightColor: { value: new THREE.Color(STEM_NIGHT) },
            },
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            depthWrite: false,
          }),
        );

        // Leaves: pairs along the stem, each a strip between its two edges.
        const leafPairs = Math.round(Math.min(40, Math.max(12, length / 11)));
        const maxLength = Math.min(150, Math.max(18, length * 0.3));
        const edge = 24;
        const pos: number[] = [];
        const origin: number[] = [];
        const angle: number[] = [];
        const startAt: number[] = [];
        const growFor: number[] = [];
        const along: number[] = [];
        const phase: number[] = [];
        const day: number[] = [];
        const night: number[] = [];
        const leafIndex: number[] = [];
        const color = new THREE.Color();
        const hsl = { h: 0, s: 0, l: 0 };

        for (let k = 1; k < leafPairs; k++) {
          for (const side of [-1, 1]) {
            const tk = Math.pow(k / leafPairs, 0.8);
            let p: number;
            let wRatio: number;
            let kappa = 0;
            let beta = 0;
            let lengthScale = 1;
            const shape = r();
            if (shape < 0.4) {
              p = between(2.2, 2.6); wRatio = between(0.08, 0.12); kappa = between(-0.05, 0.05); beta = between(-0.1, 0.1);
            } else if (shape < 0.7) {
              p = between(1.4, 1.8); wRatio = between(0.14, 0.18);
            } else if (shape < 0.9) {
              p = between(1.8, 2.2); wRatio = between(0.1, 0.14); kappa = side * between(0.12, 0.25); beta = side * between(0.1, 0.2);
            } else {
              p = between(1.6, 2.0); wRatio = between(0.12, 0.15); lengthScale = 0.6;
            }
            const L = Math.sin(Math.PI * tk) * maxLength * lengthScale * between(0.9, 1.1);
            const Wk = L * wRatio;

            const at = curve.getPoint(tk);
            const tangent = curve.getTangent(tk);
            const leafAngle =
              Math.atan2(tangent.y, tangent.x) +
              side * THREE.MathUtils.lerp(25, 55, tk) * THREE.MathUtils.DEG2RAD +
              between(-7, 7) * THREE.MathUtils.DEG2RAD;

            color.set(palette[Math.floor(r() * palette.length)]);
            color.getHSL(hsl);
            const l = hsl.l * between(0.95, 1.05);
            color.setHSL(hsl.h, hsl.s, l);
            const [dr, dg, db] = [color.r, color.g, color.b];
            color.setHSL(hsl.h, hsl.s * 0.8, l * 0.46);
            const [nr, ng, nb] = [color.r, color.g, color.b];

            const leafStart = spec.birth + tk * duration + between(-0.12, 0.12);
            const leafDuration = between(0.4, 0.9);
            const leafPhase = r() * Math.PI * 2;
            const base = pos.length / 3;
            for (let i = 0; i <= edge; i++) {
              const s = i / edge;
              const cx = s * L;
              const cy = kappa * L * (1 - Math.pow(1 - 2 * s, 2));
              const ws = Wk * Math.pow(Math.sin(Math.PI * s), p);
              const ds = beta * (1 - s) * ws;
              pos.push(cx, cy + ws + ds, 0, cx, cy - ws + ds, 0);
              for (let n = 0; n < 2; n++) {
                origin.push(at.x, at.y);
                angle.push(leafAngle);
                startAt.push(leafStart);
                growFor.push(leafDuration);
                along.push(tk);
                phase.push(leafPhase);
                day.push(dr, dg, db);
                night.push(nr, ng, nb);
              }
            }
            for (let i = 0; i < edge; i++) {
              const a = base + i * 2;
              leafIndex.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
            }
          }
        }

        const leafGeometry = new THREE.BufferGeometry();
        leafGeometry.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        leafGeometry.setAttribute("aOrigin", new THREE.Float32BufferAttribute(origin, 2));
        leafGeometry.setAttribute("aAngle", new THREE.Float32BufferAttribute(angle, 1));
        leafGeometry.setAttribute("aStart", new THREE.Float32BufferAttribute(startAt, 1));
        leafGeometry.setAttribute("aDuration", new THREE.Float32BufferAttribute(growFor, 1));
        leafGeometry.setAttribute("aT", new THREE.Float32BufferAttribute(along, 1));
        leafGeometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phase, 1));
        leafGeometry.setAttribute("aDay", new THREE.Float32BufferAttribute(day, 3));
        leafGeometry.setAttribute("aNightColor", new THREE.Float32BufferAttribute(night, 3));
        leafGeometry.setIndex(leafIndex);
        const leaves = new THREE.Mesh(
          leafGeometry,
          new THREE.ShaderMaterial({
            vertexShader: leafVertexShader,
            fragmentShader: leafFragmentShader,
            uniforms: { uTime, uClock, uWind, uPhase, uRootX, uNight, uPointer, uHover, uReach, uBend, uLength, uRustle, uAlpha },
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            depthWrite: false,
          }),
        );
        // Geometry lives in page pixels, which the camera always spans, and
        // the shaders move it, so bounding spheres would be wrong anyway.
        stem.frustumCulled = false;
        leaves.frustumCulled = false;
        stem.renderOrder = order++;
        leaves.renderOrder = order++;
        scene.add(stem, leaves);

        const samples = new Float32Array(12 * 3);
        for (let i = 0; i < 12; i++) {
          const h = (i + 1) / 12;
          const at = curve.getPoint(h);
          samples.set([at.x, at.y, h], i * 3);
        }

        return {
          spec,
          stem,
          leaves,
          end: spec.birth + duration + 1.1,
          length,
          samples,
          bend: 0,
          velocity: 0,
          rustle: 0,
          dying: null,
          uBend,
          uRustle,
          uAlpha,
        };
      }

      function dispose(t: Tendril) {
        for (const mesh of [t.stem, t.leaves]) {
          scene.remove(mesh);
          mesh.geometry.dispose();
          (mesh.material as import("three").Material).dispose();
        }
      }

      function remove(t: Tendril) {
        dispose(t);
        tendrils = tendrils.filter((other) => other !== t);
        const i = specs.indexOf(t.spec);
        if (i !== -1) specs.splice(i, 1);
      }

      function rebuild() {
        // Anything already fading out goes now rather than fading twice.
        for (const t of tendrils) {
          const i = specs.indexOf(t.spec);
          if (t.dying !== null && i !== -1) specs.splice(i, 1);
        }
        tendrils.forEach(dispose);
        order = 0;
        tendrils = specs.map(build);
      }

      // Where the pointer is, in garden pixels (y up from the bottom edge),
      // and how fast it's moving. Kept in client coordinates too, so a scroll
      // under a still pointer can move it relative to the garden.
      const pointer = { x: -1e5, y: -1e5, vx: 0, clientX: 0, clientY: 0, stamp: 0, known: false, inside: false, moved: false };

      function locate(clientX: number, clientY: number) {
        const rect = host.getBoundingClientRect();
        pointer.x = clientX - rect.left;
        pointer.y = rect.bottom - clientY;
        pointer.inside =
          clientX > rect.left - REACH_PX &&
          clientX < rect.right + REACH_PX &&
          clientY > rect.top - REACH_PX &&
          clientY < rect.bottom + REACH_PX;
      }

      // Two clocks. `time` drives growth and only runs once the garden has
      // been seen and while it's on screen, so leaving and coming back picks
      // up where it stopped. `clock` drives the flutter.
      let time = reduced ? 1e4 : 0;
      let clock = 0;
      let started = false;
      let visible = false;
      let raf = 0;
      let last = 0;
      let lastDraw = 0;

      function settle(dt: number) {
        let moving = false;
        const target = pointer.inside ? 1 : 0;
        uHover.value += (target - uHover.value) * (1 - Math.exp(-dt * 8));
        if (Math.abs(target - uHover.value) < 0.002) uHover.value = target;
        else moving = true;
        if (pointer.moved) moving = true;
        pointer.moved = false;
        pointer.vx *= Math.exp(-dt * 10);
        uPointer.value.set(pointer.x, pointer.y);

        for (const t of [...tendrils]) {
          if (t.dying !== null) {
            t.uAlpha.value = Math.max(0, 1 - (clock - t.dying) / 0.6);
            if (t.uAlpha.value === 0) {
              remove(t);
              continue;
            }
            moving = true;
          }

          // Nearest point on the stem (where it is now, bent).
          let nearest = Infinity;
          let h = 0;
          let x = 0;
          for (let i = 0; i < t.samples.length; i += 3) {
            const sh = t.samples[i + 2];
            const bx = t.samples[i] + t.bend * t.length * sh * sh;
            const by = t.samples[i + 1] - Math.abs(t.bend) * t.length * sh * sh * sh * 0.25;
            const d = Math.hypot(bx - pointer.x, by - pointer.y);
            if (d < nearest) {
              nearest = d;
              h = sh;
              x = bx;
            }
          }
          const closeness = Math.max(0, 1 - nearest / REACH_PX);
          const touch = uHover.value * closeness * closeness * (3 - 2 * closeness);

          let force = -SPRING * t.bend - DAMPING * t.velocity;
          if (touch > 0) {
            // Lean away from where the pointer rests…
            force += Math.max(-1, Math.min(1, (x - pointer.x) / 40)) * touch * LEAN;
            // …and get dragged along by a pointer passing through.
            const carried = (pointer.vx * DRAG) / (t.length * Math.max(h * h, 0.2));
            t.velocity += (carried - t.velocity) * Math.min(1, touch * dt * 10);
            t.rustle = Math.min(1, t.rustle + touch * Math.min(Math.abs(pointer.vx) / 1200, 1) * dt * 5);
          }
          t.velocity += force * dt;
          t.bend += t.velocity * dt;
          if (Math.abs(t.bend) > MAX_BEND) {
            t.bend = Math.sign(t.bend) * MAX_BEND;
            t.velocity *= -0.3;
          }
          t.rustle *= Math.exp(-dt * 1.6);
          // At rest when the spring has settled, even if it settled into a
          // lean around a pointer that's sitting still; the next pointer move
          // wakes the loop again.
          const settled = Math.abs(t.velocity) < 1e-3 && Math.abs(force) < 1e-2 && Math.abs(pointer.vx) < 1;
          if (settled) {
            t.velocity = 0;
            if (touch === 0 && Math.abs(t.bend) < 1e-3) t.bend = 0;
          } else moving = true;
          if (t.rustle < 1e-3) t.rustle = 0;
          else moving = true;
          t.uBend.value = t.bend;
          t.uRustle.value = t.rustle;
        }
        return moving;
      }

      function frame(now: number) {
        raf = 0;
        const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 0;
        last = now;
        if (started && !reduced) time += dt;
        clock += dt;
        const moving = reduced ? false : settle(dt);
        const growing = started && !reduced && time < tendrils.reduce((max, t) => Math.max(max, t.end), 0);
        // Only the breeze is moving: 30 frames a second is plenty for it.
        if (growing || moving || now - lastDraw > 32) {
          uTime.value = time;
          uClock.value = clock;
          renderer.render(scene, camera);
          lastDraw = now;
        }
        if (visible && (growing || moving || uWind.value > 0)) raf = requestAnimationFrame(frame);
        else last = 0;
      }
      const wake = () => {
        if (!raf) raf = requestAnimationFrame(frame);
      };

      rebuild();
      wake();

      const seen = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (entry.intersectionRatio >= 0.2 || entry.intersectionRect.height >= 120) started = true;
          if (visible) wake();
        },
        { threshold: [0, 0.2, 0.5] },
      );
      seen.observe(host);

      let resizeTimer = 0;
      const resize = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          const w = Math.max(1, host.clientWidth);
          const h = Math.max(1, host.clientHeight);
          if (w === W && h === H) return;
          W = w;
          H = h;
          renderer.setSize(W, H, false);
          camera.right = W;
          camera.top = H;
          camera.updateProjectionMatrix();
          rebuild();
          wake();
        }, 120);
      });
      resize.observe(host);

      const theme = new MutationObserver(() => {
        const next = isDark() ? 1 : 0;
        if (next !== uNight.value) {
          uNight.value = next;
          wake();
        }
      });
      theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

      // ── Pointer ──
      const onPointerMove = (e: PointerEvent) => {
        // Always keep the real client position, even off screen, so a scroll
        // back into view places the pointer where it actually is.
        const { clientX: lastX, stamp: lastStamp, known: hadLast } = pointer;
        pointer.clientX = e.clientX;
        pointer.clientY = e.clientY;
        pointer.stamp = e.timeStamp;
        pointer.known = true;
        if (!visible || reduced) {
          pointer.inside = false;
          pointer.vx = 0;
          return;
        }
        const wasInside = pointer.inside;
        locate(e.clientX, e.clientY);
        if (hadLast && wasInside) {
          const dt = Math.max((e.timeStamp - lastStamp) / 1000, 1 / 240);
          const vx = Math.max(-4000, Math.min(4000, (e.clientX - lastX) / dt));
          pointer.vx += (vx - pointer.vx) * 0.5;
        } else pointer.vx = 0;
        if (pointer.inside || wasInside) {
          pointer.moved = true;
          wake();
        }
      };
      // A touch has no hover: let go when the finger lifts.
      const onPointerEnd = (e: PointerEvent) => {
        if (e.pointerType === "mouse") return;
        pointer.inside = false;
        pointer.known = false;
        wake();
      };
      const onLeaveWindow = () => {
        pointer.inside = false;
        pointer.known = false;
        wake();
      };
      const onScroll = () => {
        if (!pointer.known || !visible) return;
        const wasInside = pointer.inside;
        locate(pointer.clientX, pointer.clientY);
        pointer.vx = 0;
        if (pointer.inside || wasInside) {
          pointer.moved = true;
          wake();
        }
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerEnd, { passive: true });
      window.addEventListener("pointercancel", onPointerEnd, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("blur", onLeaveWindow);
      document.documentElement.addEventListener("pointerleave", onLeaveWindow);

      plantRef.current = (x) => {
        const spec: Spec = {
          seed: Math.floor(Math.random() * 1e9),
          x: x ?? 0.1 + Math.random() * 0.8,
          birth: reduced ? -1e3 : time,
          planted: true,
        };
        specs.push(spec);
        const sprout = build(spec);
        tendrils.push(sprout);
        // Neighbours shiver as it breaks ground.
        if (!reduced) {
          for (const t of tendrils) {
            const dx = t.spec.x * W - spec.x * W;
            if (t === sprout || Math.abs(dx) > 160) continue;
            const push = 1 - Math.abs(dx) / 160;
            t.velocity += Math.sign(dx || 1) * push * 0.35;
            t.rustle = Math.min(1, t.rustle + push * 0.5);
          }
        }
        const planted = tendrils.filter((t) => t.spec.planted && t.dying === null);
        if (planted.length > MAX_PLANTED) {
          if (reduced) remove(planted[0]);
          else planted[0].dying = clock;
        }
        started = true;
        wake();
        if (soundRef.current) playSprout();
      };

      const onClick = (e: MouseEvent) => {
        const rect = host.getBoundingClientRect();
        plantRef.current((e.clientX - rect.left) / rect.width);
      };
      if (interactive) {
        host.addEventListener("click", onClick);
        host.style.cursor = PLANT_CURSOR;
      }

      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(resizeTimer);
        seen.disconnect();
        resize.disconnect();
        theme.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerEnd);
        window.removeEventListener("pointercancel", onPointerEnd);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("blur", onLeaveWindow);
        document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
        host.removeEventListener("click", onClick);
        host.style.cursor = "";
        plantRef.current = () => {};
        tendrils.forEach(dispose);
        renderer.dispose();
        canvas.remove();
      };
    }

    return () => {
      disposed = true;
      near.disconnect();
      teardown();
    };
  }, [seed, density, reachMin, reachMax, tone, interactive]);

  return <div ref={hostRef} aria-hidden="true" className={cn("relative overflow-hidden select-none", className)} />;
});
