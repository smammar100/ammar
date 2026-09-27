"use client";

/**
 * Baby Carriage — Iconimate
 *
 * Installed from https://iconimate.app/r/baby-carriage.json
 * Version de870fac7429 · icon last changed 2026-08-12
 *
 * This file is a COPY and does not update itself. To pull the current version:
 *   npx shadcn@latest add https://iconimate.app/r/baby-carriage.json
 * To check whether yours is behind, compare the version above against
 * https://iconimate.app/r/registry.json.
 *
 * Animation code: copyright (c) 2026 Muhammad Ammar (smammar100), MIT.
 * Glyph geometry: Phosphor Icons, copyright (c) 2023 Phosphor Icons, MIT.
 *                 https://phosphoricons.com
 */

import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useRef } from "react";
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

// SUSPENSION BOUNCE — the pram bounces on its suspension: the body (handle + basket +
// canopy) drops to a limit and back while the canopy pivots forward as secondary momentum;
// the two tyres stay planted. 0.85s ease-in-out, looping while hovered.
//
// The Phosphor "baby-carriage" glyph is one compound path, so we draw it three times and
// split it with SVG clip paths (which mask rendered pixels, never the path data — so all the
// line-art holds). The hood sits above the basket rim (a solid band at y[104,118]); the body
// keeps drawing the rim + hood base band behind the pivoting canopy, so the seam never opens
// a gap, and the canopy is clipped at the rim top so it can't protrude below the basket. The
// tyres (rings at y[208,238]) are wrapped whole in their own static layer.
const BABY_CARRIAGE =
  "M160,32h-8a16,16,0,0,0-16,16v56H55.2A40.07,40.07,0,0,0,16,72a8,8,0,0,0,0,16,24,24,0,0,1,24,24,80.09,80.09,0,0,0,80,80h40a80,80,0,0,0,0-160Zm63.48,72H166.81l41.86-33.49A63.73,63.73,0,0,1,223.48,104ZM160,48a63.59,63.59,0,0,1,36.69,11.61L152,95.35V48Zm0,128H120a64.09,64.09,0,0,1-63.5-56h167A64.09,64.09,0,0,1,160,176Zm-56,48a16,16,0,1,1-16-16A16,16,0,0,1,104,224Zm104,0a16,16,0,1,1-16-16A16,16,0,0,1,208,224Z";

const CANOPY_CLIP = { x: 132, y: 12, w: 120, h: 92 }; // hood, clipped at rim top   y[12,104]
const BODY_HOLE = { x: 132, y: 12, w: 120, h: 86 }; //  punched above the base band y[12,98]
const WHEEL_L = { x: 66, y: 204, w: 42, h: 40 }; // left tyre  x[66,108] y[204,244]
const WHEEL_R = { x: 172, y: 204, w: 42, h: 40 }; // right tyre x[172,214] y[204,244]
const CANOPY_HINGE = { transformBox: "view-box" as const, transformOrigin: "152px 104px" };

// The suspension bounce is ambient, so `repeat` is gated on `ambient` from useHover() and
// threaded in as motion's `custom`. Body and canopy must stay on ONE shared transition —
// the canopy's forward pivot only reads as secondary momentum if it is locked to the same
// clock as the drop — so the loop stays a single factory both variants call.
const LOOP = (ambient: boolean): Transition => ({
  duration: 0.85,
  times: [0, 0.5, 1],
  ease: "easeInOut",
  repeat: ambient ? Infinity : 0,
});

// Body drops to the suspension limit and back.
const bodyBounce: Variants = {
  normal: { y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  animate: (ambient: boolean) => ({ y: [0, 8, 0], transition: LOOP(ambient) }),
};
// Canopy pivots forward as the body drops (secondary momentum).
const canopyPivot: Variants = {
  normal: { rotate: 0, transition: { duration: 0.3, ease: "easeOut" } },
  animate: (ambient: boolean) => ({ rotate: [0, 6, 0], transition: LOOP(ambient) }),
};

const rect = (b: { x: number; y: number; w: number; h: number }) =>
  `M${b.x},${b.y}H${b.x + b.w}V${b.y + b.h}H${b.x}Z`;

export const BabyCarriageIcon = forwardRef<IconHandle, IconProps>(function BabyCarriageIcon(
  { size = 28, style, ...props },
  ref,
) {
  const { controls, reduced, ambient, start, stop, bind } = useHover();
  useImperativeHandle(ref, () => ({ startAnimation: start, stopAnimation: stop }), [start, stop]);
  const uid = useId();
  const bodyClip = `bcg-body-${uid}`;
  const canopyClip = `bcg-canopy-${uid}`;
  const wheelClip = `bcg-wheel-${uid}`;

  if (reduced) {
    return (
      <div {...props} {...bind} style={{ display: "inline-flex", overflow: "hidden", ...style }}>
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor">
          <path d={BABY_CARRIAGE} />
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
      >
        <defs>
          {/* Body: everything except the hood (above the rim) and the two tyres. The basket
              rim stays in the body so it backs the pivoting canopy. */}
          <clipPath id={bodyClip} clipPathUnits="userSpaceOnUse">
            <path clipRule="evenodd" d={`M0,0H256V256H0Z ${rect(BODY_HOLE)} ${rect(WHEEL_L)} ${rect(WHEEL_R)}`} />
          </clipPath>
          <clipPath id={canopyClip} clipPathUnits="userSpaceOnUse">
            <path d={rect(CANOPY_CLIP)} />
          </clipPath>
          <clipPath id={wheelClip} clipPathUnits="userSpaceOnUse">
            <path d={`${rect(WHEEL_L)} ${rect(WHEEL_R)}`} />
          </clipPath>
        </defs>

        {/* Body (handle + basket + canopy) bounces down; canopy adds its pivot. */}
        <motion.g variants={reduced ? undefined : bodyBounce} custom={ambient}>
          <g clipPath={`url(#${bodyClip})`}>
            <path d={BABY_CARRIAGE} />
          </g>
          <motion.g variants={reduced ? undefined : canopyPivot} custom={ambient} style={CANOPY_HINGE}>
            <g clipPath={`url(#${canopyClip})`}>
              <path d={BABY_CARRIAGE} />
            </g>
          </motion.g>
        </motion.g>

        {/* Wheels — static, drawn on top so the body settles behind them. */}
        <g clipPath={`url(#${wheelClip})`}>
          <path d={BABY_CARRIAGE} />
        </g>
      </motion.svg>
    </div>
  );
});
