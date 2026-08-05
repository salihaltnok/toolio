import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SEO from "../../components/SEO";
import { FileText, Trash2, Code, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const MarkdownEditor = () => {
  const { t } = useTranslation();

  // Varsayılan bir örnek metinle başlatalım
  const defaultText = `# Merhaba Dünya! 👋

Bu bir **Markdown** editörüdür. 
Burada yazdıklarını anlık olarak sağ tarafta görebilirsin.

## Neler Yapabilirsin?

1. Listeler oluşturabilirsin
2. **Kalın** veya *İtalik* yazabilirsin
3. [Link ekleyebilirsin](https://google.com)
4. Kod bloğu ekleyebilirsin:

\`\`\`javascript
console.log("Kodlar çok havalı görünür!");
\`\`\`

> Alıntı yapmak da çok kolay!

| Özellik | Durum |
|---------|-------|
| Tablolar | ✅ |
| Emojiler | ✅ |
`;

  const [markdown, setMarkdown] = useState(defaultText);

  const clearText = () => setMarkdown("");

  return (
    <>
      <SEO
        title={t("tools.markdown_editor.name")}
        description={t("tools.markdown_editor.desc")}
      />

      <div className="max-w-7xl mx-auto">
        {/* Başlık ve Butonlar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-indigo-600 w-8 h-8" />{" "}
            {t("tools.markdown_editor.header")}
          </h1>
          <button
            onClick={clearText}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition font-medium border border-red-100 hover:border-red-200"
          >
            <Trash2 size={18} /> {t("tools.markdown_editor.clear")}
          </button>
        </div>

        {/* Editör Alanı (Split Screen) - Yüksekliği sabitledik ki sayfa uzasın */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px] mb-8">
          {/* SOL: Yazma Alanı */}
          <div className="flex flex-col h-full border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-shadow">
            <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2 text-sm font-bold text-gray-600 uppercase tracking-wide">
              <Code size={16} className="text-indigo-500" />{" "}
              {t("tools.markdown_editor.write")}
            </div>
            <textarea
              className="flex-grow w-full p-4 resize-none outline-none font-mono text-sm text-gray-700 bg-white"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder={t("tools.markdown_editor.placeholder")}
            ></textarea>
          </div>

          {/* SAĞ: Önizleme Alanı */}
          <div className="flex flex-col h-full border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2 text-sm font-bold text-gray-600 uppercase tracking-wide">
              <Eye size={16} className="text-green-500" />{" "}
              {t("tools.markdown_editor.preview")}
            </div>
            {/* React Markdown Bileşeni */}
            <div className="flex-grow w-full p-6 overflow-auto prose prose-indigo max-w-none bg-white">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Reklam Alanı 1 */}
        <AdBanner slot="5544332211" className="mb-12" />

        {/* --- ZENGİN İÇERİK (SEO) ALANI (YENİ EKLENDİ) --- */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <article className="prose prose-indigo prose-lg text-gray-600 max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t("tools.markdown_editor.content.title")}
            </h2>
            <p className="mb-6 leading-relaxed">
              {t("tools.markdown_editor.content.intro")}
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.markdown_editor.content.syntax_title")}
            </h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>{t("tools.markdown_editor.content.syntax_list_1")}</li>
              <li>{t("tools.markdown_editor.content.syntax_list_2")}</li>
              <li>{t("tools.markdown_editor.content.syntax_list_3")}</li>
              <li>{t("tools.markdown_editor.content.syntax_list_4")}</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.markdown_editor.content.why_title")}
            </h3>
            <p className="leading-relaxed">
              {t("tools.markdown_editor.content.why_text")}
            </p>
          </article>
        </div>

        {/* Reklam Alanı 2 */}
        <AdBanner slot="9988776655" className="mt-8" />
      </div>
    </>
  );
};

export default MarkdownEditor;
