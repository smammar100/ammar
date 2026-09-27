import { StatusDot } from "@/components/ui/skeu";

/**
 * The status line above the hero headline: a live dot and the status on a
 * raised pill in the button material. A status, not an action, so it has no
 * press state.
 */
export function AvailabilityBadge({ className }: { className?: string }) {
  return (
    <p className={`skeu inline-flex h-8 items-center gap-2.5 rounded-full pr-3.5 pl-3 text-[13px] font-medium ${className ?? ""}`}>
      <StatusDot className="shadow-[0_0_0_3px_oklch(0.72_0.17_150/0.18)]" />
      Open to new projects
    </p>
  );
}
