import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colophon — Syed Mohammad Ammar",
  description: "The tools, stack, and workflow behind this site.",
};

export default function Page() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-12 pb-16 sm:pt-24">
      <h1 className="mb-3 text-4xl font-medium tracking-tight sm:text-5xl">Colophon</h1>
      <p className="mb-16 text-base leading-relaxed text-muted-foreground">
        What this site is made of and how it gets built. A design engineer&apos;s portfolio should
        hold up to a view-source — this page is the spec sheet.
      </p>

      <div className="space-y-12">
        <div>
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">Stack</p>
          <dl className="space-y-5">
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">Next.js 15</a>
              </dt>
              <dd className="leading-relaxed">Framework. App Router with React Server Components — pages render on the server, and client JavaScript ships only where interaction demands it.</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">React 19</a>
              </dt>
              <dd className="leading-relaxed">Client components power the interactive parts — the theme toggle, the generative art surfaces, and the local time in the chrome.</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">Tailwind CSS v4</a>
              </dt>
              <dd className="leading-relaxed">Styling. CSS custom properties for theming; OKLCH color tokens for perceptually-uniform light and dark palettes.</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://mdxjs.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">MDX</a>
              </dt>
              <dd className="leading-relaxed">Content. Work, Writing, and Lab entries are Markdown and MDX files with frontmatter, parsed with gray-matter and rendered through next-mdx-remote.</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">shadcn/ui</a>
              </dt>
              <dd className="leading-relaxed">Component library. Base-nova style, built on Base UI primitives. Themed to match the site&apos;s warm, minimal aesthetic.</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://vercel.com/font" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">Geist</a>
              </dt>
              <dd className="leading-relaxed">
                <a href="https://vercel.com/font" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">Sans</a> for body,{" "}
                <a href="https://vercel.com/font?type=mono" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">Mono</a> for labels and code,{" "}
                <a href="https://vercel.com/font?type=pixel" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">Pixel</a> for the hero animation. All from Vercel.
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-border pt-12">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">AI Agents</p>
          <dl className="space-y-5">
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">Claude Code</a>
              </dt>
              <dd className="leading-relaxed">AI coding agent. The site is designed and built in collaborative terminal sessions — the same design-to-code loop the rest of this portfolio is about.</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">agent-os</dt>
              <dd className="leading-relaxed">The repo&apos;s memory system for coding agents. Strategy, system map, conventions, plans, and learnings live as versioned files, so every agent session starts with full context instead of a cold read of the codebase.</dd>
            </div>
          </dl>
        </div>

        {/* TODO: add an Infrastructure section once hosting and deployment for smammar.com are confirmed. */}

        <div className="border-t border-border pt-12">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">Provenance</p>
          {/* TODO: confirm before launch that this scaffold was publicly released and that a public
              credit (and any link to its author) is wanted here — adjust or remove accordingly. */}
          <p className="text-sm leading-relaxed">
            The architecture of this site began as Patrick Morgan&apos;s portfolio scaffold. Credit
            where it&apos;s due — the bones were his. Everything built on them since is mine.
          </p>
        </div>
      </div>
    </section>
  );
}
