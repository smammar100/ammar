"use client";

import { useEffect, useRef } from "react";
import { pixelWave, enablePixelHover } from "@/scripts/pixel-wave";

interface PixelWaveTextProps {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  class?: string;
  className?: string;
  wave?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

// Renders text as per-character layers (spacer + pixel + sans) so the
// pixel-wave script can cross-dissolve between Geist Pixel Square and Geist
// Sans. Mirrors the original PixelWaveText.astro DOM structure exactly.
export default function PixelWaveText({
  text,
  as: Tag = "span",
  class: classProp,
  className,
  wave,
  style,
  ariaLabel,
}: PixelWaveTextProps) {
  const ref = useRef<HTMLElement>(null);
  const cls = className ?? classProp;
  const words = text.split(" ");
  const Component = Tag as React.ElementType;

  // Wave behaviour, ported from the Astro page <script> blocks:
  //  - "demo": entrance flip, then hover interaction (lab/pixel-wave page).
  //  - "preview-pixel-wave": rendered resolved (sans visible); the lab-previews
  //    script binds the parent <a> pointerenter. We replicate that here so the
  //    component is self-contained.
  //  - any other value: entrance flip on mount.
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resolveWave(container);
      return;
    }

    if (wave === "preview-pixel-wave") {
      resolveWave(container);
      const anchor = container.closest("a");
      const onEnter = () => {
        if (container.dataset.animating === "true") return;
        container.dataset.animating = "true";
        resetWave(container);
        pixelWave(container, 0);
        const charCount = container.querySelectorAll("[data-pw-char]").length;
        const duration = charCount * 80 + 700;
        window.setTimeout(() => {
          container.dataset.animating = "false";
        }, duration);
      };
      anchor?.addEventListener("pointerenter", onEnter);
      return () => anchor?.removeEventListener("pointerenter", onEnter);
    }

    // Default / "demo": entrance flip then enable hover interaction.
    const delay = wave === "demo" ? 250 : 0;
    resetWave(container);
    pixelWave(container, delay);
    const timer = window.setTimeout(() => {
      enablePixelHover(container);
    }, delay + 5000);
    return () => window.clearTimeout(timer);
  }, [wave, text]);

  return (
    <Component
      ref={ref}
      className={cls}
      aria-label={ariaLabel ?? text}
      data-pixel-wave={wave}
      style={style}
    >
      {words.map((word, wi) => (
        <span
          key={wi}
          aria-hidden="true"
          className="inline-block whitespace-nowrap"
          style={wi < words.length - 1 ? { marginRight: "0.25em" } : undefined}
        >
          {word.split("").map((char, ci) => (
            <span key={ci} className="relative inline-block" data-pw-char>
              <span className="invisible">{char}</span>
              <span className="absolute inset-0 font-pixel" data-pw-pixel>
                {char}
              </span>
              <span className="absolute inset-0" data-pw-sans style={{ opacity: 0 }}>
                {char}
              </span>
            </span>
          ))}
        </span>
      ))}
    </Component>
  );
}

// Reset to all-pixel (entrance start state).
function resetWave(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>("[data-pw-char]").forEach((wrapper) => {
    const pixel = wrapper.querySelector<HTMLElement>("[data-pw-pixel]");
    const sans = wrapper.querySelector<HTMLElement>("[data-pw-sans]");
    if (!pixel || !sans) return;
    sans.style.opacity = "0";
    pixel.style.opacity = "1";
    pixel.textContent = sans.textContent;
  });
}

// Resolve to all-sans (settled state) without animating.
function resolveWave(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>("[data-pw-pixel]").forEach((el) => {
    el.style.opacity = "0";
  });
  container.querySelectorAll<HTMLElement>("[data-pw-sans]").forEach((el) => {
    el.style.opacity = "1";
  });
}
