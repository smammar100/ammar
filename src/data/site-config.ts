export const siteConfig = {
  name: "Syed Mohammad Ammar",
  title: "Syed Mohammad Ammar | Product Designer",
  description:
    "Product designer in Karachi who makes complex products easy to use, and builds them too. Product design, design systems and front-end in React and Next.js. Previously Senior Product Designer at Mahaana (YC W22).",
  // The live domain. The bare smammar.com redirects here, so every canonical
  // and absolute URL uses the www host (see lib/site-url.ts).
  url: "https://www.smammar.com",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    // Work hidden from the nav. The /work route and every case study still
    // resolve, and the home page's "View all" still links there.
    { label: "Lab", href: "/lab" },
    // Writing hidden from the nav. /writing and every post still resolve, and
    // the home page's Writing section still links there.
    // Community removed from nav: no real testimonials or community photos exist
    // yet. The /community route still resolves. TODO: re-add once Kind Words and
    // community content are real.
  ],
  // The resume as a PDF, in public/. The about page's "Download resume" link
  // and the agent-facing files point at it.
  resumePdf: "/Syed-Mohammad-Ammar-Resume.pdf",
  links: {
    // TODO: confirm Mahaana URL before launch — likely https://mahaana.com.
    mahaana: "https://mahaana.com",
  },
  social: {
    linkedin: "https://www.linkedin.com/in/syedmammar/",
    github: "https://github.com/smammar100",
    dribbble: "https://dribbble.com/smammar14",
    // TODO: add real X handle — UI must skip/hide empty links, never render them.
    x: "",
    // TODO: add real CodePen handle — UI must skip/hide empty links, never render them.
    codepen: "",
    email: "syed.m.ammar@hotmail.com",
  },
} as const;
