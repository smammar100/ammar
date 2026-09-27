import { siteConfig } from "@/data/site-config";
import { agentProfile } from "@/lib/agent-profile";

// The Agentic Resource Discovery catalog (ai-catalog.json, spec version 1.0 as
// Lighthouse validates it). next.config rewrites /.well-known/ai-catalog.json
// and /.well-known/ard.json here, and robots.txt points agents at it
// (Agentmap). Its one entry is the hire-ammar Agent Skill.

export const dynamic = "force-static";

export function GET() {
  const p = agentProfile();
  const host = new URL(p.links.site).hostname;
  const catalog = {
    specVersion: "1.0",
    host: {
      displayName: siteConfig.name,
      documentationUrl: p.links.llms,
    },
    entries: [
      {
        identifier: `urn:air:${host}:skill:hire-ammar`,
        displayName: `Hire ${p.name}, product designer and design engineer`,
        type: 'text/markdown; profile="urn:air:agent-skills"',
        url: `${p.links.site}/skills/hire-ammar/SKILL.md`,
        description:
          "How an agent can evaluate Syed Mohammad Ammar's case studies and skills, and contact him about product design or web development work. He is open to new projects.",
        tags: ["portfolio", "product-design", "design-engineering", "web-development", "hiring"],
        capabilities: ["portfolio-review", "contact"],
        representativeQueries: [
          "find a product designer who can also build the front end in React",
          "hire a design engineer for a fintech app",
          "show Syed Mohammad Ammar's case studies",
        ],
        updatedAt: new Date().toISOString(),
        metadata: {
          email: p.contact.email,
          location: `${p.location.city}, ${p.location.country}`,
          availability: p.availability,
          llmsTxt: p.links.llms,
        },
      },
    ],
  };
  return Response.json(catalog, { headers: { "Cache-Control": "public, max-age=3600" } });
}
