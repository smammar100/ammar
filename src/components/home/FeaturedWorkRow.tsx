import Link from "next/link";

// Featured work as a full-width row: the product name opens the sentence in
// muted type, the case-study title finishes it in foreground, and the artwork
// sits alongside. One project per row, separated by hairline rules.

interface FeaturedWorkRowProps {
  slug: string;
  /** Muted opening of the sentence, e.g. "Mahaana". Falls back to the title alone. */
  client?: string;
  title: string;
  subtext?: string;
  kpis?: string[];
  thumbnail?: string;
  thumbnailDark?: string;
  index: number;
}

export function FeaturedWorkRow({ slug, client, title, subtext, kpis, thumbnail, thumbnailDark, index }: FeaturedWorkRowProps) {
  const href = `/work/${slug}`;

  return (
    <article className="group border-t border-border py-10 first:border-t-0 first:pt-0 lg:py-14">
      {/* Top-aligned: the sentence starts level with the top of the artwork. */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        {/* Sentence, support, KPIs, call to action */}
        <div className="flex flex-col lg:w-2/5">
          <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            {client && <span className="text-muted-foreground">{client}. </span>}
            <span className="text-foreground">{title}</span>
          </h3>

          {subtext && (
            <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">{subtext}</p>
          )}

          {kpis && kpis.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {kpis.map((kpi) => (
                <li
                  key={kpi}
                  className="rounded-md border border-border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
                >
                  {kpi}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <Link
              href={href}
              className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 focus-visible:border-foreground/40 focus-visible:outline-none"
              aria-label={`View project: ${client ? `${client}, ` : ""}${title}`}
            >
              View project
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Artwork */}
        <Link href={href} tabIndex={-1} aria-hidden="true" className="block lg:w-3/5">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {thumbnail ? (
              <>
                <img
                  src={thumbnail}
                  alt=""
                  loading={index === 0 ? "eager" : "lazy"}
                  className={`aspect-video w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] ${thumbnailDark ? "dark:hidden" : ""}`}
                />
                {thumbnailDark && (
                  <img
                    src={thumbnailDark}
                    alt=""
                    loading={index === 0 ? "eager" : "lazy"}
                    className="hidden aspect-video w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] dark:block"
                  />
                )}
              </>
            ) : (
              <div className="aspect-video w-full" />
            )}
          </div>
        </Link>
      </div>
    </article>
  );
}
