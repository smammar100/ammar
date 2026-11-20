"use client";

import { useEffect, useRef } from "react";

/**
 * The "W × H" readout on the hero's selection box. It measures what is
 * actually drawn: from the box's top-left ([data-selection]) to wherever its
 * bottom-right corner currently is ([data-selection-corner], which slides out
 * during the intro). So it counts up while the box is dragged out, and stays
 * right as the headline resizes afterwards. `fallback` is what the server
 * sends, shown until the first measurement.
 *
 * The number is written straight to the data attribute, not through React
 * state: during the drag it changes every frame, and a render per frame would
 * drop some. CSS draws the attribute, like the rest of the hero's labels, so
 * the text stays out of the headline.
 */
export function SelectionSize({ fallback }: { fallback: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const label = ref.current;
    const box = label?.closest<HTMLElement>("[data-selection]");
    const corner = label?.closest<HTMLElement>("[data-selection-corner]");
    if (!label || !box || !corner) return;

    const read = () => {
      const from = box.getBoundingClientRect();
      const to = corner.getBoundingClientRect();
      const size = `${Math.round(to.right - from.left)} × ${Math.round(to.bottom - from.top)}`;
      if (label.dataset.label !== size) label.dataset.label = size;
    };

    read();
    const observer = new ResizeObserver(read);
    observer.observe(box);

    // Follow the corner for as long as its intro animation runs (none when
    // the intro is skipped, and no need when the note itself isn't shown).
    let frame = 0;
    const drag = corner.getAnimations().find((a) => a.playState !== "finished");
    if (drag && label.offsetParent) {
      const follow = () => {
        read();
        if (drag.playState === "running" || drag.pending) frame = requestAnimationFrame(follow);
      };
      frame = requestAnimationFrame(follow);
      // And land on the exact final size, whichever frame the drag ends in.
      drag.finished.then(read, () => {});
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return <span ref={ref} data-label={fallback} className="tabular-nums after:content-[attr(data-label)]" />;
}
