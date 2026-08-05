import React, { useState, useRef } from "react";
import { renderAsync } from "docx-preview";
import html2pdf from "html2pdf.js";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import {
  FileType,
  UploadCloud,
  Download,
  Loader2,
  FileText,
  X,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lightbulb,
} from "lucide-react";

const DocxToPdf = () => {
  const { t } = useTranslation();

  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const previewContainerRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".docx")) {
      alert("Lütfen geçerli bir .docx dosyası yükleyin.");
      return;
    }

    setFile(selectedFile);
    setIsRendering(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;

        if (previewContainerRef.current) {
          previewContainerRef.current.innerHTML = "";
        }

        // DOCX Render Ayarları
        await renderAsync(
          arrayBuffer,
          previewContainerRef.current,
          previewContainerRef.current,
          {
            className: "docx-content",
            inWrapper: false,
            ignoreWidth: true, // Word genişliğini yoksay
            ignoreHeight: true, // Word yüksekliğini yoksay
            ignoreFonts: false, // Fontları koru
            breakPages: true, // Sayfa kırılımlarını koru
            useBase64URL: true,
            experimental: true,
          },
        );

        setIsRendering(false);
      } catch (error) {
        console.error("Render hatası:", error);
        alert("Dosya görüntülenirken bir hata oluştu.");
        setIsRendering(false);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const downloadPdf = () => {
    const element = previewContainerRef.current;

    // PDF Ayarları
    const opt = {
      margin: [10, 10, 10, 10], // PDF kenar boşlukları (mm)
      filename: file.name.replace(".docx", ".pdf"),
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    setIsConverting(true);
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setIsConverting(false);
      });
  };

  const handleReset = () => {
    setFile(null);
    if (previewContainerRef.current) {
      previewContainerRef.current.innerHTML = "";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <SEO
        title={t("tools.docx_converter.name")}
        description={t("tools.docx_converter.desc")}
      />

      {/* --- CSS RESET --- */}
      <style>{`
        /* 1. Word'den gelen sayfa ayarlarını SIFIRLA */
        .docx-content section {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            background: transparent !important;
        }

        /* 2. Tüm içerikleri kapsayıcıya sığmaya zorla */
        .docx-content * {
            max-width: 100% !important;
            box-sizing: border-box !important;
        }

        /* 3. Paragraf ve yazı ayarları */
        .docx-content p, .docx-content span {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            line-height: 1.5 !important;
            margin-bottom: 10px !important;
            text-align: left !important;
        }
        
        /* 4. Tablo Ayarları */
        .docx-content table {
            width: 100% !important;
            table-layout: fixed !important;
            border-collapse: collapse !important;
        }
        
        .docx-content td, .docx-content th {
             word-wrap: break-word !important;
             overflow: hidden !important;
             padding: 4px !important;
        }

        /* 5. Resim Ayarları */
        .docx-content img {
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
            margin: 0 auto !important;
        }
      `}</style>

      {/* HEADER */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
          <FileType className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("tools.docx_converter.header")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("tools.docx_converter.subtext")}
        </p>
      </div>

      {/* TOOL CONTAINER */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6 md:p-8">
        {/* Yükleme Alanı */}
        {!file && (
          <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-16 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
            <input
              type="file"
              accept=".docx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="bg-white p-5 rounded-full inline-block mb-4 shadow-md shadow-blue-100 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {t("tools.docx_converter.drop_title")}
            </h3>
            <p className="text-gray-500">
              {t("tools.docx_converter.drop_sub")}
            </p>
          </div>
        )}

        {/* İşlem Alanı */}
        <div className={!file ? "hidden" : "block"}>
          {/* Üst Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-800 truncate">{file?.name}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={12} /> {t("tools.docx_converter.success")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleReset}
                className="px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-medium flex items-center gap-2"
              >
                <X size={18} /> {t("common.cancel") || "İptal"}
              </button>
              <button
                onClick={downloadPdf}
                disabled={isConverting || isRendering}
                className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isConverting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Download size={20} />
                )}
                {isConverting
                  ? t("tools.docx_converter.processing")
                  : t("tools.docx_converter.btn_download")}
              </button>
            </div>
          </div>

          {/* Önizleme Alanı */}
          <div className="relative w-full bg-gray-200 rounded-xl p-4 md:p-8 min-h-[600px] flex justify-center overflow-y-auto max-h-[800px] border border-gray-300 shadow-inner">
            {isRendering && (
              <div className="absolute inset-0 z-20 bg-white/90 flex flex-col items-center justify-center backdrop-blur-sm rounded-xl">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">
                  {t("tools.docx_converter.processing")}
                </p>
              </div>
            )}

            {/* --- A4 KAĞIT AYARLARI --- */}
            <div
              ref={previewContainerRef}
              className="bg-white shadow-2xl min-h-[1000px] origin-top"
              style={{
                width: "210mm",
                padding: "20mm",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              {/* Word içeriği buraya render edilir */}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

      {/* --- SEO VE İÇERİK ALANI (EKLENDİ) --- */}
      <article className="mt-16 prose prose-lg max-w-none text-gray-600 bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <FileText className="text-blue-500" />
          {t("tools.docx_converter.content.title")}
        </h2>
        <p className="leading-relaxed mb-10 text-lg">
          {t("tools.docx_converter.content.p1")}
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Sol Kolon */}
          <div className="space-y-8">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
                <ShieldCheck size={24} className="text-blue-600" />
                {t("tools.docx_converter.content.h2_privacy")}
              </h3>
              <p className="text-blue-900/80 text-sm font-medium leading-relaxed">
                {t("tools.docx_converter.content.p_privacy")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap size={24} className="text-yellow-500" />
                {t("tools.docx_converter.content.h2_features")}
              </h3>
              <ul className="space-y-4 list-none pl-0">
                {[1, 2, 3].map((num) => (
                  <li key={num} className="flex gap-3 items-start">
                    <CheckCircle2
                      className="text-blue-500 flex-shrink-0 mt-1"
                      size={20}
                    />
                    <span>
                      <strong className="block text-gray-900">
                        {t(`tools.docx_converter.content.li${num}_title`)}
                      </strong>
                      {t(`tools.docx_converter.content.li${num}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sağ Kolon */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb size={24} className="text-orange-500" />
              {t("tools.docx_converter.content.h_guide")}
            </h3>
            <p className="mb-6 text-sm font-medium">
              {t("tools.docx_converter.content.guide_p")}
            </p>
            <ul className="space-y-6 relative before:absolute before:left-4 before:top-2 before:h-[calc(100%-20px)] before:w-0.5 before:bg-blue-200">
              {[1, 2, 3].map((num) => (
                <li key={num} className="relative flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold z-10 ring-4 ring-white">
                    {num}
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {
                        t(`tools.docx_converter.content.step${num}`).split(
                          ":",
                        )[0]
                      }
                    </h4>
                    <p className="text-sm text-gray-700">
                      {
                        t(`tools.docx_converter.content.step${num}`).split(
                          ":",
                        )[1]
                      }
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
};

export default DocxToPdf;
