// Layout and types for the Lab's infinite canvas.
//
// Every item sits at a hand-placed spot on one TILE_W × TILE_H tile. The canvas
// repeats that tile endlessly in both directions (see LabCanvas), so the layout
// has to read well across its own seams: the leftmost and rightmost items, and
// the top and bottom rows, leave room for the neighbouring repeat.
//
// The layout is six columns, 508 wide, of three or four pieces. Each row of
// repeats is shifted half a tile (three columns) sideways, so the same piece
// never sits directly under itself; for that seam to stay even, columns three
// apart start at the same height (0, 180, 0, 0, 180, 0). The Lab opens centred
// on the note in the fifth column, so the columns either side of it carry a mix
// of builds and shots; the columns that are all shots sit further out.

export const TILE_W = 3048;
export const TILE_H = 1272;
/**
 * How far past an edge an item travels before it wraps. At least the widest
 * item (and the tallest item plus its caption), so a wrap never happens with
 * any part of the item on screen.
 */
export const SEAM_X = 480;
export const SEAM_Y = 380;

interface Placed {
  id: string;
  title: string;
  /** Category, e.g. "Web design". Shown in the lightbox for shots. */
  label: string;
  x: number;
  y: number;
  /** Width on the tile; height follows the artwork's aspect ratio. */
  w: number;
}

/** A static shot: opens in the lightbox. */
export interface CanvasShot extends Placed {
  kind: "shot";
  src: string;
  width: number;
  height: number;
}

/** A design-engineering build: reveals a description, links to the build. */
export interface CanvasBuild extends Placed {
  kind: "build";
  description: string;
  href: string;
  /** A live Lab preview (see LabPreview), or else a still image. */
  preview?: string;
  image?: { src: string; width: number; height: number };
}

/** The Lab's own note, placed on the canvas like any other item. */
export interface CanvasNote extends Placed {
  kind: "note";
}

export type CanvasItem = CanvasShot | CanvasBuild | CanvasNote;

/** Height of an item's artwork on the tile (captions sit below it). */
export function itemHeight(item: CanvasItem): number {
  if (item.kind === "shot") return (item.w * item.height) / item.width;
  if (item.kind === "build") {
    if (item.image) return (item.w * item.image.height) / item.image.width;
    return (item.w * 630) / 1200; // LabPreview's frame
  }
  return 230;
}

export const SHOTS: Omit<CanvasShot, "kind">[] = [
  {
    id: "hr-payroll-landing",
    title: "HR & Payroll Landing",
    label: "Web design",
    src: "/images/lab/shots/hr-payroll-landing.webp",
    width: 1504,
    height: 846,
    x: 2042,
    y: 821,
    w: 440,
  },
  {
    id: "archealth-dashboard",
    title: "Archealth Body Analysis",
    label: "Dashboard design",
    src: "/images/lab/shots/archealth-dashboard.webp",
    width: 1200,
    height: 900,
    x: 2072,
    y: 180,
    w: 380,
  },
  {
    id: "wallet-onboarding",
    title: "Web3 Wallet Onboarding",
    label: "Mobile app",
    src: "/images/lab/shots/wallet-onboarding.webp",
    width: 1200,
    height: 900,
    x: 2620,
    y: 681,
    w: 300,
  },
  {
    id: "alpha-ledger-dashboard",
    title: "Alpha Ledger",
    label: "Fintech dashboard",
    src: "/images/lab/shots/alpha-ledger-dashboard.webp",
    width: 1504,
    height: 1003,
    x: 508,
    y: 180,
    w: 460,
  },
  {
    id: "cubetalk-landing",
    title: "CubeTalk Podcast",
    label: "Landing page",
    src: "/images/lab/shots/cubetalk-landing.webp",
    width: 1504,
    height: 1128,
    x: 1554,
    y: 0,
    w: 400,
  },
  {
    id: "eclipse-nft-marketplace",
    title: "Eclipse NFT Marketplace",
    label: "Web app",
    src: "/images/lab/shots/eclipse-nft-marketplace.webp",
    width: 1504,
    height: 1128,
    x: 2560,
    y: 0,
    w: 420,
  },
  // Third column.
  {
    id: "edusphere-courses",
    title: "EduSphere Courses",
    label: "Dashboard design",
    src: "/images/lab/shots/edusphere-courses.webp",
    width: 1024,
    height: 768,
    x: 1050,
    y: 0,
    w: 440,
  },
  {
    id: "compact-disc",
    title: "Compact Disc",
    label: "Icon design",
    src: "/images/lab/shots/compact-disc.webp",
    width: 512,
    height: 512,
    x: 1100,
    y: 408,
    w: 340,
  },
  {
    id: "skill-tags",
    title: "Skill Tags",
    label: "Illustration",
    src: "/images/lab/shots/skill-tags.webp",
    width: 512,
    height: 448,
    x: 1060,
    y: 826,
    w: 420,
  },
  // First column.
  {
    id: "tie-fighter",
    title: "TIE Fighter",
    label: "3D illustration",
    src: "/images/lab/shots/tie-fighter.webp",
    width: 512,
    height: 442,
    x: 44,
    y: 0,
    w: 420,
  },
  {
    id: "pendant",
    title: "Pendant",
    label: "Icon design",
    src: "/images/lab/shots/pendant.webp",
    width: 512,
    height: 512,
    x: 84,
    y: 441,
    w: 340,
  },
  {
    id: "letter",
    title: "Letter",
    label: "Icon design",
    src: "/images/lab/shots/letter.webp",
    width: 400,
    height: 400,
    x: 86,
    y: 859,
    w: 336,
  },
];

/** Where each build sits, keyed by Lab slug (plus "iconimate"). */
export const BUILD_SPOTS: Record<string, { x: number; y: number; w: number }> = {
  "pixel-wave": { x: 2042, y: 1145, w: 440 },
  "pattern-engine": { x: 2570, y: 393, w: 400 },
  iconimate: { x: 548, y: 1135, w: 380 },
  "pixel-mark": { x: 548, y: 856, w: 380 },
  "pixel-scatter": { x: 1544, y: 692, w: 420 },
  "scroll-reel-testimonials": { x: 1534, y: 380, w: 440 },
  "anti-metal-button": { x: 1564, y: 992, w: 380 },
  "music-player": { x: 538, y: 566, w: 400 },
  "perspective-highlight": { x: 2570, y: 984, w: 400 },
};

export const NOTE: CanvasNote = {
  kind: "note",
  id: "lab-note",
  title: "The Lab",
  label: "Index",
  x: 2042,
  y: 541,
  w: 440,
};
