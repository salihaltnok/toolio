import {
  Lock,
  AlignLeft,
  Braces,
  QrCode,
  Image,
  RefreshCw,
  Palette,
  FileText,
  AlignJustify,
  Type,
  Percent,
  Binary,
  Timer,
  Tag,
  MousePointerClick,
  Disc,
  FileImage,
  PenTool,
  Minimize2,
  Youtube,
  Mic,
  Video,
  Smile,
  Keyboard,
  GitCompare,
  FileType,
  Sparkles,
  Zap,
  MessageCircle,
  Files,
} from "lucide-react";
import { lazyTool } from "../lib/lazyTool";

/**
 * TOOLIO ARAÇ LİSTESİ — TEK KAYNAK
 * ---------------------------------
 * Ana sayfa, menü araması, rotalar, prerender ve sitemap.xml bu listeden üretilir.
 *
 *  - Yeni araç eklemek için: buraya bir satır ekle + çeviri dosyalarına
 *    tools.<key> ve guide.<key> bölümlerini ekle.
 *  - Bir aracı geçici olarak gizlemek için: hidden: true yap.
 *    Gizli araç menüde, ana sayfada, sitemap'te görünmez ve adresi 404 verir.
 *    Kodu silinmez; tekrar açmak için hidden satırını kaldırman yeterli.
 */

export const CATEGORIES = [
  { id: "pdf", key: "categories.pdf" },
  { id: "image", key: "categories.image" },
  { id: "text", key: "categories.text" },
  { id: "dev", key: "categories.dev" },
  { id: "calc", key: "categories.calc" },
  { id: "daily", key: "categories.daily" },
];

