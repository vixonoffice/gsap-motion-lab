"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Pic from "@/components/Pic";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const words = ["Motion design", "Creative code", "Next.js", "GSAP"];

function Half({ children }: { children: React.ReactNode }) {
  // each half is wider than any screen, so the loop never shows a gap
  return <div className="flex shrink-0 items-center gap-8 pr-8">{children}{children}{children}</div>;
}

export default function VelocityMarquee() {
  const root = useRef<HTMLElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
        const dirs = rows.map((r) => (r.dataset.row === "left" ? -1 : 1));

        // Each row holds its content twice: moving it by exactly half its width is a seamless loop.
        const tweens = rows.map((row, i) =>
          gsap.fromTo(row, { xPercent: dirs[i] < 0 ? 0 : -50 }, { xPercent: dirs[i] < 0 ? -50 : 0, duration: 36, ease: "none", repeat: -1 }),
        );

        // One small state object. Scroll feeds it, the ticker applies it.
        const state = { boost: 1, dir: 1 };
        const scroll = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            gsap.to(state, {
              boost: 1 + Math.min(Math.abs(self.getVelocity()) / 180, 14),
              dir: self.direction, // scrolling up reverses the rows, passing through a stop
              duration: 0.5,
              ease: "power2.out",
              overwrite: true,
            });
          },
        });
        const settle = () => gsap.to(state, { boost: 1, duration: 1.4, ease: "power3.out", overwrite: true });
        ScrollTrigger.addEventListener("scrollEnd", settle);

        const tick = () => {
          tweens.forEach((t) => t.timeScale(state.dir * state.boost));
          if (readout.current) readout.current.textContent = (state.boost * state.dir).toFixed(1);
        };
        gsap.ticker.add(tick);

        return () => {
          gsap.ticker.remove(tick);
          ScrollTrigger.removeEventListener("scrollEnd", settle);
          scroll.kill();
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[230svh] bg-ink">
      <div className="sticky top-0 flex h-svh flex-col justify-center gap-5 overflow-hidden sm:gap-8">
        <p className="eyebrow px-4 sm:px-8">
          Scroll speed x <span ref={readout}>1.0</span>
        </p>

        <div data-row="left" className="flex w-max whitespace-nowrap will-change-transform">
          {[0, 1].map((k) => (
            <Half key={k}>
              {words.map((w) => (
                <span key={w + k} aria-hidden={k === 1} className="display flex items-center gap-8 text-[clamp(4.5rem,15vw,15rem)]">
                  {w} <span className="text-accent">/</span>
                </span>
              ))}
            </Half>
          ))}
        </div>

        <div data-row="right" aria-hidden="true" className="flex w-max whitespace-nowrap will-change-transform">
          {[0, 1].map((k) => (
            <Half key={k}>
              {["Scroll faster", "Scroll back", "Slow down"].map((w) => (
                <span key={w + k} className="outline-text display flex items-center gap-8 text-[clamp(4.5rem,15vw,15rem)]">
                  {w} <span className="text-accent">*</span>
                </span>
              ))}
            </Half>
          ))}
        </div>

        <div data-row="left" aria-hidden="true" className="flex w-max whitespace-nowrap will-change-transform">
          {[0, 1].map((k) => (
            <Half key={k}>
              {(["smoke-violet", "light-tunnel", "dune-ripples", "glass-edge"] as const).map((slug) => (
                <span key={slug + k} className="flex items-center gap-8">
                  <Pic slug={slug} alt="" sizes="30vw" className="h-[clamp(5rem,13vw,12rem)] w-[clamp(9rem,24vw,22rem)] rounded-full object-cover" />
                  <span className="display text-[clamp(2.5rem,7vw,7rem)] text-accent">+</span>
                </span>
              ))}
            </Half>
          ))}
        </div>
      </div>
    </section>
  );
}
