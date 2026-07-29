"use client";

import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import type { DOMAttributes, HTMLAttributes } from "react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";

/** Imperative handle every icon exposes — lets consumers trigger motion on touch, where `:hover` never fires. */
export interface IconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface IconProps extends HTMLAttributes<HTMLDivElement> {
  /** Rendered width & height in px. Defaults to 28; the set is calibrated to read at 24 (ship size). */
  size?: number;
}

/** A cubic-bezier easing curve. */
export type Bezier = [number, number, number, number];

/** Decelerate-to-rest with an expo-out tail — things landing / arriving. */
export const ARRIVE: Bezier = [0.16, 1, 0.3, 1];

/** The controls object returned by `useAnimation()` — derived to stay resilient to motion's type renames. */
type AnimationControls = ReturnType<typeof useAnimation>;

export interface HoverController {
  /** The single controls instance every animated element in the icon is gated through. */
  controls: AnimationControls;
  /** True when the user prefers reduced motion — icons swap to a static/opacity fallback. */
  reduced: boolean;
  /** Play the "animate" variant. */
  start: () => void;
  /** Glide back to the "normal" variant. */
  stop: () => void;
  /** Spread onto the icon's wrapper. Keyboard focus triggers it too, not just pointer. */
  bind: Pick<DOMAttributes<Element>, "onMouseEnter" | "onMouseLeave" | "onFocus" | "onBlur">;
}

/**
 * The common-case hover controller. Owns one `useAnimation` instance and the
 * enter / leave / focus / blur wiring, so motion across every element of an icon
 * is gated through a single source of truth.
 *
 * Per-icon files layer `forwardRef` + `useImperativeHandle` on top of this to
 * expose `startAnimation` / `stopAnimation`, since `:hover` never fires on touch.
 */
export function useHover(): HoverController {
  const controls = useAnimation();
  // Icons animate for everyone: we intentionally do not gate on the OS
  // reduced-motion preference (the motions are small, hover/focus-triggered).
  const reduced = false;

  // True while the pointer (or focus) is on the icon — the loop below keys off
  // it so the "animate" variant replays end-to-end until the user leaves.
  const looping = useRef(false);

  const start = useCallback(() => {
    if (looping.current) return; // already looping — don't stack replays
    looping.current = true;
    const run = () => {
      if (!looping.current) return;
      const t0 = performance.now();
      void controls.start("animate").then(() => {
        if (!looping.current) return;
        // Snap back to "normal" (keyframes end where they start, so this is
        // invisible) so the next start("animate") actually replays — starting
        // a variant the elements are already at resolves immediately.
        controls.set("normal");
        // If the cycle resolved instantly (no animatable elements mounted),
        // pause before retrying instead of spinning a tight loop. Otherwise
        // breathe for 30% of the cycle before replaying, so the loop reads
        // as a rhythm rather than a frantic back-to-back repeat.
        const elapsed = performance.now() - t0;
        window.setTimeout(run, elapsed < 100 ? 300 : elapsed * 0.3);
      });
    };
    run();
  }, [controls]);

  const stop = useCallback(() => {
    looping.current = false;
    void controls.start("normal");
  }, [controls]);

  // Never leave a loop running after unmount.
  useEffect(
    () => () => {
      looping.current = false;
    },
    [],
  );

  return {
    controls,
    reduced,
    start,
    stop,
    bind: { onMouseEnter: start, onMouseLeave: stop, onFocus: start, onBlur: stop },
  };
}

// GLOW — at rest the eyes are hollow outlines; on hover the almonds flood with a
// random colour and a soft halo breathes behind them. The eyes are painted directly
// (not currentColor) so they read the same on light and dark; only the head/mouth
// track the theme. The halo blur is in user units so it scales with the icon.
const HEAD =
  "M128,16a96.11,96.11,0,0,0-96,96c0,24,12.56,55.06,33.61,83,21.18,28.15,44.5,45,62.39,45s41.21-16.81,62.39-45c21.05-28,33.61-59,33.61-83A96.11,96.11,0,0,0,128,16ZM177.61,185.42C160.24,208.49,140.31,224,128,224s-32.24-15.51-49.61-38.58C59.65,160.5,48,132.37,48,112a80,80,0,0,1,160,0C208,132.37,196.35,160.5,177.61,185.42Z";
