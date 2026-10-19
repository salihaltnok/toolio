import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SEO from "../../components/SEO";
import { FileText, Trash2, Code, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const DEFAULT_TEXT_TR = `# Merhaba Dünya! 👋

Bu bir **Markdown** editörüdür.
Burada yazdıklarını anlık olarak sağ tarafta görebilirsin.

## Neler Yapabilirsin?

1. Listeler oluşturabilirsin
2. **Kalın** veya *İtalik* yazabilirsin
3. [Bağlantı ekleyebilirsin](https://toolio.com.tr)
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

const DEFAULT_TEXT_EN = `# Hello World! 👋

This is a **Markdown** editor.
Whatever you type here appears instantly on the right.

## What can you do?

1. Create lists
2. Write in **bold** or *italic*
3. [Add links](https://toolio.com.tr)
4. Add code blocks:

\`\`\`javascript
console.log("Code looks great!");
\`\`\`

> Quoting is easy too!

| Feature | Status |
|---------|--------|
| Tables | ✅ |
| Emoji | ✅ |
`;

const MarkdownEditor = () => {
  const { t, i18n } = useTranslation();

  // Sitenin diline göre örnek metinle başla
  const [markdown, setMarkdown] = useState(() =>
    (i18n.resolvedLanguage || "tr") === "en" ? DEFAULT_TEXT_EN : DEFAULT_TEXT_TR,
  );

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


        {/* Reklam Alanı 2 */}
        <AdBanner slot="9988776655" className="mt-8" />
      </div>
    </>
  );
};

export default MarkdownEditor;
