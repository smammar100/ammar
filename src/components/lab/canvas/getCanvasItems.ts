import { getLab, getProject } from "@/lib/content";
import { BUILD_SPOTS, NOTE, SHOTS, type CanvasItem } from "./items";

/**
 * Everything on the Lab canvas: the note, every Lab entry that has a spot on
 * the table, Iconimate from the projects, and the static shots. Server-side
 * (it reads content), shared by /lab and the home page's wall.
 */
export function getCanvasItems(): CanvasItem[] {
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

  return [NOTE, ...builds, ...SHOTS.map((shot) => ({ kind: "shot" as const, ...shot }))];
}
