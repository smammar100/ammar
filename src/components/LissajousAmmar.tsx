'use client';

/*
 * Lissajous Curves — the "AMMAR" wordmark.
 *
 * The cursor.com/compile hero engine re-parameterised to spell AMMAR. Every
 * letter is built from one or more pure
 * Lissajous strokes — x = cx + A·sin(a·t + δ), y = cy + B·sin(b·t) — whose
 * frequencies, phase and rotation are chosen so the raw curves EVOKE the
 * letter. Letters live in 200×200 cells that overlap (negative gapBefore), so
 * the curves interleave across the row.
 *
 * Animation is pure phase/rotation drift:
 *  - Intro: each letter mounts with its phase offset by −amount and eases to
 *    0 over ~2s, staggered left to right; the A's and the R also rotate in.
 *  - Hover: each letter has its own transparent hit-rect; while hovered its
 *    phase drifts +0.3π over 4s (easeOutQuart) and stays there, easing back
 *    on leave. Mid-transition reversals resume from current progress.
 */

import { useEffect, useMemo, useRef } from 'react';

const CELL = 200; // square cell per letter (viewBox units)
const GAP = 8; // default gap when a letter doesn't set gapBefore
const RESOLUTION = 500; // samples per curve

type AnimSpec = {
  amount: number;
  duration: number;
  stagger: number;
  delay?: number;
  easing: keyof typeof EASINGS;
};

type LetterAnim = { phase?: AnimSpec; rotation?: AnimSpec };

// One Lissajous stroke within a cell. The cell is 200×200; amplitude is 90% of
// the half-cell, scaled per-axis, then the stroke is rotated about the cell
// centre and translated by (offsetX, offsetY).
type Figure = {
  a: number; // x frequency
  b: number; // y frequency
  delta: number; // x phase (radians) — animated by the shared intro/hover drift
  rotation: number; // rotation of this stroke inside the cell (deg, clockwise)
  scaleX: number;
  scaleY: number;
  offsetX?: number;
  offsetY?: number;
};

type Letter = {
  rotation: number; // CSS rotation of the whole cell (deg, clockwise) — animated
  stroke: string;
  gapBefore?: number; // negative = overlap the previous cell
  // Every stroke in the cell shares the letter's phase/rotation animation and
  // colour. Single-stroke letters (A, M) have one; R has three (stem/bowl/leg).
  strokes: Figure[];
  intro?: LetterAnim;
  hover?: LetterAnim;
};

/*
 * AMMAR — A and M reuse the ANEMATE glyph recipes (A: degenerate 2:1 parabola
 * opened into a narrow lens at δ=1.42, the two A's mirroring each other's tilt
 * −95°/−85°; M: the classic 1:2 lemniscate). R is built from existing recipes
 * only — two "I" strokes and a tilted "A" — sized to sit in the family:
 *  - stem: the COMPILE "I" (1:1 δ=0 line) stood vertical (rotation 45°), dead
 *    straight, near full cell height.
 *  - bowl: the AMMAR "A" lens (2:1 δ=1.42) tilted −15° and hung off the upper
 *    stem so it reads as the bowl.
 *  - leg: a second "I" (1:1 δ=0 line) kicking down-right from the mid-junction.
 */
const A_FIGURE: Figure = { a: 2, b: 1, delta: 1.42, rotation: 0, scaleX: 0.95, scaleY: 0.8 };
const M_FIGURE: Figure = { a: 1, b: 2, delta: 0, rotation: 0, scaleX: 1, scaleY: 1 };

const LETTERS: Letter[] = [
  {
    rotation: -95, stroke: '#FF6A1A', strokes: [A_FIGURE],
    intro: {
      phase: { amount: Math.PI, duration: 1.8, stagger: 0, delay: 0, easing: 'easeInOut' },
      rotation: { amount: -30, duration: 1.8, stagger: 0, delay: 0, easing: 'easeInOut' },
    },
  },
  {
    rotation: 0, stroke: '#1FD65C', gapBefore: -50, strokes: [M_FIGURE],
    intro: { phase: { amount: Math.PI, duration: 2, stagger: 0, delay: 0.1, easing: 'easeInOut' } },
  },
  {
    rotation: 0, stroke: '#8B5CFF', gapBefore: -25, strokes: [M_FIGURE],
    intro: { phase: { amount: Math.PI, duration: 2, stagger: 0, delay: 0.2, easing: 'easeInOut' } },
  },
  {
    rotation: -85, stroke: '#FF3DA6', gapBefore: -30, strokes: [A_FIGURE],
    intro: {
      phase: { amount: Math.PI, duration: 1.6, stagger: 0, delay: 0.3, easing: 'easeInOut' },
      rotation: { amount: 30, duration: 1.6, stagger: 0, delay: 0.3, easing: 'easeInOut' },
    },
  },
  {
    // R = two "I" strokes (stem + leg) + a tilted "A" lens (bowl), sized to the
    // family (≈1.25× the bare recipes). On hover the straight 1:1 stems drift
    // off δ=0 and bow into ellipses, echoing the family's morph.
    rotation: 0, stroke: '#2E7BFF', gapBefore: -105,
    strokes: [
      { a: 1, b: 1, delta: 0, rotation: 45, scaleX: 0.78, scaleY: 0.78, offsetX: -14 }, // I stem
      { a: 2, b: 1, delta: 1.42, rotation: -15, scaleX: 0.55, scaleY: 0.5, offsetX: 30, offsetY: -22 }, // tilted A bowl
      { a: 1, b: 1, delta: 0, rotation: 0, scaleX: 0.42, scaleY: 0.42, offsetX: 28, offsetY: 58 }, // I leg
    ],
    intro: {
      phase: { amount: Math.PI / 2, duration: 2.2, stagger: 0, delay: 0.4, easing: 'easeInOut' },
      rotation: { amount: -12, duration: 2.2, stagger: 0, delay: 0.4, easing: 'easeInOut' },
    },
  },
];

