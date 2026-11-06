import EffectShell from "@/components/EffectShell";
import MagneticCursor from "@/effects/MagneticCursor";
import { effectMetadata } from "@/lib/seo";

export const metadata = effectMetadata("magnetic-cursor");

export default function Page() {
  return (
    <EffectShell slug="magnetic-cursor">
      <MagneticCursor />
    </EffectShell>
  );
}
