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
      <div className="overflow-hidden rounded-xl border border-border bg-[#FAFAFA]">
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

/** The FigJam journey map from usability testing the staging onboarding. */
export function MahaanaJourneyMap() {
  return (
    <figure className="case-figure my-10">
      {/* A screenshot of the board, not an export: the curve, stage names and
          sticky note carry at article width, the per-stage notes do not. A
          2x export from FigJam would make those legible. */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <img
          src="/images/projects/mahaana-wealth/onboarding-journey-map.png"
          alt="Onboarding journey map from usability testing on the staging app. An emotion curve runs across seven stages - splash, sign-up and login, welcome, account selection, playground, risk profile and additional screens - dipping to its lowest at the playground screen. Screenshots of each stage sit below, and a sticky note sums up: the process felt quite lengthy, bugs made it longer, the look and feel is good, and most of it was easy apart from a few screens. Average UX score: 78."
          width={1852}
          height={847}
          loading="lazy"
          decoding="async"
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
      {/* Clipped flush like the wall image: the export's outer 24px is flat
          background on all four corners, so the rounded clip takes nothing but
          empty margin. That canvas is #F3F1EE, the light --card, so the white
          components sit on the same ground as the other case-study panels -
          re-export on that colour. The phone images can't follow: their grey
          screens (#F2F2F0) would disappear into it. */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <img
          src="/images/projects/mahaana-wealth/atomic-system.png"
          alt="Mahaana component inventory: index, gainer and loser list rows, a sector heatmap, investment comparison bars, the portfolio dashboard header and chart, an order card, editorial content cards, and the Save+, Retirement, Gold and Trade product cards"
          width={1166}
          height={908}
          className="block w-full"
        />
      </div>
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
  { value: "<10 min", label: "Account onboarding" },
  { value: "+20%", label: "Conversion on the investment calculator" },
];

export function MahaanaImpact() {
  return (
    <figure className="case-figure my-10">
      {/* Wrapping flex rather than a fixed grid. The gap-px over bg-border trick
          draws the dividers, which means any row the tiles do not fill exactly
          shows as a slab of border colour rather than as empty space. Letting the
          last row grow to fill the width keeps that from happening at any number
          of stats, on either breakpoint. */}
      <div className="flex flex-wrap gap-px overflow-hidden rounded-xl border border-border bg-border">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-1 basis-[calc(50%-1px)] flex-col gap-1 bg-card px-5 py-6 sm:basis-[calc(33.333%-1px)]"
          >
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

const MARK =
  "fill-none stroke-[#007AFF] stroke-[4px] [stroke-linecap:round] dark:stroke-[#4da3ff]";

/**
 * Whiteboard sketch: the things people said when asked what Mahaana was.
 *
 * Real <text>, not traced outlines, so the words stay correct, selectable and
 * searchable, and the copy can be edited without redrawing anything. The face and
 * the underlines are hand-drawn paths - the circle closes past its own start,
 * because a mechanically perfect one reads as a diagram rather than as something
 * a person drew.
 *
 * The board is deliberately wide and short. Six quotes stacked around a centred
 * face wants to grow downward, and a tall figure eats the page; pushing the side
 * quotes out horizontally instead keeps the rendered height down.
 *
 * Each quote and its underline share a rotated <g>, so the underline is expressed
 * in the quote's own coordinate space and stays welded to the words at any angle.
 * Underline paths are measured off the rendered tspans, never eyeballed: read each
 * [data-mark] tspan's getBBox(), take the baseline as bbox top + 36 at this font
 * size, and run the stroke from (x - 2, baseline + 8) to (x + width + 3,
 * baseline + 5). Re-measure whenever the wording changes length.
 */
const QUOTES = [
  { x: 660, y: 66, rot: -1.5, lines: [["Is this like a ", "bank account", "?"]], underline: "M 650 74 C 702.8 79, 755.6 80, 790.8 77 C 804.9 76, 817.2 74, 831 71" },
  { x: 205, y: 180, rot: -13, lines: [["But is it ", "halal", "?"]], underline: "M 222 188 C 242.7 193, 263.4 194, 277.2 191 C 282.7 190, 287.6 188, 296 185" },
  {
    x: 1105, y: 160, rot: 7,
    lines: [["Don't I need ", "lakhs", ""], ["to start?", "", ""]],
    underline: "M 1159 168 C 1180.6 173, 1202.2 174, 1216.6 171 C 1222.4 170, 1227.4 168, 1236 165",
  },
  {
    x: 195, y: 430, rot: 11,
    lines: [["Can I ", "get it out", ""], ["when I need it?", "", ""]],
    underline: "M 182 438 C 218 443, 254 444, 278 441 C 287.6 440, 296 438, 307 435",
  },
  {
    x: 1100, y: 420, rot: -8,
    lines: [["The last app I tried,", "", ""], ["I ", "gave up halfway", "."]],
    underline: "M 1001 474 C 1062.5 479, 1124 480, 1165 477 C 1181.4 476, 1195.8 474, 1211 471",
  },
  {
    x: 660, y: 545, rot: 1,
    lines: [["Where does my money ", "actually go", "?"]],
    underline: "M 728 553 C 769.1 558, 810.2 559, 837.6 556 C 848.6 555, 858.2 553, 870 550",
  },
];

const MARK_STROKE =
  "fill-none stroke-[#007AFF] stroke-[4px] [stroke-linecap:round] dark:stroke-[#4da3ff]";

export function MahaanaVoices() {
  return (
    <figure className="case-figure my-10">
      {/* Scrolls rather than shrinks: squeezed into a phone width the whole board
          lands at illegible handwriting, and the quotes are the content here, not
          decoration. */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card px-4 py-5 sm:px-8 sm:py-6">
        <svg
          viewBox="0 0 1320 600"
          className="block h-auto w-full min-w-[660px] text-foreground"
          fill="none"
          role="img"
          aria-label={
            "A whiteboard sketch of an unconvinced face surrounded by six handwritten quotes: " +
            "'Is this like a bank account?', 'But is it halal?', 'Don't I need lakhs to start?', " +
            "'Can I get it out when I need it?', 'The last app I tried, I gave up halfway.' and " +
            "'Where does my money actually go?'"
          }
        >
          {/* Face. One marker stroke, overshooting where it closes. */}
          <g stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 656 213 C 706 210, 749 252, 748 302 C 747 352, 707 390, 658 389 C 609 388, 572 350, 572 300 C 572 250, 608 215, 663 214" />
            {/* Brows up at the inner edge, mouth wavering: unconvinced, not unhappy. */}
            <path d="M 618 262 C 625 256, 636 256, 643 261" />
            <path d="M 677 261 C 684 256, 695 256, 702 262" />
            <path d="M 622 351 C 637 343, 651 356, 665 348 C 676 342, 686 348, 696 345" />
          </g>
          <g fill="currentColor">
            <ellipse cx="632" cy="283" rx="6.5" ry="9.5" />
            <ellipse cx="688" cy="283" rx="6.5" ry="9.5" />
          </g>

          {/* Quotes, each at its own angle - notes written around a drawing that was
              already on the board, rather than laid out on a grid. */}
          <g
            style={{ fontFamily: "var(--font-hand)", fontSize: "38px" }}
            fill="currentColor"
            textAnchor="middle"
          >
            {QUOTES.map((q) => (
              <g key={q.x + ":" + q.y} transform={`rotate(${q.rot} ${q.x} ${q.y})`}>
                <text x={q.x} y={q.y}>
                  {q.lines.map(([before, mark, after], i) => (
                    <tspan key={i} x={q.x} dy={i === 0 ? 0 : 46}>
                      {i === 0 ? "\u201C" : ""}
                      {before}
                      {mark ? <tspan data-mark>{mark}</tspan> : null}
                      {after}
                      {i === q.lines.length - 1 ? "\u201D" : ""}
                    </tspan>
                  ))}
                </text>
                {q.underline ? <path className={MARK_STROKE} d={q.underline} /> : null}
              </g>
            ))}
          </g>
        </svg>
      </div>
    </figure>
  );
}
