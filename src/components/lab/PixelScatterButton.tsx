"use client";

import { useEffect, useRef } from "react";
import { Roboto_Mono } from "next/font/google";

// Variable font, so no weight list. preload: false keeps it from being
// preloaded at high priority on every page that imports this module (the home
// page's lab cards included); it loads when the button renders instead.
const robotoMono = Roboto_Mono({ subsets: ["latin"], display: "swap", preload: false });

const COLS = 32;
const ROWS = 8;
const TOTAL = COLS * ROWS;
const BTN_WIDTH = 320;
const BTN_HEIGHT = 80;

const SHOW_WINDOW_MS = 380;
const VISIBLE_MIN_MS = 60;
const VISIBLE_MAX_MS = 200;
const DIRECTION_BIAS_MS = 80;

function ArrowRightCircle() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginTop: -2 }}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 16 16 12 12 8" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

/**
 * A call-to-action after the Next.js Conf 2025 "Get Tickets" button. On hover,
 * white pixels flash on and off at independent random times across the
 * button: pure scatter, with a slight centre-first drift on enter and
 * edges-first on leave.
 */
export function PixelScatterButton() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const bg = bgRef.current;
    if (!btn || !bg) return;

    const pixels = Array.from(bg.querySelectorAll<HTMLSpanElement>("span"));
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let isActive = false;
    const centerX = (COLS - 1) / 2;

    const animatePixels = (activate: boolean) => {
      isActive = activate;
      timeouts.forEach(clearTimeout);
      timeouts = [];
      pixels.forEach((p) => {
        p.style.display = "none";
      });

      pixels.forEach((p, idx) => {
        const col = idx % COLS;
        const distFromCenter = Math.abs(col - centerX) / centerX;
        const bias = activate ? distFromCenter : 1 - distFromCenter;
        const showAt = bias * DIRECTION_BIAS_MS + Math.random() * SHOW_WINDOW_MS;
        const visibleFor = VISIBLE_MIN_MS + Math.random() * (VISIBLE_MAX_MS - VISIBLE_MIN_MS);
        timeouts.push(setTimeout(() => (p.style.display = "block"), showAt));
        timeouts.push(setTimeout(() => (p.style.display = "none"), showAt + visibleFor));
      });
    };

    const onEnter = () => {
      if (!isActive) animatePixels(true);
    };
    const onLeave = () => {
      if (isActive) animatePixels(false);
    };

    btn.addEventListener("mouseenter", onEnter);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      timeouts.forEach(clearTimeout);
      btn.removeEventListener("mouseenter", onEnter);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      className={`${robotoMono.className} inline-flex items-center justify-center bg-white`}
      style={{ padding: "80px 120px", borderRadius: 12, boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)" }}
    >
      <button
        ref={btnRef}
        type="button"
        className="relative cursor-pointer overflow-hidden"
        style={{
          width: BTN_WIDTH,
          height: BTN_HEIGHT,
          background: "#1a62ff",
          border: "none",
          outline: "none",
          padding: 0,
        }}
      >
        <div ref={bgRef} className="pointer-events-none absolute top-0 left-0 h-full w-full" style={{ zIndex: 1 }}>
          {Array.from({ length: TOTAL }).map((_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const pxW = 100 / COLS;
            const pxH = 100 / ROWS;
            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${col * pxW}%`,
                  top: `${row * pxH}%`,
                  width: `${pxW}%`,
                  height: `${pxH}%`,
                  backgroundColor: "#ffffff",
                  display: "none",
                }}
              />
            );
          })}
        </div>

        <div
          className="pointer-events-none absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center"
          style={{ zIndex: 2, color: "#ffffff" }}
        >
          <div
            className="flex items-center"
            style={{ fontSize: 20, fontWeight: 700, letterSpacing: "2px", gap: 8, marginBottom: 4 }}
          >
            GET TICKETS
            <ArrowRightCircle />
          </div>
          <div style={{ fontSize: 11, fontWeight: 400, letterSpacing: "1.5px", color: "rgba(255, 255, 255, 0.9)" }}>
            IN PERSON &amp; VIRTUAL
          </div>
        </div>
      </button>
    </div>
  );
}
