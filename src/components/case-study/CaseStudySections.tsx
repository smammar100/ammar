import type { ReactNode } from "react";

// Body building blocks for the structured case-study layout, used from MDX.
// String props and children only — next-mdx-remote doesn't reliably pass
// array/object expression props (see Mdx.tsx).

/** Wrapper for a run of <Goal> entries. */
export function Goals({ children }: { children?: ReactNode }) {
  return <div className="case-goals my-8 flex flex-col gap-8">{children}</div>;
}

/**
 * A numbered goal: big numeral in a ring, heading, then the prose body.
 * <Goal n="1" title="...">body</Goal>
 */
export function Goal({ n, title, children }: { n?: string; title?: string; children?: ReactNode }) {
  return (
    <div className="flex gap-4 sm:gap-5">
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-white font-mono text-xs text-neutral-600"
      >
        {n}
      </span>
      <div className="min-w-0 flex-1">
        {/* leading-8 matches the numeral's height, so the numeral centres on the
            title's FIRST line and stays put when the title wraps. */}
        {title && (
          <h3 className="case-goal-title text-base font-semibold leading-8 tracking-tight text-foreground">
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
