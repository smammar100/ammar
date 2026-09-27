import Link from "next/link";

// Featured work as a card in the home page's two-column grid: the artwork with
// the product and its disciplines chipped over the bottom-left corner, then
// the statement, supporting line and KPIs under it. The whole card is one
// link; the "Read case study" label is part of it rather than a second target.

interface FeaturedWorkCardProps {
  slug: string;
  /** Product name, shown above the statement (as the logo, when there is one). */
  client?: string;
  /** Wordmark shown above the statement, as [src, width, height]. */
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
  index,
}: FeaturedWorkCardProps) {
  return (
    <Link
      href={`/work/${slug}`}
      className="group flex flex-col rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      aria-label={`Read case study: ${client ? `${client}, ` : ""}${title}`}
    >
      {/* Artwork. A fixed 4:3 frame so cards with differently shaped
          thumbnails still line up across the row. */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-sm">
        <div className="relative h-full w-full overflow-hidden rounded-[0.8rem]">
          {thumbnail && (
            <img
              src={thumbnail}
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
      <div className="flex flex-1 flex-col px-1 pt-6">
        {client && clientLogo && (
          <span className="mb-3 block">
            <img
              src={clientLogo[0]}
              alt=""
              width={clientLogo[1]}
              height={clientLogo[2]}
              className={`block h-6 w-auto ${clientLogoDark ? "dark:hidden" : ""}`}
            />
            {clientLogoDark && (
              <img
                src={clientLogoDark}
                alt=""
                width={clientLogo[1]}
                height={clientLogo[2]}
                className="hidden h-6 w-auto dark:block"
              />
            )}
          </span>
        )}
        {client && !clientLogo && (
          <span className="mb-2 block text-sm font-medium text-muted-foreground">{client}</span>
        )}

        <h3 className="text-balance text-xl font-semibold leading-snug tracking-tight sm:text-2xl">{title}</h3>

        {/* Never clamped: keep `subtext` to about 180 characters so it sits in
            three lines at card width. */}
        {subtext && <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{subtext}</p>}

        {kpis && kpis.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {kpis.map((kpi) => (
              <li
                key={kpi}
                className="rounded-md border border-border px-2 py-1 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground"
              >
                {kpi}
              </li>
            ))}
          </ul>
        )}

        {/* Pushed to the bottom so both cards' labels sit on one line. */}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-foreground">
          Read case study
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
