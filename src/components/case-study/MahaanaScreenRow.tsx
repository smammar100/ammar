"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const SCREENS: { src: string; width: number; height: number; alt: string }[] = [
  { src: "screen-01", width: 360, height: 810, alt: "Discover: Mahaana AI's 'Ask any question about finance' prompt over Market today and the sector heatmap" },
  { src: "screen-02", width: 375, height: 810, alt: "The Mahaana X IGI Life insurance plan, with its Takaful cover details and an enable toggle" },
  { src: "screen-03", width: 380, height: 812, alt: "Select an investment account: Save+, Retirement and Gold product cards" },
  { src: "screen-04", width: 375, height: 812, alt: "Welcome to Mahaana, Noor: a short video on why Mahaana exists, with a Start investing button" },
  { src: "screen-05", width: 360, height: 810, alt: "Explore market: index tiles and Mahaana's Pick of stocks with prices and daily change" },
  { src: "screen-06", width: 375, height: 810, alt: "Home: total value of PKR 124,235 over a performance chart, then the Save+ and Retirement product cards" },
  { src: "screen-07", width: 375, height: 810, alt: "Choose a risk level: an Aggressive gauge, a risk slider and the resulting asset allocation" },
  { src: "screen-08", width: 375, height: 812, alt: "Saving that suits your lifestyle: a 20% tax-credit promo with Log in and Sign up" },
  { src: "screen-09", width: 375, height: 810, alt: "Order detail for buying FPJM: shares bought and pending, fees, total, and cancel or modify" },
];

/**
 * The product's screens as one row that slides left to right as the page
 * scrolls past it: the row starts pushed left, and by the time the figure
 * leaves the top of the viewport its first screen has come to rest at the
 * left edge. Travel is measured, not guessed, so the row always ends flush
 * whatever the article width.
 *
 * With reduced motion the row stays put and scrolls sideways by hand instead.
 */
export function MahaanaScreenRow() {
  const frameRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // How far the row overhangs the frame.
  const travel = useMotionValue(0);
  useEffect(() => {
    const frame = frameRef.current;
    const row = rowRef.current;
    if (!frame || !row) return;
    const measure = () => travel.set(Math.max(0, row.scrollWidth - frame.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    ro.observe(row);
    return () => ro.disconnect();
  }, [travel]);

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });
  const x = useTransform(() => -(1 - scrollYProgress.get()) * travel.get());

  return (
    // No frame: the screens carry their own rounded edges. -mx-6 cancels the
    // article's side padding so the row runs out to the vertical rules.
    <figure className="case-figure -mx-6 my-10">
      <div ref={frameRef} className={reduce ? "overflow-x-auto" : "overflow-hidden"}>
        <motion.div
          ref={rowRef}
          style={reduce ? undefined : { x }}
          className="flex w-max gap-4 will-change-transform"
        >
          {SCREENS.map((s) => (
            <img
              key={s.src}
              src={`/images/projects/mahaana-wealth/screens/${s.src}.webp`}
              alt={s.alt}
              width={s.width}
              height={s.height}
              loading="lazy"
              decoding="async"
              draggable={false}
              // `.prose img` sets w-full and my-8; each screen sizes off its height.
              className="my-0! block h-[360px] w-auto! max-w-none shrink-0 sm:h-[440px]"
            />
          ))}
        </motion.div>
      </div>
    </figure>
  );
}
