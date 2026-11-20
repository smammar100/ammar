import type { CSSProperties, ReactNode } from "react";
import { ALargeSmall, Scaling, Type } from "lucide-react";
import { AvailabilityBadge } from "@/components/home/AvailabilityBadge";
import { HeroIntro } from "@/components/home/HeroIntro";
import { SelectionSize } from "@/components/home/SelectionSize";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

/**
 * The home page hero: the headline drawn as if it were still open in a design
 * tool, with its guides, a selection and the spec notes left on. After the
 * hero on interfaces.dev, in this site's own type, tokens and button material.
 *
 * Three rules hold the annotations together:
 *
 * 1. Every note is true. The swatch is the page background and names its
 *    token value, the guides sit on Geist's x-height and baseline, the size
 *    readout is measured, the font note names the class on that line, and the
 *    spacing block is the 32px gap it labels.
 * 2. Everything on the headline is positioned in em, so the drawing scales
 *    with the type. The type itself scales with the column (cqw) so the three
 *    lines never re-wrap.
 * 3. The notes are decoration. They are aria-hidden, and their words are drawn
 *    by CSS from data attributes, so the <h1> holds the headline and nothing
 *    else for screen readers and crawlers.
 *
 * On load it builds itself in the order you'd make it, in about 1.5s: the
 * content arrives first, word by word, then the drawing goes on top of it.
 * Each annotation waits for the thing it marks to settle, and each note grows
 * out of the end of its leader. The motion is the site's build-in system (the
 * `b-*` classes and [data-build] rules in styles/global.css); the running
 * order is the table below.
 */

const heroCta = "Start a project with me";

/** A build-in piece's start time, read by the `b-*` classes as --d. */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// The intro's running order, in ms from first paint. Content enters over
// 400ms, so a piece that annotates something starts once that has settled.
const WORD_STEP = 80;
const T = {
  pill: 0,
  gap: 200, // the 32px block grows down out of the pill
  gapLabel: 460, // once the block is full height
  words: 100, // the headline's first word; the rest follow WORD_STEP apart
  cta: 680, // a beat after the last word, "Builds" (580)
  guides: 700, // once "Ammar" (260 + 400) has settled
  drag: 880, // once "Designer" (420 + 400) has settled
  xHeightNote: 1040, // as the x-height guide reaches the end of the line
  fontNote: 1160,
  colourNote: 1280,
};
const word = (i: number) => T.words + i * WORD_STEP;

// The intro plays once per browser session: after that the hero is served
// finished, on reloads and on coming back from another page. In development
// it plays on every load, so the motion can be reviewed with a refresh.
const INTRO_ONCE = process.env.NODE_ENV === "production";
const INTRO_KEY = "hero-intro";
// Runs as the hero is parsed, before any of it is painted. HeroIntro does the
// same for client-side navigation and skips heroes this has already checked.
const introGate = `(function(s){var h=s.parentElement;h.dataset.introChecked="1";try{if(sessionStorage.getItem("${INTRO_KEY}")){h.removeAttribute("data-build")}else{sessionStorage.setItem("${INTRO_KEY}","1")}}catch(e){}})(document.currentScript)`;

// Geist, measured in Chrome at line-height 1: the baseline sits 0.855em below
// the top of the line, the x-height is 0.54em and capitals are 0.71em tall.
const X_HEIGHT = "top-[0.315em]";
const BASELINE = "top-[0.855em]";

// The page background, as written in styles/global.css (--background).
const BACKGROUND = { light: "oklch(0.98 0.004 80)", dark: "oklch(0.14 0.01 60)" };

/** One word of the headline, arriving on its own beat. */
function Word({ at, children }: { at: number; children: string }) {
  return (
    <span className="b-in inline-block" style={d(at)}>
      {children}
    </span>
  );
}

/** A note's words, drawn by CSS so they never join the headline's text. */
function Words({ children }: { children: string }) {
  return <span data-label={children} className="after:content-[attr(data-label)]" />;
}

/** A spec note: a small raised chip in the button material, in a hairline frame. */
function Note({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "block shrink-0 rounded-[9px] bg-background p-[3px] shadow-[0_0_0_1px_var(--pattern-fg)]",
        className,
      )}
    >
      <span className="skeu flex h-6 items-center gap-1.5 rounded-md pr-1.5 pl-1 font-mono text-xs leading-none font-normal tracking-normal whitespace-nowrap text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0">
        {children}
      </span>
    </span>
  );
}

