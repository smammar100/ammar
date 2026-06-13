export const communityStory = {
  heading: "Building in public, one shipped project at a time.",
  paragraphs: [
    "I show up in public by shipping. The pledge: 100 real design-engineering projects, built and posted in the open — landing pages, components, tools, experiments.",
    "So far that looks like being #1 Top Author on 21st.dev — 4 components, 695 bookmarks — open-sourcing ThumbGen, a local-first image tool that runs 100% in the browser, and a steady stream of build-in-public posts on LinkedIn.",
    "No meetups or photo walls yet. Just work, shipped where everyone can see it.",
  ],
};

// TODO: replace all four placeholder photos with real photos of Ammar
// (build-in-public moments, talks, milestones). Paths are kept because the
// home page reads entries [0] and [3] directly — do not drop below 4 entries.
export const communityPhotos = [
  {
    // TODO: swap placeholder image for a real photo of Ammar.
    src: "/images/community/patio-selfie.jpg",
    alt: "Placeholder photo — to be replaced with a photo of Ammar.",
    className: "rotate-[-2deg] lg:absolute lg:left-0 lg:top-8 lg:w-[43%]",
    position: "object-[8%_50%]",
  },
  {
    // TODO: swap placeholder image for a real photo of Ammar.
    src: "/images/community/backyard-host.jpg",
    alt: "Placeholder photo — to be replaced with a photo of Ammar.",
    className: "rotate-[3deg] lg:absolute lg:right-4 lg:top-0 lg:w-[41%]",
    position: "object-[6%_50%]",
  },
  {
    // TODO: swap placeholder image for a real photo of Ammar.
    src: "/images/community/night-gathering.jpg",
    alt: "Placeholder photo — to be replaced with a photo of Ammar.",
    className: "rotate-[2deg] lg:absolute lg:left-[22%] lg:top-[46%] lg:w-[39%]",
    position: "object-[50%_48%]",
  },
  {
    // TODO: swap placeholder image for a real photo of Ammar.
    src: "/images/community/park-group-selfie.jpg",
    alt: "Placeholder photo — to be replaced with a photo of Ammar.",
    className: "rotate-[-3deg] lg:absolute lg:right-0 lg:top-[50%] lg:w-[38%]",
    position: "object-[58%_50%]",
  },
] as const;

// TODO: populate once real kind words exist in commendations.ts. Names must
// match Commendation.name exactly — the home page looks entries up by name.
export const featuredCommunityCommendations: string[] = [];
