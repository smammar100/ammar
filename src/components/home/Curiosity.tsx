import { LabCanvas } from "@/components/lab/canvas/LabCanvas";
import type { CanvasItem } from "@/components/lab/canvas/items";

// Side projects, after the services: a window onto the Lab's endless wall, the
// same table as /lab at a smaller scale, running edge to edge in the frame.
// The section's heading and its way into the Lab live on the wall itself, as
// the card everything else is dealt out from.

export function Curiosity({ items }: { items: CanvasItem[] }) {
  return (
    <section aria-labelledby="curiosity-heading">
      <LabCanvas
        items={items}
        variant="embedded"
        className="h-[560px] sm:h-[660px]"
        note={{
          title: "Pushing my limits through curiosity",
          cta: { label: "Explore more", href: "/lab" },
          headingId: "curiosity-heading",
        }}
      />
    </section>
  );
}
