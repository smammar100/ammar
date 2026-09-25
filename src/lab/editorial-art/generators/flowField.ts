import { CANVAS_W, CANVAS_H, type FlowFieldConfig, type RenderContext } from '../themes';
import { noise, makeRng } from './noise';

const W = CANVAS_W;
const H = CANVAS_H;
const STEP_PX = 4;

export interface FlowPath {
  points: [number, number][];
}

export function generateFlowField(cfg: FlowFieldConfig): FlowPath[] {
  const { seed, density, steps, scale, curl } = cfg;
  const curlRad = (curl * Math.PI) / 180;
  const rng = makeRng(seed);
  const paths: FlowPath[] = [];

  for (let i = 0; i < density; i++) {
    let x = rng() * W;
    let y = rng() * H;
    const points: [number, number][] = [[x, y]];

    for (let s = 0; s < steps; s++) {
      const angle = noise(x / scale, y / scale, seed) * Math.PI * 4 + curlRad;
      x += Math.cos(angle) * STEP_PX;
      y += Math.sin(angle) * STEP_PX;
      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) break;
      points.push([x, y]);
    }

    if (points.length > 2) paths.push({ points });
  }

  return paths;
}

// Ambient mode redraws every frame, but its base lines never change: only the
// travelling highlights move. The base layer is drawn once into an offscreen
// canvas and blitted each frame, rebuilt when colour, alpha, width, size or the
// path data change (a theme switch changes the colour, so it rebuilds too).
const ambientBaseCache = new WeakMap<FlowPath[], { key: string; canvas: HTMLCanvasElement }>();

function ambientBaseLayer(
  paths: FlowPath[],
  color: string,
  alpha: number,
  lineWidth: number,
  w: number,
  h: number,
): HTMLCanvasElement {
  const key = `${color}|${alpha}|${lineWidth}|${w}x${h}`;
  const cached = ambientBaseCache.get(paths);
  if (cached && cached.key === key) return cached.canvas;

  let canvas = cached?.canvas;
  if (!canvas) {
    canvas = document.createElement('canvas');
    // A GPU reset clears the detached canvas without changing the key; drop
    // the entry so the next frame redraws the base lines.
    const invalidate = () => ambientBaseCache.delete(paths);
    canvas.addEventListener('contextlost', invalidate);
    canvas.addEventListener('contextrestored', invalidate);
  }
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const scaleX = w / W;
    const scaleY = h / H;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = alpha;
    ctx.lineWidth = lineWidth;
    // One stroke per path, as the live draw did, so crossings still darken.
    for (const { points } of paths) {
      ctx.beginPath();
      ctx.moveTo(points[0][0] * scaleX, points[0][1] * scaleY);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0] * scaleX, points[i][1] * scaleY);
      }
      ctx.stroke();
    }
  }
  ambientBaseCache.set(paths, { key, canvas });
  return canvas;
}

// progress 0→1: each path reveals its points from start to end
export function drawFlowField(
  ctx: CanvasRenderingContext2D,
  paths: FlowPath[],
  color: string,
  opacity: number,
  strokeWidth: number,
  w: number,
  h: number,
  render: RenderContext,
): void {
  const scaleX = w / W;
  const scaleY = h / H;
  const ambient = render.motion.mode === 'ambient';
  const speed = render.motion.speed / 100;
  const intensity = Math.pow(render.motion.intensity / 100, 1.05);
  const time = render.time * (0.00016 + speed * 0.0005);
  const baseAlpha = (opacity / 100) * 0.65;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (ambient) {
    ctx.globalAlpha = 1;
    ctx.drawImage(
      ambientBaseLayer(paths, color, baseAlpha * (0.18 + 0.22 * intensity), strokeWidth * 0.85, w, h),
      0,
      0,
    );

    // One stroke per highlight, so crossing highlights still brighten where
    // they overlap.
    ctx.globalAlpha = Math.min(1, baseAlpha * (0.65 + 0.55 * intensity));
    ctx.lineWidth = strokeWidth * (1.15 + 0.85 * intensity);
    for (let pathIndex = 0; pathIndex < paths.length; pathIndex++) {
      const { points } = paths[pathIndex];
      if (points.length < 6) continue;
      const phase = (time + pathIndex * 0.037) % 1;
      const head = Math.floor(phase * points.length);
      const windowSize = Math.max(5, Math.floor(points.length * (0.16 + 0.24 * intensity)));
      const tail = Math.max(0, head - windowSize);
      ctx.beginPath();
      ctx.moveTo(points[tail][0] * scaleX, points[tail][1] * scaleY);
      for (let i = tail + 1; i <= head; i++) {
        ctx.lineTo(points[i][0] * scaleX, points[i][1] * scaleY);
      }
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  // Reveal and static: each path draws up to the current progress.
  ctx.globalAlpha = baseAlpha;
  ctx.lineWidth = strokeWidth;
  for (let pathIndex = 0; pathIndex < paths.length; pathIndex++) {
    const { points } = paths[pathIndex];
    const end = Math.max(2, Math.floor(points.length * render.progress));
    ctx.beginPath();
    ctx.moveTo(points[0][0] * scaleX, points[0][1] * scaleY);
    for (let i = 1; i < end; i++) {
      ctx.lineTo(points[i][0] * scaleX, points[i][1] * scaleY);
    }
    ctx.stroke();
  }

  ctx.restore();
}
