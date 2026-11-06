import EffectShell from "@/components/EffectShell";
import SmoothScrollDemo from "@/effects/SmoothScrollDemo";
import { effectMetadata } from "@/lib/seo";

export const metadata = effectMetadata("smooth-scroll");

export default function Page() {
  return (
    <EffectShell slug="smooth-scroll">
      <SmoothScrollDemo />
    </EffectShell>
  );
}
