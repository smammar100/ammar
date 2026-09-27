import { Megaphone, Scale, Shapes, Star, type LucideIcon } from "lucide-react";

// Iconimate case-study graphics that aren't live icons: the outcomes grid and
// the closing links. Zero-prop presets like the other case-study components
// (next-mdx-remote doesn't reliably pass array/object props, see Mdx.tsx).

/**
 * Outcomes, in the same 2×2 grid as Mahaana's. Public figures only, as of
 * September 2026: the icon count on iconimate.app, the GitHub star count, the
 * licence, and the DEV.to feature.
 */
const STATS: { value: string; label: string; Icon: LucideIcon; tint: string }[] = [
  { value: "216", label: "Animated icons", Icon: Shapes, tint: "text-violet-500/30 dark:text-violet-400/30" },
  { value: "45", label: "GitHub stars", Icon: Star, tint: "text-amber-500/35 dark:text-amber-400/30" },
  { value: "MIT", label: "Open-source licence", Icon: Scale, tint: "text-sky-500/30 dark:text-sky-400/30" },
  { value: "DEV.to", label: "Featured on its social media", Icon: Megaphone, tint: "text-emerald-500/30 dark:text-emerald-400/30" },
];

export function IconimateImpact() {
  return (
    <figure className="case-figure my-10">
      {/* The gap-px over bg-border trick draws the dividers, so STATS must stay
          an even count (an empty cell shows as a slab of border colour). */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {STATS.map(({ value, label, Icon, tint }) => (
          <div key={label} className="relative flex flex-col overflow-clip bg-card px-4 py-5 sm:px-5 sm:py-6">
            <Icon
              aria-hidden="true"
              strokeWidth={1.25}
              className={`pointer-events-none absolute -right-4 -bottom-7 h-20 w-20 sm:-right-5 sm:-bottom-6 sm:h-32 sm:w-32 ${tint}`}
            />
            <span className="relative text-3xl font-semibold tabular-nums tracking-tight text-foreground sm:text-4xl">
              {value}
            </span>
            <span className="relative mt-1 pr-8 text-sm leading-snug text-muted-foreground sm:pr-0">{label}</span>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-center text-sm text-muted-foreground">Figures as of September 2026.</figcaption>
    </figure>
  );
}

const LINKS = [
  { label: "Explore Iconimate", href: "https://iconimate.app" },
  { label: "View on GitHub", href: "https://github.com/smammar100/Iconimate" },
];

/** Where to go next: the live gallery and the source, as the site's buttons. */
export function IconimateLinks() {
  return (
    <div className="not-prose my-12 flex flex-wrap items-center gap-3">
      {LINKS.map(({ label, href }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} (opens in a new tab)`}
          className="group skeu skeu-press skeu-button no-underline!"
        >
          {label}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </a>
      ))}
    </div>
  );
}
