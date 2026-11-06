import EffectShell from "@/components/EffectShell";
import ScrollCounters from "@/effects/ScrollCounters";
import { effectMetadata } from "@/lib/seo";

export const metadata = effectMetadata("scroll-counters");

export default function Page() {
  return (
    <EffectShell slug="scroll-counters">
      <ScrollCounters />
    </EffectShell>
  );
}
