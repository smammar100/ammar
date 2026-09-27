"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import Link from "next/link";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { Blocks, Move, Rows3 } from "lucide-react";
import { BuildTile } from "./BuildTile";
import { Lightbox } from "./Lightbox";
import { SEAM_X, SEAM_Y, TILE_H, TILE_W, itemHeight, type CanvasItem, type CanvasShot } from "./items";

// The Lab as an endless table of work. A camera offset moves under drag (with
// momentum on release), the wheel or trackpad, and the arrow keys.
//
// "Endless" without redrawing the whole world: the layout tile is repeated
// only as many times as the screen needs (cols × rows, usually 1–2 each way),
// and every item in it wraps on its own. Its screen position is its place in
// that block plus the camera, taken modulo the block size, with the wrap point
// pushed SEAM_X/Y past the edge so an item always wraps while fully off
// screen. Only the first copy of the tile is focusable and announced; the
// others are the same work again, so they're hidden from assistive tech.
//
// Positions are written straight to each item's transform in a rAF loop; React
// only renders when the set of items, the view or the lightbox changes.
//
// On arrival the table deals itself out: the camera opens on the Lab note, and
// every other piece fans out from behind it to its place, nearest first, each
// starting small and a little turned. Any drag, scroll or key skips to the end.
//
// Two variants:
// - "page" (/lab): fills the screen under the header, the wheel pans, and a
//   toggle switches between the free wall and a plain grid.
// - "embedded" (home): a fixed-height window inside a section. Vertical wheel
//   and touch scrolling go to the page, only sideways gestures pan; it mounts
//   as it nears the screen and deals itself out when it scrolls into view.

const mod = (n: number, m: number) => ((n % m) + m) % m;

interface Grid {
  cols: number;
  rows: number;
}
interface Placed {
  item: CanvasItem;
  key: string;
  c: number;
  r: number;
  primary: boolean;
}
type View = "wall" | "grid";
const VIEW_KEY = "lab-view";

// What the server renders: a desktop-sized block with the camera on the note,
// for a typical screen (the Lab page) or the home page's window. Everything
// but the note stays hidden until the layout effect has fitted it to the real
// screen and started the intro (or shown it outright, for reduced motion).
const SSR_GRID: Grid = { cols: 1, rows: 2 };
const SSR_VIEW = { page: { w: 1440, h: 772 }, embedded: { w: 896, h: 660 } };

function ssrCamera(items: CanvasItem[], embedded: boolean) {
  const s = embedded ? 0.68 : 0.85;
  const view = SSR_VIEW[embedded ? "embedded" : "page"];
  const note = items.find((i) => i.kind === "note");
  if (!note) return { x: 0, y: 0, scale: s };
  return {
    x: view.w / 2 - (note.x + note.w / 2) * s,
    y: view.h / 2 - (note.y + itemHeight(note) / 2) * s,
    scale: s,
  };
}

// The deal: each piece takes INTRO_MS to fly out, starting up to INTRO_SPREAD
// ms late the further it lands from the middle of the screen.
const INTRO_MS = 1000;
const INTRO_SPREAD = 420;
const INTRO_PAUSE = 150;

/** Screen scale: smaller on narrow screens, and in the home page's window. */
const baseScale = (vw: number, embedded: boolean) =>
  embedded ? (vw < 640 ? 0.5 : vw < 1024 ? 0.6 : 0.68) : vw < 640 ? 0.55 : vw < 1024 ? 0.7 : 0.85;

function place(p: Placed, cam: { x: number; y: number }, s: number, grid: Grid) {
  return {
    // Each row of repeats sits half a tile further along (see items.ts).
    x: mod((p.item.x + p.c * TILE_W + (p.r * TILE_W) / 2) * s + cam.x + SEAM_X * s, TILE_W * grid.cols * s) - SEAM_X * s,
    y: mod((p.item.y + p.r * TILE_H) * s + cam.y + SEAM_Y * s, TILE_H * grid.rows * s) - SEAM_Y * s,
  };
}

