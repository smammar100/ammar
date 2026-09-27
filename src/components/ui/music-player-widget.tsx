"use client";

import {
  useCallback,
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";
import styles from "./music-player-widget.module.css";

// A compact music player: a spinning vinyl of the cover art, a dot-matrix
// "scales" mixer, crossfading titles, a progress bar and transport controls.
//
// Notes on this port:
// - Styles live in music-player-widget.module.css (the original shipped
//   generic class names like "card" and "bar").
// - Keyboard shortcuts belong to the player, not the page: they work while
//   focus is inside it, so Space still scrolls and arrows still move the Lab
//   canvas everywhere else.
// - The mixer reacts to the audio only when the audio can be analysed, which
//   needs crossOrigin and a CORS-enabled source. Routing a non-CORS file
//   through Web Audio would silence it, so without crossOrigin the player just
//   plays, and the mixer moves on its own clock while it does.

/* ----------------------------------------------------------------- types */

export interface Track {
  title: string;
  artist: string;
  cover: string;
  src: string;
}
export type LoopMode = "off" | "all" | "one";
export type Direction = "next" | "prev" | null;
type AudioCtor = typeof AudioContext;

const cx = (...names: Array<string | false | null | undefined>) => names.filter(Boolean).join(" ");

function audioCtor(): AudioCtor | undefined {
  return window.AudioContext || (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
}

/* ------------------------------------------------------------- useRafLoop */

// One 60 fps frame, the unit the per-frame tuning below was written against.
const FRAME_MS = 1000 / 60;
// A hidden tab can hand back a huge gap; cap it so nothing jumps on return.
const MAX_DT = 100;

// The callback returns whether it still has something to animate. When it
// returns false the loop sleeps, and any change in `wake` starts it again, so
// an idle player costs nothing per frame.
function useRafLoop(cb: (now: number, dt: number) => boolean, wake: readonly unknown[]) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(Math.max(now - last, 0), MAX_DT);
      last = now;
      if (cbRef.current(now, dt)) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, wake);
}

/* ---------------------------------------------------- useReducedMotion */

// Read in an effect, never during render, so the server render stays the
// same. Kept as state rather than a ref so a change wakes a sleeping loop.
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/* -------------------------------------------------- useTransitionSound */

function useTransitionSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);
  return useCallback((bassEnergy = 0.5) => {
    try {
      if (!ctxRef.current) {
        const Ctor = audioCtor();
        if (!Ctor) return;
        ctxRef.current = new Ctor();
      }
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startFreq = 440 + bassEnergy * 440;
      const endFreq = startFreq * (2 / 3);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.09);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      /* Web Audio unavailable */
    }
  }, []);
}

/* --------------------------------------------------- useAudioAnalyser */

const FFT_SIZE = 256;

function useAudioAnalyser(audioRef: RefObject<HTMLAudioElement | null>, enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(FFT_SIZE / 2));
  const connectedRef = useRef(false);

  const connect = useCallback(() => {
    const audio = audioRef.current;
    if (!enabled || !audio || connectedRef.current) return;
    try {
      const Ctor = audioCtor();
      if (!Ctor) return;
      const ctx = new Ctor();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.8;
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);
      connectedRef.current = true;
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
    } catch {
      /* unavailable or already connected */
    }
  }, [audioRef, enabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !enabled) return;
    audio.addEventListener("play", connect, { once: true });
    return () => audio.removeEventListener("play", connect);
  }, [audioRef, connect, enabled]);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  const getFrequencyData = useCallback((): Uint8Array | null => {
    const analyser = analyserRef.current;
    if (!analyser) return null;
    if (ctxRef.current?.state === "suspended") ctxRef.current.resume().catch(() => {});
    analyser.getByteFrequencyData(dataRef.current);
    return dataRef.current;
  }, []);

  const getBandEnergy = useCallback((startBin: number, endBin: number): number => {
    if (!analyserRef.current) return 0;
    const data = dataRef.current;
    const count = endBin - startBin;
    if (count <= 0) return 0;
    let sum = 0;
    for (let i = startBin; i < endBin && i < data.length; i++) sum += data[i];
    return sum / count / 255;
  }, []);

  return { getFrequencyData, getBandEnergy };
}

