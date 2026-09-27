import type { Metadata } from "next";
import { getLab, getProject } from "@/lib/content";
import { LabCanvas } from "@/components/lab/canvas/LabCanvas";
import { BUILD_SPOTS, NOTE, SHOTS, type CanvasItem } from "@/components/lab/canvas/items";

export const metadata: Metadata = {
  title: "Lab | Syed Mohammad Ammar",
  description: "Design-engineering experiments and static shots, on one endless canvas.",
  robots: { index: false, follow: false },
};

export default async function Page() {
  // Live builds: every Lab entry, plus Iconimate from the projects. Positions
  // come from BUILD_SPOTS; an entry without a spot isn't placed.
  const builds: CanvasItem[] = getLab().flatMap((entry) => {
    const spot = BUILD_SPOTS[entry.data.slug];
    if (!spot) return [];
    return [
      {
        kind: "build" as const,
        id: entry.data.slug,
        title: entry.data.title,
        label: "Design engineering",
        description: entry.data.description,
        href: `/lab/${entry.data.slug}`,
        preview: entry.data.preview,
        ...spot,
      },
    ];
  });

  const iconimate = getProject("iconimate");
  if (iconimate?.data.thumbnailWide && iconimate.data.thumbnailWideSize) {
    const [width, height] = iconimate.data.thumbnailWideSize;
    builds.push({
      kind: "build",
      id: "iconimate",
      title: iconimate.data.title,
      label: "Open source",
      description: iconimate.data.statement ?? iconimate.data.description,
      href: "/work/iconimate",
      image: { src: iconimate.data.thumbnailWide, width, height },
      ...BUILD_SPOTS.iconimate,
    });
  }

  const items: CanvasItem[] = [NOTE, ...builds, ...SHOTS.map((shot) => ({ kind: "shot" as const, ...shot }))];

  return (
    <>
      <h1 className="sr-only">Lab</h1>
      <p className="sr-only">
        Design-engineering experiments and static shots. Each live build links to its page; each shot opens in a
        lightbox.
      </p>
      <LabCanvas items={items} />
    </>
  );
}
