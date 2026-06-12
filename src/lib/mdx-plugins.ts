import type { Root, Element } from "hast";

/**
 * Wraps `<p><img title="Caption"></p>` in `<figure><img><figcaption>Caption</figcaption></figure>`.
 * Ported from the original Astro rehype plugin.
 */
export function rehypeFigure() {
  return (tree: Root) => {
    function walk(node: Root | Element) {
      const children = (node as Element).children;
      if (!children) return;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as Element;
        if (child.tagName === "p") {
          const real = child.children.filter(
            (n) => n.type !== "text" || n.value.trim() !== "",
          );
          if (real.length === 1 && (real[0] as Element).tagName === "img") {
            const img = real[0] as Element;
            const title = img.properties?.title;
            if (title) {
              delete img.properties.title;
              children[i] = {
                type: "element",
                tagName: "figure",
                properties: {},
                children: [
                  img,
                  {
                    type: "element",
                    tagName: "figcaption",
                    properties: {},
                    children: [{ type: "text", value: String(title) }],
                  },
                ],
              } as Element;
            }
          }
        }
        walk(child);
      }
    }
    walk(tree);
  };
}
