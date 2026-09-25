"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const ALT =
  "Mahaana component inventory: index, gainer and loser list rows, a sector heatmap, investment comparison bars, the portfolio dashboard header and chart, an order card, editorial content cards, and the Save+, Retirement, Gold and Trade product cards";

/** The component inventory with a switch between its light and dark themes. */
export function MahaanaFoundationsToggle() {
  const [dark, setDark] = useState(false);

  return (
    <figure className="case-figure my-10">
      {/* Both images stay mounted and stacked so the switch never waits on a
          download or shifts the layout; only opacity changes. The light export
          is 1166x908 and sets the height; the dark one is 2px taller, and the
          extra falls into the band below, which is the same colour. */}
      {/* Both exports sit on #FAF8F5, the light --background, so the frame and
          the band under the image use that token and the switch reads as part
          of the image rather than a strip. */}
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="relative pb-10">
          <img
            src="/images/projects/mahaana-wealth/atomic-system.png"
            alt={dark ? "" : `${ALT}, in light mode`}
            aria-hidden={dark}
            width={1166}
            height={908}
            className={cn(
              "block w-full transition-opacity duration-300 motion-reduce:transition-none",
              dark ? "opacity-0" : "opacity-100",
            )}
          />
          <img
            src="/images/projects/mahaana-wealth/atomic-system-dark.png"
            alt={dark ? `${ALT}, in dark mode` : ""}
            aria-hidden={!dark}
            width={1166}
            height={910}
            className={cn(
              "absolute inset-x-0 top-0 block w-full transition-opacity duration-300 motion-reduce:transition-none",
              dark ? "opacity-100" : "opacity-0",
            )}
          />
          <div className="absolute inset-x-0 bottom-3 flex justify-center">
            <button
              type="button"
              role="switch"
              aria-checked={dark}
              aria-label="Dark mode"
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setDark((d) => !d)}
              className={cn(
                "relative h-7 w-12 rounded-full border shadow-sm backdrop-blur transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                dark
                  ? "border-white/15 bg-neutral-800/90"
                  : "border-black/10 bg-white/90",
              )}
            >
              <span
                className={cn(
                  "absolute top-[3px] left-[3px] flex size-5 items-center justify-center rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none",
                  dark
                    ? "translate-x-5 bg-neutral-100 text-neutral-900"
                    : "bg-neutral-900 text-white",
                )}
              >
                {dark ? (
                  <Moon className="size-3" aria-hidden />
                ) : (
                  <Sun className="size-3" aria-hidden />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </figure>
  );
}
