import EffectShell from "@/components/EffectShell";
import HorizontalScroll from "@/effects/HorizontalScroll";
import { effectMetadata } from "@/lib/seo";

export const metadata = effectMetadata("horizontal-scroll");

export default function Page() {
  return (
    <EffectShell slug="horizontal-scroll">
      <HorizontalScroll />
    </EffectShell>
  );
}
