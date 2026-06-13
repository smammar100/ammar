import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// ── Content layer ────────────────────────────────────────────────────────────
// Replaces Astro's `astro:content` collections. Reads markdown/MDX from
// src/content/{projects,writing,lab}, parses frontmatter with gray-matter, and
// returns typed entries. `slug` is the filename without extension (the old
// Astro `entry.id`). Body MDX is returned raw for <Mdx> to compile.

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

export interface ProjectData {
  title: string;
  type: "professional" | "personal" | "experiment";
  description: string;
  skills: string[];
  thumbnail?: string;
  thumbnailDark?: string;
  thumbnailWide?: string;
  thumbnailWideDark?: string;
  heroImage?: string;
  sortOrder: number;
  draft: boolean;
}

export interface WritingVisual {
  version: 1;
  theme: string;
  background: string;
  generator: Record<string, unknown> & { type: string };
  lightMode?: { color: string; opacity: number; strokeWidth?: number };
  texture: number;
  grain: number;
}

export interface WritingData {
  title: string;
  description: string;
  publishedDate: Date;
  categories: string[];
  theme?: string;
  tags: string[];
  visual?: WritingVisual;
  image?: string;
  canonicalUrl?: string;
  draft: boolean;
}

export interface LabData {
  title: string;
  description: string;
  slug: string;
  preview: string;
  experience: "app" | "demo";
  draft: boolean;
}

export interface Entry<T> {
  /** filename without extension — equivalent to Astro's entry.id */
  slug: string;
  data: T;
  body: string;
  /** source format — drives the MDX vs CommonMark parser in <Mdx> */
  format: "md" | "mdx";
}

function readCollection(
  dir: string,
): { slug: string; data: Record<string, unknown>; body: string; format: "md" | "mdx" }[] {
  const root = path.join(CONTENT_ROOT, dir);
  if (!fs.existsSync(root)) return [];
  const files = fs.readdirSync(root).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(root, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug: file.replace(/\.mdx?$/, ""),
      data,
      body: content,
      format: file.endsWith(".mdx") ? "mdx" : "md",
    };
  });
}

export function getProjects(includeDrafts = false): Entry<ProjectData>[] {
  return readCollection("projects")
    .map((e) => ({ slug: e.slug, body: e.body, format: e.format, data: { draft: false, ...e.data } as unknown as ProjectData }))
    .filter((e) => includeDrafts || !e.data.draft);
}

export function getProject(slug: string): Entry<ProjectData> | undefined {
  return getProjects(true).find((e) => e.slug === slug);
}

export function getWriting(includeDrafts = false): Entry<WritingData>[] {
  return readCollection("writing")
    .map((e) => {
      const data = e.data as Record<string, unknown>;
      return {
        slug: e.slug,
        body: e.body,
        format: e.format,
        data: {
          categories: [],
          tags: [],
          draft: false,
          ...data,
          publishedDate: new Date(data.publishedDate as string),
        } as unknown as WritingData,
      };
    })
    .filter((e) => includeDrafts || !e.data.draft)
    .sort((a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime());
}

export function getWritingEntry(slug: string): Entry<WritingData> | undefined {
  return getWriting(true).find((e) => e.slug === slug);
}

export function getLab(includeDrafts = false): Entry<LabData>[] {
  return readCollection("lab")
    .map((e) => ({ slug: e.slug, body: e.body, format: e.format, data: { draft: false, ...e.data } as unknown as LabData }))
    .filter((e) => includeDrafts || !e.data.draft);
}

export function getLabEntry(slug: string): Entry<LabData> | undefined {
  // Lab entries carry an explicit `slug` field in frontmatter (route slug).
  return getLab(true).find((e) => e.data.slug === slug || e.slug === slug);
}
