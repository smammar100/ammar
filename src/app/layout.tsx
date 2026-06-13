import type { Metadata } from "next";
import "@/styles/global.css";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s — Syed Mohammad Ammar",
  },
  description: siteConfig.description,
  // favicon.svg now carries the DitherAMark "A".
  // TODO: the PNG fallbacks (favicon-16x16/32x32, apple-touch-icon) still carry the scaffold's "P" — regenerate them from favicon.svg.
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
    url: siteConfig.url,
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
