import EffectShell from "@/components/EffectShell";
import VideoHero from "@/effects/VideoHero";
import { effectMetadata } from "@/lib/seo";

export const metadata = effectMetadata("video-hero");

export default function Page() {
  return (
    <EffectShell slug="video-hero">
      <VideoHero />
    </EffectShell>
  );
}
