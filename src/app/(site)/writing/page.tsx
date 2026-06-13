import type { Metadata } from "next";
import { getWriting } from "@/lib/content";
import {
  WritingIndexClient,
  type WritingIndexPost,
} from "@/components/writing/WritingIndexClient";

export const metadata: Metadata = {
  title: "Writing — Syed Mohammad Ammar",
  description:
    "Notes from Ammar's design-engineering run — AI-assisted design workflows, written up on Medium and summarized here.",
};

const FILTER_THEMES = ["AI", "Design", "Systems Thinking", "Creative Practice", "Career"];

export default async function Page() {
  const entries = getWriting();

  const posts: WritingIndexPost[] = entries.map((entry) => ({
    slug: entry.slug,
    title: entry.data.title,
    description: entry.data.description,
    publishedDate: entry.data.publishedDate,
    theme: entry.data.theme,
  }));

  const themeCounts = posts.reduce<Record<string, number>>((counts, post) => {
    if (!post.theme) return counts;
    counts[post.theme] = (counts[post.theme] ?? 0) + 1;
    return counts;
  }, {});

  const filterThemes = FILTER_THEMES.filter((theme) => themeCounts[theme] !== undefined);

  return (
    <WritingIndexClient posts={posts} filterThemes={filterThemes} themeCounts={themeCounts} />
  );
}
