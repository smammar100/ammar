import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";

// The link preview: a scrapbook of Ammar's portfolio on the site's paper
// (headline, a checklist note, his polaroid with the A mark as a sticker, an
// Iconimate print, the leaf garden). Rendered once from a 1200x630 design, and
// every page uses it; see agent-os/learnings/link-preview.md to change it.
export const OG_IMAGE = {
  url: "/images/brand/og.jpg",
  width: 1200,
  height: 630,
  alt: "Syed Mohammad Ammar, product designer who builds what he designs.",
};

type PageMetadata = {
  /** The page's own title. The root layout's template adds the site name. */
  title: string;
  /** Use the title as is, with no site name added (the home page). */
  absoluteTitle?: boolean;
  description?: string;
  /** Route path, e.g. "/about". Resolved against the live origin. */
  path: string;
  /** "article" for case studies and writing; everything else is "website". */
  type?: "website" | "article";
  publishedTime?: string;
  /** Keep the page out of search results (it still gets a link preview). */
  noindex?: boolean;
};

/**
 * Metadata for one page: its title and description, a canonical URL, and a
 * link preview that names this page. Next replaces `openGraph` and `twitter`
 * wholesale rather than merging them with the root layout's, so a page that
 * only set a title would share the home page's preview title and URL; this
 * fills all of it in.
 */
export function pageMetadata({
  title,
  absoluteTitle = false,
  description = siteConfig.description,
  path,
  type = "website",
  publishedTime,
  noindex = false,
}: PageMetadata): Metadata {
  // The title template doesn't reach the link preview, so the site name is
  // added here: "About" on its own says little when the link is shared.
  const preview = {
    title: absoluteTitle ? title : `${title} | ${siteConfig.name}`,
    description,
    images: [OG_IMAGE],
  };
  const openGraph = { ...preview, url: path, siteName: siteConfig.name, locale: "en_US" };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    // A noindex page has no canonical: the two would contradict each other.
    ...(noindex ? { robots: { index: false, follow: false } } : { alternates: { canonical: path } }),
    openGraph:
      type === "article"
        ? { ...openGraph, type: "article", publishedTime, authors: [siteConfig.name] }
        : { ...openGraph, type: "website" },
    twitter: { card: "summary_large_image", ...preview },
  };
}
