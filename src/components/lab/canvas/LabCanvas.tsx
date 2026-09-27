"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { Move } from "lucide-react";
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
// only renders when the set of items or the lightbox changes.
//
// On arrival the table deals itself out: the camera opens on the Lab note, and
// every other piece fans out from behind it to its place, nearest first, each
// starting small and a little turned. Any drag, scroll or key skips to the end.

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

// What the server renders: a desktop-sized block, camera near the Lab note.
// It stays hidden until the layout effect has fitted it to the real screen
// and started the intro (or shown it outright, for reduced motion).
const SSR_SCALE = 0.85;
const SSR_GRID: Grid = { cols: 1, rows: 2 };
const SSR_CAM = { x: -800, y: -560 };

// The deal: each piece takes INTRO_MS to fly out, starting up to INTRO_SPREAD
// ms late the further it lands from the middle of the screen.
const INTRO_MS = 1000;
const INTRO_SPREAD = 420;
const INTRO_PAUSE = 150;

/** Screen scale: smaller on narrow screens, so more of the table shows. */
const baseScale = (vw: number) => (vw < 640 ? 0.55 : vw < 1024 ? 0.7 : 0.85);

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

export function LabCanvas({ items }: { items: CanvasItem[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const cam = useRef({ ...SSR_CAM, vx: 0, vy: 0, scale: SSR_SCALE });
  const [grid, setGrid] = useState<Grid>(SSR_GRID);
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const centred = useRef(false);
  const layerRef = useRef<HTMLDivElement>(null);
  const intro = useRef<{ start: number } | null>(null);

  const placed = useMemo(() => {
    const out: Placed[] = [];
    for (let r = 0; r < grid.rows; r++)
      for (let c = 0; c < grid.cols; c++)
        for (const item of items) out.push({ item, key: `${item.id}:${c}:${r}`, c, r, primary: c === 0 && r === 0 });
    return out;
  }, [items, grid]);
  const placedRef = useRef(placed);
  placedRef.current = placed;
  const drag = useRef({ down: false, active: false, id: -1, sx: 0, sy: 0, lx: 0, ly: 0, lt: 0, swallowClick: false });
  const raf = useRef(0);
  const reduce = useReducedMotion();

  const shots = items.filter((i): i is CanvasShot => i.kind === "shot");
  const [lightbox, setLightbox] = useState<{ index: number; origin: DOMRect | null } | null>(null);
  const lightboxOpen = useRef(false);
  lightboxOpen.current = lightbox !== null;
  const returnFocus = useRef<HTMLElement | null>(null);

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
    const cx = (vp?.clientWidth ?? 0) / 2;
    const cy = (vp?.clientHeight ?? 0) / 2;
    const reach = Math.hypot(cx, cy) * 2 || 1;
    const now = performance.now();
    let running = false;

    for (const p of placedRef.current) {
      const el = itemRefs.current.get(p.key);
      if (!el) continue;
      if (!deal) {
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

  /** Skip whatever is left of the intro and put everything in its place. */
  const endIntro = useCallback(() => {
    if (!intro.current) return;
    intro.current = null;
    apply();
  }, [apply]);

  // Fit to the screen: pick the scale, repeat the tile enough times that the
  // block (less its seams) covers the screen, and on first fit, open with the
  // Lab note in the middle.
  useLayoutEffect(() => {
    const fit = () => {
      const vp = viewportRef.current;
      if (!vp) return;
      const vw = vp.clientWidth;
      const vh = vp.clientHeight;
      const s = baseScale(vw);
      cam.current.scale = s;
      const next = {
        cols: Math.max(1, Math.ceil((vw / s + SEAM_X) / TILE_W)),
        rows: Math.max(1, Math.ceil((vh / s + SEAM_Y) / TILE_H)),
      };
      const first = !centred.current;
      if (first) {
        centred.current = true;
        const note = items.find((i) => i.kind === "note");
        if (note) {
          cam.current.x = vw / 2 - (note.x + note.w / 2) * s;
          cam.current.y = vh / 2 - (note.y + itemHeight(note) / 2) * s;
        }
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          intro.current = { start: performance.now() + INTRO_PAUSE };
          const tick = () => {
            if (!intro.current) return;
            if (apply()) raf.current = requestAnimationFrame(tick);
            else endIntro();
          };
          raf.current = requestAnimationFrame(tick);
        }
      }
      if (next.cols !== gridRef.current.cols || next.rows !== gridRef.current.rows) setGrid(next);
      apply();
      // Placed for this screen (or at the start of the deal): safe to show.
      if (first && layerRef.current) layerRef.current.style.visibility = "visible";
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [apply, endIntro, items]);

  // A new grid renders new copies; place them before paint.
  useLayoutEffect(() => {
    apply();
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
  // so it can't stop the page from scrolling instead.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      if (lightboxOpen.current || e.ctrlKey) return; // ctrl+wheel is pinch-zoom
      e.preventDefault();
      cancelAnimationFrame(raf.current);
      endIntro();
      const k = e.deltaMode === 1 ? 16 : 1;
      // Shift+wheel on a plain mouse means sideways.
      const sideways = e.shiftKey && !e.deltaX;
      cam.current.x -= (sideways ? e.deltaY : e.deltaX) * k;
      cam.current.y -= (sideways ? 0 : e.deltaY) * k;
      apply();
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [apply, endIntro]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Drag. The pointer is only captured once it has moved a few px, so a plain
  // click still lands on the tile under it. After a real drag, the click the
  // browser fires on release is swallowed so it doesn't open anything.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (lightboxOpen.current || e.button !== 0) return;
    cancelAnimationFrame(raf.current);
    endIntro();
    const d = drag.current;
    Object.assign(d, { down: true, active: false, id: e.pointerId, sx: e.clientX, sy: e.clientY, lx: e.clientX, ly: e.clientY, lt: e.timeStamp, swallowClick: false });
    cam.current.vx = 0;
    cam.current.vy = 0;
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down || e.pointerId !== d.id) return;
    if (!d.active) {
      if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 6) return;
      d.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
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
    d.swallowClick = true;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    // Only glide if the pointer was still moving when it let go.
    if (!reduce && e.timeStamp - d.lt < 80) glide();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (lightboxOpen.current) return;
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
    endIntro();
    tweenBy(move[0], move[1]);
  };

  // Tabbing to an item glides it to the middle of the screen if it's off it.
  const onFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    const vp = viewportRef.current;
    if (!vp || e.target === vp || lightboxOpen.current) return;
    if (!e.target.matches(":focus-visible")) return;
    const r = e.target.getBoundingClientRect();
    const v = vp.getBoundingClientRect();
    const pad = 48;
    const inside = r.left >= v.left + pad && r.right <= v.right - pad && r.top >= v.top + pad && r.bottom <= v.bottom - pad;
    if (inside) return;
    tweenBy(v.left + v.width / 2 - (r.left + r.width / 2), v.top + v.height / 2 - (r.top + r.height / 2));
  };

  const openShot = (index: number, el: HTMLElement) => {
    returnFocus.current = el;
    setLightbox({ index, origin: el.querySelector("img")?.getBoundingClientRect() ?? null });
  };

  return (
    <>
      <div
        ref={viewportRef}
        role="region"
        aria-label="Lab canvas. Drag, scroll or use the arrow keys to move around."
        tabIndex={0}
        className="relative h-[calc(100svh-3.5rem)] w-full cursor-grab touch-none overflow-clip outline-none select-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset md:h-[calc(100svh-4rem)]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          if (!drag.current.swallowClick) return;
          drag.current.swallowClick = false;
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragStart={(e) => e.preventDefault()}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      >
        <div ref={layerRef} className="lab-canvas-layer absolute inset-0" style={{ visibility: "hidden" }}>
        {placed.map((p) => {
          const { item, primary } = p;
          return (
          <div
            key={p.key}
            ref={(el) => {
              if (el) itemRefs.current.set(p.key, el);
              else itemRefs.current.delete(p.key);
            }}
            aria-hidden={primary ? undefined : true}
            className="absolute top-0 left-0 origin-top-left will-change-transform"
            // The server renders the desktop layout, so the first paint is
            // already arranged; the layout effect corrects it for the screen.
            style={{
              width: item.w,
              transform: position(p, SSR_CAM, SSR_SCALE, SSR_GRID),
              // The note is the deck the rest is dealt from, so it sits on top.
              zIndex: item.kind === "note" ? 10 : undefined,
            }}
          >
            {item.kind === "shot" && (
              <button
                type="button"
                tabIndex={primary ? undefined : -1}
                aria-label={`Open ${item.title}`}
                onClick={(e) => openShot(shots.indexOf(item), e.currentTarget)}
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
            {item.kind === "build" && <BuildTile item={item} focusable={primary} />}
            {item.kind === "note" && <Note />}

            {item.kind !== "note" && (
              <div aria-hidden="true" className="mt-2.5 font-mono text-[10px] leading-relaxed tracking-widest uppercase">
                <p className="text-foreground">{item.title}</p>
                <p className="text-muted-foreground">
                  {item.kind === "shot" ? "Static" : "Live"} · {item.label}
                </p>
              </div>
            )}
          </div>
          );
        })}
        </div>
        {/* Without scripts nothing moves, so just show the table as rendered. */}
        <noscript>
          <style>{".lab-canvas-layer{visibility:visible!important}"}</style>
        </noscript>

        {/* Hint, always there, like a legend on the table. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase shadow-sm backdrop-blur"
        >
          <Move className="size-3.5" />
          Drag or scroll to explore
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
