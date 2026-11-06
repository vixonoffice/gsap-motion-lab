import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="grid min-h-svh content-center px-4 py-32 sm:px-8">
        <div className="mx-auto w-full max-w-[1500px]">
          <p className="eyebrow">Error 404</p>
          <h1 className="display mt-6 text-[clamp(4rem,16vw,15rem)]">
            Lost <span className="text-accent">in motion.</span>
          </h1>
          <p className="mt-8 max-w-md text-lg text-mute">That page does not exist. The effects do.</p>
          <Link href="/#effects" className="btn btn-primary mt-8">
            Back to the effects
          </Link>
        </div>
      </main>
    </>
  );
}