/* ------------------------------------------------------ useAudioPlayer */

interface State {
  currentIndex: number;
  order: number[];
  shuffled: boolean;
  loopMode: LoopMode;
  isPlaying: boolean;
  direction: Direction;
}
type Action =
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "SET_TRACK"; index: number; direction: Direction }
  | { type: "TOGGLE_SHUFFLE"; trackCount: number }
  | { type: "CYCLE_LOOP" };

function shuffleOrder(pinFirst: number, count: number): number[] {
  const rest = Array.from({ length: count }, (_, i) => i).filter((x) => x !== pinFirst);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [pinFirst, ...rest];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PLAY":
      return { ...state, isPlaying: true };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "SET_TRACK":
      return { ...state, currentIndex: action.index, direction: action.direction };
    case "TOGGLE_SHUFFLE": {
      const shuffled = !state.shuffled;
      const order = shuffled
        ? shuffleOrder(state.currentIndex, action.trackCount)
        : Array.from({ length: action.trackCount }, (_, i) => i);
      return { ...state, shuffled, order };
    }
    case "CYCLE_LOOP": {
      const next: LoopMode = state.loopMode === "off" ? "all" : state.loopMode === "all" ? "one" : "off";
      return { ...state, loopMode: next };
    }
    default:
      return state;
  }
}

function useAudioPlayer(tracks: Track[], analyse: boolean) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [state, dispatch] = useReducer(reducer, {
    currentIndex: 0,
    order: Array.from({ length: tracks.length }, (_, i) => i),
    shuffled: false,
    loopMode: "off",
    isPlaying: false,
    direction: null,
  });

  const { getFrequencyData, getBandEnergy } = useAudioAnalyser(audioRef, analyse);
  const playTransitionSound = useTransitionSound();

  const loadTrack = useCallback(
    (index: number, autoplay: boolean, direction: Direction) => {
      const audio = audioRef.current;
      if (!audio) return;
      playTransitionSound(getBandEnergy(0, 4));
      dispatch({ type: "SET_TRACK", index, direction });
      audio.src = tracks[index].src;
      audio.load();
      if (autoplay) audio.play().catch(() => {});
    },
    [tracks, playTransitionSound, getBandEnergy],
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  // forcePlay is for the "ended" event: by then the element is already paused,
  // so "keep playing if it was playing" would stop the queue after one track.
  const next = useCallback((forcePlay = false) => {
    const audio = audioRef.current;
    if (!audio) return;
    const autoplay = forcePlay || !audio.paused;
    const np = state.order.indexOf(state.currentIndex) + 1;
    if (np >= state.order.length) {
      if (state.loopMode === "all") loadTrack(state.order[0], autoplay, "next");
      else {
        audio.pause();
        audio.currentTime = 0;
      }
      return;
    }
    loadTrack(state.order[np], autoplay, "next");
  }, [state.order, state.currentIndex, state.loopMode, loadTrack]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const pp = state.order.indexOf(state.currentIndex) - 1;
    if (pp < 0) {
      if (state.loopMode === "all") loadTrack(state.order[state.order.length - 1], !audio.paused, "prev");
      else audio.currentTime = 0;
      return;
    }
    loadTrack(state.order[pp], !audio.paused, "prev");
  }, [state.order, state.currentIndex, state.loopMode, loadTrack]);

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = pct * audio.duration;
  }, []);

  const toggleShuffle = useCallback(() => {
    dispatch({ type: "TOGGLE_SHUFFLE", trackCount: tracks.length });
  }, [tracks.length]);

  const cycleLoop = useCallback(() => {
    dispatch({ type: "CYCLE_LOOP" });
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => dispatch({ type: "PLAY" });
    const onPause = () => dispatch({ type: "PAUSE" });
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setDuration(audio.duration);
    };
    const onEnded = () => {
      if (state.loopMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else next(true);
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [state.loopMode, next]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = tracks[0].src;
    audio.load();
  }, [tracks]);

  const seekBy = useCallback((seconds: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(a.duration || 0, a.currentTime + seconds));
  }, []);

  return {
    audioRef,
    state,
    currentTime,
    duration,
    currentTrack: tracks[state.currentIndex],
    toggle,
    next,
    prev,
    seek,
    seekBy,
    toggleShuffle,
    cycleLoop,
    getFrequencyData,
  };
}

