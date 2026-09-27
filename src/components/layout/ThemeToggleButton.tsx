"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleButtonProps {
  className?: string;
  size?: number;
}

/**
 * Sun and moon as one drawing, so switching theme morphs one into the other:
 * in light mode it's a moon (a disc with a shadow circle cutting the
 * crescent), in dark mode the sun (the shadow slides off, the disc shrinks to
 * the core and the rays spin out). The `.dark` class drives it in CSS
 * (`.theme-icon` in styles/global.css), so it's right from the first paint.
 */
function SunMoon({ size }: { size: number }) {
  // Two toggles can be on the page (phone and desktop bars), so each needs
  // its own mask id; useId's punctuation isn't safe inside url(#…).
  const mask = `theme-icon-${useId().replace(/[^\w-]/g, "")}`;
  return (
    <svg className="theme-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <mask id={mask}>
        <rect width="24" height="24" fill="white" />
        <circle className="theme-icon-shadow" cx="16.5" cy="7.5" r="6.4" fill="black" />
      </mask>
      <circle className="theme-icon-disc" cx="12" cy="12" r="9" fill="currentColor" mask={`url(#${mask})`} />
      <g className="theme-icon-rays" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line key={a} x1="12" y1="1.5" x2="12" y2="3.5" transform={`rotate(${a} 12 12)`} />
        ))}
      </g>
    </svg>
  );
}

/** Theme toggle with a View Transitions cross-fade; persists to localStorage. */
export function ThemeToggleButton({ className, size = 18 }: ThemeToggleButtonProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    const apply = () => {
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      setDark(next);
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && "startViewTransition" in document) {
      (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(apply);
    } else {
      apply();
    }
  };

  const label = `Switch to ${dark ? "light" : "dark"} mode`;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      // The skeuomorphic icon button (styles/global.css); callers size it.
      className={cn("skeu skeu-press skeu-icon", className)}
    >
      <SunMoon size={size} />
    </button>
  );
}
