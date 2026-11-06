"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;
/** The running Lenis instance (null on touch devices with reduced motion, or before mount). */
export const getLenis = () => instance;

export default function SmoothScroll() {
  useEffect(() => {
    // Lenis honours prefers-reduced-motion on its own (respectReducedMotion: true).
    // Touch devices keep native scrolling (syncTouch defaults to false).
    const lenis = new Lenis({ lerp: 0.1, autoRaf: false });
    instance = lenis;

    // 1. every Lenis scroll tells ScrollTrigger to update
    lenis.on("scroll", ScrollTrigger.update);

    // 2. GSAP's ticker drives Lenis: one loop for everything
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);

    // 3. no lag smoothing, or the scroll position jumps after a slow frame
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
