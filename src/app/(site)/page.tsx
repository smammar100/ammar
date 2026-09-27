import Link from "next/link";
import { FeaturedWorkCard } from "@/components/home/FeaturedWorkCard";
import { Curiosity } from "@/components/home/Curiosity";
import { AvailabilityBadge } from "@/components/home/AvailabilityBadge";
import { getCanvasItems } from "@/components/lab/canvas/getCanvasItems";
import { Services } from "@/components/home/Services";
import { HATCH, Intersection, IntersectionRule } from "@/components/layout/Intersection";
import PixelWaveText from "@/components/PixelWaveText";
import { PatternSurfaceClient } from "@/components/lab/PatternSurfaceClient";
import { siteConfig } from "@/data/site-config";
import { getProjects, getWriting } from "@/lib/content";

// Home sections switched off for now. Flip to true to bring them back; the
// routes they link to (/writing, /work/design-engineering-100) are untouched.
const showNowShippingCard = false;
const showWritingSection = false;

const heroHeadline = "Hey, I'm Ammar, a product designer who makes complex products easy to use, and builds them too.";
const heroSupport = "From investment apps to open-source tools, I work across product design, design systems and code.";
const heroCta = "Start a project with me";

const nowShippingPattern = {
  type: "isoline", seed: 211, levels: 9, scale: 340, strokeWidth: 0.9, opacity: 66, color: "copper",
} as const;
const nowShippingLightPattern = {
  ...nowShippingPattern, opacity: 76, strokeWidth: 1.05, color: "bronze",
} as const;
const nowShippingMotion = { mode: "ambient", speed: 20, intensity: 28 } as const;

// The page sits in the same Intersection frame as the case studies: hatched
// margins, and dashed rules between sections that run out into them. Sections
// pad themselves inside the frame's content column; rules sit between them
// unpadded so they can reach the gutters.
const frameSection = "px-6 sm:px-10";
const homeSection = `${frameSection} py-12 sm:py-14`;
const homeSectionHeader = "mb-7 flex items-center justify-between";

/**
 * The hero's call to action, in the site's skeuomorphic button material
 * (styles/global.css, "Skeuomorphic buttons"). There is no contact page, so it
 * opens an email with the subject filled in.
 */
function HeroCta({ className }: { className?: string }) {
  return (
    <a
      href={`mailto:${siteConfig.social.email}?subject=${encodeURIComponent("New project")}`}
      className={`group skeu skeu-press skeu-button ${className ?? ""}`}
    >
      {heroCta}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        ↗
      </span>
    </a>
  );
}

export default function HomePage() {
  const allProjects = getProjects();
  // Featured work on the home page. Everything still lives on /work and at its
  // own URL; this list is just what gets a card here.
  //   design-engineering-100 — has its own dedicated card further down
  //   truewind-rebrand, peerdrop — deliberately not featured on the home page
  const homeExcludedProjects = ["design-engineering-100", "truewind-rebrand", "peerdrop"];
  const featuredProjects = allProjects
    .filter((p) => !homeExcludedProjects.includes(p.slug))
    .sort((a, b) => a.data.sortOrder - b.data.sortOrder);


  const writingPosts = getWriting();

  return (
    <Intersection>
      {/* ── Hero ── */}
      <section className={`${frameSection} pt-14 pb-12 md:pt-20 md:pb-16`}>
        <AvailabilityBadge className="mb-6 md:mb-7" />
        {/* One headline for every width; it wraps to fit rather than
            switching layouts. */}
        <PixelWaveText
          text={heroHeadline}
          by="word"
          as="h1"
          wave="headline"
          className="mb-8 max-w-3xl text-[1.85rem] font-medium leading-[1.12] tracking-tight md:mb-9 md:text-[2.4rem] md:leading-[1.15] lg:text-[2.75rem]"
        />
        <HeroCta />
      </section>

      {/* ── Caption band ── */}
      <IntersectionRule />
      {/* Handwritten, like the reference's italic caption band. Caveat is
          already loaded site-wide (the case-study notes use it). */}
      <p className={`${frameSection} font-hand py-5 text-[1.35rem] leading-snug text-muted-foreground sm:text-2xl`}>{heroSupport}</p>
      <IntersectionRule />

      {/* ── Work ── */}
      <section className={`${frameSection} py-10 sm:py-12`} aria-label="Selected work">
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2">
          {featuredProjects.slice(0, 4).map((project, i) => (
            <FeaturedWorkCard
              key={project.slug}
              slug={project.slug}
              client={project.data.client}
              clientLogo={project.data.clientLogo}
              clientLogoDark={project.data.clientLogoDark}
              title={project.data.statement ?? project.data.title}
              subtext={project.data.subtext}
              kpis={project.data.kpis}
              skills={project.data.tags ?? project.data.skills}
              thumbnail={project.data.thumbnailWide ?? project.data.thumbnail}
              thumbnailDark={project.data.thumbnailWideDark ?? project.data.thumbnailDark}
              thumbnailSize={project.data.thumbnailWide ? project.data.thumbnailWideSize : undefined}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <IntersectionRule />
      <Services padding={frameSection} />

      {/* ── Break: a band of the frame's margin hatch between the services
          and the wall, so the wall doesn't butt straight onto the cells. ── */}
      <IntersectionRule />
      <div aria-hidden="true" className={`h-16 sm:h-20 ${HATCH}`} />

      {/* ── Curiosity: a window onto the Lab's wall ── */}
      <IntersectionRule />
      <Curiosity items={getCanvasItems()} />

      {/* ── Writing ── */}
      {showWritingSection && (
      <>
      <IntersectionRule />
      <section className={homeSection}>
        <div className={homeSectionHeader}>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Writing</p>
          <Link href="/writing" className="text-xs text-muted-foreground transition-colors hover:text-foreground">View all →</Link>
        </div>
        <div className={showNowShippingCard ? "grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6" : undefined}>
          {showNowShippingCard && (
          <div>
            <Link href="/work/design-engineering-100" className="group block h-full" aria-label="The 100: design-engineering projects shipped in public">
              <article className="h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:shadow-black/5 dark:group-hover:shadow-black/20">
                <div className="relative h-full min-h-[260px] w-full overflow-hidden bg-card">
                  <PatternSurfaceClient
                    name="design-engineering-100"
                    config={nowShippingPattern}
                    lightConfig={nowShippingLightPattern}
                    motion={nowShippingMotion}
                    duration={2800}
                    className="absolute inset-0 opacity-95 transition-all duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171716]/92 via-[#171716]/12 to-transparent opacity-0 dark:opacity-100" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/68 via-background/0 to-transparent dark:hidden" />
                  <div className="pointer-events-none absolute bottom-6 left-6 right-6">
                    <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#b38b6d] dark:text-[#f7ccab]">Now shipping</p>
                    <p className="text-2xl font-medium leading-none tracking-tight text-foreground dark:text-[#ede9e3]">The 100</p>
                    <p className="mt-2 text-sm leading-snug text-muted-foreground dark:text-[#ede9e3]/70">100 design-engineering projects, built and shipped in public: a run to #1 Top Author on 21st.dev, ThumbGen, and counting.</p>
                  </div>
                </div>
              </article>
            </Link>
          </div>
          )}
          <div>
            <div className="flex flex-col divide-y divide-border">
              {writingPosts.slice(0, 6).map((post) => (
                <Link key={post.slug} href={`/writing/${post.slug}`} className="group flex items-baseline justify-between gap-4 py-3 text-sm transition-colors hover:text-accent">
                  <span className="font-medium leading-snug">{post.data.title}</span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {post.data.publishedDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      </>
      )}

    </Intersection>
  );
}
