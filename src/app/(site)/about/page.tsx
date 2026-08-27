import type { Metadata } from "next";
import Link from "next/link";
import LissajousAmmar from "@/components/LissajousAmmar";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Syed Mohammad Ammar went from a computer-science degree in Karachi to leading design at Mahaana (YC W22), and why he's publicly shipping 100 built projects to earn the title of design engineer.",
};

export default function Page() {
  return (
    <>
      <style>{`
        .about-load {
          animation: about-page-load 480ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .about-load-photos {
          animation-delay: 80ms;
        }

        .about-load-body {
          animation-delay: 200ms;
        }

        .about-photo-carousel {
          scroll-padding-inline: 1.5rem;
          scrollbar-width: none;
        }

        .about-photo-carousel::-webkit-scrollbar {
          display: none;
        }

        @keyframes about-page-load {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-load {
            animation: none;
          }
        }
      `}</style>

      <section className="about-load about-load-hero mx-auto max-w-3xl px-6 pt-12 pb-16 sm:pt-24">
        <h1 className="text-balance text-4xl font-medium tracking-tight sm:text-5xl">
          <span className="block text-balance">Nobody was going to give me the title.</span>
          <span className="block">So I&apos;m earning it.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          I&apos;m Ammar, a product designer in Karachi with a computer-science degree and a public pledge: build and ship 100 real projects until &lsquo;design engineer&rsquo; isn&apos;t a claim, it&apos;s a record. This site is one of the receipts.
        </p>
      </section>

      <section className="about-load about-load-photos pb-16">
        {/* TODO: replace placeholder images below with Ammar's photos (same slots and dimensions). */}
        <div
          className="about-photo-carousel flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 md:hidden"
          aria-label="Personal photos"
        >
          <figure className="w-[min(78vw,20rem)] shrink-0 snap-center rotate-[-1.5deg] bg-white p-2 pb-7 shadow-xl shadow-black/15 dark:bg-[#20201e] dark:shadow-black/40">
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src="/images/brand/profile-living-room.jpg"
                alt="Photo of Ammar. TODO replace image."
                width="2400"
                height="2400"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </figure>
          <figure className="w-[min(78vw,20rem)] shrink-0 snap-center rotate-[1deg] bg-white p-2 pb-7 shadow-xl shadow-black/15 dark:bg-[#20201e] dark:shadow-black/40">
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src="/images/brand/personal-dinner.jpg"
                alt="Photo of Ammar. TODO replace image."
                width="1800"
                height="1201"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </figure>
          <figure className="w-[min(78vw,20rem)] shrink-0 snap-center rotate-[-1deg] bg-white p-2 pb-7 shadow-xl shadow-black/15 dark:bg-[#20201e] dark:shadow-black/40">
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src="/images/brand/personal-hollywood.jpg"
                alt="Photo of Ammar. TODO replace image."
                width="1800"
                height="1200"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </figure>
          <figure className="w-[min(78vw,20rem)] shrink-0 snap-center rotate-[1.5deg] bg-white p-2 pb-7 shadow-xl shadow-black/15 dark:bg-[#20201e] dark:shadow-black/40">
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src="/images/brand/personal-airport.jpg"
                alt="Photo of Ammar. TODO replace image."
                width="1800"
                height="1350"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </figure>
        </div>

        {/* TODO: replace placeholder images below with Ammar's photos (same slots and dimensions). */}
        <div className="mx-auto hidden max-w-5xl items-start gap-5 px-6 md:grid md:grid-cols-2 lg:grid-cols-4">
          <figure className="rotate-[-1.5deg] bg-white p-2 pb-7 shadow-xl shadow-black/15 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] dark:bg-[#20201e] dark:shadow-black/40">
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src="/images/brand/profile-living-room.jpg"
                alt="Photo of Ammar. TODO replace image."
                width="2400"
                height="2400"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </figure>
          <figure className="rotate-[1deg] bg-white p-2 pb-7 shadow-xl shadow-black/15 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] dark:bg-[#20201e] dark:shadow-black/40 lg:mt-10">
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src="/images/brand/personal-dinner.jpg"
                alt="Photo of Ammar. TODO replace image."
                width="1800"
                height="1201"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </figure>
          <figure className="rotate-[-1deg] bg-white p-2 pb-7 shadow-xl shadow-black/15 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] dark:bg-[#20201e] dark:shadow-black/40 lg:mt-3">
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src="/images/brand/personal-hollywood.jpg"
                alt="Photo of Ammar. TODO replace image."
                width="1800"
                height="1200"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </figure>
          <figure className="rotate-[1.5deg] bg-white p-2 pb-7 shadow-xl shadow-black/15 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] dark:bg-[#20201e] dark:shadow-black/40 lg:mt-12">
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src="/images/brand/personal-airport.jpg"
                alt="Photo of Ammar. TODO replace image."
                width="1800"
                height="1350"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </figure>
        </div>
      </section>

      <section className="about-load about-load-body mx-auto max-w-3xl px-6 pb-24">
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            I live in Karachi. I trained as an engineer, a BS in Computer Science at FAST-NUCES, before I ever opened a design tool, then crossed into design and felt the seam every time work passed from one side of that wall to the other.
          </p>
          <p>
            <Link
              href="/work/peerdrop"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              PeerDrop
            </Link>{" "}
            made it a job: from 2020 to 2022 I designed the mobile experience for a London grocery delivery startup, remote from Karachi: 1,000+ beta users, a £40,000 seed raise, a 34% lift in order acceptance. Then an MA in Interaction Design at Harbour.Space in Bangkok, on a 100% scholarship, made it official.
          </p>
          <p>
            Since December 2023 I&apos;ve been at{" "}
            <Link
              href="/work/mahaana-wealth"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              Mahaana (YC W22)
            </Link>
            , Pakistan&apos;s first SECP-licensed digital wealth manager, as Senior Product Designer since April 2025, leading design across mobile and web, with 10,000+ downloads. On the side, a full{" "}
            <Link
              href="/work/truewind-rebrand"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              Truewind (YC W23) rebrand
            </Link>
            , logo to landing page, in under two weeks.
          </p>
          <p>
            Even at my most senior, the work still ended at a handover. So I made{" "}
            <Link
              href="/work/design-engineering-100"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              a pledge in public
            </Link>
            : become a design engineer by building and shipping 100 real projects. The proof so far:{" "}
            <a
              href="https://trackandtread.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              Track &amp; Tread
            </a>
            , the #1 Top Author spot on 21st.dev, ThumbGen (open source), and a{" "}
            <a
              href="https://medium.com/design-bootcamp/how-i-built-a-consistent-airbnb-style-3d-icon-system-with-json-part-2-7ad582c915fc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              Medium series
            </a>{" "}
            on a 3D icon system. 1 down, 99 to go.
          </p>
          <p>
            What I want next: high-impact teams where the designer who writes the code is an asset, not a category error. If you&apos;re building something worth shipping, email me at{" "}
            <a
              href="mailto:mrammarbest110@gmail.com"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              mrammarbest110@gmail.com
            </a>
            , or find me on{" "}
            <a
              href="https://www.linkedin.com/in/syedmammar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              LinkedIn
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/SMAmmar14"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              GitHub
            </a>
            .
          </p>
        </div>

        <div className="mt-16 -mx-6">
          <div className="aspect-[79/20] w-full">
            <LissajousAmmar />
          </div>
        </div>
      </section>
    </>
  );
}
