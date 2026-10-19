import React, { useState, useRef } from "react";
import SEO from "../../components/SEO";
import { Image, Upload, Download, RefreshCw, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const ImageConverter = () => {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [format, setFormat] = useState("image/jpeg");
  const [converting, setConverting] = useState(false);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert(t("common.invalid_image"));
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleConvert = () => {
    setConverting(true);
    const img = document.createElement("img");
    img.src = preview;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      if (format === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL(format, 0.9);
      const link = document.createElement("a");
      const ext =
        format === "image/jpeg"
          ? "jpg"
          : format === "image/png"
          ? "png"
          : "webp";
      link.download = `converted-image.${ext}`;
      link.href = dataUrl;
      link.click();
      setConverting(false);
    };
  };

  return (
    <>
      <SEO
        title={t("tools.image_converter.name")}
        description={t("tools.image_converter.desc")}
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <Image className="text-pink-600 w-10 h-10" />{" "}
          {t("tools.image_converter.header")}
        </h1>

        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
          {!image ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:bg-gray-50 transition cursor-pointer relative">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <div className="bg-pink-100 p-4 rounded-full mb-4">
                  <Upload className="w-10 h-10 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">
                  {t("tools.image_converter.upload_title")}
                </h3>
                <p className="text-gray-500 mt-2">
                  {t("tools.image_converter.upload_desc")}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative mb-6 group">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 rounded-lg shadow-md"
                />
                <button
                  onClick={clearImage}
                  className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* REKLAM 1: Resim yüklendiğinde, indirme butonunun hemen üstünde */}
              <AdBanner slot="3333333333" className="w-full mb-6" />

              <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-6 rounded-xl w-full justify-center">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-700">
                    {t("tools.image_converter.target_format")}:
                  </span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                  >
                    <option value="image/jpeg">JPG (JPEG)</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WEBP</option>
                  </select>
                </div>
                <button
                  onClick={handleConvert}
                  disabled={converting}
                  className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-700 transition flex items-center gap-2 shadow-lg hover:shadow-pink-200 disabled:opacity-50"
                >
                  {converting ? (
                    <>
                      <RefreshCw className="animate-spin" />
                      {t("tools.image_converter.processing")}
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      {t("tools.image_converter.convert_btn")}
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                {t("tools.image_converter.privacy_note")}
              </p>
            </div>
          )}
        </div>

        {/* REKLAM 2: Sayfa Altı */}
        <AdBanner slot="9988776655" className="mt-8" />

      </div>
    </>
  );
};
export default ImageConverter;
