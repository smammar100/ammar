import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Caldera-style page frame: the content column sits between two diagonally
// hatched gutters, with dashed rules closing it top and bottom. The crosshairs
// are not drawn — they fall out of the gutter borders crossing the rules, and
// the masks fade both toward the edges so nothing terminates in a hard stub.
//
// Grid: [ 1fr | gutter | content | gutter | 1fr ]
//       [ 1fr |  1px   | content |  1px   | 1fr ]
// The outer 1fr tracks collapse when the content is taller than the viewport,
// which is why the rules always land flush against the content.

// 0.5px stroke on a 7px repeat: finer and denser than the snippet's 1px/10px,
// which is what lets the alpha go up without the texture turning heavy.
const HATCH =
  "bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_0.5px,transparent_0,transparent_50%)] bg-[size:7px_7px] bg-fixed";

export function Intersection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative grid w-full",
        // Narrow gutters on phones — at 375px a 2rem pair would take 64px off
        // the text column for pure decoration.
        // The content column is sized explicitly rather than `auto`. The
        // article inside is a size container, and containment takes it out of
        // intrinsic sizing, so `auto` collapses to zero. minmax(0,56rem) fails
        // too: the 1fr side tracks absorb all free space and it never grows
        // past its zero minimum. min() against the grid width works because
        // percentages here resolve against the grid, not the content.
        "grid-cols-[1fr_0.75rem_min(56rem,100%-1.5rem)_0.75rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr]",
        "sm:grid-cols-[1fr_2rem_min(56rem,100%-4rem)_2rem_1fr]",
        className,
      )}
    >
      {/* Content */}
      <div className="col-start-3 row-start-3 flex min-w-0 flex-col">{children}</div>

      {/* Hatched margins. These span the outer 1fr track as well as the gutter,
          so the pattern fills the whole margin the way the reference does
          rather than sitting in a narrow strip. The single rule lands on the
          inner edge, against the content. Both sides share one border colour —
          the snippet had the left one on the default token, so the two sides
          rendered different greys. */}
      <div
        aria-hidden="true"
        className={cn(
          "col-start-1 col-end-3 row-span-full row-start-1 border-r border-(--pattern-fg) mask-y-from-60%",
          HATCH,
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "col-start-4 col-end-6 row-span-full row-start-1 border-l border-(--pattern-fg) mask-y-from-60%",
          HATCH,
        )}
      />

      {/* Dashed rules. */}
      <div
        aria-hidden="true"
        className="relative -bottom-px col-span-full col-start-1 row-start-2 border-t border-dashed border-(--pattern-fg) mask-x-from-60%"
      />
      <div
        aria-hidden="true"
        className="relative -top-px col-span-full col-start-1 row-start-4 border-b border-dashed border-(--pattern-fg) mask-x-from-60%"
      />
    </div>
  );
}

/**
 * A dashed rule for *between* sections inside an Intersection, bleeding into
 * both gutters so it meets the vertical borders and forms the crosshair.
 */
export function IntersectionRule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "-mx-3 border-t border-dashed border-(--pattern-fg) mask-x-from-60% sm:-mx-8",
        className,
      )}
    />
  );
}

export default Intersection;
