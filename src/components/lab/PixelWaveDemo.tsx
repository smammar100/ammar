"use client";

import { useState } from "react";
import PixelWaveText from "@/components/PixelWaveText";

// Demo block for the lab/pixel-wave page: the layered wave text plus a replay
// button. Remounting PixelWaveText (via key) re-runs its entrance effect —
// equivalent to the original page's play() handler.
export function PixelWaveDemo() {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div className="relative flex min-h-[22rem] items-center justify-center rounded-lg border border-border bg-card px-6 py-16 text-center texture-bg">
      <PixelWaveText
        key={replayKey}
        text="A tactile text reveal for crafted interfaces."
        as="p"
        wave="demo"
        className="max-w-3xl text-4xl font-medium leading-tight tracking-tight sm:text-6xl"
      />
      <button
        type="button"
        aria-label="Play"
        className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:opacity-40"
        onClick={() => setReplayKey((k) => k + 1)}
      >
        <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor" aria-hidden>
          <path d="M0 0l8 5-8 5V0z" />
        </svg>
      </button>
    </div>
  );
}
