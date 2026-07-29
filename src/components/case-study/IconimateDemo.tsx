"use client";

import { useRef } from "react";
import type { ComponentType, Ref } from "react";
import { cn } from "@/lib/utils";
import { AcornIcon } from "./iconimate/acorn";
import { AirplaneTakeoffIcon } from "./iconimate/airplane-takeoff";
import { AlienIcon } from "./iconimate/alien";
import { AmbulanceIcon } from "./iconimate/ambulance";
import { AnchorIcon } from "./iconimate/anchor";
import { AndroidLogoIcon } from "./iconimate/android-logo";
import { ArrowsClockwiseIcon } from "./iconimate/arrows-clockwise";
import { BeerSteinIcon } from "./iconimate/beer-stein";
import { BehanceLogoIcon } from "./iconimate/behance-logo";

// Live Iconimate icons, pulled unmodified from the project's own shadcn registry
// (https://iconimate.app/r/<name>.json) into ./iconimate. Each one is
// self-contained with `motion` as its only runtime dependency, which is exactly
// the "install an icon, not a dependency" claim the case study makes.

/** The imperative handle every Iconimate icon exposes, for touch where `:hover` never fires. */
interface IconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

type IconComponent = ComponentType<{ size?: number; ref?: Ref<IconHandle> }>;

interface IconSpec {
  name: string;
  motion: string;
  Icon: IconComponent;
}

/** A single hoverable tile: the icon, its name, and the name of its motion. */
function IconTile({ name, motion, Icon }: IconSpec) {
  const ref = useRef<IconHandle>(null);

  return (
    <button
      type="button"
      // Tap and keyboard both drive the same imperative handle the icons expose,
      // so the demo works where :hover never fires.
      onClick={() => ref.current?.startAnimation()}
      onFocus={() => ref.current?.startAnimation()}
      onBlur={() => ref.current?.stopAnimation()}
      onMouseEnter={() => ref.current?.startAnimation()}
      onMouseLeave={() => ref.current?.stopAnimation()}
      className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-4 py-5 text-center transition-colors hover:border-accent/40 focus-visible:border-accent/40 focus-visible:outline-none"
      aria-label={`${name}, ${motion} animation. Activate to play.`}
    >
      <span className="text-foreground" aria-hidden="true">
        <Icon size={32} ref={ref} />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-mono text-[13px] leading-none text-foreground">{name}</span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{motion}</span>
      </span>
    </button>
  );
}

function IconGrid({ icons, caption }: { icons: IconSpec[]; caption: string }) {
  return (
    <figure className="case-figure my-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {icons.map((spec) => (
          <IconTile key={spec.name} {...spec} />
        ))}
      </div>
      <figcaption className="mt-3 text-center text-sm text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}

/** The four icons the case study names when introducing the shared motion dialect. */
export function IconimateHoverGrid() {
  return (
    <IconGrid
      caption="Live components from the set. Hover, tap, or tab to any of them."
      icons={[
        { name: "Alien", motion: "glow eyes", Icon: AlienIcon },
        { name: "Acorn", motion: "rock", Icon: AcornIcon },
        { name: "Anchor", motion: "sway", Icon: AnchorIcon },
        { name: "Arrows Clockwise", motion: "pulse", Icon: ArrowsClockwiseIcon },
      ]}
    />
  );
}

/** The four icons from the rest-state section, including the stein that lost its lid flip. */
export function IconimateRestStateGrid() {
  return (
    <IconGrid
      caption="The beer stein moves as one rigid mark, so its resting frame is the untouched Phosphor glyph."
      icons={[
        { name: "Ambulance", motion: "drive", Icon: AmbulanceIcon },
        { name: "Airplane Takeoff", motion: "departure", Icon: AirplaneTakeoffIcon },
        { name: "Android Logo", motion: "hop", Icon: AndroidLogoIcon },
        { name: "Beer Stein", motion: "cheers & fizz", Icon: BeerSteinIcon },
      ]}
    />
  );
}

const SIZES = [16, 20, 24, 32, 48] as const;
const SHIP_SIZE = 24;

/**
 * The same icon at five sizes, driven together, so the 24px ship size can be
 * judged against the flattering large ones.
 */
export function IconimateSizeScale() {
  const refs = useRef<(IconHandle | null)[]>([]);

  const startAll = () => refs.current.forEach((r) => r?.startAnimation());
  const stopAll = () => refs.current.forEach((r) => r?.stopAnimation());

  return (
    <figure className="case-figure my-8">
      <div
        onMouseEnter={startAll}
        onMouseLeave={stopAll}
        onFocus={startAll}
        onBlur={stopAll}
        className="flex flex-wrap items-end justify-center gap-6 rounded-lg border border-border bg-card px-4 py-8 sm:gap-10"
      >
        {SIZES.map((size, i) => (
          <div key={size} className="flex flex-col items-center gap-3">
            <span className="flex h-12 items-end text-foreground" aria-hidden="true">
              <BehanceLogoIcon
                size={size}
                ref={(node: IconHandle | null) => {
                  refs.current[i] = node;
                }}
              />
            </span>
            <span
              className={cn(
                "font-mono text-[11px] uppercase tracking-widest",
                size === SHIP_SIZE ? "text-accent" : "text-muted-foreground",
              )}
            >
              {size}
              {size === SHIP_SIZE && " · ship"}
            </span>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        One icon at five sizes, animating together. The motion has to hold up at 24px; the larger ones are a bonus.
      </figcaption>
    </figure>
  );
}
