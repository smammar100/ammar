import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { rehypeFigure } from "@/lib/mdx-plugins";
import { FigmaEmbed } from "@/components/FigmaEmbed";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

// Components available to MDX content. `YouTube` matches the old astro-embed
// component name used in the project files (<YouTube id="..." />).
const components = {
  FigmaEmbed,
  YouTubeEmbed,
  YouTube: YouTubeEmbed,
};

export function Mdx({ source, format = "mdx" }: { source: string; format?: "md" | "mdx" }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          format,
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, rehypeFigure],
        },
      }}
    />
  );
}
