import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import {
  FileText,
  UploadCloud,
  Download,
  Trash2,
  Loader2,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

const PdfMerge = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);

  // Dosya Seçme
  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9), // Benzersiz ID
        name: file.name,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Dosya Silme
  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Sıralama Değiştirme (Yukarı/Aşağı)
  const moveFile = (index, direction) => {
    const newFiles = [...files];
    if (direction === "up" && index > 0) {
      [newFiles[index], newFiles[index - 1]] = [
        newFiles[index - 1],
        newFiles[index],
      ];
    } else if (direction === "down" && index < newFiles.length - 1) {
      [newFiles[index], newFiles[index + 1]] = [
        newFiles[index + 1],
        newFiles[index],
      ];
    }
    setFiles(newFiles);
  };

  // Birleştirme İşlemi
  const mergePdfs = async () => {
    if (files.length < 2) {
      alert(t("tools.pdf_merge.min_warning"));
      return;
    }

    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const fileObj of files) {
        const fileBuffer = await fileObj.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices(),
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();

      // İndirme İşlemi
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "toolio-merged.pdf";
      link.click();
    } catch (error) {
      console.error("PDF Merge Hatası:", error);
      alert(
        t("common.pdf_encrypted_error"),
      );
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title={t("tools.pdf_merge.name")}
        description={t("tools.pdf_merge.desc")}
      />

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("tools.pdf_merge.header")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("tools.pdf_merge.subtext")}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-8">
        {/* Yükleme Alanı */}
        <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:bg-gray-50 transition-colors text-center cursor-pointer group mb-8">
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="bg-white p-4 rounded-full inline-block mb-3 shadow-sm group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg font-medium text-gray-700">
            {t("tools.pdf_merge.drag_drop")}
          </p>
          <p className="text-sm text-gray-400 mt-2">PDF</p>
        </div>

        {/* Dosya Listesi */}
        {files.length > 0 && (
          <div className="space-y-3 mb-8">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-red-100 p-2 rounded-lg text-red-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 truncate font-medium max-w-[200px] sm:max-w-md">
                    {file.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveFile(index, "up")}
                    disabled={index === 0}
                    className="p-2 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp size={18} />
                  </button>
                  <button
                    onClick={() => moveFile(index, "down")}
                    disabled={index === files.length - 1}
                    className="p-2 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown size={18} />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Birleştir Butonu */}
        <button
          onClick={mergePdfs}
          disabled={files.length < 2 || isMerging}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-200 transform active:scale-[0.98]"
        >
          {isMerging ? (
            <>
              <Loader2 className="animate-spin" />
              {t("tools.pdf_merge.processing")}
            </>
          ) : (
            <>
              <Download />
              {t("tools.pdf_merge.merge_btn")}
            </>
          )}
        </button>
        {files.length < 2 && files.length > 0 && (
          <p className="text-center text-sm text-yellow-600 mt-3">
            {t("tools.pdf_merge.min_warning")}
          </p>
        )}
      </div>

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

      {/* ------------------------------------------- */}
    </div>
  );
};

export default PdfMerge;
