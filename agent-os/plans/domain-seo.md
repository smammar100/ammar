# Domain SEO

## Status

Complete in code on 2026-09-30. Not live until it is deployed.

## Context

`www.smammar.com` was connected in Vercel on 2026-09-30. The live site was
still built for the old host: every absolute URL (robots.txt, the sitemap,
llms.txt, the agent catalog, Open Graph) said `ammar-snowy.vercel.app`. No
page had a canonical URL, every page's link preview carried the home page's
title and URL, four page titles repeated the site name, and the sitemap listed
Lab pages that were marked noindex.

## Desired Outcome

Search engines, link previews and AI agents all see one site at
`https://www.smammar.com`, with each page described as itself.

## Approach

- `siteUrl()` reads `siteConfig.url` (the www host) instead of Vercel's
  production-URL variable, which reports the redirecting bare domain.
- One helper, `pageMetadata()`, gives every page its title, description,
  canonical URL and link preview.
- JSON-LD moves to `src/lib/structured-data.ts` and gains page-level blocks:
  ProfilePage (about), Article (case studies), BlogPosting (writing), each
  with breadcrumbs.
- robots.txt names the AI crawlers it welcomes.
- The Lab index and the four Lab pieces with their own route become
  indexable, matching the sitemap. The noindex dated from the first commit.
- The resume PDF is published and linked from the about page and the agent
  files. The tech stack names move to `src/data/tech-stack.ts`, shared by the
  about page and the agent files.

## Scope

In: metadata, canonicals, structured data, sitemap, robots.txt, llms files,
the resume PDF, docs.

Out: the facts the site states about Ammar (see Review), a per-page link
preview image, Search Console and Bing setup, the WebMCP origin-trial token,
redirecting the old Vercel host.

## Files To Modify

- `src/lib/site-url.ts`, `src/data/site-config.ts`: the origin
- `src/lib/metadata.ts`, `src/lib/structured-data.ts`, `src/components/JsonLd.tsx`: new
- `src/app/layout.tsx` and every `page.tsx`: metadata through the helper
- `src/app/robots.txt/route.ts`, `src/app/sitemap.ts`, `src/app/llms*.txt/route.ts`,
  `src/app/skills/hire-ammar/SKILL.md/route.ts`, `src/lib/agent-profile.ts`
- `src/data/tech-stack.ts`, `src/components/about/TechStack.tsx`
- `public/Syed-Mohammad-Ammar-Resume.pdf`

## Steps

- [x] Point every absolute URL at the www host
- [x] Canonical URL and own link preview on every page
- [x] Fix doubled titles; name the client in case-study titles
- [x] Page-level structured data
- [x] Make sitemap and noindex agree
- [x] Name AI crawlers in robots.txt
- [x] Publish the resume PDF and link it
- [ ] Deploy, then check the live files
- [ ] Owner: Search Console and Bing Webmaster Tools, WebMCP token for the new
      origin, redirect the old Vercel host

## Review

- Editorial: the resume PDF and the site disagree on some facts. The PDF has
  Mahaana ending in May 2026 and an independent practice as the current role;
  the site, its descriptions and the JSON-LD `worksFor` still say he is at
  Mahaana. Owner to decide which the site should say.
- Verification: `next build` passes; head tags, robots.txt, sitemap, llms
  files, the catalog and the JSON-LD checked on the dev server.

## Learnings

`agent-os/learnings/seo.md` (new) and `agent-os/learnings/agentic-browsing.md`
(updated).
