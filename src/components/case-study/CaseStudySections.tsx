import type { ReactNode } from "react";

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
      <div className="min-w-0 flex-1 pt-1 sm:pt-2">
        {title && (
          <h3 className="case-goal-title text-base font-semibold leading-snug tracking-tight text-foreground">
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
      {title && <h3 className="mb-2 text-base font-semibold tracking-tight text-foreground">{title}</h3>}
      {children}
    </section>
  );
}
