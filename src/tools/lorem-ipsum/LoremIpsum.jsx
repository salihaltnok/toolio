import React, { useState, useEffect } from "react";
import SEO from "../../components/SEO";
import {
  AlignJustify,
  Copy,
  RefreshCw,
  Layers,
  Edit3,
  Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const LoremIpsum = () => {
  const { t } = useTranslation();
  const [count, setCount] = useState(3);
  const [text, setText] = useState("");
  const [customText, setCustomText] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  const paragraphs = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.",
    "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
  ];

  const generateLorem = () => {
    let result = [];
    if (customText.trim() !== "") {
      for (let i = 0; i < count; i++) {
        result.push(customText);
      }
    } else {
      for (let i = 0; i < count; i++) {
        result.push(paragraphs[i % paragraphs.length]);
      }
    }
    setText(result.join("\n\n"));
  };

  useEffect(() => {
    generateLorem();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setToast({ show: true, message: t("tools.lorem_ipsum.copy_msg") });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2000);
  };

  return (
    <>
      <SEO
        title={t("tools.lorem_ipsum.name")}
        description={t("tools.lorem_ipsum.desc")}
      />

      <div className="max-w-4xl mx-auto relative">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <AlignJustify className="text-teal-600 w-10 h-10" />{" "}
          {t("tools.lorem_ipsum.header")}
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
          {/* Ayarlar */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 space-y-6">
            <div className="w-full">
              <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Edit3 size={18} className="text-teal-600" />
                {t("tools.lorem_ipsum.source_label")}
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={t("tools.lorem_ipsum.source_placeholder")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition bg-white"
              />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
                  <Layers size={20} className="text-teal-600" />
                  <label className="font-semibold text-gray-700 whitespace-nowrap text-sm">
                    {t("tools.lorem_ipsum.count_label")}:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-16 p-1 text-center font-bold text-gray-800 outline-none border-b-2 border-transparent focus:border-teal-500 transition"
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full md:w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={generateLorem}
                  className="flex-1 md:flex-none bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition flex items-center justify-center gap-2 shadow-lg shadow-teal-100 transform active:scale-95"
                >
                  <RefreshCw size={20} /> {t("tools.lorem_ipsum.generate_btn")}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex-1 md:flex-none bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition flex items-center justify-center gap-2 shadow-lg shadow-gray-200 transform active:scale-95"
                >
                  <Copy size={20} /> {t("tools.lorem_ipsum.copy_btn")}
                </button>
              </div>
            </div>
          </div>

          <AdBanner slot="7777777777" className="mb-8" />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-96 p-8 rounded-xl border border-gray-200 text-gray-700 leading-8 font-serif text-lg shadow-inner outline-none focus:ring-2 focus:ring-teal-500/50 resize-y"
            placeholder="Sonuç burada görünecek..."
          ></textarea>
        </div>

        <AdBanner slot="9988776655" className="mt-8 mb-12" />

        {/* --- ZENGİN İÇERİK ALANI --- */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <article className="prose prose-teal prose-lg text-gray-600 max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t("tools.lorem_ipsum.content.title")}
            </h2>
            <p className="mb-6 leading-relaxed">
              {t("tools.lorem_ipsum.content.intro")}
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.lorem_ipsum.content.history_title")}
            </h3>
            <p className="mb-6 leading-relaxed">
              {t("tools.lorem_ipsum.content.history_text")}
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.lorem_ipsum.content.why_title")}
            </h3>
            <p className="leading-relaxed">
              {t("tools.lorem_ipsum.content.why_text")}
            </p>
          </article>
        </div>

        {/* Toast */}
        <div
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${
            toast.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
          <span className="font-medium">{toast.message}</span>
        </div>
      </div>
    </>
  );
};
export default LoremIpsum;
