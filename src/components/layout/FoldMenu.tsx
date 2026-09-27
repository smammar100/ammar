"use client";

/**
 * A menu that unfolds like a strip of paper, after Makisu by Justin Windle
 * (https://github.com/soulwire/Makisu), ported from the jQuery plugin to React
 * and the Web Animations API. The panels are chained: each one sits inside the
 * one above it, hinged on that panel's bottom edge, so turning one carries
 * every panel below it. Opening unfolds them top to bottom with an overshoot,
 * each shadow lifting as the next panel starts, while the whole chain swings
 * once for momentum; closing folds them back up from the bottom.
 * Styles: `.fold-*` in styles/global.css.
 *
 * Makisu's licence:
 *
 * Copyright (C) 2012 by Justin Windle
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { useEffect, useRef, type ReactNode } from "react";

// Makisu's keyframes and timing model, with a shorter duration per panel than
// its demo lists: a menu is opened far more often than a demo is watched.
const SPEED = 480; // ms each panel takes to unfold (folding takes 66% of it)
const OVERLAP = 0.65; // how much of a panel's turn overlaps the next one's
const EASING = "ease-in-out";

// Resting angles. Folded, the first panel flips up behind the header (where
// the menu's scroll box clips it) and the rest lie folded back on each other.
const FOLDED_FIRST = -180;
const FOLDED = 180;

// Angle paths: [from, ...via, to].
const UNFOLD_FIRST = [-90, 60, 0];
const UNFOLD = [FOLDED, -30, 0];
const FOLD_FIRST = [0, FOLDED_FIRST];
const FOLD = [0, FOLDED];
// The whole chain's swing, as [angle, offset] pairs.
const SWING_OUT: [number, number][] = [[0, 0], [-30, 0.3], [15, 0.6], [0, 1]];
const SWING_IN: [number, number][] = [[0, 0], [-10, 0.5], [15, 0.9], [0, 1]];

const rotate = (deg: number) => `rotateX(${deg}deg)`;

// ── Sound ──
// Paper, synthesized: air moving as the sheet swings, and a snap for each
// panel as it lands (a crisp band of noise over a soft, low knock), rising in
// pitch down the menu as it opens and falling as it folds. Web Audio only
// starts inside a user gesture on iOS, so the button that toggles the menu
// calls primeFoldSound() in its click handler; the sounds are scheduled here.
let audio: AudioContext | null = null;
let noise: AudioBuffer | null = null;

/** Creates or wakes the audio context. Call it from the tap or key press that toggles the menu. */
export function primeFoldSound() {
  try {
    const Context =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) return;
    audio ??= new Context();
    if (audio.state === "suspended") void audio.resume();
  } catch {
    // No audio: fold silently.
  }
}

/**
 * Schedules one open or close. Each snap is seconds from now, pitched by its
 * panel's place from the top; `length` is the whole movement's, in seconds.
 * Returns the output gain, so an interrupted run can be faded out along with
 * anything it hasn't played yet.
 */
