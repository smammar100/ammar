"use client";

import { useState, useEffect, useLayoutEffect, useRef, ReactNode, useMemo } from "react";
import { motion, AnimatePresence, Transition, useScroll, useSpring, useTransform } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

type HeadingData = {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
  /** Label from the nearest preceding [data-toc-group] marker, if any. */
  group?: string;
};

// --- Shared Animation Configs ---

const islandTransition: Transition = {
  type: "tween",
  ease: [0.22, 1, 0.36, 1],
  duration: 0.5,
};

// Expanded-panel chrome: the 52px header block plus the list's 16px bottom
// padding. The list itself is measured, since group labels make row counts an
// unreliable guide to its height.
const PANEL_CHROME = 52 + 16;

// --- Progress Circle Component ---
// Colours are inverted relative to the page: the island paints itself with the
// page's `--foreground`, so everything on it (including this ring) uses
// `--background`.

// Driven by motion values straight from the page scroll, so moving the ring
// never re-renders the island (it used to set React state on every scroll event).
function CircleProgress() {
  const size = 24;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const { scrollYProgress } = useScroll();
  // motion reports 1 for a page that can't scroll and doesn't clamp overscroll
  // (iOS bounce); the ring should read empty and stay within 0–1.
  const guarded = useTransform(scrollYProgress, (p) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, p)) : 0;
  });
  const smooth = useSpring(guarded, { stiffness: 300, damping: 40, restDelta: 0.001 });
  const strokeDashoffset = useTransform(smooth, (p) => circumference * (1 - p));

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
        style={{ strokeDashoffset }}
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
  const [maxHeight, setMaxHeight] = useState(440);

  // 1. DOM Scanning Strategy
  useEffect(() => {
    const getHeadings = () => {
      const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

      const validHeadings = elements
        .filter((el) => !el.hasAttribute("data-toc-ignore")) // Allow explicit skipping
        .map((el, index): HeadingData => {
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
      const byDomOrder = (a: HTMLElement, b: HTMLElement) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      validHeadings.sort((a, b) => byDomOrder(a.element, b.element));

      // Group headings under the nearest preceding [data-toc-group] marker
      // (placed from MDX with <TocGroup label="..." />).
      const markers = (Array.from(document.querySelectorAll("[data-toc-group]")) as HTMLElement[]).sort(
        byDomOrder,
      );
      if (markers.length > 0) {
        for (const heading of validHeadings) {
          let group: string | undefined;
          for (const marker of markers) {
            if (marker.compareDocumentPosition(heading.element) & Node.DOCUMENT_POSITION_FOLLOWING) {
              group = marker.dataset.tocGroup;
            } else {
              break;
            }
          }
          heading.group = group;
        }
      }

      setHeadings(validHeadings);
    };

    // Slight delay ensures CMS/Markdown hydration is complete
    const timer = setTimeout(getHeadings, 100);
    return () => clearTimeout(timer);
  }, [selector]);

  // 2. Scroll spy. Heading positions are measured once (document coordinates)
  // and again only when the page changes size, so scrolling compares numbers
  // instead of measuring every heading every frame. The scroll position comes
  // from motion's scrollY, which motion already reads for the ring in a
  // batched read-then-write frame; reading window.scrollY ourselves, after
  // motion's style write, forced a synchronous style recalc every frame.
  // State only changes when the active heading does.
  const { scrollY } = useScroll();
  useEffect(() => {
    let offsets: number[] = [];
    const measure = () => {
      offsets = headings.map((h) => h.element.getBoundingClientRect().top + window.scrollY);
    };
    const update = (y: number) => {
      // 120px offset to trigger active state just as heading reaches the top
      const line = y + 120;
      let currentActiveId: string | null = headings[0]?.id ?? null;
      for (let i = 0; i < offsets.length; i++) {
        if (offsets[i] <= line) currentActiveId = headings[i].id;
        else break;
      }
      setActiveId((prev) => (prev === currentActiveId ? prev : currentActiveId));
    };
    // Content above a heading can change height after load (fonts, a carousel,
    // an image without reserved space); the body resizing covers all of them.
    const ro = new ResizeObserver(() => {
      measure();
      update(window.scrollY);
    });

    measure();
    update(window.scrollY);
    const unsubscribe = scrollY.on("change", update);
    ro.observe(document.body);

    return () => {
      unsubscribe();
      ro.disconnect();
    };
  }, [headings, scrollY]);

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
  // The list is rendered (invisibly) while collapsed and its rows never wrap,
  // so its height can be measured before the panel opens.
  const listRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);
  useLayoutEffect(() => {
    if (listRef.current) setListHeight(listRef.current.offsetHeight);
  }, [headings]);
  const expandedHeight = Math.min(PANEL_CHROME + listHeight, maxHeight);

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

            <CircleProgress />
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
              <div ref={listRef} className="flex flex-col gap-0.5">
                {headings.map((h, i) => {
                  const isActive = activeId === h.id;
                  const startsGroup = !!h.group && h.group !== headings[i - 1]?.group;
                  const groupIsActive = !!h.group && activeHeading?.group === h.group;
                  const isHovered = hoveredId === h.id;

                  // Dynamically calculate padding based on nesting depth!
                  const indentLevel = Math.max(0, h.level - minLevel);
                  const paddingLeft = indentLevel * 14 + 12; // 12px base + 14px per depth

                  const row = (
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

                  if (!startsGroup) return row;
                  return (
                    <div key={h.id} className="flex flex-col gap-0.5">
                      <span
                        className={cn(
                          "px-3 pb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300",
                          i === 0 ? "pt-1" : "pt-3",
                          groupIsActive ? "text-background/70" : "text-background/35",
                        )}
                      >
                        {h.group}
                      </span>
                      {row}
                    </div>
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
