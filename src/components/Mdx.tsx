import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { rehypeFigure } from "@/lib/mdx-plugins";
import { FigmaEmbed } from "@/components/FigmaEmbed";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import {
  IconimateHoverGrid,
  IconimateRestStateGrid,
  IconimateSizeScale,
} from "@/components/case-study/IconimateDemo";
import { IconimateLabCandidates } from "@/components/case-study/IconimateLab";
import { IconimateCardDemo } from "@/components/case-study/IconimateCard";
import { Goals, Goal, Feature, HowMightWe } from "@/components/case-study/CaseStudySections";
import {
  MahaanaScreenWall,
  MahaanaFoundations,
  MahaanaImpact,
  MahaanaVoices,
  MahaanaJourneyMap,
} from "@/components/case-study/MahaanaSections";
import { MahaanaOnboarding } from "@/components/case-study/MahaanaOnboarding";

// Components available to MDX content. `YouTube` matches the old astro-embed
// component name used in the project files (<YouTube id="..." />).
// The case-study graphics are zero-prop presets — next-mdx-remote doesn't
// reliably pass array/object expression props through MDX.
const components = {
  FigmaEmbed,
  YouTubeEmbed,
  YouTube: YouTubeEmbed,
  IconimateHoverGrid,
  IconimateRestStateGrid,
  IconimateSizeScale,
  IconimateLabCandidates,
  IconimateCardDemo,
  Goals,
  Goal,
  Feature,
  HowMightWe,
  MahaanaScreenWall,
  MahaanaFoundations,
  MahaanaImpact,
  MahaanaVoices,
  MahaanaJourneyMap,
  MahaanaOnboarding,
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
