import { LocalTime } from "./LocalTime";

export function Footer() {
  return (
    <footer className="py-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 sm:px-8 lg:px-14">
        <a
          href="/colophon"
          className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          Colophon
        </a>
        <div className="flex items-center gap-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
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
