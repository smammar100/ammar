import { siteConfig } from "@/data/site-config";

/**
 * The site's public origin, for absolute URLs (canonical links, Open Graph,
 * llms.txt, the agent catalog, structured data, the sitemap).
 *
 * It's siteConfig.url: https://www.smammar.com, the host Vercel serves (the
 * bare smammar.com redirects to it). NEXT_PUBLIC_SITE_URL overrides it, for
 * checking a production build locally.
 *
 * Vercel's VERCEL_PROJECT_PRODUCTION_URL is deliberately not used: it reports
 * the shortest production domain, which is the bare smammar.com, so every
 * canonical URL would point at a redirect.
 */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url).replace(/\/$/, "");
}
