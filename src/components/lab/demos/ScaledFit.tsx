"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Shows a component at its natural size, scaled to sit inside the parent box
 * (which must be positioned). Used by the Lab previews, so a card or canvas
 * tile shows the real component rather than a screenshot of it. Transforms
 * don't change offsetWidth/Height, so measuring the scaled child is stable.
 */
export function ScaledFit({
  width,
  fill = 0.86,
  maxScale = 1.6,
  children,
}: {
  /** The width the child is laid out at before scaling. */
  width: number;
  /** How much of the box the child may take, 0–1. */
  fill?: number;
  maxScale?: number;
  children: ReactNode;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;
    const fit = () => {
      if (!inner.offsetWidth || !inner.offsetHeight) return;
      setScale(
        Math.min(
          maxScale,
          (box.clientWidth * fill) / inner.offsetWidth,
          (box.clientHeight * fill) / inner.offsetHeight,
        ),
      );
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [fill, maxScale]);

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden">
      <div
        ref={innerRef}
        className="absolute top-1/2 left-1/2"
        style={{
          width,
          transform: `translate(-50%, -50%) scale(${scale ?? 0.5})`,
          visibility: scale === null ? "hidden" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
