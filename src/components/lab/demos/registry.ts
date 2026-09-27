import type { ComponentType } from "react";
import dynamic from "next/dynamic";

// Each demo loads as its own chunk when it first renders, so the Lab wall and
// cards don't carry every experiment's code up front.
const demo = (name: keyof typeof import("./LabDemos")) =>
  dynamic(() => import("./LabDemos").then((m) => m[name] as ComponentType));

// Component experiments in the Lab, keyed by their Lab slug (which is also
// their `preview` key). The dynamic /lab/[slug] page renders `Demo`; LabPreview
// renders `Preview`, laid out at `previewWidth` and scaled to fit its frame.
//
// A plain module rather than a client one, so server pages can read the map.

export interface LabDemo {
  Demo: ComponentType;
  Preview: ComponentType;
  previewWidth: number;
  /** Shown under the demo, e.g. to say what's placeholder. */
  note?: string;
}

export const LAB_DEMOS: Record<string, LabDemo> = {
  "scroll-reel-testimonials": {
    Demo: demo("ScrollReelDemo"),
    Preview: demo("ScrollReelPreview"),
    previewWidth: 760,
    note: "Sample content: the names, quotes and portraits are placeholders.",
  },
  "anti-metal-button": {
    Demo: demo("AntiMetalDemo"),
    Preview: demo("AntiMetalPreview"),
    previewWidth: 200,
  },
  "music-player": {
    Demo: demo("MusicPlayerDemo"),
    Preview: demo("MusicPlayerPreview"),
    previewWidth: 440,
    note: "Tracks and covers from the component's demo, streamed from the 21st.dev CDN.",
  },
  "perspective-highlight": {
    Demo: demo("PerspectiveDemo"),
    Preview: demo("PerspectivePreview"),
    previewWidth: 480,
  },
};
