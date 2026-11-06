import EffectShell from "@/components/EffectShell";
import FlipGrid from "@/effects/FlipGrid";
import { effectMetadata } from "@/lib/seo";

export const metadata = effectMetadata("flip-grid");

export default function Page() {
  return (
    <EffectShell slug="flip-grid">
      <FlipGrid />
    </EffectShell>
  );
}
