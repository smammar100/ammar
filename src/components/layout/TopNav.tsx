"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site-config";
import { DitherAMark } from "@/lab/pixel-mark/DitherMark";
import { LocalTime } from "./LocalTime";
import { ThemeToggleButton } from "./ThemeToggleButton";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Lab", href: "/lab" },
  { label: "Writing", href: "/writing" },
  { label: "Community", href: "/community" },
];

const elsewhere: { label: string; href: string; path: string }[] = [
  {
    label: "Substack",
    href: siteConfig.social.newsletter,
    path: "M20.6 8.242H1.46V5.406H20.6v2.836zM1.46 10.812V24l9.6-5.55 9.54 5.55V10.812H1.46zM20.6 0H1.46v2.836H20.6V0z",
  },
  {
    label: "LinkedIn",
    href: siteConfig.social.linkedin,
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "X",
    href: siteConfig.social.x,
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "GitHub",
    href: siteConfig.social.github,
    path: "M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z",
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function TopNav() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="topnav hidden md:block sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 lg:gap-4 lg:px-10">

        {/* Left: brand */}
        <div className="flex items-center justify-start">
          <Link href="/" className="group flex items-center gap-2.5 no-underline" aria-label="Home">
            <span className="block h-8 w-8 shrink-0 overflow-hidden rounded-md">
              <DitherAMark size={32} />
            </span>
            <span className="flex min-w-0 flex-col leading-none">
              <span className="text-sm font-medium whitespace-nowrap">Syed Mohammad Ammar</span>
              <span className="mt-0.5 hidden text-xs text-muted-foreground whitespace-nowrap lg:block">Design Engineer</span>
            </span>
          </Link>
        </div>

        {/* Center: primary nav */}
        <nav className="flex items-center justify-center gap-0.5" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                "rounded-md px-2.5 py-2 text-sm transition-colors duration-200 lg:px-3 " +
                (isActive(pathname, item.href)
                  ? "bg-secondary text-secondary-foreground font-medium"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground")
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: time, socials, theme */}
        <div className="flex items-center justify-end gap-1">
          <span className="mr-1 hidden font-mono text-xs text-muted-foreground tabular-nums whitespace-nowrap lg:inline">
            PK&nbsp;&middot;&nbsp;<LocalTime />
          </span>

          <ul className="flex items-center gap-0.5">
            {elsewhere.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={item.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <span className="mx-1 hidden h-5 w-px bg-border lg:block" aria-hidden="true" />

          <ThemeToggleButton className="h-8 w-8" size={18} />
        </div>

      </div>
    </header>
  );
}

export default TopNav;
