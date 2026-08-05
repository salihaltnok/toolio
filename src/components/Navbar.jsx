import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Menu,
  X,
  Search,
  Globe,
  ChevronRight,
  Lock,
  QrCode,
  FileText,
  Image,
  RefreshCw,
  Palette,
  AlignLeft,
  Braces,
  Type,
  Percent,
  Binary,
  Timer,
  Tag,
  MousePointerClick,
  Disc,
  AlignJustify,
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
} from "lucide-react";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Arama için Araç Listesi (İkonlarıyla birlikte)
  const tools = [
    {
      id: 1,
      key: "tools.password_gen.name",
      path: "/password-generator",
      icon: <Lock size={16} />,
    },
    {
      id: 2,
      key: "tools.word_counter.name",
      path: "/word-counter",
      icon: <AlignLeft size={16} />,
    },
    {
      id: 3,
      key: "tools.json_formatter.name",
      path: "/json-formatter",
      icon: <Braces size={16} />,
    },
    {
      id: 4,
      key: "tools.qr_generator.name",
      path: "/qr-generator",
      icon: <QrCode size={16} />,
    },
    {
      id: 5,
      key: "tools.image_converter.name",
      path: "/image-converter",
      icon: <Image size={16} />,
    },
    {
      id: 6,
      key: "tools.unit_converter.name",
      path: "/unit-converter",
      icon: <RefreshCw size={16} />,
    },
    {
      id: 7,
      key: "tools.color_palette.name",
      path: "/color-palette",
      icon: <Palette size={16} />,
    },
    {
      id: 8,
      key: "tools.markdown_editor.name",
      path: "/markdown-editor",
      icon: <FileText size={16} />,
    },
    {
      id: 9,
      key: "tools.lorem_ipsum.name",
      path: "/lorem-ipsum",
      icon: <AlignJustify size={16} />,
    },
    {
      id: 10,
      key: "tools.case_converter.name",
      path: "/case-converter",
      icon: <Type size={16} />,
    },
    {
      id: 11,
      key: "tools.percentage_calc.name",
      path: "/percentage-calculator",
      icon: <Percent size={16} />,
    },
    {
      id: 12,
      key: "tools.base64_converter.name",
      path: "/base64-converter",
      icon: <Binary size={16} />,
    },
    {
      id: 13,
      key: "tools.pomodoro.name",
      path: "/pomodoro",
      icon: <Timer size={16} />,
    },
    {
      id: 14,
      key: "tools.discount_calculator.name",
      path: "/discount-calculator",
      icon: <Tag size={16} />,
    },
    {
      id: 15,
      key: "tools.counter.name",
      path: "/counter",
      icon: <MousePointerClick size={16} />,
    },
    {
      id: 16,
      key: "tools.decision_wheel.name",
      path: "/decision-wheel",
      icon: <Disc size={16} />,
    },
    {
      id: 17,
      key: "tools.jpg_to_pdf.name",
      path: "/jpg-to-pdf",
      icon: <FileImage size={16} />,
    },
    {
      id: 18,
      key: "tools.pdf_merge.name",
      path: "/pdf-merge",
      icon: <FileText size={16} />,
    },
    {
      id: 19,
      key: "tools.signature.name",
      path: "/signature-generator",
      icon: <PenTool size={16} />,
    },
    {
      id: 20,
      key: "tools.compressor.name",
      path: "/image-compressor",
      icon: <Minimize2 size={16} />,
    },
    {
      id: 21,
      key: "tools.youtube_thumb.name",
      path: "/youtube-thumbnail",
      icon: <Youtube size={16} />,
    },
    {
      id: 22,
      key: "tools.tts.name",
      path: "/text-to-speech",
      icon: <Mic size={16} />,
    },
    {
      id: 23,
      key: "tools.screen_recorder.name",
      path: "/screen-recorder",
      icon: <Video size={16} />,
    },
    {
      id: 24,
      key: "tools.meme.name",
      path: "/meme-generator",
      icon: <Smile size={16} />,
    },
    {
      id: 25,
      key: "tools.typing.name",
      path: "/typing-test",
      icon: <Keyboard size={16} />,
    },
    {
      id: 26,
      key: "tools.diff.name",
      path: "/diff-checker",
      icon: <GitCompare size={16} />,
    },
    {
      id: 27,
      key: "tools.docx_converter.name",
      path: "/word-to-pdf",
      icon: <FileType size={16} />,
    },
    {
      id: 28,
      key: "tools.fancy_font.name",
      path: "/fancy-font",
      icon: <Sparkles size={16} />,
    },
    {
      id: 29,
      key: "tools.speedtest.name",
      path: "/speed-test",
      icon: <Zap size={16} />,
    },
    {
      id: 30,
      key: "tools.tweet_gen.name",
      path: "/tweet-generator",
      icon: <MessageCircle size={16} />,
    },
    {
      id: 31,
      key: "tools.bg_remover.name",
      path: "/background-remover",
      icon: <Sparkles size={16} />,
    },
  ];

  // Scroll takibi
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dışarı tıklandığında aramayı kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = () => {
    const newLang = i18n.language === "tr" ? "en" : "tr";
    i18n.changeLanguage(newLang);
  };

  // Arama Filtreleme
  const filteredTools = tools.filter((tool) =>
    t(tool.key).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearchSelect = (path) => {
    navigate(path);
    setShowResults(false);
    setSearchQuery("");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md border-b border-gray-100"
          : "bg-white border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* 1. LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/toolio-icon.svg" alt="Toolio" className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Tool<span className="text-indigo-600">io</span>
            </span>
          </Link>

          {/* 2. ORTA KISIM: ARAMA ÇUBUĞU (Desktop) */}
          <div
            className="hidden md:block flex-1 max-w-md mx-8 relative"
            ref={searchRef}
          >
            <div
              className={`flex items-center bg-gray-100 rounded-full px-4 py-2.5 transition-all duration-300 border ${
                showResults
                  ? "border-indigo-500 ring-2 ring-indigo-100 bg-white"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              <Search size={18} className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder={t("home.title") + "..."}
                className="bg-transparent border-none outline-none text-gray-700 w-full text-sm font-medium placeholder-gray-400"
                value={searchQuery}
                onFocus={() => setShowResults(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
              />
            </div>

            {/* Arama Sonuçları Dropdown */}
            {showResults && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden max-h-80 overflow-y-auto">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleSearchSelect(tool.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition text-left text-gray-700 hover:text-indigo-700"
                    >
                      <div className="text-indigo-500 bg-indigo-50 p-2 rounded-lg">
                        {tool.icon}
                      </div>
                      <span className="font-medium text-sm">{t(tool.key)}</span>
                      <ChevronRight size={14} className="ml-auto opacity-50" />
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    Sonuç bulunamadı.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. SAĞ KISIM: LİNKLER & DİL */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition"
            >
              {t("navbar.home")}
            </Link>
            <Link
              to="/about"
              className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition"
            >
              {t("navbar.about")}
            </Link>

            {/* Dil Değiştirici */}
            <button
              onClick={changeLanguage}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition text-sm font-bold text-gray-700"
            >
              <Globe size={16} className="text-indigo-600" />
              <span>{i18n.language === "tr" ? "EN" : "TR"}</span>
            </button>
          </div>

          {/* 4. MOBİL MENÜ BUTONU */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={changeLanguage}
              className="bg-gray-100 p-2 rounded-full text-gray-700"
            >
              <span className="font-bold text-xs">
                {i18n.language === "tr" ? "EN" : "TR"}
              </span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBİL MENÜ (OVERLAY) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
          {/* Mobil Arama */}
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Araç ara..."
                className="w-full outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Mobil Arama Sonuçları */}
            {searchQuery && (
              <div className="mt-2 bg-white rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                {filteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleSearchSelect(tool.path)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 border-b border-gray-50 last:border-0 hover:bg-indigo-50"
                  >
                    {t(tool.key)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col p-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg hover:bg-indigo-50 text-gray-700 font-bold hover:text-indigo-600 transition"
            >
              {t("navbar.home")}
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg hover:bg-indigo-50 text-gray-700 font-bold hover:text-indigo-600 transition"
            >
              {t("navbar.about")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
