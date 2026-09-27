import { Megaphone, Scale, Shapes, Star, type LucideIcon } from "lucide-react";

// Iconimate case-study graphics that aren't live icons: the outcomes grid, the
// DEV Community post, and the closing links. Zero-prop presets like the other case-study components
// (next-mdx-remote doesn't reliably pass array/object props, see Mdx.tsx).

/** DEV's own logo (the "DEV" badge), from Simple Icons (CC0), cropped to the badge. */
function DevLogo({ className = "h-9 w-auto sm:h-10", label = "DEV.to" }: { className?: string; label?: string }) {
  return (
    <svg role="img" aria-label={label} viewBox="0 4.94 24 14.12" fill="currentColor" className={className}>
      <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
    </svg>
  );
}

/**
 * Outcomes, in the same 2×2 grid as Mahaana's. Public figures only, as of
 * September 2026: the icon count on iconimate.app, the GitHub star count, the
 * licence, and the DEV.to feature.
 */
const STATS: { value: string; label: string; Icon: LucideIcon; tint: string; logo?: typeof DevLogo }[] = [
  { value: "216", label: "Animated icons", Icon: Shapes, tint: "text-violet-500/30 dark:text-violet-400/30" },
  { value: "45", label: "GitHub stars", Icon: Star, tint: "text-amber-500/35 dark:text-amber-400/30" },
  { value: "MIT", label: "Open-source licence", Icon: Scale, tint: "text-sky-500/30 dark:text-sky-400/30" },
  { value: "DEV.to", label: "Featured on its social media", Icon: Megaphone, tint: "text-emerald-500/30 dark:text-emerald-400/30", logo: DevLogo },
];

export function IconimateImpact() {
  return (
    <figure className="case-figure my-10">
      {/* The gap-px over bg-border trick draws the dividers, so STATS must stay
          an even count (an empty cell shows as a slab of border colour). */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {STATS.map(({ value, label, Icon, tint, logo: Logo }) => (
          <div key={label} className="relative flex flex-col overflow-clip bg-card px-4 py-5 sm:px-5 sm:py-6">
            <Icon
              aria-hidden="true"
              strokeWidth={1.25}
              className={`pointer-events-none absolute -right-4 -bottom-7 h-20 w-20 sm:-right-5 sm:-bottom-6 sm:h-32 sm:w-32 ${tint}`}
            />
            {/* A logo, where the figure is a brand, sits on the same line box as
                the numbers so the labels line up across the row. */}
            <span className="relative flex h-9 items-center text-3xl font-semibold tabular-nums tracking-tight text-foreground sm:h-10 sm:text-4xl">
              {Logo ? <Logo /> : value}
            </span>
            <span className="relative mt-1 pr-8 text-sm leading-snug text-muted-foreground sm:pr-0">{label}</span>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-center text-sm text-muted-foreground">Figures as of September 2026.</figcaption>
    </figure>
  );
}

/**
 * DEV Community's post about Iconimate on X, as a link card in the same form
 * as Mahaana's Dawn article card, rather than X's embed script (heavy, and it
 * tracks readers). The words are the post's own, from X's public syndication
 * data; the thumbnail is the post's cover image, served by X.
 */
const POST = {
  url: "https://x.com/ThePracticalDev/status/2087457310083862910",
  date: "12 August 2026",
  image: "https://pbs.twimg.com/card_img/2102925540504088576/n53Pkg0S?format=jpg&name=800x419",
};

export function IconimateDevPost() {
  return (
    <figure className="case-figure not-prose my-10">
      <a
        href={POST.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col gap-5 rounded-xl no-underline! border border-border bg-card p-5 transition-colors sm:flex-row sm:items-stretch hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6"
      >
        <span className="flex min-w-0 flex-1 flex-col justify-center">
          <span className="flex items-center gap-3 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <DevLogo className="h-4 w-auto shrink-0 text-foreground" label="DEV Community" />
            <span aria-hidden>·</span>
            {POST.date}
          </span>
          {/* DEV's words, so they're quoted. */}
          <span className="mt-2 block text-lg leading-snug text-foreground">
            “Most animated icon sets are drawn on their own grid, so they look almost right beside your existing
            icons.”
          </span>
          <span className="mt-2 block text-sm text-muted-foreground">
            This dev&apos;s open source React library sits on the Phosphor 256 grid instead, with Motion running
            underneath.
          </span>
          <span className="mt-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
            View the post on x.com
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </span>
        </span>
        {/* The thumbnail runs the card's full height from sm up, cropped around
            the page's headline; on phones it keeps the cover's own shape. */}
        <span className="relative block aspect-[800/419] shrink-0 overflow-hidden rounded-lg border border-border bg-white sm:aspect-auto sm:min-h-44 sm:w-72">
          <img
            src={POST.image}
            alt="The Iconimate website, as the post's cover: “Every motion has a reason, nothing moves without meaning”, above a grid of icons."
            width={800}
            height={419}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            // The unlayered `.prose img` rule adds margins and a border.
            className="absolute inset-0 m-0! block size-full rounded-none! border-0! object-cover object-[50%_18%] transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        </span>
      </a>
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
