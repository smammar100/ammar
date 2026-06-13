export interface Role {
  company: string;
  url?: string;
  logo?: string;
  role: string;
  dateRange: string;
  summary?: string;
  projects?: string[];
  descriptions: string[];
}

// NOTE: the Role interface has no education slot, and the resume page renders
// roles only. TODO: surface education somewhere honest —
// Harbour.Space (at UTCC, Bangkok), MA Interaction Design, 2022–2023, 100% scholarship;
// FAST-NUCES, BS Computer Science, 2016–2020.
export const roles: Role[] = [
  {
    company: "Mahaana (YC W22)",
    // TODO: confirm URL before linking — likely https://mahaana.com (see siteConfig.links.mahaana).
    // TODO: add /images/logos/career-mahaana.svg, then set `logo`.
    role: "Product Designer → Senior Product Designer",
    dateRange: "2023–Now",
    summary:
      "Leading design for Pakistan's first SECP-licensed digital wealth manager, founded by the team behind Sweden's Tundra Fonder. 10,000+ app downloads, 4.8★+ on iOS — working directly with engineers and founders to ship it.",
    projects: ["mahaana-wealth"],
    descriptions: [
      "Led design for Mahaana's investment platform across mobile and web — 10,000+ downloads, 4.8★+ on iOS, 4.0★+ on Android.",
      "Shipped Save+ pots, investment dashboards, and ETF comparison tools.",
      "Designed an investment calculator in Webflow that lifted conversion 20%.",
      "Cut design-to-dev turnaround 35% with Figma component libraries.",
    ],
  },
  {
    company: "NUMI (YC)",
    // TODO: confirm NUMI URL before linking.
    // TODO: add /images/logos/career-numi.svg, then set `logo`.
    role: "Freelance Designer",
    dateRange: "2024–2025",
    summary:
      "Part-time freelance bringing early-stage startup MVPs and landing pages to life for US clients, remote. Headline act: a full Truewind (YC W23) rebrand — logo, UI system, landing page — delivered in under two weeks.",
    projects: ["truewind-rebrand"],
    descriptions: [
      "Redesigned the full brand and web experience for Truewind (YC W23, AI-powered accounting): new logo, UI system, and landing page, in under two weeks.",
      "Brought early-stage startup MVPs and landing pages to life for US clients.",
      "Advised founders on usability, information architecture, and product-market-fit alignment.",
    ],
  },
  {
    company: "PeerDrop",
    // TODO: add /images/logos/career-peerdrop.svg, then set `logo`.
    role: "Product Designer",
    dateRange: "2020–2022",
    summary:
      "Designed the entire mobile app experience for a London-based, COVID-era grocery delivery startup — remote from Karachi. 1,000+ beta users, a £40,000 seed raise, and a 34% lift in order acceptance.",
    projects: ["peerdrop"],
    descriptions: [
      "Designed the entire mobile app experience for a COVID-era grocery delivery platform — 1,000+ beta users; helped raise £40,000 in seed funding.",
      "Lifted order acceptance 34% through user research, interviews, and usability testing.",
      "Built the design system that made build cycles 17% faster.",
      "Led product discovery, UI/UX, and visual branding.",
    ],
  },
  {
    company: "Gamolytics",
    // TODO: add /images/logos/career-gamolytics.svg, then set `logo`.
    role: "Co-Founder",
    dateRange: "2020",
    summary:
      "Co-founded a startup in Karachi during my final year of computer science — FAST Ideacon Champions, incubated at Google's Nest I/O. The part I couldn't stop doing turned out to be the design.",
    descriptions: [
      "FAST Ideacon Champions; incubated at Google's Nest I/O.",
      "Handled design, marketing, pitching, and PR.",
    ],
  },
];