const EYES =
  "M120,136A40,40,0,0,0,80,96a16,16,0,0,0-16,16,40,40,0,0,0,40,40A16,16,0,0,0,120,136ZM80,112a24,24,0,0,1,24,24h0A24,24,0,0,1,80,112Zm96-16a40,40,0,0,0-40,40,16,16,0,0,0,16,16,40,40,0,0,0,40-40A16,16,0,0,0,176,96Zm-24,40a24,24,0,0,1,24-24A24,24,0,0,1,152,136Z";
const MOUTH = "M152,184a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,184Z";
// Solid almonds (no cut-out) — the lit-up eyes, overlaid on the hollow outlines.
const LEFT_EYE = "M120,136A40,40,0,0,0,80,96a16,16,0,0,0-16,16,40,40,0,0,0,40,40A16,16,0,0,0,120,136Z";
const RIGHT_EYE = "M176,96a40,40,0,0,0-40,40,16,16,0,0,0,16,16,40,40,0,0,0,40-40A16,16,0,0,0,176,96Z";

const EYE_LINE = { x: 0.5, y: 0.484 };
// Resting glow + the palette the eyes flash through on each hover. The eyes start
// green (matching the static "Glow Eyes" look), then light up a fresh random hue
// every time the icon is hovered or focused.
const GLOW = "#22C55E";
const GLOW_COLORS = [
  "#22C55E", // green
  "#006BFF", // blue
  "#FC0035", // red
  "#FFA600", // amber
  "#00E3C4", // teal
  "#A000F8", // purple
  "#F22782", // pink
];

// Sharp lit eyes: pop in on hover, fade out on leave.
const fill: Variants = {
  normal: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.28, ease: ARRIVE } },
};
// Halo behind the eyes: breathes while hovered.
const halo: Variants = {
  normal: { opacity: 0, transition: { duration: 0.2 } },
  animate: {
    opacity: [0.4, 0.85, 0.4],
    transition: { duration: 1.5, ease: "easeInOut", repeat: Infinity },
  },
};
// Reduced motion: still fill + light the eyes, just hold steady (no pop, no breathing).
const fillReduced: Variants = { normal: { opacity: 0 }, animate: { opacity: 1 } };
const haloReduced: Variants = { normal: { opacity: 0 }, animate: { opacity: 0.7 } };

export const AlienIcon = forwardRef<IconHandle, IconProps>(function AlienIcon(
  { size = 28, style, ...props },
  ref,
) {
  const { controls, reduced, start, stop, bind } = useHover();

  // Pick a fresh glow colour on each hover/focus — never the same hue twice in a row.
  // Seeded with the resting green so the first paint (SSR) is deterministic.
  const [glow, setGlow] = useState(GLOW);
  const glowRef = useRef(GLOW);
  const flashNewColor = useCallback(() => {
    let next = glowRef.current;
    while (next === glowRef.current) {
      next = GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)];
    }
    glowRef.current = next;
    setGlow(next);
  }, []);

  // Hover/focus light the eyes a new colour; the imperative handle (touch) does too.
  const handleStart = useCallback(() => {
    flashNewColor();
    start();
  }, [flashNewColor, start]);

  useImperativeHandle(ref, () => ({ startAnimation: handleStart, stopAnimation: stop }), [handleStart, stop]);
  // Unique per instance (stable across SSR and client) so multiple icons on a page
  // don't share one filter. React's useId() is already a valid id for url(#…).
  const blurId = `alien-glow-${useId()}`;

  const eyeOrigin = { transformBox: "view-box" as const, originX: EYE_LINE.x, originY: EYE_LINE.y };

  return (
    <div
      {...props}
      {...bind}
      onMouseEnter={handleStart}
      onFocus={handleStart}
      style={{ display: "inline-flex", ...style }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 256 256"
        fill="currentColor"
        initial="normal"
        animate={controls}
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id={blurId} x="-75%" y="-75%" width="250%" height="250%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <path d={HEAD} />
        <path d={EYES} />
        <path d={MOUTH} />
        <motion.g
          variants={reduced ? haloReduced : halo}
          fill={glow}
          filter={`url(#${blurId})`}
          style={eyeOrigin}
        >
          <path d={LEFT_EYE} />
          <path d={RIGHT_EYE} />
        </motion.g>
        <motion.g variants={reduced ? fillReduced : fill} fill={glow} style={eyeOrigin}>
          <path d={LEFT_EYE} />
          <path d={RIGHT_EYE} />
        </motion.g>
      </motion.svg>
    </div>
  );
});
