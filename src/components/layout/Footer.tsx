import { siteConfig } from "@/data/site-config";
import { LocalTime } from "./LocalTime";

const socialLinks = [
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "GitHub", href: siteConfig.social.github },
  { label: "X", href: siteConfig.social.x },
  { label: "CodePen", href: siteConfig.social.codepen },
].filter((item) => item.href);

export function Footer() {
  return (
    <footer className="py-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
          {socialLinks.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
          {siteConfig.social.email && (
            <li>
              <a
                href={`mailto:${siteConfig.social.email}`}
                className="transition-colors hover:text-foreground"
              >
                Email
              </a>
            </li>
          )}
        </ul>
        <div className="flex items-center gap-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
          <a
            href="/colophon"
            className="text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            Colophon
          </a>
          <span>&copy; {new Date().getFullYear()}</span>
          {/* Top nav already shows local time on desktop. */}
          <span className="md:hidden">
            <span className="font-mono text-xs text-muted-foreground tabular-nums whitespace-nowrap">
              PK&nbsp;&middot;&nbsp;<LocalTime />
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
