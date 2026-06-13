# Content Refresh — Patrick Morgan → Syed Mohammad Ammar

## Status

Complete — code, content, and docs landed on this branch. The Owner TODOs
section below is the open launch checklist and stays live until each item is
done.

## Context

This codebase began as Patrick Morgan's portfolio (itspatmorgan.github.io) and
was adopted as the foundation for Syed Mohammad Ammar's site. A partial rename
had already landed (root title template, TopNav brand, Karachi local time, lab
page titles), but the rest of the site — hero, About biography, Work case
studies, the 26 Unknown Arts articles, testimonials, community photos, resume,
social links, and docs — still described Patrick.

Ammar's positioning is "Design Engineer": a Senior Product Designer at Mahaana
(YC W22) with a CS degree, publicly shipping 100 built projects
(#DesignEngineeringThe100) to earn the title. The goal of this refresh is that
design/tech leaders and YC-startup founders land on the site and want to hire
or collaborate with him — with magnetic but strictly truthful copy.

### Verified sources (every factual claim on the site traces to these)

- LinkedIn — `https://www.linkedin.com/in/syedmammar/`: headline, roles
  (Mahaana, NUMI, PeerDrop, Gamolytics), education (Harbour.Space, FAST-NUCES),
  outcome metrics, and his public posts (the 100-projects pledge, 21st.dev #1
  Top Author run, ThumbGen launch, Track & Tread, Grok landing-page reimagine).
- Medium — `@SMAmmar` in the Design Bootcamp publication: the Airbnb-style 3D
  icon system series (JSON "style engine"), including Part 2 at
  `https://medium.com/design-bootcamp/how-i-built-a-consistent-airbnb-style-3d-icon-system-with-json-part-2-7ad582c915fc`.
- GitHub — `https://github.com/SMAmmar14`.
- Web search cross-checks: Mahaana (YC W22, SECP-licensed, Tundra Fonder
  founders), Truewind (YC W23), Track & Tread at
  `https://trackandtread.netlify.app`.
- Direct input from Ammar: positioning ("Design Engineer"), social set
  (LinkedIn, GitHub, X, CodePen), email `mrammarbest110@gmail.com`.

Anything not in those sources does not appear on the site. No testimonials
exist, so Kind Words is an honest empty state. There is no newsletter, so every
newsletter mention was removed. X and CodePen handles are unverified, so they
are empty-string placeholders the UI must skip.

## Desired Outcome

- Every page, metadata block, data file, and doc describes Ammar, not Patrick.
- Hero: "Ammar designs it, builds it, ships it." with the Mahaana receipt line;
  About tells the CS → designer → design-engineer arc in nine paragraphs;
  closing CTA is "Let's build something worth shipping." with email/LinkedIn.
- Work carries four canonical slugs: `mahaana-wealth`, `truewind-rebrand`,
  `peerdrop` (professional, wired to roles), and `design-engineering-100`
  (the 100-projects pledge).
- Writing carries two Medium-canonical summaries:
  `airbnb-style-engine-part-1` and `airbnb-style-engine-part-2`.
- Lab is unchanged: `pattern-engine`, `pixel-wave`, `pixel-mark`.
- Nothing fabricated: no invented quotes, metrics, handles, photos, or links.

## Approach

Surface-by-surface, against a locked fact sheet and locked copy direction:

- Data layer (`src/data/`): `site-config.ts` rewritten for Ammar (name, title,
  description, `https://www.smammar.com` with confirm-TODO, nav without
  Community, `links.mahaana`, social set with empty X/CodePen placeholders, no
  `newsletter` key). `experience.ts` reduced to four roles (Mahaana, NUMI,
  PeerDrop, Gamolytics). `commendations.ts` emptied with an honest TODO.
  `community.ts` rewritten around the build-in-public story with four
  placeholder photo slots kept (home page hard-indexes entries 0 and 3).
- Pages (`src/app/`): home hero/intro/current-work line, closing CTA + contact
  line, Writing section (the old newsletter card removed), About biography,
  Work, Resume, Community, Colophon, Style Guide, and per-page metadata
  (including the `(tool)` lab pages) rebranded; newsletter clauses removed
  everywhere. The Colophon keeps one intentional provenance credit linking the
  original author of the scaffold.
- Components (`src/components/`, `src/lab/`): Substack social entry removed
  from TopNav and MobileChrome, empty social hrefs skipped, mobile logo mark
  and aria-label corrected, WritingIndexClient subscribe line replaced,
  exported-art credit changed from the previous owner's handle to
  `smammar.com` (domain still has a confirm-TODO).
- Content (`src/content/`): Patrick's five project case studies replaced by
  the four canonical Ammar slugs; the 26 Unknown Arts article reproductions
  replaced by the two Medium-canonical summaries; lab entries untouched.
- Docs: `README.md` rewritten (owner, Next.js 15, smammar.com TODO);
  `AGENTS.md` Patrick references removed (overview, tracking, `.reference/`
  warning) and stale Astro-era guidance corrected (tech stack, commands,
  repository map, content-query conventions, legacy sync scripts);
  `agent-os/strategy.md` purpose/audience/tracks updated for Ammar
  and Next.js 15 App Router; this plan records the refresh.

## Scope

In:

- Identity, copy, metadata, data files, content collections, and docs.
- Honest empty states and TODO placeholders where no verified material exists.

Out:

- New photography, logos, or favicon assets (slots kept, files are owner TODOs).
- Deployment pipeline repair (`.github/workflows/deploy.yml` still uses the
  Astro action and is broken for this Next.js repo).
- Lab implementations and interactions (kept exactly as-is).

## Files To Modify

- `src/data/site-config.ts`: identity, URL, nav, links, social set
- `src/data/experience.ts`: Ammar's four roles
- `src/data/commendations.ts`: emptied — no real testimonials yet
- `src/data/community.ts`: build-in-public story, placeholder photo slots
- `src/app/(site)/*`: page copy and metadata per locked copy direction
- `src/app/(tool)/lab/*`: lab page metadata fallbacks scrubbed of old branding
- `src/app/layout.tsx`: root metadata via siteConfig
- `src/styles/global.css`: palette comment no longer attributes the design
  language to the previous owner's newsletter
- `src/components/layout/*`, `src/components/writing/WritingIndexClient.tsx`,
  `src/lab/editorial-art/ArtCanvas.tsx`: chrome and credit cleanup
- `src/content/projects/*`, `src/content/writing/*`: canonical Ammar content
- `README.md`, `AGENTS.md`, `agent-os/strategy.md`: docs rebrand
- `agent-os/plans/content-refresh.md`: this record

## Steps

- [x] Lock the verified fact sheet and copy direction.
- [x] Swap the data layer (site-config, experience, commendations, community).
- [x] Rewrite pages and metadata; remove all newsletter references.
- [x] Replace project and writing content with the canonical slugs.
- [x] Update components (socials, empty-href skipping, marks, credits).
- [x] Refresh docs (README, AGENTS.md, strategy.md) and record this plan.

## Owner TODOs (launch checklist)

### 1. Photos to replace (paths and slots kept; files still show Patrick)

Swap files in place at the same paths and dimensions; alt text is already
updated/flagged in code.

| Path | Dimensions | Used on |
| --- | --- | --- |
| `/images/brand/profile-living-room.jpg` | 2400×2400 | Home desktop hero polaroid (`BuilderPhoto`), About photo grid |
| `/images/brand/profile-living-room-avatar.jpg` | 600×600 | Home mobile hero avatar |
| `/images/brand/personal-dinner.jpg` | 1800×1201 | About photo grid |
| `/images/brand/personal-hollywood.jpg` | 1800×1200 | About photo grid |
| `/images/brand/personal-airport.jpg` | 1800×1350 | About photo grid |
| `/images/brand/profile-picture.jpg` | 400×400 | Root layout OG/Twitter card image |
| `/images/community/patio-selfie.jpg` | 1600×1067 | Home Community slot [0], `/community` |
| `/images/community/backyard-host.jpg` | 1600×1067 | `/community` |
| `/images/community/night-gathering.jpg` | 1600×1200 | `/community` |
| `/images/community/park-group-selfie.jpg` | 1600×1200 | Home Community slot [3], `/community` |

### 2. Handles and URLs to confirm

- X handle → `siteConfig.social.x` (currently `""`; UI skips empty links).
- CodePen handle → `siteConfig.social.codepen` (currently `""`).
- 21st.dev profile URL — cited as #1 Top Author; link it from Work/About once
  confirmed.
- ThumbGen URL — live tool and/or open-source repo link.
- Domain — confirm `https://www.smammar.com` (`siteConfig.url`,
  `metadataBase`). `public/CNAME` still contains `itspatmorgan.com` and must be
  replaced or deleted before any Pages deploy.
- Mahaana URL — confirm `https://mahaana.com` (`siteConfig.links.mahaana`).

### 3. Project thumbnail images per new slug

Per `agent-os/conventions/assets.md`: `thumbnail-*` at 2400×2400, optional
wide `feature-*` at 1920×1080, light/dark pairs supported.

- `/images/projects/mahaana-wealth/`
- `/images/projects/truewind-rebrand/`
- `/images/projects/peerdrop/`
- `/images/projects/design-engineering-100/`

### 4. Collect kind words

Zero testimonials exist today; `src/data/commendations.ts` is intentionally
empty. Ask colleagues, founders, and clients (Mahaana, NUMI/Truewind, PeerDrop)
for short quotes, then populate the data file. Never fabricate.

### 5. Cleanup decisions

- Consider deleting `.reference/` — Patrick's planning material (briefs,
  testimonial quotes, his URLs). AGENTS.md no longer endorses it as a source.
