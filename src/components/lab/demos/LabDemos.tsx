"use client";

import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { MusicPlayer, type Track } from "@/components/ui/music-player-widget";
import { Highlight, Perspective } from "@/components/ui/perspective-highlight";
import { ScrollReelTestimonials, type ScrollReelTestimonial } from "@/components/ui/scroll-reel-testimonials";

// The live demos for the component experiments in the Lab. Each has a full
// version for its Lab page and a compact Preview for the canvas tiles and
// cards (which the previews render inert, inside a link).

/* ── Scroll Reel Testimonials ─────────────────────────────────────────── */

// Placeholder content: invented names and quotes over Unsplash portraits.
// The Lab page says so under the demo.
const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop&crop=faces&auto=format&q=80`;

const TESTIMONIALS: ScrollReelTestimonial[] = [
  {
    quote: "Setting up took five minutes, and I never once had to open the help docs.",
    author: "Maya Chen, Product Lead",
    image: unsplash("1494790108377-be9c29b29330"),
    alt: "Portrait of Maya Chen",
  },
  {
    quote: "It explains every step before it asks for anything. I finally trust the numbers.",
    author: "Daniel Brooks, Early Customer",
    image: unsplash("1507003211169-0a1dd7228f2d"),
    alt: "Portrait of Daniel Brooks",
  },
  {
    quote: "Calm, clear and quick. It feels like it was designed by someone who uses it.",
    author: "Sofia Marin, Designer",
    image: unsplash("1438761681033-6461ffad8d80"),
    alt: "Portrait of Sofia Marin",
  },
  {
    quote: "The first app in its category I've been happy to recommend to my parents.",
    author: "James Okafor, Founder",
    image: unsplash("1500648767791-00dcc994a43e"),
    alt: "Portrait of James Okafor",
  },
];

export function ScrollReelDemo() {
  return <ScrollReelTestimonials testimonials={TESTIMONIALS} />;
}
export function ScrollReelPreview() {
  // Static: the preview is inert, so there would be no way to pause it.
  return <ScrollReelTestimonials testimonials={TESTIMONIALS} />;
}

/* ── Anti-Metal Button ────────────────────────────────────────────────── */

export function AntiMetalDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <AntiMetalButton />
      <AntiMetalButton label="Start a project" accentFrom="#c4b5fd" accentTo="#a78bfa" dotColor="#1e1b4b" className="w-44" />
      <AntiMetalButton label="Download CV" accentFrom="#fdba74" accentTo="#fb923c" dotColor="#431407" className="w-40" />
    </div>
  );
}
export function AntiMetalPreview() {
  return (
    <div className="flex justify-center">
      <AntiMetalButton tabIndex={-1} />
    </div>
  );
}

/* ── Music Player ─────────────────────────────────────────────────────── */

// The tracks and covers from the component's own demo, streamed from the
// 21st.dev CDN. That CDN doesn't allow cross-origin reads, so the player runs
// without crossOrigin: the audio plays, and the mixer moves on its own clock.
const TRACKS: Track[] = [
  {
    title: "Southern Roots Boogie",
    artist: "Falconer",
    cover: "https://cdn.21st.dev/assets/mirror/ba/bafb64c13ba4ed85d598cc318a62f9a5129f3abaecee80943d495e7356fd0603.jpg",
    src: "https://cdn.21st.dev/assets/mirror/ca/cadd2666c5571e12fafdb21697b26aef6f196a5a9c28e708129870167679991d.mp3",
  },
  {
    title: "Sax Party",
    artist: "Ofer Koren",
    cover: "https://cdn.21st.dev/assets/mirror/ca/ca5a0ecf3ecbf81caded68eb892149e9d2f060c50dfbefd6ca1c04792856a049.jpg",
    src: "https://cdn.21st.dev/assets/mirror/ab/ab5cb08483abe63edd2a2ce4d843ad8f3073fcbb4a738a94f6b7529df3e1b437.mp3",
  },
  {
    title: "Nonsense",
    artist: "Raw",
    cover: "https://cdn.21st.dev/assets/mirror/d0/d0d6fb080fce7745734593c815edf73ac22bbbe5e7b3424324d191af8b058833.jpg",
    src: "https://cdn.21st.dev/assets/mirror/79/793e6ffda56e28691998b90a55bdaf0f2bccb8950cd8a7ee9ef7421c4ebbafdb.mp3",
  },
];

export function MusicPlayerDemo() {
  return <MusicPlayer tracks={TRACKS} />;
}
export function MusicPlayerPreview() {
  // No audio fetched for a preview.
  return <MusicPlayer tracks={TRACKS} preload="none" />;
}

/* ── Perspective Highlight ────────────────────────────────────────────── */

function PerspectiveArticle() {
  return (
    <Perspective>
      <article className="text-[15px] leading-[1.75] text-muted-foreground">
        <p className="mb-[1.1em]">
          <Highlight color="red">Three nested wrappers</Highlight>, each with one job. Strip any of them out and the whole
          illusion collapses back into a flat rectangle on a page.
        </p>
        <p className="mb-[1.1em]">
          <Highlight color="purple">The whole effect rides on CSS&apos;s perspective property.</Highlight> The outer
          wrapper defines the 3D space, the middle one preserves it, and only the inner card actually rotates. Three
          transforms standing on each other&apos;s shoulders.
        </p>
        <p>
          <Highlight color="green">The card tilts toward wherever your cursor goes.</Highlight> Move closer and it leans
          in; pull away and it settles flat. As it turns, the highlights drift forward, a translate going one direction
          and a shadow going the other, fooling your eye into reading depth.
        </p>
        <p className="mt-3 font-hand text-2xl text-foreground">Syed Mohammad Ammar</p>
      </article>
    </Perspective>
  );
}

export function PerspectiveDemo() {
  return <PerspectiveArticle />;
}
export function PerspectivePreview() {
  return <PerspectiveArticle />;
}
