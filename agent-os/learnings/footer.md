# Footer

## Rule

The site footer is the **Postcard**: one raised card holding the ask, sitting
in a leaf garden that grows up around it. It renders on every `(site)` page
from `src/components/layout/Footer.tsx`, so pages don't carry their own
closing contact section.

Decided on 2026-09-27 from a five-way prototype (`/proto/footer`, since
deleted).

- Card: `skeu` material, 28px outer corners, 8px padding, 20px inner paper
  (inner radius = outer minus padding). Max width 36rem, centred.
- Contents, top to bottom: the pixel "A" mark at 64px in the top-right corner
  (no stamp frame), a green status dot with "Currently open to new projects",
  the heading "Let's build something worth shipping.", one line of support
  copy, the email pill (with a copy button; the owner removed a dashed rule
  and "Write to" label above it), then the social icon buttons (LinkedIn, GitHub, Dribbble; email
  is in the pill, not repeated as an icon) and Karachi local time.
- No meta line under the card: the owner removed the copyright and colophon
  row because it sat over the leaves and couldn't be read.
- Garden: `LeafGarden` (seed 41, density 11, reach 0.5 to 1) fills the bottom
  78% of the footer behind the card. Stems lean away from the pointer, sway
  when it brushes through them and flutter afterwards. Clicking the soil plants
  a tendril, and at most 20 planted ones are kept, with the oldest fading out.
  The cursor over the soil is a seedling, and planting plays a small
  synthesised sprout sound (a twig tick and two bell notes; the pen's own mp3
  was hotlinked from onload.agency with no licence, so it isn't used). On
  screen, a light breeze keeps the stems swaying (about 3% of a stem's length),
  drawn at 30fps when nothing else is moving.

## Rejected

- **Ledger**: Daniel Sun's two cells inside the hatched page frame, with the
  garden as a strip. Faithful to the reference but the quietest; the garden
  read as a divider rather than a moment.
- **Meadow**: a centred ask over a full-bleed, 340 to 440px interactive
  garden. Memorable, but tall, and the meta line sat on foliage.
- **Signature**: an editorial index (Contact, Index, Elsewhere, Now) with the
  name signed full width in Caveat and leaves over the letters. The most
  content, and the big name repeated the nav's.
- **Night garden**: a dark slab with rounded top corners in both themes. A
  decisive end, but heavy in light mode and a break from the light frame.

## Why

The owner picked the Postcard: one object that says "write to me", with the
garden as its setting rather than a strip. They then asked for the garden to
answer the pointer and to grow on click, and for the card's buttons to become
the site-wide style (see `button-material.md`).

## Use When

- Changing the footer, the contact ask, or the leaf garden.
- Adding a page-level contact section: don't; the footer is the contact.

## Gotchas

- `LeafGarden` is MIT, ported from Onload's pen. Keep the licence notice at the
  top of `src/components/ui/leaf-garden.tsx`.
- The garden only animates in a visible tab. An automated browser whose tab
  reports `visibilityState: "hidden"` pauses requestAnimationFrame, so growth
  and sway look frozen there. That doesn't mean it's broken.
- The colophon page lost its link when the old footer's "SMAMMAR" link went.