/* --------------------------------------------------------- ScalesMixer */

const COLS = 10;
const ROWS = 10;
const BAND_RANGES: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 6],
  [6, 10],
  [10, 16],
  [16, 24],
  [24, 36],
  [36, 52],
  [52, 74],
  [74, 100],
];
const sineOut = (x: number) => Math.sin((x * Math.PI) / 2);
const sineIn = (x: number) => 1 - Math.cos((x * Math.PI) / 2);
const sineInOut = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const PART_A_DUR = 1.5;
const PART_A_TO = 11;
const PART_A_STEP = 3 / (COLS - 1);
const PART_B_DUR = 1;
const SCALE_FROM = 0.133;
const SCALE_TO = 0.8;

function partAColumnY(time: number, col: number): number {
  const local = time - col * PART_A_STEP;
  const period = PART_A_DUR * 2;
  const cyc = ((local % period) + period) % period;
  if (cyc < PART_A_DUR) return PART_A_TO * sineInOut(cyc / PART_A_DUR);
  return PART_A_TO * sineInOut(1 - (cyc - PART_A_DUR) / PART_A_DUR);
}
function partBCircle(time: number, col: number, row: number): [number, number] {
  const frac = row / ROWS;
  const yFrom = lerp(77, -77, frac);
  const yTo = lerp(col, -col, frac);
  const local = time - col / COLS;
  const period = PART_B_DUR * 2;
  const cyc = ((local % period) + period) % period;
  const e = cyc < PART_B_DUR ? sineOut(cyc / PART_B_DUR) : sineIn(1 - (cyc - PART_B_DUR) / PART_B_DUR);
  return [lerp(yFrom, yTo, e), lerp(SCALE_FROM, SCALE_TO, e)];
}

