import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage("tr")}
        className={`px-2 py-1 rounded border ${
          i18n.language.startsWith("tr")
            ? "bg-indigo-100 border-indigo-500 text-indigo-700"
            : "bg-white text-gray-600 border-gray-200"
        }`}
      >
        TR
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={`px-2 py-1 rounded border ${
          i18n.language.startsWith("en")
            ? "bg-indigo-100 border-indigo-500 text-indigo-700"
            : "bg-white text-gray-600 border-gray-200"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
