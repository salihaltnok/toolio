import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import SEO from "../../components/SEO";
import { QrCode, Download, Link as LinkIcon, Palette } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const QrGenerator = () => {
  const { t } = useTranslation();
  const [url, setUrl] = useState("https://google.com");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const qrRef = useRef();

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const image = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <>
      <SEO
        title={t("tools.qr_generator.name")}
        description={t("tools.qr_generator.desc")}
      />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <QrCode className="text-purple-600 w-10 h-10" />{" "}
          {t("tools.qr_generator.header")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
          {/* SOL SÜTUN: AYARLAR */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <LinkIcon size={16} /> {t("tools.qr_generator.url_label")}
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Palette size={16} /> {t("tools.qr_generator.fg_color")}
                </label>
                <div className="flex items-center gap-2 border p-2 rounded-lg">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-sm text-gray-500">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("tools.qr_generator.bg_color")}
                </label>
                <div className="flex items-center gap-2 border p-2 rounded-lg">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-sm text-gray-500">{bgColor}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("tools.qr_generator.size")}: {size}px
              </label>
              <input
                type="range"
                min={128}
                max={384}
                step={32}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>
          </div>

          {/* SAĞ SÜTUN: SONUÇ ve ALTTA REKLAM */}
          <div className="flex flex-col items-center justify-center bg-gray-50 p-8 rounded-xl border-2 border-dashed border-gray-300">
            {/* QR Kod Alanı */}
            <div ref={qrRef} className="bg-white p-4 shadow-xl rounded-lg mb-8">
              <QRCodeCanvas
                value={url}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                level={"H"}
                includeMargin={true}
              />
            </div>

            {/* İndir Butonu */}
            <button
              onClick={downloadQRCode}
              className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition flex items-center gap-2 shadow-lg hover:shadow-purple-200 w-full justify-center md:w-auto"
            >
              <Download size={20} /> {t("tools.qr_generator.download_btn")}
            </button>

            {/* REKLAM 1 */}
            <div className="w-full mt-8 border-t border-gray-200 pt-6">
              <AdBanner slot="3333333333" className="w-full" />
            </div>
          </div>
        </div>


        {/* REKLAM 2 */}
        <AdBanner slot="9988776655" />
      </div>
    </>
  );
};

export default QrGenerator;
