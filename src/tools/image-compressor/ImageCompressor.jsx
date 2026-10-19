import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import {
  Minimize2,
  UploadCloud,
  Download,
  ArrowRight,
  Loader2,
  RefreshCw,
} from "lucide-react";

const ImageCompressor = () => {
  const { t } = useTranslation();

  const [originalImage, setOriginalImage] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionRate, setCompressionRate] = useState(0);

  // Dosya Yükleme
  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      setOriginalFile(imageFile);
      setOriginalImage(URL.createObjectURL(imageFile));
      setCompressedFile(null);
      setCompressedImage(null);
    }
  };

  // Sıkıştırma İşlemi
  const handleCompressImage = async () => {
    if (!originalFile) return;

    setIsCompressing(true);

    // Ayarlar
    const options = {
      maxSizeMB: 1, // Hedef: 1MB altı
      maxWidthOrHeight: 1920, // Max genişlik/yükseklik
      useWebWorker: true,
      initialQuality: 0.7, // %70 kalite
    };

    try {
      const compressedFile = await imageCompression(originalFile, options);
      setCompressedFile(compressedFile);
      setCompressedImage(URL.createObjectURL(compressedFile));

      // Ne kadar küçüldü hesapla
      const rate =
        ((originalFile.size - compressedFile.size) / originalFile.size) * 100;
      setCompressionRate(rate.toFixed(2));
    } catch (error) {
      console.log(error);
      alert(t("common.error_generic"));
    } finally {
      setIsCompressing(false);
    }
  };

  // Boyut Formatlama (KB/MB)
  const formatSize = (size) => {
    if (size === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <SEO
        title={t("tools.compressor.name")}
        description={t("tools.compressor.desc")}
      />

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
          <Minimize2 className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("tools.compressor.header")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("tools.compressor.subtext")}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6 md:p-10">
        {/* Üst Kısım: Yükleme Alanı */}
        {!originalImage && (
          <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-12 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10 text-blue-500" />
            </div>
            <p className="text-xl font-medium text-gray-700">
              {t("tools.compressor.drag_drop")}
            </p>
            <p className="text-sm text-gray-400 mt-2">JPG, PNG, WEBP</p>
          </div>
        )}

        {/* Alt Kısım: Öncesi / Sonrası */}
        {originalImage && (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Orijinal Resim */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                Orjinal{" "}
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {formatSize(originalFile.size)}
                </span>
              </h3>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <button
                onClick={() => {
                  setOriginalImage(null);
                  setCompressedImage(null);
                }}
                className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <RefreshCw size={14} /> {t("tools.compressor.new_image")}
              </button>
            </div>

            {/* İşlem Alanı / Sıkıştırılmış Resim */}
            <div className="flex flex-col justify-center h-full">
              {!compressedImage ? (
                <div className="text-center py-10">
                  <ArrowRight className="w-12 h-12 text-gray-300 mx-auto mb-4 rotate-90 md:rotate-0" />
                  <button
                    onClick={handleCompressImage}
                    disabled={isCompressing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200"
                  >
                    {isCompressing ? (
                      <>
                        {" "}
                        <Loader2 className="animate-spin" />{" "}
                        {t("tools.compressor.processing")}{" "}
                      </>
                    ) : (
                      <>
                        {" "}
                        <Minimize2 /> {t("tools.compressor.compress_btn")}{" "}
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 p-6 rounded-2xl border border-green-200 animate-in fade-in zoom-in duration-300">
                  <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                    {t("tools.compressor.result_title")}
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                      -{compressionRate}%
                    </span>
                  </h3>

                  <div className="flex justify-between items-center mb-6 text-sm">
                    <span className="text-gray-500 line-through">
                      {formatSize(originalFile.size)}
                    </span>
                    <ArrowRight size={16} className="text-gray-400" />
                    <span className="font-bold text-green-700 text-lg">
                      {formatSize(compressedFile.size)}
                    </span>
                  </div>

                  <a
                    href={compressedImage}
                    download={`compressed-${originalFile.name}`}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200"
                  >
                    <Download /> {t("tools.compressor.download_btn")}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

    </div>
  );
};

export default ImageCompressor;
