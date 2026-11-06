"use client";

import { useEffect, useRef } from "react";
import { video, type VideoSlug } from "@/lib/media";

type Props = {
  slug: VideoSlug;
  className?: string;
  /** decorative by default */
  label?: string;
};

/**
 * Always-on background video: muted, inline, loops, and has no audio track.
 * iOS fallback: if autoplay is blocked, retry on the first touch / scroll.
 */
export default function AutoVideo({ slug, className, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const v = video(slug);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const play = () => el.play().catch(() => {});
    play();
    const events = ["touchstart", "pointerdown", "scroll"] as const;
    const once = () => {
      play();
      events.forEach((e) => window.removeEventListener(e, once));
    };
    events.forEach((e) => window.addEventListener(e, once, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, once));
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={v.src}
      poster={v.poster}
      width={v.w}
      height={v.h}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      disablePictureInPicture
    />
  );
}
