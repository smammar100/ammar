"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { ArticleListItem } from "@/components/ArticleListItem";
import { cn } from "@/lib/utils";

export interface WritingIndexPost {
  slug: string;
  title: string;
  description: string;
  publishedDate: Date;
  theme?: string;
}

interface Props {
  posts: WritingIndexPost[];
  filterThemes: string[];
  themeCounts: Record<string, number>;
}

export function WritingIndexClient({ posts, filterThemes, themeCounts }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    const spring = { type: "spring" as const, stiffness: 160, damping: 20, mass: 0.8 };
    if (heroRef.current) animate(heroRef.current, { opacity: [0, 1], y: [16, 0] }, { ...spring });
    if (listRef.current)
      animate(listRef.current, { opacity: [0, 1] }, { duration: 0.4, ease: "easeOut", delay: 0.2 });
  }, []);

  return (
    <>
      {/* Hero */}
      <section
        ref={heroRef}
        className="mx-auto max-w-3xl px-6 pt-12 pb-16 sm:pt-24 sm:pb-12"
        style={{ opacity: 0 }}
      >
        <h1 className="mb-4 text-4xl font-medium tracking-tight sm:text-5xl">Writing</h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Notes from the design-engineering run. Short summaries live here; the full pieces are
          on{" "}
          <a
            href="https://medium.com/@mrammarbest110"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
          >
            Medium
          </a>
          .
        </p>
        {filterThemes.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2" aria-label="Filter articles by theme">
            <button
              type="button"
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:border-foreground hover:text-foreground aria-pressed:bg-muted aria-pressed:text-foreground"
              aria-pressed={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
            >
              All <span className="text-muted-foreground/70">{posts.length}</span>
            </button>
            {filterThemes.map((theme) => (
              <button
                key={theme}
                type="button"
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:border-foreground hover:text-foreground aria-pressed:bg-muted aria-pressed:text-foreground"
                aria-pressed={activeFilter === theme}
                onClick={() => setActiveFilter(theme)}
              >
                {theme} <span className="text-muted-foreground/70">{themeCounts[theme]}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Articles */}
      <section ref={listRef} className="mx-auto max-w-3xl px-6 pb-24" style={{ opacity: 0 }}>
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <div
              key={post.slug}
              data-theme={post.theme}
              className={cn(
                activeFilter !== "all" && post.theme !== activeFilter && "hidden"
              )}
            >
              <ArticleListItem
                id={post.slug}
                title={post.title}
                description={post.description}
                publishedDate={post.publishedDate}
                theme={post.theme}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
