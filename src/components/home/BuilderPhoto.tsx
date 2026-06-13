"use client";

import { useState, useRef } from "react";

/** Desktop polaroid that runs a "builder mode" pixelation effect on click. */
export function BuilderPhoto() {
  const [pressed, setPressed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = () => {
    if (pressed) return;
    setPressed(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPressed(false), 3000);
  };

  return (
    <div className="relative shrink-0 rotate-2 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02]">
      <button
        type="button"
        onClick={run}
        aria-pressed={pressed}
        data-builder-photo
        aria-label="Run builder mode portrait animation"
        className="group/builder block cursor-cell bg-white p-2 pb-8 text-left shadow-2xl shadow-black/20 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background dark:bg-[#20201e] dark:shadow-black/50 lg:p-3 lg:pb-10"
      >
        <div className="relative h-52 w-52 overflow-hidden lg:h-64 lg:w-64 xl:h-72 xl:w-72">
          {/* TODO: swap placeholder image for a real photo of Ammar (path kept on purpose). */}
          <img
            src="/images/brand/profile-living-room.jpg"
            alt="Syed Mohammad Ammar"
            className="block h-full w-full scale-[1.55] object-cover object-[43%_54%] transition duration-500 group-aria-pressed/builder:scale-[1.62] group-aria-pressed/builder:grayscale group-aria-pressed/builder:contrast-125 group-aria-pressed/builder:brightness-75 group-aria-pressed/builder:saturate-0 group-aria-pressed/builder:[image-rendering:pixelated]"
          />
          <div className="builder-grid pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-500 group-aria-pressed/builder:opacity-80" aria-hidden="true" />
          <div className="builder-scanlines pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-aria-pressed/builder:opacity-100" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-cyan-900/0 transition-colors duration-500 group-aria-pressed/builder:bg-cyan-900/25" aria-hidden="true" />
          <div className="builder-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 opacity-0 transition-opacity duration-500 group-aria-pressed/builder:opacity-100" aria-hidden="true" />
          <div className="builder-readout pointer-events-none absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-widest text-white/0 transition-colors duration-500 group-aria-pressed/builder:text-white/75" aria-hidden="true">
            Building...
          </div>
        </div>
      </button>
    </div>
  );
}