// Component-level defaults (per-letter intro/hover specs win over these).
const INTRO_DEFAULT: LetterAnim = {
  phase: { amount: 2 * Math.PI, duration: 2, stagger: 0.1, easing: 'easeInOut' },
};
const HOVER_DEFAULT: LetterAnim = {
  phase: { amount: 0.3 * Math.PI, duration: 4, stagger: 0.4, easing: 'easeOutQuart' },
};

const EASINGS = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - (1 - t) * (1 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
  easeOutQuart: (t: number) => 1 - (1 - t) ** 4,
};

// Eased progress (0..1) of an AnimSpec at `elapsed` seconds for letter `index`.
function progress(spec: AnimSpec, index: number, elapsed: number): number {
  const raw = (elapsed - ((spec.delay ?? 0) + index * spec.stagger)) / spec.duration;
  const clamped = raw <= 0 ? 0 : raw >= 1 ? 1 : raw;
  return EASINGS[spec.easing](clamped);
}

// The site's exact path generator: amplitude is 90% of the half-cell.
function buildPath(
  a: number, b: number, delta: number,
  res: number, w: number, h: number, sx: number, sy: number,
): string {
  const ax = ((0.9 * w) / 2) * sx;
  const ay = ((0.9 * h) / 2) * sy;
  const cx = w / 2;
  const cy = h / 2;
  const pts: string[] = [];
  for (let i = 0; i <= res; i++) {
    const t = (i / res) * Math.PI * 2;
    pts.push(
      `${i === 0 ? 'M' : 'L'}${(cx + ax * Math.sin(a * t + delta)).toFixed(2)},${(cy + ay * Math.sin(b * t)).toFixed(2)}`,
    );
  }
  return pts.join(' ');
}

type Props = {
  compact?: boolean;
  className?: string;
};

