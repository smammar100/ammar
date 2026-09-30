import { pageMetadata } from "@/lib/metadata";
import { getLabEntry } from "@/lib/content";
import { PatternEngineClient } from "@/components/lab/PatternEngineClient";

const entry = getLabEntry("pattern-engine");

export const metadata = pageMetadata({
  title: entry?.data.title ?? "Pattern Engine",
  description:
    entry?.data.description ??
    "A deterministic pattern generator for writing, publishing, and site visuals.",
  path: "/lab/pattern-engine",
});

// The (tool) group layout already provides the TopNav and full-bleed shell.
// This page renders only the tool's inner content.
export default function Page() {
  return (
    <div className="lab-tool-fade">
      <PatternEngineClient />
      <style>{`
        .lab-tool-fade {
          min-height: calc(100dvh - 3.5rem);
          animation: lab-tool-in 0.5s ease-out both;
        }
        @media (min-width: 48rem) {
          /* Desktop top nav is 4rem tall */
          .lab-tool-fade { min-height: calc(100dvh - 4rem); }
        }
        @keyframes lab-tool-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lab-tool-fade { animation: none; }
        }
      `}</style>
    </div>
  );
}
