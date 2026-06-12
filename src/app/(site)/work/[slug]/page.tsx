import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Mdx } from "@/components/Mdx";
import { getProject, getProjects } from "@/lib/content";

export async function generateStaticParams() {
  // Mirror the Astro getStaticPaths, which included all projects (drafts too).
  return getProjects(true).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.data.title,
    description: project.data.description,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { title, skills, heroImage } = project.data;

  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-16">
        {/* Back link */}
        <Link
          href="/work"
          className="project-load project-load-back mb-8 inline-flex items-center gap-1 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Work
        </Link>

        {/* Hero */}
        <header className="project-load project-load-header mb-12">
          <h1 className="mb-6 text-4xl font-medium tracking-tight sm:text-5xl">
            {title}
          </h1>
          <div className="mb-8 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="font-mono text-xs">
                {skill}
              </Badge>
            ))}
          </div>

          {heroImage && (
            <div className="project-load project-load-media mb-8 overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={heroImage}
                alt={title}
                className="w-full object-cover"
              />
            </div>
          )}
        </header>

        {/* Markdown body */}
        <div className="project-load project-load-body prose">
          <Mdx source={project.body} format={project.format} />
        </div>
      </article>

      <style>{`
        .project-load {
          animation: project-page-load 480ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .project-load-header {
          animation-delay: 70ms;
        }

        .project-load-media {
          animation-delay: 140ms;
        }

        .project-load-body {
          animation-delay: 220ms;
        }

        @keyframes project-page-load {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .project-load {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