const RAW_TOOLS = [
  // --- PDF & Belge ---
  {
    slug: "pdf-merge",
    key: "pdf_merge",
    category: "pdf",
    icon: Files,
    iconClass: "text-orange-500",
    bgClass: "bg-orange-50",
    load: () => import("../tools/pdf-merge/PdfMerge.jsx"),
  },
  {
    slug: "jpg-to-pdf",
    key: "jpg_to_pdf",
    category: "pdf",
    icon: FileImage,
    iconClass: "text-red-500",
    bgClass: "bg-red-50",
    load: () => import("../tools/jpg-to-pdf/JpgToPdf.jsx"),
  },
  {
    slug: "word-to-pdf",
    key: "docx_converter",
    category: "pdf",
    icon: FileType,
    iconClass: "text-blue-600",
    bgClass: "bg-blue-50",
    load: () => import("../tools/docx-to-pdf/DocxToPdf.jsx"),
  },

  // --- Görsel & Tasarım ---
  {
    slug: "image-compressor",
    key: "compressor",
    category: "image",
    icon: Minimize2,
    iconClass: "text-blue-500",
    bgClass: "bg-blue-50",
    load: () => import("../tools/image-compressor/ImageCompressor.jsx"),
  },
  {
    slug: "image-converter",
    key: "image_converter",
    category: "image",
    icon: Image,
    iconClass: "text-pink-500",
    bgClass: "bg-pink-50",
    load: () => import("../tools/image-converter/ImageConverter.jsx"),
  },
  {
    slug: "qr-generator",
    key: "qr_generator",
    category: "image",
    icon: QrCode,
    iconClass: "text-purple-500",
    bgClass: "bg-purple-50",
    load: () => import("../tools/qr-generator/QrGenerator.jsx"),
  },
  {
    slug: "signature-generator",
    key: "signature",
    category: "image",
    icon: PenTool,
    iconClass: "text-indigo-500",
    bgClass: "bg-indigo-50",
    load: () => import("../tools/signature-generator/SignatureGenerator.jsx"),
  },
  {
    slug: "color-palette",
    key: "color_palette",
    category: "image",
    icon: Palette,
    iconClass: "text-indigo-500",
    bgClass: "bg-indigo-50",
    load: () => import("../tools/color-palette/ColorPalette.jsx"),
  },
  {
    slug: "meme-generator",
    key: "meme",
    category: "image",
    icon: Smile,
    iconClass: "text-yellow-500",
    bgClass: "bg-yellow-50",
    load: () => import("../tools/meme-generator/MemeGenerator.jsx"),
  },
  {
    // AdSense incelemesi süresince gizli (sahte gönderi görüntüsü üretiyor).
    slug: "tweet-generator",
    key: "tweet_gen",
    category: "image",
    icon: MessageCircle,
    iconClass: "text-sky-500",
    bgClass: "bg-sky-50",
    hidden: true,
    load: () => import("../tools/tweet-generator/TweetGenerator.jsx"),
  },

  // --- Metin & Yazı ---
  {
    slug: "word-counter",
    key: "word_counter",
    category: "text",
    icon: AlignLeft,
    iconClass: "text-blue-500",
    bgClass: "bg-blue-50",
    load: () => import("../tools/word-counter/WordCounter.jsx"),
  },
  {
    slug: "case-converter",
    key: "case_converter",
    category: "text",
    icon: Type,
    iconClass: "text-orange-500",
    bgClass: "bg-orange-50",
    load: () => import("../tools/case-converter/CaseConverter.jsx"),
  },
  {
    slug: "diff-checker",
    key: "diff",
    category: "text",
    icon: GitCompare,
    iconClass: "text-teal-600",
    bgClass: "bg-teal-50",
    load: () => import("../tools/diff-checker/DiffChecker.jsx"),
  },
  {
    slug: "text-to-speech",
    key: "tts",
    category: "text",
    icon: Mic,
    iconClass: "text-purple-600",
    bgClass: "bg-purple-50",
    load: () => import("../tools/text-to-speech/TextToSpeech.jsx"),
  },
  {
    slug: "markdown-editor",
    key: "markdown_editor",
    category: "text",
    icon: FileText,
    iconClass: "text-gray-600",
    bgClass: "bg-gray-100",
    load: () => import("../tools/markdown-editor/MarkdownEditor.jsx"),
  },
  {
    slug: "lorem-ipsum",
    key: "lorem_ipsum",
    category: "text",
    icon: AlignJustify,
    iconClass: "text-teal-500",
    bgClass: "bg-teal-50",
    load: () => import("../tools/lorem-ipsum/LoremIpsum.jsx"),
  },
  {
    slug: "fancy-font",
    key: "fancy_font",
    category: "text",
    icon: Sparkles,
    iconClass: "text-fuchsia-600",
    bgClass: "bg-fuchsia-50",
    load: () => import("../tools/fancy-font/FancyFont.jsx"),
  },

  // --- Geliştirici & Güvenlik ---
  {
    slug: "password-generator",
    key: "password_gen",
    category: "dev",
    icon: Lock,
    iconClass: "text-indigo-500",
    bgClass: "bg-indigo-50",
    load: () => import("../tools/password-generator/PasswordGenerator.jsx"),
  },
  {
    slug: "json-formatter",
    key: "json_formatter",
    category: "dev",
    icon: Braces,
    iconClass: "text-orange-500",
    bgClass: "bg-orange-50",
    load: () => import("../tools/json-formatter/JsonFormatter.jsx"),
  },
  {
    slug: "base64-converter",
    key: "base64_converter",
    category: "dev",
    icon: Binary,
    iconClass: "text-indigo-600",
    bgClass: "bg-indigo-50",
    load: () => import("../tools/base64-converter/Base64Converter.jsx"),
  },

  // --- Hesaplama & Dönüştürme ---
  {
    slug: "percentage-calculator",
    key: "percentage_calc",
    category: "calc",
    icon: Percent,
    iconClass: "text-blue-500",
    bgClass: "bg-blue-50",
    load: () =>
      import("../tools/percentage-calculator/PercentageCalculator.jsx"),
  },
  {
    slug: "discount-calculator",
    key: "discount_calculator",
    category: "calc",
    icon: Tag,
    iconClass: "text-green-500",
    bgClass: "bg-green-50",
    load: () => import("../tools/discount-calculator/DiscountCalculator.jsx"),
  },
  {
    slug: "unit-converter",
    key: "unit_converter",
    category: "calc",
    icon: RefreshCw,
    iconClass: "text-green-500",
    bgClass: "bg-green-50",
    load: () => import("../tools/unit-converter/UnitConverter.jsx"),
  },

  // --- Verimlilik & Günlük ---
  {
    slug: "pomodoro",
    key: "pomodoro",
    category: "daily",
    icon: Timer,
    iconClass: "text-red-500",
    bgClass: "bg-red-50",
    load: () => import("../tools/pomodoro/Pomodoro.jsx"),
  },
  {
    slug: "speed-test",
    key: "speedtest",
    category: "daily",
    icon: Zap,
    iconClass: "text-indigo-600",
    bgClass: "bg-indigo-50",
    load: () => import("../tools/speed-test/SpeedTest.jsx"),
  },
  {
    slug: "typing-test",
    key: "typing",
    category: "daily",
    icon: Keyboard,
    iconClass: "text-cyan-600",
    bgClass: "bg-cyan-50",
    load: () => import("../tools/typing-test/TypingTest.jsx"),
  },
  {
    slug: "screen-recorder",
    key: "screen_recorder",
    category: "daily",
    icon: Video,
    iconClass: "text-rose-600",
    bgClass: "bg-rose-50",
    load: () => import("../tools/screen-recorder/ScreenRecorder.jsx"),
  },
  {
    slug: "counter",
    key: "counter",
    category: "daily",
    icon: MousePointerClick,
    iconClass: "text-pink-500",
    bgClass: "bg-pink-50",
    load: () => import("../tools/counter/Counter.jsx"),
  },
  {
    slug: "decision-wheel",
    key: "decision_wheel",
    category: "daily",
    icon: Disc,
    iconClass: "text-purple-500",
    bgClass: "bg-purple-50",
    load: () => import("../tools/decision-wheel/DecisionWheel.jsx"),
  },
  {
    // AdSense incelemesi süresince gizli (YouTube içeriğini indirme aracı).
    slug: "youtube-thumbnail",
    key: "youtube_thumb",
    category: "daily",
    icon: Youtube,
    iconClass: "text-red-600",
    bgClass: "bg-red-50",
    hidden: true,
    load: () => import("../tools/youtube-thumbnail/YouTubeThumbnail.jsx"),
  },
];

export const TOOLS = RAW_TOOLS.map((tool) => ({
  ...tool,
  path: `/${tool.slug}/`,
  Component: lazyTool(tool.load),
}));

/** Sitede görünen (gizli olmayan) araçlar. */
export const VISIBLE_TOOLS = TOOLS.filter((tool) => !tool.hidden);

/** "/pdf-merge", "/pdf-merge/" gibi bir adresten aracı bulur. */
export function findToolByPath(pathname) {
  const slug = (pathname || "").replace(/^\/+|\/+$/g, "");
  return VISIBLE_TOOLS.find((tool) => tool.slug === slug) || null;
}

/** Statik (araç olmayan) sayfalar. Prerender ve sitemap için. */
export const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about/", priority: "0.6", changefreq: "monthly" },
  { path: "/contact/", priority: "0.5", changefreq: "yearly" },
  { path: "/privacy/", priority: "0.4", changefreq: "yearly" },
  { path: "/terms/", priority: "0.4", changefreq: "yearly" },
];
