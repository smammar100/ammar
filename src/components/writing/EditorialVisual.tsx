"use client";

import dynamic from "next/dynamic";
import type { WritingVisual } from "@/lib/content";

// LiveEditorialVisual renders to a <canvas> and cannot SSR (was client:only="react"
// in Astro). Load it client-only.
const LiveEditorialVisual = dynamic(
  () => import("@/lab/editorial-art/LiveEditorialVisual").then((m) => m.LiveEditorialVisual),
  { ssr: false }
);

export function EditorialVisual({ visual }: { visual: WritingVisual }) {
  // The lab island types `visual` against its own GeneratorConfig union; the
  // content-layer WritingVisual is structurally compatible at runtime.
  return <LiveEditorialVisual visual={visual as never} />;
}
