"use client";

import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import { LabPreview } from "@/components/lab/LabPreview";
import type { CanvasBuild } from "./items";

// A design-engineering build on the canvas. At rest it shows the live preview
// (or a still). Hovering it, tabbing to it, or a first tap on touch reveals an
// overlay describing the build: a circle that grows out from where the pointer
// came in, then the lines rise into it one after another. The whole tile links
// to the build; on touch the first tap only reveals, the second follows.

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function BuildTile({ item, focusable = true }: { item: CanvasBuild; focusable?: boolean }) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 100 });
  const lastPointer = useRef<string>("mouse");
  // The transitions are inline styles, which beat motion-reduce:transition-none,
  // so reduced motion is handled here: the overlay just appears and disappears.
  const reduceMotion = useReducedMotion();

  const aim = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  const lines: { key: string; node: React.ReactNode }[] = [
    {
      key: "label",
      node: (
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest opacity-70">
          <span className="size-1.5 rounded-full bg-[#4ADE80] motion-safe:animate-pulse" />
          Design engineering
        </span>
      ),
    },
    { key: "title", node: <span className="block text-xl font-medium tracking-tight">{item.title}</span> },
    {
      key: "body",
      node: <span className="block text-[13px] leading-snug opacity-80">{item.description}</span>,
    },
    {
      key: "cta",
      node: (
        <span className="inline-flex items-center gap-1 text-[13px] font-medium">
          {item.href.startsWith("/work/") ? "Read the case study" : "Open the experiment"}
          <span aria-hidden="true">→</span>
        </span>
      ),
    },
  ];

  return (
    <Link
      href={item.href}
      draggable={false}
      tabIndex={focusable ? undefined : -1}
      aria-label={`${item.title}: ${item.description}`}
      className="relative block overflow-hidden rounded-xl border border-border bg-card shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      onPointerDown={(e) => {
        lastPointer.current = e.pointerType;
      }}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        aim(e);
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setOpen(false);
      }}
      onFocus={(e) => {
        // Keyboard focus only. A tap focuses the link before its click (Android
        // Chrome), and opening here would let that first tap navigate.
        if (!e.currentTarget.matches(":focus-visible")) return;
        setOrigin({ x: 50, y: 100 });
        setOpen(true);
      }}
      onBlur={() => setOpen(false)}
      onClick={(e) => {
        // Touch: the first tap reveals what this is; the second follows it.
        if (lastPointer.current !== "mouse" && !open) {
          e.preventDefault();
          setOrigin({ x: 50, y: 50 });
          setOpen(true);
        }
      }}
    >
      {item.preview ? (
        <LabPreview preview={item.preview} title={item.title} />
      ) : item.image ? (
        <img
          src={item.image.src}
          alt=""
          width={item.image.width}
          height={item.image.height}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      ) : null}

      {/* Overlay. The circle is the clip-path; the lines are staggered
          transitions that run in on open and all leave together on close. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex flex-col justify-end gap-2 bg-neutral-950/88 p-5 text-white backdrop-blur-[2px] motion-reduce:transition-none"
        style={{
          clipPath: `circle(${open ? 150 : 0}% at ${origin.x}% ${origin.y}%)`,
          transition: reduceMotion ? "none" : `clip-path ${open ? 620 : 380}ms ${EASE}`,
        }}
      >
        {lines.map((line, i) => (
          <span
            key={line.key}
            className="block motion-reduce:transition-none"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "none" : "translateY(10px)",
              transition: reduceMotion ? "none" : `opacity 360ms ${EASE}, transform 460ms ${EASE}`,
              transitionDelay: open ? `${120 + i * 70}ms` : "0ms",
            }}
          >
            {line.node}
          </span>
        ))}
      </span>
    </Link>
  );
}
