#!/usr/bin/env node
// design-md — extract DESIGN.md / SKILL.md from a live URL.
// Usage:
//   design-md extract <url> [--out <dir>] [--skill] [--brand <name>] [--audience <text>]
//   design-md extract https://stripe.com --out ~/.claude/design-references/stripe
//
// Default out dir: ~/.claude/design-references/<hostname>/
import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { homedir } from "node:os";
import { normalizeExtractedStyles } from "./vendor/normalize.mjs";
import { generateDesignMarkdown } from "./vendor/generate-design-md.mjs";
import { generateSkillMarkdown } from "./vendor/generate-skill-md.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const [cmd, url, ...rest] = argv;
  const opts = { out: null, skill: false, both: true, brand: null, audience: null, productSurface: null, timeout: 30000, wait: "networkidle" };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--out") opts.out = rest[++i];
    else if (a === "--skill") { opts.skill = true; opts.both = false; }
    else if (a === "--design") { opts.skill = false; opts.both = false; }
    else if (a === "--brand") opts.brand = rest[++i];
    else if (a === "--audience") opts.audience = rest[++i];
    else if (a === "--surface") opts.productSurface = rest[++i];
    else if (a === "--timeout") opts.timeout = Number(rest[++i]);
    else if (a === "--wait") opts.wait = rest[++i];
  }
  return { cmd, url, opts };
}

function expandHome(p) {
  if (!p) return p;
  if (p.startsWith("~")) return join(homedir(), p.slice(1));
  return p;
}

function hostnameSlug(url) {
  try {
    const h = new URL(url).hostname.replace(/^www\./, "");
    return h.split(".")[0];
  } catch {
    return "site";
  }
}

async function extract(url, opts) {
  const extractorSrc = await readFile(resolve(__dirname, "vendor/page-extractor.js"), "utf8");
  const browser = await chromium.launch({ headless: true });
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: opts.wait, timeout: opts.timeout });
    await page.addScriptTag({ content: extractorSrc });
    const payload = await page.evaluate(() => window.__typeuiExtract());
    return payload;
  } finally {
    await browser.close();
  }
}

async function main() {
  const { cmd, url, opts } = parseArgs(process.argv.slice(2));
  if (cmd !== "extract" || !url) {
    console.error("usage: design-md extract <url> [--out <dir>] [--skill|--design] [--brand <name>] [--audience <text>] [--surface <text>]");
    process.exit(2);
  }
  const slug = hostnameSlug(url);
  const outDir = expandHome(opts.out) || join(homedir(), ".claude", "design-references", slug);
  await mkdir(outDir, { recursive: true });

  console.error(`[design-md] extracting ${url}`);
  const payload = await extract(url, opts);
  const normalized = normalizeExtractedStyles(payload);
  const metadata = {
    systemName: opts.brand ? `${opts.brand} Design System` : undefined,
    brand: opts.brand || undefined,
    audience: opts.audience || undefined,
    productSurface: opts.productSurface || undefined,
  };

  const writes = [];
  if (opts.both || !opts.skill) {
    const md = generateDesignMarkdown({ normalized, metadata });
    const p = join(outDir, "DESIGN.md");
    writes.push(writeFile(p, md).then(() => console.error(`[design-md] wrote ${p}`)));
  }
  if (opts.both || opts.skill) {
    const md = generateSkillMarkdown({ normalized, metadata });
    const p = join(outDir, "SKILL.md");
    writes.push(writeFile(p, md).then(() => console.error(`[design-md] wrote ${p}`)));
  }
  await Promise.all(writes);
  console.log(outDir);
}

main().catch((err) => {
  console.error(`[design-md] error: ${err?.message || err}`);
  process.exit(1);
});
