"use client";

/**
 * Ambulance — Iconimate
 *
 * Installed from https://iconimate.app/r/ambulance.json
 * Version 94c548a49ed7 · icon last changed 2026-08-12
 *
 * This file is a COPY and does not update itself. To pull the current version:
 *   npx shadcn@latest add https://iconimate.app/r/ambulance.json
 * To check whether yours is behind, compare the version above against
 * https://iconimate.app/r/registry.json.
 *
 * Animation code: copyright (c) 2026 Muhammad Ammar (smammar100), MIT.
 * Glyph geometry: Phosphor Icons, copyright (c) 2023 Phosphor Icons, MIT.
 *                 https://phosphoricons.com
 */

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
  /**
   * True when the icon should render its static fallback instead of animating.
   *
   * Deliberately **not** the OS `prefers-reduced-motion` value. Taking the static
   * path leaves a reduced-motion visitor unable to preview an icon at all, which
   * defeats a gallery whose entire content is motion. The preference is honoured
   * on `ambient` instead: an explicit hover/tap still performs the gesture once,
   * but nothing repeats unattended. Kept as a field so the per-icon static
   * fallbacks stay wired and a product decision can switch them on in one place.
   */
  reduced: boolean;
  /**
   * True when motion may repeat on its own — the replay loop below, and any
   * icon transition carrying `repeat: Infinity`.
   *
   * False when the user prefers reduced motion. Icons with ambient/looping
   * tracks must gate `repeat` on this; one-shot gestures ignore it, because a
   * gesture the user asked for by hovering is not unattended motion.
   */
  ambient: boolean;
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
  // Icons still animate for everyone — see `reduced` on HoverController for why
  // the static fallback is not wired to the OS preference.
  const reduced = false;
  // `useReducedMotion()` reads the media query directly and does NOT consult
  // <MotionConfig>, so app/providers.tsx's `reducedMotion="never"` cannot mask
  // this. That is intentional: this is the one place the real preference is read.
  const ambient = !(useReducedMotion() ?? false);

  // True while the pointer (or focus) is on the icon — the loop below keys off
  // it so the "animate" variant replays end-to-end until the user leaves.
  const looping = useRef(false);
  // The pending replay timer, tracked so stop()/unmount can clear it outright
  // rather than relying on a late fire noticing `looping` went false.
  const replayTimer = useRef<number | undefined>(undefined);

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
        // Reduced motion: the hover gets its one full pass — an explicit
        // preview the visitor asked for — and then stops. Nothing replays
        // unattended.
        if (!ambient) {
          looping.current = false;
          return;
        }
        // If the cycle resolved instantly (no animatable elements mounted),
        // pause before retrying instead of spinning a tight loop. Otherwise
        // breathe for 30% of the cycle before replaying, so the loop reads
        // as a rhythm rather than a frantic back-to-back repeat.
        const elapsed = performance.now() - t0;
        replayTimer.current = window.setTimeout(run, elapsed < 100 ? 300 : elapsed * 0.3);
      });
    };
    run();
  }, [controls, ambient]);

  const stop = useCallback(() => {
    looping.current = false;
    window.clearTimeout(replayTimer.current);
    void controls.start("normal");
  }, [controls]);

  // Never leave a loop or a pending replay running after unmount.
  useEffect(
    () => () => {
      looping.current = false;
      window.clearTimeout(replayTimer.current);
    },
    [],
  );

  return {
    controls,
    reduced,
    ambient,
    start,
    stop,
    bind: { onMouseEnter: start, onMouseLeave: stop, onFocus: start, onBlur: stop },
  };
}

