import type { ComponentType } from "react";
import {
  AntiMetalDemo,
  AntiMetalPreview,
  MusicPlayerDemo,
  MusicPlayerPreview,
  PerspectiveDemo,
  PerspectivePreview,
  ScrollReelDemo,
  ScrollReelPreview,
} from "./LabDemos";

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
    Demo: ScrollReelDemo,
    Preview: ScrollReelPreview,
    previewWidth: 760,
    note: "Sample content: the names, quotes and portraits are placeholders.",
  },
  "anti-metal-button": {
    Demo: AntiMetalDemo,
    Preview: AntiMetalPreview,
    previewWidth: 200,
  },
  "music-player": {
    Demo: MusicPlayerDemo,
    Preview: MusicPlayerPreview,
    previewWidth: 440,
    note: "Tracks and covers from the component's demo, streamed from the 21st.dev CDN.",
  },
  "perspective-highlight": {
    Demo: PerspectiveDemo,
    Preview: PerspectivePreview,
    previewWidth: 480,
  },
};
