import type { MetadataRoute } from "next";
import { effects } from "@/data/effects";

const SITE = "https://vixon-vixon-gsap-motion-lab.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "monthly", priority: 1 },
    ...effects.map((e) => ({ url: `${SITE}/effects/${e.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE}/credits`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
