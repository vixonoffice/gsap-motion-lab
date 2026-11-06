#!/usr/bin/env node
/**
 * Downloads the Pexels photos / videos listed in MANIFEST and turns them into
 * web-ready, VERSIONED files under public/media. Also writes
 * src/data/media.generated.json (dimensions + creator credits).
 *
 *   PEXELS_API_KEY=... node scripts/fetch-media.mjs [--only photos|videos|sequence]
 *
 * The generated files are committed, so you only need to run this if you want
 * to swap the media. Bump VERSION when you re-encode: assets are served with an
 * immutable 1 year cache, never replace content under an existing file name.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "media");
const CACHE = path.join(ROOT, ".media-cache");
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const KEY = process.env.PEXELS_API_KEY;
const VERSION = "v1";
const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;

if (!KEY) {
  console.error("PEXELS_API_KEY is not set");
  process.exit(1);
}

const PHOTOS = [
  { slug: "fog-ridge", id: 8494231 },
  { slug: "fog-green", id: 18359798 },
  { slug: "fog-violet", id: 11089921 },
  { slug: "dune-ripples", id: 2504713 },
  { slug: "forest-horizon", id: 9261334, quality: 52 },
  { slug: "concrete", id: 29939683 },
  { slug: "glass-edge", id: 3137084 },
  { slug: "tower-dark", id: 10181820 },
  { slug: "neon-street", id: 2303337 },
  { slug: "rain-blue", id: 14556059 },
  { slug: "alley-umbrella", id: 3048524 },
  { slug: "smoke-violet", id: 7543554 },
  { slug: "smoke-blue", id: 39020435 },
  { slug: "smoke-magenta", id: 10050537 },
  { slug: "smoke-red", id: 38990844 },
  { slug: "light-tunnel", id: 11518796 },
  { slug: "wisp", id: 13922614 },
];

// start / dur in seconds, crf + maxrate tune the size (target 1-2 MB)
const VIDEOS = [
  { slug: "ink-red", id: 7565824, start: 2, dur: 10, crf: 21, maxrate: "2000k" },
  { slug: "waves-teal", id: 34620659, start: 3, dur: 8, crf: 27, maxrate: "1500k" },
  { slug: "city-trails", id: 32031047, start: 4, dur: 8, crf: 27, maxrate: "1500k" },
  { slug: "mist-forest", id: 29350570, start: 3, dur: 9, crf: 23, maxrate: "1800k" },
];

// Frame sequence for the canvas scrub effect (one full turn of the flower, cropped around it).
const SEQUENCE = { slug: "bloom", id: 35304485, start: 0, dur: 12, frames: 72, crop: "1160:1080:370:0", width: 720, quality: 58 };

const headers = { Authorization: KEY };
const credits = fs.existsSync(path.join(ROOT, "src/data/media.generated.json"))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/media.generated.json"), "utf8"))
  : { photos: {}, videos: {}, sequences: {} };

fs.mkdirSync(CACHE, { recursive: true });
fs.mkdirSync(path.join(OUT, "img"), { recursive: true });
fs.mkdirSync(path.join(OUT, "video"), { recursive: true });

async function download(url, file) {
  if (fs.existsSync(file)) return file;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed ${res.status} ${url}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

async function api(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`pexels ${res.status} ${url}`);
  return res.json();
}

const kb = (f) => Math.round(fs.statSync(f).size / 1024);

async function photos() {
  for (const p of PHOTOS) {
    const j = await api(`https://api.pexels.com/v1/photos/${p.id}`);
    const src = await download(j.src.large2x, path.join(CACHE, `photo-${p.id}.jpg`));
    const meta = await sharp(src).metadata();
    const ratio = meta.height / meta.width;
    const files = {};
    for (const w of [640, 1280]) {
      const out = path.join(OUT, "img", `${p.slug}-${VERSION}-${w}.webp`);
      await sharp(src).resize({ width: w }).webp({ quality: p.quality ?? (w === 640 ? 68 : 72), effort: 6 }).toFile(out);
      files[w] = `/media/img/${p.slug}-${VERSION}-${w}.webp`;
    }
    credits.photos[p.slug] = {
      id: p.id,
      w: 1280,
      h: Math.round(1280 * ratio),
      avg: j.avg_color,
      files,
      creator: j.photographer,
      creatorUrl: j.photographer_url,
      url: j.url,
    };
    console.log("photo", p.slug, kb(path.join(OUT, "img", `${p.slug}-${VERSION}-1280.webp`)) + " KB");
  }
}

function pickFile(files, minWidth) {
  const ok = files.filter((f) => f.file_type === "video/mp4" && f.width >= minWidth).sort((a, b) => a.width - b.width);
  return ok[0] || files.filter((f) => f.file_type === "video/mp4").sort((a, b) => b.width - a.width)[0];
}

async function sourceVideo(id, minWidth) {
  const j = await api(`https://api.pexels.com/videos/videos/${id}`);
  const f = pickFile(j.video_files, minWidth);
  const file = await download(f.link, path.join(CACHE, `video-${id}-${f.width}.mp4`));
  return { j, file };
}

async function videos() {
  for (const v of VIDEOS) {
    const { j, file } = await sourceVideo(v.id, 1280);
    const base = path.join(OUT, "video", `${v.slug}-${VERSION}`);
    // 720p, H.264 main, no audio track (iOS autoplay), faststart for progressive playback
    execFileSync(FFMPEG, [
      "-y", "-loglevel", "error", "-ss", String(v.start), "-t", String(v.dur), "-i", file,
      "-vf", "scale=1280:-2:flags=lanczos,fps=30",
      "-c:v", "libx264", "-profile:v", "main", "-preset", "slow", "-crf", String(v.crf),
      "-maxrate", v.maxrate, "-bufsize", "3000k", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart",
      `${base}.mp4`,
    ]);
    // poster = a frame from the clip itself, so the swap from poster to video is seamless
    const frame = path.join(CACHE, `poster-${v.slug}.png`);
    execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-ss", "0.4", "-i", `${base}.mp4`, "-frames:v", "1", frame]);
    await sharp(frame).resize({ width: 960 }).webp({ quality: 62, effort: 6 }).toFile(`${base}-poster.webp`);
    const meta = await sharp(frame).metadata();
    credits.videos[v.slug] = {
      id: v.id,
      w: meta.width,
      h: meta.height,
      src: `/media/video/${v.slug}-${VERSION}.mp4`,
      poster: `/media/video/${v.slug}-${VERSION}-poster.webp`,
      creator: j.user?.name,
      creatorUrl: j.user?.url,
      url: j.url,
    };
    console.log("video", v.slug, kb(`${base}.mp4`) + " KB, poster " + kb(`${base}-poster.webp`) + " KB");
  }
}

async function sequence() {
  const s = SEQUENCE;
  const { j, file } = await sourceVideo(s.id, 1920);
  const dir = path.join(OUT, "seq", `${s.slug}-${VERSION}`);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const fps = s.frames / s.dur;
  execFileSync(FFMPEG, [
    "-y", "-loglevel", "error", "-ss", String(s.start), "-t", String(s.dur), "-i", file,
    "-vf", `fps=${fps},crop=${s.crop},scale=${s.width}:-2:flags=lanczos`,
    "-frames:v", String(s.frames), "-c:v", "libwebp", "-quality", String(s.quality), "-compression_level", "6",
    path.join(dir, "f%03d.webp"),
  ]);
  const total = fs.readdirSync(dir).reduce((n, f) => n + fs.statSync(path.join(dir, f)).size, 0);
  credits.sequences[s.slug] = {
    id: s.id,
    frames: s.frames,
    w: s.width,
    h: Math.round((s.width * 1080) / 1160 / 2) * 2,
    dir: `/media/seq/${s.slug}-${VERSION}`,
    creator: j.user?.name,
    creatorUrl: j.user?.url,
    url: j.url,
  };
  console.log("sequence", s.slug, s.frames + " frames, " + Math.round(total / 1024) + " KB total");
}

if (!only || only === "photos") await photos();
if (!only || only === "videos") await videos();
if (!only || only === "sequence") await sequence();

fs.mkdirSync(path.join(ROOT, "src/data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "src/data/media.generated.json"), JSON.stringify(credits, null, 2) + "\n");
console.log("done");
