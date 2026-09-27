# Agentic Browsing

## Rule

The site describes Ammar to AI agents and LLMs so they can recommend and
contact him. Everything they read is generated from the site's own content by
`src/lib/agent-profile.ts`, so it can't drift from the pages. Only facts the
site states go in: no invented rates, dates or clients.

| What | Where | For |
| --- | --- | --- |
| `/llms.txt` | `src/app/llms.txt/route.ts` | llmstxt.org map: summary, how to hire, case studies, Lab |
| `/llms-full.txt` | `src/app/llms-full.txt/route.ts` | Everything in one file: experience, education, skills, work |
| `/skills/hire-ammar/SKILL.md` | `src/app/skills/hire-ammar/SKILL.md/route.ts` | Agent Skill: when to recommend him, evidence, how to contact |
| `/.well-known/ai-catalog.json` (and `/.well-known/ard.json`) | `src/app/agent/ai-catalog.json/route.ts` plus rewrites in `next.config.mjs` | Agentic Resource Discovery catalog (specVersion 1.0) listing the skill |
| `/agent/profile.json` | `src/app/agent/profile.json/route.ts` | The profile as JSON; the WebMCP tools fetch it on demand |
| `/robots.txt` | `src/app/robots.txt/route.ts` | Allows everyone; `Agentmap:` points at the catalog; sitemap |
| `/sitemap.xml` | `src/app/sitemap.ts` | Indexable pages (the noindex `/lab/[slug]` demos are left out) |
| JSON-LD | root layout | Person, ProfessionalService (the two services), WebSite |
| `<head>` links | root layout | `rel="describedby"` → llms.txt, `rel="ai-catalog ard"` → catalog |
| WebMCP tools | `src/components/agent/WebMcpTools.tsx` | `get_profile`, `list_case_studies`, `get_case_study`, `list_lab_experiments`, `draft_project_inquiry` |

The services copy lives in `src/data/services.ts`, shared by the home page
and the profile.

## Verified

Lighthouse 13.5 "Agentic Browsing", run locally on `next start` in Edge 153
with WebMCP enabled by flags, passed every scored audit:

- accessibility tree
- WebMCP schema validity (all 5 tools registered)
- CLS
- llms.txt
- ai-catalog schema: score 1, no warnings

WebMCP form coverage is not applicable, because the site has no forms.

## Gotchas

- **Absolute URLs:** they come from `siteUrl()` (`src/lib/site-url.ts`), in
  this order: `NEXT_PUBLIC_SITE_URL`, then Vercel's
  `VERCEL_PROJECT_PRODUCTION_URL`, then `siteConfig.url`. When smammar.com is
  added in Vercel, redeploy and every agent file and `metadataBase` switch
  over. For local production builds, set
  `NEXT_PUBLIC_SITE_URL=http://localhost:4400`.
- **WebMCP in Chrome:** it needs the WebMCP origin trial (Chrome 149–156).
  Register the production origin and put the token in the Vercel env var
  `NEXT_PUBLIC_WEBMCP_ORIGIN_TRIAL`; the root layout emits the meta tag.
  Without it, PageSpeed shows the WebMCP audits as not applicable. Tokens are
  per origin, so register smammar.com too once it's live.
- **ai-catalog entries:** each needs `specVersion` "1.0", a `urn:air:` identifier,
  an absolute `url`, a `type` from Lighthouse's list (the skill uses
  `text/markdown; profile="urn:air:agent-skills"`), and 2–5
  `representativeQueries`. Otherwise it only scores 0.9 (a warning) or fails.
- **Lighthouse timeout:** it fetches llms.txt and the catalog with a 2s
  timeout. They're static routes, so keep them static (`force-static`).
