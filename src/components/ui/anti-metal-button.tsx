"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// A dark metal pill with a lime tab on its left edge. On hover the tab slides
// across the whole button while its dot chevrons ripple, left to right. The
// dot wave (.bd-dot, @keyframes bd-dot-wave) lives in global.css so it isn't
// re-declared by every button on the page.

const DOTS = [
  { cx: 2, cy: 2, d: 0 },
  { cx: 5, cy: 5, d: 0.05 },
  { cx: 8, cy: 8, d: 0.1 },
  { cx: 5, cy: 11, d: 0.15 },
  { cx: 2, cy: 14, d: 0.2 },
  { cx: 6, cy: 2, d: 0.05 },
  { cx: 9, cy: 5, d: 0.1 },
  { cx: 12, cy: 8, d: 0.15 },
  { cx: 9, cy: 11, d: 0.2 },
  { cx: 6, cy: 14, d: 0.25 },
];

function DoubleChevron({ index, dotColor }: { index: number; dotColor: string }) {
  const base = index * 0.12;
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      aria-hidden="true"
      focusable="false"
      className="shrink-0 overflow-visible"
    >
      <g fill={dotColor}>
        {DOTS.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r="1" className="bd-dot" style={{ animationDelay: `${base + p.d}s` }} />
        ))}
      </g>
    </svg>
  );
}

export interface AntiMetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button text. Falls back to children, then "Book a demo". */
  label?: React.ReactNode;
  /** Top of the tab's gradient. */
  accentFrom?: string;
  /** Bottom of the tab's gradient. */
  accentTo?: string;
  /** Colour of the chevron dots. */
  dotColor?: string;
}

export const AntiMetalButton = React.forwardRef<HTMLButtonElement, AntiMetalButtonProps>(
  (
    { className, children, label, accentFrom = "#d6f54a", accentTo = "#c5ea2c", dotColor = "#0f0f0f", type = "button", ...props },
    ref,
  ) => {
    const content = label ?? children ?? "Book a demo";

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "group/btn relative inline-flex h-11 w-36 overflow-hidden rounded-xl transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "bg-[linear-gradient(180deg,#1a1a1a_0%,#0a0a0a_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.18)]",
          "dark:bg-[linear-gradient(180deg,#ffffff_0%,#ededed_100%)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_rgba(0,0,0,0.35)]",
          className,
        )}
        {...props}
      >
        <span className="absolute inset-y-0 right-4 flex items-center text-[14px] font-medium tracking-tight text-white dark:text-[#0a0a0a]">
          {content}
        </span>

        <span
          aria-hidden="true"
          className="absolute top-1 bottom-1 left-1 z-10 flex w-9 items-center justify-start gap-2.5 overflow-hidden rounded-md pr-2.5 pl-3 transition-[width,gap] duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/btn:w-[calc(100%-0.5rem)] group-focus-visible/btn:w-[calc(100%-0.5rem)]"
          style={{
            background: `linear-gradient(180deg, ${accentFrom} 0%, ${accentTo} 100%)`,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)",
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <DoubleChevron key={i} index={i} dotColor={dotColor} />
          ))}
        </span>
      </button>
    );
  },
);

AntiMetalButton.displayName = "AntiMetalButton";

export default AntiMetalButton;
