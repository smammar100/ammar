// Mahaana case-study graphics. Zero-prop presets, same as the other
// case-study components — next-mdx-remote doesn't reliably pass array/object
// expression props through MDX (see Mdx.tsx).

/** The product wall, composed in Figma and exported as one piece. */
export function MahaanaScreenWall() {
  return (
    <figure className="case-figure my-10">
      {/* No negative-margin breakout: the article sits inside the Intersection
          frame now, and pulling wider would push the image through the vertical
          rules into the hatched margin. */}
      <div className="overflow-hidden rounded-xl bg-[#FAFAFA]">
        <img
          src="/images/projects/mahaana-wealth/screen-wall.png"
          alt="Ten Mahaana screens: AI financial guidance over a sector heatmap, the portfolio dashboard at PKR 124,235, an FPJM order detail, a savings-pot promo, the risk level selector, the Mahaana X IGI life insurance plan, the investment account picker, onboarding, explore market, and pending orders"
          width={2248}
          height={1742}
          className="block w-full"
        />
      </div>
    </figure>
  );
}

/** The component inventory every product journey is assembled from. */
export function MahaanaFoundations() {
  return (
    <figure className="case-figure my-10">
      {/* The export has no bleed, so it gets inset padding instead of being
          clipped: a rounded container with overflow-hidden would slice the
          corner content off. The wall image carries 40px of its own, so it
          doesn't need this. */}
      <div className="rounded-xl bg-[#FAFAFA] p-3 sm:p-5">
        <img
          src="/images/projects/mahaana-wealth/atomic-system.png"
          alt="Mahaana component inventory: index, gainer and loser list rows, a sector heatmap, investment comparison bars, the portfolio dashboard header and chart, an order card, editorial content cards, and the Save+, Retirement, Gold and Trade product cards"
          width={1166}
          height={908}
          className="block w-full"
        />
      </div>
      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        List rows, cards, charts and product tiles, shared across every journey in the app.
      </figcaption>
    </figure>
  );
}

/**
 * Outcomes. Every figure here is one Mahaana publishes or that sits on the
 * public App Store listing. No modelled or projected numbers.
 */
const STATS = [
  { value: "50K+", label: "Registered users" },
  { value: "20K+", label: "Active clients" },
  { value: "10K+", label: "App downloads" },
  { value: "4.8★", label: "iOS App Store rating" },
  { value: "<10 min", label: "Account onboarding" },
  { value: "+20%", label: "Conversion on the investment calculator" },
];

export function MahaanaImpact() {
  return (
    <figure className="case-figure my-10">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 bg-card px-5 py-6">
            <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
              {stat.value}
            </span>
            <span className="text-sm leading-snug text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
