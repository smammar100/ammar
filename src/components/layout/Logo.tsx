interface LogoProps {
  className?: string;
}

/** The pixel "P" mark (braille letter P). Hover cycles the pixels. */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      height="28"
      width="28"
      aria-label="Patrick Morgan"
      className={`logo-root logo-cycle ${className ?? ""}`}
    >
      <style>{`
        .logo-root .logo-bg { fill: var(--color-secondary); transition: fill 0.5s ease; }
        .logo-root .logo-pixel {
          fill: var(--color-secondary-foreground);
          transition: fill 0.5s ease;
          transform-box: fill-box;
          transform-origin: center;
        }
        .logo-root .logo-pixel-1 { animation: logo-pixel-in 0.4s cubic-bezier(0.16,1,0.3,1)   0ms both; }
        .logo-root .logo-pixel-2 { animation: logo-pixel-in 0.4s cubic-bezier(0.16,1,0.3,1) 100ms both; }
        .logo-root .logo-pixel-3 { animation: logo-pixel-in 0.4s cubic-bezier(0.16,1,0.3,1) 200ms both; }
        .logo-root .logo-pixel-4 { animation: logo-pixel-in 0.4s cubic-bezier(0.16,1,0.3,1) 300ms both; }
        @keyframes logo-pixel-in { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @keyframes logo-pixel-cycle {
          0%, 18%, 100% { opacity: 1; transform: scale(1); }
          42% { opacity: 0; transform: scale(0); }
          66% { opacity: 1; transform: scale(1); }
        }
        .logo-cycle:hover .logo-bg { fill: var(--color-accent); }
        .logo-cycle:hover .logo-pixel {
          fill: var(--color-accent-foreground);
          animation: logo-pixel-cycle 1.1s cubic-bezier(0.16,1,0.3,1) infinite both;
        }
        .logo-cycle:hover .logo-pixel-1 { animation-delay:   0ms; }
        .logo-cycle:hover .logo-pixel-2 { animation-delay: 110ms; }
        .logo-cycle:hover .logo-pixel-3 { animation-delay: 220ms; }
        .logo-cycle:hover .logo-pixel-4 { animation-delay: 330ms; }
        @media (prefers-reduced-motion: reduce) {
          .logo-root .logo-pixel-1, .logo-root .logo-pixel-2, .logo-root .logo-pixel-3, .logo-root .logo-pixel-4,
          .logo-cycle:hover .logo-pixel { animation: none; }
        }
      `}</style>
      <rect className="logo-bg" width="28" height="28" rx="6.2" />
      <rect className="logo-pixel logo-pixel-1" x="8" y="4.5" width="5" height="5" rx="0.6" />
      <rect className="logo-pixel logo-pixel-2" x="15" y="4.5" width="5" height="5" rx="0.6" />
      <rect className="logo-pixel logo-pixel-3" x="8" y="11.5" width="5" height="5" rx="0.6" />
      <rect className="logo-pixel logo-pixel-4" x="8" y="18.5" width="5" height="5" rx="0.6" />
    </svg>
  );
}

export default Logo;
