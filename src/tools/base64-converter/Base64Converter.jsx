import React, { useState, useEffect } from "react";
import SEO from "../../components/SEO";
import { Binary, Copy, Trash2, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const Base64Converter = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState("encode"); // 'encode' veya 'decode'
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);

  // Toast Bildirim State'i
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    // Giriş boşsa çıktıyı temizle
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    const timer = setTimeout(() => {
      try {
        if (mode === "encode") {
          // Türkçe karakter destekli Encode
          const encoded = btoa(unescape(encodeURIComponent(input)));
          setOutput(encoded);
          setError(null);
        } else {
          // Türkçe karakter destekli Decode
          const decoded = decodeURIComponent(escape(atob(input)));
          setOutput(decoded);
          setError(null);
        }
      } catch (err) {
        // Hata durumunda (özellikle decode yaparken bozuk veri girilirse)
        setError(t("tools.base64_converter.error_msg"));
        setOutput("");
      }
    }, 100); // Anlık yazarken hata vermesin diye 100ms gecikme

    return () => clearTimeout(timer);
  }, [input, mode, t]);

  // PROFESYONEL KOPYALAMA FONKSİYONU
  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);

      // Toast Bildirimini Göster
      setToast({ show: true, message: t("tools.base64_converter.copy_msg") });

      // 2 Saniye sonra gizle
      setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 2000);
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <>
      <SEO
        title={t("tools.base64_converter.name")}
        description={t("tools.base64_converter.desc")}
      />

      <div className="max-w-4xl mx-auto relative">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <Binary className="text-indigo-600 w-10 h-10" />{" "}
          {t("tools.base64_converter.header")}
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          {/* TAB MENÜSÜ */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6 w-full md:w-fit">
            <button
              onClick={() => setMode("encode")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-semibold transition ${
                mode === "encode"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("tools.base64_converter.encode_tab")}
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-semibold transition ${
                mode === "decode"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("tools.base64_converter.decode_tab")}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GİRİŞ ALANI */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-gray-700">
                  {mode === "encode" ? "Metin (Text)" : "Base64"}
                </label>
                <button
                  onClick={clearAll}
                  className="text-red-500 hover:bg-red-50 p-1 rounded transition"
                  title="Temizle"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm bg-gray-50 focus:bg-white transition"
                placeholder={t("tools.base64_converter.input_placeholder")}
              ></textarea>
            </div>

            {/* ÇIKTI ALANI */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-gray-700">
                  {mode === "encode" ? "Base64" : "Metin (Text)"}
                </label>
                <button
                  onClick={copyToClipboard}
                  className="text-indigo-600 hover:bg-indigo-50 p-1 rounded transition"
                  title="Kopyala"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div
                className={`relative w-full h-64 border rounded-xl p-4 overflow-auto font-mono text-sm ${
                  error
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-gray-800 text-green-400"
                }`}
              >
                {error ? (
                  <div className="text-red-600 font-semibold flex items-center gap-2 h-full justify-center">
                    {error}
                  </div>
                ) : (
                  output || (
                    <span className="text-gray-500 select-none opacity-50">
                      {t("tools.base64_converter.output_placeholder")}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* REKLAM 1: İçerik kartının içinde, en altta */}
          <AdBanner slot="5566778899" className="mt-8" />
        </div>

        {/* --- ZENGİN İÇERİK (SEO) ALANI (YENİ EKLENDİ) --- */}
        <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <article className="prose prose-indigo prose-lg text-gray-600 max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t("tools.base64_converter.content.title")}
            </h2>
            <p className="mb-6 leading-relaxed">
              {t("tools.base64_converter.content.intro")}
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.base64_converter.content.usage_title")}
            </h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>{t("tools.base64_converter.content.usage_list_1")}</li>
              <li>{t("tools.base64_converter.content.usage_list_2")}</li>
              <li>{t("tools.base64_converter.content.usage_list_3")}</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.base64_converter.content.modes_title")}
            </h3>
            <p className="leading-relaxed">
              {t("tools.base64_converter.content.modes_text")}
            </p>
          </article>
        </div>

        {/* REKLAM 2: Sayfa sonu */}
        <AdBanner slot="9988776655" className="mt-8" />

        {/* MODERN TOAST BİLDİRİMİ */}
        <div
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${
            toast.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
          <span className="font-medium">{toast.message}</span>
        </div>
      </div>
    </>
  );
};

export default Base64Converter;
