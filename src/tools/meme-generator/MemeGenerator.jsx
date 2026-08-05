import React, { useState, useEffect, useRef } from "react";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import {
  Smile,
  Download,
  Image as ImageIcon,
  Type,
  RefreshCcw,
  UploadCloud,
} from "lucide-react";

const MemeGenerator = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(40);
  const [textColor, setTextColor] = useState("#FFFFFF");

  // Varsayılan bir meme şablonu (Boş kalmasın diye)
  useEffect(() => {
    // Başlangıçta boş bir canvas veya placeholder olabilir
    // Biz kullanıcı yükleyene kadar bekleyeceğiz
  }, []);

  // Resim yüklendiğinde veya metin değiştiğinde çizim yap
  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = image;

      img.onload = () => {
        // Canvas boyutunu resme göre ayarla (Max genişlik sınırı koyarak)
        const maxWidth = 800;
        const scale = maxWidth / img.width;

        if (img.width > maxWidth) {
          canvas.width = maxWidth;
          canvas.height = img.height * scale;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        // Resmi çiz
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Yazı Ayarları
        ctx.font = `bold ${fontSize}px Impact, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.strokeStyle = "black";
        ctx.lineWidth = fontSize / 15;
        ctx.textAlign = "center";

        // Üst Yazı
        if (topText) {
          ctx.textBaseline = "top";
          const x = canvas.width / 2;
          const y = canvas.height * 0.05; // %5 yukarıdan
          ctx.strokeText(topText.toUpperCase(), x, y);
          ctx.fillText(topText.toUpperCase(), x, y);
        }

        // Alt Yazı
        if (bottomText) {
          ctx.textBaseline = "bottom";
          const x = canvas.width / 2;
          const y = canvas.height * 0.95; // %5 aşağıdan
          ctx.strokeText(bottomText.toUpperCase(), x, y);
          ctx.fillText(bottomText.toUpperCase(), x, y);
        }
      };
    }
  }, [image, topText, bottomText, fontSize, textColor]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadMeme = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "toolio-meme.jpg";
    link.href = canvasRef.current.toDataURL("image/jpeg", 0.9);
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <SEO title={t("tools.meme.name")} description={t("tools.meme.desc")} />

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-2xl mb-4">
          <Smile className="w-8 h-8 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("tools.meme.header")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("tools.meme.subtext")}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sol Taraf: Ayarlar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Type size={18} /> {t("tools.meme.settings")}
            </h3>

            {/* Resim Yükleme Butonu */}
            <div className="relative mb-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <button className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold py-3 rounded-xl border border-indigo-200 transition flex items-center justify-center gap-2">
                <UploadCloud size={20} />
                {t("tools.meme.upload_btn")}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {t("tools.meme.top_text")}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                  placeholder="ÜST YAZI"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {t("tools.meme.bottom_text")}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                  placeholder="ALT YAZI"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t("tools.meme.font_size")}
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t("tools.meme.color")}
                  </label>
                  <input
                    type="color"
                    className="w-full h-[42px] p-1 border rounded-lg cursor-pointer"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={downloadMeme}
              disabled={!image}
              className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-yellow-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} />
              {t("tools.meme.download_btn")}
            </button>
          </div>
        </div>

        {/* Sağ Taraf: Önizleme */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[400px] overflow-hidden relative">
            {!image ? (
              <div className="text-center p-8">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">
                  {t("tools.meme.preview_placeholder")}
                </p>
                <p className="text-gray-400 text-sm mt-2">JPG, PNG, GIF</p>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto shadow-2xl rounded-lg"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

      {/* SEO Metni */}
      <article className="mt-12 prose prose-lg max-w-none text-gray-600 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-gray-800">{t("tools.meme.content.title")}</h2>
        <p>{t("tools.meme.content.p1")}</p>
        <h3 className="text-gray-800">{t("tools.meme.content.h2")}</h3>
        <ul>
          <li>
            <strong>{t("tools.meme.content.li1_title")}</strong>{" "}
            {t("tools.meme.content.li1")}
          </li>
          <li>
            <strong>{t("tools.meme.content.li2_title")}</strong>{" "}
            {t("tools.meme.content.li2")}
          </li>
          <li>
            <strong>{t("tools.meme.content.li3_title")}</strong>{" "}
            {t("tools.meme.content.li3")}
          </li>
        </ul>
      </article>
    </div>
  );
};

export default MemeGenerator;
