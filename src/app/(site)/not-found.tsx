import { NotFoundSection } from "@/components/NotFoundSection";

export const metadata = {
  title: "Page not found",
  // Overrides the root layout's "index, follow" default.
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundSection />;
}
