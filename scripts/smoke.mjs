#!/usr/bin/env node
/**
 * Smoke test: opens every page on a phone and a desktop viewport and fails on
 * console errors, failed requests or horizontal overflow.
 *
 *   npm run build && npm start   (in another terminal)
 *   node scripts/smoke.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000";
const slugs = [
  "text-reveal", "video-hero", "horizontal-scroll", "image-sequence", "magnetic-cursor", "page-transitions",
  "stacking-cards", "velocity-marquee", "scroll-counters", "flip-grid", "smooth-scroll", "text-scramble",
];
const pages = ["/", "/credits", ...slugs.map((s) => `/effects/${s}`)];
const viewports = [
  { name: "phone", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "desktop", width: 1440, height: 900 },
];

const browser = await chromium.launch();
let failures = 0;

for (const vp of viewports) {
  const { name, ...ctxOpts } = vp;
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, ...ctxOpts });
  for (const path of pages) {
    const page = await ctx.newPage();
    const problems = [];
    page.on("console", (m) => m.type() === "error" && problems.push("console: " + m.text().slice(0, 160)));
    page.on("pageerror", (e) => problems.push("pageerror: " + e.message.slice(0, 160)));
    page.on("requestfailed", (r) => problems.push("request failed: " + r.url().slice(-80)));
    page.on("response", (r) => r.status() >= 400 && problems.push(`HTTP ${r.status()}: ${r.url().slice(-80)}`));
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    // scroll through the page once so every ScrollTrigger and lazy asset gets exercised
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 600) {
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(40);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) problems.push(`horizontal overflow ${overflow}px`);
    console.log(`${problems.length ? "FAIL" : "ok  "} ${name.padEnd(7)} ${path}${problems.length ? "\n      " + problems.join("\n      ") : ""}`);
    failures += problems.length;
    await page.close();
  }
  await ctx.close();
}

await browser.close();
if (failures) {
  console.error(`\n${failures} problem(s)`);
  process.exit(1);
}
console.log("\nall pages clean");
