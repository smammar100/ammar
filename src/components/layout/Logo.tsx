import { DitherAMark } from "@/lab/pixel-mark/DitherMark";

interface LogoProps {
  className?: string;
  size?: number;
}

/** Site mark — the dithered "A", same glyph the desktop TopNav uses. */
export function Logo({ className, size = 28 }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="Syed Mohammad Ammar"
      className={`block overflow-hidden rounded-md ${className ?? ""}`}
    >
      <DitherAMark size={size} />
    </span>
  );
}

export default Logo;
