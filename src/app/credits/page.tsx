import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import { allCredits } from "@/lib/media";

export const metadata: Metadata = {
  title: "Credits",
  description: "Every photo and video on GSAP Motion Lab comes from a Pexels creator. Here they all are.",
  alternates: { canonical: "/credits" },
};

export default function Credits() {
  const credits = allCredits();
  return (
    <>
      <SiteHeader />
      <main id="main" className="px-4 pb-24 pt-36 sm:px-8 sm:pt-44">
        <div className="mx-auto max-w-[1100px]">
          <p className="eyebrow">Credits</p>
          <h1 className="display mt-6 text-[clamp(2.8rem,9vw,8rem)]">Thank you, Pexels creators.</h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-mute">
            All photos and videos on this site are free to use under the{" "}
            <a className="text-bone underline decoration-line underline-offset-4 hover:decoration-accent" href="https://www.pexels.com/license/" target="_blank" rel="noopener noreferrer">
              Pexels License
            </a>
            . Videos were trimmed and compressed to 720p for the web.
          </p>
          <ul className="mt-16 border-b border-line">
            {credits.map((c) => (
              <li key={c.kind + c.slug} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[11rem_1fr_auto] sm:items-baseline sm:gap-6">
                <span className="eyebrow">{c.kind}</span>
                <a className="text-[1.05rem] hover:text-accent" href={c.url} target="_blank" rel="noopener noreferrer">
                  {c.slug.replace(/-/g, " ")}
                </a>
                <a className="text-mute hover:text-bone" href={c.creatorUrl} target="_blank" rel="noopener noreferrer">
                  {c.creator?.trim() || "Pexels creator"}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
