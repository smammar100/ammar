import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import PixelWaveText from "@/components/PixelWaveText";
import { LabCard } from "@/components/lab/LabCard";
import { PatternSurfaceClient } from "@/components/lab/PatternSurfaceClient";
import { UAMark } from "@/lab/editorial-art/UAMark";
import { BuilderPhoto } from "@/components/home/BuilderPhoto";
import { siteConfig } from "@/data/site-config";
import { commendations } from "@/data/commendations";
import { communityPhotos, communityStory, featuredCommunityCommendations } from "@/data/community";
import { getProjects, getLab, getWriting } from "@/lib/content";

const preferredLabOrder = ["pattern-engine", "pixel-wave", "pixel-mark"];

const featuredProjectDescriptions: Record<string, string> = {
  "query-language": "Guided enterprise users through a powerful graph query language without flattening the product.",
  expansion: "Extended a security platform into new use cases through a modular systems approach.",
  vision: "Led strategic product vision work through facilitation, synthesis, and storytelling.",
};

const heroHeadline = "Patrick is a designer who builds.";
const heroIntro = "I've been a strategist, developer, designer, and writer — sometimes all at once.";
const heroIntroDetail = "The through line is my compulsion to turn ideas into useful, well-crafted things.";
const heroCurrentWorkLead = "Right now, I'm designing AI tools at";
const heroCurrentWorkTail = "and building my own software with agents.";

const newsletterPattern = {
  type: "isoline", seed: 211, levels: 9, scale: 340, strokeWidth: 0.9, opacity: 66, color: "copper",
} as const;
const newsletterLightPattern = {
  ...newsletterPattern, opacity: 76, strokeWidth: 1.05, color: "bronze",
} as const;
const newsletterMotion = { mode: "ambient", speed: 20, intensity: 28 } as const;

const homeShell = "mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-14";
const homeSection = `${homeShell} py-12 sm:py-14 lg:py-16`;
const homeFirstSection = `${homeShell} pt-5 pb-12 sm:pt-10 sm:pb-14 lg:pt-10 lg:pb-16`;
const homeSectionHeader = "mb-7 flex items-center justify-between";
const homeCardGrid = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6";

