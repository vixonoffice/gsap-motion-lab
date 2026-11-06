"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AutoVideo from "@/components/AutoVideo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function VideoHero() {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 768px)", motion: "(prefers-reduced-motion: no-preference)" },
        (ctx) => {
          if (!ctx.conditions!.motion) return; // static, full-bleed hero

          const pill = ctx.conditions!.desktop ? "inset(34% 36% 34% 36% round 999px)" : "inset(31% 10% 31% 10% round 999px)";

          // Intro: the mask opens while the video settles from 1.6x to 1x.
          intro.current = gsap
            .timeline({ paused: true })
            .fromTo("[data-mask]", { clipPath: pill }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.7, ease: "expo.inOut" })
            .fromTo("[data-video]", { scale: 1.6 }, { scale: 1, duration: 2.2, ease: "expo.out" }, 0)
            .from("[data-line]", { yPercent: 115, duration: 1.1, ease: "expo.out", stagger: 0.1 }, 0.9)
            .from("[data-meta]", { opacity: 0, y: 16, duration: 0.8, ease: "power3.out", stagger: 0.1 }, 1.5);

          ScrollTrigger.create({ trigger: root.current, start: "top 55%", once: true, onEnter: () => intro.current?.play() });

          // Outro: scrolling past closes the hero into a rounded card (a second mask, so the two never fight).
          gsap.to("[data-card]", {
            clipPath: "inset(7% 5% 7% 5% round 32px)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to("[data-video]", {
            yPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-svh min-h-[560px] bg-bone">
      <div data-card className="absolute inset-0 overflow-hidden bg-ink">
        <div data-mask className="absolute inset-0 overflow-hidden">
          <div data-video className="absolute inset-0">
            <AutoVideo slug="waves-teal" className="size-full object-cover" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/80 to-transparent" />
        </div>
      </div>

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-end gap-8 px-4 pb-14 sm:px-8 sm:pb-20">
        <h2 className="display text-[clamp(3.2rem,12.5vw,13rem)] leading-[0.92]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-line className="block">
              Open on
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-line className="block text-accent">
              the sea.
            </span>
          </span>
        </h2>
        <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-4">
          <p data-meta className="eyebrow !text-bone">
            Pexels / Tom Fisk
          </p>
          <button data-meta type="button" className="btn btn-ghost bg-ink/40" onClick={() => intro.current?.restart()}>
            Replay intro
          </button>
        </div>
      </div>
    </section>
  );
}
