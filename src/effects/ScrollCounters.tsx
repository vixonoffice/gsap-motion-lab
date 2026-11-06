"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const RADIUS = 118;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Real facts about this repo. `from` is where the count starts.
const stats = [
  { to: 12, from: 0, label: "effects, one page each" },
  { to: 72, from: 0, label: "frames in the canvas sequence" },
  { to: 4, from: 0, label: "Pexels clips, 720p H.264" },
  { to: 0, from: 30, label: "procedural 3D shapes" },
];

const stages = ["Warming up", "Getting going", "Halfway there", "Almost", "Done"];

export default function ScrollCounters() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Count-ups: one tween per number, fired once when it enters.
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const to = Number(el.dataset.to);
          const counter = { value: Number(el.dataset.from) };
          el.textContent = String(counter.value);
          gsap.to(counter, {
            value: to,
            duration: 2.2,
            ease: "power3.out",
            snap: { value: 1 },
            onUpdate: () => (el.textContent = String(counter.value)),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // 2. Progress: read self.progress, write straight to the DOM. No React state, no re-render.
        const ring = root.current!.querySelector<SVGCircleElement>("[data-ring]")!;
        const num = root.current!.querySelector<HTMLElement>("[data-num]")!;
        const bar = root.current!.querySelector<HTMLElement>("[data-bar]")!;
        const stage = root.current!.querySelector<HTMLElement>("[data-stage]")!;
        ScrollTrigger.create({
          trigger: "[data-panel]",
          start: "top top",
          end: "bottom bottom",
          onUpdate: ({ progress }) => {
            ring.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
            num.textContent = String(Math.round(progress * 100)).padStart(3, "0");
            bar.style.transform = `scaleX(${progress})`;
            stage.textContent = stages[Math.min(stages.length - 1, Math.floor(progress * stages.length))];
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root}>
      <div className="bg-ink px-4 py-24 sm:px-8 sm:py-36">
        <div className="mx-auto grid max-w-[1500px] gap-x-8 gap-y-14 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-line pt-5">
              <p
                data-count
                data-to={s.to}
                data-from={s.from}
                className="display text-[clamp(4.5rem,11vw,10rem)] tabular-nums text-bone"
              >
                {s.to}
              </p>
              <p className="mt-3 max-w-[16rem] text-mute">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div data-panel className="relative h-[320svh] bg-accent text-ink">
        <div className="sticky top-0 grid h-svh content-center justify-items-center gap-10 px-4 sm:px-8 md:grid-cols-2 md:justify-items-start md:gap-0">
          <div className="relative size-[min(72vw,52svh)] md:ml-[8vw] md:size-[min(36vw,64svh)]">
            <svg viewBox="0 0 260 260" className="size-full -rotate-90" role="img" aria-label="Scroll progress ring">
              <circle cx="130" cy="130" r={RADIUS} fill="none" stroke="#0a0908" strokeOpacity="0.18" strokeWidth="6" />
              <circle
                data-ring
                cx="130"
                cy="130"
                r={RADIUS}
                fill="none"
                stroke="#0a0908"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE}
              />
            </svg>
            <p data-num className="display absolute inset-0 grid place-items-center text-[clamp(4rem,12vw,9rem)] tabular-nums">
              000
            </p>
          </div>

          <div className="w-full max-w-md md:max-w-xl md:pr-[8vw]">
            <p className="eyebrow !text-ink">Scroll progress</p>
            <p data-stage className="display mt-4 text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.98]">
              Warming up
            </p>
            <div className="mt-8 h-1.5 w-full bg-ink/20">
              <div data-bar className="h-full origin-left scale-x-0 bg-ink" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
