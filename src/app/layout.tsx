import type { Metadata } from "next";
import { preload } from "react-dom";
import "@/styles/global.css";
import { siteConfig } from "@/data/site-config";
import { SOCIAL_LINKS } from "@/data/social";
import { WebMcpTools } from "@/components/agent/WebMcpTools";
import { agentProfile } from "@/lib/agent-profile";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  // The real public origin (see lib/site-url.ts), so social previews and
  // canonical URLs resolve on the live domain.
  metadataBase: new URL(siteUrl()),
  title: {
    default: siteConfig.title,
    template: "%s | Syed Mohammad Ammar",
  },
  description: siteConfig.description,
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
    url: siteUrl(),
    title: siteConfig.title,
    description: siteConfig.description,
    // TODO: replace with a photo of Ammar — current file is the scaffold's placeholder (also used by the twitter card below).
    images: ["/images/brand/profile-picture.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/images/brand/profile-picture.jpg"],
  },
};

// Runs before paint to avoid a flash of the wrong theme.
const themeScript = `
  const theme = localStorage.getItem("theme");
  if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
`;

/**
 * Structured data for search engines and AI agents: Ammar as a Person, his
 * practice as a ProfessionalService offering the two services, and the site.
 * Only facts the site states.
 */
function structuredData() {
  const p = agentProfile();
  const base = p.links.site;
  const person = `${base}/#person`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": person,
        name: p.name,
        url: base,
        email: `mailto:${p.contact.email}`,
        jobTitle: "Product Designer",
        description: p.summary,
        address: { "@type": "PostalAddress", addressLocality: p.location.city, addressCountry: "PK" },
        worksFor: { "@type": "Organization", name: "Mahaana" },
        alumniOf: p.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
        knowsAbout: [...p.skills.design, ...p.skills.build, ...p.skills.domains],
        sameAs: SOCIAL_LINKS.map((s) => s.href),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${base}/#service`,
        name: `${p.name}: product design and web development`,
        url: base,
        email: p.contact.email,
        founder: { "@id": person },
        address: { "@type": "PostalAddress", addressLocality: p.location.city, addressCountry: "PK" },
        areaServed: "Worldwide",
        makesOffer: p.services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.name, description: s.description, provider: { "@id": person } },
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: p.name,
        publisher: { "@id": person },
      },
    ],
  };
}

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c") }} />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <WebMcpTools caseStudies={caseStudies} />
      </body>
    </html>
  );
}