function ScalesMixer({
  isPlaying,
  reducedMotion,
  getFrequencyData,
}: {
  isPlaying: boolean;
  reducedMotion: boolean;
  getFrequencyData?: () => Uint8Array | null;
}) {
  const maskId = useId().replace(/:/g, "_");
  const colRefs = useRef<(SVGGElement | null)[]>([]);
  const circleRefs = useRef<(SVGCircleElement | null)[][]>(Array.from({ length: COLS }, () => []));
  const tRef = useRef(50);

  useRafLoop((_, dt) => {
    // With reduced motion the clock stands still and the audio is ignored,
    // so the dots hold one static pattern.
    if (isPlaying && !reducedMotion) tRef.current += dt / 1000;
    const time = tRef.current;
    const freqData = reducedMotion ? null : getFrequencyData?.();
    let sounding = false;
    for (let c = 0; c < COLS; c++) {
      let energy = 1.0;
      if (freqData) {
        const [binStart, binEnd] = BAND_RANGES[c];
        let sum = 0;
        for (let b = binStart; b < binEnd; b++) sum += freqData[b] ?? 0;
        if (sum > 0) sounding = true;
        energy = Math.sqrt(sum / (binEnd - binStart) / 255);
      }
      const bobGain = freqData ? 0.4 + energy : 1;
      const scaleGain = freqData ? 0.5 + energy : 1;
      const colEl = colRefs.current[c];
      if (colEl) colEl.style.transform = `translate(${c * 10}px, ${partAColumnY(time, c) * bobGain}px)`;
      for (let r = 0; r < ROWS; r++) {
        const circle = circleRefs.current[c][r];
        if (!circle) continue;
        const [ty, s] = partBCircle(time, c, r);
        circle.style.transform = `translateY(${ty}px) scale(${s * scaleGain})`;
      }
    }
    // Run while playing. After a pause the frame above leaves it where it
    // stopped; with an analyser it runs on until the level decays to silence,
    // so the dots still settle the way they did before.
    return !reducedMotion && (isPlaying || sounding);
  }, [isPlaying, reducedMotion]);

  return (
    <svg className={styles.scales} viewBox="0 0 98 108" aria-hidden="true">
      <mask id={maskId}>
        <rect width="10" height="10" fill="#fff" />
      </mask>
      {Array.from({ length: COLS }, (_, c) => (
        <g
          key={c}
          ref={(el) => {
            colRefs.current[c] = el;
          }}
          style={{ transform: `translate(${c * 10}px, 0px)` }}
        >
          {Array.from({ length: ROWS }, (_, r) => (
            <g key={r} mask={`url(#${maskId})`} transform={`translate(0 ${r * 10})`}>
              <circle
                ref={(el) => {
                  circleRefs.current[c][r] = el;
                }}
                cx="5"
                cy="5"
                r="5"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------- Disc + layers */

const SPIN_MAX = 0.4375;
const BURST_DURATION = 620;

interface Layer {
  id: number;
  track: Track;
  dir: Direction;
}

function Disc({
  layers,
  isPlaying,
  isZoomed,
  reducedMotion,
  trackKey,
  direction,
  onZoomToggle,
}: {
  layers: Layer[];
  isPlaying: boolean;
  isZoomed: boolean;
  reducedMotion: boolean;
  trackKey: number;
  direction: Direction;
  onZoomToggle: () => void;
}) {
  const spinRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef(0);
  const velRef = useRef(0);
  const burstRef = useRef({ from: 0, start: 0, active: false, pending: false });
  const lastKey = useRef(trackKey);

  useEffect(() => {
    if (trackKey !== lastKey.current) {
      lastKey.current = trackKey;
      if (direction) {
        burstRef.current.from = direction === "prev" ? 360 : -360;
        burstRef.current.pending = true;
      }
    }
  }, [trackKey, direction]);

  useRafLoop((now, dt) => {
    const el = spinRef.current;
    if (!el) return false;
    const burst = burstRef.current;
    if (reducedMotion) {
      // No spin and no counter-spin burst. A zoomed cover still snaps upright.
      velRef.current = 0;
      burst.pending = false;
      burst.active = false;
      if (isZoomed) rotRef.current = Math.round(rotRef.current / 360) * 360;
      el.style.transform = `scale(1.01) rotate(${rotRef.current}deg)`;
      return false;
    }
    // The easing was tuned per 60 fps frame; scale it by the real frame time
    // (exponentially for the lerps) so the speed is the same at any refresh rate.
    const frames = dt / FRAME_MS;
    if (isPlaying) velRef.current += (SPIN_MAX - velRef.current) * (1 - Math.pow(1 - 0.2, frames));
    else {
      velRef.current *= Math.pow(0.96, frames);
      if (velRef.current < 0.001) velRef.current = 0;
    }
    let settled = true;
    if (isZoomed) {
      // Straighten up to the nearest full turn, so the cover reads upright.
      const target = Math.round(rotRef.current / 360) * 360;
      const nx = rotRef.current + (target - rotRef.current) * (1 - Math.pow(1 - 0.08, frames));
      rotRef.current = Math.abs(target - nx) < 0.1 ? target : nx;
      settled = rotRef.current === target;
    } else {
      rotRef.current += velRef.current * frames;
    }
    if (burst.pending) {
      burst.start = now;
      burst.pending = false;
      burst.active = true;
    }
    let b = 0;
    if (burst.active) {
      const t = (now - burst.start) / BURST_DURATION;
      if (t >= 1) burst.active = false;
      else b = burst.from * Math.pow(1 - t, 3);
    }
    el.style.transform = `scale(1.01) rotate(${rotRef.current + b}deg)`;
    // Sleep once it's stopped spinning, the burst is over and the cover is upright.
    return isPlaying || velRef.current > 0 || burst.active || !settled;
  }, [isPlaying, isZoomed, trackKey, reducedMotion]);

  return (
    <button
      type="button"
      className={styles.disc}
      aria-pressed={isZoomed}
      aria-label="Show album cover"
      onClick={(e) => {
        e.stopPropagation();
        onZoomToggle();
      }}
    >
      <div className={styles.spin} ref={spinRef}>
        {layers.map((l, i) => {
          const isNewest = i === layers.length - 1;
          return (
            <img
              key={l.id}
              src={l.track.cover}
              alt=""
              className={cx(styles.cover, isNewest ? l.dir && styles.coverEnter : styles.coverExit)}
              draggable={false}
            />
          );
        })}
      </div>
      <div className={styles.hole}>
        <div className={styles.holeInner} />
      </div>
    </button>
  );
}

/* ------------------------------------------------------------ TrackInfo */

function TrackInfo({ layers }: { layers: Layer[] }) {
  return (
    <div className={styles.trackInfo} aria-live="polite">
      {layers.map((l, i) => {
        const isNewest = i === layers.length - 1;
        const dx = l.dir === "next" ? 14 : l.dir === "prev" ? -14 : 0;
        const state = isNewest ? (l.dir ? styles.tiEnter : undefined) : styles.tiExit;
        const style = { "--dx": `${isNewest ? dx : -dx}px` } as CSSProperties;
        return (
          <div key={l.id} className={styles.tiLayer} aria-hidden={isNewest ? undefined : true}>
            <p className={cx(styles.artist, state)} style={style}>
              {l.track.artist}
            </p>
            <p className={cx(styles.track, state)} style={style}>
              {l.track.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------- ProgressBar */

function fmt(s: number): string {
  if (!isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

function ProgressBar({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  onSeek: (pct: number) => void;
}) {
  const pct = duration ? (currentTime / duration) * 100 : 0;
  return (
    <>
      {/* Pointer seeking; the keyboard seeks with the arrow keys (see the player). */}
      <div
        className={styles.bar}
        aria-hidden="true"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
        }}
      >
        <div className={styles.barFill} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.time}>
        <span>{fmt(currentTime)}</span>
        <span aria-hidden="true">/</span>
        <span>{fmt(duration)}</span>
      </div>
    </>
  );
}

/* -------------------------------------------------------------- Controls */

function Controls({
  isPlaying,
  shuffled,
  loopMode,
  onToggle,
  onNext,
  onPrev,
  onShuffle,
  onLoop,
}: {
  isPlaying: boolean;
  shuffled: boolean;
  loopMode: LoopMode;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onShuffle: () => void;
  onLoop: () => void;
}) {
  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={cx(styles.ctrl, shuffled && styles.isActive)}
        onClick={onShuffle}
        aria-label="Shuffle"
        aria-pressed={shuffled}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 3h5v5" />
          <path d="M21 3l-7 7" />
          <path d="M3 21l7-7" />
          <path d="M16 21h5v-5" />
          <path d="M21 21l-7-7" />
          <path d="M3 3l7 7" />
        </svg>
      </button>
      <button type="button" className={styles.ctrl} onClick={onPrev} aria-label="Previous track">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M19 5L8 12l11 7zM5 5h2v14H5z" />
        </svg>
      </button>
      <button type="button" className={cx(styles.ctrl, styles.ctrlPlay)} onClick={onToggle} aria-label={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M6 5h3v14H6zM15 5h3v14h-3z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M7 5v14l11-7z" />
          </svg>
        )}
      </button>
      <button type="button" className={styles.ctrl} onClick={onNext} aria-label="Next track">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M5 5l11 7L5 19zM17 5h2v14h-2z" />
        </svg>
      </button>
      <button
        type="button"
        className={cx(styles.ctrl, loopMode !== "off" && styles.isActive, loopMode === "one" && styles.modeOne)}
        onClick={onLoop}
        aria-label={loopMode === "off" ? "Loop: off" : loopMode === "all" ? "Loop: all tracks" : "Loop: this track"}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12V8a2 2 0 0 1 2-2h12" />
          <path d="M16 3l4 3l-4 3" />
          <path d="M20 12v4a2 2 0 0 1-2 2H6" />
          <path d="M8 21l-4-3l4-3" />
        </svg>
        <span className={styles.loopOne} aria-hidden="true">
          1
        </span>
      </button>
    </div>
  );
}

/* ----------------------------------------------------- MusicPlayer root */

export interface MusicPlayerProps {
  tracks: Track[];
  /** Set for CORS-enabled audio; it also turns on the audio-reactive mixer. */
  crossOrigin?: "anonymous" | "use-credentials";
  /** How much of the audio to fetch up front. "none" for previews. */
  preload?: "none" | "metadata" | "auto";
  className?: string;
}

export function MusicPlayer({ tracks, crossOrigin, preload = "metadata", className }: MusicPlayerProps) {
  const player = useAudioPlayer(tracks, crossOrigin !== undefined);
  const [isZoomed, setIsZoomed] = useState(false);
  const reducedMotion = useReducedMotion();
  const hintId = useId();

  const [layers, setLayers] = useState<Layer[]>(() => [{ id: 0, track: tracks[0], dir: null }]);
  const lastIndex = useRef(0);
  const idRef = useRef(1);

  useEffect(() => {
    if (player.state.currentIndex === lastIndex.current) return;
    lastIndex.current = player.state.currentIndex;
    const id = idRef.current++;
    setLayers((prev) => [...prev, { id, track: player.currentTrack, dir: player.state.direction }]);
    const t = setTimeout(() => {
      setLayers((prev) => prev.filter((l) => l.id === id));
    }, 760);
    return () => clearTimeout(t);
  }, [player.state.currentIndex, player.currentTrack, player.state.direction]);

  // Shortcuts, while focus is anywhere inside the player.
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    // Leave modified keys to the browser (Alt+Left is back, Ctrl+S saves...).
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const onButton = (e.target as HTMLElement).tagName === "BUTTON";
    switch (e.key) {
      case " ":
        if (onButton) return; // the focused button handles its own press
        e.preventDefault();
        player.toggle();
        break;
      case "ArrowRight":
        e.preventDefault();
        if (e.shiftKey) player.next();
        else player.seekBy(5);
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (e.shiftKey) player.prev();
        else player.seekBy(-5);
        break;
      case "s":
      case "S":
        player.toggleShuffle();
        break;
      case "l":
      case "L":
        player.cycleLoop();
        break;
    }
  };

  return (
    <div
      role="group"
      aria-label="Music player"
      aria-describedby={hintId}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cx(styles.player, player.state.isPlaying && styles.isPlaying, isZoomed && styles.isZoomed, className)}
      onClick={() => setIsZoomed(false)}
    >
      <p id={hintId} className="sr-only">
        Space plays or pauses. Arrow keys skip five seconds; with Shift they change track. S shuffles, L loops.
      </p>
      <audio ref={player.audioRef} preload={preload} crossOrigin={crossOrigin} />
      <Disc
        layers={layers}
        isPlaying={player.state.isPlaying}
        isZoomed={isZoomed}
        reducedMotion={reducedMotion}
        trackKey={player.state.currentIndex}
        direction={player.state.direction}
        onZoomToggle={() => setIsZoomed((z) => !z)}
      />
      <div className={styles.info}>
        <ScalesMixer
          isPlaying={player.state.isPlaying}
          reducedMotion={reducedMotion}
          getFrequencyData={crossOrigin !== undefined ? player.getFrequencyData : undefined}
        />
        <TrackInfo layers={layers} />
        <ProgressBar currentTime={player.currentTime} duration={player.duration} onSeek={player.seek} />
        <Controls
          isPlaying={player.state.isPlaying}
          shuffled={player.state.shuffled}
          loopMode={player.state.loopMode}
          onToggle={player.toggle}
          // Wrapped so the click event isn't taken as next()'s forcePlay.
          onNext={() => player.next()}
          onPrev={player.prev}
          onShuffle={player.toggleShuffle}
          onLoop={player.cycleLoop}
        />
      </div>
    </div>
  );
}

export default MusicPlayer;
