import { agentProfile } from "@/lib/agent-profile";

// /llms-full.txt: everything an agent needs to judge fit, in one Markdown
// file (the llms.txt links point here). Built at deploy time from the site's
// own content.

export const dynamic = "force-static";

export function GET() {
  const p = agentProfile();
  const out: string[] = [
    `# ${p.name}: full profile`,
    "",
    `> ${p.summary}`,
    "",
    `**Availability:** ${p.availability}`,
    `**Location:** ${p.location.city}, ${p.location.country}. ${p.location.timezone}. Works remotely.`,
    `**Contact:** [${p.contact.email}](mailto:${p.contact.email}). Email is preferred. Useful to include: ${p.contact.inquiryTips.join("; ")}.`,
    `**Site:** [${p.links.site}](${p.links.site})`,
    "",
    "## Services",
    "",
    ...p.services.flatMap((s) => [`### ${s.name}`, "", s.description, ""]),
    "## Skills",
    "",
    `- **Design:** ${p.skills.design.join(", ")}`,
    `- **Build:** ${p.skills.build.join(", ")}`,
    `- **Domains:** ${p.skills.domains.join(", ")}`,
    "",
    "## Experience",
    "",
  ];
  for (const r of p.experience) {
    out.push(`### ${r.role}, ${r.company} (${r.years})`, "");
    if (r.summary) out.push(r.summary, "");
    out.push(...r.highlights.map((h) => `- ${h}`), "");
  }
  out.push("## Education", "");
  out.push(...p.education.map((e) => `- ${e.degree}, ${e.school} (${e.years})${"note" in e && e.note ? `. ${e.note}.` : ""}`), "");
  out.push("## Case studies", "");
  for (const w of p.projects) {
    out.push(`### [${w.label}](${w.url})`, "");
    if (w.role) out.push(`**Role:** ${w.role}`, "");
    out.push(w.summary, "");
    if (w.outcomes.length) out.push(`**Outcomes:** ${w.outcomes.join(" · ")}`, "");
    if (w.skills.length) out.push(`**Skills:** ${w.skills.join(", ")}`, "");
  }
  out.push("## Lab", "", "Interactive experiments and components, built and published on the site.", "");
  out.push(...p.lab.map((l) => `- [${l.title}](${l.url}): ${l.summary}`), "");
  out.push("## Elsewhere", "");
  out.push(...Object.entries(p.links.social).map(([name, href]) => `- [${name}](${href})`), "");
  return new Response(out.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
