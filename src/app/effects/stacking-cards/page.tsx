import EffectShell from "@/components/EffectShell";
import StackingCards from "@/effects/StackingCards";
import { effectMetadata } from "@/lib/seo";

export const metadata = effectMetadata("stacking-cards");

export default function Page() {
  return (
    <EffectShell slug="stacking-cards">
      <StackingCards />
    </EffectShell>
  );
}
