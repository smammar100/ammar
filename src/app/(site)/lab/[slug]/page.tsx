import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLabEntry } from "@/lib/content";
import { Mdx } from "@/components/Mdx";
import { LAB_DEMOS } from "@/components/lab/demos/registry";

// One page for every component experiment in the Lab: the live demo, then the
// write-up from its content entry. Experiments with their own route
// (pixel-wave, pixel-mark, pixel-scatter, pattern-engine) take precedence
// over this dynamic one; only slugs in the demo registry are built here.

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LAB_DEMOS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getLabEntry(slug);
  return {
    // The root layout's title template adds the site name.
    title: entry?.data.title ?? "Lab",
    description: entry?.data.description,
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getLabEntry(slug);
  const demo = LAB_DEMOS[slug];
  if (!entry || !demo) notFound();
  const { Demo, note } = demo;

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-12 sm:pt-24">
        <Link
          href="/lab"
          className="mb-8 inline-flex items-center gap-1 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Lab
        </Link>

        <h1 className="mb-4 text-4xl font-medium tracking-tight sm:text-5xl">{entry.data.title}</h1>
        <p className="max-w-xl text-lg text-muted-foreground">{entry.data.description}</p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <figure className="m-0">
          <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-xl border border-border bg-card px-4 py-12 sm:px-10">
            <Demo />
          </div>
          {note && <figcaption className="mt-3 text-center text-sm text-muted-foreground">{note}</figcaption>}
        </figure>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="prose">
          <Mdx source={entry.body} format={entry.format} />
        </div>
      </section>
    </>
  );
}
