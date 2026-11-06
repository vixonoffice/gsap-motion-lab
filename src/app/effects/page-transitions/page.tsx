import EffectShell from "@/components/EffectShell";
import TransitionDemo from "@/effects/TransitionDemo";
import { effectMetadata } from "@/lib/seo";

export const metadata = effectMetadata("page-transitions");

export default function Page() {
  return (
    <EffectShell slug="page-transitions">
      <TransitionDemo />
    </EffectShell>
  );
}
