import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { baseOptions } from "./resources";

/**
 * Dil seçimi:
 *  - Varsayılan Türkçe (prerender edilen HTML ile aynı dil).
 *  - Kullanıcı EN/TR butonuyla dil seçerse tercih localStorage'a kaydedilir.
 *  - ?lang=en parametresi ile de İngilizce açılabilir.
 * Tarayıcı dilini otomatik algılamıyoruz; böylece Google'ın gördüğü HTML ile
 * kullanıcının ilk gördüğü sayfa aynı dilde olur.
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...baseOptions,
    initAsync: false,
    detection: {
      order: ["querystring", "localStorage"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
      convertDetectedLanguage: (lng) => String(lng).slice(0, 2).toLowerCase(),
    },
  });

const syncHtmlLang = (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = String(lng || "tr").slice(0, 2);
  }
};
syncHtmlLang(i18n.resolvedLanguage);
i18n.on("languageChanged", syncHtmlLang);

export default i18n;
