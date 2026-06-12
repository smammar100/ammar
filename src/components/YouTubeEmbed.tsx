interface YouTubeEmbedProps {
  id: string;
  title?: string;
}

/** Lightweight YouTube embed (replaces astro-embed's lite-youtube). */
export function YouTubeEmbed({ id, title = "YouTube video" }: YouTubeEmbedProps) {
  return (
    <div className="my-8 mb-12 aspect-video overflow-hidden rounded-lg">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

export default YouTubeEmbed;
