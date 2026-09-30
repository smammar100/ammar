// The tools Ammar works with, in the order a project moves through them. The
// about page's "My tech stack" row renders these (its logos are matched to
// the names in components/about/TechStack.tsx), and the agent-facing files
// list the same names.
export const TECH_STACK = [
  "ChatGPT",
  "Claude Design",
  "Figma",
  "Claude Code",
  "Next.js",
  "Tailwind CSS",
  "Sanity",
] as const;

export type TechStackName = (typeof TECH_STACK)[number];