/** The end of a leader line: a ring where it meets the thing it points at. */
function Dot() {
  return (
    <span className="block size-[9px] shrink-0 rounded-full bg-(--pattern-fg) p-0.5">
      <span className="block size-full rounded-full bg-background" />
    </span>
  );
}

const leader = "shrink-0 border-dashed border-(--pattern-fg)";
const guide = "absolute -inset-x-2 -z-10 h-[max(1px,0.03em)] bg-accent";
const handle = "absolute size-1.5 border border-accent bg-background";

/**
 * One piece of the selection's drag (b-track): a full-size layer that slides
 * out of the box's top-left corner. `x` and `y` say whether it travels on that
 * axis ("-100%") or is pinned to it ("0%").
 */
const dragPiece = "b-track absolute inset-0";
const track = (x: string, y: string) => ({ ...d(T.drag), "--tx": x, "--ty": y }) as CSSProperties;

/**
 * The call to action, in the site's skeuomorphic button material
 * (styles/global.css, "Skeuomorphic buttons"). There is no contact page, so it
 * opens an email with the subject filled in.
 */
function HeroCta() {
  return (
    <a
      href={`mailto:${siteConfig.social.email}?subject=${encodeURIComponent("New project")}`}
      className="group skeu skeu-press skeu-button"
    >
      {heroCta}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        ↗
      </span>
    </a>
  );
}

