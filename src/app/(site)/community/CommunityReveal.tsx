"use client";

import { useEffect } from "react";
import { animate } from "motion";
import { observeSections } from "@/scripts/scroll-entrance";

// Client-side reveal animations ported from the Astro page <script>.
// Sections start at opacity:0 (set via inline style in the server page) and are
// animated in on mount; kind-words items reveal on scroll via observeSections.
export function CommunityReveal() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-community-hero]");
    const story = document.querySelector<HTMLElement>("[data-community-story]");
    const words = document.querySelector<HTMLElement>("[data-community-words]");
    const spring = { type: "spring" as const, stiffness: 160, damping: 20, mass: 0.8 };

    if (hero) animate(hero, { opacity: [0, 1], y: [16, 0] }, { ...spring });
    if (story) animate(story, { opacity: [0, 1], y: [12, 0] }, { ...spring, delay: 0.08 });
    if (words) animate(words, { opacity: [0, 1] }, { duration: 0.4, ease: "easeOut", delay: 0.2 });

    observeSections("[data-kind-words-item]", { yOffset: 10, stagger: 0.04 });
  }, []);

  return null;
}