// DRIVE — the van bobs on its suspension while three speed streaks tear off the back
// and the red cross blinks like a flasher, so the whole thing reads as racing past.
// Filled Phosphor ambulance glyph, split into body + cross so the cross can blink.
//
// DELIBERATE REDRAW — this icon does NOT rest on the untouched Phosphor glyph, and that
// is a design decision rather than a tolerance. The source van spans x16..256: it touches
// the right edge and leaves no lane for the speed streaks, which are the thing that makes
// the icon read as racing rather than idling. So the vehicle is scaled to 0.86 about the
// artboard centre and the streaks occupy the margin that frees up.
//
// The consequence is real and worth knowing before "fixing" it: a consumer who swaps the
// static Phosphor ambulance for this one gets a glyph ~14% smaller. The rest state is
// still exact — it is exactly the *intended* picture, deterministic and identical every
// frame — it is simply a different picture from the original. Restoring full size means
// dropping the streaks; the two cannot both fit. See AGENTS.md, rest-state fidelity rule.
const AMBULANCE_BODY =
  "M256,120v64a16,16,0,0,1-16,16H223a32,32,0,0,1-62,0H111a32,32,0,0,1-62,0H32a16,16,0,0,1-16-16V72A16,16,0,0,1,32,56H184a8,8,0,0,1,8,8v8h34.58a15.93,15.93,0,0,1,14.86,10.06l14,35A7.92,7.92,0,0,1,256,120ZM192,88v24h44.18l-9.6-24ZM32,184H49a32,32,0,0,1,62,0h50a32.11,32.11,0,0,1,15-19.69V72H32Zm64,8a16,16,0,1,0-16,16A16,16,0,0,0,96,192Zm112,0a16,16,0,1,0-16,16A16,16,0,0,0,208,192Zm32-8V128H192v32a32.06,32.06,0,0,1,31,24Z";
const AMBULANCE_CROSS =
  "M80,120a8,8,0,0,1,8-8h16V96a8,8,0,0,1,16,0v16h16a8,8,0,0,1,0,16H120v16a8,8,0,0,1-16,0V128H88A8,8,0,0,1,80,120Z";

// Bob + nose-to-tail rock, applied to the whole vehicle group.
// Every track here is ambient (the drive bob, the flasher, the speed streaks), so each
// `repeat` is gated on `ambient` from useHover(), threaded in as motion's `custom`. Under
// reduced motion the van bobs once, the cross blinks once and one streak passes, then rest.
const drive: Variants = {
  normal: { y: 0, rotate: 0, transition: RETURN_TRANSITION },
  animate: (ambient: boolean) => ({
    y: [0, -2.5, 0, -1.5, 0],
    rotate: [0, -1.2, 0, 1, 0],
    transition: { duration: 1, ease: "easeInOut", repeat: ambient ? Infinity : 0 },
  }),
};

// The cross flashes on and off like an emergency light.
const blink: Variants = {
  normal: { opacity: 1, transition: RETURN_TRANSITION },
  animate: (ambient: boolean) => ({
    opacity: [1, 1, 0.12, 0.12, 1],
    transition: { duration: 0.8, ease: "easeInOut", repeat: ambient ? Infinity : 0 },
  }),
};

// Each speed streak shoots leftward off the back of the van and fades, staggered so
// they read as a continuous stream of motion lines.
const streak = (delay: number): Variants => ({
  normal: { opacity: 0, x: 0, transition: RETURN_TRANSITION },
  animate: (ambient: boolean) => ({
    x: [10, -16],
    opacity: [0, 0.9, 0],
    transition: {
      duration: 0.55,
      ease: "easeIn",
      repeat: ambient ? Infinity : 0,
      repeatDelay: 0.15,
      delay,
    } satisfies Transition,
  }),
});

// Three streaks sit in the lane freed by the 0.86 vehicle scale (see the redraw note above).
const STREAKS = [
  { y: 98, x1: 6, x2: 30, delay: 0 },
  { y: 128, x1: 2, x2: 32, delay: 0.12 },
  { y: 158, x1: 6, x2: 30, delay: 0.24 },
];

export const AmbulanceIcon = forwardRef<IconHandle, IconProps>(function AmbulanceIcon(
  { size = 28, style, ...props },
  ref,
) {
  const { controls, reduced, ambient, start, stop, bind } = useHover();
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
        {!reduced &&
          STREAKS.map((s, i) => (
            <motion.line
              key={i}
              x1={s.x1}
              y1={s.y}
              x2={s.x2}
              y2={s.y}
              stroke="currentColor"
              strokeWidth={10}
              strokeLinecap="round"
              variants={streak(s.delay)}
              custom={ambient}
              style={{ transformBox: "view-box" }}
            />
          ))}

        {/* Vehicle scaled to 0.86 about the artboard centre — the declared redraw, not a tweak. */}
        <g transform="translate(128 128) scale(0.86) translate(-128 -128)">
          <motion.g
            variants={reduced ? undefined : drive}
            custom={ambient}
            style={{ transformBox: "view-box", originX: 0.5, originY: 0.5 }}
          >
            <path d={AMBULANCE_BODY} />
            <motion.path variants={reduced ? undefined : blink} custom={ambient} d={AMBULANCE_CROSS} />
          </motion.g>
        </g>
      </motion.svg>
    </div>
  );
});
