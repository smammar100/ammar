# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: hiring managers and design leads at product companies, evaluating Syed Mohammad Ammar for a senior design-engineer role. They arrive from a link (LinkedIn, X, GitHub, 21st.dev, or a direct application), usually skim first on whatever device is to hand, and are comparing several candidates in a short sitting. They are looking for evidence that one person can both design and ship.

Secondary, not the design target: founders scouting freelance help, and peers in the design-engineering community following the 100-projects run. Neither should shape decisions when they conflict with the primary reader.

## Product Purpose

A personal portfolio that proves Ammar designs and builds the same work, and converts a skimming evaluator into an email about a role or project. Success is a message arriving, not time on page. Depth exists to earn that message, so a visitor who reads one case study end to end should finish it already convinced.

## Positioning

A product designer who ships the production code, where every claim is checkable in public. The mechanism a neighbouring portfolio cannot truthfully copy is the artifact trail: Iconimate is a live, MIT-licensed, installable 186-icon library he designed and built alone; he is #1 Top Author on 21st.dev; the Mahaana rebuild took Lighthouse performance from 57 to 100. The site itself is part of the argument, and is expected to hold up to a view-source.

## Operating Context

- Evaluators skim before they read. Scanning order and the first viewport carry disproportionate weight.
- Traffic is inbound from profile links and applications, so a visitor usually arrives already knowing the name and looking to verify it.
- Case studies are the depth layer, reached from the home page or `/work`, and are read on both desktop and mobile.
- Live, interactive demos are a deliberate part of the evidence: the Iconimate case study runs the real components rather than describing them.
- Content is authored as MDX with structured frontmatter, so writing a case study means filling in fields, not building a page.

## Capabilities and Constraints

- Next.js 15 (App Router, React 19, TypeScript), Tailwind, `motion`, MDX via `next-mdx-remote`. Dev server runs on port 4321.
- Content lives in `src/content/{projects,writing,lab}`; `src/lib/content.ts` is the typed content layer. Frontmatter is parsed with gray-matter, so any value containing `: ` must be quoted or it breaks the build.
- Case studies support two layouts. Defining `tagline` in frontmatter switches on the structured header (hero, then a two-column facts/overview block); projects without it keep the original title-and-skills header.
- Structured case studies use a 70ch measure centred in a `max-w-4xl` article. Text and demos fill the measure; only the lead thumbnail bleeds wider.
- Light and dark themes are user-toggled via a `dark` class on the root, not `prefers-color-scheme`.
- Undecided or outstanding: `/community` currently 404s; the four older case studies have not been migrated to the structured layout; Truewind, PeerDrop, and The 100 have no project imagery; dark-mode thumbnails, a resume PDF, the real X and CodePen handles, and the confirmed Mahaana URL are all still missing.

## Brand Commitments

Binding, confirmed by the user:

- The warm cream palette and the dithered "A" mark are settled identity, not a starting point.
- Name and voice: Syed Mohammad Ammar, Design Engineer. "Ammar designs it, builds it, ships it." "Receipts, not adjectives." Plain, declarative, evidence-first, no adjective inflation.
- Typography is Geist and Geist Mono, with mono reserved for labels, metadata, and code.
- Prose contains no em dashes; the site was deliberately swept of them, and replacements were rewritten (colon, comma, or full stop) rather than substituted mechanically.

## Evidence on Hand

Real, verified, and safe to cite:

- **Iconimate** ([iconimate.app](https://iconimate.app), [github.com/smammar100/Iconimate](https://github.com/smammar100/Iconimate)): 186 animated React icons, MIT, TypeScript, 8 GitHub stars, distributed as a shadcn-style registry plus per-icon AI prompts. Case study at `src/content/projects/iconimate.mdx`, with live components ported into `src/components/case-study/iconimate/`.
- **Mahaana (YC W22)**: Webflow to Next.js + Sanity rebuild, Lighthouse performance 57 to 100. `src/content/projects/mahaana-wealth.mdx`.
- **PeerDrop**: 1,000+ beta users, +34% order acceptance, GBP 40,000 seed raise, 17% faster build cycles. `src/content/projects/peerdrop.mdx`.
- **Truewind (YC W23)**: full rebrand through NUMI (YC), delivered in under two weeks. `src/content/projects/truewind-rebrand.mdx`.
- **The 100 / 21st.dev**: #1 Top Author, 4 components, 695 bookmarks. `src/content/projects/design-engineering-100.mdx`.
- Real photographs of Ammar in `public/images/brand/` and `public/images/community/`.

Absences that must never be filled by invention:

- **There are no testimonials.** `src/data/commendations.ts` is deliberately empty and the wall does not render until real entries exist. Quotes must never be fabricated.
- No customer logos, no press, no pricing, no revenue figures, no client list beyond the roles already recorded in `src/data/experience.ts`.

## Product Principles

1. **Every claim is backed by a shipped artifact.** Nothing goes on the site without something real and reachable behind it. This is a product rule, not a tagline.
2. **Never fabricate proof.** No invented testimonials, metrics, logos, or credentials. An honest absence beats a plausible fiction, and a gap is left visible until it can be filled truthfully.
3. **Show the work running, not described.** Where an artifact can be demonstrated in the page, demonstrate it; prose is the fallback, not the default.
4. **Earn the skim before the read.** The evaluator decides in the first viewport whether to continue, so structure and evidence density come before depth.
5. **The site is a work sample.** Implementation quality, accessibility, and view-source legibility are part of the portfolio, not overhead.

## Accessibility & Inclusion

No formal standard has been set by the user. Established in practice, and expected of future work:

- Interactive demos are reachable and operable by keyboard, not hover-only. Iconimate's icons expose `startAnimation` / `stopAnimation` so tap, focus, and app logic can drive them, and the case study's demos wire focus alongside hover.
- Wide content (tables, demo grids) scrolls inside its own container so the page body never scrolls horizontally.
- Known upstream gap, recorded so the site does not overclaim: 8 of 9 Iconimate icons hardcode `reduced = false` and intentionally do not gate on the OS reduced-motion preference. The case study wording was corrected to avoid claiming a reduced-motion fallback the shipped code does not provide.
