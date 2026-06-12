interface FigmaEmbedProps {
  src: string;
  title: string;
  caption?: string;
}

export function FigmaEmbed({ src, title, caption }: FigmaEmbedProps) {
  return (
    <div className="figma-embed my-8">
      <div className="aspect-video overflow-hidden rounded-lg border border-border bg-card">
        <iframe src={src} title={title} className="h-full w-full" allowFullScreen loading="lazy" />
      </div>
      {caption && (
        <p className="mt-3 text-center font-mono text-xs text-muted-foreground">{caption}</p>
      )}
    </div>
  );
}

export default FigmaEmbed;
