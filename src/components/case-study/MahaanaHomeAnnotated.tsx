import { cn } from "@/lib/utils";

/**
 * Notes, top to bottom. `at` is the vertical centre of the section on the
 * 455x2312 export, as a percentage, so each note tracks its section at any
 * width. Sides alternate so neighbouring notes never crowd.
 */
const NOTES = [
  {
    at: 12,
    side: "left",
    title: "How much do I have?",
    body: "Answered before anything else.",
  },
  {
    at: 35.5,
    side: "right",
    title: "Where is my money?",
    body: "One card per product, with its risk.",
  },
  {
    at: 53,
    side: "left",
    title: "Why did it move?",
    body: "Today's market, right under the cards.",
  },
  {
    at: 63.6,
    side: "right",
    title: "Not sure what to do?",
    body: "Book a call with a real advisor.",
  },
  {
    at: 80.5,
    side: "left",
    title: "New to investing?",
    body: "Short videos and reads to learn the basics.",
  },
] as const;

/**
 * A loose hand-drawn arrow pointing right. Flipped to point left for
 * right-hand notes, and for every note below sm, where they all sit right of
 * the screen.
 */
function Arrow({ side }: { side: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 64 28"
      className={cn(
        "h-4 w-8 shrink-0 -scale-x-100 sm:h-5 sm:w-12 lg:h-6 lg:w-14",
        side === "left" && "sm:scale-x-100",
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 20c9-9 22-13 36-10 7 1.5 12 4 18 7" />
      <path d="M49 10.5l8.5 6.5-10 2.5" />
    </svg>
  );
}

/** The full-length home screen with hand-written notes on each section. */
export function MahaanaHomeAnnotated() {
  return (
    <figure className="case-figure my-10">
      <div className="overflow-hidden rounded-xl border border-border bg-background px-4 py-8 sm:px-6">
        {/* Below sm the notes can't flank the screen, so they share one column
            to its right: [screen | notes]. From sm up the screen is centred
            with a note margin either side. */}
        <div className="relative mx-auto grid grid-cols-[minmax(0,1fr)_7rem] gap-2 sm:grid-cols-[1fr_280px_1fr] sm:gap-0">
          <div aria-hidden className="hidden sm:block" />
          <img
            src="/images/projects/mahaana-wealth/home-screen-full.webp"
            alt="The full Mahaana home screen, top to bottom: a greeting, total value of PKR 124,235 with a PKR 29,340 (5.60%) return, a portfolio chart with 1M to All ranges, cards for Save+, Retirement, Gold and Trade each with value, return and risk level, daily market data for KSE100, USD, crude oil and gold, a Wealth Advisor booking card, articles from Mahaana's desk, news, and the tab bar with a central trade button"
            width={455}
            height={2312}
            loading="lazy"
            decoding="async"
            className="block w-full"
          />
          <div aria-hidden />

          {/* Notes are decorative: the alt text covers the same ground. */}
          {NOTES.map((n) => (
            <div
              key={n.title}
              aria-hidden
              style={{ top: `${n.at}%` }}
              className={cn(
                // Caveat is already loaded site-wide (global.css); a second
                // next/font copy downloaded the same face twice.
                "font-hand font-medium",
                "absolute flex -translate-y-1/2 items-center gap-1 text-sm leading-[1.1] text-muted-foreground sm:text-base lg:text-lg",
                // Phone: every note in the right-hand column, arrow first.
                "right-0 left-[calc(100%-7rem)] flex-row-reverse justify-end text-left",
                n.side === "left"
                  ? "sm:right-[calc(50%+148px)] sm:left-0 sm:flex-row sm:text-right"
                  : "sm:right-0 sm:left-[calc(50%+148px)]",
              )}
            >
              <span className="max-w-[13rem]">
                <span className="block text-base text-foreground sm:text-xl lg:text-2xl">
                  {n.title}
                </span>
                {/* Phones get the question only: at that width the screen is ~760px
                    tall, and with the answer too, neighbouring notes collide. */}
                <span className="mt-1 hidden sm:block">{n.body}</span>
              </span>
              <Arrow side={n.side} />
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
