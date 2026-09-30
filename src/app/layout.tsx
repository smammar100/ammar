import type { Metadata } from "next";
import { preload } from "react-dom";
import "@/styles/global.css";
import { siteConfig } from "@/data/site-config";
import { JsonLd } from "@/components/JsonLd";
import { WebMcpTools } from "@/components/agent/WebMcpTools";
import { agentProfile } from "@/lib/agent-profile";
import { OG_IMAGE } from "@/lib/metadata";
import { siteUrl } from "@/lib/site-url";
import { siteGraph } from "@/lib/structured-data";

// Site-wide defaults. Each page sets its own title, description, canonical URL
// and link preview through pageMetadata() (lib/metadata.ts); what's here
// covers anything that doesn't, such as the 404 page.
export const metadata: Metadata = {
  // The real public origin (see lib/site-url.ts), so social previews and
  // canonical URLs resolve on the live domain.
  metadataBase: new URL(siteUrl()),
  title: {
    default: siteConfig.title,
    template: "%s | Syed Mohammad Ammar",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteUrl() }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  // Indexable, with full-size image previews and no snippet limit in Google.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // All icons carry the DitherAMark "A". The PNG fallbacks are rasterized from
  // favicon.svg; apple-touch-icon is flattened opaque because iOS applies its own mask.
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [OG_IMAGE],
  },
};

// Runs before paint to avoid a flash of the wrong theme.
const themeScript = `
  const theme = localStorage.getItem("theme");
  if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const caseStudies = agentProfile().projects.map((w) => w.slug);
  // WebMCP needs Chrome's origin trial for now: set the token from
  // https://developer.chrome.com/origintrials (WebMCP) in this env var.
  const webMcpTrial = process.env.NEXT_PUBLIC_WEBMCP_ORIGIN_TRIAL;
  // Geist, the body face (see global.css): fetched with the HTML rather than
  // after the CSS. Caveat isn't preloaded (73KB would hold up the first image);
  // its size-matched fallback keeps the swap from shifting the page.
  preload("/fonts/geist-latin-wght-normal.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {webMcpTrial && <meta httpEquiv="origin-trial" content={webMcpTrial} />}
        {/* For AI agents: the llms.txt map of the site, and the agent catalog. */}
        <link rel="describedby" type="text/markdown" href="/llms.txt" />
        <link rel="ai-catalog ard" type="application/json" href="/.well-known/ai-catalog.json" />
        <JsonLd data={siteGraph()} />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <WebMcpTools caseStudies={caseStudies} />
      </body>
    </html>
  );
}
