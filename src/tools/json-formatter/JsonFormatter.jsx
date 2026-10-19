import React, { useState } from "react";
import SEO from "../../components/SEO";
import {
  Braces,
  Copy,
  Trash2,
  Minimize,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const JsonFormatter = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);

  const formatJson = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 4));
      setError(null);
    } catch (err) {
      setError(t("tools.json_formatter.error_msg"));
      setOutput("");
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError(t("tools.json_formatter.error_msg"));
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      // Toast yerine basit alert şimdilik kalsın, istersen modernleştirebiliriz
      alert(t("tools.json_formatter.copy_msg"));
    }
  };

  return (
    <>
      <SEO
        title={t("tools.json_formatter.name")}
        description={t("tools.json_formatter.desc")}
      />

      <div className="max-w-6xl mx-auto flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Braces className="text-indigo-600 w-8 h-8" />{" "}
            {t("tools.json_formatter.header")}
          </h1>

          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={formatJson}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-sm"
            >
              <CheckCircle size={18} /> {t("tools.json_formatter.format_btn")}
            </button>
            <button
              onClick={minifyJson}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 font-medium shadow-sm"
            >
              <Minimize size={18} /> {t("tools.json_formatter.minify_btn")}
            </button>
            <button
              onClick={clearAll}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center gap-2 font-medium border border-red-200"
            >
              <Trash2 size={18} /> {t("tools.json_formatter.clear_btn")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 min-h-[500px]">
          <div className="flex flex-col h-full">
            <label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
              {t("tools.json_formatter.input_label")}
            </label>
            <div className="relative flex-grow">
              <textarea
                className={`w-full h-full p-4 font-mono text-sm bg-white border rounded-xl resize-none outline-none focus:ring-2 transition-all shadow-sm ${
                  error
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:ring-indigo-200"
                }`}
                placeholder={t("tools.json_formatter.placeholder_input")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>
            {error && (
              <div className="mt-2 text-red-500 text-sm flex items-center gap-1 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                <AlertCircle size={16} /> {error}
              </div>
            )}
          </div>

          <div className="flex flex-col h-full relative">
            <label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
              {t("tools.json_formatter.output_label")}
            </label>
            <div className="relative flex-grow">
              <textarea
                readOnly
                className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-green-400 border border-gray-800 rounded-xl resize-none outline-none shadow-inner"
                placeholder={t("tools.json_formatter.placeholder_output")}
                value={output}
              ></textarea>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition backdrop-blur-sm"
                  title="Kopyala"
                >
                  <Copy size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* REKLAM 1 */}
        <AdBanner slot="1234567890" className="mb-12" />


        {/* REKLAM 2 */}
        <AdBanner slot="9988776655" />
      </div>
    </>
  );
};

export default JsonFormatter;
