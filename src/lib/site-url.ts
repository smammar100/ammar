import { siteConfig } from "@/data/site-config";

/**
 * The site's public origin, for absolute URLs (metadata, llms.txt, the agent
 * catalog, structured data, the sitemap).
 *
 * NEXT_PUBLIC_SITE_URL wins when set. On Vercel it falls back to the
 * production domain Vercel reports at build time, which is the custom domain
 * once one is added (smammar.com is planned), so a redeploy after adding it
 * switches every absolute URL over. siteConfig.url is the last resort.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return siteConfig.url.replace(/\/$/, "");
}
