import React, { useState, useEffect } from "react";
import * as Diff from "diff";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import {
  GitCompare,
  ArrowRightLeft,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

const DiffChecker = () => {
  const { t } = useTranslation();

  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [diffResult, setDiffResult] = useState([]);

  // Farkları Hesapla
  useEffect(() => {
    if (oldText || newText) {
      // Kelime bazlı karşılaştırma (Word Diff)
      const diff = Diff.diffWords(oldText, newText);
      setDiffResult(diff);
    } else {
      setDiffResult([]);
    }
  }, [oldText, newText]);

  const clearAll = () => {
    setOldText("");
    setNewText("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <SEO title={t("tools.diff.name")} description={t("tools.diff.desc")} />

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-2xl mb-4">
          <GitCompare className="w-8 h-8 text-teal-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("tools.diff.header")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("tools.diff.subtext")}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6">
        {/* Giriş Alanları */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Eski Metin */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="font-bold text-gray-700 flex items-center gap-2">
                <XCircle size={16} className="text-red-500" />{" "}
                {t("tools.diff.original")}
              </label>
              <span className="text-xs text-gray-400">
                {oldText.length} karakter
              </span>
            </div>
            <textarea
              className="flex-1 w-full h-64 p-4 bg-red-50/30 border border-red-100 rounded-xl focus:ring-2 focus:ring-red-200 outline-none resize-none text-sm font-mono"
              placeholder={t("tools.diff.placeholder_old")}
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
            ></textarea>
          </div>

          {/* Yeni Metin */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="font-bold text-gray-700 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />{" "}
                {t("tools.diff.modified")}
              </label>
              <span className="text-xs text-gray-400">
                {newText.length} karakter
              </span>
            </div>
            <textarea
              className="flex-1 w-full h-64 p-4 bg-green-50/30 border border-green-100 rounded-xl focus:ring-2 focus:ring-green-200 outline-none resize-none text-sm font-mono"
              placeholder={t("tools.diff.placeholder_new")}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Kontrol */}
        <div className="flex justify-center mb-8">
          <button
            onClick={clearAll}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition px-4 py-2 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={18} /> {t("tools.json_formatter.clear_btn")}
          </button>
        </div>

        {/* Sonuç Alanı */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ArrowRightLeft size={20} className="text-teal-600" />
            {t("tools.diff.result_title")}
          </h3>

          <div className="bg-white p-6 rounded-xl border border-gray-200 min-h-[100px] font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-inner">
            {diffResult.length === 0 ? (
              <span className="text-gray-400 italic">
                {t("tools.diff.waiting_result")}
              </span>
            ) : (
              diffResult.map((part, index) => {
                // Stil belirleme
                let style = {};
                if (part.added) {
                  style = {
                    backgroundColor: "#dcfce7",
                    color: "#166534",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }; // Yeşil
                } else if (part.removed) {
                  style = {
                    backgroundColor: "#fee2e2",
                    color: "#991b1b",
                    textDecoration: "line-through",
                    opacity: 0.7,
                  }; // Kırmızı
                }

                return (
                  <span key={index} style={style} className="px-0.5 rounded">
                    {part.value}
                  </span>
                );
              })
            )}
          </div>

          <div className="flex gap-4 mt-4 text-xs font-bold">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-200 rounded"></span>{" "}
              {t("tools.diff.deleted")}
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-200 rounded"></span>{" "}
              {t("tools.diff.added")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

    </div>
  );
};

export default DiffChecker;
