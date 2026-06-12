import Link from "next/link";
import { LabPreview } from "@/components/lab/LabPreview";

interface Props {
  title: string;
  description: string;
  href: string;
  preview: string;
  headingLevel?: "h2" | "h3";
}

export function LabCard({
  title,
  description,
  href,
  preview,
  headingLevel: Heading = "h2",
}: Props) {
  return (
    <Link href={href} className="group block" data-logo-cycle-trigger>
      <article className="h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:shadow-black/5 dark:group-hover:shadow-black/20">
        <LabPreview preview={preview} title={title} />
        <div className="p-4">
          <Heading className="mb-2 text-base font-semibold tracking-tight">
            {title}
          </Heading>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </article>
    </Link>
  );
}
