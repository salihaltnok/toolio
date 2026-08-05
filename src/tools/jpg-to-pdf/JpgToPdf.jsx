import React, { useState } from "react";
import { jsPDF } from "jspdf";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import {
  FileImage,
  UploadCloud,
  Download,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";

const JpgToPdf = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [isConverting, setIsConverting] = useState(false);

  // Dosya Seçme
  const handleImageChange = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  // Listeden Resim Silme
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Çevirme İşlemi
  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsConverting(true);

    try {
      // A4 Boyutunda PDF oluştur
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        if (i > 0) doc.addPage();

        // Resmi eklemeden önce boyutlarını ayarla (Sayfaya sığdır)
        const imgProps = doc.getImageProperties(image.preview);
        const imgRatio = imgProps.width / imgProps.height;
        const pageRatio = pageWidth / pageHeight;

        let renderWidth = pageWidth;
        let renderHeight = pageWidth / imgRatio;

        // Eğer resim dikeyde sayfadan taşarsa yüksekliğe göre ayarla
        if (renderHeight > pageHeight) {
          renderHeight = pageHeight;
          renderWidth = pageHeight * imgRatio;
        }

        // Resmi ortala
        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;

        doc.addImage(image.preview, "JPEG", x, y, renderWidth, renderHeight);
      }

      doc.save("toolio-images.pdf");
    } catch (error) {
      console.error("PDF Hatası:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title={t("tools.jpg_to_pdf.name")}
        description={t("tools.jpg_to_pdf.desc")}
      />

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-2xl mb-4">
          <FileImage className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("tools.jpg_to_pdf.header")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("tools.jpg_to_pdf.subtext")}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-8">
        {/* Yükleme Alanı */}
        <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
          <input
            type="file"
            multiple
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="bg-white p-4 rounded-full inline-block mb-3 shadow-sm group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-lg font-medium text-gray-700">
            {t("tools.jpg_to_pdf.drag_drop")}
          </p>
          <p className="text-sm text-gray-400 mt-2">JPG, PNG</p>
        </div>

        {/* Resim Listesi */}
        {images.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
              >
                <img
                  src={img.preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-mono">
                  #{index + 1}
                </div>
              </div>
            ))}

            {/* Küçük Ekleme Butonu */}
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors aspect-[3/4]">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Plus className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 font-medium">
                {t("tools.jpg_to_pdf.add_more")}
              </span>
            </div>
          </div>
        )}

        {/* Dönüştür Butonu */}
        <button
          onClick={convertToPdf}
          disabled={images.length === 0 || isConverting}
          className="w-full mt-8 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-200 transform active:scale-[0.98]"
        >
          {isConverting ? (
            <>
              <Loader2 className="animate-spin" />
              {t("tools.jpg_to_pdf.converting")}
            </>
          ) : (
            <>
              <Download />
              {t("tools.jpg_to_pdf.convert_btn")}
            </>
          )}
        </button>
      </div>

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

      {/* SEO Makalesi */}
      <article className="mt-12 prose prose-lg max-w-none text-gray-600 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-gray-800">{t("tools.jpg_to_pdf.content.title")}</h2>
        <p>{t("tools.jpg_to_pdf.content.p1")}</p>
        <h3 className="text-gray-800">{t("tools.jpg_to_pdf.content.h2")}</h3>
        <ul>
          <li>
            <strong>{t("tools.jpg_to_pdf.content.li1_title")}</strong>{" "}
            {t("tools.jpg_to_pdf.content.li1")}
          </li>
          <li>
            <strong>{t("tools.jpg_to_pdf.content.li2_title")}</strong>{" "}
            {t("tools.jpg_to_pdf.content.li2")}
          </li>
          <li>
            <strong>{t("tools.jpg_to_pdf.content.li3_title")}</strong>{" "}
            {t("tools.jpg_to_pdf.content.li3")}
          </li>
        </ul>
      </article>
    </div>
  );
};

export default JpgToPdf;