function position(p: Placed, cam: { x: number; y: number }, s: number, grid: Grid) {
  const { x, y } = place(p, cam, s, grid);
  return `translate3d(${x}px, ${y}px, 0) scale(${s})`;
}

/** A steady per-piece tilt for the deal, between -8° and 8°. */
function tilt(key: string) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return (Math.abs(h) % 17) - 8;
}

/**
 * What the note card says. The Lab page uses the default Index card; the home
 * page's wall turns the note into its section heading with a way into the Lab.
 */
export interface NoteContent {
  /** Small overline above the title. */
  label?: string;
  title: string;
  body?: string;
  cta?: { label: string; href: string };
  /** Id for the title on the first copy, so a section can be labelled by it. */
  headingId?: string;
}

export function LabCanvas({
  items,
  variant = "page",
  note,
  className,
}: {
  items: CanvasItem[];
  variant?: "page" | "embedded";
  note?: NoteContent;
  /** Sizing for the embedded window. */
  className?: string;
}) {
  const embedded = variant === "embedded";
  const viewportRef = useRef<HTMLDivElement>(null);
  const scaleVar = useRef(0);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const ssr = useMemo(() => ssrCamera(items, embedded), [items, embedded]);
  const cam = useRef({ x: ssr.x, y: ssr.y, vx: 0, vy: 0, scale: ssr.scale });
  const [grid, setGrid] = useState<Grid>(SSR_GRID);
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const centred = useRef(false);
  const layerRef = useRef<HTMLDivElement>(null);
  const intro = useRef<{ start: number } | null>(null);
  const introStarted = useRef(false);

  // The embedded wall mounts its pieces only as it nears the screen.
  const [live, setLive] = useState(!embedded);

  const [view, setView] = useState<View>("wall");
  const viewRef = useRef(view);
  viewRef.current = view;

  const placed = useMemo(() => {
    const out: Placed[] = [];
    if (view !== "wall") return out;
    // Before the embedded wall mounts, only its note is there: it's the
    // section's heading and link, so it must be in the server HTML.
    if (!live) {
      const note = items.find((i) => i.kind === "note");
      if (note) out.push({ item: note, key: `${note.id}:0:0`, c: 0, r: 0, primary: true });
      return out;
    }
    for (let r = 0; r < grid.rows; r++)
      for (let c = 0; c < grid.cols; c++)
        for (const item of items) out.push({ item, key: `${item.id}:${c}:${r}`, c, r, primary: c === 0 && r === 0 });
    return out;
  }, [items, grid, live, view]);
  const placedRef = useRef(placed);
  placedRef.current = placed;
  const drag = useRef({ down: false, active: false, id: -1, sx: 0, sy: 0, lx: 0, ly: 0, lt: 0, swallowUntil: 0 });
  // Camera motion (glides and tweens) and the intro run on separate frames, so
  // stopping one never freezes the other halfway.
  const raf = useRef(0);
  const introRaf = useRef(0);
  // Where the page was when Tab was last pressed (see onFocus).
  const tabScroll = useRef<{ x: number; y: number; t: number } | null>(null);
  const reduce = useReducedMotion();

  const shots = items.filter((i): i is CanvasShot => i.kind === "shot");
  const [lightbox, setLightbox] = useState<{ index: number; origin: DOMRect | null } | null>(null);
  const lightboxOpen = useRef(false);
  lightboxOpen.current = lightbox !== null;
  const returnFocus = useRef<HTMLElement | null>(null);

  // A viewer's last view, per browser. Only the Lab page has the toggle.
  useEffect(() => {
    if (embedded) return;
    try {
      if (window.localStorage.getItem(VIEW_KEY) === "grid") setView("grid");
    } catch {
      /* storage unavailable: stay on the wall */
    }
  }, [embedded]);
  const chooseView = (next: View) => {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* not remembered, that's fine */
    }
  };

  /**
   * Writes every piece's transform. During the intro, each piece is somewhere
   * between the middle of the screen and its place; returns whether any piece
   * is still on its way.
   */
  const apply = useCallback(() => {
    const c = cam.current;
    const s = c.scale;
    const deal = intro.current;
    const vp = viewportRef.current;
    // Lets things on the wall cancel its zoom (the note's link stays 14px).
    if (vp && scaleVar.current !== s) {
      vp.style.setProperty("--wall-scale", String(s));
      scaleVar.current = s;
    }
    const cx = (vp?.clientWidth ?? 0) / 2;
    const cy = (vp?.clientHeight ?? 0) / 2;
    const reach = Math.hypot(cx, cy) * 2 || 1;
    const now = performance.now();
    let running = false;

    for (const p of placedRef.current) {
      const el = itemRefs.current.get(p.key);
      if (!el) continue;
      if (!deal || p.item.kind === "note") {
        el.style.transform = position(p, c, s, gridRef.current);
        el.style.opacity = "";
        continue;
      }
      const { x, y } = place(p, c, s, gridRef.current);
      const w = p.item.w * s;
      const h = itemHeight(p.item) * s;
      // The piece's centre travels from the middle of the screen to its own.
      const dx = x + w / 2 - cx;
      const dy = y + h / 2 - cy;
      const delay = (Math.hypot(dx, dy) / reach) * INTRO_SPREAD;
      const t = Math.min(1, Math.max(0, (now - deal.start - delay) / INTRO_MS));
      if (t < 1) running = true;
      const e = 1 - Math.pow(1 - t, 4);
      const k = 0.55 + 0.45 * e;
      const px = cx + dx * e - (p.item.w * s * k) / 2;
      const py = cy + dy * e - (itemHeight(p.item) * s * k) / 2;
      el.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(${(1 - e) * tilt(p.key)}deg) scale(${s * k})`;
      el.style.opacity = String(Math.min(1, t * 3.5));
    }
    return running;
  }, []);

  const showLayer = () => {
    if (layerRef.current) layerRef.current.style.visibility = "visible";
  };

  /** Skip whatever is left of the intro and put everything in its place. */
  const endIntro = useCallback(() => {
    if (!intro.current) return;
    cancelAnimationFrame(introRaf.current);
    intro.current = null;
    apply();
  }, [apply]);

  /** Deal the table out (once), or just show it for reduced motion. */
  const startIntro = useCallback(() => {
    if (introStarted.current) return;
    introStarted.current = true;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      intro.current = { start: performance.now() + INTRO_PAUSE };
      const tick = () => {
        if (!intro.current) return;
        if (apply()) introRaf.current = requestAnimationFrame(tick);
        else endIntro();
      };
      introRaf.current = requestAnimationFrame(tick);
    }
    apply();
    showLayer();
  }, [apply, endIntro]);

  // Fit to the screen: pick the scale, repeat the tile enough times that the
  // block (less its seams) covers the screen, and on first fit, centre the
  // Lab note.
  useLayoutEffect(() => {
    const fit = () => {
      const vp = viewportRef.current;
      if (!vp) return;
      const vw = vp.clientWidth;
      const vh = vp.clientHeight;
      const s = baseScale(vw, embedded);
      cam.current.scale = s;
      const next = {
        cols: Math.max(1, Math.ceil((vw / s + SEAM_X) / TILE_W)),
        rows: Math.max(1, Math.ceil((vh / s + SEAM_Y) / TILE_H)),
      };
      if (!centred.current) {
        centred.current = true;
        const note = items.find((i) => i.kind === "note");
        if (note) {
          cam.current.x = vw / 2 - (note.x + note.w / 2) * s;
          cam.current.y = vh / 2 - (note.y + itemHeight(note) / 2) * s;
        }
        // The Lab page deals out straight away; the embedded wall waits until
        // it's seen (below).
        if (!embedded) startIntro();
      }
      if (next.cols !== gridRef.current.cols || next.rows !== gridRef.current.rows) setGrid(next);
      apply();
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [apply, embedded, items, startIntro]);

  // Embedded: mount the pieces as the wall approaches, deal them out once
  // most of it is on screen.
  useEffect(() => {
    if (!embedded) return;
    const vp = viewportRef.current;
    if (!vp) return;
    // Entries can arrive batched (out, then in), so check all of them.
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setLive(true);
        near.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    // Deal once a third of the wall is showing, or it fills half a screen
    // that's too short to ever show a third of it.
    const seen = new IntersectionObserver(
      (entries) => {
        const shown = entries.some(
          (e) =>
            e.isIntersecting &&
            (e.intersectionRatio >= 0.35 || e.intersectionRect.height >= (e.rootBounds?.height ?? Infinity) * 0.5),
        );
        if (!shown) return;
        startIntro();
        seen.disconnect();
      },
      { threshold: [0, 0.1, 0.2, 0.35] },
    );
    near.observe(vp);
    seen.observe(vp);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, [embedded, startIntro]);

  // New pieces (a new grid, the wall mounting, or coming back from the grid
  // view): place them before paint, and show them if the deal has begun.
  useLayoutEffect(() => {
    apply();
    if (introStarted.current) showLayer();
  }, [placed, apply]);

  /** Momentum after a flick: velocity decays each frame until it's negligible. */
  const glide = useCallback(() => {
    cancelAnimationFrame(raf.current);
    endIntro();
    const tick = () => {
      const c = cam.current;
      c.x += c.vx;
      c.y += c.vy;
      c.vx *= 0.93;
      c.vy *= 0.93;
      apply();
      if (Math.abs(c.vx) > 0.1 || Math.abs(c.vy) > 0.1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [apply, endIntro]);

  /** Eased camera move, for keys and focus. */
  const tweenBy = useCallback(
    (dx: number, dy: number) => {
      cancelAnimationFrame(raf.current);
      endIntro();
      const c = cam.current;
      if (reduce) {
        c.x += dx;
        c.y += dy;
        apply();
        return;
      }
      const x0 = c.x;
      const y0 = c.y;
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / 520);
        const e = 1 - Math.pow(1 - p, 3);
        c.x = x0 + dx * e;
        c.y = y0 + dy * e;
        apply();
        if (p < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    },
    [apply, endIntro, reduce],
  );

  // Wheel and trackpad. Registered by hand: React's wheel listener is passive,
  // so it can't stop the page from scrolling instead. Embedded, only sideways
  // gestures pan; up and down belong to the page.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      if (lightboxOpen.current || e.ctrlKey || viewRef.current !== "wall") return; // ctrl+wheel is pinch-zoom
      const k = e.deltaMode === 1 ? 16 : 1;
      // Shift+wheel on a plain mouse means sideways.
      const sideways = e.shiftKey && !e.deltaX;
      let dx = (sideways ? e.deltaY : e.deltaX) * k;
      let dy = (sideways ? 0 : e.deltaY) * k;
      if (embedded) {
        if (Math.abs(dx) <= Math.abs(dy)) return;
        dy = 0;
      }
      e.preventDefault();
      cancelAnimationFrame(raf.current);
      endIntro();
      cam.current.x -= dx;
      cam.current.y -= dy;
      apply();
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [apply, embedded, endIntro]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      cancelAnimationFrame(introRaf.current);
    },
    [],
  );

  // Tab can move focus to a piece that's clipped out of the wall. The wall
  // clips rather than scrolls, so the browser scrolls the whole page to reveal
  // it instead. Note where the page was when Tab went down, so onFocus can put
  // it back before gliding the piece into view.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Tab") tabScroll.current = { x: window.scrollX, y: window.scrollY, t: performance.now() };
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, []);

  // Drag. The pointer is only captured once it has moved a few px, so a plain
  // click still lands on the tile under it. After a real drag, the click the
  // browser fires on release is swallowed so it doesn't open anything.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (lightboxOpen.current || e.button !== 0 || viewRef.current !== "wall") return;
    // Stop a glide, but let the deal play on: a plain click on a piece that's
    // still landing shouldn't snap everything (and move it from under you).
    cancelAnimationFrame(raf.current);
    const d = drag.current;
    Object.assign(d, {
      down: true,
      active: false,
      id: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      lx: e.clientX,
      ly: e.clientY,
      lt: e.timeStamp,
    });
    cam.current.vx = 0;
    cam.current.vy = 0;
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down || e.pointerId !== d.id) return;
    if (!d.active) {
      const mx = e.clientX - d.sx;
      const my = e.clientY - d.sy;
      if (Math.hypot(mx, my) < 6) return;
      // On the home page an up-and-down swipe is the page's scroll, not ours.
      if (embedded && e.pointerType !== "mouse" && Math.abs(my) > Math.abs(mx)) {
        d.down = false;
        return;
      }
      d.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      endIntro();
    }
    const dx = e.clientX - d.lx;
    const dy = e.clientY - d.ly;
    const dt = Math.max(1, e.timeStamp - d.lt);
    const c = cam.current;
    c.x += dx;
    c.y += dy;
    c.vx = (dx / dt) * 16;
    c.vy = (dy / dt) * 16;
    d.lx = e.clientX;
    d.ly = e.clientY;
    d.lt = e.timeStamp;
    apply();
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    if (!d.active) return;
    d.active = false;
    // A mouse drag ends in a click on whatever is under it; swallow that one.
    // Only that one: touch drags end in no click, so a lasting flag would eat
    // the next real tap or keypress.
    d.swallowUntil = e.timeStamp + 350;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    // Only glide if the pointer was still moving when it let go.
    if (!reduce && e.timeStamp - d.lt < 80) glide();
  };
  // The browser took the pointer (a scroll or a gesture): drop the drag where
  // it is, without the release's glide.
  const onPointerCancel = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    d.down = false;
    d.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (lightboxOpen.current || viewRef.current !== "wall") return;
    const step = 280;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [step, 0],
      ArrowRight: [-step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    tweenBy(move[0], move[1]);
  };

  // Tabbing to an item glides it to the middle of the screen if it's off it.
  const onFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    const vp = viewportRef.current;
    if (!vp || e.target === vp || lightboxOpen.current || viewRef.current !== "wall") return;
    if (!layerRef.current?.contains(e.target)) return;
    if (!e.target.matches(":focus-visible")) return;
    endIntro();
    const saved = tabScroll.current;
    tabScroll.current = null;
    if (saved && performance.now() - saved.t < 1000 && (window.scrollX !== saved.x || window.scrollY !== saved.y)) {
      window.scrollTo({ left: saved.x, top: saved.y, behavior: "instant" });
    }
    const r = e.target.getBoundingClientRect();
    const v = vp.getBoundingClientRect();
    const pad = 48;
    const inside = r.left >= v.left + pad && r.right <= v.right - pad && r.top >= v.top + pad && r.bottom <= v.bottom - pad;
    if (inside) return;
    tweenBy(v.left + v.width / 2 - (r.left + r.width / 2), v.top + v.height / 2 - (r.top + r.height / 2));
  };

  const openShot = (item: CanvasShot, el: HTMLElement) => {
    // Hold the table still, so the shot closes back into the spot it opened from.
    cancelAnimationFrame(raf.current);
    endIntro();
    returnFocus.current = el;
    setLightbox({ index: shots.indexOf(item), origin: el.querySelector("img")?.getBoundingClientRect() ?? null });
  };

  // Grid order: the note first, then the pieces as they read on the wall.
  const gridItems = useMemo(
    () => [...items].sort((a, b) => (a.kind === "note" ? -1 : b.kind === "note" ? 1 : a.y - b.y || a.x - b.x)),
    [items],
  );

  const isWall = view === "wall";

  return (
    <>
      <div
        ref={viewportRef}
        style={{ "--wall-scale": ssr.scale } as React.CSSProperties}
        role="region"
        aria-label={
          isWall
            ? embedded
              ? "Lab wall. Drag or use the arrow keys to move around."
              : "Lab canvas. Drag, scroll or use the arrow keys to move around."
            : "Lab grid"
        }
        tabIndex={isWall ? 0 : undefined}
        // Behind the open lightbox, the table is out of reach.
        inert={lightbox !== null}
        className={
          embedded
            ? `relative w-full cursor-grab touch-pan-y overflow-clip outline-none select-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${className ?? "h-[560px]"}`
            : // The wall fills the screen; the grid flows in the page, so the
              // page's own scrollbar is the only one.
              `relative w-full overflow-clip outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
                isWall
                  ? "h-[calc(100svh-3.5rem)] cursor-grab touch-none select-none active:cursor-grabbing md:h-[calc(100svh-4rem)]"
                  : "min-h-[calc(100svh-3.5rem)] md:min-h-[calc(100svh-4rem)]"
              }`
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClickCapture={(e) => {
          const d = drag.current;
          const dragged = e.detail > 0 && e.timeStamp <= d.swallowUntil;
          d.swallowUntil = 0;
          if (!dragged) return;
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragStart={(e) => {
          if (isWall) e.preventDefault();
        }}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      >
        {isWall ? (
          <>
            <div ref={layerRef} className="lab-canvas-layer absolute inset-0" style={{ visibility: "hidden" }}>
              {placed.map((p) => (
                <div
                  key={p.key}
                  ref={(el) => {
                    if (el) itemRefs.current.set(p.key, el);
                    else itemRefs.current.delete(p.key);
                  }}
                  aria-hidden={p.primary ? undefined : true}
                  className="absolute top-0 left-0 origin-top-left will-change-transform"
                  // The server renders the desktop layout, so the first paint is
                  // already arranged; the layout effect corrects it for the screen.
                  style={{
                    width: p.item.w,
                    transform: position(p, ssr, ssr.scale, SSR_GRID),
                    // The note is the deck the rest is dealt from: it sits on
                    // top, and it's showing from the start (the layer isn't).
                    zIndex: p.item.kind === "note" ? 10 : undefined,
                    visibility: p.item.kind === "note" ? "visible" : undefined,
                  }}
                >
                  <Piece item={p.item} focusable={p.primary} note={note} onOpenShot={openShot} />
                </div>
              ))}
            </div>
            {/* Without scripts nothing moves, so just show the table as rendered. */}
            <noscript>
              <style>{".lab-canvas-layer{visibility:visible!important}"}</style>
            </noscript>
          </>
        ) : (
          <div>
            <div className="mx-auto max-w-[1400px] columns-1 gap-8 px-6 pt-10 pb-10 sm:columns-2 lg:columns-3 xl:columns-4">
              {gridItems.map((item, i) => (
                <div
                  key={item.id}
                  className="lab-grid-in mb-10 break-inside-avoid"
                  style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}
                >
                  <Piece item={item} focusable note={note} onOpenShot={openShot} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* One pill along the bottom edge: on the Lab page, the layout switch
            sits inside its left end; then the hint for the current view. */}
        <div
          className={`pointer-events-none inset-x-0 bottom-6 flex justify-center px-4 ${
            // In the grid it rides the page scroll, pinned to the bottom of the screen.
            isWall ? "absolute" : "sticky pb-6"
          }`}
        >
          <div
            className={`flex items-center gap-2.5 rounded-full border border-border bg-background/90 py-1 pr-4 shadow-sm backdrop-blur ${
              embedded ? "pl-4" : "pointer-events-auto pl-1"
            }`}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {!embedded && (
              <div role="group" aria-label="Layout" className="flex items-center gap-1">
                {(
                  [
                    ["wall", "Free wall", Blocks],
                    ["grid", "Grid", Rows3],
                  ] as const
                ).map(([key, label, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    aria-label={label}
                    aria-pressed={view === key}
                    title={label}
                    onClick={() => chooseView(key)}
                    className="skeu skeu-press skeu-icon size-7 rounded-full text-muted-foreground aria-pressed:text-foreground aria-pressed:shadow-(--skeu-shadow-pressed) [&_svg]:size-3.5"
                  >
                    <Icon strokeWidth={1.75} />
                  </button>
                ))}
              </div>
            )}
            <span
              aria-hidden="true"
              className="flex items-center gap-2 py-1 font-mono text-[11px] tracking-widest text-muted-foreground uppercase"
            >
              <Move className="size-3.5" />
              {!isWall ? "Scroll to browse" : embedded ? "Drag to explore" : "Drag or scroll to explore"}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence onExitComplete={() => returnFocus.current?.focus({ preventScroll: true })}>
        {lightbox && (
          <Lightbox
            key="lightbox"
            shots={shots}
            index={lightbox.index}
            origin={lightbox.origin}
            onIndex={(index) => setLightbox({ index, origin: null })}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** One piece on the table, in either view: the work, then its caption. */
function Piece({
  item,
  focusable,
  note,
  onOpenShot,
}: {
  item: CanvasItem;
  focusable: boolean;
  note?: NoteContent;
  onOpenShot: (item: CanvasShot, el: HTMLElement) => void;
}) {
  return (
    <>
      {item.kind === "shot" && (
        <button
          type="button"
          tabIndex={focusable ? undefined : -1}
          aria-label={`Open ${item.title}`}
          onClick={(e) => onOpenShot(item, e.currentTarget)}
          className="group block w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <img
            src={item.src}
            alt=""
            width={item.width}
            height={item.height}
            draggable={false}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </button>
      )}
      {item.kind === "build" && <BuildTile item={item} focusable={focusable} />}
      {item.kind === "note" && (note ? <HeadingNote content={note} primary={focusable} /> : <Note />)}

      {item.kind !== "note" && (
        <p aria-hidden="true" className="mt-2.5 font-mono text-[10px] leading-relaxed tracking-widest text-foreground uppercase">
          {item.title}
        </p>
      )}
    </>
  );
}

/**
 * A note that heads a section (the home page's wall): no card, just the title
 * and its link set straight on the table. A real h2 on the first copy, and
 * the link on every copy, tabbable only on the first.
 */
function HeadingNote({ content, primary }: { content: NoteContent; primary: boolean }) {
  const Title = primary ? "h2" : "p";
  return (
    // The full height the layout reserves for the note, content centred in it,
    // so the camera's opening shot puts the title in the middle of the wall.
    <div className="flex min-h-[230px] flex-col items-center justify-center py-4 text-center">
      {content.label && (
        <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{content.label}</p>
      )}
      <Title
        id={primary ? content.headingId : undefined}
        className="font-hand text-[4rem] leading-[0.92] font-semibold text-balance"
      >
        {content.title}
      </Title>
      {content.body && <p className="mt-2 font-hand text-xl leading-snug text-muted-foreground">{content.body}</p>}
      {content.cta && (
        <Link
          href={content.cta.href}
          tabIndex={primary ? undefined : -1}
          draggable={false}
          // A plain link, not a button: the wall is the invitation, this just
          // points the way. The title above carries the handwriting.
          // Sized against the wall's zoom so it reads at 14px on screen, the
          // same as the case study cards' "Read case study".
          className="group mt-5 inline-flex items-center gap-1.5 rounded-sm text-[calc(0.875rem/var(--wall-scale,1))] font-medium text-foreground underline decoration-foreground/25 decoration-1 underline-offset-[calc(4px/var(--wall-scale,1))] transition-[text-decoration-color] duration-150 ease-out hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {content.cta.label}
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      )}
    </div>
  );
}

/** The Lab's own card on the table: what this is, and how to read it. */
function Note() {
  return (
    <div className="rounded-xl border border-dashed border-(--pattern-fg) bg-card/70 p-6">
      <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Index</p>
      <p className="mt-2 text-3xl font-medium tracking-tight">The Lab</p>
      <p className="mt-2 font-hand text-xl leading-snug text-muted-foreground">
        Things I&apos;ve built and screens I&apos;ve drawn, all on one table. Drag anywhere to look around.
      </p>
      <ul className="mt-5 space-y-1.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[#4ADE80]" /> Live: hover to read, click to open
        </li>
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-[1px] bg-foreground/40" /> Static: click for a closer look
        </li>
      </ul>
    </div>
  );
}
