import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWriting, getWritingEntry, type WritingVisual } from "@/lib/content";
import { Mdx } from "@/components/Mdx";
import { Badge } from "@/components/ui/badge";
import { EditorialVisual } from "@/components/writing/EditorialVisual";

export function generateStaticParams() {
  return getWriting(true).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getWritingEntry(slug);
  if (!entry) return {};
  return {
    title: entry.data.title,
    description: entry.data.description,
  };
}

// ── Visual caption / tool-link helpers (folded in from WritingLayout.astro) ──
type Generator = Record<string, unknown> & { type: string; seed?: number };

function generatorLabel(type: string): string {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function visualCaption(visual: WritingVisual): string {
  const generator = visual.generator as Generator;
  if (generator.type === "flow-field") {
    return `${generatorLabel(generator.type)} · seed ${generator.seed} · density ${generator.density} · scale ${generator.scale}`;
  }
  if (generator.type === "dot-grid") {
    return `${generatorLabel(generator.type)} · seed ${generator.seed} · spacing ${generator.spacing}px · size ${generator.dotSize}%`;
  }
  if (generator.type === "isoline") {
    return `${generatorLabel(generator.type)} · seed ${generator.seed} · levels ${generator.levels} · scale ${generator.scale}`;
  }
  if (generator.type === "voronoi") {
    return `${generatorLabel(generator.type)} · seed ${generator.seed} · cells ${generator.count} · jitter ${generator.jitter}%`;
  }
  return `${generatorLabel(generator.type)} · seed ${generator.seed}`;
}

function addParam(params: URLSearchParams, key: string, value: unknown): void {
  if (value === undefined || value === null || value === "") return;
  params.set(key, String(value));
}

function addParams(params: URLSearchParams, entries: [string, unknown][]): void {
  for (const [key, value] of entries) addParam(params, key, value);
}

function visualToolHref(visual: WritingVisual): string {
  const generator = visual.generator as Generator;
  const params = new URLSearchParams();

  addParams(params, [
    ["bg", visual.background],
    ["generator", generator.type],
    ["seed", generator.seed],
    ["color", generator.color],
    ["opacity", generator.opacity],
    ["texture", visual.texture],
    ["grain", visual.grain],
  ]);

  if (generator.type === "flow-field") {
    addParams(params, [
      ["density", generator.density],
      ["steps", generator.steps],
      ["scale", generator.scale],
      ["curl", generator.curl],
      ["strokeWidth", generator.strokeWidth],
    ]);
  }
  if (generator.type === "dot-grid") {
    addParams(params, [
      ["spacing", generator.spacing],
      ["scale", generator.scale],
      ["dotSize", generator.dotSize],
    ]);
  }
  if (generator.type === "isoline") {
    addParams(params, [
      ["levels", generator.levels],
      ["scale", generator.scale],
      ["strokeWidth", generator.strokeWidth],
    ]);
  }
  if (generator.type === "voronoi") {
    addParams(params, [
      ["count", generator.count],
      ["jitter", generator.jitter],
      ["strokeWidth", generator.strokeWidth],
    ]);
  }

  const query = params.toString();
  return query ? `/lab/pattern-engine?${query}` : "/lab/pattern-engine";
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getWritingEntry(slug);
  if (!entry) notFound();

  const { title, description, publishedDate, theme, visual, image } = entry.data;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Back link */}
      <Link
        href="/writing"
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
        Writing
      </Link>

      {/* Header */}
      <header className="mb-12">
        <h1 className="mb-3 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mb-5 text-lg leading-snug text-muted-foreground">{description}</p>
        <div className="flex flex-wrap items-center gap-3">
          <time
            dateTime={publishedDate.toISOString()}
            className="font-mono text-sm text-muted-foreground"
          >
            {publishedDate.toLocaleDateString("en-US", {
              timeZone: "UTC",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          {theme && (
            <>
              <span className="h-3.5 w-px bg-border" aria-hidden="true"></span>
              <Badge variant="secondary" className="font-mono text-xs">
                {theme}
              </Badge>
            </>
          )}
        </div>
      </header>

      {/* Hero image */}
      {visual && (
        <figure className="mb-12">
          <div className="relative aspect-[1200/630] overflow-hidden rounded-lg border border-border bg-card">
            <EditorialVisual visual={visual} />
          </div>
          <figcaption className="mt-2 font-mono text-xs text-muted-foreground">
            {visualCaption(visual)} · generated with the{" "}
            <a
              href={visualToolHref(visual)}
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Pattern Engine
            </a>
          </figcaption>
        </figure>
      )}
      {image && !visual && (
        <figure className="mb-12">
          <div className="relative aspect-[1200/630] overflow-hidden rounded-lg border border-border bg-card">
            <img src={image} alt={title} className="h-full w-full object-cover" />
          </div>
          <figcaption className="mt-2 font-mono text-xs text-muted-foreground">
            Image by Patrick Morgan, created with Midjourney
          </figcaption>
        </figure>
      )}

      {/* Markdown body */}
      <div className="prose">
        <Mdx source={entry.body} format={entry.format} />
      </div>
    </article>
  );
}
