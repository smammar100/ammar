import PixelWaveText from "@/components/PixelWaveText";
import { DitherAMark } from "@/lab/pixel-mark/DitherMark";
import { PatternSurfaceClient } from "@/components/lab/PatternSurfaceClient";
import type { GeneratorConfig, MotionConfig } from "@/lab/editorial-art/themes";

interface Props {
  preview: string;
  title: string;
}

const patternEngineDarkConfig: GeneratorConfig = {
  type: "flow-field",
  seed: 256,
  density: 200,
  steps: 120,
  scale: 280,
  curl: 40,
  strokeWidth: 1.2,
  opacity: 78,
  color: "copper",
};

const patternEngineLightConfig: GeneratorConfig = {
  type: "flow-field",
  seed: 256,
  density: 200,
  steps: 120,
  scale: 280,
  curl: 40,
  strokeWidth: 1.2,
  opacity: 52,
  color: "bronze",
};

const patternEngineMotion: MotionConfig = {
  mode: "ambient",
  speed: 18,
  intensity: 22,
};

export function LabPreview({ preview, title }: Props) {
  return (
    <div className="relative aspect-[1200/630] overflow-hidden bg-card texture-bg">
      {preview === "pattern-engine" && (
        <div className="absolute inset-0" data-preview="pattern-engine">
          <div className="absolute inset-0 hidden bg-[#1a1816] dark:block">
            <PatternSurfaceClient
              name="lab-pattern-engine-dark"
              config={patternEngineDarkConfig}
              lightConfig={patternEngineDarkConfig}
              motion={patternEngineMotion}
              duration={2400}
              className="absolute inset-0 opacity-90"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1816]/70 via-transparent to-transparent"></div>
          </div>
          <div className="absolute inset-0 block bg-[#f5f1ec] dark:hidden">
            <PatternSurfaceClient
              name="lab-pattern-engine-light"
              config={patternEngineLightConfig}
              lightConfig={patternEngineLightConfig}
              motion={patternEngineMotion}
              duration={2400}
              className="absolute inset-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f5f1ec]/60 via-transparent to-transparent"></div>
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
            <span>Flow Field</span>
            <span className="text-foreground/20">Seed 256</span>
            <span className="text-foreground/20">Curl 40°</span>
            <span className="text-foreground/20">Ambient</span>
          </div>
        </div>
      )}

      {/* ── Pixel Wave ────────────────────────────────────── */}
      {preview === "pixel-wave" && (
        <div
          className="flex h-full items-center justify-center bg-background px-6 text-center"
          data-preview="pixel-wave"
        >
          <PixelWaveText
            text="Pixel Wave Animation"
            as="p"
            wave="preview-pixel-wave"
            className="max-w-md text-3xl font-medium leading-tight tracking-tight sm:text-4xl"
          />
          <div className="pointer-events-none absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        </div>
      )}

      {/* ── Pixel Mark ────────────────────────────────────── */}
      {preview === "pixel-mark" && (
        <div
          className="flex h-full items-center justify-center bg-background"
          data-preview="pixel-mark"
        >
          <DitherAMark size={72} />
        </div>
      )}

      {preview !== "pattern-engine" &&
        preview !== "pixel-wave" &&
        preview !== "pixel-mark" && (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {title}
            </p>
          </div>
        )}
    </div>
  );
}
