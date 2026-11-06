# GSAP Motion Lab

**Twelve Awwwards-level GSAP effects. Each on its own page. The source one click away.**

Built with Next.js (App Router), TypeScript, Tailwind 4, GSAP 3.15 and Lenis, by [Vixon Lab](https://vixonlab.ro).

**Live demo:** https://vixon-vixon-gsap-motion-lab.vercel.app

No procedural 3D blobs. The motion comes from timing, type, real footage (Pexels) and the DOM, canvas and SVG.

## The effects

| # | Effect | What it shows | Demo |
|---|--------|---------------|------|
| 01 | Line text reveal | `SplitText` masked lines rise on scroll, words fill in with the scrollbar | [/effects/text-reveal](https://vixon-vixon-gsap-motion-lab.vercel.app/effects/text-reveal) |
| 02 | Video hero with mask reveal | Autoplaying clip opens from a pill to full bleed with `clip-path`, closes into a card on scroll | [/effects/video-hero](https://vixon-vixon-gsap-motion-lab.vercel.app/effects/video-hero) |
| 03 | Pinned horizontal scroll | Pinned section, sideways track, `containerAnimation` parallax inside panels | [/effects/horizontal-scroll](https://vixon-vixon-gsap-motion-lab.vercel.app/effects/horizontal-scroll) |
| 04 | Image sequence and parallax layers | 72 WebP frames scrubbed on a canvas, then layers with different speeds | [/effects/image-sequence](https://vixon-vixon-gsap-motion-lab.vercel.app/effects/image-sequence) |
| 05 | Magnetic buttons and custom cursor | `quickTo` pull with elastic release, labelled follower cursor (mouse only) | [/effects/magnetic-cursor](https://vixon-vixon-gsap-motion-lab.vercel.app/effects/magnetic-cursor) |
| 06 | Page transitions | Persistent overlay with wipe, curtain and iris variants on the App Router | [/effects/page-transitions](https://vixon-vixon-gsap-motion-lab.vercel.app/effects/page-transitions) |
| 07 | Stacking cards | CSS `position: sticky` stacking, GSAP scrubs scale and a veil | [/effects/stacking-cards](https://vixon-vixon-gsap-motion-lab.vercel.app/effects/stacking-cards) |
| 08 | Velocity marquee | Infinite rows driven by `ScrollTrigger.getVelocity`, reverse on scroll up | [/effects/velocity-marquee](https://vixon-vixon-gsap-motion-lab.vercel.app/effects/velocity-marquee) |
| 09 | Counters and progress | Count-ups on enter, ring + bar + number written straight to the DOM | [/effects/scroll-counters](https://vixon-vixon-gsap-motion-lab.vercel.app/effects/scroll-counters) |
| 10 | Flip image grid | `Flip` plugin: filter and feature tiles | [/effects/flip-grid](https://vixon-vixon-gsap-motion-lab.vercel.app/effects/flip-grid) |
| 11 | Lenis with ScrollTrigger | Smooth scroll on GSAP's ticker, `ScrollTrigger.update`, `lagSmoothing(0)` | [/effects/smooth-scroll](https://vixon-vixon-gsap-motion-lab.vercel.app/effects/smooth-scroll) |
| 12 | Text scramble and distortion | `ScrambleTextPlugin` plus an SVG displacement filter | [/effects/text-scramble](https://vixon-vixon-gsap-motion-lab.vercel.app/effects/text-scramble) |

Every effect page has a **View code** button that opens the exact file that runs the demo (syntax highlighted at build time, with a copy button).

## Built to be copied, and to survive a phone

- **`prefers-reduced-motion` is a first-class path.** Every effect runs inside `gsap.matchMedia()` and has a calm fallback. Nothing is hidden behind an animation. Text that scripts split uses a CSS failsafe so it can never stay invisible.
- **Mobile first.** Touch devices keep native scrolling (Lenis `syncTouch` is off), the custom cursor only exists for `(hover: hover) and (pointer: fine)`, and the index page ships no animation library at all.
- **Index page is CSS-only motion** (`animation-timeline: view()`), so GSAP and Lenis only load on effect pages.
- **Videos always autoplay**: muted, inline, no audio track, with an iOS touch/scroll retry.
- **Immutable cache.** Media files carry a version in the name (`ink-red-v1.mp4`) and are served with `max-age=31536000, immutable`. Never replace a file under the same name, ship a new version.

## Stack

- Next.js 16 (App Router, fully static), React 19, TypeScript
- Tailwind CSS 4 (`@theme`, HEX tokens)
- GSAP 3.15 with `ScrollTrigger`, `SplitText`, `Flip`, `ScrambleTextPlugin` (all free since 3.13) and `@gsap/react`
- Lenis for smooth scrolling
- Media from [Pexels](https://www.pexels.com): 4 clips (720p H.264, 0.7 to 1.6 MB, no audio) and 17 photos (WebP at 640 and 1280 px)

## How to run

```bash
git clone https://github.com/vixonoffice/gsap-motion-lab.git
cd gsap-motion-lab
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start     # production build
node scripts/smoke.mjs http://localhost:3000   # opens every page on phone + desktop, fails on console errors or overflow
```

The processed media is committed, so you do not need an API key. To swap the media, add your own `PEXELS_API_KEY` to the environment and run `npm run media` (see `scripts/fetch-media.mjs`, bump `VERSION` when you re-encode).

## Project layout

```
src/
  app/                 routes: / , /credits , /effects/<slug> (one page per effect)
  effects/             the 12 effect components (what "View code" shows)
  components/          SmoothScroll, PageTransition, EffectShell, CodeViewer, AutoVideo, Pic
  data/effects.ts      titles, copy, notes, bento placement
  lib/highlight.ts     tiny build-time TS/TSX highlighter
public/media/          versioned, compressed Pexels media
scripts/               fetch-media, smoke test, README captures
```

## Built by Vixon Lab - white-label web development for agencies

We build fast, animated, accessible websites for agencies that need a reliable development partner, under your brand.

- Website: [vixonlab.ro](https://vixonlab.ro)
- LinkedIn: [Iulian Vladutoiu](https://www.linkedin.com/in/iulian-vladutoiu-bb9660449/)

## Credits and license

Code: [MIT](LICENSE).

Photos and videos are from [Pexels](https://www.pexels.com) and stay under the [Pexels License](https://www.pexels.com/license/). Every creator is listed on the [credits page](https://vixon-vixon-gsap-motion-lab.vercel.app/credits).
