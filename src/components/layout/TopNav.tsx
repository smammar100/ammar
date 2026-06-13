"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site-config";
import { DitherAMark } from "@/lab/pixel-mark/DitherMark";
import { LocalTime } from "./LocalTime";
import { ThemeToggleButton } from "./ThemeToggleButton";

const navItems = siteConfig.nav;

const elsewhere: { label: string; href: string; path: string }[] = [
  {
    label: "LinkedIn",
    href: siteConfig.social.linkedin,
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "GitHub",
    href: siteConfig.social.github,
    path: "M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z",
  },
  {
    label: "X",
    href: siteConfig.social.x,
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "CodePen",
    href: siteConfig.social.codepen,
    path: "M24 8.182l-.018-.087-.017-.05c-.01-.024-.018-.05-.03-.075-.003-.018-.015-.034-.02-.05l-.035-.067-.03-.05-.044-.06-.046-.045-.06-.045-.046-.03-.06-.044-.044-.04-.015-.02L12.58.19c-.347-.232-.796-.232-1.142 0L.453 7.502l-.015.015-.044.035-.06.05-.038.04-.05.056-.037.045-.05.06c-.02.017-.03.03-.03.046l-.05.06-.02.06c-.02.01-.02.04-.03.07l-.01.05C0 8.12 0 8.15 0 8.18v7.497c0 .044.003.09.01.135l.01.046c.005.03.01.06.02.086l.015.05c.01.027.016.053.027.075l.022.05c0 .01.015.04.03.06l.03.04c.015.01.03.04.045.06l.03.04.04.04c.01.013.01.03.03.03l.06.042.04.03.01.014 10.97 7.33c.164.12.375.163.57.163s.39-.06.57-.18l10.99-7.28.014-.01.046-.037.06-.043.048-.036.052-.058.033-.045.04-.06.03-.05.03-.07.016-.052.03-.077.015-.045.03-.08v-7.5c0-.05 0-.095-.016-.14l-.014-.045.044.003zm-11.99 6.28l-3.65-2.44 3.65-2.442 3.65 2.44-3.65 2.44zm-1.034-6.674l-4.473 2.99L2.89 8.362l8.086-5.39V7.79zm-6.33 4.233l-2.582 1.73V10.3l2.582 1.726zm1.857 1.25l4.473 2.99v4.82L2.89 15.69l3.618-2.417v-.004zm6.537 2.99l4.474-2.98 3.613 2.42-8.087 5.39v-4.82zm6.33-4.23l2.583-1.72v3.456l-2.583-1.73zm-1.855-1.24L13.042 7.8V2.97l8.085 5.39-3.612 2.415v.003z",
  },
];

const socialItems = elsewhere.filter((item) => item.href);

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
            {socialItems.map((item) => (
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
