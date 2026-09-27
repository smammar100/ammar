"use client";

import { AnimatePresence } from "motion/react";
import type { ComponentProps } from "react";
import { Lightbox } from "./Lightbox";

// The lightbox with its exit animation, in its own chunk: LabCanvas loads it
// (and motion with it) on the first shot opened, not with the page.
export function LightboxLayer({
  open,
  onExitComplete,
  ...props
}: Omit<ComponentProps<typeof Lightbox>, "index" | "origin"> & {
  open: { index: number; origin: DOMRect | null } | null;
  onExitComplete: () => void;
}) {
  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && <Lightbox key="lightbox" index={open.index} origin={open.origin} {...props} />}
    </AnimatePresence>
  );
}
