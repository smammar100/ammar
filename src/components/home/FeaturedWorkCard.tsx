import Link from "next/link";

// Featured work, one project per row on the home page: the 16:9 artwork with
// the disciplines chipped over its bottom-left corner, beside (from lg; above,
// below that) the product, statement, supporting line and KPIs, then the
// buttons: "Visit project" (only when the project sets `liveUrl`) and "Read
// case study". The title's link is stretched over the whole card, so
// anywhere outside the buttons still opens the case study. It lives on the
// title rather than the "Read case study" button because that button sinks
// when pressed (scale), which would shrink the stretched area mid-click.

interface FeaturedWorkCardProps {
  slug: string;
  /** Product name, shown above the statement (as the logo, when there is one). */
  client?: string;
  /** Wordmark shown above the statement, as [src, width, height] at the size it's shown (up to 36px tall). */
  clientLogo?: [string, number, number];
  clientLogoDark?: string;
  title: string;
  subtext?: string;
  kpis?: string[];
  skills?: string[];
  thumbnail?: string;
  thumbnailDark?: string;
  /** Intrinsic [width, height] of the thumbnail. */
  thumbnailSize?: [number, number];
  /** The shipped work, for the "Visit project" button. */
  liveUrl?: string;
  index: number;
}

export function FeaturedWorkCard({
  slug,
  client,
  clientLogo,
  clientLogoDark,
  title,
  subtext,
  kpis,
  skills,
  thumbnail,
  thumbnailDark,
  thumbnailSize,
  liveUrl,
  index,
}: FeaturedWorkCardProps) {
  const href = `/work/${slug}`;
  return (
    // Side by side only from xl, where the copy fits the image's height; the
    // copy column stretches to that height so the logo lines up with the
    // image's top edge and the buttons with its bottom.
    <article className="group relative flex flex-col xl:grid xl:grid-cols-[minmax(0,57fr)_minmax(0,43fr)] xl:items-stretch xl:gap-10">
      {/* Artwork, at the thumbnail's own aspect ratio so nothing is cropped
          (16:9 when its size isn't known); the frame's mat wraps it. */}
      <div className="relative w-full self-start overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-sm">
        <div
          className="relative w-full overflow-hidden rounded-[0.8rem]"
          style={{ aspectRatio: thumbnailSize ? `${thumbnailSize[0]} / ${thumbnailSize[1]}` : "16 / 9" }}
        >
          {thumbnail && (
            <img
              src={thumbnail}
              // WebP thumbnails ship -w640 and -w960 copies, so phones don't
              // fetch the full file. The artwork is about 660px wide beside
              // the copy from xl, and the full column width (up to ~1100px)
              // below it, so the original is in the set too.
              {...(thumbnail.endsWith(".webp")
                ? {
                    srcSet: `${thumbnail.replace(/\.webp$/, "-w640.webp")} 640w, ${thumbnail.replace(/\.webp$/, "-w960.webp")} 960w, ${thumbnail} ${thumbnailSize?.[0] ?? 1600}w`,
                    sizes: "(min-width: 1280px) 660px, calc(100vw - 72px)",
                  }
                : {})}
              alt=""
              width={thumbnailSize?.[0]}
              height={thumbnailSize?.[1]}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : undefined}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${thumbnailDark ? "dark:hidden" : ""}`}
            />
          )}
          {thumbnailDark && (
            <img
              src={thumbnailDark}
              alt=""
              width={thumbnailSize?.[0]}
              height={thumbnailSize?.[1]}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 hidden h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] dark:block"
            />
          )}

          {/* Discipline chips. The product itself is named under the image,
              so it isn't chipped here too. */}
          {skills && skills.length > 0 && (
            <ul className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1" aria-hidden="true">
              {/* Up to three from sm up; one on phones, where a second
                  wraps onto another row over the artwork. */}
              {skills.slice(0, 3).map((skill, i) => (
                <li
                  key={skill}
                  className={`rounded-md bg-neutral-900/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm ${i > 0 ? "hidden sm:block" : ""}`}
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-1 flex-col px-1 pt-6 xl:pt-0">
        {/* Each logo at its own display size, sat on the bottom of one
            fixed-height slot, so logos can be sized to look alike and every
            title starts the same distance down. */}
        {client && clientLogo && (
          <span className="mb-3 flex h-9 items-end xl:mb-2">
            <img
              src={clientLogo[0]}
              alt=""
              width={clientLogo[1]}
              height={clientLogo[2]}
              style={{ height: clientLogo[2] }}
              className={`block w-auto ${clientLogoDark ? "dark:hidden" : ""}`}
            />
            {clientLogoDark && (
              <img
                src={clientLogoDark}
                alt=""
                width={clientLogo[1]}
                height={clientLogo[2]}
                style={{ height: clientLogo[2] }}
                className="hidden w-auto dark:block"
              />
            )}
          </span>
        )}
        {client && !clientLogo && (
          <span className="mb-2 block text-sm font-medium text-muted-foreground">{client}</span>
        )}

        {/* The link's ::after covers the card, and carries the focus ring
            around all of it. */}
        <h3 className="text-balance text-xl font-semibold leading-snug tracking-tight sm:text-2xl xl:text-[22px] xl:leading-[1.2]">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-offset-4 focus-visible:after:ring-offset-background"
          >
            {client && <span className="sr-only">{client}: </span>}
            {title}
          </Link>
        </h3>

        {/* Never clamped: keep `subtext` to about 180 characters so it sits in
            three lines at card width. */}
        {subtext && <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground xl:mt-2 xl:text-[14.5px] xl:leading-normal">{subtext}</p>}

        {kpis && kpis.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5 xl:mt-2.5">
            {kpis.map((kpi) => (
              <li
                key={kpi}
                className="rounded-md border border-border px-2 py-1 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground xl:py-0.5"
              >
                {kpi}
              </li>
            ))}
          </ul>
        )}

        {/* Raised above the stretched title link so the buttons take their
            own clicks (the gaps between them still open the case study).
            On phones a pair shares the row, or stacks full width if it's too
            narrow for both; a lone button keeps its own width. */}
        <div className="pointer-events-none relative z-10 mt-auto flex flex-wrap gap-2 pt-7 sm:gap-2.5 xl:pt-3 xl:[&>a]:h-10 xl:[&>a]:px-4">

          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/visit skeu skeu-press skeu-button pointer-events-auto max-sm:flex-1 max-sm:px-3.5"
            >
              Visit project
              <span className="sr-only">
                {client ? `: ${client}` : ""} (opens in a new tab)
              </span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover/visit:translate-x-0.5 group-hover/visit:-translate-y-0.5"
              >
                ↗
              </span>
            </a>
          )}
          <Link
            href={href}
            className={`group/read skeu skeu-press skeu-button pointer-events-auto ${liveUrl ? "max-sm:flex-1 max-sm:px-3.5" : ""}`}
          >
            Read case study
            {client && <span className="sr-only">: {client}</span>}
            <span aria-hidden="true" className="transition-transform duration-200 group-hover/read:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
