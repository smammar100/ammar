"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

// Onboarding carousel. Each slide is one Figma strip of six screens, in the order
// someone meets them. Swiping is native horizontal scroll with snap, so touch and
// trackpads need no gesture code; mouse drags, the dots and arrow keys drive that
// same scroll position, and the active dot reads back from it.

type Drag = { x: number; left: number; from: number; lastX: number; lastT: number; velocity: number };

const SLIDES = [
  {
    src: "/images/projects/mahaana-wealth/onboarding-1-account.webp",
    caption: "Choosing an account",
    alt: "Six onboarding screens: choosing between Mahaana Save+ and Mahaana Retirement, the Mahaana x IGI retirement overview, picking a voluntary or occupational pension scheme, who the Voluntary Pension Scheme is for, the two-part set-up checklist, and the annual income question",
  },
  {
    src: "/images/projects/mahaana-wealth/onboarding-2-risk-profile.webp",
    caption: "Risk profile, one question per screen",
    alt: "Six risk profile questions, one per screen: sources of income, occupation, highest education, marital status, whether you save or invest regularly, and how long you plan to keep the investment",
  },
  {
    src: "/images/projects/mahaana-wealth/onboarding-3-risk-profile.webp",
    caption: "Risk profile, continued",
    alt: "Six more risk profile questions: investing experience, the main reason for investing, when you plan to use the money, what you would do if its value dropped 10 to 15 percent, how stable your income is, and insurance cover",
  },
  {
    src: "/images/projects/mahaana-wealth/onboarding-4-identity-review.webp",
    caption: "Risk level, identity, first investment and review",
    alt: "Six screens that close onboarding: the suggested Balanced risk level with its asset allocation, CNIC photo upload with consent to NADRA verification, CNIC details being extracted, permanent and mailing address, the first investment amount with a five-year projection, and the final review",
  },
];

export function MahaanaOnboarding() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const last = SLIDES.length - 1;

  const go = (next: number) => {
    const track = trackRef.current;
    if (!track || next < 0 || next > last) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: next * track.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };

  const drag = useRef<Drag | null>(null);
  const settleTo = useRef<number | null>(null);
  const settleTimer = useRef<number | undefined>(undefined);

  const clamp = (i: number) => Math.min(last, Math.max(0, i));

  const restoreSnap = () => {
    if (trackRef.current) trackRef.current.style.scrollSnapType = "";
    settleTo.current = null;
    window.clearTimeout(settleTimer.current);
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setIndex(clamp(Math.round(track.scrollLeft / track.clientWidth)));
    if (settleTo.current !== null && Math.abs(track.scrollLeft - settleTo.current * track.clientWidth) < 2) {
      restoreSnap();
    }
  };

  // Mouse only: touch and pens already swipe through native scrolling, and
  // intercepting them would fight the browser's own momentum. Snapping is off for
  // the drag, because a mandatory snap yanks scrollLeft back on every pointermove,
  // and comes back on once the settle animation lands (or after a timeout, since
  // scrolling to where the track already is fires no scroll event).
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const track = event.currentTarget;
    restoreSnap();
    track.setPointerCapture(event.pointerId);
    track.style.scrollSnapType = "none";
    drag.current = {
      x: event.clientX,
      left: track.scrollLeft,
      from: clamp(Math.round(track.scrollLeft / track.clientWidth)),
      lastX: event.clientX,
      lastT: event.timeStamp,
      velocity: 0,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    event.currentTarget.scrollLeft = d.left - (event.clientX - d.x);
    const dt = event.timeStamp - d.lastT;
    if (dt > 0) d.velocity = (event.clientX - d.lastX) / dt;
    d.lastX = event.clientX;
    d.lastT = event.timeStamp;
  };

  // A tenth of a slide is enough to commit, and so is a quick flick; anything less
  // springs back to where the drag started.
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const track = event.currentTarget;
    // A cancelled pointer's coordinates are not reliable, so it just springs back.
    const dx = event.type === "pointercancel" ? 0 : event.clientX - d.x;
    const flick = Math.abs(d.velocity) > 0.4 && Math.abs(dx) > 10 && event.timeStamp - d.lastT < 100;
    const far = Math.abs(dx) > track.clientWidth * 0.1;
    const target = clamp(flick || far ? d.from - Math.sign(dx) : d.from);

    if (Math.abs(track.scrollLeft - target * track.clientWidth) < 2) {
      restoreSnap();
      return;
    }
    settleTo.current = target;
    settleTimer.current = window.setTimeout(restoreSnap, 800);
    go(target);
  };

  // Handled here rather than left to native arrow-key scrolling, which moves by a
  // fixed distance and lands on the next snap point only in some browsers.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    go(index + (event.key === "ArrowRight" ? 1 : -1));
  };

  return (
    <figure className="case-figure my-10">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Mahaana onboarding screens"
        tabIndex={0}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain select-none rounded-xl border border-border pointer-fine:cursor-grab pointer-fine:active:cursor-grabbing bg-[#FAF8F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${SLIDES.length}: ${slide.caption}`}
            className="w-full shrink-0 snap-start snap-always"
          >
            <img
              src={slide.src}
              alt={slide.alt}
              width={2580}
              height={931}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="block h-auto w-full"
            />
          </div>
        ))}
      </div>

      {/* The dots are the only visible control, so they are real buttons: each
          names the stage it jumps to and marks the one on screen. The button is
          taller than the dot so it stays tappable without spacing the row out. */}
      <div className="mt-3 flex justify-center">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show ${slide.caption.toLowerCase()}`}
            aria-current={i === index}
            onClick={() => go(i)}
            className="group flex h-8 items-center rounded-full px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              className={cn(
                "block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none",
                i === index
                  ? "w-4 bg-foreground"
                  : "w-1.5 bg-muted-foreground/30 group-hover:bg-muted-foreground/60",
              )}
            />
          </button>
        ))}
      </div>
    </figure>
  );
}
