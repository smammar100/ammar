import type { ProjectData, TeamMember } from "@/lib/content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup, AvatarGroupTooltip } from "@/components/ui/avatar-group";

// Structured case-study intro: the client name set large, a short framing
// paragraph, the lead image, then the write-up paired with pill groups for
// what was delivered and what it was built with. Presentational only, so it
// renders inside the RSC page.

function toParagraphs(value?: string | string[]): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** Accepts either "Noor Abbasi (Junior Designer)" or a TeamMember object. */
function parseMember(entry: string | TeamMember) {
  if (typeof entry !== "string") {
    return { ...entry, initials: initialsOf(entry.name) };
  }
  const match = entry.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  const name = (match ? match[1] : entry).trim();
  return {
    name,
    role: match ? match[2].trim() : undefined,
    avatar: undefined as string | undefined,
    initials: initialsOf(name),
  };
}

/** A right-column group: small heading over a wrapped set of pills. */
function PillGroup({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h2 className="mb-3 text-xl font-medium tracking-tight text-foreground">{title}</h2>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-border bg-secondary px-3 py-1 text-[13px] text-secondary-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CaseStudyHeader({ data }: { data: ProjectData }) {
  const {
    title,
    client,
    tagline,
    team,
    services,
    tools,
    heroImage,
  } = data;
  const members = (Array.isArray(team) ? team : toParagraphs(team)).map(parseMember);
  const problem = toParagraphs(data.problem);
  const overview = toParagraphs(data.overview);
  // Problem first, then how it resolved: the merged block is a narrative now,
  // not two labelled columns.
  const story = [...problem, ...overview];

  // The client name carries the display heading; the descriptive `title` still
  // does the work in metadata and on the work index.
  const display = client ?? title;

  return (
    <header className="project-load project-load-header mb-14">
      {/* Name + framing paragraph */}
      <div className="pb-8">
        <h1 className="mb-5 text-5xl font-medium tracking-tight sm:text-6xl">{display}</h1>
        {tagline && (
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{tagline}</p>
        )}
      </div>

      {/* Lead image sits between the framing and the write-up */}
      {heroImage && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <img src={heroImage} alt={title} className="block w-full" />
        </div>
      )}

      {/* Write-up against the delivery pills */}
      <div className="grid gap-10 pt-10 md:grid-cols-3 md:gap-12">
        <div className="md:col-span-2">
          <h2 className="mb-4 text-xl font-medium tracking-tight text-foreground">Long story short</h2>
          {story.map((paragraph, i) => (
            <p key={i} className="mb-4 text-base leading-relaxed text-muted-foreground last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-8">
          <PillGroup title="Services" items={services} />
          <PillGroup title="Tools" items={tools} />
          {members.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl font-medium tracking-tight text-foreground">Team</h2>
              <AvatarGroup className="h-10 -space-x-2.5">
                {members.map((member) => (
                  <Avatar key={member.name} className="size-10 border-2 border-background">
                    {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                    <AvatarFallback>{member.initials}</AvatarFallback>
                    <AvatarGroupTooltip>
                      <p className="font-medium text-foreground">{member.name}</p>
                      {member.role && <p className="text-muted-foreground">{member.role}</p>}
                    </AvatarGroupTooltip>
                  </Avatar>
                ))}
              </AvatarGroup>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
