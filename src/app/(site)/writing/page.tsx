import { pageMetadata } from "@/lib/metadata";
import { getWriting } from "@/lib/content";
import {
  WritingIndexClient,
  type WritingIndexPost,
} from "@/components/writing/WritingIndexClient";

export const metadata = pageMetadata({
  title: "Writing",
  description:
    "Notes from Ammar's design-engineering run: AI-assisted design workflows, written up on Medium and summarized here.",
  path: "/writing",
});

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
