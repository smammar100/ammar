import { siteConfig } from "@/data/site-config";
import { SOCIAL_LINKS } from "@/data/social";
import { roles } from "@/data/experience";
import { SERVICES } from "@/data/services";
import { getLab, getProjects } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

// One description of Ammar for AI agents and LLMs, built from the site's own
// content so it can't drift from what the pages say. llms.txt, llms-full.txt,
// the hire-ammar skill, the ai-catalog, the JSON-LD and the WebMCP tools all
// read it. Only facts that appear on the site go in here.

export const EDUCATION = [
  { school: "Harbour.Space University (at UTCC, Bangkok)", degree: "MA Interaction Design", years: "2022–2023", note: "100% scholarship" },
  { school: "FAST-NUCES (National University of Computer and Emerging Sciences)", degree: "BS Computer Science", years: "2016–2020" },
];

export const SKILLS = {
  design: ["Product design", "Design systems", "Figma component libraries", "User research", "Interaction design", "Mobile design", "Webflow"],
  build: ["React", "Next.js", "CSS", "Tailwind CSS", "Prototyping in code", "Motion design", "AI tooling"],
  domains: ["FinTech", "Early-stage startups"],
};

export function agentProfile() {
  const base = siteUrl();
  const projects = getProjects()
    .sort((a, b) => a.data.sortOrder - b.data.sortOrder)
    .map((p) => ({
      slug: p.slug,
      title: p.data.title,
      // "Client: title", unless the title already is the client's name.
      label: p.data.client && p.data.client !== p.data.title ? `${p.data.client}: ${p.data.title}` : p.data.title,
      client: p.data.client ?? null,
      role: p.data.role ?? null,
      summary: p.data.description,
      outcomes: p.data.kpis ?? [],
      skills: p.data.tags ?? p.data.skills,
      url: `${base}/work/${p.slug}`,
    }));
  const lab = getLab().map((e) => ({
    slug: e.slug,
    title: e.data.title,
    summary: e.data.description,
    url: `${base}/lab/${e.slug}`,
  }));

  return {
    name: siteConfig.name,
    headline: "Product designer who makes complex products easy to use, and builds them too.",
    summary:
      "Product designer and design engineer in Karachi, Pakistan. Senior Product Designer at Mahaana (YC W22), leading design for its iOS and Android investing apps. Designs from research and flows to design systems, then builds the front end in React and Next.js. #1 Top Author on 21st.dev, and publicly shipping 100 built projects.",
    availability: "Currently open to new projects: product design, web development, or both end to end.",
    location: { city: "Karachi", country: "Pakistan", timezone: "Asia/Karachi, UTC+5", remote: true },
    contact: {
      email: siteConfig.social.email,
      preferred: "email",
      inquiryTips: [
        "What you're building and who it's for",
        "What you need: product design, web development, or both",
        "Timeline and team setup",
      ],
    },
    links: {
      site: base,
      about: `${base}/about`,
      resume: `${base}/resume`,
      work: `${base}/work`,
      lab: `${base}/lab`,
      llms: `${base}/llms.txt`,
      social: Object.fromEntries(SOCIAL_LINKS.map((s) => [s.label, s.href])),
    },
    services: SERVICES.map((s) => ({ name: s.title, description: s.body })),
    skills: SKILLS,
    experience: roles.map((r) => ({
      company: r.company,
      role: r.role,
      years: r.dateRange,
      summary: r.summary ?? null,
      highlights: r.descriptions,
    })),
    education: EDUCATION,
    projects,
    lab,
  };
}

export type AgentProfile = ReturnType<typeof agentProfile>;
