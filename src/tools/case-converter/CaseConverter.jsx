import React, { useState } from "react";
import SEO from "../../components/SEO";
import { Type, Copy, Trash2, ArrowRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const CaseConverter = () => {
  const { t, i18n } = useTranslation();
  const [text, setText] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  // Türkçede i/İ ve ı/I dönüşümlerinin doğru olması için dile göre locale
  const locale = (i18n.resolvedLanguage || "tr") === "tr" ? "tr-TR" : "en-US";
  const upper = (value) => value.toLocaleUpperCase(locale);
  const lower = (value) => value.toLocaleLowerCase(locale);

  const toUpperCase = () => setText(upper(text));
  const toLowerCase = () => setText(lower(text));
  const toCapitalize = () => {
    const newText = text
      .split(/(\s+)/)
      .map((word) => (word ? upper(word.charAt(0)) + lower(word.slice(1)) : word))
      .join("");
    setText(newText);
  };
  const toSentenceCase = () => {
    const newText = lower(text).replace(/(^\s*\p{L}|[.!?]\s*\p{L})/gu, (c) =>
      upper(c),
    );
    setText(newText);
  };
  const toSlugify = () => {
    const trMap = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u" };
    const newText = lower(text)
      .replace(/[çğıöşüâîû]/g, (c) => trMap[c])
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setText(newText);
  };
  const clearText = () => setText("");

  const copyToClipboard = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setToast({ show: true, message: t("tools.case_converter.copy_msg") });
      setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 2000);
    }
  };

  return (
    <>
      <SEO
        title={t("tools.case_converter.name")}
        description={t("tools.case_converter.desc")}
      />

      <div className="max-w-4xl mx-auto relative">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <Type className="text-orange-600 w-10 h-10" />{" "}
          {t("tools.case_converter.header")}
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            <button
              onClick={toUpperCase}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-bold transition"
            >
              {t("tools.case_converter.uppercase")}
            </button>
            <button
              onClick={toLowerCase}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition"
            >
              {t("tools.case_converter.lowercase")}
            </button>
            <button
              onClick={toCapitalize}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition"
            >
              {t("tools.case_converter.capitalize")}
            </button>
            <button
              onClick={toSentenceCase}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition"
            >
              {t("tools.case_converter.sentence_case")}
            </button>
            <button
              onClick={toSlugify}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-mono text-sm transition"
            >
              {t("tools.case_converter.slugify")}
            </button>
          </div>

          <AdBanner slot="1231231234" className="mb-6" />

          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-80 p-6 rounded-xl border-2 border-gray-200 text-lg text-gray-700 outline-none focus:border-orange-500 transition resize-y font-sans"
              placeholder={t("tools.case_converter.placeholder")}
            ></textarea>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={copyToClipboard}
                className="bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition"
                title="Kopyala"
              >
                <Copy size={20} />
              </button>
              <button
                onClick={clearText}
                className="bg-red-50 text-red-500 p-3 rounded-full shadow-lg hover:bg-red-100 transition"
                title="Temizle"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400 flex items-center gap-2">
            <ArrowRight size={16} /> {t("tools.case_converter.slug_info")}
          </div>
        </div>

        <AdBanner slot="9988776655" className="mt-8 mb-12" />


        {/* Toast */}
        <div
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${
            toast.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
          <span className="font-medium">{toast.message}</span>
        </div>
      </div>
    </>
  );
};
export default CaseConverter;
