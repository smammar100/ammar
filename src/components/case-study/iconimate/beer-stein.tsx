"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import type { DOMAttributes, HTMLAttributes } from "react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import type { Transition, Variants } from "motion/react";

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

/** Gentle standard glide — used by every "normal" variant for hover-out. */
export const RETURN: Bezier = [0.4, 0, 0.2, 1];

/** Duration scale in seconds, calibrated for legibility at the 24px ship size. */
export const DUR = { instant: 0.12, fast: 0.2, base: 0.32, slow: 0.5 } as const;

/**
 * The canonical hover-out transition. Spread into every "normal" variant so that
 * interrupting a hover glides the icon home instead of snapping.
 */
export const RETURN_TRANSITION: Transition = { duration: DUR.base, ease: RETURN };

/* ─────────────────────────────────────────────────────────────────────────────
 * Principle helpers — shared vocabulary for Disney's 12 principles. See MOTION.md.
 * Additive only; pure data/factories (server-safe). Reach for these instead of
 * inlining magic numbers so the whole set speaks one language.
 * ───────────────────────────────────────────────────────────────────────────── */

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

// CHEERS & FIZZ — the whole toast in one beat, with the beer alive inside it.
// The stein lifts along the empty up-left diagonal, clinks TWICE at the top
// (the double-tap is what reads as "cheers!" rather than a wave), drops back to
// the bar and settles with a decaying rock.
//
// Underneath, carbonation runs the entire time: bubbles born small at the
// bottom of the glass rise up the three free columns of the interior window
// (x 56..88, 104..136, 152..184 — the gaps either side of the two ridge bars)
// and fade out below the rim. They live INSIDE the moving group, so they stay
// glued to the glass through the lift and the taps instead of sliding across
// it. At rest the group is identity and every bubble is opacity 0, so the icon
// is pixel-identical to the Phosphor glyph.
//
// Bounds: the glyph nearly fills the box — the far bottom-left corner (40,224)
// is 130 units from centre and the lid apex (104,16) is 114, so rotation about
// the centre is safe to about ±12°. The lift moves along the EMPTY up-left
// diagonal, never toward the handle in the bottom-right. Worst case over the
// whole timeline is x[27.8, 241.6], y[10.0, 228.1]. The bubbles are bounded by
// the glass, not the box: the tallest tops out at y≈92, still inside the
// interior window's ceiling of 80.
const STEIN =
  "M104,104v80a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm40-8a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V104A8,8,0,0,0,144,96Zm96,16v64a24,24,0,0,1-24,24H200v8a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V72c0-30.88,28.71-56,64-56,16.77,0,32.91,5.8,44.82,16H160a40,40,0,0,1,40,40V88h16A24,24,0,0,1,240,112ZM57,64H182.62A24,24,0,0,0,160,48H145.74a8,8,0,0,1-5.53-2.22C131.06,37,117.87,32,104,32,80.82,32,61.43,45.76,57,64ZM184,208V80H56V208H184Zm40-96a8,8,0,0,0-8-8H200v80h16a8,8,0,0,0,8-8Z";

const CENTER = { transformBox: "view-box" as const, originX: 0.5, originY: 0.5 };

// Raise → tap, tap → land → settle. One layer does all of it.
const cheers: Variants = {
  normal: { x: 0, y: 0, rotate: 0, transition: RETURN_TRANSITION },
  animate: {
    x: [0, -6, -6, -6, -6, 0, 0, 0, 0],
    y: [0, -6, -6, -6, -6, 0, 0, 0, 0],
    rotate: [0, 0, -7, -2, -7, 0, 4.5, -2, 0],
    transition: {
      duration: 1.7,
      ease: "easeInOut",
      times: [0, 0.13, 0.25, 0.35, 0.47, 0.62, 0.76, 0.89, 1],
    },
  },
};

// One rising bubble: `rise` is how far up the glass it gets before it fades.
const fizz = (rise: number, delay: number, duration: number): Variants => ({
  normal: { opacity: 0, y: 0, scale: 0.35, transition: { duration: 0.2 } },
  animate: {
    opacity: [0, 0.9, 0.75, 0],
    y: [0, -rise * 0.35, -rise * 0.72, -rise],
    scale: [0.35, 0.8, 1, 0.95],
    transition: {
      duration,
      ease: "easeOut",
      times: [0, 0.3, 0.65, 1],
      repeat: Infinity,
      repeatDelay: 0.15,
      delay,
    },
  },
});
const fizzA = fizz(96, 0, 1.25);
const fizzB = fizz(88, 0.42, 1.4);
const fizzC = fizz(80, 0.78, 1.15);
const fizzD = fizz(92, 1.05, 1.35);

export const BeerSteinIcon = forwardRef<IconHandle, IconProps>(
  function BeerSteinIcon({ size = 28, style, ...props }, ref) {
    const { controls, reduced, start, stop, bind } = useHover();
    useImperativeHandle(ref, () => ({ startAnimation: start, stopAnimation: stop }), [start, stop]);

    if (reduced) {
      return (
        <div {...props} style={{ display: "inline-flex", overflow: "hidden", ...style }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor">
            <path d={STEIN} />
          </svg>
        </div>
      );
    }

    return (
      <div {...props} {...bind} style={{ display: "inline-flex", overflow: "hidden", ...style }}>
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
          <motion.g variants={cheers} style={CENTER}>
            <path d={STEIN} />
            {/* Bubbles: left column (56..88), the gap between the ridge bars
                (104..136), then the right column (152..184). */}
            <motion.g variants={fizzA}>
              <circle cx={72} cy={196} r={8} />
            </motion.g>
            <motion.g variants={fizzB}>
              <circle cx={120} cy={198} r={10} />
            </motion.g>
            <motion.g variants={fizzC}>
              <circle cx={168} cy={196} r={7} />
            </motion.g>
            <motion.g variants={fizzD}>
              <circle cx={119} cy={200} r={6} />
            </motion.g>
          </motion.g>
        </motion.svg>
      </div>
    );
  },
);