function playFold(open: boolean, snaps: { at: number; pitch: number }[], length: number): GainNode | null {
  if (!audio || audio.state !== "running") return null;
  try {
    const ctx = audio;
    const now = ctx.currentTime + 0.01;
    if (!noise || noise.sampleRate !== ctx.sampleRate) {
      noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    const out = ctx.createGain();
    out.gain.value = 0.22;
    out.connect(ctx.destination);

    // Air: looped noise through a low-pass that opens with the unfold and
    // closes with the fold.
    const air = ctx.createBufferSource();
    air.buffer = noise;
    air.loop = true;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.setValueAtTime(open ? 320 : 1500, now);
    tone.frequency.exponentialRampToValueAtTime(open ? 1500 : 320, now + length);
    const swell = ctx.createGain();
    swell.gain.setValueAtTime(0.0001, now);
    swell.gain.exponentialRampToValueAtTime(0.28, now + length * 0.3);
    swell.gain.exponentialRampToValueAtTime(0.0001, now + length);
    air.connect(tone).connect(swell).connect(out);
    air.start(now);
    air.stop(now + length + 0.05);

    // Pitch follows the panel, top to bottom: opening lands the top panel
    // first, so it rises; folding lands the bottom one first, so it falls.
    snaps.forEach(({ at: t, pitch }) => {
      const at = now + t;

      const snap = ctx.createBufferSource();
      snap.buffer = noise;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = 1700 * 1.12 ** pitch;
      band.Q.value = 0.9;
      const crack = ctx.createGain();
      crack.gain.setValueAtTime(0.0001, at);
      crack.gain.exponentialRampToValueAtTime(0.6, at + 0.004);
      crack.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
      snap.connect(band).connect(crack).connect(out);
      snap.start(at, Math.random() * 0.35); // a different stretch of noise each time
      snap.stop(at + 0.1);

      const knock = ctx.createOscillator();
      knock.frequency.setValueAtTime(190 * 1.06 ** pitch, at);
      knock.frequency.exponentialRampToValueAtTime(90, at + 0.06);
      const body = ctx.createGain();
      body.gain.setValueAtTime(0.0001, at);
      body.gain.exponentialRampToValueAtTime(0.35, at + 0.003);
      body.gain.exponentialRampToValueAtTime(0.0001, at + 0.08);
      knock.connect(body).connect(out);
      knock.start(at);
      knock.stop(at + 0.1);
    });

    window.setTimeout(() => out.disconnect(), (length + 0.5) * 1000);
    return out;
  } catch {
    return null;
  }
}

/** Fades a run's sound out, including anything it hadn't played yet. */
function silence(out: GainNode | null) {
  if (!out || !audio) return;
  out.gain.setTargetAtTime(0, audio.currentTime, 0.015);
  window.setTimeout(() => out.disconnect(), 150);
}

/** An element's current rotateX angle, read from its computed matrix. */
function angleOf(el: HTMLElement): number {
  const t = getComputedStyle(el).transform;
  const m = t.match(/^matrix3d\((.+)\)$/);
  if (!m) return 0; // "none", or a 2D matrix with no X rotation
  const v = m[1].split(",").map(Number);
  // rotateX(a) is matrix3d(1,0,0,0, 0,cos a,sin a,0, 0,-sin a,cos a,0, 0,0,0,1).
  return (Math.atan2(v[6], v[5]) * 180) / Math.PI;
}

interface FoldMenuProps {
  open: boolean;
  /**
   * One entry per panel, top to bottom. Folded, the panels zig-zag inside the
   * first one's height, so every panel but the last must be that height. The
   * last may be taller only if the count is odd: then it folds up behind the
   * header; with an even count it would hang below the fold and show.
   */
  panels: ReactNode[];
  /** Called when a fold-up finishes (straight away with reduced motion). */
  onFolded?: () => void;
  /** Paper sounds on open and close. Needs primeFoldSound() in the toggle's handler. */
  sound?: boolean;
}

export function FoldMenu({ open, panels, onFolded, sound = true }: FoldMenuProps) {
  const root = useRef<HTMLDivElement>(null);
  const nodes = useRef<HTMLDivElement[]>([]);
  const shades = useRef<HTMLSpanElement[]>([]);
  const voice = useRef<GainNode | null>(null);
  const soundOn = useRef(sound);
  soundOn.current = sound;
  // Starts closed, which the stylesheet already draws folded, so only a
  // change of `open` animates (and not Strict Mode's second effect run).
  const was = useRef(false);
  const folded = useRef(onFolded);
  folded.current = onFolded;

  useEffect(() => {
    if (was.current === open) return;
    was.current = open;
    const chain = root.current;
    if (!chain) return;
    const n = panels.length;
    const els = nodes.current.slice(0, n);
    const faces = shades.current.slice(0, n);

    if (process.env.NODE_ENV !== "production" && open) {
      const h = els.map((el) => (el.firstElementChild as HTMLElement).offsetHeight);
      if (h.slice(1, -1).some((x) => x !== h[0]) || (n % 2 === 0 && h[n - 1] > h[0]))
        console.warn("FoldMenu: panel heights won't fold away cleanly (see the `panels` prop).", h);
    }

    // Mid-fold, carry on from where each panel is instead of jumping to the
    // start of the new path. Read everything before cancelling anything.
    const busy = els.some((el) => el.getAnimations().length > 0);
    const angles = els.map((el, i) => {
      const a = angleOf(el);
      // ±180 are the same matrix; keep the sign the panel folds to.
      return Math.abs(a) > 179.5 ? (i === 0 ? FOLDED_FIRST : FOLDED) : a;
    });
    const shading = faces.map((el) => Number(getComputedStyle(el).opacity));
    const swing = angleOf(chain);
    for (const el of [chain, ...els, ...faces]) el.getAnimations().forEach((a) => a.cancel());

    // Rest state first, so it holds once the animations end.
    const target = (i: number) => (open ? 0 : i === 0 ? FOLDED_FIRST : FOLDED);
    const shadeTarget = open ? 0 : 1;
    els.forEach((el, i) => (el.style.transform = rotate(target(i))));
    faces.forEach((el) => (el.style.opacity = String(shadeTarget)));

    const speed = open ? SPEED : SPEED * 0.66;
    const step = speed * (1 - OVERLAP);
    silence(voice.current);
    voice.current = null;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No movement, so one snap for the change instead of a cascade.
      if (soundOn.current) voice.current = playFold(open, [{ at: 0, pitch: open ? 0 : n - 1 }], 0.15);
      if (!open) folded.current?.();
      return;
    }

    // The panels that move, in the order they go: opening top to bottom,
    // folding bottom to top. From rest, all of them, on Makisu's paths.
    // Mid-fold, only the ones not yet where they're headed, each straight
    // from its current angle with the stagger restarting at the first of
    // them, so nothing hangs in mid-air waiting its turn and panels already
    // in place don't flap through an overshoot again.
    const order = els.map((_, i) => (open ? i : n - 1 - i));
    const moving = busy ? order.filter((i) => Math.abs(angles[i] - target(i)) > 0.5) : order;
    const snaps: { at: number; pitch: number }[] = [];
    const done: Promise<Animation>[] = [];
    let end = 0;

    moving.forEach((i, rank) => {
      const delay = rank * step;
      const turn = Math.abs(angles[i] - target(i));
      const duration = busy ? speed * Math.min(1, Math.max(0.4, turn / 180)) : speed;
      const path = busy
        ? [angles[i], target(i)]
        : open
          ? i === 0
            ? UNFOLD_FIRST
            : UNFOLD
          : i === 0
            ? FOLD_FIRST
            : FOLD;
      // Easing on each keyframe, as Makisu's CSS animations have it, so a
      // panel slows into its overshoot and eases back rather than reversing
      // at full speed (an effect-level easing would span the whole path).
      const anim = els[i].animate(
        path.map((a) => ({ transform: rotate(a), easing: EASING })),
        { duration, delay, fill: "backwards" },
      );
      done.push(anim.finished);
      end = Math.max(end, delay + duration);
      // The snap: unfolding, at the top of the overshoot; folding (or a
      // straight move), as the panel settles.
      snaps.push({ at: (delay + duration * (open && !busy ? 0.5 : 0.9)) / 1000, pitch: i });

      // The shadow lifts as the next panel starts to unfold, and falls back
      // just before the panel folds.
      const last = rank === moving.length - 1;
      const shadeDelay = busy
        ? delay
        : open
          ? (last ? rank : rank + 1) * step
          : last
            ? rank * step
            : Math.max(0, (rank - 1) * step + speed * 0.35);
      faces[i].animate([{ opacity: busy ? shading[i] : 1 - shadeTarget }, { opacity: shadeTarget }], {
        duration: speed * 0.45,
        delay: shadeDelay,
        easing: EASING,
        fill: "backwards",
      });
    });

    // Shadows on panels that aren't moving settle quickly where they were mid-fade.
    if (busy)
      faces.forEach((el, i) => {
        if (!moving.includes(i) && Math.abs(shading[i] - shadeTarget) > 0.01)
          el.animate([{ opacity: shading[i] }, { opacity: shadeTarget }], { duration: 150, easing: "ease-out" });
      });

    // The chain's swing for momentum. Mid-fold, just let any swing in
    // progress settle, rather than starting another.
    if (!busy) {
      const keys = open ? SWING_OUT : SWING_IN;
      chain.animate(
        keys.map(([a, offset]) => ({ transform: rotate(a), offset, easing: "ease-in-out" })),
        { duration: n * step * (open ? 1.4 : 1) },
      );
    } else if (Math.abs(swing) > 0.5) {
      chain.animate([{ transform: rotate(swing) }, { transform: rotate(0) }], { duration: 200, easing: "ease-out" });
    }

    if (soundOn.current && snaps.length) voice.current = playFold(open, snaps, end / 1000);

    // The fold-up is over when every moving panel has landed. A cancelled
    // fold (reopened mid-way) rejects, and isn't a fold-up.
    if (!open)
      Promise.all(done).then(
        () => folded.current?.(),
        () => {},
      );
  }, [open, panels.length]);

  // Nest each panel inside the one before it: node > [panel, next node].
  const chainFrom = (i: number): ReactNode =>
    i < panels.length ? (
      <div
        className="fold-node"
        data-first={i === 0 || undefined}
        ref={(el) => {
          if (el) nodes.current[i] = el;
        }}
      >
        <div className="fold-panel" data-last={i === panels.length - 1 || undefined}>
          {panels[i]}
          <span
            className="fold-shade"
            aria-hidden="true"
            ref={(el) => {
              if (el) shades.current[i] = el;
            }}
          />
          <span className="fold-back" aria-hidden="true" />
        </div>
        {chainFrom(i + 1)}
      </div>
    ) : null;

  return (
    <div className="fold-scene">
      <div className="fold-root" ref={root}>
        {chainFrom(0)}
      </div>
    </div>
  );
}
