import Link from "next/link";
import { Wordmark } from "./SiteHeader";

/** Header for effect pages. The index is outside the transition layer, so it gets a plain link. */
export default function EffectsHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-5 sm:px-8">
      <Link href="/" aria-label="GSAP Motion Lab, all effects">
        <Wordmark />
      </Link>
      <Link href="/#effects" className="rounded-full border border-line px-4 py-2 text-[0.9rem] hover:border-bone">
        All 12 effects
      </Link>
    </header>
  );
}
