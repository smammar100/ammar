"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site-config";
import { SocialButtons, StatusDot } from "@/components/ui/skeu";
import { cn } from "@/lib/utils";
import { FoldMenu, primeFoldSound } from "./FoldMenu";
import { LocalTime } from "./LocalTime";
import { Logo } from "./Logo";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { isActive } from "./TopNav";

// The bar's icon buttons: the skeuomorphic material at 36px with 16px icons.
const iconButton = "skeu skeu-press skeu-icon size-9 rounded-[10px] [&_svg]:size-4";

const REACH_OUT = `mailto:${siteConfig.social.email}?subject=${encodeURIComponent("New project")}`;

/**
 * The phone header: logo, theme toggle and a menu button whose bars turn into
 * an X. The menu folds down from under the bar (FoldMenu, after Makisu): one
 * panel per page, then a contact panel. It's a disclosure, not a dialog: the
 * page behind is dimmed and doesn't scroll, and the menu closes on Escape, a
 * tap outside it, following a link, tabbing past it, or widening to desktop.
 */
export function MobileChrome() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  // Stays true while the panels fold back up, so they're seen doing it.
  const [folding, setFolding] = useState(false);
  const visible = open || folding;
  const button = useRef<HTMLButtonElement>(null);
  const isOpen = useRef(open);
  isOpen.current = open;

  const close = useCallback((refocus = false) => {
    if (isOpen.current) {
      primeFoldSound();
      setOpen(false);
      setFolding(true);
    }
    if (refocus) button.current?.focus();
  }, []);

  const toggle = () => {
    if (open) return close();
    // Inside the tap, so iOS lets the fold's sound play.
    primeFoldSound();
    setOpen(true);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    // The menu is phone-only; widening past it would leave the page locked.
    // Tailwind's md exactly (48rem follows the browser's font size, so it
    // isn't always 768px), checked now as well as on change.
    const desktop = window.matchMedia("(width >= 48rem)");
    const onWide = () => desktop.matches && close();
    onWide();
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onWide);
    };
  }, [open, close]);

  // Back/forward can change the page without a tap on the menu.
  useEffect(() => close(), [pathname, close]);

  // Tabbing out of the bar and menu closes it. Only when focus lands somewhere
  // else: a tap on a panel's padding blurs to nothing and shouldn't close it.
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    const next = e.relatedTarget as Node | null;
    if (open && next && !e.currentTarget.contains(next)) close();
  };

  const panels = [
    ...siteConfig.nav.map((item, i) => {
      const active = isActive(pathname, item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => close()}
          aria-current={active ? "page" : undefined}
          className={cn(
            // The ring sits inside: the scroll box would clip one outside.
            "group flex h-16 items-center gap-4 px-4 no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
            i > 0 && "border-t border-dashed border-border",
          )}
        >
          <span className="text-2xl font-medium tracking-tight text-foreground">{item.label}</span>
          {active ? (
            <span className="ml-auto font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
              Current
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="ml-auto text-lg text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          )}
        </Link>
      );
    }),
    // Nav-height, like the pages above it: see FoldMenu on panel heights.
    <p key="status" className="flex h-16 items-center gap-2 border-t border-dashed border-border px-4 text-sm text-muted-foreground">
      <StatusDot />
      Open to new projects
      <span className="ml-auto font-mono text-xs tabular-nums">
        Karachi <LocalTime />
      </span>
    </p>,
    <div key="contact" className="px-4 pt-1 pb-5">
      <div className="flex items-center gap-2.5">
        <a href={REACH_OUT} className="group skeu skeu-press skeu-button min-w-0 flex-1">
          Reach out
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            ↗
          </span>
        </a>
        <SocialButtons className="flex-nowrap" />
      </div>
    </div>,
  ];

  return (
    <header
      // Raised while the menu shows, as the old full-screen overlay was, so
      // it clears anything a page adds at z-50 (Pattern Engine's controls).
      className={cn(
        "md:hidden sticky top-0 border-b border-border bg-background/80 backdrop-blur-sm",
        visible ? "z-[100]" : "z-50",
      )}
      onBlur={onBlur}
    >
      <div className="flex h-14 items-center justify-between px-4">
        {/* Padded out to a 40px tap target without moving the logo. The
            desktop nav's brand, with the name shortened to fit a phone. */}
        <Link
          href="/"
          className="-m-1.5 flex min-w-0 items-center gap-2.5 p-1.5 no-underline"
          aria-label="SMAmmar (Syed Mohammad Ammar), Product Designer: home"
          onClick={() => close()}
        >
          <Logo className="h-7 w-7 shrink-0" />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate text-sm font-medium">SMAmmar</span>
            <span className="mt-0.5 truncate text-xs text-muted-foreground">Product Designer</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {/* The CSS icon size beats lucide's size attribute, so size it here too. */}
          <ThemeToggleButton className="size-9 rounded-[10px] [&_svg]:size-4" size={16} />
          <button
            ref={button}
            type="button"
            onClick={toggle}
            className={iconButton}
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <svg
              className="menu-icon"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hangs from the bar's bottom border and fills the rest of the screen:
          a dimmed backdrop, with the panels in a box that scrolls if they
          outgrow a short screen and clips them where they fold up behind
          the bar. Hidden and inert once folded away. */}
      <div
        id="mobile-nav"
        className={cn("absolute inset-x-0 top-[calc(100%+1px)] h-[calc(100dvh-100%-1px)]", !visible && "invisible")}
        // Inert from the moment it closes, so while it folds away it can't be
        // tabbed into, read out or tapped: taps go through to the page.
        inert={!open}
      >
        <div
          aria-hidden="true"
          onClick={() => close()}
          className={cn(
            "absolute inset-0 bg-black/20 transition-opacity duration-300 dark:bg-black/50",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <nav
          aria-label="Main navigation"
          className="relative max-h-full overflow-x-hidden overflow-y-auto overscroll-contain"
        >
          <FoldMenu open={open} panels={panels} onFolded={() => setFolding(false)} />
        </nav>
      </div>
    </header>
  );
}

export default MobileChrome;
