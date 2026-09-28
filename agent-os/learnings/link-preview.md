# Link Preview

## Rule

The site's link preview (Open Graph and Twitter card) is one static image,
`public/images/brand/og.jpg` (1200x630 JPEG, about 120KB), set in
`src/app/layout.tsx` with its size and alt text. Every page uses it.

Chosen on 2026-09-28 after several rounds. It's a scrapbook of the portfolio
on the site's own paper tone with a faint warm grid:

- the headline "Syed Mohammad Ammar, / product designer who / *builds what he
  designs*" in Georgia, top left;
- a yellow sticky note with a handwritten checklist (Product design, App
  design, Design systems, Motion design, Front-end);
- his polaroid ("hi, that's me :)") with the dithered A mark stuck on its
  corner as a die-cut sticker;
- one taped print of Iconimate's site;
- the leaf garden growing up behind the print and the photo as the signature
  motif.

The idea comes from Daniel Sun's preview (danielsun.space): a headline,
sticky-note checklist, polaroid and name tag on a bright desk, with his sun as
the motif. Ammar's version swaps the sun for the leaf garden.

## Rejected

- Plain text cards (name, status, stats): too plain, template-like, wordy.
- Leaves filling the frame: "looks like a forest site rather than a
  portfolio". The garden works as an accent (roughly 15 to 30% of the frame).
- A "HELLO my name is" tag and two project prints: too busy. Keep one project.
- Sage and bright-green backgrounds: the site's paper tone reads as the brand.

## Gotchas

- Only use facts the site already states (see AGENTS.md). The 100 projects is
  a pledge in progress; don't word it as done.
- The image was made by rendering a 1200x630 React stage with the real
  `LeafGarden` on the dev server, then screenshotting it in headless Edge at
  2x with reduced motion emulated (the garden draws fully grown and still) and
  downscaling to JPEG. A garden's canvas clips at its box: widen the box on
  the side stems lean toward, or leaves get cut in a hard line. Changing the
  box width changes the arrangement too (tendrils per 1000px).
- Remove Next's dev badge (`nextjs-portal`) before capturing.

## Verification

After changing the image, check the tags on a built page, and paste the live
URL into a Slack or LinkedIn post preview (they cache previews, so a changed
image may need a new URL or their cache-refresh tool).
