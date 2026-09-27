# Phone Menu

## Rule

Below 768px the site's navigation is the **fold menu**: a sheet of panels that
unfolds down from under the phone header, after Justin Windle's Makisu (MIT;
the licence is kept in `src/components/layout/FoldMenu.tsx`). The header and
the menu's contents live in `src/components/layout/MobileChrome.tsx`, which
all three layouts use (`(site)`, `(tool)`, `not-found`).

Built on 2026-09-27, replacing a full-screen overlay the owner found too
empty (nav floating mid-screen, socials stranded at the bottom).

- The menu button's three bars morph into an X and back (`.menu-icon` in
  `styles/global.css`): opening slides the outer bars onto the middle one,
  then turns them; closing turns them back, then slides them apart.
- Panels, top to bottom: one per `siteConfig.nav` item (label, then an
  arrow, or "Current" on the current page; the owner removed the "01"-style
  numbers), a status row (green dot, "Open to new projects", Karachi time),
  then the contact row: a full-width "Reach out" mailto button (same subject
  as the hero's CTA) beside the social icon buttons.
- It's a disclosure, not a dialog: `aria-expanded` on a button labelled
  "Menu", the menu right after it in tab order, page dimmed and scroll-locked
  behind it. It closes on Escape (focus back to the button), a tap on the
  dim, following a link, a route change, tabbing past it, or widening past
  Tailwind's `md` (matched as `(width >= 48rem)`, not 768px). It turns
  `inert` the moment it closes, so while it folds away it can't be tabbed
  into or tapped; it turns `visibility: hidden` once the fold ends. While it
  shows, the header is raised to `z-[100]` (it holds the menu), above pages'
  own z-50 layers such as Pattern Engine's controls sheet.
- Sound: synthesized paper (air plus a snap and knock per panel as it lands,
  rising in pitch opening, falling closing). `primeFoldSound()` must run in
  the tap's own handler, or iOS won't play it.

## Gotchas

- **Panel heights.** Folded, the panels zig-zag inside the first one's
  height. Every panel but the last must be that height (64px, `h-16`), and a
  taller last panel needs an odd panel count, where it folds up behind the
  header. With an even count it hangs below the fold and shows while the
  menu closes. That's why the status row is its own nav-height panel. Adding
  or removing a nav item flips the parity: rebalance, e.g. merge the status
  row into the contact panel. In development FoldMenu warns in the console.
- **Easing goes on each keyframe.** Makisu's keyframes were CSS animations,
  which ease every segment. In the Web Animations API an `easing` in the
  timing options spans the whole path, so a panel would hit its overshoot at
  full speed and snap back. Put `easing` on each keyframe object instead.
- **Interrupting.** A toggle mid-fold moves only the panels not yet where
  they're headed, each straight from its current angle (no overshoot, no new
  swing), with the stagger restarting at the first of them. Keeping the
  full delays left panels hanging mid-air; replaying the paths made open
  panels flap. Current angles are read from the computed `matrix3d`
  (`angleOf`): interpolating from the raw matrix would take the short way
  round and turn some panels the wrong way.
- **3D context.** The scroll box around the panels clips them (that's what
  hides the folded panels behind the header), so the `preserve-3d` chain
  starts inside it, at `.fold-scene`.
- **Reduced motion** opens and closes instantly, with one snap for sound.

## Verification

The browser pane is often a hidden tab, which stalls animation. Film it in
headless Edge over the DevTools protocol instead: set a 375px mobile viewport,
tap the menu button with `Input.dispatchMouseEvent` (a real gesture, so audio
runs), and capture a burst of screenshots through the unfold and the fold.
Check that nothing peeks below the header after the fold, that the menu ends
`inert` and hidden, and that `document.body.style.overflow` is restored.
