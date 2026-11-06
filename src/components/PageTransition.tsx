"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ComponentProps, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

export type Variant = "wipe" | "curtain" | "iris";
type Go = (href: string, opts?: { variant?: Variant; label?: string; origin?: [number, number] }) => void;

const COLS = 5;
const Ctx = createContext<Go | null>(null);

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const cols = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const job = useRef({ busy: false, variant: "wipe" as Variant, origin: [0, 0] as [number, number], from: pathname });

  const reveal = useCallback(() => {
    const { variant, origin } = job.current;
    const [x, y] = origin;
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(root.current, { visibility: "hidden", pointerEvents: "none" });
        job.current.busy = false;
      },
    });
    tl.to(label.current, { yPercent: -100, opacity: 0, duration: 0.35, ease: "expo.in" });
    if (variant === "wipe") tl.to(panel.current, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, 0.1);
    if (variant === "curtain")
      tl.to(cols.current!.children, { scaleY: 0, transformOrigin: "top", duration: 0.7, ease: "expo.inOut", stagger: { each: 0.06, from: "edges" } }, 0.1);
    if (variant === "iris")
      tl.to(panel.current, { clipPath: `circle(0px at ${x}px ${y}px)`, duration: 0.8, ease: "power3.inOut" }, 0.1);
  }, []);

  const go = useCallback<Go>(
    (href, { variant = "wipe", label: text = "", origin = [innerWidth / 2, innerHeight / 2] as [number, number] } = {}) => {
      const j = job.current;
      if (j.busy || href === pathname) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return router.push(href);

      j.busy = true;
      j.variant = variant;
      j.origin = origin;
      j.from = pathname;
      const [x, y] = origin;
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 2;

      label.current!.textContent = text;
      gsap.set(root.current, { visibility: "visible", pointerEvents: "auto" });
      gsap.set(panel.current, { display: variant === "curtain" ? "none" : "block" });
      gsap.set(cols.current, { display: variant === "curtain" ? "block" : "none" });

      const tl = gsap.timeline({ onComplete: () => router.push(href) });
      if (variant === "wipe") tl.fromTo(panel.current, { yPercent: 100, clipPath: "none" }, { yPercent: 0, duration: 0.8, ease: "expo.inOut" });
      if (variant === "curtain")
        tl.fromTo(cols.current!.children, { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 0.7, ease: "expo.inOut", stagger: { each: 0.06, from: "center" } });
      if (variant === "iris")
        tl.fromTo(panel.current, { yPercent: 0, clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${r}px at ${x}px ${y}px)`, duration: 0.9, ease: "power3.inOut" });
      tl.fromTo(label.current, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, "-=0.35");

      // safety net: never leave the overlay up if the route does not change
      gsap.delayedCall(5, () => j.busy && j.from === pathname && reveal());
    },
    [pathname, reveal, router],
  );

  // The route changed underneath the overlay: lift it.
  useEffect(() => {
    const j = job.current;
    if (!j.busy || pathname === j.from) return;
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => requestAnimationFrame(reveal));
    return () => cancelAnimationFrame(id);
  }, [pathname, reveal]);

  return (
    <Ctx.Provider value={go}>
      {children}
      <div ref={root} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[90] overflow-hidden">
        <div ref={panel} className="absolute inset-0 bg-accent" />
        <div ref={cols} className="absolute inset-0 hidden">
          {Array.from({ length: COLS }, (_, i) => (
            <div key={i} className="absolute inset-y-0 bg-accent" style={{ left: `${(i * 100) / COLS}%`, width: `calc(${100 / COLS}% + 1px)` }} />
          ))}
        </div>
        <div className="absolute inset-0 grid place-items-center overflow-hidden px-6">
          <p ref={label} className="display text-center text-[clamp(2.2rem,8vw,7rem)] text-ink" />
        </div>
      </div>
    </Ctx.Provider>
  );
}

type LinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string; variant?: Variant; label?: string };

/** Drop-in replacement for next/link that plays the transition first. */
export function TransitionLink({ href, variant, label, onClick, ...props }: LinkProps) {
  const go = useContext(Ctx);
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (!go || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    let { clientX: x, clientY: y } = e;
    if (!x && !y) {
      const b = e.currentTarget.getBoundingClientRect(); // keyboard activation
      x = b.left + b.width / 2;
      y = b.top + b.height / 2;
    }
    go(href, { variant, label, origin: [x, y] });
  };
  return <Link href={href} onClick={handle} {...props} />;
}
