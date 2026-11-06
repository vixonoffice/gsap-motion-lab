import type { PhotoSlug } from "@/lib/media";

export type Effect = {
  slug: string;
  n: number;
  title: string;
  /** one line for the index cards */
  short: string;
  /** one paragraph under the page title */
  description: string;
  tags: string[];
  /** source files shown in "View code" (paths from the repo root) */
  files: string[];
  /** what to look at / how it works */
  notes: string[];
  thumb: PhotoSlug;
  /** bento placement on the index (desktop, 12-col grid) */
  span: string;
};

export const effects: Effect[] = [
  {
    slug: "text-reveal",
    n: 1,
    title: "Line text reveal",
    short: "Lines rise out of a mask. Words fill in as you scroll.",
    description:
      "Headlines split into masked lines with SplitText (free since GSAP 3.13) and rise when they enter the viewport. A second block fills word by word, tied to the scrollbar.",
    tags: ["SplitText", "ScrollTrigger", "mask"],
    files: ["src/effects/TextReveal.tsx"],
    notes: [
      "SplitText.create with autoSplit re-splits on resize and when the web font loads, and reverts the animation returned from onSplit.",
      'mask: "lines" wraps every line in an overflow-hidden box, so a line slides out from behind its own baseline.',
      "Everything lives inside gsap.matchMedia(). With prefers-reduced-motion the text is simply visible.",
    ],
    thumb: "smoke-violet",
    span: "md:col-start-1 md:row-start-1 md:col-span-7 md:row-span-2",
  },
  {
    slug: "video-hero",
    n: 2,
    title: "Video hero with mask reveal",
    short: "A pill of footage opens to full bleed.",
    description:
      "An autoplaying Pexels clip sits inside a clip-path mask that opens from a pill to full bleed while the video settles from 1.6x to 1x. Scroll closes it back into a rounded card.",
    tags: ["clip-path", "timeline", "scrub"],
    files: ["src/effects/VideoHero.tsx"],
    notes: [
      "clip-path animates on a wrapper, scale animates on the video inside it. Two layers, two easings.",
      "The scroll-out reuses the same element with a second ScrollTrigger (scrub) instead of a second copy.",
      "The video is muted, has no audio track and plays inline, so it starts on iPhone too.",
    ],
    thumb: "light-tunnel",
    span: "md:col-start-8 md:row-start-1 md:col-span-5",
  },
  {
    slug: "horizontal-scroll",
    n: 3,
    title: "Pinned horizontal scroll",
    short: "Vertical scroll drives a sideways track.",
    description:
      "A section pins to the viewport and the track slides sideways for exactly its own overflow width. Inner media drifts with containerAnimation for depth.",
    tags: ["pin", "scrub", "containerAnimation"],
    files: ["src/effects/HorizontalScroll.tsx"],
    notes: [
      "The distance is a function (scrollWidth - innerWidth) with invalidateOnRefresh, so resize and rotation stay correct.",
      "containerAnimation lets child tweens use the horizontal tween as their timeline.",
      "Reduced motion falls back to a native, snap-scrolling carousel.",
    ],
    thumb: "neon-street",
    span: "md:col-start-1 md:row-start-3 md:col-span-5 md:row-span-2",
  },
  {
    slug: "image-sequence",
    n: 4,
    title: "Image sequence and parallax layers",
    short: "A 72-frame canvas turn, scrubbed by scroll.",
    description:
      "72 WebP frames of a flower turning are drawn on a canvas, one frame per slice of scroll. Below it, layers with different speeds build depth out of plain images and type.",
    tags: ["canvas", "scrub", "parallax"],
    files: ["src/effects/ImageSequence.tsx", "src/effects/ParallaxLayers.tsx"],
    notes: [
      "Frames load when the section is 2.5 screens away, not on page load. Frame 1 is the canvas background, so it is never empty.",
      'gsap.to on a plain object with snap: "frame" gives integer frames, and onUpdate draws them.',
      "Parallax: every layer has a data-speed. Its extra travel is (speed - 1) x the scroll range, centred and scaled by a depth factor.",
    ],
    thumb: "smoke-red",
    span: "md:col-start-6 md:row-start-4 md:col-span-4",
  },
  {
    slug: "magnetic-cursor",
    n: 5,
    title: "Magnetic buttons and custom cursor",
    short: "Buttons lean toward you. The cursor knows what it is over.",
    description:
      "Buttons pull toward the pointer inside a radius and snap back with an elastic ease. A follower cursor grows and shows a label over anything marked data-cursor.",
    tags: ["quickTo", "pointer", "elastic"],
    files: ["src/effects/MagneticCursor.tsx"],
    notes: [
      "gsap.quickTo reuses one tween per property, so pointermove never creates new tweens.",
      "The cursor only exists on (hover: hover) and (pointer: fine). Touch devices get plain buttons.",
      "The label inside a magnet moves further than the button, for a layered feel.",
    ],
    thumb: "smoke-blue",
    span: "md:col-start-8 md:row-start-2 md:col-span-5",
  },
  {
    slug: "page-transitions",
    n: 6,
    title: "Page transitions",
    short: "Wipe, curtain or iris between routes. You are on it right now.",
    description:
      "A persistent overlay covers the page, the Next.js router swaps the route underneath, then the overlay lifts. Three variants. Every link between effect pages already uses it.",
    tags: ["App Router", "timeline", "clip-path"],
    files: ["src/components/PageTransition.tsx"],
    notes: [
      "The overlay lives in the layout, so it survives the route change. That is the whole trick.",
      "router.push fires when the page is fully covered. usePathname tells us when to lift.",
      "Modified clicks (cmd, ctrl, middle) and reduced motion skip the animation and navigate normally.",
    ],
    thumb: "glass-edge",
    span: "md:col-start-1 md:row-start-5 md:col-span-4 md:row-span-2",
  },
  {
    slug: "stacking-cards",
    n: 7,
    title: "Stacking cards",
    short: "Cards pile up and sink as the next one arrives.",
    description:
      "Plain CSS position: sticky does the stacking. GSAP only scrubs scale and a dark veil on the cards underneath, so there are no pin spacers to fight with.",
    tags: ["sticky", "scrub"],
    files: ["src/effects/StackingCards.tsx"],
    notes: [
      "No pin: sticky cards cannot break layout and keep working with Lenis.",
      "Each card is driven by the card after it (trigger: next card).",
      "The darkening is an opacity change on an overlay, not a filter, so it stays cheap on mobile.",
    ],
    thumb: "concrete",
    span: "md:col-start-6 md:row-start-3 md:col-span-7",
  },
  {
    slug: "velocity-marquee",
    n: 8,
    title: "Velocity marquee",
    short: "An endless marquee that reacts to scroll speed.",
    description:
      "Three rows loop forever. Scroll speed boosts them, scrolling up reverses them, and they ease back to a calm drift when you stop.",
    tags: ["ticker", "getVelocity", "xPercent"],
    files: ["src/effects/VelocityMarquee.tsx"],
    notes: [
      "Each row holds its content twice and animates xPercent from 0 to -50, so the loop is seamless at any width.",
      "ScrollTrigger.getVelocity feeds a small state object; the ticker applies it to every tween's timeScale.",
      "Reduced motion: rows stay still.",
    ],
    thumb: "smoke-magenta",
    span: "md:col-start-10 md:row-start-4 md:col-span-3",
  },
  {
    slug: "scroll-counters",
    n: 9,
    title: "Counters and progress",
    short: "Numbers count up. A ring fills with the scrollbar.",
    description:
      "Count-ups fire once when they enter. A sticky panel tracks scroll progress with a ring, a bar and a number, all written straight to the DOM with no React state.",
    tags: ["onUpdate", "progress", "snap"],
    files: ["src/effects/ScrollCounters.tsx"],
    notes: [
      "The stats are real facts about this repo.",
      "Progress is read from self.progress and written to textContent and strokeDashoffset. Zero re-renders.",
      "Reduced motion: final numbers are in the markup from the start.",
    ],
    thumb: "wisp",
    span: "md:col-start-1 md:row-start-7 md:col-span-12",
  },
  {
    slug: "flip-grid",
    n: 10,
    title: "Flip image grid",
    short: "Filter and feature images with the Flip plugin.",
    description:
      "Filters hide and show tiles, a click makes one tile the featured one. Flip records the state, you change the DOM, and Flip animates the difference.",
    tags: ["Flip", "filter", "layout"],
    files: ["src/effects/FlipGrid.tsx"],
    notes: [
      "Flip.getState, change the DOM, Flip.from. Nothing else to manage.",
      "absolute: true takes tiles out of flow while they animate, so leaving tiles do not push the rest around.",
      "onEnter and onLeave animate tiles that appear or disappear.",
    ],
    thumb: "dune-ripples",
    span: "md:col-start-5 md:row-start-5 md:col-span-4",
  },
  {
    slug: "smooth-scroll",
    n: 11,
    title: "Lenis with ScrollTrigger",
    short: "Smooth scroll wired into GSAP's ticker, the correct way.",
    description:
      "Lenis runs on GSAP's ticker, tells ScrollTrigger about every scroll, and lag smoothing is off. This whole site scrolls through it. Toggle it here and feel the difference.",
    tags: ["Lenis", "ticker", "ScrollTrigger.update"],
    files: ["src/components/SmoothScroll.tsx"],
    notes: [
      'lenis.on("scroll", ScrollTrigger.update) keeps pins and scrubs in sync with the smoothed position.',
      "gsap.ticker drives lenis.raf, so there is one animation loop instead of two. lagSmoothing(0) stops time jumps.",
      "Touch devices keep native scrolling (syncTouch is off), and Lenis honours prefers-reduced-motion.",
    ],
    thumb: "fog-ridge",
    span: "md:col-start-9 md:row-start-5 md:col-span-4",
  },
  {
    slug: "text-scramble",
    n: 12,
    title: "Text scramble and distortion",
    short: "Titles scramble into place and warp under the pointer.",
    description:
      "ScrambleTextPlugin (free since GSAP 3.13) resolves the title from random glyphs on hover, while an SVG displacement filter ripples the letterforms.",
    tags: ["ScrambleText", "SVG filter", "hover"],
    files: ["src/effects/TextScramble.tsx"],
    notes: [
      "The distortion is one feTurbulence plus one feDisplacementMap, and GSAP tweens its scale attribute.",
      "On touch screens there is no hover, so titles scramble when they enter the viewport instead.",
      "Reduced motion: titles stay as they are.",
    ],
    thumb: "alley-umbrella",
    span: "md:col-start-5 md:row-start-6 md:col-span-8",
  },
];

export const bySlug = (slug: string) => effects.find((e) => e.slug === slug)!;
export const neighbours = (slug: string) => {
  const i = effects.findIndex((e) => e.slug === slug);
  return { prev: effects[(i - 1 + effects.length) % effects.length], next: effects[(i + 1) % effects.length] };
};
