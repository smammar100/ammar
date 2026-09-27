"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Plays a one-off build-up animation for its children the first time they
 * scroll into view. The motion itself is CSS (the `.b-*` classes and
 * `[data-build]` rules in global.css); this only flips the state:
 *
 *   no attribute  → nothing animates, children render finished. That is what
 *                   the server sends, what shows without JS, and what reduced
 *                   motion keeps.
 *   "armed"       → every piece is held at its first keyframe, out of sight.
 *   "play"        → the animations run, each on its own --d delay.
 */
export function BuildIn({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.dataset.build = "armed";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.build = "play";
        observer.disconnect();
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
