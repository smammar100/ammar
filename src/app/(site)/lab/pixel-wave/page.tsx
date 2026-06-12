import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLabEntry } from "@/lib/content";
import { Mdx } from "@/components/Mdx";
import { PixelWaveDemo } from "@/components/lab/PixelWaveDemo";

const entry = getLabEntry("pixel-wave");

export const metadata: Metadata = {
  title: `${entry?.data.title ?? "Pixel Wave"} — Syed Mohammad Ammar`,
  description: entry?.data.description,
  robots: { index: false, follow: false },
};

export default function Page() {
  const entry = getLabEntry("pixel-wave");
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
        <p className="max-w-xl text-lg text-muted-foreground">
          {entry.data.description}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="grid gap-8">
          <PixelWaveDemo />

          <div>
            <div className="prose mb-6">
              <Mdx source={entry.body} format={entry.format} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