export default function HomePage() {
  const allProjects = getProjects();
  const professionalProjects = allProjects
    .filter((p) => p.data.type === "professional")
    .sort((a, b) => a.data.sortOrder - b.data.sortOrder);

  const labEntries = getLab().sort((a, b) => {
    const ai = preferredLabOrder.indexOf(a.data.slug);
    const bi = preferredLabOrder.indexOf(b.data.slug);
    if (ai !== -1 || bi !== -1) {
      return (ai === -1 ? Number.MAX_SAFE_INTEGER : ai) - (bi === -1 ? Number.MAX_SAFE_INTEGER : bi);
    }
    return a.data.title.localeCompare(b.data.title);
  });

  const writingPosts = getWriting();

  const communityCommendations = featuredCommunityCommendations
    .map((name) => commendations.find((c) => c.name === name))
    .filter(Boolean);

  const homeCommunityPhotos = [
    { ...communityPhotos[0], className: "rotate-[-2deg]", position: "object-[8%_50%]" },
    { ...communityPhotos[3], className: "rotate-[2deg]", position: "object-[42%_50%]" },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className={`${homeShell} pt-0 pb-4 sm:pb-10 md:pt-16 lg:pt-16 lg:pb-14`}>
        {/* Mobile */}
        <div className="hero-mobile md:hidden">
          <div className="hero-mobile-photo-field mb-8">
            <div className="hero-mobile-photo inline-block rotate-2 bg-white p-2 pb-5 shadow-xl shadow-black/15 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] dark:bg-[#20201e] dark:shadow-black/40">
              <div className="h-36 w-36 overflow-hidden">
                <img src="/images/brand/profile-living-room-avatar.jpg" alt="Patrick Morgan" className="block h-full w-full object-cover" />
              </div>
            </div>
          </div>
          <PixelWaveText text={heroHeadline} as="h1" wave="hero" className="mb-7 max-w-[20rem] text-[2.05rem] font-medium leading-[1.08] tracking-tight" />
          <div className="mb-4 space-y-3 text-[15px] leading-relaxed">
            <p className="text-foreground/80">{heroIntro}</p>
            <p className="text-muted-foreground">{heroCurrentWorkLead} <a href="https://sublime.security" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:text-accent">Sublime Security</a>, writing my newsletter <a href={siteConfig.social.newsletter} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:text-accent">Unknown Arts</a>, {heroCurrentWorkTail}</p>
          </div>
        </div>

        {/* Desktop */}
        <div className="hero-desktop hidden md:flex md:items-center md:gap-10 lg:gap-14">
          <div className="flex-1 min-w-0">
            <PixelWaveText text={heroHeadline} as="h1" wave="headline" className="mb-8 text-4xl font-medium leading-[1.2] tracking-tight lg:text-[2.6rem] xl:text-5xl" />
            <div className="max-w-xl space-y-4 text-base leading-relaxed xl:max-w-2xl">
              <p className="text-foreground/80">{heroIntro} {heroIntroDetail}</p>
              <p className="text-muted-foreground">{heroCurrentWorkLead} <a href="https://sublime.security" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 transition-colors hover:text-accent">Sublime Security</a>, writing my newsletter <a href={siteConfig.social.newsletter} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 transition-colors hover:text-accent">Unknown Arts</a>, {heroCurrentWorkTail}</p>
            </div>
          </div>
          <BuilderPhoto />
        </div>
      </section>

      {/* ── Work ── */}
      <section className={homeFirstSection}>
        <div className={homeSectionHeader}>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Work</p>
          <Link href="/work" className="text-xs text-muted-foreground transition-colors hover:text-foreground">View all →</Link>
        </div>
        <div className={homeCardGrid}>
          {professionalProjects.slice(0, 3).map((project, i) => (
            <div key={project.slug}>
              <ProjectCard
                title={project.data.title}
                description={featuredProjectDescriptions[project.slug] ?? project.data.description}
                skills={project.data.skills}
                thumbnail={project.data.thumbnail}
                thumbnailDark={project.data.thumbnailDark}
                thumbnailWide={project.data.thumbnailWide}
                thumbnailWideDark={project.data.thumbnailWideDark}
                slug={project.slug}
                index={i}
                variant="compact"
                squareDesktop
                showDescription
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Lab ── */}
      <section className={homeSection}>
        <div className={homeSectionHeader}>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Lab</p>
          <Link href="/lab" className="text-xs text-muted-foreground transition-colors hover:text-foreground">View all →</Link>
        </div>
        <div className={homeCardGrid}>
          {labEntries.slice(0, 3).map((entry) => (
            <div key={entry.data.slug} className="flex">
              <LabCard title={entry.data.title} description={entry.data.description} href={`/lab/${entry.data.slug}`} preview={entry.data.preview} headingLevel="h3" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Writing ── */}
      <section className={homeSection}>
        <div className={homeSectionHeader}>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Writing</p>
          <Link href="/writing" className="text-xs text-muted-foreground transition-colors hover:text-foreground">View all →</Link>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6">
          <div>
            <a href={siteConfig.social.newsletter} target="_blank" rel="noopener noreferrer" className="group block h-full" aria-label="Unknown Arts newsletter">
              <article className="h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:shadow-black/5 dark:group-hover:shadow-black/20">
                <div className="relative h-full min-h-[260px] w-full overflow-hidden bg-card">
                  <PatternSurfaceClient
                    name="unknown-arts-newsletter"
                    config={newsletterPattern}
                    lightConfig={newsletterLightPattern}
                    motion={newsletterMotion}
                    duration={2800}
                    className="absolute inset-0 opacity-95 transition-all duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171716]/92 via-[#171716]/12 to-transparent opacity-0 dark:opacity-100" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/68 via-background/0 to-transparent dark:hidden" />
                  <div className="pointer-events-none absolute bottom-6 left-6 right-6">
                    <div className="mb-3 text-[#b38b6d] dark:text-[#f7ccab]">
                      <UAMark color="currentColor" height={24} />
                    </div>
                    <p className="text-2xl font-medium leading-none tracking-tight text-foreground dark:text-[#ede9e3]">Unknown Arts</p>
                    <p className="mt-2 text-sm leading-snug text-muted-foreground dark:text-[#ede9e3]/70">The newsletter for creative builders in the age of AI. 7,500+ subscribers.</p>
                  </div>
                </div>
              </article>
            </a>
          </div>
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

      {/* ── Community ── */}
      <section className={`${homeSection} pb-20 sm:pb-24 lg:pb-28`}>
        <div className={homeSectionHeader}>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Community</p>
          <Link href="/community" className="text-xs text-muted-foreground transition-colors hover:text-foreground">View all →</Link>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6">
          <div className="flex flex-col justify-center">
            <p className="max-w-md text-xl font-semibold leading-snug tracking-tight">{communityStory.heading}</p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">I stay active in creative communities through Unknown Arts, local gatherings, and showing up for the people building thoughtful work.</p>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {homeCommunityPhotos.map((photo, i) => (
                <figure key={i} className={`bg-white p-2 pb-7 shadow-xl shadow-black/15 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] dark:bg-[#20201e] dark:shadow-black/40 ${photo.className}`}>
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img src={photo.src} alt={photo.alt} loading="lazy" className={`block h-full w-full object-cover ${photo.position}`} />
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {communityCommendations.map((c) =>
            c ? (
              <blockquote key={c.name} className="mb-4 break-inside-avoid rounded-lg p-5 texture-bg">
                <p className="mb-4 font-mono text-[13px] leading-relaxed text-foreground">{c.quote}</p>
                <footer className="flex items-center gap-3">
                  <img src={c.image} alt={c.name} className="h-8 w-8 shrink-0 rounded-full object-cover" loading="lazy" />
                  <div>
                    <p className="text-sm font-medium leading-tight">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.role}</p>
                  </div>
                </footer>
              </blockquote>
            ) : null,
          )}
        </div>
      </section>

      {/* ── Closing ── */}
      <section className={`${homeShell} pb-20 pt-2 text-center sm:pb-24 lg:pb-28`}>
        <PixelWaveText text="Let's craft a better future, together." as="p" wave="cta" className="text-3xl font-medium tracking-tight sm:text-4xl" />
      </section>

      <style>{`
        .hero-mobile { position: relative; isolation: isolate; }
        .hero-mobile::before {
          content: ""; position: absolute; width: calc(100% + 3rem); height: 15.5rem;
          left: -1.5rem; top: -0.75rem; z-index: 0;
          background-image: radial-gradient(currentColor 1px, transparent 1.5px);
          background-size: 14px 14px; color: var(--foreground); opacity: 0.095;
          mask-image: linear-gradient(to bottom, black 0%, black 30%, transparent 88%);
        }
        .hero-mobile > * { position: relative; z-index: 1; }
        .hero-mobile-photo-field { position: relative; min-height: 12rem; padding-top: 2.25rem; }
        .hero-mobile-photo { position: relative; z-index: 1; }
        html.dark .hero-mobile::before { opacity: 0.1; }
        .hero-desktop { position: relative; isolation: isolate; }
        .hero-desktop > * { position: relative; z-index: 1; }
        .hero-desktop::before { content: ""; display: none; }
        @media (min-width: 48rem) {
          .hero-desktop::before {
            position: absolute; display: block; width: min(34rem, 40vw); height: 26rem;
            left: 80%; top: 53%; z-index: 0; transform: translate(-50%, -50%) rotate(1deg);
            background-image: radial-gradient(currentColor 1px, transparent 1.5px);
            background-size: 14px 14px; color: var(--foreground); opacity: 0.105;
            mask-image: radial-gradient(ellipse at 55% 54%, black 0%, black 52%, transparent 82%);
          }
        }
        html.dark .hero-desktop::before { opacity: 0.11; }
        .builder-grid {
          background-image:
            linear-gradient(rgba(244, 238, 231, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(244, 238, 231, 0.08) 1px, transparent 1px);
          background-size: 14px 14px;
        }
        .builder-scanlines {
          background-image: repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 4px);
          background-size: 100% 4px;
        }
        .builder-sweep {
          background: linear-gradient(90deg, transparent, rgba(244,238,231,0.12), rgba(129,230,217,0.18), transparent);
          mix-blend-mode: screen;
        }
        [data-builder-photo][aria-pressed="true"] .builder-grid { animation: builderGridDrift 3s linear both; }
        [data-builder-photo][aria-pressed="true"] .builder-scanlines { animation: builderScanDrift 1s linear 3; }
        [data-builder-photo][aria-pressed="true"] .builder-sweep { animation: builderSweep 3s ease-in-out both; }
        [data-builder-photo][aria-pressed="true"] .builder-readout { animation: builderPulse 1s ease-in-out 3; }
        @keyframes builderGridDrift { to { background-position: 56px 28px, 56px 28px; } }
        @keyframes builderScanDrift { to { background-position: 0 16px; } }
        @keyframes builderSweep { 0%, 20% { transform: translateX(0); } 70%, 100% { transform: translateX(320%); } }
        @keyframes builderPulse { 0%, 100% { opacity: 0.72; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          [data-builder-photo][aria-pressed="true"] .builder-grid,
          [data-builder-photo][aria-pressed="true"] .builder-scanlines,
          [data-builder-photo][aria-pressed="true"] .builder-sweep,
          [data-builder-photo][aria-pressed="true"] .builder-readout { animation: none; }
        }
      `}</style>
    </>
  );
}
