import type { Metadata } from "next";
import { getLab } from "@/lib/content";
import { LabCard } from "@/components/lab/LabCard";

export const metadata: Metadata = {
  title: "Lab — Syed Mohammad Ammar",
  description: "Tools, experiments, and interaction showcases.",
  robots: { index: false, follow: false },
};

const preferredOrder = ["pixel-mark", "pattern-engine", "pixel-wave"];

export default async function Page() {
  const entries = getLab().sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a.data.slug);
    const bIndex = preferredOrder.indexOf(b.data.slug);
    if (aIndex !== -1 || bIndex !== -1) {
      return (
        (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) -
        (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex)
      );
    }
    return a.data.title.localeCompare(b.data.title);
  });

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-16 sm:pt-24 sm:pb-12">
        <h1 className="mb-4 text-4xl font-medium tracking-tight sm:text-5xl">Lab</h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          A gallery of tools, experiments, and interactions I&rsquo;ve built.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {entries.map((entry) => (
            <LabCard
              key={entry.data.slug}
              title={entry.data.title}
              description={entry.data.description}
              href={`/lab/${entry.data.slug}`}
              preview={entry.data.preview}
            />
          ))}
        </div>
      </section>
    </>
  );
}
