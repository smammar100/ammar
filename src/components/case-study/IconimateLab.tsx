"use client";

import { useRef } from "react";
import type { ComponentType, Ref } from "react";
import { cn } from "@/lib/utils";
import { Bc1 } from "./iconimate/lab/bc1";
import { Bc2 } from "./iconimate/lab/bc2";
import { Bc3 } from "./iconimate/lab/bc3";
import { Bc4 } from "./iconimate/lab/bc4";
import { Bc5 } from "./iconimate/lab/bc5";
import { Bc6 } from "./iconimate/lab/bc6";
import { Bc7 } from "./iconimate/lab/bc7";

// The seven baby-carriage candidates, ported unmodified from the Iconimate repo
// (app/lab/variants/bc1..bc7.tsx) alongside the shared hook and motion tokens they
// import. v7 is the one that shipped; the other six are the argument for it.

interface IconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

type IconComponent = ComponentType<{ size?: number; ref?: Ref<IconHandle> }>;

interface Candidate {
  version: string;
  motion: string;
  note: string;
  Icon: IconComponent;
  shipped?: boolean;
}

const CANDIDATES: Candidate[] = [
  { version: "v1", motion: "Pop", note: "The plainest take: springs in, no travel.", Icon: Bc1 },
  { version: "v2", motion: "Roll in", note: "Rolls in from the left, so it reads as wheeled.", Icon: Bc2 },
  { version: "v3", motion: "Rock", note: "Pivots on the ground contact, with follow-through.", Icon: Bc3 },
  { version: "v4", motion: "Bump ride", note: "Lurches over a bump and bounces out the decay.", Icon: Bc4 },
  { version: "v5", motion: "Hood unfurl", note: "The showpiece: crouch, furl, spring, unfurl.", Icon: Bc5 },
  { version: "v6", motion: "Hood breathe", note: "Body dead still; only the canopy pulses.", Icon: Bc6 },
  { version: "v7", motion: "Suspension bounce", note: "Body drops to its limit, canopy trails, tyres stay planted.", Icon: Bc7, shipped: true },
];

function CandidateTile({ version, motion, note, Icon, shipped }: Candidate) {
  const ref = useRef<IconHandle>(null);

  return (
    <button
      type="button"
      onClick={() => ref.current?.startAnimation()}
      onFocus={() => ref.current?.startAnimation()}
      onBlur={() => ref.current?.stopAnimation()}
      onMouseEnter={() => ref.current?.startAnimation()}
      onMouseLeave={() => ref.current?.stopAnimation()}
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border bg-card px-3 py-5 text-center transition-colors focus-visible:outline-none",
        shipped
          ? "border-accent/50 bg-accent/[0.06]"
          : "border-border hover:border-accent/40 focus-visible:border-accent/40",
      )}
      aria-label={`Candidate ${version}, ${motion}${shipped ? ", the version that shipped" : ""}. ${note} Activate to play.`}
    >
      <span className="text-foreground" aria-hidden="true">
        <Icon size={36} ref={ref} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {version}
          {shipped && <span className="text-accent"> · shipped</span>}
        </span>
        <span className="font-mono text-[13px] leading-none text-foreground">{motion}</span>
        <span className="mt-1 text-[12px] leading-snug text-muted-foreground">{note}</span>
      </span>
    </button>
  );
}

/** All seven baby-carriage candidates, the winner highlighted. */
export function IconimateLabCandidates() {
  return (
    <figure className="case-figure my-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CANDIDATES.map((candidate) => (
          <CandidateTile key={candidate.version} {...candidate} />
        ))}
      </div>
      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        Baby carriage: seven candidates, built as an escalation. The seventh shipped.
      </figcaption>
    </figure>
  );
}
