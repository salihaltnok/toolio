import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
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
  Search,
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
  Twitter,
  MessageCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const tools = [
    {
      id: 1,
      name: t("tools.password_gen.name"),
      desc: t("tools.password_gen.desc"),
      path: "/password-generator",
      icon: <Lock className="w-6 h-6 text-indigo-500" />,
      color: "bg-indigo-50",
    },
    {
      id: 2,
      name: t("tools.word_counter.name"),
      desc: t("tools.word_counter.desc"),
      path: "/word-counter",
      icon: <AlignLeft className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-50",
    },
    {
      id: 3,
      name: t("tools.json_formatter.name"),
      desc: t("tools.json_formatter.desc"),
      path: "/json-formatter",
      icon: <Braces className="w-6 h-6 text-orange-500" />,
      color: "bg-orange-50",
    },
    {
      id: 4,
      name: t("tools.qr_generator.name"),
      desc: t("tools.qr_generator.desc"),
      path: "/qr-generator",
      icon: <QrCode className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-50",
    },
    {
      id: 5,
      name: t("tools.image_converter.name"),
      desc: t("tools.image_converter.desc"),
      path: "/image-converter",
      icon: <Image className="w-6 h-6 text-pink-500" />,
      color: "bg-pink-50",
    },
    {
      id: 6,
      name: t("tools.unit_converter.name"),
      desc: t("tools.unit_converter.desc"),
      path: "/unit-converter",
      icon: <RefreshCw className="w-6 h-6 text-green-500" />,
      color: "bg-green-50",
    },
    {
      id: 7,
      name: t("tools.color_palette.name"),
      desc: t("tools.color_palette.desc"),
      path: "/color-palette",
      icon: <Palette className="w-6 h-6 text-indigo-500" />,
      color: "bg-indigo-50",
    },
    {
      id: 8,
      name: t("tools.markdown_editor.name"),
      desc: t("tools.markdown_editor.desc"),
      path: "/markdown-editor",
      icon: <FileText className="w-6 h-6 text-gray-600" />,
      color: "bg-gray-100",
    },
    {
      id: 9,
      name: t("tools.lorem_ipsum.name"),
      desc: t("tools.lorem_ipsum.desc"),
      path: "/lorem-ipsum",
      icon: <AlignJustify className="w-6 h-6 text-teal-500" />,
      color: "bg-teal-50",
    },
    {
      id: 10,
      name: t("tools.case_converter.name"),
      desc: t("tools.case_converter.desc"),
      path: "/case-converter",
      icon: <Type className="w-6 h-6 text-orange-500" />,
      color: "bg-orange-50",
    },
    {
      id: 11,
      name: t("tools.percentage_calc.name"),
      desc: t("tools.percentage_calc.desc"),
      path: "/percentage-calculator",
      icon: <Percent className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-50",
    },
    {
      id: 12,
      name: t("tools.base64_converter.name"),
      desc: t("tools.base64_converter.desc"),
      path: "/base64-converter",
      icon: <Binary className="w-6 h-6 text-indigo-600" />,
      color: "bg-indigo-50",
    },
    {
      id: 13,
      name: t("tools.pomodoro.name"),
      desc: t("tools.pomodoro.desc"),
      path: "/pomodoro",
      icon: <Timer className="w-6 h-6 text-red-500" />,
      color: "bg-red-50",
    },
    {
      id: 14,
      name: t("tools.discount_calculator.name"),
      desc: t("tools.discount_calculator.desc"),
      path: "/discount-calculator",
      icon: <Tag className="w-6 h-6 text-green-500" />,
      color: "bg-green-50",
    },
    {
      id: 15,
      name: t("tools.counter.name"),
      desc: t("tools.counter.desc"),
      path: "/counter",
      icon: <MousePointerClick className="w-6 h-6 text-pink-500" />,
      color: "bg-pink-50",
    },
    {
      id: 16,
      name: t("tools.decision_wheel.name"),
      desc: t("tools.decision_wheel.desc"),
      path: "/decision-wheel",
      icon: <Disc className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-50",
    },
    {
      id: 17,
      name: t("tools.jpg_to_pdf.name"),
      desc: t("tools.jpg_to_pdf.desc"),
      path: "/jpg-to-pdf",
      icon: <FileImage className="w-6 h-6 text-red-500" />,
      color: "bg-red-50",
    },
    {
      id: 18,
      name: t("tools.pdf_merge.name"),
      desc: t("tools.pdf_merge.desc"),
      path: "/pdf-merge",
      icon: <FileText className="w-6 h-6 text-orange-500" />,
      color: "bg-orange-50",
    },
    {
      id: 19,
      name: t("tools.signature.name"),
      desc: t("tools.signature.desc"),
      path: "/signature-generator",
      icon: <PenTool className="w-6 h-6 text-indigo-500" />,
      color: "bg-indigo-50",
    },
    {
      id: 20,
      name: t("tools.compressor.name"),
      desc: t("tools.compressor.desc"),
      path: "/image-compressor",
      icon: <Minimize2 className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-50",
    },
    {
      id: 21,
      name: t("tools.youtube_thumb.name"),
      desc: t("tools.youtube_thumb.desc"),
      path: "/youtube-thumbnail",
      icon: <Youtube className="w-6 h-6 text-red-600" />,
      color: "bg-red-50",
    },
    {
      id: 22,
      name: t("tools.tts.name"),
      desc: t("tools.tts.desc"),
      path: "/text-to-speech",
      icon: <Mic className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50",
    },
    {
      id: 23,
      name: t("tools.screen_recorder.name"),
      desc: t("tools.screen_recorder.desc"),
      path: "/screen-recorder",
      icon: <Video className="w-6 h-6 text-rose-600" />,
      color: "bg-rose-50",
    },
    {
      id: 24,
      name: t("tools.meme.name"),
      desc: t("tools.meme.desc"),
      path: "/meme-generator",
      icon: <Smile className="w-6 h-6 text-yellow-500" />,
      color: "bg-yellow-50",
    },
    {
      id: 25,
      name: t("tools.typing.name"),
      desc: t("tools.typing.desc"),
      path: "/typing-test",
      icon: <Keyboard className="w-6 h-6 text-cyan-600" />,
      color: "bg-cyan-50",
    },
    {
      id: 26,
      name: t("tools.diff.name"),
      desc: t("tools.diff.desc"),
      path: "/diff-checker",
      icon: <GitCompare className="w-6 h-6 text-teal-600" />,
      color: "bg-teal-50",
    },
    {
      id: 27,
      name: t("tools.docx_converter.name"),
      desc: t("tools.docx_converter.desc"),
      path: "/word-to-pdf",
      icon: <FileType className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      id: 28,
      name: t("tools.fancy_font.name"),
      desc: t("tools.fancy_font.desc"),
      path: "/fancy-font",
      icon: <Sparkles className="w-6 h-6 text-fuchsia-600" />,
      color: "bg-fuchsia-50",
    },
    {
      id: 29,
      name: t("tools.speedtest.name"),
      desc: t("tools.speedtest.desc"),
      path: "/speed-test",
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      color: "bg-indigo-50",
    },
    {
      id: 30,
      name: t("tools.tweet_gen.name"),
      desc: t("tools.tweet_gen.desc"),
      path: "/tweet-generator",
      icon: <MessageCircle className="w-6 h-6 text-sky-500" />,
      color: "bg-sky-50",
    },
  ];

  // Arama Filtreleme Fonksiyonu
  const filteredTools = tools.filter((tool) => {
    const term = searchTerm.toLowerCase();
    return (
      tool.name.toLowerCase().includes(term) ||
      tool.desc.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <SEO title={t("home.title")} description={t("home.subtitle")} />

      {/* --- BAŞLIK VE ARAMA ALANI (Hero Section) --- */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Tool<span className="text-indigo-600">io</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          {t("home.subtitle")}
        </p>

        {/* Arama Kutusu */}
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder={
              t("home.search_placeholder") || "Araç ara... (Örn: PDF, Şifre)"
            }
            className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* ----------------------------------- */}

      {/* Araç Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool, index) => (
            <React.Fragment key={tool.id}>
              {/* Reklam Alanı: Sadece filtreleme yoksa ve belli aralıklarla göster */}
              {searchTerm === "" && index > 0 && index % 10 === 0 && (
                <div className="col-span-full py-4">
                  <AdBanner slot="1234567890" format="horizontal" />
                </div>
              )}

              <Link to={tool.path} className="group h-full">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-start relative overflow-hidden">
                  {/* Renkli Arka Plan Efekti */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 ${tool.color} opacity-20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150`}
                  ></div>

                  <div
                    className={`${tool.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}
                  >
                    {tool.icon}
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {tool.desc}
                  </p>
                </div>
              </Link>
            </React.Fragment>
          ))
        ) : (
          /* Sonuç Bulunamadı Mesajı */
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Sonuç Bulunamadı
            </h3>
            <p className="text-gray-500 mt-1">
              "{searchTerm}" ile ilgili bir araç bulamadık.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Tüm araçları göster
            </button>
          </div>
        )}
        {/* Ana Sayfa Zengin İçerik ve Rehber Alanı (AdSense & SEO) */}
        <section className="mt-20 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-gray-600 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {t("home.seo_title", {
              defaultValue:
                "Toolio: Modern, Hızlı ve Güvenli Web Araçları Merkezi",
            })}
          </h2>
          <p className="leading-relaxed">
            {t("home.seo_p1", {
              defaultValue:
                "Toolio, yazılımcıların, tasarımcıların, öğrencilerin ve dijital içerik üreticilerinin günlük iş akışlarında ihtiyaç duyduğu 30'dan fazla çevrimiçi aracı tek bir çatı altında sunan ücretsiz bir platformdur. PDF işlemlerinden görsel sıkıştırmaya, JSON formatlamadan hız testine kadar tüm araçlara ek bir program indirmeden doğrudan tarayıcınız üzerinden ulaşabilirsiniz.",
            })}
          </p>
          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">
                {t("home.feature1_title", {
                  defaultValue: "Tam Gizlilik (Client-Side)",
                })}
              </h3>
              <p className="text-sm leading-relaxed">
                {t("home.feature1_desc", {
                  defaultValue:
                    "PDF birleştirme, Word'den PDF'e dönüştürme ve görsel sıkıştırma gibi işlemler sunucularımıza yüklenmeden doğrudan kendi cihazınızın tarayıcısında işlenir.",
                })}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">
                {t("home.feature2_title", {
                  defaultValue: "Ücretsiz ve Kayıtsız",
                })}
              </h3>
              <p className="text-sm leading-relaxed">
                {t("home.feature2_desc", {
                  defaultValue:
                    "Hiçbir aracı kullanmak için üyelik oluşturmanız veya ücret ödemeniz gerekmez. Sınırsız kullanım hakkıyla saniyeler içinde sonuç alabilirsiniz.",
                })}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">
                {t("home.feature3_title", {
                  defaultValue: "Geliştirici ve Ofis Dostu",
                })}
              </h3>
              <p className="text-sm leading-relaxed">
                {t("home.feature3_desc", {
                  defaultValue:
                    "JSON düzenleyici, Base64 dönüştürücü, Diff Checker ve Markdown editörü gibi teknik araçların yanı sıra günlük ofis ve sosyal medya araçları bir aradadır.",
                })}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
