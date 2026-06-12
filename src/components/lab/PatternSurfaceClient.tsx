"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { GenerativePatternSurface as GenerativePatternSurfaceType } from "@/lab/editorial-art/GenerativePatternSurface";

// GenerativePatternSurface renders to a <canvas> and was a client:only="react"
// island in Astro — it must not SSR. RSC pages cannot pass ssr:false, so this
// thin client wrapper loads it client-only.
const GenerativePatternSurface = dynamic(
  () => import("@/lab/editorial-art/GenerativePatternSurface").then((m) => m.GenerativePatternSurface),
  { ssr: false }
);

export function PatternSurfaceClient(
  props: ComponentProps<typeof GenerativePatternSurfaceType>
) {
  return <GenerativePatternSurface {...props} />;
}
