import React, { useState, useEffect, useCallback } from "react";
import SEO from "../../components/SEO";
import {
  MousePointerClick,
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Plus,
  Minus,
  Keyboard,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const Counter = () => {
  const { t } = useTranslation();

  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // GÜNCELLENMİŞ SES DOSYASI (Gerçek Mekanik Tık Sesi - MP3 Base64)
  const CLICK_SOUND =
    "data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7cQBWIQCubaRCidUhXMscBEAEIYwBMIVM/INRUyFm9sBfowqaSqfcz7FtzqIJDettmYbADCgbrL6BeZOTPUIC5QhLBSGDwJ4js8Z8X8x8x/ngMHhv/+/B4P/t994D/g////94D7nMXmPg8Fgn//95/8O/y858HSiKqSqSqQqFdfksmgn//uQRA4AAdSLjFn0AAx1IuMWfQAAUPYGkAAAAAftwdIAAAAADtwclaCjADPKTjkUPP/TxKDnjfHPndtbfK/5T/3aEqnwQ5X//9D/w4f1/////5f95/+HRdb//l43QT/47B7AAvAodF3///////K4kHw2KdX////////7kEQaAAXmJUqvQAAuYSpVeghAAARBPfIAAAACEE98gAAAAAOAiAAABAgICAQAAAgICAgEAAACAgICAAAAAQICAgEAAACAgICAAAAAQICAgEAAACAgICAAAAAQICAgEAAACAgICAAAAAQICAgEAAACAgICAAAAAQICAgEAAACAgICAAAAAQICAgEAAACAgICAA";

  // İşlem Fonksiyonu (Artır/Azalt)
  const handleCount = useCallback(
    (amount) => {
      setCount((prev) => prev + amount);

      // SES ÇALMA
      if (soundEnabled) {
        try {
          const audio = new Audio(CLICK_SOUND);
          audio.currentTime = 0; // Hızlı basıldığında sesin başa sarmasını sağlar
          audio.volume = 0.5; // Ses seviyesi %50
          audio.play().catch((e) => console.error("Ses çalma hatası:", e));
        } catch (e) {
          console.error("Audio nesnesi oluşturulamadı", e);
        }
      }

      // TİTREŞİM (Sadece mobilde çalışır)
      if (
        vibrationEnabled &&
        typeof navigator !== "undefined" &&
        navigator.vibrate
      ) {
        try {
          navigator.vibrate(50); // 50ms kısa titreşim
        } catch (e) {
          // Bazı tarayıcılar desteklemez, hata vermesin
        }
      }
    },
    [soundEnabled, vibrationEnabled]
  );

  // Klavye Dinleyici
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "ArrowUp" || e.code === "Space") {
        e.preventDefault();
        handleCount(step);
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        handleCount(-step);
      } else if (e.code === "KeyR") {
        setCount(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, handleCount]);

  return (
    <>
      <SEO
        title={t("tools.counter.name")}
        description={t("tools.counter.desc")}
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <MousePointerClick className="text-pink-600 w-10 h-10" />{" "}
          {t("tools.counter.header")}
        </h1>

        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
          {/* Üst Ayar Barı */}
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4 bg-gray-50 p-4 rounded-xl">
            {/* Adım Ayarı */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-500 uppercase">
                {t("tools.counter.step_label")}:
              </span>
              <input
                type="number"
                min="1"
                max="100"
                value={step}
                onChange={(e) => setStep(Number(e.target.value))}
                className="w-16 p-2 rounded-lg border border-gray-300 text-center font-bold outline-none focus:border-pink-500"
              />
            </div>

            {/* Ses ve Titreşim Toggle */}
            <div className="flex gap-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-full transition ${
                  soundEnabled
                    ? "bg-pink-100 text-pink-600"
                    : "bg-gray-200 text-gray-400"
                }`}
                title={
                  soundEnabled
                    ? t("tools.counter.sound_on")
                    : t("tools.counter.sound_off")
                }
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button
                onClick={() => setVibrationEnabled(!vibrationEnabled)}
                className={`p-2 rounded-full transition ${
                  vibrationEnabled
                    ? "bg-purple-100 text-purple-600"
                    : "bg-gray-200 text-gray-400"
                }`}
                title={
                  vibrationEnabled
                    ? t("tools.counter.vibration_on")
                    : t("tools.counter.vibration_off")
                }
              >
                <Smartphone size={20} />
              </button>
            </div>
          </div>

          {/* SAYAÇ GÖSTERGESİ */}
          <div className="flex flex-col items-center justify-center py-10">
            <div className="text-9xl font-black text-gray-800 tabular-nums tracking-tighter select-none transition-all transform scale-100 active:scale-95 duration-100">
              {count}
            </div>
            <div className="text-gray-400 font-medium mt-2">
              {t("tools.counter.current_count")}
            </div>
          </div>

          {/* KONTROL BUTONLARI */}
          <div className="grid grid-cols-2 gap-6 mb-8 max-w-lg mx-auto">
            <button
              onClick={() => handleCount(-step)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-6 rounded-2xl flex justify-center items-center shadow-sm transition active:scale-95"
            >
              <Minus size={48} />
            </button>
            <button
              onClick={() => handleCount(step)}
              className="bg-pink-600 hover:bg-pink-700 text-white py-6 rounded-2xl flex justify-center items-center shadow-lg shadow-pink-200 transition active:scale-95 active:shadow-none"
            >
              <Plus size={48} />
            </button>
          </div>

          {/* Sıfırlama Butonu */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setCount(0)}
              className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition px-4 py-2 rounded-lg hover:bg-red-50"
            >
              <RotateCcw size={18} /> {t("tools.counter.reset_btn")}
            </button>
          </div>

          <div className="text-center text-gray-300 text-xs flex items-center justify-center gap-1">
            <Keyboard size={14} /> {t("tools.counter.keyboard_hint")}
          </div>

          <AdBanner slot="1122334455" className="mt-8" />
        </div>

        {/* --- ZENGİN İÇERİK (SEO) ALANI (YENİ EKLENDİ) --- */}
        <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <article className="prose prose-pink prose-lg text-gray-600 max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t("tools.counter.content.title")}
            </h2>
            <p className="mb-6 leading-relaxed">
              {t("tools.counter.content.intro")}
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.counter.content.features_title")}
            </h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>{t("tools.counter.content.features_list_1")}</li>
              <li>{t("tools.counter.content.features_list_2")}</li>
              <li>{t("tools.counter.content.features_list_3")}</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.counter.content.areas_title")}
            </h3>
            <p className="leading-relaxed">
              {t("tools.counter.content.areas_text")}
            </p>
          </article>
        </div>
      </div>
    </>
  );
};

export default Counter;
