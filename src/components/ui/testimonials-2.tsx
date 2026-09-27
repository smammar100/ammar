import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// A single testimonial: a square portrait framed by hairlines that fade out
// past its corners, with the quote and attribution beside it. The caption is
// centred on the portrait and kept shorter than it, so the top and bottom
// hairlines frame the text instead of striking through it.
//
// Several utilities carry `!`: the article's .prose rules for blockquote,
// figcaption, figure and img are unlayered, so they beat Tailwind's layered
// utilities otherwise.

export interface TestimonialsSectionProps {
  /** The quote. Wrap the phrase to lift in <strong> for foreground emphasis. */
  quote: ReactNode;
  name: string;
  title: string;
  image: string;
  imageAlt?: string;
  /** Shown while the image loads or if it fails. */
  initials?: string;
  className?: string;
}

export function TestimonialsSection({
  quote,
  name,
  title,
  image,
  imageAlt,
  initials,
  className,
}: TestimonialsSectionProps) {
  return (
    <figure
      className={cn(
        "mx-auto flex w-full max-w-lg flex-col items-center justify-center md:grid md:grid-cols-[auto_1fr] md:items-center",
        className,
      )}
    >
      <div className="relative">
        {/* Vertical lines */}
        <MaskLine className="left-0" orientation="vertical" />
        <MaskLine className="right-0" orientation="vertical" />
        {/* Horizontal lines */}
        <MaskLine className="top-0 md:w-xl" orientation="horizontal" />
        <MaskLine className="bottom-0 md:w-xl" orientation="horizontal" />

        <Avatar className="mask-[radial-gradient(circle,black_60%,transparent)] size-24 rounded-none *:rounded-none md:size-40">
          <AvatarImage
            alt={imageAlt ?? name}
            src={image}
            className="m-0! rounded-none! border-0!"
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
      <figcaption className="mt-0! flex flex-col gap-4 p-8 text-center! text-base! md:py-0 md:pr-0 md:pl-5 md:text-left!">
        <blockquote className="m-0! border-0! p-0! text-lg leading-tight tracking-tight text-muted-foreground not-italic! [&_strong]:font-medium [&_strong]:text-foreground">
          “{quote}”
        </blockquote>

        <div>
          <cite className="text-sm font-medium text-foreground not-italic">{name}</cite>
          <div className="text-xs text-muted-foreground">{title}</div>
        </div>
      </figcaption>
    </figure>
  );
}

export function MaskLine({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute bg-foreground/20",
        orientation === "vertical" && "mask-t-from-80% mask-b-from-80% -inset-y-1/2 w-px",
        orientation === "horizontal" && "mask-l-from-80% mask-r-from-80% -inset-x-1/2 h-px",
        className,
      )}
      {...props}
    />
  );
}

export default TestimonialsSection;
