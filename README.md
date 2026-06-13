# smammar.com

Personal portfolio site for Syed Mohammad Ammar, built with [Next.js 15](https://nextjs.org) (App Router), Tailwind CSS, and shadcn/ui.

This repository contains the source for [smammar.com](https://www.smammar.com) (TODO: confirm domain before launch): a warm, minimal, editorial portfolio for design-engineering work, writing, and lab experiments.

## Start here

- [System map](agent-os/system-map.md) explains how the project is structured, how content works, and how to verify changes.
- [Agent instructions](AGENTS.md) are the shared working guide for Codex, Claude, and other coding agents.
- [Agent OS](agent-os/README.md) contains strategy, plans, and learnings for AI-assisted work on the project.

## Local development

Prerequisites:

- Node.js 20+
- pnpm 10+

This repo includes a `.mise.toml` for local tool versions. If you use
[mise](https://mise.jdx.dev/), run:

```bash
mise trust
mise install
```

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321`.

For build, deployment, content, and architecture details, use the [system map](agent-os/system-map.md).
