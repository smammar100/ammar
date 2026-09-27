import type { Metadata } from "next";
import { LabCanvas } from "@/components/lab/canvas/LabCanvas";
import { getCanvasItems } from "@/components/lab/canvas/getCanvasItems";

export const metadata: Metadata = {
  title: "Lab",
  description: "Design-engineering experiments and static shots, on one endless canvas.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Lab</h1>
      <p className="sr-only">
        Design-engineering experiments and static shots. Each live build links to its page; each shot opens in a
        lightbox. Switch between the free wall and a grid at the bottom of the screen.
      </p>
      <LabCanvas items={getCanvasItems()} />
    </>
  );
}
