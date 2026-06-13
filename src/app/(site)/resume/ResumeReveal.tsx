"use client";

import { useEffect } from "react";
import { animate } from "motion";

// Client-side reveal animations ported from the Astro page <script>.
// Sections start at opacity:0 (set via inline style in the server page) and are
// animated in on mount; timeline entries reveal on scroll via IntersectionObserver.
export function ResumeReveal() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-resume-hero]");
    const intro = document.querySelector<HTMLElement>("[data-resume-intro]");
    const spring = { type: "spring" as const, stiffness: 160, damping: 20, mass: 0.8 };

    if (hero) animate(hero, { opacity: [0, 1], y: [16, 0] }, { ...spring });
    if (intro) animate(intro, { opacity: [0, 1] }, { duration: 0.4, ease: "easeOut", delay: 0.2 });

    const skills = document.querySelector<HTMLElement>("[data-resume-skills]");
    const education = document.querySelector<HTMLElement>("[data-resume-education]");
    if (education) animate(education, { opacity: [0, 1] }, { duration: 0.4, ease: "easeOut", delay: 0.3 });
    if (skills) animate(skills, { opacity: [0, 1] }, { duration: 0.4, ease: "easeOut", delay: 0.35 });

    const entries = document.querySelectorAll<HTMLElement>("[data-timeline-entry]");
    const observer = new IntersectionObserver(
      (observed) => {
        observed.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(
              entry.target as HTMLElement,
              { opacity: [0, 1], y: [10, 0] },
              { type: "spring", stiffness: 140, damping: 18, mass: 0.8 }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    entries.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
