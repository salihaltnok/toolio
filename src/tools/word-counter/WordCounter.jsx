import React, { useState, useEffect } from "react";
import SEO from "../../components/SEO";
import { Type, Trash2, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const WordCounter = () => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    sentences: 0,
    paragraphs: 0,
  });

  useEffect(() => {
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    const sentences =
      text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs =
      text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter(Boolean).length;

    setStats({ words, chars, sentences, paragraphs });
  }, [text]);

  const clearText = () => setText("");

  const copyText = () => {
    navigator.clipboard.writeText(text);
    alert(t("tools.word_counter.copy_msg"));
  };

  return (
    <>
      <SEO
        title={t("tools.word_counter.name")}
        description={t("tools.word_counter.seo_desc")}
      />

      <div className="max-w-4xl mx-auto">
        {/* REKLAM 1: İstatistiklerin Üstü */}
        <AdBanner slot="1111111111" className="mb-6" />

        {/* --- ARAÇ KISMI --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label={t("tools.word_counter.words")}
            value={stats.words}
            color="bg-blue-50 text-blue-700"
          />
          <StatCard
            label={t("tools.word_counter.chars")}
            value={stats.chars}
            color="bg-purple-50 text-purple-700"
          />
          <StatCard
            label={t("tools.word_counter.sentences")}
            value={stats.sentences}
            color="bg-green-50 text-green-700"
          />
          <StatCard
            label={t("tools.word_counter.paragraphs")}
            value={stats.paragraphs}
            color="bg-orange-50 text-orange-700"
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gray-50 border-b px-4 py-3 flex justify-between items-center">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
              <Type size={18} /> {t("tools.word_counter.header_text")}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={copyText}
                className="p-2 hover:bg-white rounded text-gray-600 transition"
                title="Kopyala"
              >
                <Copy size={18} />
              </button>
              <button
                onClick={clearText}
                className="p-2 hover:bg-red-50 text-red-500 rounded transition"
                title="Temizle"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-80 p-6 outline-none resize-y text-lg text-gray-700 font-light focus:ring-2 focus:ring-inset focus:ring-indigo-100 transition-shadow"
            placeholder={t("tools.word_counter.placeholder")}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        {/* REKLAM 2: İçerik Sonu */}
        <AdBanner slot="2222222222" />

        {/* --- ZENGİN İÇERİK ALANI (SEO) --- */}
        <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <article className="prose prose-indigo prose-lg text-gray-600 max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t("tools.word_counter.content.title")}
            </h2>

            <p className="mb-6 leading-relaxed">
              {t("tools.word_counter.content.intro")}
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.word_counter.content.why_title")}
            </h3>

            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>{t("tools.word_counter.content.why_list_1")}</li>
              <li>{t("tools.word_counter.content.why_list_2")}</li>
              <li>{t("tools.word_counter.content.why_list_3")}</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.word_counter.content.privacy_title")}
            </h3>

            <p className="leading-relaxed">
              {t("tools.word_counter.content.privacy_text")}
            </p>
          </article>
        </div>
      </div>
    </>
  );
};

const StatCard = ({ label, value, color }) => (
  <div
    className={`${color} p-4 rounded-xl text-center border border-opacity-20 shadow-sm`}
  >
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm opacity-80 font-medium uppercase tracking-wider">
      {label}
    </div>
  </div>
);

export default WordCounter;
