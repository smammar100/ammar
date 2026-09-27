"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site-config";
import { DitherAMark } from "@/lab/pixel-mark/DitherMark";
import { ThemeToggleButton } from "./ThemeToggleButton";

const navItems = siteConfig.nav;

/** Whether a nav item is the current page (or a page under it). Shared with the phone menu. */
export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function TopNav() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="topnav hidden md:block sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 lg:gap-4 lg:px-10">

        {/* Left: brand */}
        <div className="flex items-center justify-start">
          <Link
            href="/"
            className="group flex items-center gap-2.5 no-underline"
            aria-label="Syed Mohammad Ammar, Product Designer: home"
          >
            <span className="block h-8 w-8 shrink-0 overflow-hidden rounded-md">
              <DitherAMark size={32} />
            </span>
            <span className="flex min-w-0 flex-col leading-none">
              <span className="text-sm font-medium whitespace-nowrap">Syed Mohammad Ammar</span>
              <span className="mt-0.5 hidden text-xs text-muted-foreground whitespace-nowrap lg:block">Product Designer</span>
            </span>
          </Link>
        </div>

        {/* Center: primary nav */}
        {/* The current page's tab is a raised skeuomorphic button (global.css);
            the others stay text until hovered. */}
        <nav className="flex items-center justify-center gap-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  "flex h-9 items-center rounded-[10px] px-3 text-sm transition-[color,scale] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.96] lg:px-3.5 " +
                  (active ? "skeu font-medium text-foreground" : "text-muted-foreground hover:text-foreground")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: theme. Time and socials live in the footer card. */}
        <div className="flex items-center justify-end">
          <ThemeToggleButton className="size-9 rounded-[10px] [&_svg]:size-4" size={16} />
        </div>

      </div>
    </header>
  );
}

export default TopNav;