export function AnnotatedHero({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "pt-14 pb-12 md:pt-20 md:pb-16",
        // The accent, darkened on the light theme so 12px mono text in it
        // stays readable. Dark mode's accent is already light enough.
        "[--note-ink:color-mix(in_oklch,var(--accent)_58%,var(--foreground))] dark:[--note-ink:var(--accent)]",
        className,
      )}
      // Served playing, so the intro starts at first paint. The gate below
      // takes the attribute off again for a visitor who has already seen it,
      // which is why React is told not to compare it.
      data-build="play"
      data-hero-intro
      suppressHydrationWarning
    >
      {INTRO_ONCE && (
        <>
          <script dangerouslySetInnerHTML={{ __html: introGate }} />
          <HeroIntro storageKey={INTRO_KEY} />
        </>
      )}

      {/* The gap between the status pill and the headline is this block:
          32px, as labelled, centred under the pill. */}
      <div className="flex w-fit flex-col items-center">
        <AvailabilityBadge className="b-in" />
        <div
          aria-hidden="true"
          className="b-drop relative size-8 border-x border-accent bg-accent/10 select-none"
          style={d(T.gap)}
        >
          <span
            className="b-note absolute top-1/2 left-full ml-2 origin-left -translate-y-1/2 font-mono text-xs whitespace-nowrap text-(--note-ink)"
            style={d(T.gapLabel)}
          >
            <Words>32 px</Words>
          </span>
        </div>
      </div>

      {/* The size container the headline's type scales against. */}
      <div className="@container">
        {/* The name is the widest line at 11.22em, so 8.8cqw fills a phone's
            column with it. From sm up it eases to 8.2cqw, which leaves room
            for the x-height note to hang off the end of the line. */}
        <h1 className="flex flex-col items-start text-[length:clamp(1.125rem,8.8cqw,3.75rem)] leading-none font-medium tracking-tight sm:text-[length:clamp(1.125rem,8.2cqw,3.75rem)]">
          {/* Line 1: the name, on its x-height and baseline guides. */}
          <span className="relative isolate whitespace-nowrap">
            <Word at={word(0)}>Syed</Word> <Word at={word(1)}>Mohammad</Word> <Word at={word(2)}>Ammar</Word>
            <span aria-hidden="true" className="pointer-events-none select-none">
              {/* Ruled left to right under the settled name, the baseline a
                  beat behind the x-height. */}
              <span className={cn(guide, X_HEIGHT, "b-grow")} style={d(T.guides)} />
              <span className={cn(guide, BASELINE, "b-grow")} style={d(T.guides + 60)} />

              {/* Points at the end of the x-height guide, and grows out of
                  the dot there. On a phone the name fills the line, so the
                  note tucks inside the right edge, and where the column is
                  under 21rem (most phones) it would run into the status pill,
                  so it steps aside. */}
              <span
                className="b-note absolute right-0 bottom-[calc(100%-0.315em+4px)] hidden origin-bottom-right flex-col items-end @[21rem]:flex sm:right-auto sm:left-[calc(100%+6px)] sm:origin-bottom sm:-translate-x-1/2 sm:items-center"
                style={d(T.xHeightNote)}
              >
                <Note>
                  <ALargeSmall strokeWidth={1.75} />
                  <Words>x-height</Words>
                </Note>
                <span className={cn(leader, "mr-3 h-3 border-l sm:mr-0")} />
                <span className="mr-2 sm:mr-0">
                  <Dot />
                </span>
              </span>
            </span>
          </span>{" "}
          {/* Line 2: the role, with one word selected. */}
          <span className="whitespace-nowrap text-secondary-foreground">
            <Word at={word(3)}>Product</Word>{" "}
            <span className="group relative isolate inline-block">
              <Word at={word(4)}>Designer</Word>
              {/* The box clears the capitals and the g's tail by the same
                  0.12em. Its size note hangs off the bottom-right handle, the
                  corner a design tool reports the size at while you drag it,
                  which also keeps it clear of the font note beside line 3.

                  On load it is dragged out from the top-left corner, all in
                  translates: the box's fill and far edges, and its two near
                  edges, slide out from behind a clip; each handle rides an
                  unclipped layer that moves the way its corner does. The
                  size note rides with the bottom-right handle and reads how
                  far that has got, so it counts up through the drag. */}
              <span
                aria-hidden="true"
                data-selection
                className="pointer-events-none absolute -inset-x-[0.07em] top-[0.025em] -bottom-[0.145em] -z-10 select-none"
              >
                <span className="absolute inset-0 overflow-hidden">
                  <span
                    className={cn(
                      dragPiece,
                      "border-r border-b border-accent bg-accent/8 transition-colors duration-200 ease-out group-hover:bg-accent/16",
                    )}
                    style={track("-100%", "-100%")}
                  />
                  <span className={cn(dragPiece, "border-t border-accent")} style={track("-100%", "0%")} />
                  <span className={cn(dragPiece, "border-l border-accent")} style={track("0%", "-100%")} />
                </span>
                <span className={dragPiece} style={track("0%", "0%")}>
                  <span className={cn(handle, "-top-[3.5px] -left-[3.5px]")} />
                </span>
                <span className={dragPiece} style={track("-100%", "0%")}>
                  <span className={cn(handle, "-top-[3.5px] -right-[3.5px]")} />
                </span>
                <span className={dragPiece} style={track("0%", "-100%")}>
                  <span className={cn(handle, "-bottom-[3.5px] -left-[3.5px]")} />
                </span>
                <span data-selection-corner className={dragPiece} style={track("-100%", "-100%")}>
                  <span className={cn(handle, "-right-[3.5px] -bottom-[3.5px]")} />
                  <span className="absolute top-full left-full hidden -translate-x-1/2 flex-col items-center pt-1 md:flex">
                    <span className={cn(leader, "h-3.5 border-l")} />
                    <Note>
                      <Scaling strokeWidth={1.75} />
                      <SelectionSize fallback="249 × 67" />
                    </Note>
                  </span>
                </span>
              </span>
            </span>{" "}
            <Word at={word(5)}>who</Word>
          </span>{" "}
          {/* Line 3: the verb, in the pixel face, slanted. Geist Pixel has no
              italic of its own, so the browser obliques it; the note stands
              upright (not-italic) and a little further off, clear of the
              slant's overhang. */}
          <span className="relative font-pixel font-normal tracking-normal whitespace-nowrap text-secondary-foreground italic">
            <Word at={word(6)}>Builds</Word>
            <span
              aria-hidden="true"
              className="b-note pointer-events-none absolute top-1/2 left-full ml-[0.22em] hidden origin-left -translate-y-1/2 items-center not-italic select-none sm:flex"
              style={d(T.fontNote)}
            >
              <Dot />
              <span className={cn(leader, "w-5 border-t")} />
              <Note>
                <Type strokeWidth={1.75} />
                <Words>font-pixel</Words>
              </Note>
            </span>
          </span>
        </h1>
      </div>

      <div className="b-in mt-8 flex w-fit" style={d(T.cta)}>
        <HeroCta />
      </div>

      {/* The colour note, under the button, growing down out of its dot. Its
          leader ends on the page itself, which is the colour the swatch
          shows and the note names. */}
      <div
        aria-hidden="true"
        className="b-note pointer-events-none mt-3 flex w-fit origin-top flex-col items-center select-none"
        style={d(T.colourNote)}
      >
        <Dot />
        <span className={cn(leader, "h-3.5 border-l")} />
        <Note>
          <span className="size-4 rounded-sm bg-background shadow-[inset_0_0_0_1px_var(--pattern-fg)]" />
          <span
            data-light={BACKGROUND.light}
            data-dark={BACKGROUND.dark}
            className="after:content-[attr(data-light)] dark:after:content-[attr(data-dark)]"
          />
        </Note>
      </div>
    </section>
  );
}
