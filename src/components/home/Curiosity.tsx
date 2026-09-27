import Link from "next/link";
import { LabCard } from "@/components/lab/LabCard";
import { HATCH, IntersectionRule } from "@/components/layout/Intersection";

// Side projects, after the services: a large centred heading on the
// margin hatch, then the Lab experiments as a row of cards that scrolls
// sideways. The row runs edge to edge in the frame and fades at both ends so
// it reads as continuing past them.

interface Entry {
  slug: string;
  title: string;
  description: string;
  preview: string;
}

export function Curiosity({ entries, padding }: { entries: Entry[]; padding: string }) {
  return (
    <section aria-labelledby="curiosity-heading">
      <div className={`relative ${padding} py-16 sm:py-20`}>
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${HATCH}`} />
        {/* Centred, with the Lab link under the heading, like the services
            heading above it. */}
        <div className="relative flex flex-col items-center gap-5 text-center">
          <h2
            id="curiosity-heading"
            className="max-w-md text-balance text-3xl font-medium leading-tight tracking-tight sm:text-5xl sm:leading-[1.08]"
          >
            Pushing my limits through curiosity
          </h2>
          <Link
            href="/lab"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:underline"
          >
            Explore the Lab
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>

      <IntersectionRule />

      {/* Sideways row. Snap keeps a card's edge aligned after a swipe; the
          side padding matches the frame so the first card lines up with the
          heading above it. */}
      <div className="no-scrollbar mask-x-from-92% overflow-x-auto overscroll-x-contain">
        <ul className={`flex w-max snap-x snap-mandatory gap-4 ${padding} py-8 sm:py-10`}>
          {entries.map((entry) => (
            <li key={entry.slug} className="w-[280px] shrink-0 snap-start scroll-ml-6 sm:w-[320px] sm:scroll-ml-10">
              <LabCard
                title={entry.title}
                description={entry.description}
                href={`/lab/${entry.slug}`}
                preview={entry.preview}
                headingLevel="h3"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
