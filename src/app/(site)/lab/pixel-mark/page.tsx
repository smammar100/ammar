import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLabEntry } from "@/lib/content";
import { Mdx } from "@/components/Mdx";
import {
  DitherAMark,
  DitherScaleStrip,
  DitherVariants,
  DitherStates,
  DitherNavSwitcherStates,
} from "@/lab/pixel-mark/DitherMark";

const entry = getLabEntry("pixel-mark");

export const metadata: Metadata = {
  title: `${entry?.data.title ?? "Pixel Mark"} — Syed Mohammad Ammar`,
  description: entry?.data.description,
  robots: { index: false, follow: false },
};

export default function Page() {
  const entry = getLabEntry("pixel-mark");
  if (!entry) notFound();

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-12 sm:pt-24">
        <Link
          href="/lab"
          className="mb-8 inline-flex items-center gap-1 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Lab
        </Link>
        <h1 className="mb-4 text-4xl font-medium tracking-tight sm:text-5xl">
          {entry.data.title}
        </h1>
        <p className="mb-8 max-w-xl text-lg text-muted-foreground">
          {entry.data.description}
        </p>
        <div className="prose">
          <Mdx source={entry.body} format={entry.format} />
        </div>
      </section>

      {/* Hero display — hover to cycle the dither */}
      <section>
        <div className="mx-auto max-w-3xl px-6 pb-16">
          <div className="flex min-h-48 items-center justify-center rounded-lg border border-border bg-card">
            <DitherAMark size={96} />
          </div>
        </div>
      </section>

      {/* Scale system */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="mb-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Scale
          </h2>
          <DitherScaleStrip />
        </div>
      </section>

      {/* Variants */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="mb-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Variants
          </h2>
          <DitherVariants />
        </div>
      </section>

      {/* Interaction states */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="mb-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Interaction States
          </h2>
          <DitherStates />
        </div>
      </section>

      {/* Production nav switcher */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="mb-10 max-w-xl">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Navigation Switcher
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              As a compact sidebar control, hover previews the rail&rsquo;s next
              state — the mark de-resolves to dots before a collapse and sharpens
              to full pixels before an expand.
            </p>
          </div>
          <DitherNavSwitcherStates />
        </div>
      </section>
    </>
  );
}
