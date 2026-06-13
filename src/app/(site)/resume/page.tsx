import type { Metadata } from "next";
import { roles } from "@/data/experience";
import { cn } from "@/lib/utils";
import { ResumeReveal } from "./ResumeReveal";

export const metadata: Metadata = {
  title: "Resumé",
  description:
    "Design engineer in Karachi. Senior Product Designer at Mahaana (YC W22), #1 Top Author on 21st.dev, shipping 100 built projects in public.",
};

const arcNodes = ["Engineer", "Co-Founder", "Designer", "Design Engineer"];

const skillGroups = [
  { label: "Design", skills: ["Product design", "Design systems", "Figma component libraries", "User research", "Webflow"] },
  { label: "Build", skills: ["React", "CSS", "Prototyping in code", "AI tooling"] },
  { label: "Domains", skills: ["FinTech", "Early-stage startups"] },
];

const education = [
  {
    school: "Harbour.Space (at UTCC, Bangkok)",
    degree: "MA Interaction Design",
    dateRange: "2022–2023",
    note: "100% scholarship.",
  },
  {
    school: "FAST-NUCES",
    degree: "BS Computer Science",
    dateRange: "2016–2020",
    note: "National University of Computer and Emerging Sciences.",
  },
];

export default function Page() {
  return (
    <>
      <ResumeReveal />

      {/* Hero + Career Arc */}
      {/* TODO: add a downloadable resume PDF for Ammar once one exists — no link until then. */}
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-12 sm:pt-24" data-resume-hero style={{ opacity: 0 }}>
        <h1 className="mb-3 text-4xl font-medium tracking-tight sm:text-5xl">Resumé</h1>
        <p className="mb-8 text-lg text-muted-foreground">Product design across fintech and early-stage startups since 2020 — now shipping the code too.</p>
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
          I trained as an engineer, then spent my career designing software that other people built. Now I&apos;m closing that loop. By day I lead design at Mahaana (YC W22), Pakistan&apos;s first SECP-licensed digital wealth manager — 10,000+ downloads, 4.8★+ on iOS. The rest of the time I&apos;m shipping my way through 100 built projects in public, currently #1 Top Author on 21st.dev.
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

              <p className="mb-1 text-base font-semibold leading-snug">{role.company}</p>
              <p className="mb-5 text-sm text-muted-foreground">{role.role}</p>

              <ul className="flex flex-col gap-5">
                {role.descriptions.map((desc) => (
                  <li key={desc} className="text-sm leading-relaxed text-muted-foreground">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16" data-resume-education style={{ opacity: 0 }}>
        <p className="mb-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">Education</p>
        <div className="flex flex-col gap-12">
          {education.map((entry) => (
            <div key={entry.school}>
              <div className="mb-5 font-mono text-xs text-muted-foreground">{entry.dateRange}</div>
              <p className="mb-1 text-base font-semibold leading-snug">{entry.school}</p>
              <p className="mb-5 text-sm text-muted-foreground">{entry.degree}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{entry.note}</p>
            </div>
          ))}
        </div>
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
