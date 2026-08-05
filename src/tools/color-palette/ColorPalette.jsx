import React, { useState, useEffect, useCallback } from "react";
import SEO from "../../components/SEO";
import { Palette, Lock, Unlock, RefreshCw, Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const ColorPalette = () => {
  const { t } = useTranslation();

  // Renk State'i
  const [colors, setColors] = useState([]);

  // Bildirim State'i (Toast)
  const [toast, setToast] = useState({ show: false, message: "", color: "" });

  // Rastgele Hex Rengi Üretici
  const generateRandomColor = () => {
    const chars = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += chars[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Yeni Palet Oluştur
  const generatePalette = useCallback(() => {
    setColors((prevColors) => {
      if (prevColors.length === 0) {
        return Array(5)
          .fill(null)
          .map(() => ({ hex: generateRandomColor(), isLocked: false }));
      }
      return prevColors.map((color) =>
        color.isLocked ? color : { ...color, hex: generateRandomColor() }
      );
    });
  }, []);

  // Space Tuşu ve İlk Açılış
  useEffect(() => {
    generatePalette();
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        generatePalette();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [generatePalette]);

  // Rengi Kilitle/Aç
  const toggleLock = (index) => {
    const newColors = [...colors];
    newColors[index].isLocked = !newColors[index].isLocked;
    setColors(newColors);
  };

  // PROFESYONEL KOPYALAMA FONKSİYONU
  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);

    // Toast Bildirimini Göster
    setToast({
      show: true,
      message: `${hex} ${t("tools.color_palette.copy_msg")}`,
      color: hex,
    });

    // 2 Saniye sonra gizle
    setTimeout(() => {
      setToast({ show: false, message: "", color: "" });
    }, 2000);
  };

  return (
    <>
      <SEO
        title={t("tools.color_palette.name")}
        description={t("tools.color_palette.desc")}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Palette className="text-indigo-600 w-10 h-10" />{" "}
            {t("tools.color_palette.header")}
          </h1>

          <button
            onClick={generatePalette}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg hover:shadow-indigo-200"
          >
            <RefreshCw size={20} /> {t("tools.color_palette.generate_btn")}
          </button>
        </div>

        <p className="text-center text-gray-500 mb-6 flex items-center justify-center gap-2">
          ℹ️ {t("tools.color_palette.instruction")}
        </p>

        {/* Renk Sütunları */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[500px] mb-8">
          {colors.map((color, index) => (
            <div
              key={index}
              className="relative rounded-2xl shadow-lg flex flex-col items-center justify-center group transition-transform hover:scale-105 duration-300 border border-gray-100"
              style={{ backgroundColor: color.hex }}
            >
              {/* Kilit Butonu */}
              <button
                onClick={() => toggleLock(index)}
                className={`mb-4 p-3 rounded-full shadow-sm transition-all ${
                  color.isLocked
                    ? "bg-red-500 text-white"
                    : "bg-white/30 text-white hover:bg-white/50 opacity-0 group-hover:opacity-100"
                }`}
              >
                {color.isLocked ? <Lock size={24} /> : <Unlock size={24} />}
              </button>

              {/* Renk Kodu */}
              <button
                onClick={() => copyToClipboard(color.hex)}
                className="bg-white px-6 py-3 rounded-lg font-mono text-xl font-bold text-gray-800 shadow-md flex items-center gap-2 hover:bg-gray-50 transition transform active:scale-95"
              >
                {color.hex} <Copy size={16} className="opacity-50" />
              </button>

              <span className="md:hidden text-white/80 text-sm mt-2">
                {color.isLocked ? "Kilitli" : "Değişebilir"}
              </span>
            </div>
          ))}
        </div>

        {/* REKLAM 1: Renklerin hemen altında */}
        <AdBanner slot="1234567890" className="my-8" />

        {/* --- ZENGİN İÇERİK (SEO) ALANI (YENİ EKLENDİ) --- */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <article className="prose prose-indigo prose-lg text-gray-600 max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t("tools.color_palette.content.title")}
            </h2>
            <p className="mb-6 leading-relaxed">
              {t("tools.color_palette.content.intro")}
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.color_palette.content.how_title")}
            </h3>
            <p className="mb-6 leading-relaxed">
              {t("tools.color_palette.content.how_text")}
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.color_palette.content.areas_title")}
            </h3>
            <p className="leading-relaxed">
              {t("tools.color_palette.content.areas_text")}
            </p>
          </article>
        </div>

        {/* REKLAM 2: Sayfa sonu */}
        <AdBanner slot="9988776655" className="mb-12" />

        {/* MODERN TOAST BİLDİRİMİ */}
        <div
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${
            toast.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: toast.color || "#fff" }}
          >
            <Check size={14} className="text-white mix-blend-difference" />
          </div>
          <span className="font-medium">{toast.message}</span>
        </div>
      </div>
    </>
  );
};

export default ColorPalette;
