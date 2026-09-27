import { siteUrl } from "@/lib/site-url";

// Everyone is welcome, AI crawlers and agents included: the point is for them
// to find Ammar. Agentmap points agents at the ai-catalog (Agentic Resource
// Discovery); a route handler rather than app/robots.ts, which can't emit it.

export const dynamic = "force-static";

export function GET() {
  const base = siteUrl();
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    "# For AI agents and LLMs: who Ammar is, his work, and how to hire him.",
    `# ${base}/llms.txt`,
    `Agentmap: ${base}/.well-known/ai-catalog.json`,
    "",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
