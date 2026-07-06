import Link from "next/link";
import PixelWaveText from "@/components/PixelWaveText";
import { PatternSurfaceClient } from "@/components/lab/PatternSurfaceClient";

const notFoundPattern = {
  type: "flow-field", seed: 404, density: 260, steps: 90, scale: 260, curl: 35, strokeWidth: 0.8, opacity: 60, color: "copper",
} as const;
const notFoundLightPattern = {
  ...notFoundPattern, opacity: 70, strokeWidth: 0.95, color: "bronze",
} as const;
const notFoundMotion = { mode: "ambient", speed: 16, intensity: 24 } as const;

export function NotFoundSection() {
  return (
    <section className="relative isolate mx-auto flex min-h-[70vh] w-full max-w-[1400px] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center sm:px-8 lg:px-14">
      <PatternSurfaceClient
        name="not-found"
        config={notFoundPattern}
        lightConfig={notFoundLightPattern}
        motion={notFoundMotion}
        duration={2800}
        className="pointer-events-none absolute inset-0 -z-10 opacity-90"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_72%)]" />

      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Error &middot; 404</p>

      <PixelWaveText
        text="404"
        as="h1"
        wave="hero"
        className="mt-4 text-[5rem] font-medium leading-none tracking-tight sm:text-[7rem] lg:text-[8.5rem]"
      />

      <h2 className="mt-6 text-2xl font-medium tracking-tight sm:text-3xl">
        This page hasn&apos;t shipped yet.
      </h2>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        Broken link, wrong turn, or one of the 99 projects still to come — either way, there&apos;s nothing here.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          Back to home
        </Link>
        <Link
          href="/work"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          See the work
        </Link>
      </div>
    </section>
  );
}
