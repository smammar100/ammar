"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Mounts its children only once the box nears the screen, and then one box at
// a time: every waiting box joins a queue that mounts one per idle moment, so
// a wall of live previews coming into view doesn't land as one long task.
// Once mounted, children stay mounted.

const queue: (() => void)[] = [];
let draining = false;

function drain() {
  const next = queue.shift();
  if (!next) {
    draining = false;
    return;
  }
  next();
  const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 16));
  idle(drain, { timeout: 120 });
}

function enqueue(mount: () => void) {
  queue.push(mount);
  if (!draining) {
    draining = true;
    drain();
  }
}

export function LazyMount({ children, rootMargin = "200px" }: { children: ReactNode; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const mount = () => {
      if (!cancelled) setMounted(true);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        enqueue(mount);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [rootMargin]);

  return (
    <div ref={ref} className="absolute inset-0">
      {mounted && children}
    </div>
  );
}
