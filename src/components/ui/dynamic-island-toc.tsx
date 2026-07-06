"use client";

import { useState, useEffect, ReactNode, useMemo } from "react";
import { motion, AnimatePresence, Transition } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

type HeadingData = {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
};

// --- Shared Animation Configs ---

const islandTransition: Transition = {
  type: "tween",
  ease: [0.22, 1, 0.36, 1],
  duration: 0.5,
};

// Expanded-panel size math (measured against the real render):
// header block 52px + list bottom padding 16px = 68px chrome, minus the 2px
// trailing gap the formula double-counts → 66px base, then 38px per heading
// (36px row + 2px gap).
const PANEL_BASE = 66;
const PANEL_PER_ITEM = 38;

// --- Progress Circle Component ---
// Colours are inverted relative to the page: the island paints itself with the
// page's `--foreground`, so everything on it (including this ring) uses
// `--background`.

function CircleProgress({ percentage }: { percentage: number }) {
  const size = 24;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--background)"
        strokeOpacity={0.25}
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--background)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        strokeLinecap="round"
      />
    </svg>
  );
}

// --- Main Component ---

type DynamicIslandTOCProps = {
  children?: ReactNode;
  /**
   * CSS selector to find headings.
   * Defaults to common blog content wrappers and explicit [data-toc] elements.
   */
  selector?: string;
};

