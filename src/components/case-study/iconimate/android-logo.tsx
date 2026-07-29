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

// HOP — the little bot does a happy squash-and-bounce while its eyes wink shut and its
// two antennae waggle like feelers. The Phosphor android-logo is split so the antennae
// (their own rounded strokes) and the eyes move independently inside the hopping shell.
const ANDROID_BODY =
  "M240,160v24a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V161.13A113.38,113.38,0,0,1,51.4,78.72L63.82,68.5a111.43,111.43,0,0,1,128.55-.19L204.82,78.5c.75.71,1.5,1.43,2.24,2.17A111.25,111.25,0,0,1,240,160Zm-16,0a96,96,0,0,0-96-96h-.34C74.91,64.18,32,107.75,32,161.13V184H224Z";

// Antenna pivots sit where each feeler meets the dome (normalised to the 256 viewBox).
const ANT_L_PIVOT = { x: 63.82 / 256, y: 68.5 / 256 };
const ANT_R_PIVOT = { x: 192.37 / 256, y: 68.31 / 256 };

// Whole-bot squash-and-bounce, pivoting about the feet so the squash stays grounded.
const hop: Variants = {
  normal: { y: 0, scaleX: 1, scaleY: 1, transition: RETURN_TRANSITION },
  animate: {
    y: [0, 0, -12, 0, 0],
    scaleY: [1, 0.9, 1.05, 0.92, 1],
    scaleX: [1, 1.05, 0.97, 1.04, 1],
    transition: {
      duration: 1.4,
      times: [0, 0.15, 0.45, 0.72, 1],
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const blink: Variants = {
  normal: { scaleY: 1, transition: RETURN_TRANSITION },
  animate: {
    scaleY: [1, 1, 0.1, 0.1, 1, 1],
    transition: {
      duration: 2.6,
      times: [0, 0.38, 0.43, 0.46, 0.5, 1],
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const antennaL: Variants = {
  normal: { rotate: 0, transition: RETURN_TRANSITION },
  animate: {
    rotate: [0, -13, 7, 0],
    transition: { duration: 1.2, ease: "easeInOut", repeat: Infinity },
  },
};
const antennaR: Variants = {
  normal: { rotate: 0, transition: RETURN_TRANSITION },
  animate: {
    rotate: [0, 13, -7, 0],
    transition: { duration: 1.2, ease: "easeInOut", repeat: Infinity },
  },
};

export const AndroidLogoIcon = forwardRef<IconHandle, IconProps>(function AndroidLogoIcon(
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
        <motion.g
          variants={reduced ? undefined : hop}
          style={{ transformBox: "view-box", originX: 0.5, originY: 0.78 }}
        >
          <motion.line
            x1={63.82}
            y1={68.5}
            x2={32}
            y2={48}
            stroke="currentColor"
            strokeWidth={16}
            strokeLinecap="round"
            variants={reduced ? undefined : antennaL}
            style={{ transformBox: "view-box", originX: ANT_L_PIVOT.x, originY: ANT_L_PIVOT.y }}
          />
          <motion.line
            x1={192.37}
            y1={68.31}
            x2={224}
            y2={48}
            stroke="currentColor"
            strokeWidth={16}
            strokeLinecap="round"
            variants={reduced ? undefined : antennaR}
            style={{ transformBox: "view-box", originX: ANT_R_PIVOT.x, originY: ANT_R_PIVOT.y }}
          />
          <path d={ANDROID_BODY} />
          <motion.circle
            cx={164}
            cy={148}
            r={12}
            variants={reduced ? undefined : blink}
            style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
          />
          <motion.circle
            cx={92}
            cy={148}
            r={12}
            variants={reduced ? undefined : blink}
            style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
          />
        </motion.g>
      </motion.svg>
    </div>
  );
});
