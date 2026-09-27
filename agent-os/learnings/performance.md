# Performance

## Rule

Keep the first load light; heavy things mount only when they're needed.

These are the scores after the September 2026 pass (Lighthouse on
`next build` + `next start`):

| Page | Desktop | Mobile (median of 5 local runs) |
| --- | --- | --- |
| Home | 100 | ~80–88 |
| Lab | 98 | ~75 |

Local mobile runs swing ±8 with machine load, because Lighthouse multiplies
measured CPU by 4. Use medians, or PageSpeed Insights on the deployed site.

- **Live Lab previews:** they mount through `LazyMount`
  (`src/components/lab/LazyMount.tsx`), only when a tile nears the screen, and
  one per idle moment. Don't render canvases or demos straight into a tile.
- **Lab demos and heavy previews:** they're `next/dynamic` chunks (the registry
  in `components/lab/demos/registry.ts`, and `LabPreview`'s pattern surface and
  pixel-scatter button).
- **`motion`:** keep it out of the home and Lab first load. The lightbox
  (`LightboxLayer`) loads on the first shot opened. The pixel-wave script
  cross-fades with Web Animations. The canvas uses a local
  `useReducedMotion`.
- **The wall's deal-out:** it's Web Animations on transform and opacity
  (compositor-run), started once. Pieces landing off screen don't animate.
  Nothing writes per frame.
- **The Lab page on phones (under 640px):** it's laid out by CSS from the first
  paint. Pieces are centred on the note with `cq` units inside their transform
  (`phoneOffset`), and there's no deal. Never centre with `left`/`top`: the
  script switching them counts as a layout shift.
- **Screenshots and project thumbnails:** they ship `-w480`/`-w800` (shots) and
  `-w640`/`-w960` (project WebPs) copies, used through `srcset`. Add the copies
  when adding images, e.g. with PIL (LANCZOS, WebP quality ~80).
- **Opening-view shots on the Lab wall:** they load eagerly with high priority
  (`openingView`). Everything else stays lazy.
- **Fonts:** Geist and Caveat are served from `/fonts`, Latin only, with Geist
  preloaded in the root layout. Caveat has a size-matched `Caveat Fallback`.
  Without it, the caption band re-wraps and shifts the page (CLS 0.12).
- **The headline's pixel-wave entrance:** it waits for idle, and is skipped on
  phones, where it's server-rendered already settled.
- **The leaf garden:** it imports three.js only when the footer reaches the
  screen, then sets up at idle.

## Tried and dropped

- `experimental.inlineCss`: the stylesheet is ~135KB raw, and inlining it made
  first paint slower (1.5s → 2.0s on mobile).

## What's left for mobile 90+

- Hydration and rendering: React/Next's shared ~100KB plus the page trees.
- The Lab's first images still wait for hydration on tablets and up, because
  of the deal-out.
