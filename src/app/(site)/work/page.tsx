import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { roles } from "@/data/experience";
import { getProjects } from "@/lib/content";
import { cn } from "@/lib/utils";
import { WorkReveal } from "./WorkReveal";

export const metadata: Metadata = {
  title: "Work — Patrick Morgan",
  description: "13+ years moving between strategy, design, and code.",
};

const skillGroups = [
  { label: "Design", skills: ["Product design", "Prototyping", "Interaction design", "Systems design", "Design systems", "User research", "Figma", "Framer", "Midjourney"] },
  { label: "Dev", skills: ["HTML", "CSS", "Javascript", "React", "Tailwind", "ShadCN", "Git", "Github", "Claude Code", "Astro", "PNPM"] },
  { label: "Domains", skills: ["B2B & Enterprise SaaS", "Cybersecurity", "FinTech"] },
];

export default async function Page() {
  const allProjects = getProjects();

  function getRoleProjects(slugs: string[] = []) {
    return slugs
      .map((slug) => allProjects.find((p) => p.slug === slug))
      .filter(Boolean) as typeof allProjects;
  }

  return (
    <>
      <WorkReveal />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-12 sm:pt-24" data-resume-hero style={{ opacity: 0 }}>
        <h1 className="mb-3 text-4xl font-medium tracking-tight sm:text-5xl">Work</h1>
        <p className="max-w-xl text-lg text-muted-foreground">13+ years moving between strategy, design, and code.</p>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-3xl px-6" data-resume-intro style={{ opacity: 0 }}>
        <p className="mb-10 font-mono text-sm uppercase tracking-widest text-muted-foreground">Career</p>

        <div className="relative">
          <div className="absolute left-[5px] top-2 bottom-0 w-px bg-border"></div>

          {roles.map((role) => {
            const projects = getRoleProjects(role.projects);
            return (
              <div key={role.company} className="relative mb-14 last:mb-0 pl-8" data-timeline-entry style={{ opacity: 0 }}>
                <div className="absolute left-0 top-[5px] size-3 rounded-full border border-border bg-background"></div>

                <div className="mb-4 font-mono text-sm text-muted-foreground">{role.dateRange}</div>

                <div className="mb-1 flex flex-wrap items-baseline gap-x-2">
                  {role.url ? (
                    <a href={role.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold leading-snug transition-colors hover:text-accent sm:text-xl">{role.company}</a>
                  ) : (
                    <span className="text-lg font-semibold leading-snug sm:text-xl">{role.company}</span>
                  )}
                  <span className="text-base text-muted-foreground">{role.role}</span>
                </div>

                {role.summary && (
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{role.summary}</p>
                )}

                {projects.length > 0 && (
                  <div className={cn("mt-6 grid gap-4", projects.length === 1 ? "sm:grid-cols-1 max-w-sm" : "grid-cols-1 sm:grid-cols-2")}>
                    {projects.map((project, i) => (
                      <ProjectCard
                        key={project.slug}
                        title={project.data.title}
                        description={project.data.description}
                        skills={project.data.skills}
                        thumbnail={project.data.thumbnail}
                        thumbnailDark={project.data.thumbnailDark}
                        thumbnailWide={project.data.thumbnailWide}
                        thumbnailWideDark={project.data.thumbnailWideDark}
                        slug={project.slug}
                        index={i}
                        variant="compact"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-24" data-resume-skills style={{ opacity: 0 }}>
        <p className="mb-10 font-mono text-sm uppercase tracking-widest text-muted-foreground">Skills</p>
        <div className="flex flex-col gap-5">
          {skillGroups.map(({ label, skills }) => (
            <div key={label}>
              <p className="mb-2 font-mono text-sm uppercase tracking-widest text-muted-foreground/60">{label}</p>
              <p className="text-base leading-relaxed text-foreground/70">{skills.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
