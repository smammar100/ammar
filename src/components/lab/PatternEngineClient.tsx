"use client";

import dynamic from "next/dynamic";

// The Pattern Engine tool reads window/URL state on init and renders to canvas;
// it was a client:only="react" island in Astro. Load it client-only so it never
// runs during SSR (RSC pages can't pass ssr:false directly).
const PatternEngine = dynamic(() => import("@/lab/editorial-art/index"), {
  ssr: false,
});

export function PatternEngineClient() {
  return <PatternEngine />;
}