- `/images/brand/patrick-signature.png` (764×376) is now unused — the About
  sign-off is plain text ("— Ammar"). Delete the file, or replace it with an
  Ammar signature mark if a drawn sign-off is wanted later.
- Consider deleting stale assets: `public/images/writing/*` (Patrick's article
  images), `public/images/projects/{characters,expansion,gpts,query,vision}/`,
  `public/images/profiles/*` (testimonial avatars),
  `public/images/unknown-arts/`, and `public/images/logos/career-*.svg`
  (Patrick's employers).
- Favicon set (`public/favicon.svg` + PNGs + apple-touch-icon) is still the
  old braille-P mark; regenerate from the A mark (`DitherAMark`).
- `.github/workflows/deploy.yml` builds with `withastro/action` against a
  Next.js repo — fix or remove before relying on CI.

## Review

- Product: positions Ammar for the target audience (leaders, YC founders) on
  receipts, not adjectives.
- Editorial: copy follows his voice — short, direct, first person, only his
  own three verbatim quotes; no fabricated claims anywhere.
- Design: layouts, interactions, and image slots untouched; only copy, data,
  and alt text changed.
- Architecture: no structural changes beyond what the content swap required;
  Lab untouched.
- Maintenance: TODOs live next to the code they affect; this plan is the
  single launch checklist.
- Verification: `pnpm build` for content/route changes; `pnpm dev` plus
  browser pass over home, About, Work, Writing, Lab.

## Learnings

- A fact-sheet-first rebrand works: lock verified facts and copy before any
  agent edits, and honest placeholders (empty Kind Words, empty social
  handles, TODO photos) always beat invention.
- UI chrome must tolerate empty config values — social link rendering now
  skips empty hrefs, which any future config additions should preserve.
- The home page hard-indexes `communityPhotos[0]` and `[3]`; keep that array
  at four entries until the dependency is removed.