export function DynamicIslandTOC({
  children,
  selector = "article h1, article h2, article h3, article h4, .prose h1, .prose h2, .prose h3, .prose h4, [data-toc]",
}: DynamicIslandTOCProps) {
  const [headings, setHeadings] = useState<HeadingData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [maxHeight, setMaxHeight] = useState(440);

  // 1. DOM Scanning Strategy
  useEffect(() => {
    const getHeadings = () => {
      const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

      const validHeadings = elements
        .filter((el) => !el.hasAttribute("data-toc-ignore")) // Allow explicit skipping
        .map((el, index) => {
          // Auto-generate ID if missing (common in generic Markdown/CMS output)
          if (!el.id) {
            const generatedId =
              el.textContent
                ?.toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "") || `toc-heading-${index}`;
            el.id = generatedId;
          }

          // 1. Check data-toc-depth attribute
          // 2. Fallback to standard HTML tag levels (H1 = 1, H2 = 2)
          // 3. Default to level 2 if not a heading tag
          const depthAttr = el.getAttribute("data-toc-depth");
          let level = 2;

          if (depthAttr) {
            level = parseInt(depthAttr, 10);
          } else {
            const tagName = el.tagName.toUpperCase();
            if (tagName.startsWith("H") && tagName.length === 2) {
              level = parseInt(tagName[1], 10);
            }
          }

          // Allow title overrides via data-toc-title
          const text = el.getAttribute("data-toc-title") || el.textContent || "Section";

          return { id: el.id, text, level, element: el };
        });

      // Sort by DOM order mathematically
      validHeadings.sort((a, b) =>
        a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );

      setHeadings(validHeadings);
    };

    // Slight delay ensures CMS/Markdown hydration is complete
    const timer = setTimeout(getHeadings, 100);
    return () => clearTimeout(timer);
  }, [selector]);

  // 2. Scroll Spy & Progress
  useEffect(() => {
    const handleScroll = () => {
      let currentActiveId: string | null = null;
      for (const heading of headings) {
        const top = heading.element.getBoundingClientRect().top;
        // 120px offset to trigger active state just as heading reaches the top
        if (top <= 120) {
          currentActiveId = heading.id;
        } else {
          break;
        }
      }

      if (!currentActiveId && headings.length > 0) {
        currentActiveId = headings[0].id;
      }

      setActiveId(currentActiveId);

      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  // 3. Keep the expanded panel within the viewport (leaves room for the
  //    bottom offset + breathing space at the top).
  useEffect(() => {
    const update = () => setMaxHeight(Math.max(200, window.innerHeight - 120));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const activeHeading = headings.find((h) => h.id === activeId);

  // Normalize depths so the highest-level heading in the doc touches the left edge
  const minLevel = useMemo(() => {
    if (headings.length === 0) return 1;
    return Math.min(...headings.map((h) => h.level));
  }, [headings]);

  // Height fits the content; longer TOCs cap at maxHeight and scroll internally.
  const expandedHeight = Math.min(PANEL_BASE + headings.length * PANEL_PER_ITEM, maxHeight);

  // Don't render the island on pages with no headings (e.g. very short posts).
  if (headings.length === 0) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      {/* Backdrop Blur Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={islandTransition}
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[4px]"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Island Wrapper */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-[30px] left-1/2 z-[9999] flex -translate-x-1/2 flex-col items-center"
      >
        <motion.div
          onClick={() => {
            if (!isExpanded) setIsExpanded(true);
          }}
          initial={false}
          animate={{
            width: isExpanded ? 340 : 280,
            height: isExpanded ? expandedHeight : 52,
            borderRadius: isExpanded ? 24 : 26,
          }}
          transition={islandTransition}
          style={{ cursor: isExpanded ? "default" : "pointer" }}
          // Inverted palette: the island paints itself with the page foreground
          // and everything on it uses the page background — dark island in light
          // mode, light island in dark mode.
          className="relative overflow-hidden border border-background/15 bg-foreground text-background shadow-2xl"
        >
          {/* CLOSED PILL CONTENT */}
          <motion.div
            initial={false}
            animate={{
              opacity: isExpanded ? 0 : 1,
              scale: isExpanded ? 0.95 : 1,
              filter: isExpanded ? "blur(4px)" : "blur(0px)",
            }}
            transition={{ ...islandTransition, delay: isExpanded ? 0 : 0.1 }}
            className={cn("absolute inset-0 flex items-center gap-4 px-4 sm:px-5", isExpanded && "pointer-events-none")}
          >
            <div className="h-2 w-2 shrink-0 rounded-full bg-background" />

            <div className="relative flex h-full flex-1 items-center overflow-hidden text-left">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={activeId || "empty"}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-background"
                >
                  {activeHeading?.text || "Contents"}
                </motion.span>
              </AnimatePresence>
            </div>

            <CircleProgress percentage={progress} />
          </motion.div>

          {/* EXPANDED MENU CONTENT */}
          <motion.div
            initial={false}
            animate={{
              opacity: isExpanded ? 1 : 0,
              scale: isExpanded ? 1 : 1.05,
            }}
            transition={{ ...islandTransition, delay: isExpanded ? 0.1 : 0 }}
            className={cn("absolute inset-0 flex flex-col", !isExpanded && "pointer-events-none")}
          >
            <div className="flex shrink-0 items-center justify-between px-6 pb-3 pt-5">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-background/55">
                Table of Contents
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                aria-label="Close table of contents"
                className="text-background/55 transition-colors hover:text-background"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-3 pb-4" data-lenis-prevent="true">
              <div className="flex flex-col gap-0.5">
                {headings.map((h) => {
                  const isActive = activeId === h.id;
                  const isHovered = hoveredId === h.id;

                  // Dynamically calculate padding based on nesting depth!
                  const indentLevel = Math.max(0, h.level - minLevel);
                  const paddingLeft = indentLevel * 14 + 12; // 12px base + 14px per depth

                  return (
                    <button
                      key={h.id}
                      onMouseEnter={() => setHoveredId(h.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Adjust scroll to give fixed headers breathing room
                        const yOffset = -80;
                        const y = h.element.getBoundingClientRect().top + window.scrollY + yOffset;
                        window.scrollTo({ top: y, behavior: "smooth" });
                        setIsExpanded(false);
                      }}
                      style={{ paddingLeft: `${paddingLeft}px` }}
                      className={cn(
                        "group flex w-full shrink-0 cursor-pointer items-center rounded-lg border-none py-2 pr-3 text-left text-sm transition-all duration-300 ease-out",
                        isActive && "bg-background/15 font-medium text-background",
                        !isActive && isHovered && "bg-background/10 text-background/85",
                        !isActive && !isHovered && "bg-transparent text-background/45",
                      )}
                    >
                      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap transition-transform duration-300 group-hover:translate-x-1">
                        {h.text}
                      </span>

                      <motion.div
                        initial={false}
                        animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="ml-3 h-1.5 w-1.5 shrink-0 rounded-full bg-background"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
