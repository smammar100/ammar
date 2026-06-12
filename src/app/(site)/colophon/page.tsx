import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Colophon — Patrick Morgan",
  description: "The tools, stack, and workflow behind this site.",
};

export default function Page() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-12 pb-16 sm:pt-24">
      <h1 className="mb-3 text-4xl font-medium tracking-tight sm:text-5xl">Colophon</h1>
      <p className="mb-16 text-base leading-relaxed text-muted-foreground">
        What this site is made of and how it gets built. The full story is in{" "}
        <Link
          href="/writing/how-i-rebuilt-my-portfolio-with-claude-code"
          className="underline underline-offset-2 transition-colors hover:text-accent"
        >
          How I Rebuilt My Portfolio With Claude Code
        </Link>
        .
      </p>

      <div className="space-y-12">
        <div>
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">Stack</p>
          <dl className="space-y-5">
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://astro.build/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">Astro v5</a>
              </dt>
              <dd className="leading-relaxed">Framework. Ships zero JS by default; content collections enforce schema-validated frontmatter at build time.</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">Tailwind CSS v4</a>
              </dt>
              <dd className="leading-relaxed">Styling. CSS custom properties for theming; OKLCH color tokens for perceptually-uniform light and dark palettes.</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">shadcn/ui</a>
              </dt>
              <dd className="leading-relaxed">Component library. Base-nova style, built on Radix UI primitives. Themed to match the site&apos;s warm, minimal aesthetic.</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">React</a>
              </dt>
              <dd className="leading-relaxed">Used only where interactivity requires it — the theme toggle, the generative art surfaces, and the local time widget in the footer.</dd>
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
              <dd className="leading-relaxed">AI coding agent for interactive sessions — designing and building features collaboratively in the terminal.</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://openai.com/codex" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">OpenAI Codex</a>
              </dt>
              <dd className="leading-relaxed">AI coding agent for autonomous background tasks — running longer agentic loops without occupying a terminal session.</dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-border pt-12">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">Infrastructure</p>
          <dl className="space-y-5">
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://pages.github.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">GitHub Pages</a>
              </dt>
              <dd className="leading-relaxed">Static hosting. Free, native to where the code lives.</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://github.com/features/actions" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">GitHub Actions</a>
              </dt>
              <dd className="leading-relaxed">Automated deployment on push to <code className="font-mono text-xs">main</code>.</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-4 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground pt-0.5">
                <a href="https://github.com/features/issues" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">GitHub Issues</a>
              </dt>
              <dd className="leading-relaxed">Task tracking. Every enhancement starts as an issue, gets a plan, ships on a feature branch, and merges via PR.</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
