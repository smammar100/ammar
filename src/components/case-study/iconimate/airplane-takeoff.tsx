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

// DEPARTURE — wheels up and gone: from rest the plane accelerates up its heading
// and climbs clean out of frame, shrinking and fading into the distance. The
// mirror of the landing arrival — here the plane leaves the bounding box. The
// wrapper uses overflow:visible so the climb-out is seen beyond the icon box.
// Filled Phosphor airplane-takeoff glyph (currentColor).
const PLANE =
  "M247.86,93.15a8,8,0,0,1-3.76,5.39l-147.41,88a40.18,40.18,0,0,1-20.26,5.52,39.78,39.78,0,0,1-27.28-10.87l-.12-.12L13,145.8a16,16,0,0,1,4.49-26.21l3-1.47a8,8,0,0,1,6.08-.4l28.26,9.54L75,115.06,53.17,93.87A16,16,0,0,1,57.7,67.4l.32-.13,7.15-2.71a8,8,0,0,1,5.59,0L124.7,84.38,176.27,53.6a39.82,39.82,0,0,1,51.28,9.12l.12.15,18.64,23.89A8,8,0,0,1,247.86,93.15ZM228.12,89.45l-13-16.67a23.88,23.88,0,0,0-30.68-5.42l-54.8,32.72a8.06,8.06,0,0,1-6.87.64L68,80.58l-4,1.53.21.2L93.57,110.8a8,8,0,0,1-1.43,12.58L59.93,142.87a8,8,0,0,1-6.7.73l-28.67-9.67-.19.1-.37.17a.71.71,0,0,1,.13.12l36,35.26a23.85,23.85,0,0,0,28.42,3.18Z";
const RUNWAY = "M176,216a8,8,0,0,1-8,8H24a8,8,0,0,1,0-16H168A8,8,0,0,1,176,216Z";

const departure: Variants = {
  normal: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, transition: RETURN_TRANSITION },
  animate: {
    // Anticipation: a brief crouch (rock back & nose-down) before the plane lunges up
    // its heading and climbs clean out of frame, shrinking and fading into the distance.
    x: [0, -10, 230],
    y: [0, 4, -160],
    rotate: [0, 3, -5],
    scale: [1, 0.97, 0.78],
    opacity: [1, 1, 0],
    transition: {
      duration: 1.22,
      times: [0, 0.12, 1],
      ease: [0.5, 0, 0.85, 0.4], // accelerate away
      opacity: { duration: 1.22, times: [0, 0.55, 1], ease: "easeIn" },
    },
  },
};

export const AirplaneTakeoffIcon = forwardRef<IconHandle, IconProps>(function AirplaneTakeoffIcon(
  { size = 28, style, ...props },
  ref,
) {
  const { controls, reduced, start, stop, bind } = useHover();
  useImperativeHandle(ref, () => ({ startAnimation: start, stopAnimation: stop }), [start, stop]);

  return (
    <div {...props} {...bind} style={{ display: "inline-flex", overflow: "visible", ...style }}>
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
        <path d={RUNWAY} />
        <motion.path
          variants={reduced ? undefined : departure}
          style={{ transformBox: "view-box", originX: 0.5, originY: 0.47 }}
          d={PLANE}
        />
      </motion.svg>
    </div>
  );
});
