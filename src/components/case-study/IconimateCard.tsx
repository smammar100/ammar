"use client";

import { useRef, useState } from "react";
import { Check, Code2, Sparkles, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { AcornIcon } from "./iconimate/acorn";
import { ACORN_CLI, ACORN_CODE, ACORN_PROMPT } from "./iconimate/acorn-payloads";

// A working replica of an iconimate.app tile: hover animates the icon and
// reveals the three per-icon actions. Each button copies the real payload —
// the component source, the shadcn CLI command, or the AI regeneration prompt.

interface IconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const ACTIONS = [
  { key: "code", label: "Copy Acorn .tsx code", short: ".tsx code", Icon: Code2, payload: ACORN_CODE },
  { key: "cli", label: "Copy Acorn shadcn CLI command", short: "shadcn CLI", Icon: Terminal, payload: ACORN_CLI },
  { key: "prompt", label: "Copy Acorn AI prompt", short: "AI prompt", Icon: Sparkles, payload: ACORN_PROMPT },
] as const;

export function IconimateCardDemo() {
  const iconRef = useRef<IconHandle>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const copiedTimer = useRef<number | undefined>(undefined);

  const copy = async (key: string, payload: string) => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(key);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(null), 1500);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — leave quietly.
    }
  };

  return (
    <figure className="case-figure my-8">
      <div
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
        className="group flex items-center justify-between gap-6 rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-accent/40"
      >
        <div className="flex min-w-0 items-center gap-4">
          <span className="shrink-0 text-foreground" aria-hidden="true">
            <AcornIcon size={28} ref={iconRef} />
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="font-mono text-[13px] leading-none text-foreground">Acorn</span>
            <span className="font-mono text-[11px] uppercase leading-none tracking-widest text-muted-foreground">Rock</span>
          </span>
        </div>

        {/* The three per-icon actions. On the real site these appear on hover;
            here they stay visible because they are the point of the section,
            and brighten on hover so the tile still reads as interactive. */}
        <div className="flex shrink-0 items-center gap-1.5 opacity-70 transition-opacity duration-200 focus-within:opacity-100 group-hover:opacity-100">
          {ACTIONS.map(({ key, label, short, Icon, payload }) => (
            <button
              key={key}
              type="button"
              aria-label={label}
              title={label}
              onClick={() => copy(key, payload)}
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-md border px-2 font-mono text-[11px] transition-colors focus-visible:outline-none",
                copied === key
                  ? "border-accent/60 bg-accent/10 text-accent"
                  : "border-border bg-background text-muted-foreground hover:border-accent/40 hover:text-foreground focus-visible:border-accent/40",
              )}
            >
              {copied === key ? (
                <Check className="size-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <Icon className="size-3.5 shrink-0" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{copied === key ? "Copied" : short}</span>
            </button>
          ))}
        </div>
      </div>
    </figure>
  );
}
