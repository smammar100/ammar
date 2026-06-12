"use client";

import { useState } from "react";

// ─── Dither A geometry ───────────────────────────────────────────────────────
// The site mark: the letter A drawn as a 12×12 bitmap and shaded with a Bayer
// 4×4 ordered dither. Brightness falls from apex to feet, and each cell
// quantises to one of three pixel sizes — the letter starts solid at the top
// and dissolves into dither as it lands.

const GRID = 12;
const AREA = 20; // glyph area inside the 28×28 viewBox
const ORIGIN = (28 - AREA) / 2;
const PITCH = AREA / GRID;

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const A_BITMAP = [
  ".....XX.....",
  "....XXXX....",
  "....XXXX....",
  "...XXXXXX...",
  "...XX..XX...",
  "..XXX..XXX..",
  "..XXX..XXX..",
  ".XXXXXXXXXX.",
  ".XXXXXXXXXX.",
  "XXXX....XXXX",
  "XXX......XXX",
  "XXX......XXX",
];

// Quantised pixel sizes (fractions of the cell pitch) — three discrete steps
// keep the texture digital instead of smoothly-shaded halftone.
const SIZE_FULL = PITCH * 0.8;
const SIZE_MID = PITCH * 0.55;
const SIZE_DOT = PITCH * 0.3;

type DitherCell = { cx: number; cy: number; size: number; phase: number; row: number };

const CELLS: DitherCell[] = [];
for (let r = 0; r < GRID; r++) {
  for (let c = 0; c < GRID; c++) {
    if (A_BITMAP[r][c] !== "X") continue;
    const threshold = (BAYER4[r % 4][c % 4] + 0.5) / 16;
    const brightness = 1 - 0.85 * (r / (GRID - 1));
    const value = brightness - (threshold - 0.5) * 0.45;
    CELLS.push({
      cx: ORIGIN + (c + 0.5) * PITCH,
      cy: ORIGIN + (r + 0.5) * PITCH,
      size: value > 0.66 ? SIZE_FULL : value > 0.38 ? SIZE_MID : SIZE_DOT,
      phase: threshold,
      row: r,
    });
  }
}

// ─── Dither mark ─────────────────────────────────────────────────────────────

interface DitherAMarkProps {
  size?: number;
  bgColor?: string;
  pixelColor?: string;
  bgStroke?: string;
}

export function DitherAMark({
  size = 48,
  bgColor = "var(--color-foreground)",
  pixelColor = "var(--color-background)",
  bgStroke,
}: DitherAMarkProps) {
  const [shimmering, setShimmering] = useState(false);

  const setHover = (entering: boolean) => {
    if (entering && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShimmering(entering);
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Inset slightly when stroked so border isn't clipped by viewBox edge */}
      <rect
        x={bgStroke ? 0.75 : 0}
        y={bgStroke ? 0.75 : 0}
        width={bgStroke ? 26.5 : 28}
        height={bgStroke ? 26.5 : 28}
        rx={bgStroke ? 5.8 : 6.2}
        style={{ fill: bgColor, stroke: bgStroke, strokeWidth: bgStroke ? 1.5 : 0 }}
      />
      {CELLS.map((cell, i) => (
        <rect
          key={i}
          x={cell.cx - cell.size / 2}
          y={cell.cy - cell.size / 2}
          width={cell.size}
          height={cell.size}
          rx={cell.size * 0.22}
          style={{
            fill: pixelColor,
            animation: shimmering
              ? `dither-shimmer 0.9s ease-in-out ${(cell.phase * 0.9).toFixed(3)}s infinite`
              : "none",
          }}
        />
      ))}
      <style>{`
        @keyframes dither-shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.18; }
        }
      `}</style>
    </svg>
  );
}

// ─── State card wrapper ──────────────────────────────────────────────────────

export function PlayButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label="Play"
      className="flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:opacity-40"
    >
      <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor" aria-hidden>
        <path d="M0 0l8 5-8 5V0z" />
      </svg>
    </button>
  );
}

