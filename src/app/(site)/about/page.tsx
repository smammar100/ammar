import LissajousAmmar from "@/components/LissajousAmmar";
import { JsonLd } from "@/components/JsonLd";
import { TechStack } from "@/components/about/TechStack";
import { siteConfig } from "@/data/site-config";
import { pageMetadata } from "@/lib/metadata";
import { profilePageLd } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Syed Mohammad Ammar is a product designer from Karachi with a computer science background, getting deeper into design engineering one side project at a time.",
  path: "/about",
});

export default function Page() {
  return (
    <>
      <JsonLd data={profilePageLd()} />
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
          Hey, I&rsquo;m Ammar. I like figuring things out by making them.
        </h1>
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
            I&rsquo;m a product designer from Karachi. I studied computer science at FAST before finding my way into design. Later, I moved to Bangkok on a full scholarship to study Interaction Design at Harbour.Space. Both experiences still shape how I work. I&rsquo;m interested in how things are built, but just as much in how they feel to use.
          </p>
          <p>
            I tend to get caught up in the details. Sometimes it&rsquo;s a flow that takes too many steps, sometimes it&rsquo;s an animation that doesn&rsquo;t feel quite right. I like trying different approaches until I understand what&rsquo;s causing the problem. Side projects give me space to follow that curiosity and try things I haven&rsquo;t done before.
          </p>
          <p>
            Right now, I&rsquo;m working on getting better at design engineering. I&rsquo;m also figuring out how AI fits into the way I design and build, using it to explore ideas, write code and get projects out into the world. There&rsquo;s plenty I&rsquo;m still learning, and having something real to work on helps it stick.
          </p>
          <p>
            Outside of work, I enjoy running, going to the gym and watching Chelsea. I also spend time playing around with motion and 3D. Those experiments have a habit of becoming another side project.
          </p>
        </div>

        <a
          href={siteConfig.resumePdf}
          download
          className="group mt-8 inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-accent"
        >
          Download resume
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
            ↓
          </span>
        </a>

        <TechStack className="mt-16" />

        <div className="mt-16 -mx-6">
          <div className="aspect-[79/20] w-full">
            <LissajousAmmar />
          </div>
        </div>
      </section>
    </>
  );
}
