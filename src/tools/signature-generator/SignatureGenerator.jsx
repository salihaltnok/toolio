import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import { PenTool, Download, Eraser, Palette } from "lucide-react";

const SignatureGenerator = () => {
  const { t } = useTranslation();
  const sigCanvas = useRef({});
  const [penColor, setPenColor] = useState("black");
  const [penWidth, setPenWidth] = useState(2);

  // Temizle
  const clear = () => sigCanvas.current.clear();

  // İndir (DÜZELTİLEN KISIM BURASI)
  const download = () => {
    if (sigCanvas.current.isEmpty()) {
      alert(t("tools.signature.empty_warning"));
      return;
    }
    // .getTrimmedCanvas() yerine .getCanvas() kullanıyoruz
    const dataURL = sigCanvas.current.getCanvas().toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "toolio-signature.png";
    link.click();
  };

  const colors = [
    { name: "black", class: "bg-black" },
    { name: "blue", class: "bg-blue-600" },
    { name: "red", class: "bg-red-600" },
    { name: "green", class: "bg-green-600" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title={t("tools.signature.name")}
        description={t("tools.signature.desc")}
      />

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
          <PenTool className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("tools.signature.header")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("tools.signature.subtext")}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6 md:p-8">
        {/* Çizim Alanı */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 touch-none">
          <SignatureCanvas
            ref={sigCanvas}
            penColor={penColor}
            minWidth={penWidth}
            maxWidth={penWidth + 1.5}
            canvasProps={{
              className:
                "w-full h-[300px] md:h-[400px] cursor-crosshair rounded-xl",
            }}
          />
          <div className="text-center text-xs text-gray-400 py-2 border-t border-gray-200">
            {t("tools.signature.draw_here")}
          </div>
        </div>

        {/* Araç Çubuğu */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Renk Seçimi */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Palette size={18} /> {t("tools.signature.color")}:
            </span>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setPenColor(c.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    c.class
                  } ${
                    penColor === c.name
                      ? "border-gray-400 scale-110 ring-2 ring-offset-2 ring-indigo-200"
                      : "border-transparent"
                  }`}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          {/* Kalınlık */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
              {t("tools.signature.width")}:
            </span>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={penWidth}
              onChange={(e) => setPenWidth(parseFloat(e.target.value))}
              className="w-full md:w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* Butonlar */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={clear}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
          >
            <Eraser size={20} />
            {t("tools.signature.clear_btn")}
          </button>

          <button
            onClick={download}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98]"
          >
            <Download size={20} />
            {t("tools.signature.download_btn")}
          </button>
        </div>
      </div>

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

      {/* SEO İçeriği */}
      <article className="mt-12 prose prose-lg max-w-none text-gray-600 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-gray-800">{t("tools.signature.content.title")}</h2>
        <p>{t("tools.signature.content.p1")}</p>
        <h3 className="text-gray-800">{t("tools.signature.content.h2")}</h3>
        <ul>
          <li>
            <strong>{t("tools.signature.content.li1_title")}</strong>{" "}
            {t("tools.signature.content.li1")}
          </li>
          <li>
            <strong>{t("tools.signature.content.li2_title")}</strong>{" "}
            {t("tools.signature.content.li2")}
          </li>
          <li>
            <strong>{t("tools.signature.content.li3_title")}</strong>{" "}
            {t("tools.signature.content.li3")}
          </li>
        </ul>
      </article>
    </div>
  );
};

export default SignatureGenerator;
