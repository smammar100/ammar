"use client";

import { DitherAMark } from "@/lab/pixel-mark/DitherMark";
import { EmailPill, SocialButtons, StatusDot } from "@/components/ui/skeu";
import { LeafGarden } from "@/components/ui/leaf-garden";
import { LocalTime } from "./LocalTime";

// The site footer: one raised card holding the ask (availability, the email
// with a copy button, the social buttons), sitting in a leaf garden that
// grows up around it. The plants answer the pointer, and clicking the soil
// plants another. Decided from /proto/footer; see
// agent-os/learnings/footer.md for what was rejected.

export function Footer() {
  return (
    <footer id="contact" className="relative scroll-mt-16 overflow-hidden pt-20 pb-36 sm:pt-28 sm:pb-48">
      <LeafGarden seed={41} density={11} reach={[0.5, 1]} interactive className="absolute inset-x-0 bottom-0 h-[78%]" />

      <div className="relative mx-auto max-w-[36rem] px-4">
        {/* Outer 28px corners with 8px padding, so the paper inside is 20px. */}
        <div className="skeu rounded-[28px] p-2">
          <div className="relative rounded-[20px] bg-card/70 p-6 sm:p-9">
            <span aria-hidden="true" className="absolute top-5 right-5 block size-16 overflow-hidden rounded-xl sm:top-7 sm:right-7">
              <DitherAMark size={64} />
            </span>

            <p className="flex items-center gap-2.5 pr-20 text-sm text-muted-foreground">
              <StatusDot />
              Currently open to new projects
            </p>
            <h2 className="mt-5 max-w-[16ch] pr-16 text-3xl font-medium tracking-tight text-balance sm:pr-0 sm:text-4xl">
              Let&apos;s build something worth shipping.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-pretty text-muted-foreground">
              Tell me about the product and where it&apos;s stuck.
            </p>

            <EmailPill className="mt-7 w-full justify-between" />

            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <SocialButtons />
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground/70 uppercase tabular-nums">
                Karachi, PK&nbsp;&middot;&nbsp;<LocalTime />
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
