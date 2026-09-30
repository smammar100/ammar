import { siteUrl } from "@/lib/site-url";

// Everyone is welcome, AI crawlers and agents included: the point is for them
// to find Ammar. Agentmap points agents at the ai-catalog (Agentic Resource
// Discovery); a route handler rather than app/robots.ts, which can't emit it.

export const dynamic = "force-static";

// The AI search, assistant and training crawlers, named so that the welcome is
// explicit rather than implied by the wildcard. The rule is the same for all.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "MistralAI-User",
  "DuckAssistBot",
  "CCBot",
];

export function GET() {
  const base = siteUrl();
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    ...AI_CRAWLERS.map((agent) => `User-agent: ${agent}`),
    "Allow: /",
    "",
    "# For AI agents and LLMs: who Ammar is, his work, and how to hire him.",
    `# ${base}/llms.txt`,
    `# ${base}/llms-full.txt`,
    `Agentmap: ${base}/.well-known/ai-catalog.json`,
    "",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
