import { MobileChrome } from "@/components/layout/MobileChrome";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { NotFoundSection } from "@/components/NotFoundSection";

export const metadata = {
  title: "Page not found",
};

// Root-level boundary: catches URLs that never matched a route at all (no
// (site)/(tool) layout mounted), so it supplies its own nav/footer chrome.
// (site)/not-found.tsx handles notFound() calls thrown from within matched
// (site) routes, where that layout is already mounted.
export default function NotFound() {
  return (
    <>
      <MobileChrome />
      <div className="flex min-h-dvh flex-col">
        <TopNav />
        <main className="flex-1">
          <NotFoundSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
