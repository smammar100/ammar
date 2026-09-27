import { agentProfile } from "@/lib/agent-profile";

// The structured profile behind llms.txt, as JSON. The WebMCP tools fetch it
// when an agent calls them, so pages don't carry it.

export const dynamic = "force-static";

export function GET() {
  return Response.json(agentProfile(), { headers: { "Cache-Control": "public, max-age=3600" } });
}
