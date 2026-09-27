# Button Material

## Rule

Secondary buttons across the site use one skeuomorphic material, taken from
Daniel Sun's social buttons and first used in the footer's Postcard card:

- a light top-to-bottom gradient with a hairline ring, a soft layered drop,
  and inset highlights top and bottom (a darker version in dark mode);
- icons at 60% opacity, rising to about 92% on hover (fine pointers only);
- a press that scales to 0.96 and sinks in with an inset shadow;
- a 2px ring outline on keyboard focus.

Use it for primary and secondary buttons alike (the owner asked for every
button to match), social and contact icon buttons, icon buttons with a visible box
(theme toggle, menu, lightbox controls, replay buttons), quiet text buttons
next to a primary, copy buttons, filter chips and toggles (the active one
looks pressed in), and the nav's current tab (raised; the others stay text).
Status pills like the hero's availability badge use `skeu` without
`skeu-press`, since they aren't pressable. Links stay links: "Explore more" on
the home wall and "Read case study" are plain text links.

## How

- Classes live in `src/styles/global.css` under "Skeuomorphic buttons", inside
  `@layer components` so Tailwind utilities can resize them:
  - `skeu`: the material.
  - `skeu-press`: hover, press, focus and icon dimming.
  - `skeu-icon`: a 44px square with 12px corners.
  - `skeu-button`: a 44px-tall text button.
  - `skeu-pill` and `skeu-copy`: the email pill and its copy button.
  - `status-dot`: the availability dot.
- The components are in `src/components/ui/skeu.tsx`: `SkeuIconLink`,
  `SkeuIconButton`, `SocialButtons`, `EmailPill`, `StatusDot`, `BrandIcon`,
  `MailIcon`. The shadcn `Button` also has a `skeu` variant.
- Social profiles and their brand paths come from `src/data/social.ts`.
- Sizes: 44px wherever there's room (footer, mobile menu); `size-9
  rounded-[10px]` in the 64px desktop nav and 56px mobile bar; `size-8
  rounded-lg` for replay buttons inside demo cards.

## Why

The owner picked this look in the footer prototype and asked for it
everywhere similar buttons appear, so the site's quiet actions share one
tactile language instead of a mix of ghost, outlined and card buttons.

## Use When

- Adding any secondary, icon, copy or chip button.
- Adding social or contact links. Reuse `SocialButtons` and `EmailPill`, not
  new lists.

## Gotchas

- Inline links inside prose (About, Colophon, case studies) stay text links.
- Tool-internal controls in the Pattern Engine (`src/lab/editorial-art`), the
  Lab canvas's dark layout toggle, the dark dynamic-island TOC, and third-party
  Lab demo components keep their own styling.
- `skeu-press` dims every svg inside it to 60%. For an icon that must stay
  solid, override it with a utility on the svg (`opacity-100`).
