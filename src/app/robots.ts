import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://vixon-vixon-gsap-motion-lab.vercel.app/sitemap.xml" };
}
