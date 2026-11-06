"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin);

const titles = [
  ["Brand film", "Motion"],
  ["Product page", "Web"],
  ["Launch site", "Web"],
  ["Case study", "Story"],
  ["Pitch deck", "Print"],
];

export default function TextScramble() {
  const root = useRef<HTMLElement>(null);

  const { contextSafe } = useGSAP({ scope: root });

  const play = contextSafe((el: HTMLElement) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 1. glyphs resolve from noise
    gsap.to(el.querySelector("[data-text]"), {
      duration: 1,
      ease: "none",
      scrambleText: { text: el.dataset.title!, chars: "!<>-_/[]{}=+*^?#abcxyz", revealDelay: 0.15, speed: 0.7 },
    });

    // 2. an SVG displacement filter ripples the letterforms, only while it runs
    el.style.filter = "url(#vx-warp)";
    gsap.fromTo(
      "#vx-warp-map",
      { attr: { scale: 0 } },
      { attr: { scale: 38 }, duration: 0.3, yoyo: true, repeat: 1, ease: "sine.inOut", onComplete: () => (el.style.filter = "") },
    );
  });

  useGSAP(
    () => {
      // Touch screens have no hover: scramble when a title scrolls into view instead.
      gsap.matchMedia().add("(hover: none)", () => {
        gsap.utils.toArray<HTMLElement>("[data-title]").forEach((el) => {
          ScrollTrigger.create({ trigger: el, start: "top 80%", once: true, onEnter: () => play(el) });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-bone px-4 py-24 text-ink sm:px-8 sm:py-40">
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <filter id="vx-warp" x="-5%" y="-30%" width="110%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.09" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap id="vx-warp-map" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="mx-auto max-w-[1500px]">
        <p className="eyebrow !text-ink/60">Hover, tap or focus a title</p>
        <ul className="mt-10 border-b border-ink/20">
          {titles.map(([title, kind], i) => (
            <li key={title} className="border-t border-ink/20">
              <button
                type="button"
                data-title={title}
                onPointerEnter={(e) => e.pointerType === "mouse" && play(e.currentTarget)}
                onFocus={(e) => play(e.currentTarget)}
                onClick={(e) => play(e.currentTarget)}
                className="group flex w-full items-baseline justify-between gap-4 py-5 text-left transition-colors hover:text-accent sm:py-7"
              >
                <span className="flex items-baseline gap-4 sm:gap-8">
                  <span className="font-mono text-xs text-ink/50 sm:text-sm">{String(i + 1).padStart(2, "0")}</span>
                  <span data-text className="display text-[clamp(2.6rem,9vw,8.4rem)] leading-[0.95]">
                    {title}
                  </span>
                </span>
                <span className="eyebrow !text-ink/60">{kind}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
