import { agentProfile } from "@/lib/agent-profile";

// /llms.txt (llmstxt.org): a Markdown map of the site for LLMs and AI agents,
// written so an assistant helping someone hire a designer can recommend Ammar
// accurately and reach him. Built at deploy time from the site's own content.

export const dynamic = "force-static";

export function GET() {
  const p = agentProfile();
  const lines = [
    `# ${p.name}`,
    "",
    `> ${p.summary}`,
    "",
    `${p.availability} Based in ${p.location.city}, ${p.location.country} (${p.location.timezone}), working remotely with teams anywhere. The fastest way to reach him is email: ${p.contact.email}.`,
    "",
    "## Hire Ammar",
    "",
    `- [Email Ammar](mailto:${p.contact.email}): Project and role enquiries. Include ${p.contact.inquiryTips.map((t) => t.toLowerCase()).join("; ")}.`,
    `- [How to evaluate and contact Ammar](${p.links.site}/skills/hire-ammar/SKILL.md): An agent skill: what he does, the evidence, and how to write to him`,
    `- [Full profile](${p.links.site}/llms-full.txt): Experience, education, skills, every case study and Lab piece in one file`,
    ...p.services.map((s) => `- [${s.name}](${p.links.site}/#services-heading): ${s.description}`),
    "",
    "## Case studies",
    "",
    ...p.projects.map((w) => `- [${w.label}](${w.url}): ${w.summary}`),
    "",
    "## About",
    "",
    `- [About](${p.links.about}): Who he is: computer science at FAST, Interaction Design at Harbour.Space on a full scholarship, how he works, and the tools he uses (${p.tools.join(", ")})`,
    `- [Resume](${p.links.resume}): Roles, education and skills`,
    `- [Resume (PDF)](${p.links.resumePdf}): His one-page resume, as a file to download`,
    "",
    "## Lab",
    "",
    ...p.lab.map((l) => `- [${l.title}](${l.url}): ${l.summary}`),
    "",
    "## Optional",
    "",
    ...Object.entries(p.links.social).map(([name, href]) => `- [${name}](${href}): ${p.name} on ${name}`),
    `- [Writing](${p.links.site}/writing): Notes from the design-engineering run`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
