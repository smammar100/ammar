import { MobileChrome } from "@/components/layout/MobileChrome";
import { TopNav } from "@/components/layout/TopNav";

// Full-bleed tool shell (no footer) — used by the pattern engine.
export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileChrome />
      <div className="flex min-h-dvh flex-col">
        <TopNav />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}
