import type { ReactNode } from "react";
import { Lightbulb } from "lucide-react";

// Body building blocks for the structured case-study layout, used from MDX.
// String props and children only — next-mdx-remote doesn't reliably pass
// array/object expression props (see Mdx.tsx).

/**
 * Wrapper for a run of <Goal> entries. Stacked on phones, then a row of equal
 * columns that ends flush with the prose measure on either side, so the goals
 * line up with the copy above them instead of overflowing past it.
 */
export function Goals({ children }: { children?: ReactNode }) {
  return (
    <div className="case-goals my-10 flex flex-col gap-8 sm:flex-row sm:gap-5">{children}</div>
  );
}

/**
 * A numbered goal: an oversized ghosted numeral with the heading and body set
 * against it, so the figure reads as texture rather than a bullet.
 * <Goal n="1" title="...">body</Goal>
 */
export function Goal({ n, title, children }: { n?: string; title?: string; children?: ReactNode }) {
  return (
    <div className="group/goal flex items-start gap-1 sm:min-w-0 sm:flex-1 sm:gap-2">
      {/* Negative right margin pulls the text over the numeral so they overlap
          instead of sitting in separate columns. leading is crushed to 0.72 so
          the glyph's optical top lines up with the heading rather than its much
          taller line box. Two stacked copies: the ghosted face, and a gradient
          fill that cross-fades in on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none relative -mr-2 shrink-0 select-none text-[64px] font-black leading-[0.72] tracking-tighter tabular-nums sm:-mr-3 sm:text-[72px]"
      >
        <span className="block text-foreground/[0.08] transition-opacity duration-200 group-hover/goal:opacity-0">
          {n}
        </span>
        <span className="absolute inset-0 bg-gradient-to-br from-accent via-accent/40 to-foreground/30 bg-clip-text text-transparent opacity-0 transition-opacity duration-200 group-hover/goal:opacity-100">
          {n}
        </span>
      </span>
      {/* Pulled up so the heading's cap-top sits level with the numeral's, not its
          box: at leading 0.72 the glyph overflows its own line box upward, so
          matching the two needs a negative offset rather than top padding. The
          required shift measures within 0.2px at both numeral sizes, so one
          value covers 64px and 72px. */}
      <div className="min-w-0 flex-1 -mt-1.5">
        {title && (
          <h3 className="case-goal-title heading-sub leading-snug">
            {title}
          </h3>
        )}
        <div className="case-goal-body mt-2">{children}</div>
      </div>
    </div>
  );
}

/**
 * A sub-feature inside a section: heading, short description, then whatever
 * media or demo the feature is about.
 * <Feature title="...">body + media</Feature>
 */
export function Feature({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <section className="case-feature my-10">
      {title && <h3 className="heading-sub mb-2">{title}</h3>}
      {children}
    </section>
  );
}

/**
 * The one-line framing a case study hangs on, set apart from the body so it
 * reads as the thing to take away rather than another paragraph.
 *
 * Emphasis comes from a bloom of accent bleeding in from the corner rather than
 * from size: the card stays close to body scale, so it sits inside the reading
 * rhythm instead of interrupting it.
 * <HowMightWe>statement</HowMightWe>
 */
export function HowMightWe({ children }: { children?: ReactNode }) {
  return (
    <div className="case-hmw relative my-8 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      {/* The card's only colour. Blurred well past its own box so it reads as
          light falling across the corner rather than as a shape sitting in it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-0 h-28 w-28 rounded-full bg-accent blur-[64px] dark:opacity-60"
      />
      {/* Positioned, so the content paints above the absolute bloom. */}
      <div className="relative flex flex-row items-center gap-2 text-sm font-semibold text-foreground">
        <Lightbulb className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>How might we</span>
      </div>
      <div className="case-hmw-body relative mt-2">{children}</div>
    </div>
  );
}

/**
 * Invisible marker that starts a table-of-contents group. Every heading
 * after it, up to the next marker, is listed under `label` in the floating
 * TOC (see dynamic-island-toc.tsx). Renders nothing visible on the page.
 */
export function TocGroup({ label }: { label?: string }) {
  if (!label) return null;
  return <span data-toc-group={label} hidden />;
}
