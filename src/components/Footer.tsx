import Link from "next/link";

export const REPO = "https://github.com/vixonoffice/gsap-motion-lab";
export const VIXON = "https://vixonlab.ro";
export const LINKEDIN = "https://www.linkedin.com/in/iulian-vladutoiu-bb9660449/";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-ink px-4 pb-10 pt-16 sm:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="eyebrow">Built by Vixon Lab</p>
          <p className="display mt-5 max-w-3xl text-[clamp(2rem,5.2vw,4.5rem)]">
            White-label web development for agencies.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn btn-primary" href={VIXON} target="_blank" rel="noopener noreferrer">
              vixonlab.ro
            </a>
            <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a className="btn btn-ghost" href={REPO} target="_blank" rel="noopener noreferrer">
              Source on GitHub
            </a>
          </div>
        </div>
        <div className="md:col-span-5 md:pl-10">
          <p className="eyebrow">Media</p>
          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-mute">
            All photos and videos are from{" "}
            <a className="text-bone underline decoration-line underline-offset-4 hover:decoration-accent" href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">
              Pexels
            </a>
            , used under the Pexels License. Every creator is credited on the{" "}
            <Link className="text-bone underline decoration-line underline-offset-4 hover:decoration-accent" href="/credits">
              credits page
            </Link>
            . Code is MIT.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1500px] flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-[0.8rem] text-mute">
        <span>GSAP Motion Lab, 2026</span>
        <span>Next.js, GSAP, Lenis, Tailwind</span>
      </div>
    </footer>
  );
}
