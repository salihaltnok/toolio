import React, { useState } from "react";
import SEO from "../../components/SEO";
import {
  Tag,
  TrendingDown,
  DollarSign,
  Plus,
  Percent,
  Copy,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const DiscountCalculator = () => {
  const { t } = useTranslation();

  // State'ler
  const [price, setPrice] = useState("");
  const [rate, setRate] = useState("");
  const [secondRate, setSecondRate] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [currency, setCurrency] = useState("₺");

  // Toggles (Aç/Kapa özellikleri)
  const [showSecondDisc, setShowSecondDisc] = useState(false);
  const [showTax, setShowTax] = useState(false);

  // Hata ve Sonuç State'leri
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  // GİRİŞ DOĞRULAMA (VALIDATION) FONKSİYONU
  const validateInput = (name, value) => {
    let errorMsg = null;
    const num = parseFloat(value);

    if (value !== "" && num < 0) {
      errorMsg = t("tools.discount_calculator.error_negative");
    }

    // Fiyat haricindekiler (oranlar) için 100 kontrolü
    if (name !== "price" && value !== "" && num > 100) {
      errorMsg = t("tools.discount_calculator.error_max_100");
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg === null;
  };

  // State Güncelleme ve Doğrulama
  const handleChange = (setter, name, value) => {
    setter(value);
    validateInput(name, value);
    // Yeni değer girildiğinde sonucu sıfırla ki eski sonuç kalmasın
    setResult(null);
  };

  const calculate = () => {
    // Önce tüm alanları kontrol et
    const isPriceValid = validateInput("price", price);
    const isRateValid = validateInput("rate", rate);
    const isSecondRateValid =
      !showSecondDisc || validateInput("secondRate", secondRate);
    const isTaxValid = !showTax || validateInput("taxRate", taxRate);

    if (
      !isPriceValid ||
      !isRateValid ||
      !isSecondRateValid ||
      !isTaxValid ||
      !price
    )
      return;

    let currentPrice = parseFloat(price);
    const r1 = parseFloat(rate) || 0;

    // 1. İndirim
    const discount1Amount = (currentPrice * r1) / 100;
    let priceAfterDisc1 = currentPrice - discount1Amount;

    // 2. İndirim (Varsa)
    let discount2Amount = 0;
    if (showSecondDisc && secondRate) {
      const r2 = parseFloat(secondRate) || 0;
      discount2Amount = (priceAfterDisc1 * r2) / 100;
    }
    let priceAfterDisc2 = priceAfterDisc1 - discount2Amount;

    // Vergi (Varsa - İndirimli fiyat üzerinden hesaplanır genelde)
    let taxAmount = 0;
    if (showTax && taxRate) {
      const tRate = parseFloat(taxRate) || 0;
      taxAmount = (priceAfterDisc2 * tRate) / 100;
    }

    const final = priceAfterDisc2 + taxAmount;
    // const totalSaved = currentPrice - final + taxAmount; // (Kullanılmıyor, aşağıda hesaplanıyor)

    setResult({
      final: final,
      saved: parseFloat(price) - final, // Net cepteki kazanç/kayıp durumu
      details: {
        base: parseFloat(price),
        d1: discount1Amount,
        d2: discount2Amount,
        tax: taxAmount,
      },
    });
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(`${result.final.toFixed(2)} ${currency}`);
      // alert("Kopyalandı!"); // Alert yerine modern bir bildirim eklenebilir ama şimdilik kalsın
    }
  };

  const handleReset = () => {
    setPrice("");
    setRate("");
    setSecondRate("");
    setTaxRate("");
    setResult(null);
    setErrors({});
  };

  return (
    <>
      <SEO
        title={t("tools.discount_calculator.name")}
        description={t("tools.discount_calculator.desc")}
      />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <Tag className="text-green-600 w-10 h-10" />{" "}
          {t("tools.discount_calculator.header")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- GİRİŞ PANELİ --- */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit">
            {/* Para Birimi Seçimi (YENİ EKLENDİ) */}
            <div className="mb-6 flex gap-2">
              {["₺", "$", "€", "£"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`flex-1 py-2 rounded-lg font-bold transition border ${
                    currency === c
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Fiyat Girişi */}
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                <DollarSign size={18} />{" "}
                {t("tools.discount_calculator.original_price")}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) =>
                    handleChange(setPrice, "price", e.target.value)
                  }
                  placeholder={t("tools.discount_calculator.placeholder_price")}
                  className={`w-full p-4 rounded-xl border-2 outline-none text-lg transition ${
                    errors.price
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.price}
                </p>
              )}
            </div>

            {/* 1. İndirim Oranı */}
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                <TrendingDown size={18} />{" "}
                {t("tools.discount_calculator.discount_rate")}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rate || 0}
                  onChange={(e) =>
                    handleChange(setRate, "rate", e.target.value)
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rate}
                  onChange={(e) =>
                    handleChange(setRate, "rate", e.target.value)
                  }
                  className={`w-24 p-3 rounded-xl border-2 outline-none text-center font-bold text-lg ${
                    errors.rate
                      ? "border-red-500"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                />
              </div>
              {errors.rate && (
                <p className="text-red-500 text-sm mt-1">{errors.rate}</p>
              )}
            </div>

            {/* Ekstra Özellikler (Checkboxlar) */}
            <div className="flex flex-wrap gap-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer select-none bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  checked={showSecondDisc}
                  onChange={() => setShowSecondDisc(!showSecondDisc)}
                  className="w-5 h-5 accent-green-600"
                />
                <span className="text-gray-700 font-medium text-sm">
                  {t("tools.discount_calculator.enable_second_disc")}
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  checked={showTax}
                  onChange={() => setShowTax(!showTax)}
                  className="w-5 h-5 accent-blue-600"
                />
                <span className="text-gray-700 font-medium text-sm">
                  {t("tools.discount_calculator.enable_tax")}
                </span>
              </label>
            </div>

            {/* 2. İndirim (Gizli/Açık) */}
            {showSecondDisc && (
              <div className="mb-6 animate-fadeIn">
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <Plus size={18} />{" "}
                  {t("tools.discount_calculator.second_discount_rate")}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={secondRate}
                  onChange={(e) =>
                    handleChange(setSecondRate, "secondRate", e.target.value)
                  }
                  placeholder="%"
                  className={`w-full p-3 rounded-xl border-2 outline-none ${
                    errors.secondRate
                      ? "border-red-500"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                />
                {errors.secondRate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.secondRate}
                  </p>
                )}
              </div>
            )}

            {/* Vergi (Gizli/Açık) */}
            {showTax && (
              <div className="mb-8 animate-fadeIn">
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <Percent size={18} />{" "}
                  {t("tools.discount_calculator.tax_rate")}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) =>
                    handleChange(setTaxRate, "taxRate", e.target.value)
                  }
                  placeholder="%"
                  className={`w-full p-3 rounded-xl border-2 outline-none ${
                    errors.taxRate
                      ? "border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {errors.taxRate && (
                  <p className="text-red-500 text-sm mt-1">{errors.taxRate}</p>
                )}
              </div>
            )}

            {/* Butonlar */}
            <div className="flex gap-4">
              <button
                onClick={calculate}
                disabled={
                  Object.values(errors).some((x) => x !== null) || !price
                }
                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {t("tools.discount_calculator.calculate_btn")}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition"
              >
                X
              </button>
            </div>
          </div>

          {/* --- SONUÇ PANELİ --- */}
          <div className="flex flex-col gap-6">
            {/* REKLAM 1: Sonuç panelinin hemen üstü */}
            <AdBanner slot="1234567890" />

            <div
              className={`bg-white p-8 rounded-2xl shadow-xl border-2 border-dashed ${
                result ? "border-green-500 bg-green-50" : "border-gray-200"
              } transition-all duration-500 flex flex-col justify-center items-center text-center h-full min-h-[400px] relative`}
            >
              {result ? (
                <>
                  <button
                    onClick={copyResult}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-50 transition"
                    title="Kopyala"
                  >
                    <Copy size={20} className="text-gray-600" />
                  </button>

                  <div className="text-gray-500 font-medium mb-2 uppercase tracking-wide">
                    {t("tools.discount_calculator.final_price")}
                  </div>
                  <div className="text-7xl font-extrabold text-green-600 mb-2 tracking-tighter break-all">
                    {currency}
                    {result.final.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  {result.details.tax > 0 && (
                    <span className="text-xs text-gray-400 font-bold uppercase mb-6">
                      + KDV Dahil
                    </span>
                  )}

                  {/* Detay Tablosu */}
                  <div className="w-full bg-white/60 rounded-xl p-4 text-sm mt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>
                        {t("tools.discount_calculator.original_price")}:
                      </span>
                      <span className="line-through">
                        {currency}
                        {result.details.base.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-red-500 font-medium">
                      <span>- 1. İndirim:</span>
                      <span>
                        {currency}
                        {result.details.d1.toLocaleString()}
                      </span>
                    </div>
                    {result.details.d2 > 0 && (
                      <div className="flex justify-between text-red-500 font-medium">
                        <span>- Ekstra İndirim:</span>
                        <span>
                          {currency}
                          {result.details.d2.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {result.details.tax > 0 && (
                      <div className="flex justify-between text-blue-500 font-medium border-t pt-2">
                        <span>+ Vergi:</span>
                        <span>
                          {currency}
                          {result.details.tax.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 bg-green-200 text-green-800 px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-sm">
                    🎉 {t("tools.discount_calculator.saved_amount")}:{" "}
                    {result.saved > 0
                      ? `${currency}${result.saved.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}`
                      : "0"}
                  </div>
                </>
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <Tag size={80} className="mb-4 opacity-10" />
                  <span className="opacity-50 font-medium">
                    {t("tools.discount_calculator.result_placeholder")}
                  </span>
                </div>
              )}
            </div>

            <AdBanner slot="3344556677" />
          </div>
        </div>

        {/* --- ZENGİN İÇERİK (SEO) ALANI (YENİ EKLENDİ) --- */}
        <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <article className="prose prose-green prose-lg text-gray-600 max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t("tools.discount_calculator.content.title")}
            </h2>
            <p className="mb-6 leading-relaxed">
              {t("tools.discount_calculator.content.intro")}
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.discount_calculator.content.how_title")}
            </h3>
            <p className="mb-6 leading-relaxed">
              {t("tools.discount_calculator.content.how_text")}
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.discount_calculator.content.tax_title")}
            </h3>
            <p className="leading-relaxed">
              {t("tools.discount_calculator.content.tax_text")}
            </p>
          </article>
        </div>
      </div>
    </>
  );
};

export default DiscountCalculator;
