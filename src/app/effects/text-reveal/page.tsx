import EffectShell from "@/components/EffectShell";
import TextReveal from "@/effects/TextReveal";
import { effectMetadata } from "@/lib/seo";

export const metadata = effectMetadata("text-reveal");

export default function Page() {
  return (
    <EffectShell slug="text-reveal">
      <TextReveal />
    </EffectShell>
  );
}
