"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AutoVideo from "@/components/AutoVideo";
import Pic from "@/components/Pic";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HorizontalScroll() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = section.current!;
        el.dataset.animated = "true"; // switches the CSS from native snap-scroll to pinned

        // How far the track has to travel: its own overflow, recomputed on every refresh.
        const distance = () => track.current!.scrollWidth - window.innerWidth;

        const slide = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Media drifts inside its frame. containerAnimation = "use the slide as the timeline".
        gsap.utils.toArray<HTMLElement>("[data-pan]").forEach((pan) => {
          gsap.fromTo(
            pan,
            { xPercent: -10 },
            {
              xPercent: 10,
              ease: "none",
              scrollTrigger: { trigger: pan.parentElement, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
            },
          );
        });

        gsap.to("[data-bar]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: () => "+=" + distance(), scrub: true, invalidateOnRefresh: true },
        });

        return () => delete el.dataset.animated;
      });
    },
    { scope: section },
  );

  const frame = "relative h-[62svh] shrink-0 snap-center overflow-hidden rounded-[1.75rem] bg-coal";
  const pan = "absolute inset-y-0 -inset-x-[14%]";

  return (
    <section
      ref={section}
      className="group relative bg-ink data-[animated=true]:h-svh data-[animated=true]:overflow-hidden"
    >
      <div
        ref={track}
        className="no-scrollbar flex h-svh w-full snap-x snap-mandatory items-center gap-4 overflow-x-auto px-4 sm:gap-6 sm:px-8 group-data-[animated=true]:w-max group-data-[animated=true]:snap-none group-data-[animated=true]:overflow-visible"
      >
        <div className="flex w-[82vw] shrink-0 snap-center flex-col justify-center gap-6 pr-4 md:w-[44vw]">
          <p className="eyebrow">01 / Scroll down, travel sideways</p>
          <h2 className="display text-[clamp(3rem,9vw,9rem)]">
            The page<br />
            goes <span className="text-accent">sideways.</span>
          </h2>
          <p className="max-w-sm text-mute">Keep scrolling. The section stays pinned until the last panel has passed.</p>
        </div>

        <figure className={`${frame} w-[74vw] md:w-[30vw]`}>
          <div data-pan className={pan}>
            <Pic slug="concrete" alt="Grey concrete architecture against a pale sky" sizes="(min-width: 768px) 40vw, 90vw" className="size-full object-cover" />
          </div>
          <figcaption className="absolute bottom-4 left-5 eyebrow !text-bone">02 / Structure</figcaption>
        </figure>

        <figure className={`${frame} w-[86vw] md:w-[46vw]`}>
          <div data-pan className={pan}>
            <AutoVideo slug="city-trails" className="size-full object-cover" />
          </div>
          <figcaption className="absolute bottom-4 left-5 eyebrow !text-bone">03 / Video keeps playing while it moves</figcaption>
        </figure>

        <div className="flex h-[62svh] w-[74vw] shrink-0 snap-center flex-col justify-between rounded-[1.75rem] bg-accent p-6 text-ink sm:p-10 md:w-[34vw]">
          <p className="eyebrow !text-ink">04 / Distance</p>
          <p className="display text-[clamp(5rem,14vw,13rem)]">1:1</p>
          <p className="max-w-[18rem] font-medium">One pixel of scroll equals one pixel of sideways travel.</p>
        </div>

        <figure className={`${frame} w-[74vw] md:w-[28vw]`}>
          <div data-pan className={pan}>
            <Pic slug="smoke-red" alt="Red smoke curling against black" sizes="(min-width: 768px) 40vw, 90vw" className="size-full object-cover" />
          </div>
          <figcaption className="absolute bottom-4 left-5 eyebrow !text-bone">05 / Depth</figcaption>
        </figure>

        <div className="flex w-[82vw] shrink-0 snap-center flex-col justify-center gap-5 pl-4 pr-8 md:w-[34vw]">
          <p className="eyebrow">06 / Release</p>
          <p className="display text-[clamp(2.6rem,6vw,5.4rem)]">Pin ends. The page carries on.</p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-6 hidden h-px bg-line group-data-[animated=true]:block sm:inset-x-8">
        <div data-bar className="h-px origin-left scale-x-0 bg-accent" />
      </div>
    </section>
  );
}
