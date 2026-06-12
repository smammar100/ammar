import type { Metadata } from "next";
import { roles } from "@/data/experience";
import { cn } from "@/lib/utils";
import { ResumeReveal } from "./ResumeReveal";

export const metadata: Metadata = {
  title: "Resumé — Patrick Morgan",
  description: "12+ years merging design, technology, and storytelling to create human-centered experiences.",
};

const arcNodes = ["Strategist", "Developer", "Designer", "Writer", "Builder"];

const skillGroups = [
  { label: "Design", skills: ["Product design", "Prototyping", "Interaction design", "Systems design", "Design systems", "User research", "Figma", "Framer", "Midjourney"] },
  { label: "Dev", skills: ["HTML", "CSS", "Javascript", "React", "Tailwind", "ShadCN", "Git", "Github", "Claude Code", "Astro", "PNPM"] },
  { label: "Domains", skills: ["B2B & Enterprise SaaS", "Cybersecurity", "FinTech"] },
];

export default function Page() {
  return (
    <>
      <ResumeReveal />

      {/* Hero + Career Arc */}
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-12 sm:pt-24" data-resume-hero style={{ opacity: 0 }}>
        <h1 className="mb-3 text-4xl font-medium tracking-tight sm:text-5xl">Resumé</h1>
        <p className="mb-8 text-lg text-muted-foreground">12+ years of product design across cybersecurity, enterprise SaaS, and AI.</p>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {arcNodes.map((label, i, arr) => (
            <span key={label} className="contents">
              <span
                className={cn(
                  "arc-node rounded border px-2 py-0.5 font-mono text-[11px] sm:px-3 sm:py-1 sm:text-xs",
                  i === arr.length - 1 ? "arc-node-final" : ""
                )}
                style={{ animationDelay: `${i * 700}ms` }}
              >
                {label}
              </span>
              {i < arr.length - 1 && (
                <span className="font-mono text-xs text-muted-foreground/40">→</span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* Experience — intro + timeline */}
      <section className="mx-auto max-w-3xl border-t border-border px-6 pt-12" data-resume-intro style={{ opacity: 0 }}>
        <p className="mb-16 text-base leading-relaxed text-foreground/70">
          My career has never been one note. I&apos;ve been a strategist, a developer, a designer, and a writer — sometimes all at once. What connects them is a compulsion to make things that are both useful and well-crafted. Right now that means designing AI tools at Sublime Security, writing articles for Unknown Arts, and building my own software with agents.
        </p>

        {/* Career label */}
        <p className="mb-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">Career</p>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-[5px] top-2 bottom-0 w-px bg-border"></div>

          {roles.map((role) => (
            <div key={role.company} className="relative mb-12 last:mb-0 pl-8" data-timeline-entry style={{ opacity: 0 }}>
              <div className="absolute left-0 top-[3px] size-[11px] rounded-full border border-border bg-background"></div>

              <div className="mb-5 font-mono text-xs text-muted-foreground">{role.dateRange}</div>

              {role.logo && (
                <img src={role.logo} alt={role.company} className="logo-adaptive mb-4 h-5" />
              )}

              <p className="mb-5 text-base font-semibold leading-snug">{role.role}</p>

              <ul className="flex flex-col gap-5">
                {role.descriptions.map((desc) => (
                  <li key={desc} className="text-sm leading-relaxed text-muted-foreground">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Unknown Arts */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16" data-resume-ua style={{ opacity: 0 }}>
        <p className="mb-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">Writing</p>
        <div className="mb-5 font-mono text-xs text-muted-foreground">2022–Now</div>
        <img src="/images/logos/career-unknownarts.svg" alt="Unknown Arts" className="logo-adaptive mb-4 h-5" />
        <ul className="flex flex-col gap-5">
          <li className="text-sm leading-relaxed text-muted-foreground">Created a newsletter growing to 7,500+ subscribers and ~40% open rate.</li>
          <li className="text-sm leading-relaxed text-muted-foreground">Featured in top industry publications, reaching a global audience across 128 countries.</li>
          <li className="text-sm leading-relaxed text-muted-foreground">Organized events fostering community connection and growth.</li>
        </ul>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-3xl px-6 pt-6 pb-24" data-resume-skills style={{ opacity: 0 }}>
        <p className="mb-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">Skills</p>
        <div className="flex flex-col gap-5">
          {skillGroups.map(({ label, skills }) => (
            <div key={label}>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground/60">{label}</p>
              <p className="text-sm leading-relaxed text-foreground/70">{skills.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
