import type { MetadataRoute } from "next";
import { getProjects, getWriting } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

// Pages worth finding, all of them indexable. The component demo pages under
// /lab/[slug] and the style guide are noindex, so they're left out.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = ["", "/about", "/resume", "/work", "/lab", "/lab/pixel-wave", "/lab/pixel-mark", "/lab/pixel-scatter", "/lab/pattern-engine", "/writing", "/colophon"];
  return [
    ...pages.map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 })),
    ...getProjects().map((p) => ({ url: `${base}/work/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.8 })),
    ...getWriting().map((w) => ({ url: `${base}/writing/${w.slug}`, lastModified: w.data.publishedDate, changeFrequency: "yearly" as const, priority: 0.5 })),
    { url: `${base}/llms.txt`, changeFrequency: "monthly" as const, priority: 0.6 },
  ];
}
