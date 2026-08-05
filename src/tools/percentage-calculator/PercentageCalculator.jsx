import React, { useState } from "react";
import SEO from "../../components/SEO";
import { Percent, ArrowRight, Calculator } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const PercentageCalculator = () => {
  const { t } = useTranslation();

  const [inputs, setInputs] = useState({
    c1_a: "",
    c1_b: "",
    c1_res: null,
    c2_a: "",
    c2_b: "",
    c2_res: null,
    c3_a: "",
    c3_b: "",
    c3_res: null,
  });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calc1 = () => {
    const a = parseFloat(inputs.c1_a);
    const b = parseFloat(inputs.c1_b);
    if (!isNaN(a) && !isNaN(b)) {
      setInputs({ ...inputs, c1_res: (a * b) / 100 });
    }
  };

  const calc2 = () => {
    const a = parseFloat(inputs.c2_a);
    const b = parseFloat(inputs.c2_b);
    if (!isNaN(a) && !isNaN(b) && b !== 0) {
      setInputs({ ...inputs, c2_res: (a / b) * 100 });
    }
  };

  const calc3 = () => {
    const a = parseFloat(inputs.c3_a);
    const b = parseFloat(inputs.c3_b);
    if (!isNaN(a) && !isNaN(b) && a !== 0) {
      const change = ((b - a) / a) * 100;
      setInputs({ ...inputs, c3_res: change });
    }
  };

  return (
    <>
      <SEO
        title={t("tools.percentage_calc.name")}
        description={t("tools.percentage_calc.desc")}
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <Percent className="text-indigo-600 w-10 h-10" />{" "}
          {t("tools.percentage_calc.header")}
        </h1>

        {/* Hesaplama Kartları */}
        <div className="space-y-6 mb-12">
          {/* REKLAM 1: İlk hesaplamanın hemen üstü */}
          <AdBanner slot="2233445566" />

          {/* 1. Hesaplama: %'si kaçtır */}
          <CalcCard
            title={t("tools.percentage_calc.calc_1_title")}
            onClick={calc1}
            result={inputs.c1_res}
            btnText={t("tools.percentage_calc.calculate")}
          >
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <Input
                name="c1_a"
                val={inputs.c1_a}
                onChange={handleChange}
                ph={t("tools.percentage_calc.placeholder_a")}
              />
              <span className="text-gray-500 font-medium whitespace-nowrap">
                {t("tools.percentage_calc.calc_1_between")}
              </span>
              <Input
                name="c1_b"
                val={inputs.c1_b}
                onChange={handleChange}
                ph={t("tools.percentage_calc.placeholder_b")}
              />
              <span className="text-gray-500 font-medium whitespace-nowrap">
                {t("tools.percentage_calc.calc_1_after")}
              </span>
            </div>
          </CalcCard>

          {/* 2. Hesaplama: Yüzde kaçıdır */}
          <CalcCard
            title={t("tools.percentage_calc.calc_2_title")}
            onClick={calc2}
            result={inputs.c2_res}
            suffix="%"
            btnText={t("tools.percentage_calc.calculate")}
          >
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <Input
                name="c2_a"
                val={inputs.c2_a}
                onChange={handleChange}
                ph={t("tools.percentage_calc.placeholder_a")}
              />
              <span className="text-gray-500 font-medium whitespace-nowrap">
                {t("tools.percentage_calc.calc_2_between")}
              </span>
              <Input
                name="c2_b"
                val={inputs.c2_b}
                onChange={handleChange}
                ph={t("tools.percentage_calc.placeholder_b")}
              />
              <span className="text-gray-500 font-medium whitespace-nowrap">
                {t("tools.percentage_calc.calc_2_after")}
              </span>
            </div>
          </CalcCard>

          {/* 3. Hesaplama: Değişim Oranı */}
          <CalcCard
            title={t("tools.percentage_calc.calc_3_title")}
            onClick={calc3}
            result={inputs.c3_res}
            suffix="%"
            isChange={true}
            btnText={t("tools.percentage_calc.calculate")}
          >
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <Input
                name="c3_a"
                val={inputs.c3_a}
                onChange={handleChange}
                ph={t("tools.percentage_calc.placeholder_a")}
              />
              <span className="text-gray-500 font-medium whitespace-nowrap">
                {t("tools.percentage_calc.calc_3_between")}
              </span>
              <Input
                name="c3_b"
                val={inputs.c3_b}
                onChange={handleChange}
                ph={t("tools.percentage_calc.placeholder_b")}
              />
              <span className="text-gray-500 font-medium whitespace-nowrap">
                {t("tools.percentage_calc.calc_3_after")}
              </span>
            </div>
          </CalcCard>
        </div>

        {/* REKLAM 2 */}
        <AdBanner slot="9988776655" className="mb-12" />

        {/* --- ZENGİN İÇERİK ALANI --- */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <article className="prose prose-indigo prose-lg text-gray-600 max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t("tools.percentage_calc.content.title")}
            </h2>
            <p className="mb-6 leading-relaxed">
              {t("tools.percentage_calc.content.intro")}
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.percentage_calc.content.areas_title")}
            </h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>{t("tools.percentage_calc.content.areas_list_1")}</li>
              <li>{t("tools.percentage_calc.content.areas_list_2")}</li>
              <li>{t("tools.percentage_calc.content.areas_list_3")}</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("tools.percentage_calc.content.why_title")}
            </h3>
            <p className="leading-relaxed">
              {t("tools.percentage_calc.content.why_text")}
            </p>
          </article>
        </div>
      </div>
    </>
  );
};

const Input = ({ name, val, onChange, ph }) => (
  <input
    type="number"
    name={name}
    value={val}
    onChange={onChange}
    placeholder={ph}
    className="w-full md:w-32 p-3 border border-gray-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
  />
);

const CalcCard = ({
  title,
  children,
  onClick,
  result,
  suffix = "",
  isChange = false,
  btnText,
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
    <div className="flex-1 w-full">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calculator size={18} className="text-indigo-500" /> {title}
      </h3>
      <div className="flex flex-col gap-4">
        {children}
        <button
          onClick={onClick}
          className="bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition w-full md:w-auto md:px-8"
        >
          {btnText}
        </button>
      </div>
    </div>

    {/* Sonuç Alanı */}
    {result !== null && (
      <div className="w-full md:w-48 bg-gray-50 p-4 rounded-xl border border-gray-200 text-center animate-fade-in">
        <div className="text-sm text-gray-500 mb-1">Sonuç</div>
        <div
          className={`text-2xl font-bold ${
            isChange
              ? result > 0
                ? "text-green-600"
                : result < 0
                ? "text-red-600"
                : "text-gray-800"
              : "text-indigo-600"
          }`}
        >
          {isChange && result > 0 ? "+" : ""}
          {parseFloat(result).toFixed(2)}
          {suffix}
        </div>
      </div>
    )}
  </div>
);

export default PercentageCalculator;
