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

/** A loose hand-drawn arrow pointing right; flipped for right-hand notes. */
function Arrow({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 28"
      className={cn("h-5 w-12 shrink-0 lg:h-6 lg:w-14", flip && "-scale-x-100")}
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
        <div className="relative mx-auto grid max-w-[300px] grid-cols-1 sm:max-w-none sm:grid-cols-[1fr_280px_1fr]">
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
          <div aria-hidden className="hidden sm:block" />

          {/* Notes are decorative (the alt text covers the same ground), and
              drop out below sm where the margins can't hold them. */}
          {NOTES.map((n) => (
            <div
              key={n.title}
              aria-hidden
              style={{ top: `${n.at}%` }}
              className={cn(
                // Caveat is already loaded site-wide (global.css); a second
                // next/font copy downloaded the same face twice.
                "font-hand font-medium",
                "absolute hidden -translate-y-1/2 items-center gap-1 text-base leading-[1.1] text-muted-foreground sm:flex lg:text-lg",
                n.side === "left"
                  ? "left-0 right-[calc(50%+148px)] flex-row justify-end text-right"
                  : "left-[calc(50%+148px)] right-0 flex-row-reverse justify-end text-left",
              )}
            >
              <span className="max-w-[13rem]">
                <span className="block text-xl text-foreground lg:text-2xl">
                  {n.title}
                </span>
                <span className="mt-1 block">{n.body}</span>
              </span>
              <Arrow flip={n.side === "right"} />
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
