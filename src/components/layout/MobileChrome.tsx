"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { Logo } from "./Logo";
import { ThemeToggleButton } from "./ThemeToggleButton";

const elsewhere = [
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "GitHub", href: siteConfig.social.github },
  { label: "X", href: siteConfig.social.x },
  { label: "CodePen", href: siteConfig.social.codepen },
].filter((item) => item.href);

/** Mobile top bar + full-screen nav overlay (replaces Header.astro + MobileNav.astro). */
export function MobileChrome() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="block no-underline" aria-label="Home">
            <Logo className="h-7 w-7" />
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggleButton className="h-8 w-8" size={16} />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Open navigation"
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen overlay */}
      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-[100] flex flex-col bg-background md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
            <Link href="/" className="block no-underline" aria-label="Home" onClick={() => setOpen(false)}>
              <Logo className="h-7 w-7" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close navigation"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center px-8" aria-label="Main navigation">
            <ul className="flex flex-col">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-border/50 py-3 text-[1.65rem] font-medium leading-tight text-muted-foreground transition-colors last:border-0 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-border px-8 py-6">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
              {elsewhere.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-1 text-base text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                    <svg className="h-3.5 w-3.5 shrink-0 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileChrome;
