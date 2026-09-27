"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { siteConfig } from "@/data/site-config";
import { SOCIAL_LINKS } from "@/data/social";
import { cn } from "@/lib/utils";

// The skeuomorphic button family (classes in styles/global.css, "Skeuomorphic
// buttons"): icon buttons, text buttons and the email pill. Use these for
// secondary actions anywhere on the site; the dark primary CTA stays as is.

const EMAIL = siteConfig.social.email;

type IconLinkProps = Omit<ComponentPropsWithoutRef<"a">, "children"> & {
  /** Names the action for screen readers; the icon is decorative. */
  label: string;
  children: ReactNode;
};

/** A square icon link. Opens off-site links in a new tab and says so. */
export function SkeuIconLink({ label, href, className, children, ...rest }: IconLinkProps) {
  const external = typeof href === "string" && /^https?:/.test(href);
  return (
    <a
      href={href}
      aria-label={external ? `${label} (opens in a new tab)` : label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
      className={cn("skeu skeu-press skeu-icon", className)}
    >
      {children}
    </a>
  );
}

/** A square icon button, for actions rather than links. */
export function SkeuIconButton({
  label,
  className,
  children,
  type = "button",
  ...rest
}: Omit<ComponentPropsWithoutRef<"button">, "children"> & { label: string; children: ReactNode }) {
  return (
    <button type={type} aria-label={label} {...rest} className={cn("skeu skeu-press skeu-icon", className)}>
      {children}
    </button>
  );
}

export function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}

export function BrandIcon({ path, className }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/** Every social profile as an icon button. Email lives in the EmailPill, so
 *  it's off by default here. */
export function SocialButtons({ className, withEmail = false }: { className?: string; withEmail?: boolean }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {SOCIAL_LINKS.map((item) => (
        <li key={item.label}>
          <SkeuIconLink href={item.href} label={item.label}>
            <BrandIcon path={item.path} />
          </SkeuIconLink>
        </li>
      ))}
      {withEmail && EMAIL && (
        <li>
          <SkeuIconLink href={`mailto:${EMAIL}`} label="Email">
            <MailIcon />
          </SkeuIconLink>
        </li>
      )}
    </ul>
  );
}

/** The address as a mailto link, with a copy button that confirms with a check. */
export function EmailPill({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const [announce, setAnnounce] = useState("");
  const linkRef = useRef<HTMLAnchorElement>(null);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setAnnounce("Email address copied");
      timer.current = window.setTimeout(() => {
        setCopied(false);
        setAnnounce("");
      }, 1600);
    } catch {
      // No clipboard access: select the address so it can be copied by hand.
      const link = linkRef.current;
      const selection = window.getSelection();
      if (link && selection) {
        const range = document.createRange();
        range.selectNodeContents(link);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setAnnounce("Couldn't copy. The address is selected, so you can copy it yourself.");
    }
  }

  return (
    <div className={cn("skeu skeu-pill", className)}>
      <a ref={linkRef} href={`mailto:${EMAIL}`} className="skeu-pill-link">
        {EMAIL}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy email address"}
        data-copied={copied || undefined}
        className="skeu skeu-press skeu-copy"
      >
        <svg className="skeu-glyph skeu-glyph-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" />
          <path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5" />
        </svg>
        <svg className="skeu-glyph skeu-glyph-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </button>
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </div>
  );
}

export function StatusDot({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("status-dot", className)} />;
}