export function StateCard({
  label,
  children,
  action,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="relative flex min-h-36 items-center justify-center rounded-lg border border-border bg-card p-6">
        {children}
        {action && <div className="absolute bottom-3 right-3">{action}</div>}
      </div>
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

// ─── Scale strip ─────────────────────────────────────────────────────────────

const SIZES = [
  { size: 16, label: "Favicon" },
  { size: 28, label: "Header" },
  { size: 48, label: "Card" },
  { size: 96, label: "Display" },
];

export function DitherScaleStrip() {
  return (
    <div className="grid grid-cols-2 items-end gap-x-8 gap-y-10 sm:flex sm:gap-8">
      {SIZES.map(({ size, label }) => (
        <div key={size} className="flex min-w-0 flex-col items-center gap-3">
          <DitherAMark size={size} />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          <span className="font-mono text-xs text-muted-foreground/50">{size}px</span>
        </div>
      ))}
    </div>
  );
}

// ─── Color variants ──────────────────────────────────────────────────────────

const COLOR_VARIANTS: {
  label: string;
  bgColor: string;
  pixelColor: string;
  bgStroke?: string;
}[] = [
  {
    label: "Default",
    bgColor: "var(--color-foreground)",
    pixelColor: "var(--color-background)",
  },
  {
    label: "Accent",
    bgColor: "var(--color-accent)",
    pixelColor: "var(--color-accent-foreground)",
  },
  {
    label: "Soft",
    bgColor: "var(--color-secondary)",
    pixelColor: "var(--color-secondary-foreground)",
  },
  {
    label: "Outline",
    bgColor: "var(--color-background)",
    pixelColor: "var(--color-foreground)",
    bgStroke: "var(--color-border)",
  },
];

export function DitherVariants() {
  return (
    <div className="grid grid-cols-4 items-center gap-x-8 gap-y-8">
      {COLOR_VARIANTS.map((v) => (
        <div key={`header-${v.label}`} className="flex justify-center">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {v.label}
          </span>
        </div>
      ))}
      {COLOR_VARIANTS.map((v) => (
        <div key={`sq-${v.label}`} className="flex justify-center">
          <DitherAMark
            size={48}
            bgColor={v.bgColor}
            pixelColor={v.pixelColor}
            bgStroke={v.bgStroke}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Interaction state demos ─────────────────────────────────────────────────

function DitherScaleState() {
  return (
    <div className="cursor-pointer transition-transform duration-300 ease-out hover:scale-110">
      <DitherAMark size={48} />
    </div>
  );
}

function DitherLiftState() {
  return (
    <div
      className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 dark:hover:shadow-black/40"
      style={{ borderRadius: "10.6px" }}
    >
      <DitherAMark size={48} />
    </div>
  );
}

function DitherInlineState() {
  return (
    <div className="group flex cursor-pointer items-center gap-2">
      <div className="shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5">
        <DitherAMark size={28} />
      </div>
      <span className="font-mono text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
        Syed Mohammad Ammar
      </span>
    </div>
  );
}

function DitherEntranceMark() {
  // Cells materialise in Bayer-threshold order — the dither pattern itself
  // dictates the choreography.
  return (
    <>
      <svg width={48} height={48} viewBox="0 0 28 28" aria-hidden>
        <rect width="28" height="28" rx={6.2} style={{ fill: "var(--color-foreground)" }} />
        {CELLS.map((cell, i) => (
          <rect
            key={i}
            x={cell.cx - cell.size / 2}
            y={cell.cy - cell.size / 2}
            width={cell.size}
            height={cell.size}
            rx={cell.size * 0.22}
            style={{
              fill: "var(--color-background)",
              animation: `dither-in 0.35s cubic-bezier(0.16,1,0.3,1) ${(cell.phase * 0.45).toFixed(3)}s both`,
              transformOrigin: `${cell.cx}px ${cell.cy}px`,
            }}
          />
        ))}
      </svg>
      <style>{`
        @keyframes dither-in {
          from { opacity: 0; transform: scale(0); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

function DitherAccentState() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg width={48} height={48} viewBox="0 0 28 28" aria-hidden>
        <rect
          width="28"
          height="28"
          rx={6.2}
          style={{
            fill: hovered ? "var(--color-accent)" : "var(--color-foreground)",
            transition: "fill 0.5s ease",
          }}
        />
        {CELLS.map((cell, i) => (
          <rect
            key={i}
            x={cell.cx - cell.size / 2}
            y={cell.cy - cell.size / 2}
            width={cell.size}
            height={cell.size}
            rx={cell.size * 0.22}
            style={{
              fill: hovered
                ? "var(--color-accent-foreground)"
                : "var(--color-background)",
              transition: `fill 0.4s ease ${(cell.phase * 0.3).toFixed(3)}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// A dither-native loader: a soft wave rolls down the glyph on an infinite
// loop, each cell dipping in scale and opacity as it passes. Bayer phase
// jitters the timing so the wave stays textured instead of reading as clean
// rows. Negative delays start the wave mid-flight, so there's no pop-in.
function DitherLoadingMark() {
  return (
    <>
      <svg width={48} height={48} viewBox="0 0 28 28" aria-hidden>
        <rect width="28" height="28" rx={6.2} style={{ fill: "var(--color-foreground)" }} />
        {CELLS.map((cell, i) => (
          <rect
            key={i}
            className="dither-load-cell"
            x={cell.cx - cell.size / 2}
            y={cell.cy - cell.size / 2}
            width={cell.size}
            height={cell.size}
            rx={cell.size * 0.22}
            style={{
              fill: "var(--color-background)",
              animation: `dither-load 1.4s ease-in-out ${(
                -1.5 +
                (cell.row / (GRID - 1)) * 1.4 +
                (cell.phase - 0.5) * 0.18
              ).toFixed(3)}s infinite`,
              transformOrigin: `${cell.cx}px ${cell.cy}px`,
            }}
          />
        ))}
      </svg>
      <style>{`
        @keyframes dither-load {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.2); opacity: 0.3; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dither-load-cell { animation: none !important; }
        }
      `}</style>
    </>
  );
}

export function DitherStates() {
  const [entranceKey, setEntranceKey] = useState(0);

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
      <StateCard label="Scale"><DitherScaleState /></StateCard>
      <StateCard label="Lift"><DitherLiftState /></StateCard>
      <StateCard label="Inline"><DitherInlineState /></StateCard>
      <StateCard label="Entrance" action={<PlayButton onClick={() => setEntranceKey((k) => k + 1)} />}>
        <DitherEntranceMark key={entranceKey} />
      </StateCard>
      <StateCard label="Accent"><DitherAccentState /></StateCard>
      <StateCard label="Loading"><DitherLoadingMark /></StateCard>
    </div>
  );
}

// ─── Production sidebar switcher ─────────────────────────────────────────────
// Hover previews the rail's next state through resolution: collapsing
// de-resolves every cell to its smallest dot, expanding sharpens every cell
// to a full pixel. Bayer phase staggers the transition so the change sweeps
// through the texture.

function DitherNavSwitcherMark({ direction }: { direction: "collapse" | "expand" }) {
  const [active, setActive] = useState(false);
  const target = direction === "collapse" ? SIZE_DOT : SIZE_FULL;

  return (
    <button
      type="button"
      className="group flex flex-col items-center gap-5 rounded-lg p-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Preview ${direction} navigation state`}
      aria-pressed={active}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onClick={() => setActive(true)}
    >
      <div className="rounded-lg p-2">
        <svg width={48} height={48} viewBox="0 0 28 28" aria-hidden>
          <rect width="28" height="28" rx={6.2} style={{ fill: "var(--color-secondary)" }} />
          {CELLS.map((cell, i) => (
            <rect
              key={i}
              x={cell.cx - cell.size / 2}
              y={cell.cy - cell.size / 2}
              width={cell.size}
              height={cell.size}
              rx={cell.size * 0.22}
              style={{
                fill: "var(--color-secondary-foreground)",
                transformOrigin: `${cell.cx}px ${cell.cy}px`,
                transform: active ? `scale(${(target / cell.size).toFixed(3)})` : undefined,
                transition: `transform 300ms cubic-bezier(0.16,1,0.3,1) ${(cell.phase * 0.12).toFixed(3)}s`,
              }}
            />
          ))}
        </svg>
      </div>
    </button>
  );
}

export function DitherNavSwitcherStates() {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <StateCard label="Collapse Hover">
        <DitherNavSwitcherMark direction="collapse" />
      </StateCard>
      <StateCard label="Expand Hover">
        <DitherNavSwitcherMark direction="expand" />
      </StateCard>
    </div>
  );
}