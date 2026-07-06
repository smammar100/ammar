import { cn } from "@/lib/utils";

interface Metric {
  label: string;
  before: number;
  after: number;
}

// Lighthouse scores from the rebuild. Defaults match the case study; overridable
// via props if the numbers move.
const DEFAULT_METRICS: Metric[] = [
  { label: "Performance", before: 57, after: 100 },
  { label: "Accessibility", before: 91, after: 100 },
  { label: "Best Practices", before: 73, after: 96 },
  { label: "SEO", before: 100, after: 100 },
];

function scoreTone(score: number) {
  if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

interface LighthouseCompareProps {
  metrics?: Metric[];
  /** The headline metric to blow up at the top (defaults to Performance). */
  highlight?: string;
}

// Branded before/after Lighthouse visual: a large hero delta for the headline
// metric plus a compact row list for the rest. Pure CSS/flex — renders under
// MDXRemote/rsc with no client JS.
export function LighthouseCompare({ metrics = DEFAULT_METRICS, highlight = "Performance" }: LighthouseCompareProps) {
  const hero = metrics.find((m) => m.label === highlight) ?? metrics[0];

  return (
    <figure className="case-figure my-8">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Hero delta */}
        <div className="flex flex-col items-center gap-2 border-b border-border px-6 py-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Lighthouse {hero.label}
          </p>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <span className={cn("text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl", scoreTone(hero.before))}>
              {hero.before}
            </span>
            <svg aria-hidden="true" className="h-6 w-6 shrink-0 text-muted-foreground sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            <span className={cn("text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl", scoreTone(hero.after))}>
              {hero.after}
            </span>
          </div>
        </div>

        {/* Per-metric rows */}
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <span className="text-sm font-medium text-foreground">{m.label}</span>
              <span className="flex items-center gap-2 font-mono text-sm tabular-nums">
                <span className={cn("text-muted-foreground", scoreTone(m.before))}>{m.before}</span>
                <span className="text-muted-foreground/50">&rarr;</span>
                <span className={cn("font-semibold", scoreTone(m.after))}>{m.after}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        Lighthouse scores, before and after the rebuild.
      </figcaption>
    </figure>
  );
}

export default LighthouseCompare;
