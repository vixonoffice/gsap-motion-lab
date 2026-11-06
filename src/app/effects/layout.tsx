import type { ReactNode } from "react";
import EffectsHeader from "@/components/EffectsHeader";
import SmoothScroll from "@/components/SmoothScroll";
import { PageTransition } from "@/components/PageTransition";

export default function EffectsLayout({ children }: { children: ReactNode }) {
  return (
    <PageTransition>
      <SmoothScroll />
      <EffectsHeader />
      <main id="main">{children}</main>
    </PageTransition>
  );
}
