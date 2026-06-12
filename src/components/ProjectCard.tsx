import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ProjectCardProps {
  title: string;
  description: string;
  skills: string[];
  thumbnail: string;
  thumbnailDark?: string;
  thumbnailWide?: string;
  thumbnailWideDark?: string;
  slug: string;
  impact?: string;
  index?: number;
  variant?: "full" | "compact" | "bento";
  icon?: string;
  wide?: boolean;
  square?: boolean;
  squareDesktop?: boolean;
  showDescription?: boolean;
}

export function ProjectCard({
  title,
  description,
  skills,
  thumbnail,
  thumbnailDark,
  thumbnailWide,
  thumbnailWideDark,
  slug,
  impact,
  index = 0,
  variant = "full",
  square = false,
  wide = false,
  squareDesktop = false,
  showDescription = false,
}: ProjectCardProps) {
  const isReversed = variant === "full" && index % 2 === 1;
  const compactThumbnail = square ? thumbnail : (thumbnailWide ?? thumbnail);
  const compactThumbnailDark = square ? thumbnailDark : (thumbnailWideDark ?? thumbnailDark);
  const compactAspect = square ? "aspect-square" : wide ? "aspect-[5/2]" : "aspect-video";
  const compactWideThumbnail = thumbnailWide ?? thumbnail;
  const compactWideThumbnailDark = thumbnailWideDark ?? thumbnailDark;
  const hasResponsiveCompactImage = squareDesktop && !square;
  const href = `/work/${slug}`;

  if (variant === "full") {
    return (
      <Link href={href} className="group block" data-project-card>
        <article className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-black/5 dark:group-hover:shadow-black/20">
          <div className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"}`}>
            <div className="texture-bg overflow-hidden md:w-[40%]">
              {/* Mobile: wide image (16:9), hidden on md+ */}
              {thumbnailWide && (
                <img
                  src={thumbnailWide}
                  alt={title}
                  className={cn("aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] md:hidden", thumbnailWideDark && "dark:hidden")}
                />
              )}
              {thumbnailWide && thumbnailWideDark && (
                <img
                  src={thumbnailWideDark}
                  alt={title}
                  className="hidden aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] dark:block md:dark:hidden"
                />
              )}
              {/* Desktop: square image, hidden below md */}
              <img
                src={thumbnail}
                alt={title}
                className={cn(thumbnailWide ? "hidden md:block" : "", "w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] md:h-full", thumbnailDark && "dark:hidden")}
              />
              {thumbnailDark && (
                <img
                  src={thumbnailDark}
                  alt={title}
                  className={cn("w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] md:h-full", thumbnailWide ? "hidden md:dark:block" : "hidden dark:block")}
                />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-center p-6">
              <h3 className="mb-3 text-lg font-semibold tracking-tight">
                {title}
              </h3>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-[11px]">{skill}</Badge>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              {impact && (
                <blockquote className="mt-4 border-l-2 border-accent pl-3 text-sm font-medium text-foreground">
                  {impact}
                </blockquote>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "bento") {
    /* Bento variant: full-bleed image with aspect ratio, title overlay */
    return (
      <Link href={href} className="group block" data-project-card>
        <article className="relative aspect-[3/4] overflow-hidden rounded-xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-black/10 dark:group-hover:shadow-black/30">
          <img
            src={thumbnail}
            alt={title}
            className={cn("absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]", thumbnailDark && "dark:hidden")}
          />
          {thumbnailDark && (
            <img
              src={thumbnailDark}
              alt={title}
              className="absolute inset-0 hidden h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04] dark:block"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-sm font-medium leading-snug tracking-tight text-white drop-shadow">{title}</h3>
          </div>
        </article>
      </Link>
    );
  }

  /* Compact variant */
  return (
    <Link href={href} className="group flex h-full flex-col" data-project-card>
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:shadow-black/5 dark:group-hover:shadow-black/20">
        <div className="texture-bg shrink-0 overflow-hidden">
          {hasResponsiveCompactImage ? (
            <>
              <img
                src={compactWideThumbnail}
                alt={title}
                className={cn("aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] lg:hidden", compactWideThumbnailDark && "dark:hidden")}
              />
              {compactWideThumbnailDark && (
                <img
                  src={compactWideThumbnailDark}
                  alt={title}
                  className="hidden aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] dark:block lg:dark:hidden"
                />
              )}
              <img
                src={thumbnail}
                alt={title}
                className={cn("hidden aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] lg:block", thumbnailDark && "dark:lg:hidden")}
              />
              {thumbnailDark && (
                <img
                  src={thumbnailDark}
                  alt={title}
                  className="hidden aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] lg:dark:block"
                />
              )}
            </>
          ) : (
            <>
              <img
                src={compactThumbnail}
                alt={title}
                className={cn(compactAspect, "w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]", compactThumbnailDark && "dark:hidden")}
              />
              {compactThumbnailDark && (
                <img
                  src={compactThumbnailDark}
                  alt={title}
                  className={cn(compactAspect, "hidden w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] dark:block")}
                />
              )}
            </>
          )}
        </div>
        <div className={cn("flex flex-1 flex-col items-start", showDescription ? "p-4" : "p-4")}>
          <h3 className={cn(showDescription ? "mb-2 text-base font-semibold tracking-tight" : "line-clamp-2 text-base font-medium leading-snug tracking-tight")}>{title}</h3>
          {showDescription && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
