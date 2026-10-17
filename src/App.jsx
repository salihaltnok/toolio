import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react"; // useEffect eklendi
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
// YENİ SAYFALAR
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

// Araçlar
import PasswordGenerator from "./tools/password-generator/PasswordGenerator";
import WordCounter from "./tools/word-counter/WordCounter";
import JsonFormatter from "./tools/json-formatter/JsonFormatter";
import QrGenerator from "./tools/qr-generator/QrGenerator";
import ImageConverter from "./tools/image-converter/ImageConverter";
import UnitConverter from "./tools/unit-converter/UnitConverter";
import ColorPalette from "./tools/color-palette/ColorPalette";
import MarkdownEditor from "./tools/markdown-editor/MarkdownEditor";
import LoremIpsum from "./tools/lorem-ipsum/LoremIpsum";
import CaseConverter from "./tools/case-converter/CaseConverter";
import PercentageCalculator from "./tools/percentage-calculator/PercentageCalculator";
import Base64Converter from "./tools/base64-converter/Base64Converter";
import Pomodoro from "./tools/pomodoro/Pomodoro";
import DiscountCalculator from "./tools/discount-calculator/DiscountCalculator";
import Counter from "./tools/counter/Counter";
import DecisionWheel from "./tools/decision-wheel/DecisionWheel";
import JpgToPdf from "./tools/jpg-to-pdf/JpgToPdf";
import PdfMerge from "./tools/pdf-merge/PdfMerge";
import SignatureGenerator from "./tools/signature-generator/SignatureGenerator";
import ImageCompressor from "./tools/image-compressor/ImageCompressor";
import YouTubeThumbnail from "./tools/youtube-thumbnail/YouTubeThumbnail";
import TextToSpeech from "./tools/text-to-speech/TextToSpeech";
import ScreenRecorder from "./tools/screen-recorder/ScreenRecorder";
import MemeGenerator from "./tools/meme-generator/MemeGenerator";
import TypingTest from "./tools/typing-test/TypingTest";
import DiffChecker from "./tools/diff-checker/DiffChecker";
import DocxToPdf from "./tools/docx-to-pdf/DocxToPdf";
import FancyFont from "./tools/fancy-font/FancyFont";
import SpeedTest from "./tools/speed-test/SpeedTest";
import TweetGenerator from "./tools/tweet-generator/TweetGenerator";

// 🔄 SAYFA DEĞİŞTİĞİNDE EN ÜSTE KAYDIRMA BİLEŞENİ
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* ScrollToTop bileşeni Router içinde olmalı */}
        <ScrollToTop />

        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />

          <div className="flex-grow pt-20">
            <Layout>
              <Routes>
                {/* Ana Sayfa ve Hakkında */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />

                {/* Yasal Sayfalar */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />

                {/* Araç Rotaları */}
                <Route
                  path="/password-generator"
                  element={<PasswordGenerator />}
                />
                <Route path="/word-counter" element={<WordCounter />} />
                <Route path="/json-formatter" element={<JsonFormatter />} />
                <Route path="/qr-generator" element={<QrGenerator />} />
                <Route path="/image-converter" element={<ImageConverter />} />
                <Route path="/unit-converter" element={<UnitConverter />} />
                <Route path="/color-palette" element={<ColorPalette />} />
                <Route path="/markdown-editor" element={<MarkdownEditor />} />
                <Route path="/lorem-ipsum" element={<LoremIpsum />} />
                <Route path="/case-converter" element={<CaseConverter />} />
                <Route
                  path="/percentage-calculator"
                  element={<PercentageCalculator />}
                />
                <Route path="/base64-converter" element={<Base64Converter />} />
                <Route path="/pomodoro" element={<Pomodoro />} />
                <Route
                  path="/discount-calculator"
                  element={<DiscountCalculator />}
                />
                <Route path="/counter" element={<Counter />} />
                <Route path="/decision-wheel" element={<DecisionWheel />} />
                <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
                <Route path="/pdf-merge" element={<PdfMerge />} />
                <Route
                  path="/signature-generator"
                  element={<SignatureGenerator />}
                />
                <Route path="/image-compressor" element={<ImageCompressor />} />
                <Route
                  path="/youtube-thumbnail"
                  element={<YouTubeThumbnail />}
                />
                <Route path="/text-to-speech" element={<TextToSpeech />} />
                <Route path="/screen-recorder" element={<ScreenRecorder />} />
                <Route path="/meme-generator" element={<MemeGenerator />} />
                <Route path="/typing-test" element={<TypingTest />} />
                <Route path="/diff-checker" element={<DiffChecker />} />
                <Route path="/word-to-pdf" element={<DocxToPdf />} />
                <Route path="/fancy-font" element={<FancyFont />} />
                <Route path="/speed-test" element={<SpeedTest />} />
                <Route path="/tweet-generator" element={<TweetGenerator />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Layout>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
