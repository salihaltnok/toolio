import React, { useState, useCallback, useEffect } from "react";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner"; // Reklam bileşenini import et (Dosya yolunu kontrol et)
import { useTranslation } from "react-i18next";

const PasswordGenerator = () => {
  const { t } = useTranslation();
  const [length, setLength] = useState(12);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }
    setPassword(pass);
    setCopied(false);
  }, [length]);

  useEffect(() => {
    passwordGenerator();
  }, [length, passwordGenerator]);

  const copyToClipboard = () => {
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEO
        title={t("tools.password_gen.name")}
        description={t("tools.password_gen.desc")}
      />

      {/* --- ARAÇ KUTUSU --- */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          {t("tools.password_gen.name")}
        </h1>

        {/* Şifre Alanı */}
        <div
          onClick={copyToClipboard}
          className="bg-gray-100 p-4 rounded-lg mb-4 text-lg font-mono break-all text-gray-800 cursor-pointer hover:bg-gray-200 transition relative group select-none"
          title="Kopyalamak için tıkla"
        >
          {password}
          {copied && (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded fade-in">
              {t("tools.password_gen.copied_msg")}
            </span>
          )}
        </div>

        {/* Uzunluk Ayarı */}
        <div className="flex items-center gap-4 mb-6">
          <label className="text-gray-700 font-medium whitespace-nowrap min-w-[80px]">
            {t("tools.password_gen.length")}: {length}
          </label>
          <input
            type="range"
            min={6}
            max={30}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Buton */}
        <button
          onClick={passwordGenerator}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg active:scale-95 duration-100"
        >
          {t("tools.password_gen.generate_btn")}
        </button>
      </div>

      {/* --- REKLAM ALANI (Eğer AdBanner kullanıyorsan) --- */}
      <div className="max-w-4xl mx-auto mt-8 flex justify-center">
        {/* Buradaki slot ID'sini kendi AdSense panelinden aldığın ID ile değiştir */}
        {/* <AdBanner slot="1234567890" />  */}
      </div>

      {/* --- SEO VE İÇERİK ALANI (AdSense için Kritik Bölüm) --- */}
      <div className="max-w-3xl mx-auto mt-12 px-4">
        <article className="prose prose-indigo prose-lg text-gray-600">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("tools.password_gen.content.title")}
          </h2>

          <p className="mb-6 leading-relaxed">
            {t("tools.password_gen.content.intro")}
          </p>

          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {t("tools.password_gen.content.how_title")}
          </h3>

          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>{t("tools.password_gen.content.how_list_1")}</li>
            <li>{t("tools.password_gen.content.how_list_2")}</li>
            <li>{t("tools.password_gen.content.how_list_3")}</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {t("tools.password_gen.content.tips_title")}
          </h3>

          <p className="leading-relaxed">
            {t("tools.password_gen.content.tips_text")}
          </p>
        </article>
      </div>
    </>
  );
};

export default PasswordGenerator;
