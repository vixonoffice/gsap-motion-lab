"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import Pic from "@/components/Pic";
import type { PhotoSlug } from "@/lib/media";

gsap.registerPlugin(useGSAP, Flip);

const filters = ["all", "nature", "urban", "abstract"] as const;

const tiles: { slug: PhotoSlug; cat: Exclude<(typeof filters)[number], "all">; name: string }[] = [
  { slug: "fog-ridge", cat: "nature", name: "Ridge" },
  { slug: "concrete", cat: "urban", name: "Concrete" },
  { slug: "smoke-violet", cat: "abstract", name: "Violet" },
  { slug: "dune-ripples", cat: "nature", name: "Dunes" },
  { slug: "neon-street", cat: "urban", name: "Neon" },
  { slug: "smoke-blue", cat: "abstract", name: "Blue" },
  { slug: "fog-violet", cat: "nature", name: "Haze" },
  { slug: "glass-edge", cat: "urban", name: "Glass" },
  { slug: "smoke-magenta", cat: "abstract", name: "Magenta" },
  { slug: "fog-green", cat: "nature", name: "Green" },
  { slug: "rain-blue", cat: "urban", name: "Rain" },
  { slug: "smoke-red", cat: "abstract", name: "Red" },
];

export default function FlipGrid() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<(typeof filters)[number]>("all");

  const { contextSafe } = useGSAP({ scope: root });
  const duration = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.8);

  // Flip in three steps: record the state, change the DOM, let Flip animate the difference.
  const flip = contextSafe((change: (tiles: HTMLElement[]) => void) => {
    const all = gsap.utils.toArray<HTMLElement>("[data-tile]");
    const state = Flip.getState(all);
    change(all);
    Flip.from(state, {
      duration: duration(),
      ease: "power3.inOut",
      absolute: true, // leaving tiles stop pushing the others around
      stagger: 0.025,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: duration() * 0.75 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.6, duration: duration() * 0.5 }),
    });
  });

  const filter = (cat: (typeof filters)[number]) => {
    setActive(cat);
    flip((all) => all.forEach((t) => (t.style.display = cat === "all" || t.dataset.cat === cat ? "" : "none")));
  };

  const feature = (tile: HTMLElement) =>
    flip((all) => {
      const was = tile.dataset.featured === "true";
      all.forEach((t) => (t.dataset.featured = "false"));
      tile.dataset.featured = was ? "false" : "true";
    });

  return (
    <section ref={root} className="bg-ink px-4 py-20 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter images">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={active === f}
              onClick={() => filter(f)}
              className={`min-h-11 rounded-full border px-5 text-[0.95rem] capitalize transition-colors ${
                active === f ? "border-accent bg-accent text-ink" : "border-line text-bone hover:border-bone"
              }`}
            >
              {f}
            </button>
          ))}
          <p className="eyebrow ml-auto hidden sm:block">Click a tile to feature it</p>
        </div>

        <div className="grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-4">
          {tiles.map((t) => (
            <button
              key={t.slug}
              type="button"
              data-tile
              data-cat={t.cat}
              data-featured="false"
              onClick={(e) => feature(e.currentTarget)}
              aria-label={`Feature ${t.name}`}
              className="relative aspect-square overflow-hidden rounded-2xl bg-coal text-left data-[featured=true]:col-span-2 data-[featured=true]:row-span-2"
            >
              <Pic slug={t.slug} alt="" sizes="(min-width: 768px) 25vw, 50vw" className="size-full object-cover" />
              <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider">
                {t.cat} / {t.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
