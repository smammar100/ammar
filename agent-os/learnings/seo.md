# SEO

## Rule

The site lives at `https://www.smammar.com`. The bare `smammar.com` redirects
there (a Vercel domain setting), so every canonical and absolute URL uses the
www host. It comes from `siteUrl()` (`src/lib/site-url.ts`), which reads
`siteConfig.url`.

Every page sets its metadata through `pageMetadata()` (`src/lib/metadata.ts`):
title, description, canonical URL, and a link preview (Open Graph and Twitter)
that names that page. Don't hand-write a `metadata` object on a page.

| What | Where |
| --- | --- |
| Site-wide defaults, robots directives, the site's JSON-LD | `src/app/layout.tsx` |
| Per-page metadata | `pageMetadata()` in `src/lib/metadata.ts` |
| JSON-LD objects (Person, service, site, profile page, case study, writing) | `src/lib/structured-data.ts`, rendered with `src/components/JsonLd.tsx` |
| Sitemap | `src/app/sitemap.ts` |
| robots.txt | `src/app/robots.txt/route.ts` |

What's indexed: home, about, resume, work and its case studies, writing and
its posts, colophon, the Lab index and the Lab pieces with their own route
(pixel-wave, pixel-mark, pixel-scatter, pattern-engine). Not indexed: the
component demos under `/lab/[slug]`, the style guide, and drafts. The sitemap
lists only indexed pages, so change both together.

## Gotchas

- **Titles:** pass the page's own title ("Work"). The root layout's template
  adds "| Syed Mohammad Ammar"; writing it in the title doubles it.
- **Link previews:** Next replaces `openGraph` and `twitter` wholesale when a
  page sets them, and doesn't fill them from `title`. A page with only a title
  and description shares the home page's preview title and URL, which is why
  `pageMetadata()` fills in all of it.
- **Case-study titles:** they use `projectLabel()` ("Iconimate: Small icons. A
  lot of decisions."), because the bare title doesn't name the project.
- **Writing:** each post's canonical URL is the post itself, not the Medium
  original in `canonicalUrl`. The post is the site's own summary, not a copy;
  the JSON-LD points at Medium with `isBasedOn`.
- **Don't use `VERCEL_PROJECT_PRODUCTION_URL`:** it reports the shortest
  production domain, the bare `smammar.com`, so canonicals would point at a
  redirect. Absolute URLs are baked in at build time, so a domain change needs
  a redeploy.
- **The old host:** `ammar-snowy.vercel.app` still serves the site. Canonicals
  point search engines at the real domain; a redirect for that host is a
  Vercel domain setting.

## Verification

After a deploy, check the live `robots.txt`, `sitemap.xml`, `llms.txt` and a
page's `<head>` for the www host. Submit `sitemap.xml` in Google Search Console
and Bing Webmaster Tools (Bing's index is what ChatGPT search and Copilot
read). Link-preview caches (LinkedIn, Slack, X) keep the old card until
refreshed.
