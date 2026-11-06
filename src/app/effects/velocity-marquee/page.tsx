import EffectShell from "@/components/EffectShell";
import VelocityMarquee from "@/effects/VelocityMarquee";
import { effectMetadata } from "@/lib/seo";

export const metadata = effectMetadata("velocity-marquee");

export default function Page() {
  return (
    <EffectShell slug="velocity-marquee">
      <VelocityMarquee />
    </EffectShell>
  );
}