export default function LissajousAmmar({ compact = false, className = '' }: Props) {
  // Per-letter array of stroke <path> refs: pathRefs.current[letter][stroke].
  const pathRefs = useRef<(SVGPathElement | null)[][]>(LETTERS.map(() => []));
  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const rafRef = useRef(0);
  const frameRef = useRef<((now: number) => void) | null>(null);
  // Per-letter hover state (mirrors the site: progress 0..1, toggle timestamp,
  // hovered flag). Progress persists across reversals so they stay smooth.
  const hoverProg = useRef(LETTERS.map(() => ({ phase: 0, rotation: 0 })));
  const hoverAt = useRef<(number | null)[]>(LETTERS.map(() => null));
  const hovered = useRef<boolean[]>(LETTERS.map(() => false));
  const introStart = useRef<number | null>(null);

  // Cell layout: x accumulation with (negative) gaps. Every cell is CELL wide.
  const layout = useMemo(() => {
    let acc = 0;
    return LETTERS.map((cfg, i) => {
      const x = acc + (i === 0 ? 0 : (cfg.gapBefore ?? GAP));
      acc = x + CELL;
      return { x, width: CELL };
    });
  }, []);
  const svgW = layout.length ? layout[layout.length - 1].x + layout[layout.length - 1].width : 0;
  const svgH = CELL;

  const anim = (i: number) => ({
    introPhase: LETTERS[i].intro?.phase ?? INTRO_DEFAULT.phase,
    introRot: LETTERS[i].intro?.rotation ?? INTRO_DEFAULT.rotation,
    hoverPhase: LETTERS[i].hover?.phase ?? HOVER_DEFAULT.phase,
    hoverRot: LETTERS[i].hover?.rotation ?? HOVER_DEFAULT.rotation,
  });

  // Initial offsets: letters mount with intro animations rewound (−amount).
  const initial = useMemo(
    () =>
      LETTERS.map((cfg, i) => {
        const { introPhase, introRot } = anim(i);
        return { phase: introPhase ? -introPhase.amount : 0, rotation: introRot ? -introRot.amount : 0 };
      }),
    [],
  );

  const maxHoverDur = useMemo(
    () =>
      LETTERS.map((_, i) => {
        const { hoverPhase, hoverRot } = anim(i);
        return Math.max(
          hoverPhase ? (hoverPhase.delay ?? 0) + hoverPhase.duration : 0,
          hoverRot ? (hoverRot.delay ?? 0) + hoverRot.duration : 0,
        );
      }),
    [],
  );

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const frame = (now: number) => {
      if (introStart.current === null) introStart.current = now;
      const tAbs = now / 1000;
      const tIntro = (now - introStart.current) / 1000;
      let active = false;

      for (let i = 0; i < LETTERS.length; i++) {
        const cfg = LETTERS[i];
        const { introPhase, introRot, hoverPhase, hoverRot } = anim(i);
        let dPhase = 0;
        let dRot = 0;

        if (introPhase) {
          const p = reduce ? 1 : progress(introPhase, i, tIntro);
          dPhase = (p - 1) * introPhase.amount;
          if (p < 1) active = true;
        }
        if (introRot) {
          const p = reduce ? 1 : progress(introRot, i, tIntro);
          dRot = (p - 1) * introRot.amount;
          if (p < 1) active = true;
        }

        const at = hoverAt.current[i];
        const prog = hoverProg.current[i];
        if (hoverPhase || hoverRot) {
          if (at === null) {
            if (hoverPhase) dPhase += prog.phase * hoverPhase.amount;
            if (hoverRot) dRot += prog.rotation * hoverRot.amount;
          } else {
            const e = tAbs - at;
            const target = hovered.current[i] ? 1 : 0;
            if (hoverPhase) dPhase += (prog.phase + (target - prog.phase) * progress(hoverPhase, 0, e)) * hoverPhase.amount;
            if (hoverRot) dRot += (prog.rotation + (target - prog.rotation) * progress(hoverRot, 0, e)) * hoverRot.amount;
            active = true;
            if (e >= maxHoverDur[i]) {
              prog.phase = target;
              prog.rotation = target;
              hoverAt.current[i] = null;
            }
          }
        }

        const { width } = layout[i];
        cfg.strokes.forEach((f, j) => {
          pathRefs.current[i][j]?.setAttribute(
            'd',
            buildPath(f.a, f.b, f.delta + dPhase, RESOLUTION, width, width, f.scaleX, f.scaleY),
          );
        });
        const g = groupRefs.current[i];
        if (g) g.style.transform = `rotate(${cfg.rotation + dRot}deg)`;
      }

      // The site re-renders every frame forever; we park the loop once all
      // tweens settle (visually identical) and pointer events restart it.
      rafRef.current = active ? requestAnimationFrame(frame) : 0;
    };

    frameRef.current = frame;
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      frameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Port of the site's pointer handler: capture mid-transition progress, then
  // retime the tween toward the new target.
  const onHover = (entering: boolean, i: number) => {
    const tAbs = performance.now() / 1000;
    const at = hoverAt.current[i];
    if (at !== null) {
      const e = tAbs - at;
      const target = hovered.current[i] ? 1 : 0;
      const { hoverPhase, hoverRot } = anim(i);
      const prog = hoverProg.current[i];
      if (hoverPhase) prog.phase = prog.phase + (target - prog.phase) * progress(hoverPhase, 0, e);
      if (hoverRot) prog.rotation = prog.rotation + (target - prog.rotation) * progress(hoverRot, 0, e);
    }
    hovered.current[i] = entering;
    hoverAt.current[i] = tAbs;
    // resume the parked loop (the intro clock keeps its original start)
    if (!rafRef.current && frameRef.current) rafRef.current = requestAnimationFrame(frameRef.current);
  };

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
    >
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-auto w-full max-w-[1120px] ${compact ? 'stroke-[6px]' : 'stroke-[4px] md:stroke-[3px] lg:stroke-[2px]'}`}
        style={{ overflow: 'visible' }}
        role="img"
        aria-label="Ammar"
        focusable="false"
      >
        {LETTERS.map((cfg, i) => {
          const { x, width } = layout[i];
          const y = (svgH - width) / 2;
          return (
            <g key={i} transform={`translate(${x}, ${y})`}>
              <g
                ref={(el) => {
                  groupRefs.current[i] = el;
                }}
                style={{
                  transformOrigin: `${width / 2}px ${width / 2}px`,
                  transform: `rotate(${cfg.rotation + initial[i].rotation}deg)`,
                  willChange: 'transform',
                }}
                onPointerEnter={() => onHover(true, i)}
                onPointerLeave={() => onHover(false, i)}
              >
                <rect width={width} height={width} fill="transparent" pointerEvents="all" />
                {cfg.strokes.map((f, j) => (
                  <g
                    key={j}
                    transform={`translate(${f.offsetX ?? 0}, ${f.offsetY ?? 0}) rotate(${f.rotation}, ${width / 2}, ${width / 2})`}
                  >
                    <path
                      ref={(el) => {
                        pathRefs.current[i][j] = el;
                      }}
                      d={buildPath(f.a, f.b, f.delta + initial[i].phase, RESOLUTION, width, width, f.scaleX, f.scaleY)}
                      stroke={cfg.stroke}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </g>
                ))}
              </g>
            </g>
          );
        }).reverse()}
      </svg>
    </div>
  );
}
