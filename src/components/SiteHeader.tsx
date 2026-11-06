import Link from "next/link";
import { REPO, VIXON } from "./Footer";

export function Wordmark() {
  return (
    <span className="flex items-baseline gap-2 text-[1.05rem] font-bold tracking-tight">
      <span className="inline-block size-2.5 rounded-full bg-accent" aria-hidden="true" />
      GSAP Motion Lab
    </span>
  );
}

/** Plain header for pages without GSAP (index, credits, 404). */
export default function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-5 sm:px-8">
      <Link href="/" aria-label="GSAP Motion Lab, home">
        <Wordmark />
      </Link>
      <nav aria-label="Main" className="flex items-center gap-5 text-[0.9rem] text-mute sm:gap-7">
        <a className="hidden hover:text-bone sm:inline" href={REPO} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a className="rounded-full border border-line px-4 py-2 text-bone hover:border-bone" href={VIXON} target="_blank" rel="noopener noreferrer">
          Vixon Lab
        </a>
      </nav>
    </header>
  );
}
