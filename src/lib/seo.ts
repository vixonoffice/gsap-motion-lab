import type { Metadata } from "next";
import { bySlug } from "@/data/effects";

export function effectMetadata(slug: string): Metadata {
  const e = bySlug(slug);
  const url = `/effects/${slug}`;
  return {
    title: e.title,
    description: e.description,
    alternates: { canonical: url },
    openGraph: { title: `${e.title} | GSAP Motion Lab`, description: e.description, url, type: "article" },
  };
}
