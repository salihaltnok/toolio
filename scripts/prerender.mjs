/**
 * PRERENDER
 * ---------
 * `npm run build` sırasında çalışır. Her sayfa için içi dolu bir HTML üretir:
 *   dist/index.html, dist/pdf-merge/index.html, dist/about/index.html ...
 * Ayrıca dist/404.html ve dist/sitemap.xml dosyalarını oluşturur.
 *
 * Böylece Google (ve AdSense incelemesi) sayfayı açtığında boş bir
 * <div id="root"></div> değil, gerçek başlık/metin/bağlantıları görür.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SITE_URL = "https://toolio.com.tr";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const fail = (message) => {
  console.error(`\n[prerender] HATA: ${message}\n`);
  process.exit(1);
};

const templatePath = path.join(distDir, "index.html");
if (!fs.existsSync(templatePath)) fail("dist/index.html bulunamadı. Önce 'vite build' çalışmalı.");
const ssrEntry = path.join(ssrDir, "entry-server.js");
if (!fs.existsSync(ssrEntry)) fail("dist-ssr/entry-server.js bulunamadı.");

const template = fs.readFileSync(templatePath, "utf8");
if (!template.includes("<!--app-head-->") || !template.includes('<div id="root"></div>')) {
  fail("index.html içinde <!--app-head--> veya <div id=\"root\"></div> işareti yok.");
}

const { render, preloadAllTools, VISIBLE_TOOLS, STATIC_PAGES } = await import(
  pathToFileURL(ssrEntry).href
);

await preloadAllTools();

const fillTemplate = ({ html, head, htmlAttributes }) =>
  template
    .replace(/<html[^>]*>/, () => `<html ${htmlAttributes}>`)
    // Şablondaki varsayılan <title> sadece prerender yokken kullanılır.
    .replace(/<title>[\s\S]*?<\/title>\s*/, () => "")
    .replace("<!--app-head-->", () => head)
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`);

const writePage = (urlPath, content) => {
  const target =
    urlPath === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, ...urlPath.split("/").filter(Boolean), "index.html");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  return target;
};

const pages = [
  ...STATIC_PAGES,
  ...VISIBLE_TOOLS.map((tool) => ({ path: tool.path, priority: "0.8", changefreq: "monthly" })),
];

const problems = [];
for (const page of pages) {
  const result = await render(page.path);
  const htmlOut = fillTemplate(result);

  // Basit kalite kontrolleri: başlık, h1, yeterli metin, çevrilmemiş anahtar
  if (!/<title[^>]*>[^<]{5,}<\/title>/.test(htmlOut)) problems.push(`${page.path}: <title> yok`);
  if (!/<h1[\s>]/.test(result.html)) problems.push(`${page.path}: <h1> yok`);
  const text = result.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const words = text.split(" ").filter(Boolean).length;
  if (words < 150) problems.push(`${page.path}: çok az metin (${words} kelime)`);
  const rawKey = text.match(/\b(tools|guide|home|privacy|terms|about|contact|common|footer|navbar)\.[a-z0-9_]+\.[a-z0-9_.]+/);
  if (rawKey) problems.push(`${page.path}: çevrilmemiş anahtar görünüyor: ${rawKey[0]}`);

  writePage(page.path, htmlOut);
  console.log(`[prerender] ${page.path.padEnd(26)} ${String(words).padStart(5)} kelime`);
}

// 404 sayfası (nginx: error_page 404 /404.html)
const notFound = await render("/404-sayfa-bulunamadi/");
fs.writeFileSync(path.join(distDir, "404.html"), fillTemplate(notFound));
console.log("[prerender] /404.html");

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map(
    (page) =>
      `  <url>\n    <loc>${SITE_URL}${page.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`,
  ),
  "</urlset>",
  "",
].join("\n");
fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
console.log(`[prerender] sitemap.xml (${pages.length} adres)`);

fs.rmSync(ssrDir, { recursive: true, force: true });

if (problems.length) {
  fail(`Bazı sayfalarda sorun var:\n  - ${problems.join("\n  - ")}`);
}
console.log(`[prerender] Tamamlandı: ${pages.length} sayfa + 404.html`);
