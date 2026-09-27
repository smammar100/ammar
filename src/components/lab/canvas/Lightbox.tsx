"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useIsPresent, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { CanvasShot } from "./items";

// Full-screen view of a static shot. It opens by growing the image out of its
// spot on the canvas (a FLIP from the clicked tile's rect) and closes back into
// it; stepping to another shot crossfades instead, since that shot has no tile
// on screen to grow from. Esc closes, arrow keys step, and focus goes to the
// close button on open and back to the tile on close. While it's open, Tab
// cycles through its own buttons (the canvas behind is inert), and each step
// is announced.

interface Props {
  shots: CanvasShot[];
  index: number;
  /** The clicked tile's rect, to grow out of. Null once the user has stepped away. */
  origin: DOMRect | null;
  onIndex: (index: number) => void;
  onClose: () => void;
}

function useViewport() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const read = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return size;
}

export function Lightbox({ shots, index, origin, onIndex, onClose }: Props) {
  const shot = shots[index];
  const { w: vw, h: vh } = useViewport();
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // False while the close animation plays: keys shouldn't reopen it then.
  const present = useIsPresent();
  const count = shots.length;
  const step = (dir: 1 | -1) => onIndex((index + dir + count) % count);

  // Focus the close button once it exists: the first render is skipped until
  // the screen has been measured.
  const measured = vw > 0;
  useEffect(() => {
    if (measured) closeRef.current?.focus();
  }, [measured]);

  // Hold the page still underneath while open.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!present) return;
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab") {
        // Keep focus inside: wrap from the last button to the first, and back.
        const buttons = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
        if (!buttons.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        const inside = buttons.includes(document.activeElement as HTMLButtonElement);
        if (e.shiftKey && (document.activeElement === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!vw) return null;

  // Fit the shot inside the screen, leaving room for the caption below.
  const maxW = Math.min(vw - 48, 1360);
  const maxH = vh - 170;
  const scale = Math.min(maxW / shot.width, maxH / shot.height);
  const fw = shot.width * scale;
  const fh = shot.height * scale;
  const left = (vw - fw) / 2;
  const top = Math.max(56, (vh - fh) / 2 - 36);

  // The transform that puts the full-size image exactly over its tile.
  const fromTile =
    origin && !reduce
      ? {
          x: origin.left + origin.width / 2 - (left + fw / 2),
          y: origin.top + origin.height / 2 - (top + fh / 2),
          scale: origin.width / fw,
          opacity: 1,
        }
      : { x: 0, y: 0, scale: reduce ? 1 : 0.96, opacity: 0 };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${shot.title}, ${index + 1} of ${count}`}
      className="fixed inset-0 z-[60]"
    >
      <p className="sr-only" aria-live="polite">
        {shot.title}, {index + 1} of {count}
      </p>
      <motion.div
        className="absolute inset-0 bg-background/85 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      <motion.img
        key={shot.id}
        src={shot.src}
        alt={shot.title}
        width={shot.width}
        height={shot.height}
        draggable={false}
        className="absolute rounded-xl border border-border shadow-2xl"
        style={{ left, top, width: fw, height: fh, transformOrigin: "center" }}
        initial={fromTile}
        animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        exit={fromTile}
        transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
      />

      <motion.div
        className="absolute inset-x-0 flex flex-col items-center gap-1 px-6 text-center"
        style={{ top: top + fh + 18 }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <p className="text-base font-medium tracking-tight">{shot.title}</p>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {shot.label} · {index + 1} / {count}
        </p>
      </motion.div>

      <div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="skeu skeu-press absolute top-4 right-4 flex size-10 items-center justify-center rounded-full"
        >
          <X className="size-4" />
        </button>
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous shot"
              className="skeu skeu-press absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full sm:left-6"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next shot"
              className="skeu skeu-press absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full sm:right-6"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
