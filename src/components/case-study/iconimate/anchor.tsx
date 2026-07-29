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

// SWAY — the anchor hangs from its top ring and rocks side to side, the way it would
// dangle from a rope: a slow, even pendulum that pivots about the shackle and eases
// to rest on hover-out.
// Filled Phosphor anchor glyph (currentColor); pivots about the ring centre (128, 56).
const ANCHOR =
  "M216,136a8,8,0,0,0-8,8c0,24.69-13.77,29.64-38.1,36.28-11.36,3.1-24.12,6.6-33.9,14.34V128h32a8,8,0,0,0,0-16H136V87a32,32,0,1,0-16,0v25H88a8,8,0,0,0,0,16h32v66.62c-9.78-7.74-22.54-11.24-33.9-14.34C61.77,173.64,48,168.69,48,144a8,8,0,0,0-16,0c0,38.11,27.67,45.66,49.9,51.72C106.23,202.36,120,207.31,120,232a8,8,0,0,0,16,0c0-24.69,13.77-29.64,38.1-36.28C196.33,189.66,224,182.11,224,144A8,8,0,0,0,216,136ZM112,56a16,16,0,1,1,16,16A16,16,0,0,1,112,56Z";

const ANCHOR_PIVOT = { x: 0.5, y: 0.219 };

const sway: Variants = {
  normal: { rotate: 0, transition: RETURN_TRANSITION },
  animate: {
    rotate: [0, 11, 0, -11, 0],
    transition: { duration: 2.4, ease: "easeInOut", repeat: Infinity },
  },
};

export const AnchorIcon = forwardRef<IconHandle, IconProps>(function AnchorIcon(
  { size = 28, style, ...props },
  ref,
) {
  const { controls, reduced, start, stop, bind } = useHover();
  useImperativeHandle(ref, () => ({ startAnimation: start, stopAnimation: stop }), [start, stop]);

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
        <motion.path
          variants={reduced ? undefined : sway}
          style={{ transformBox: "view-box", originX: ANCHOR_PIVOT.x, originY: ANCHOR_PIVOT.y }}
          d={ANCHOR}
        />
      </motion.svg>
    </div>
  );
});
