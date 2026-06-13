# Content Conventions

## Public Terminology

- Use "Work", not "Projects" or "Experience", for the public portfolio/career section.
- Use "Writing", not "Blog".
- Use "Lab", not "Tools", for hosted experiments, utilities, and interaction showcases.
- Use "Kind Words", not "Commendations" or "Testimonials".

The internal content collection for Work is still named `projects`; do not
rename it casually.

## Work

Work entries live in `src/content/projects/*.{md,mdx}` and render publicly under
`/work/<slug>`.

Common frontmatter:

```yaml
title: "Project Title"
type: "professional"
description: "Short description"
skills: ["Skill 1", "Skill 2"]
thumbnail: "/images/projects/slug/thumbnail-image.jpg"
thumbnailDark: "/images/projects/slug/thumbnail-image-dark.jpg"
thumbnailWide: "/images/projects/slug/thumbnail-wide.jpg"
thumbnailWideDark: "/images/projects/slug/thumbnail-wide-dark.jpg"
heroImage: "/images/projects/slug/feature-image.jpg"
sortOrder: 1
draft: false
```

Dark, wide, and hero images are optional. Work entries that need embeds can use
MDX.

## Writing

Writing lives in `src/content/writing/*.md`.

Common frontmatter:

```yaml
title: "Article Title"
description: "Short description"
publishedDate: 2026-02-22
categories: ["Category"]
theme: "AI"
tags: ["tag1", "tag2"]
image: "/images/writing/article-slug/feature.jpg"
canonicalUrl: "https://medium.com/design-bootcamp/article-slug"
draft: false
```

Writing entries are authored directly in `src/content/writing/` as short
site-native summaries, with `canonicalUrl` pointing at the Medium original. Do
not run the legacy `pnpm sync-writing` Obsidian pipeline (see `AGENTS.md`).
The website owns `theme`, `visual`, and `image` frontmatter for writing.

Use `theme` for broad reader-facing grouping, such as `AI`, `Design`, `Systems
Thinking`, or `Creative Practice`. Use `tags` for lower-level metadata.

## Lab

Lab entries live in `src/content/lab/*.mdx` and are hosted under `/lab/<slug>`.

Common frontmatter:

```yaml
title: "Lab Item"
description: "Short description"
slug: "lab-item"
preview: "lab-item"
experience: "demo"
draft: false
```

Use `experience: "app"` for immersive tools and `experience: "demo"` for
focused interaction showcases. Put implementation code under `src/lab/<slug>/`
when an item needs dedicated components, React islands, or supporting logic.

