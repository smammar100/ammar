"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import type { HTMLAttributes } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";

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

// Shared PULSE engine for the arrows refresh/sync pair. One spin about the centre
// carrying a squash-and-pop scale as secondary action — a tactile refresh tap. `spin`
// is the signed turn in degrees: +360 (clockwise) or -360 (counter-clockwise); the
// glyph's 2-fold rotational symmetry lands the full turn seamlessly back at rest.
// Principles: SLOW OUT (the spin decelerates), SECONDARY ACTION (the scale pulse rides
// the spin), APPEAL (the pop). Reduced-motion: start() early-returns.

export function makeArrowsPulse(glyph: string, spin: number) {
  return forwardRef<IconHandle, IconProps>(function ArrowsPulseIcon({ size = 28, style, ...props }, ref) {
    const reduced = useReducedMotion() ?? false;
    const rotate = useMotionValue(0);
    const scale = useMotionValue(1);
    const rAnim = useRef<ReturnType<typeof animate> | null>(null);
    const sAnim = useRef<ReturnType<typeof animate> | null>(null);

    const start = () => {
      if (reduced) return;
      rAnim.current?.stop();
      sAnim.current?.stop();
      // Always spin from rest; a completed turn lands back at rest.
      rotate.set(0);
      scale.set(1);
      rAnim.current = animate(rotate, spin, { duration: 0.85, ease: ARRIVE });
      sAnim.current = animate(scale, [1, 0.9, 1.06, 1], { duration: 0.7, ease: "easeOut", times: [0, 0.3, 0.65, 1] });
    };

    const stop = () => {
      rAnim.current?.stop();
      sAnim.current?.stop();
      rotate.set(0);
      scale.set(1);
    };

    useImperativeHandle(ref, () => ({ startAnimation: start, stopAnimation: stop }), []);

    return (
      <div
        {...props}
        onMouseEnter={start}
        onMouseLeave={stop}
        onFocus={start}
        onBlur={stop}
        style={{ display: "inline-flex", ...style }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 256 256"
          fill="currentColor"
          style={{ rotate, scale, overflow: "visible" }}
        >
          <path d={glyph} />
        </motion.svg>
      </div>
    );
  });
}

// PULSE — a clockwise refresh spin carrying a gentle squash-and-pop (a refresh tap).
const GLYPH =
  "M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L182.06,73.37a79.56,79.56,0,0,0-56.13-23.43h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27a96,96,0,0,1,135,.79L208,76.69V48a8,8,0,0,1,16,0ZM186.41,183.29a80,80,0,0,1-112.47-.66L59.31,168H88a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V179.31l14.63,14.63A95.43,95.43,0,0,0,130,222.06h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z";

export const ArrowsClockwiseIcon = makeArrowsPulse(GLYPH, 360);
