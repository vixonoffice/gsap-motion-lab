import data from "@/data/media.generated.json";

export type PhotoSlug = keyof typeof data.photos;
export type VideoSlug = keyof typeof data.videos;

export const photo = (slug: PhotoSlug) => data.photos[slug];
export const video = (slug: VideoSlug) => data.videos[slug];
export const sequence = data.sequences.bloom;

export const allCredits = () => [
  ...Object.entries(data.videos).map(([slug, v]) => ({
    kind: "Video",
    slug,
    creator: v.creator,
    creatorUrl: v.creatorUrl,
    url: v.url,
  })),
  ...Object.entries(data.sequences).map(([slug, v]) => ({
    kind: "Video (frame sequence)",
    slug,
    creator: v.creator,
    creatorUrl: v.creatorUrl,
    url: v.url,
  })),
  ...Object.entries(data.photos).map(([slug, v]) => ({
    kind: "Photo",
    slug,
    creator: v.creator,
    creatorUrl: v.creatorUrl,
    url: v.url,
  })),
];
