# System Map

This is the operating map for Syed Mohammad Ammar's personal website. It
explains how the site fits together, which system owns which kind of content or
behavior, and where to look before changing something.

Agent OS uses single-responsibility documentation: each file owns one kind of
context, avoids repeating neighboring files, and links to the canonical source
for related details. This file owns system orientation, not editing rules.

## Subsystems

| Area | What it does | Source of truth |
| --- | --- | --- |
| Public site shell | Shared layout, navigation, footer, theme, metadata | `src/app/layout.tsx`, `src/components/layout/`, `src/data/site-config.ts` |
| Work | Public portfolio/case-study section at `/work` | `src/content/projects/`, rendered through `/work` routes |
| Writing | Site-native summaries of Ammar's Medium articles, linking out via `canonicalUrl` | Authored directly in `src/content/writing/`; canonical originals live on Medium |
| Lab | Hosted experiments, tools, and interaction demos | `src/content/lab/`, `src/app/(site)/lab/`, `src/app/(tool)/lab/`, `src/lab/` |
| Community | Build-in-public narrative and photo slots | `src/app/(site)/community/page.tsx`, `src/data/community.ts`, `src/data/commendations.ts` |
| Deployment | Not wired up yet. `.github/workflows/deploy.yml` is a legacy GitHub Pages workflow that fails against this Next.js repo. TODO(owner): fix or remove. | `.github/workflows/deploy.yml` |
| Work orchestration | Strategy, plans, conventions, learnings, and skills | `agent-os/` (no issue tracker or project board is connected yet) |

## Public Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page with hero, featured Work, Lab, and Writing |
| `/about` | Personal narrative and context |
| `/work` | Career timeline plus related portfolio work |
| `/work/<slug>` | Project/case-study detail pages |
| `/lab` | Lab index |
| `/lab/<slug>` | Individual Lab tools or demos |
| `/writing` | Writing index |
| `/writing/<slug>` | Article summary pages linking to the Medium originals |
| `/community` | Build-in-public story (route exists but is not in the nav) |
| `/colophon` | Public explanation of stack and workflow |
| `/style-guide` | Internal prose/typography reference |
| `/resume` | Legacy resume-style route still present in the codebase |

## Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

- `pnpm dev`: starts Next.js at `localhost:4321`.
- `pnpm build`: production build to `.next/`.
- `pnpm start`: serves the production build locally.
- `pnpm lint`: runs Next.js linting.

`pnpm sync-writing` and `pnpm generate:writing-art` are legacy scripts from the
previous owner's Obsidian-to-newsletter pipeline (along with
`scripts/normalize-obsidian-newsletters.mjs`). Do not run them; see
`AGENTS.md`.

## Content Model

Content is loaded through the helpers in `src/lib/content.ts` (`getProjects`,
`getWriting`, `getLab`) using gray-matter and next-mdx-remote. Drafts should be
filtered before public rendering.

| Collection | Public route | Source |
| --- | --- | --- |
| Work | `/work/<slug>` | `src/content/projects/*.{md,mdx}` |
| Writing | `/writing/<slug>` | `src/content/writing/*.md` |
| Lab | `/lab/<slug>` | `src/content/lab/*.mdx` |

## Publishing Workflows

### Writing

Writing entries are authored directly in `src/content/writing/` as short
site-native summaries with `canonicalUrl` frontmatter pointing at the Medium
original. There is no sync pipeline; the legacy Obsidian newsletter scripts in
`scripts/` must not be run.

### Editorial Art

Writing feature images live under `public/images/writing/<slug>/feature.jpg`
and are referenced from article frontmatter. The generator script
(`scripts/generate-writing-art.mjs`) is part of the legacy pipeline — author or
add images manually instead, or revive the script deliberately as its own piece
of work.

## Related References

Use these files for adjacent context:

- `agent-os/conventions/architecture.md`: framework, layout, content, and
  React usage conventions
- `agent-os/conventions/content.md`: public terminology and frontmatter
  conventions
- `agent-os/conventions/styling.md`: visual design, Tailwind, prose, and
  interaction conventions
- `agent-os/conventions/assets.md`: image and embed conventions
- `agent-os/learnings/`: reusable lessons from completed work (some notes
  describe the legacy sync/art pipeline and are historical context only)

## Verification

Before merging changes that affect routes, content schema, layouts, scripts, or
generated assets, run:

```bash
pnpm build
```

For visual or interactive changes, also run `pnpm dev` and check the affected
route in a browser.

## Maintenance

Use `agent-os/skills/refactor-radar/SKILL.md` for recurring refactor discovery,
maintenance review, and approval-based cleanup work.
