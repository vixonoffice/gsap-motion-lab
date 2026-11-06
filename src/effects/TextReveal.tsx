"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function TextReveal() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Text is visible unless a script hides it, so reduced motion needs no code path.
      gsap.set(".pre-split", { visibility: "visible" });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Lines rise out of their own mask when they enter the viewport.
        gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true, // re-split on resize and when the font finishes loading
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.09,
                scrollTrigger: { trigger: el, start: "top 85%" },
              }),
          });
        });

        // 2. Words fill in with the scrollbar.
        const fill = root.current!.querySelector<HTMLElement>("[data-fill]")!;
        SplitText.create(fill, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.14 },
              {
                opacity: 1,
                stagger: 0.12,
                ease: "none",
                scrollTrigger: { trigger: fill, start: "top 78%", end: "bottom 45%", scrub: true },
              },
            ),
        });

        // 3. Rules draw themselves.
        gsap.from("[data-rule]", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.15,
          scrollTrigger: { trigger: "[data-rule]", start: "top 88%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section className="bg-ink px-4 py-24 sm:px-8 sm:py-40">
        <p
          data-lines
          className="pre-split display mx-auto max-w-[1500px] text-[clamp(2.2rem,7vw,6.6rem)] leading-[1.04]"
        >
          Motion is not decoration. It is the part of the interface that explains what just happened.
        </p>
      </section>

      <section className="bg-bone px-4 py-24 text-ink sm:px-8 sm:py-44">
        <div className="mx-auto max-w-[1500px]">
          <p className="eyebrow !text-ink/60">Scroll slowly</p>
          <p
            data-fill
            className="display mt-8 max-w-[22ch] text-[clamp(2.4rem,8vw,7.4rem)] leading-[1.02] sm:max-w-[18ch]"
          >
            Every word here lights up exactly as fast as your thumb moves.
          </p>
        </div>
      </section>

      <section className="bg-ink px-4 py-24 sm:px-8 sm:py-40">
        <div className="mx-auto grid max-w-[1500px] gap-16 md:grid-cols-3">
          {[
            ["Split", "Lines, words or characters, measured after the font has loaded."],
            ["Mask", "Each line gets its own overflow box, so type slides out from behind a baseline."],
            ["Revert", "Resize the window: the split is rebuilt and the animation replays cleanly."],
          ].map(([title, text]) => (
            <div key={title}>
              <div data-rule className="mb-6 h-px bg-bone/40" />
              <h3 data-lines className="pre-split display text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05]">
                {title}
              </h3>
              <p data-lines className="pre-split mt-4 max-w-sm text-[1.05rem] leading-relaxed text-mute">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
