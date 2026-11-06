import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const code = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  weight: ["400", "500"],
  display: "swap",
});

const SITE = "https://vixon-vixon-gsap-motion-lab.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "GSAP Motion Lab: 12 Awwwards-level animation effects with source",
    template: "%s | GSAP Motion Lab",
  },
  description:
    "Twelve GSAP effects, each on its own page with the source code one click away: text reveal, video mask hero, pinned horizontal scroll, image sequence, magnetic cursor, page transitions, Flip, Lenis and more. Built with Next.js by Vixon Lab.",
  applicationName: "GSAP Motion Lab",
  authors: [{ name: "Vixon Lab", url: "https://vixonlab.ro" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "GSAP Motion Lab",
    locale: "en_US",
    title: "GSAP Motion Lab: 12 Awwwards-level animation effects with source",
    description: "Twelve GSAP effects, each on its own page, each with the source one click away. By Vixon Lab.",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${code.variable}`}>
      <body>
        <noscript>
          <style>{".pre-split{visibility:visible!important}"}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <Footer />
      </body>
    </html>
  );
}
