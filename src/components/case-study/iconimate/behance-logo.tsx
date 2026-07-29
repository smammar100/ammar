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

// ROLL IN — the mark arrives instead of appearing. The B slides in from the
// left, the e ROLLS in from the right, and the bar drops onto it last and
// bounces.
//
// The mark is "Bē" and it decomposes for free: the three parts are already
// separate sub-paths of the Phosphor glyph with disjoint boxes, so this splits
// with no re-authoring and the rest state is the original reassembled.
//
//   BAR  x 160..240, y  72..88   the macron over the e
//   B    x  24..136, y  56..200  the B and its two counters
//   E    x 152..248, y 104..200  the e and its crossbar hole
//
// The roll is the point: the e's rotation is locked to its travel the way a
// real wheel's is. Rolling a disc of radius r a distance d turns it by exactly
// d/r radians, so travelling 72 units in turns it 72/48 = 1.5 rad = 85.9°, and
// the 6-unit overshoot turns it a further 6/48 = 7.2°. Those are quotients, not
// guesses — get them wrong and the wheel visibly skids.
//
// Bounds: rotating the e is free. Every point on it lies within 48.01 of
// (200,152), which is its own bounding circle, so spinning about that point
// sweeps no new ground. The entrances start outside the box on purpose and are
// clipped by the wrapper's overflow:hidden; the fly-in is over by 0.607s and
// from there nothing leaves the box, with the B's rebound (right edge 141)
// never reaching the e's (left edge 146). Rest is exactly the glyph box.
const BAR = "M160,80a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H168A8,8,0,0,1,160,80Z";
const B =
  "M136,158a42,42,0,0,1-42,42H32a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H90a38,38,0,0,1,25.65,66A42,42,0,0,1,136,158ZM40,116H90a22,22,0,0,0,0-44H40Zm80,42a26,26,0,0,0-26-26H40v52H94A26,26,0,0,0,120,158Z";
const E =
  "M248,152a8,8,0,0,1-8,8H169a32,32,0,0,0,56.59,11.2,8,8,0,0,1,12.8,9.61A48,48,0,1,1,248,152Zm-17-8a32,32,0,0,0-62,0Z";

// The e's own circle centre — a free pivot, and the bar's underside so it
// squashes against the landing rather than around its middle.
const E_CENTER = { transformBox: "view-box" as const, originX: 200 / 256, originY: 152 / 256 };
const BAR_FOOT = { transformBox: "view-box" as const, originX: 200 / 256, originY: 88 / 256 };

const rollB: Variants = {
  normal: { x: 0, transition: RETURN_TRANSITION },
  animate: {
    x: [-70, 5, 0],
    transition: { duration: 0.66, ease: "easeOut", times: [0, 0.74, 1] },
  },
};
const rollE: Variants = {
  normal: { x: 0, rotate: 0, transition: RETURN_TRANSITION },
  animate: {
    x: [72, -6, 0],
    rotate: [85.9, -7.2, 0], // d/r: 72/48 and 6/48 radians, in degrees
    transition: { duration: 0.78, ease: "easeOut", times: [0, 0.76, 1], delay: 0.12 },
  },
};
const rollBar: Variants = {
  normal: { y: 0, scaleY: 1, transition: RETURN_TRANSITION },
  animate: {
    y: [-46, 0, 0, 0],
    scaleY: [1, 0.72, 1.06, 1],
    transition: { duration: 0.5, ease: "easeIn", times: [0, 0.6, 0.82, 1], delay: 0.5 },
  },
};

export const BehanceLogoIcon = forwardRef<IconHandle, IconProps>(
  function BehanceLogoIcon({ size = 28, style, ...props }, ref) {
    const { controls, reduced, start, stop, bind } = useHover();
    useImperativeHandle(ref, () => ({ startAnimation: start, stopAnimation: stop }), [start, stop]);

    if (reduced) {
      return (
        <div {...props} style={{ display: "inline-flex", overflow: "hidden", ...style }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor">
            <path d={BAR} />
            <path d={B} />
            <path d={E} />
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
          <motion.path d={B} variants={rollB} />
          <motion.path d={E} variants={rollE} style={E_CENTER} />
          <motion.path d={BAR} variants={rollBar} style={BAR_FOOT} />
        </motion.svg>
      </div>
    );
  },
);
