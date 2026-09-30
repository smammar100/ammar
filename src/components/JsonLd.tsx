/**
 * A JSON-LD block (structured data for search engines and AI agents; the
 * objects come from lib/structured-data.ts). "<" is escaped so nothing in the
 * content can close the script tag.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
