"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FRAMES = 72;
const W = 720;
const H = 670;
const frameSrc = (i: number) => `/media/seq/bloom-v1/f${String(i + 1).padStart(3, "0")}.webp`;

const captions = [
  ["One flower, 72 frames", "Each frame is a 10 KB WebP. Nothing is a video."],
  ["The scrollbar is the playhead", "Scroll back and the flower turns back. No decoding, no seeking."],
  ["Drawn on a canvas", "gsap.to on a plain object, snapped to whole frames."],
];

export default function ImageSequence() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = section.current!;
        el.dataset.animated = "true";
        const ctx = canvas.current!.getContext("2d")!;
        const images: HTMLImageElement[] = [];
        const state = { frame: 0 };
        let shown = -1;

        const ready = (i: number) => images[i]?.complete && images[i].naturalWidth > 0;

        // Draw the requested frame, or the closest earlier one that has arrived.
        const render = () => {
          let i = Math.round(state.frame);
          while (i > 0 && !ready(i)) i--;
          if (i === shown || !ready(i)) return;
          shown = i;
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(images[i], 0, 0, W, H);
          counter.current!.textContent = String(i + 1).padStart(2, "0");
        };

        // Frames start loading when the section is 2.5 screens away, not on page load.
        ScrollTrigger.create({
          trigger: el,
          start: "top 250%",
          once: true,
          onEnter: () => {
            for (let i = 0; i < FRAMES; i++) {
              const img = new Image();
              img.decoding = "async";
              img.onload = render;
              img.src = frameSrc(i);
              images[i] = img;
            }
          },
        });

        const caps = gsap.utils.toArray<HTMLElement>("[data-cap]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "+=350%", pin: true, scrub: 0.3 },
        });
        tl.to(state, { frame: FRAMES - 1, snap: "frame", ease: "none", duration: caps.length, onUpdate: render }, 0);
        caps.forEach((cap, i) => {
          tl.fromTo(cap, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.35 }, i + 0.05);
          if (i < caps.length - 1) tl.to(cap, { autoAlpha: 0, y: -40, duration: 0.3 }, i + 0.7);
        });

        return () => delete el.dataset.animated;
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} className="group relative overflow-hidden bg-ink data-[animated=true]:h-svh">
      <div className="mx-auto flex min-h-svh max-w-[1500px] flex-col items-center justify-center gap-10 px-4 py-20 group-data-[animated=true]:py-0 md:flex-row-reverse md:justify-between md:gap-0 sm:px-8">
        <div className="relative w-full max-w-[min(94vw,62svh*1.075,640px)] md:max-w-[min(48vw,78svh*1.075)]">
          <canvas
            ref={canvas}
            width={W}
            height={H}
            role="img"
            aria-label="A red amaryllis flower turning, one frame per slice of scroll"
            className="h-auto w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${frameSrc(0)})`, aspectRatio: `${W} / ${H}` }}
          />
          <p className="eyebrow absolute bottom-2 right-2">
            Frame <span ref={counter}>01</span> / {FRAMES}
          </p>
        </div>

        <div className="relative w-full md:w-[38vw] md:self-center">
          <p className="eyebrow mb-5">Image sequence</p>
          <div className="grid gap-8 group-data-[animated=true]:block group-data-[animated=true]:min-h-[11rem]">
            {captions.map(([title, text]) => (
              <div key={title} data-cap className="group-data-[animated=true]:absolute group-data-[animated=true]:inset-x-0 group-data-[animated=true]:top-12">
                <h3 className="display text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.98]">{title}</h3>
                <p className="mt-4 max-w-md text-mute">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
