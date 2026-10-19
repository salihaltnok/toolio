import React, { useState, useEffect } from "react";
import SEO from "../../components/SEO";
import {
  RefreshCw,
  ArrowRightLeft,
  Ruler,
  Weight,
  Thermometer,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const UnitConverter = () => {
  const { t } = useTranslation();

  const categories = {
    length: {
      icon: <Ruler size={20} />,
      units: {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        ft: 0.3048,
        inch: 0.0254,
        mile: 1609.34,
      },
    },
    weight: {
      icon: <Weight size={20} />,
      units: {
        kg: 1,
        g: 0.001,
        mg: 0.000001,
        lb: 0.453592,
        oz: 0.0283495,
      },
    },
    temperature: {
      icon: <Thermometer size={20} />,
      units: {
        c: "Celsius (°C)",
        f: "Fahrenheit (°F)",
        k: "Kelvin (K)",
      },
    },
  };

  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(0);

  useEffect(() => {
    const unitKeys = Object.keys(categories[category].units);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1]);
  }, [category]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  useEffect(() => {
    if (isNaN(amount)) return;
    let res = 0;
    if (category === "temperature") {
      if (fromUnit === toUnit) res = amount;
      else if (fromUnit === "c" && toUnit === "f") res = (amount * 9) / 5 + 32;
      else if (fromUnit === "c" && toUnit === "k") res = amount + 273.15;
      else if (fromUnit === "f" && toUnit === "c")
        res = ((amount - 32) * 5) / 9;
      else if (fromUnit === "f" && toUnit === "k")
        res = ((amount - 32) * 5) / 9 + 273.15;
      else if (fromUnit === "k" && toUnit === "c") res = amount - 273.15;
      else if (fromUnit === "k" && toUnit === "f")
        res = ((amount - 273.15) * 9) / 5 + 32;
    } else {
      const fromFactor = categories[category].units[fromUnit];
      const toFactor = categories[category].units[toUnit];
      const baseValue = amount * fromFactor;
      res = baseValue / toFactor;
    }
    setResult(res);
  }, [amount, fromUnit, toUnit, category]);

  return (
    <>
      <SEO
        title={t("tools.unit_converter.name")}
        description={t("tools.unit_converter.desc")}
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <RefreshCw className="text-green-600 w-10 h-10" />{" "}
          {t("tools.unit_converter.header")}
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
          {/* Kategori Seçimi */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {Object.keys(categories).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition whitespace-nowrap ${
                  category === cat
                    ? "bg-green-600 text-white shadow-lg shadow-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {categories[cat].icon} {t(`tools.unit_converter.${cat}`)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center">
            {/* GİRİŞ */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("tools.unit_converter.from")}
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  className="w-full p-4 border border-gray-300 rounded-xl text-xl font-mono focus:ring-2 focus:ring-green-500 outline-none"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                >
                  {Object.keys(categories[category].units).map((u) => (
                    <option key={u} value={u}>
                      {u.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DEĞİŞTİR */}
            <div className="md:col-span-1 flex justify-center text-gray-400">
              <button
                onClick={handleSwap}
                className="p-3 rounded-full hover:bg-green-50 hover:text-green-600 transition-all duration-300 group"
              >
                <ArrowRightLeft
                  className="transform group-hover:rotate-180 transition-transform duration-500"
                  size={32}
                />
              </button>
            </div>

            {/* SONUÇ */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("tools.unit_converter.to")}
              </label>
              <div className="flex flex-col gap-2">
                <div className="w-full p-4 bg-green-50 border border-green-100 rounded-xl text-xl font-mono text-green-700 font-bold overflow-hidden truncate">
                  {result.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                >
                  {Object.keys(categories[category].units).map((u) => (
                    <option key={u} value={u}>
                      {u.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <AdBanner slot="5555555555" />
          </div>
        </div>

        {/* REKLAM 2 */}
        <AdBanner slot="9988776655" className="mb-12" />

      </div>
    </>
  );
};
export default UnitConverter;
