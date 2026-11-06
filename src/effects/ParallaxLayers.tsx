"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Pic from "@/components/Pic";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DEPTH = 0.4; // how much of the "true" parallax we apply (1 = fully physical, too wild on a phone)

export default function ParallaxLayers() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = section.current!;
        // A layer with speed s moves s x faster than the page. Over the whole pass the
        // extra travel is (s - 1) x range, so we centre it around the layer's resting place.
        const range = () => (el.offsetHeight + window.innerHeight) * DEPTH;

        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((layer) => {
          const s = parseFloat(layer.dataset.speed!);
          gsap.fromTo(
            layer,
            { y: () => ((s - 1) * range()) / 2 },
            {
              y: () => (-(s - 1) * range()) / 2,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
            },
          );
        });
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} className="relative h-[150svh] overflow-hidden bg-ink md:h-[175svh]">
      <div data-speed="0.55" className="absolute inset-x-0 -top-[12%] h-[124%]">
        <Pic slug="fog-violet" alt="Violet mountain ridges disappearing into fog" sizes="100vw" className="size-full object-cover" />
      </div>

      <h2
        data-speed="1"
        aria-label="Depth"
        className="outline-text display pointer-events-none absolute inset-x-0 top-[30%] text-center text-[clamp(5rem,21vw,24rem)] leading-[0.8]"
      >
        DEPTH
      </h2>

      <div data-speed="1.45" className="absolute left-[6%] top-[46%] w-[46vw] max-w-[22rem] overflow-hidden rounded-2xl">
        <Pic slug="glass-edge" alt="Corner of a glass building against black sky" sizes="(min-width: 768px) 22rem, 46vw" className="aspect-[4/5] w-full object-cover" />
      </div>

      <div data-speed="1.9" className="absolute right-[4%] top-[8%] w-[38vw] max-w-[18rem] overflow-hidden rounded-2xl">
        <Pic slug="neon-street" alt="Rainy neon street at night" sizes="(min-width: 768px) 18rem, 38vw" className="aspect-[3/4] w-full object-cover" />
      </div>

      <div data-speed="1.2" className="absolute bottom-[8%] left-4 right-4 sm:left-auto sm:right-[8%] sm:max-w-md">
        <p className="eyebrow !text-bone">Four layers, four speeds</p>
        <p className="display mt-3 text-[clamp(1.8rem,3.6vw,3rem)] leading-[1.02]">Photos and type, no cut-outs needed.</p>
      </div>
    </section>
  );
}
