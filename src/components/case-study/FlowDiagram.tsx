import { cn } from "@/lib/utils";

export interface FlowNode {
  label: string;
  sub?: string;
}

interface FlowDiagramProps {
  /** Ordered nodes, rendered left→right (or top→bottom on small screens). */
  nodes: (FlowNode | string)[];
  /** Optional caption shown beneath the diagram. */
  caption?: string;
  /** Visual tone — "muted" for the legacy/before stack, "accent" for the after stack. */
  tone?: "muted" | "accent";
}

function toNode(node: FlowNode | string): FlowNode {
  return typeof node === "string" ? { label: node } : node;
}

// Branded architecture flow: labelled cards joined by arrows. Presentational
// only (no hooks) so it renders under MDXRemote/rsc. Stacks vertically on small
// screens, flows horizontally from sm+.
export function FlowDiagram({ nodes = [], caption, tone = "muted" }: FlowDiagramProps) {
  const items = nodes.map(toNode);
  const isAccent = tone === "accent";

  return (
    <figure className="case-figure my-8">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {items.map((node, i) => (
          <div key={i} className="flex flex-col items-stretch sm:flex-1 sm:flex-row sm:items-center">
            <div
              className={cn(
                "flex flex-1 flex-col justify-center rounded-lg border bg-card px-4 py-3.5 text-center transition-colors",
                isAccent
                  ? "border-accent/40 bg-accent/[0.06]"
                  : "border-border",
              )}
            >
              <span className="font-mono text-[13px] font-medium leading-snug tracking-tight text-foreground">
                {node.label}
              </span>
              {node.sub && (
                <span className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {node.sub}
                </span>
              )}
            </div>
            {i < items.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "flex shrink-0 items-center justify-center py-1 sm:px-2 sm:py-0",
                  isAccent ? "text-accent" : "text-muted-foreground/60",
                )}
              >
                {/* Down arrow on mobile, right arrow on sm+ */}
                <svg className="h-4 w-4 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
                <svg className="hidden h-4 w-4 sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>
      {caption && <figcaption className="mt-3 text-center text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

// Zero-prop presets for MDX. next-mdx-remote doesn't reliably pass array-of-object
// expression props, so the Mahaana before/after stacks are baked in here and used
// as <ArchitectureBefore /> / <ArchitectureAfter /> in the case study.
export function ArchitectureBefore() {
  return (
    <FlowDiagram
      tone="muted"
      caption="Before: live fund data leaned on fragile custom scripts wired into Webflow."
      nodes={[
        { label: "Webflow", sub: "Site" },
        { label: "Custom Scripts", sub: "JS Workarounds" },
        { label: "Live Fund APIs", sub: "NAVs" },
      ]}
    />
  );
}

export function ArchitectureAfter() {
  return (
    <FlowDiagram
      tone="accent"
      caption="After: content and fund data flow cleanly through the Next.js app to the customer."
      nodes={[
        { label: "Sanity CMS + Fund APIs", sub: "Content & Data" },
        { label: "Next.js Application", sub: "Front-end" },
        { label: "Customer", sub: "Experience" },
      ]}
    />
  );
}

export default FlowDiagram;
