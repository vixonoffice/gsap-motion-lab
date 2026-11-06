import EffectShell from "@/components/EffectShell";
import TextScramble from "@/effects/TextScramble";
import { effectMetadata } from "@/lib/seo";

export const metadata = effectMetadata("text-scramble");

export default function Page() {
  return (
    <EffectShell slug="text-scramble">
      <TextScramble />
    </EffectShell>
  );
}
