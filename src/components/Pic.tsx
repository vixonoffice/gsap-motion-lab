import { photo, type PhotoSlug } from "@/lib/media";

type Props = {
  slug: PhotoSlug;
  alt: string;
  /** CSS sizes attribute, e.g. "(min-width: 768px) 50vw, 100vw" */
  sizes: string;
  className?: string;
  priority?: boolean;
  /** objectPosition, e.g. "50% 30%" */
  position?: string;
};

/** Pre-sized WebP with a width descriptor srcset. No optimizer, no runtime cost. */
export default function Pic({ slug, alt, sizes, className, priority, position }: Props) {
  const p = photo(slug);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={p.files["1280"]}
      srcSet={`${p.files["640"]} 640w, ${p.files["1280"]} 1280w`}
      sizes={sizes}
      width={p.w}
      height={p.h}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      style={{ backgroundColor: p.avg, objectPosition: position }}
    />
  );
}
