// Re-encodes the large images the site serves into WebP copies sized for how
// they are displayed. The source PNGs stay put; components point at the .webp
// files. Re-run after replacing a source image:
//
//   node scripts/optimize-images.mjs
//
// Text-heavy images (journey map, onboarding strips) stay at quality 90 so small
// UI text stays crisp; near-lossless came out larger than the source PNGs for
// these flat screenshots. Nothing goes below quality 85.

import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "projects");

/** [source relative to public/images/projects, output name, max width, encoder options, optional crop] */
const JOBS = [
  ["mahaana-wealth/thumbnail-mahaana-app-wide.png", "thumbnail-mahaana-app-wide.webp", 1700, { quality: 85 }],
  ["mahaana-wealth/screen-wall.png", "screen-wall.webp", 1700, { quality: 90 }],
  ["mahaana-wealth/discover.png", "discover.webp", 1700, { quality: 90 }],
  // The scroll-linked screen row. 1x phone captures, kept at source width.
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => [
    `mahaana-wealth/screens/screen-0${n}.png`,
    `screen-0${n}.webp`,
    380,
    { quality: 90 },
  ]),
  ["mahaana-wealth/atomic-system.png", "atomic-system.webp", 1166, { quality: 90 }],
  ["mahaana-wealth/atomic-system-dark.png", "atomic-system-dark.webp", 1166, { quality: 90 }],
  ["mahaana-wealth/onboarding-journey-map.png", "onboarding-journey-map.webp", 1700, { quality: 90 }],
  ["mahaana-wealth/onboarding-1-account.png", "onboarding-1-account.webp", 1700, { quality: 90 }],
  ["mahaana-wealth/onboarding-2-risk-profile.png", "onboarding-2-risk-profile.webp", 1700, { quality: 90 }],
  ["mahaana-wealth/onboarding-3-risk-profile.png", "onboarding-3-risk-profile.webp", 1700, { quality: 90 }],
  ["mahaana-wealth/onboarding-4-identity-review.png", "onboarding-4-identity-review.webp", 1700, { quality: 90 }],
  // Phone halves of each onboarding strip: three screens each, stacked in the
  // carousel below sm so a screen isn't 50px wide. The strips share one grid
  // (screens every 426px from x=38), so 1302px crops at 0 and 1276 split them
  // down the middle gap with the same 38px margin on every edge.
  ...["onboarding-1-account", "onboarding-2-risk-profile", "onboarding-3-risk-profile", "onboarding-4-identity-review"].flatMap(
    (name) =>
      [
        [1, 0],
        [2, 1276],
      ].map(([half, left]) => [
        `mahaana-wealth/${name}.png`,
        `${name}-m${half}.webp`,
        1302,
        { quality: 90 },
        { left, top: 0, width: 1302, height: 931 },
      ]),
  ),
  ["mahaana-wealth/home-screen-full.png", "home-screen-full.webp", 455, { quality: 90 }],
  // Full card width on phones (up to ~504 CSS px), so keep the source width.
  ["mahaana-wealth/dawn-financial-literacy.png", "dawn-financial-literacy.webp", 800, { quality: 85 }],
  ["mahaana-wealth/dawn-logo.png", "dawn-logo.webp", 400, { quality: 90 }],
  // The Iconimate hero and wide thumbnail are the same file under two names;
  // one WebP serves both.
  ["iconimate/hero-iconimate-landing.png", "iconimate-landing.webp", 1600, { quality: 85 }],
];

let before = 0;
let after = 0;
for (const [src, out, width, options, extract] of JOBS) {
  const input = path.join(root, src);
  const output = path.join(root, path.dirname(src), out);
  const inMeta = await sharp(input).metadata();
  const info = await (extract ? sharp(input).extract(extract) : sharp(input))
    .resize({ width, withoutEnlargement: true })
    .webp({ effort: 6, ...options })
    .toFile(output);
  const inSize = (await import("node:fs")).statSync(input).size;
  before += inSize;
  after += info.size;
  console.log(
    `${src} ${inMeta.width}x${inMeta.height} ${Math.round(inSize / 1024)}KB -> ${out} ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`,
  );
}
console.log(`total ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB`);
