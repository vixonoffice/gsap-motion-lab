import EffectShell from "@/components/EffectShell";
import ImageSequence from "@/effects/ImageSequence";
import ParallaxLayers from "@/effects/ParallaxLayers";
import { effectMetadata } from "@/lib/seo";

export const metadata = effectMetadata("image-sequence");

export default function Page() {
  return (
    <EffectShell slug="image-sequence">
      <ImageSequence />
      <ParallaxLayers />
    </EffectShell>
  );
}
