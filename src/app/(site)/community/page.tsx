import type { Metadata } from "next";
import { commendations } from "@/data/commendations";
import { communityPhotos, communityStory } from "@/data/community";
import { cn } from "@/lib/utils";
import { CommunityReveal } from "./CommunityReveal";

export const metadata: Metadata = {
  title: "Community — Patrick Morgan",
  description: "Showing up for creative people in Los Angeles through writing, events, and community.",
};

const communityPagePhotos = communityPhotos.map((photo, index) => ({
  ...photo,
  className: ["rotate-[-2deg]", "rotate-[2deg]", "rotate-[-1deg]", "rotate-[1deg]"][index],
}));

export default function Page() {
  return (
    <>
      <CommunityReveal />

      <section className="mx-auto max-w-3xl px-6 pt-12 pb-16 sm:pt-24 sm:pb-12" data-community-hero style={{ opacity: 0 }}>
        <h1 className="mb-4 text-4xl font-medium tracking-tight sm:text-5xl">Community</h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Showing up for creative people in Los Angeles through writing, events, and community.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16" data-community-story style={{ opacity: 0 }}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {communityPagePhotos.map((photo) => (
            <figure
              key={photo.src}
              className={cn(
                "bg-white p-2 pb-7 shadow-xl shadow-black/15 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] dark:bg-[#20201e] dark:shadow-black/40",
                photo.className,
              )}
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className={cn("block h-full w-full object-cover", photo.position)}
                />
              </div>
            </figure>
          ))}
        </div>

        <p className="mt-12 text-xl font-semibold leading-snug tracking-tight">
          Showing up for people.
        </p>
        <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
          {communityStory.paragraphs.slice(0, 2).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24" data-community-words style={{ opacity: 0 }}>
        <div className="mb-10">
          <h2 className="mb-3 text-xl font-semibold leading-snug tracking-tight">Kind words from the community.</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            A few notes from readers, event guests, and people in the design community.
          </p>
        </div>

        <div className="columns-1 gap-4 sm:columns-2">
          {commendations.map((c) => (
            <blockquote key={c.name} className="mb-4 break-inside-avoid rounded-lg p-5 texture-bg" data-kind-words-item style={{ opacity: 0 }}>
              <p className="mb-4 font-mono text-[13px] leading-relaxed text-foreground">{c.quote}</p>
              <footer className="flex items-center gap-3">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium leading-tight">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  );
}
