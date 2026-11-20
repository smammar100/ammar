"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * The second half of the hero's once-per-session intro. On a full page load
 * the inline script in AnnotatedHero decides before first paint and marks the
 * hero as checked. This covers arriving by client-side navigation, where
 * inline scripts don't run: a layout effect, so it lands before the hero is
 * painted. Either way, a hero that has been seen this session loses its
 * data-build attribute and renders finished.
 */
export function HeroIntro({ storageKey }: { storageKey: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const hero = ref.current?.closest<HTMLElement>("[data-hero-intro]");
    if (!hero || hero.dataset.introChecked) return;
    hero.dataset.introChecked = "1";
    try {
      if (sessionStorage.getItem(storageKey)) hero.removeAttribute("data-build");
      else sessionStorage.setItem(storageKey, "1");
    } catch {
      // Storage blocked (private mode, sandboxed frame): let the intro play.
    }
  }, [storageKey]);

  return <span ref={ref} hidden />;
}
