"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/components/SmoothScroll";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Live readout of the Lenis instance that already runs this whole site (see SmoothScroll.tsx). */
export default function SmoothScrollDemo() {
  const root = useRef<HTMLElement>(null);
  const y = useRef<HTMLSpanElement>(null);
  const v = useRef<HTMLSpanElement>(null);
  const p = useRef<HTMLSpanElement>(null);
  const [smooth, setSmooth] = useState(true);

  useEffect(() => {
    let off = () => {};
    let frame = 0;
    const attach = () => {
      const lenis = getLenis();
      if (!lenis) {
        frame = requestAnimationFrame(attach);
        return;
      }
      const onScroll = () => {
        y.current!.textContent = String(Math.round(lenis.scroll));
        v.current!.textContent = lenis.velocity.toFixed(1);
        p.current!.textContent = String(Math.round(lenis.progress * 100));
      };
      lenis.on("scroll", onScroll);
      onScroll();
      off = () => lenis.off("scroll", onScroll);
    };
    attach();
    return () => {
      cancelAnimationFrame(frame);
      off();
    };
  }, []);

  // Scrubs follow the smoothed position because Lenis calls ScrollTrigger.update on every frame.
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const scrollTrigger = { trigger: "[data-stage]", start: "top top", end: "bottom bottom", scrub: true };
        gsap.fromTo("[data-a]", { xPercent: 30 }, { xPercent: -45, ease: "none", scrollTrigger });
        gsap.fromTo("[data-b]", { xPercent: -45 }, { xPercent: 30, ease: "none", scrollTrigger });
      });
    },
    { scope: root },
  );

  const toggle = () => {
    const lenis = getLenis();
    if (!lenis) return;
    const next = !smooth;
    lenis.options.smoothWheel = next; // native wheel scrolling when off
    setSmooth(next);
  };

  return (
    <section ref={root}>
      <div data-stage className="relative h-[260svh] bg-ink">
        <div className="sticky top-0 flex h-svh flex-col justify-between overflow-hidden py-24 sm:py-28">
          <div className="flex flex-wrap items-center gap-3 px-4 sm:px-8">
            <button type="button" onClick={toggle} aria-pressed={smooth} className="btn btn-primary">
              Smooth wheel: {smooth ? "on" : "off"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => getLenis()?.scrollTo("#smooth-end", { duration: 2 })}>
              Glide to the end
            </button>
          </div>

          <div className="whitespace-nowrap">
            <p data-a className="display text-[clamp(5rem,20vw,20rem)]">SMOOTH</p>
            <p data-b className="outline-text display text-[clamp(5rem,20vw,20rem)]">SCROLL</p>
          </div>

          <dl className="grid grid-cols-3 gap-4 px-4 font-mono text-[0.8rem] sm:px-8 sm:text-sm">
            {[
              ["scroll", y, "px"],
              ["velocity", v, "px/frame"],
              ["progress", p, "%"],
            ].map(([label, ref, unit]) => (
              <div key={String(label)} className="border-t border-line pt-3">
                <dt className="eyebrow">{String(label)}</dt>
                <dd className="mt-1 text-[1.4rem] text-bone sm:text-[2rem]">
                  <span ref={ref as React.RefObject<HTMLSpanElement>}>0</span>
                  <span className="ml-1 text-[0.7rem] text-mute">{String(unit)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div id="smooth-end" className="bg-bone px-4 py-24 text-ink sm:px-8 sm:py-36">
        <p className="display mx-auto max-w-[1500px] text-[clamp(2.4rem,7vw,6.6rem)]">You arrived. The pins above never lost their place.</p>
      </div>
    </section>
  );
}
