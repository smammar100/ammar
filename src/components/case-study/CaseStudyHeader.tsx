import { Badge } from "@/components/ui/badge";
import type { ProjectData } from "@/lib/content";

// Structured case-study header: a compact hero (title, tagline, CTA + pills)
// followed by a two-column block that sets the labelled facts against the
// overview. Presentational only, so it renders inside the RSC page.

function toParagraphs(value?: string | string[]): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/** A labelled fact in the left-hand column. */
function MetaField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">{label}</h2>
      {children}
    </div>
  );
}

export function CaseStudyHeader({ data }: { data: ProjectData }) {
  const { title, tagline, tags, demoUrl, demoLabel, pills, role, team, platforms } = data;
  const problem = toParagraphs(data.problem);
  const overview = toParagraphs(data.overview);

  return (
    <header className="project-load project-load-header mb-14">
      {/* Hero */}
      <div className="mb-12 border-b border-border pb-10">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-mono text-[11px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {tagline && <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{tagline}</p>}

        {(demoUrl || (pills && pills.length > 0)) && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-2 font-mono text-xs text-background transition-opacity hover:opacity-90"
              >
                {demoLabel ?? "View project"}
                <span aria-hidden="true">↗</span>
              </a>
            )}
            {pills?.map((pill) => (
              <span
                key={pill}
                className="rounded-md border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
              >
                {pill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Facts against the overview */}
      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col gap-8">
          {role && (
            <MetaField label="My Role">
              <p className="text-base leading-relaxed text-muted-foreground">{role}</p>
            </MetaField>
          )}
          {problem.length > 0 && (
            <MetaField label="The Problem">
              {problem.map((paragraph, i) => (
                <p key={i} className="mb-3 text-base leading-relaxed text-muted-foreground last:mb-0">
                  {paragraph}
                </p>
              ))}
            </MetaField>
          )}
          {team && (
            <MetaField label="Team">
              <p className="text-base leading-relaxed text-muted-foreground">{team}</p>
            </MetaField>
          )}
          {platforms && (
            <MetaField label="Platforms">
              <p className="text-base leading-relaxed text-muted-foreground">{platforms}</p>
            </MetaField>
          )}
        </div>

        {overview.length > 0 && (
          <div>
            <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Overview</h2>
            {overview.map((paragraph, i) => (
              <p key={i} className="mb-3 text-base leading-relaxed text-muted-foreground last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
