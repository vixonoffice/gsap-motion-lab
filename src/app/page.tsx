import Link from "next/link";
import { preload } from "react-dom";
import AutoVideo from "@/components/AutoVideo";
import Pic from "@/components/Pic";
import SiteHeader from "@/components/SiteHeader";
import { REPO } from "@/components/Footer";
import { effects } from "@/data/effects";
import { video } from "@/lib/media";

const pad = (n: number) => String(n).padStart(2, "0");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "GSAP Motion Lab",
      url: "https://vixon-vixon-gsap-motion-lab.vercel.app",
      description: "Twelve GSAP animation effects, each on its own page with the source code.",
      publisher: { "@id": "https://vixonlab.ro/#org" },
    },
    {
      "@type": "Organization",
      "@id": "https://vixonlab.ro/#org",
      name: "Vixon Lab",
      url: "https://vixonlab.ro",
      sameAs: ["https://www.linkedin.com/in/iulian-vladutoiu-bb9660449/", "https://github.com/vixonoffice"],
    },
  ],
};

export default function Home() {
  preload(video("ink-red").poster, { as: "image", fetchPriority: "high" });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main id="main">
        {/* HERO */}
        <section className="px-4 pb-12 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
          <div className="mx-auto grid max-w-[1500px] gap-10 md:grid-cols-12 md:gap-8">
            <div className="flex flex-col justify-between gap-10 md:col-span-7 md:min-h-[min(78svh,760px)]">
              <p className="eyebrow rise-in">12 GSAP effects / by Vixon Lab</p>
              <h1 className="display text-[clamp(3.9rem,11.4vw,11.6rem)]">
                Motion
                <br />
                you can
                <br />
                <span className="text-accent">read.</span>
              </h1>
              <div className="rise-in flex flex-col gap-7 [animation-delay:150ms]">
                <p className="max-w-md text-[1.1rem] leading-relaxed text-mute sm:text-[1.2rem]">
                  Twelve effects, each on its own page, each with the source one click away. Next.js, GSAP, no 3D blobs.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="#effects" className="btn btn-primary">
                    See the effects
                  </a>
                  <a href={REPO} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    Source on GitHub
                  </a>
                </div>
              </div>
            </div>

            <div className="rise-in relative min-h-[26rem] overflow-hidden rounded-[2rem] bg-coal [animation-delay:250ms] md:col-span-5 md:min-h-0">
              <AutoVideo slug="ink-red" className="absolute inset-0 size-full object-cover" />
              <p className="eyebrow absolute bottom-4 left-5 !text-bone">Ink, slow motion / Pexels</p>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div aria-hidden="true" className="overflow-hidden bg-bone py-4 text-ink">
          <div className="ticker-track">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center gap-8 pr-8">
                {effects.map((e) => (
                  <span key={e.slug} className="display flex items-center gap-8 whitespace-nowrap text-[clamp(1.6rem,3.4vw,3rem)] leading-none">
                    {e.title} <span className="text-accent">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* BENTO */}
        <section id="effects" className="scroll-mt-4 px-4 py-20 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 md:flex-row md:items-end">
              <h2 className="display max-w-[14ch] text-[clamp(2.6rem,7vw,6.4rem)]">Twelve effects. One click to the code.</h2>
              <p className="max-w-xs text-mute">Open any effect, hit View code, copy what you need. Every file is the one that runs.</p>
            </div>

            <ul className="grid gap-3 sm:gap-4 md:grid-flow-row md:grid-cols-12 md:auto-rows-[minmax(190px,15.4vw)]">
              {effects.map((e) => {
                const big = /row-span-2|col-span-7|col-span-8|col-span-12/.test(e.span);
                return (
                  <li key={e.slug} className={`scroll-rise min-h-[19rem] ${big ? "min-h-[26rem]" : ""} md:min-h-0 ${e.span}`}>
                    <Link
                      href={`/effects/${e.slug}`}
                      className="group relative isolate flex size-full overflow-hidden rounded-[1.75rem] bg-coal"
                    >
                      <Pic
                        slug={e.thumb}
                        alt=""
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] ease-expo group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
                      <div className="relative z-10 flex size-full flex-col justify-between p-5 sm:p-7">
                        <div className="flex items-start justify-between">
                          <span className="font-mono text-sm">{pad(e.n)}</span>
                          <span
                            aria-hidden="true"
                            className="grid size-10 place-items-center rounded-full bg-bone text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-accent"
                          >
                            &rarr;
                          </span>
                        </div>
                        <div>
                          <h3 className={`display ${big ? "text-[clamp(2.2rem,4.6vw,4.9rem)]" : "text-[clamp(1.8rem,2.7vw,3rem)]"} leading-[1]`}>
                            {e.title}
                          </h3>
                          <p className="mt-3 max-w-xs text-[0.95rem] leading-snug text-bone/85">{e.short}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="bg-bone px-4 py-20 text-ink sm:px-8 sm:py-32">
          <div className="mx-auto grid max-w-[1500px] gap-14 md:grid-cols-12">
            <h2 className="display text-[clamp(2.6rem,6.4vw,6rem)] md:col-span-6">Built to be copied, and to survive a phone.</h2>
            <ol className="grid gap-9 md:col-span-6 md:pt-3">
              {[
                ["Reduced motion is a first-class path.", "Every effect has a calm fallback. Nothing is hidden behind an animation."],
                ["Mobile first.", "Touch devices keep native scroll, there is no custom cursor, and the index page ships no animation library."],
                ["No procedural 3D.", "DOM, canvas, SVG and video. The motion comes from timing and type, not from a floating sphere."],
              ].map(([title, text], i) => (
                <li key={title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink/20 pt-6 sm:grid-cols-[4.5rem_1fr]">
                  <span aria-hidden="true" className="display text-[2.2rem] text-accent sm:text-[2.8rem]">
                    {pad(i + 1)}
                  </span>
                  <div>
                    <h3 className="text-[1.25rem] font-bold leading-snug sm:text-[1.4rem]">{title}</h3>
                    <p className="mt-2 text-[1.05rem] leading-relaxed text-ink/75">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </>
  );
}
