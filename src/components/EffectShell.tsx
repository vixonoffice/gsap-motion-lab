import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { bySlug, effects, neighbours } from "@/data/effects";
import { highlight } from "@/lib/highlight";
import CodeViewer, { OpenCodeButton, type CodeFile } from "./CodeViewer";
import { TransitionLink } from "./PageTransition";
import { REPO } from "./Footer";

function readSource(p: string): CodeFile {
  const raw = fs.readFileSync(path.join(/*turbopackIgnore: true*/ process.cwd(), p), "utf8").replace(/\s+$/, "") + "\n";
  return { name: path.basename(p), path: p, html: highlight(raw) };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function EffectShell({ slug, children }: { slug: string; children: ReactNode }) {
  const e = bySlug(slug);
  const { prev, next } = neighbours(slug);
  const files = e.files.map(readSource);

  return (
    <>
      <section className="relative overflow-hidden px-4 pb-14 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
        <span aria-hidden="true" className="outline-text display pointer-events-none absolute -right-2 top-16 select-none text-[clamp(8rem,28vw,26rem)] opacity-30 sm:top-8">
          {pad(e.n)}
        </span>
        <div className="relative mx-auto max-w-[1500px]">
          <p className="eyebrow">
            Effect {pad(e.n)} / {effects.length}
          </p>
          <h1 className="display mt-6 max-w-[16ch] text-[clamp(2.7rem,8.4vw,8.2rem)]">{e.title}</h1>
          <p className="mt-8 max-w-2xl text-[1.05rem] leading-relaxed text-mute sm:text-lg">{e.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Techniques">
            {e.tags.map((t) => (
              <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[0.72rem] text-mute">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <OpenCodeButton />
            <a className="btn btn-ghost" href="#demo">
              Jump to demo
            </a>
          </div>
        </div>
      </section>

      <div id="demo">{children}</div>

      <section className="bg-bone px-4 py-20 text-ink sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-[1500px] gap-12 md:grid-cols-12">
          <h2 className="display text-[clamp(2.2rem,5.6vw,5rem)] md:col-span-5">How it works</h2>
          <ol className="grid gap-10 md:col-span-7 md:gap-12">
            {e.notes.map((note, i) => (
              <li key={i} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink/20 pt-6 sm:grid-cols-[5rem_1fr]">
                <span className="display text-[2.2rem] text-accent sm:text-[3rem]" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <p className="text-[1.05rem] leading-relaxed sm:text-[1.15rem]">{note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <nav aria-label="Other effects" className="grid border-t border-line md:grid-cols-[1fr_2fr]">
        <TransitionLink
          href={`/effects/${prev.slug}`}
          variant="wipe"
          label={prev.title}
          className="group flex min-h-40 flex-col justify-between gap-6 border-b border-line p-6 transition-colors hover:bg-coal sm:p-10 md:border-b-0 md:border-r"
        >
          <span className="eyebrow">Previous / {pad(prev.n)}</span>
          <span className="display text-[clamp(1.5rem,3vw,2.4rem)] text-mute transition-colors group-hover:text-bone">{prev.title}</span>
        </TransitionLink>
        <TransitionLink
          href={`/effects/${next.slug}`}
          variant="curtain"
          label={next.title}
          className="group flex min-h-56 flex-col justify-between gap-8 p-6 transition-colors hover:bg-accent hover:text-ink sm:p-10"
        >
          <span className="eyebrow group-hover:text-ink">Next / {pad(next.n)}</span>
          <span className="display text-[clamp(2.2rem,6vw,5.5rem)]">{next.title} &rarr;</span>
        </TransitionLink>
      </nav>

      <CodeViewer files={files} repo={REPO} />
    </>
  );
}
