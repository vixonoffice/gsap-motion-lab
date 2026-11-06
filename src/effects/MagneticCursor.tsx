"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Pic from "@/components/Pic";

gsap.registerPlugin(useGSAP);

export default function MagneticCursor() {
  const stage = useRef<HTMLElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Mouse-like pointers only. Touch devices keep plain buttons.
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const el = stage.current!;
        const off: Array<() => void> = [];
        const on = (t: EventTarget, type: string, fn: (e: PointerEvent) => void) => {
          t.addEventListener(type, fn as EventListener);
          off.push(() => t.removeEventListener(type, fn as EventListener));
        };

        // --- custom cursor: one quickTo per axis, so pointermove never creates tweens
        el.dataset.cursor = "on";
        gsap.set(ring.current, { xPercent: -50, yPercent: -50 });
        const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
        const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
        on(el, "pointermove", (e) => {
          rx(e.clientX);
          ry(e.clientY);
        });
        on(el, "pointerenter", () => gsap.to(ring.current, { opacity: 1, scale: 1, duration: 0.3 }));
        on(el, "pointerleave", () => gsap.to(ring.current, { opacity: 0, scale: 0.4, duration: 0.3 }));
        on(el, "pointerover", (e) => {
          const target = (e.target as HTMLElement).closest<HTMLElement>("[data-label]");
          label.current!.textContent = target?.dataset.label ?? "";
          gsap.to(ring.current, { scale: target ? 2.8 : 1, duration: 0.5, ease: "expo.out" });
        });

        // --- magnetic buttons
        el.querySelectorAll<HTMLElement>("[data-magnet]").forEach((btn) => {
          const pull = parseFloat(btn.dataset.magnet!);
          const inner = btn.querySelector<HTMLElement>("[data-inner]");
          const opts = { duration: 1, ease: "elastic.out(1, 0.35)" };
          const bx = gsap.quickTo(btn, "x", opts);
          const by = gsap.quickTo(btn, "y", opts);
          const ix = inner ? gsap.quickTo(inner, "x", opts) : () => {};
          const iy = inner ? gsap.quickTo(inner, "y", opts) : () => {};

          on(btn, "pointermove", (e) => {
            const r = btn.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            bx(dx * pull);
            by(dy * pull);
            ix(dx * pull * 0.5); // the label travels further than the button
            iy(dy * pull * 0.5);
          });
          on(btn, "pointerleave", () => {
            bx(0);
            by(0);
            ix(0);
            iy(0);
          });
        });

        return () => {
          off.forEach((fn) => fn());
          delete el.dataset.cursor;
        };
      });
    },
    { scope: stage },
  );

  return (
    <section ref={stage} className="relative overflow-hidden bg-coal px-4 py-24 data-[cursor=on]:cursor-none sm:px-8 sm:py-36">
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] grid size-10 place-items-center rounded-full bg-accent opacity-0 [@media(hover:none)]:hidden"
      >
        <span ref={label} className="text-[0.32rem] font-bold uppercase tracking-wider text-ink" />
      </div>

      <div className="mx-auto max-w-[1500px]">
        <p className="eyebrow">Move your mouse here</p>
        <p className="mt-3 hidden max-w-sm text-sm text-accent-soft [@media(hover:none)]:block">
          This is a touch screen, so the buttons stay put. Open the page with a mouse to feel the pull.
        </p>

        <div className="mt-16 grid items-center justify-items-center gap-14 md:grid-cols-3">
          <button
            type="button"
            data-magnet="0.45"
            data-label="Click"
            className="grid size-56 place-items-center rounded-full bg-accent text-ink sm:size-64"
          >
            <span data-inner className="display text-[2.4rem] leading-none">
              Drag
              <br />
              me
            </span>
          </button>

          <button
            type="button"
            data-magnet="0.35"
            data-label="Go"
            className="btn btn-ghost h-20 px-10 text-lg"
          >
            <span data-inner>Start a project</span>
          </button>

          <a
            href="#tiles"
            data-magnet="0.6"
            data-label="Down"
            aria-label="Scroll to the tiles"
            className="grid size-24 place-items-center rounded-full border border-line text-3xl"
          >
            <span data-inner aria-hidden="true">
              &darr;
            </span>
          </a>
        </div>

        <div id="tiles" className="mt-28 grid gap-4 md:grid-cols-3">
          {(
            [
              ["smoke-blue", "Hover a tile", "View"],
              ["dune-ripples", "The cursor grows", "Open"],
              ["alley-umbrella", "and reads a label", "Play"],
            ] as const
          ).map(([slug, text, cursor]) => (
            <figure key={slug} data-label={cursor} className="relative overflow-hidden rounded-3xl">
              <Pic slug={slug} alt="" sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/5] w-full object-cover" />
              <figcaption className="absolute bottom-5 left-5 display text-2xl">{text}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
