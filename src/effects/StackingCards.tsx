"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AutoVideo from "@/components/AutoVideo";
import Pic from "@/components/Pic";
import type { PhotoSlug } from "@/lib/media";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Card = { title: string; text: string; tone: string; photo?: PhotoSlug };

const cards: Card[] = [
  { title: "Listen", text: "We start with what the page has to do, who is on it and on which phone.", tone: "bg-accent text-ink", photo: "neon-street" },
  { title: "Sketch", text: "Layout first, in grayscale. Motion only gets added where it explains something.", tone: "bg-bone text-ink", photo: "concrete" },
  { title: "Build", text: "Next.js, Tailwind and GSAP. One data file for the content, so edits are one line.", tone: "bg-smoke text-bone", photo: "rain-blue" },
  { title: "Tune", text: "Mobile first: images resized, video compressed, fonts preloaded, scores measured.", tone: "bg-coal text-bone", photo: "smoke-magenta" },
  { title: "Ship", text: "Deployed, handed over with docs, and ready for your agency's name on it.", tone: "bg-accent text-ink" },
];

export default function StackingCards() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-card]");
        items.forEach((item, i) => {
          const next = items[i + 1];
          if (!next) return;
          // The card underneath is driven by the card that arrives on top of it.
          const scrollTrigger = { trigger: next, start: "top 85%", end: "top 14%", scrub: true };
          gsap.to(item.querySelector("[data-inner]"), { scale: 0.93, ease: "none", scrollTrigger });
          gsap.to(item.querySelector("[data-veil]"), { opacity: 0.7, ease: "none", scrollTrigger });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-ink px-4 pb-[12svh] pt-8 sm:px-8">
      <div className="mx-auto max-w-[1500px]">
        {cards.map((c, i) => (
          <div key={c.title} data-card className="sticky mb-[16svh] last:mb-0" style={{ top: `calc(5.5rem + ${i} * 0.9rem)` }}>
            <article
              data-inner
              className={`relative grid h-[min(74svh,640px)] origin-top overflow-hidden rounded-[2rem] md:grid-cols-2 ${c.tone}`}
            >
              <div className="flex flex-col justify-between p-6 sm:p-10">
                <p className="eyebrow !text-current opacity-70">
                  Step {String(i + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="display text-[clamp(3.4rem,9vw,8.5rem)]">{c.title}</h3>
                  <p className="mt-4 max-w-sm text-[1.05rem] leading-relaxed opacity-90">{c.text}</p>
                </div>
              </div>
              <div className="relative order-first min-h-0 md:order-last">
                {c.photo ? (
                  <Pic slug={c.photo} alt="" sizes="(min-width: 768px) 50vw, 100vw" className="absolute inset-0 size-full object-cover" />
                ) : (
                  <AutoVideo slug="mist-forest" className="absolute inset-0 size-full object-cover" />
                )}
              </div>
              <span data-veil aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
