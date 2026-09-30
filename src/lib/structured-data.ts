import { SOCIAL_LINKS } from "@/data/social";
import { agentProfile } from "@/lib/agent-profile";
import { projectLabel, type Entry, type ProjectData, type WritingData } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

// Structured data (schema.org JSON-LD) for search engines and AI agents,
// rendered with <JsonLd>. The root layout carries the site-wide graph; pages
// add their own block and point back at it by @id. Only facts the site states.

const personId = () => `${siteUrl()}/#person`;
const websiteId = () => `${siteUrl()}/#website`;

/** Site paths ("/images/...") become absolute; full URLs pass through. */
const absolute = (src: string) => (src.startsWith("/") ? `${siteUrl()}${src}` : src);

/** The trail back to the home page, as search results show it. */
function breadcrumb(trail: [name: string, url: string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })),
  };
}

/**
 * On every page: Ammar as a Person, his practice as a ProfessionalService
 * offering the two services, and the site.
 */
export function siteGraph() {
  const p = agentProfile();
  const base = p.links.site;
  const address = { "@type": "PostalAddress", addressLocality: p.location.city, addressCountry: "PK" };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId(),
        name: p.name,
        url: base,
        email: `mailto:${p.contact.email}`,
        jobTitle: "Product Designer",
        description: p.summary,
        address,
        worksFor: { "@type": "Organization", name: "Mahaana" },
        alumniOf: p.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
        knowsAbout: [...p.skills.design, ...p.skills.build, ...p.skills.domains],
        sameAs: SOCIAL_LINKS.map((s) => s.href),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${base}/#service`,
        name: `${p.name}: product design and web development`,
        url: base,
        email: p.contact.email,
        founder: { "@id": personId() },
        address,
        areaServed: "Worldwide",
        makesOffer: p.services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.name, description: s.description, provider: { "@id": personId() } },
        })),
      },
      {
        "@type": "WebSite",
        "@id": websiteId(),
        url: base,
        name: p.name,
        description: p.headline,
        inLanguage: "en",
        publisher: { "@id": personId() },
      },
    ],
  };
}

/** The about page: a profile page whose subject is the Person above. */
export function profilePageLd() {
  const p = agentProfile();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${p.links.about}#profilepage`,
        url: p.links.about,
        name: `About ${p.name}`,
        inLanguage: "en",
        isPartOf: { "@id": websiteId() },
        mainEntity: { "@id": personId() },
      },
      breadcrumb([["Home", p.links.site], ["About", p.links.about]]),
    ],
  };
}

/** A case study under /work. */
export function caseStudyLd(project: Entry<ProjectData>) {
  const base = siteUrl();
  const url = `${base}/work/${project.slug}`;
  const label = projectLabel(project.data);
  const image = project.data.heroImage ?? project.data.thumbnailWide ?? project.data.thumbnail;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: label,
        description: project.data.description,
        url,
        mainEntityOfPage: url,
        ...(image && { image: absolute(image) }),
        keywords: (project.data.tags ?? project.data.skills).join(", "),
        inLanguage: "en",
        author: { "@id": personId() },
        publisher: { "@id": personId() },
        isPartOf: { "@id": websiteId() },
      },
      breadcrumb([["Home", base], ["Work", `${base}/work`], [label, url]]),
    ],
  };
}

/**
 * A writing entry. These are the site's own summaries; the full article is on
 * Medium, which `isBasedOn` points at.
 */
export function writingLd(entry: Entry<WritingData>) {
  const base = siteUrl();
  const url = `${base}/writing/${entry.slug}`;
  const { title, description, publishedDate, image, canonicalUrl, tags } = entry.data;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: title,
        description,
        url,
        mainEntityOfPage: url,
        datePublished: publishedDate.toISOString(),
        ...(image && { image: absolute(image) }),
        ...(tags.length > 0 && { keywords: tags.join(", ") }),
        ...(canonicalUrl && { isBasedOn: canonicalUrl }),
        inLanguage: "en",
        author: { "@id": personId() },
        publisher: { "@id": personId() },
        isPartOf: { "@id": websiteId() },
      },
      breadcrumb([["Home", base], ["Writing", `${base}/writing`], [title, url]]),
    ],
  };
}
