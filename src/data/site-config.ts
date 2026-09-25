export const siteConfig = {
  name: "Syed Mohammad Ammar",
  title: "Syed Mohammad Ammar | Product Designer",
  description:
    "Product designer in Karachi. Senior Product Designer at Mahaana (YC W22), #1 Top Author on 21st.dev, publicly shipping 100 built projects, design to deploy.",
  // TODO: confirm domain before launch.
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
  links: {
    // TODO: confirm Mahaana URL before launch — likely https://mahaana.com.
    mahaana: "https://mahaana.com",
  },
  social: {
    linkedin: "https://www.linkedin.com/in/syedmammar/",
    github: "https://github.com/SMAmmar14",
    // TODO: add real X handle — UI must skip/hide empty links, never render them.
    x: "",
    // TODO: add real CodePen handle — UI must skip/hide empty links, never render them.
    codepen: "",
    email: "syed.m.ammar@hotmail.com",
  },
} as const;
