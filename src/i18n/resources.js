import trTranslation from "../locales/tr/translation.json";
import enTranslation from "../locales/en/translation.json";
import trGuide from "../locales/tr/guide.json";
import enGuide from "../locales/en/guide.json";

/**
 * Çeviriler artık JS paketinin içinde geliyor (eskiden /locales/*.json
 * sonradan indiriliyordu). Böylece:
 *  - Sayfa "Yükleniyor..." yazısında takılı kalmıyor,
 *  - Build sırasında her sayfa dolu HTML olarak üretilebiliyor (prerender).
 */
export const resources = {
  tr: { translation: { ...trTranslation, guide: trGuide } },
  en: { translation: { ...enTranslation, guide: enGuide } },
};

export const SUPPORTED_LANGUAGES = ["tr", "en"];
export const DEFAULT_LANGUAGE = "tr";

export const baseOptions = {
  resources,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  load: "languageOnly",
  nonExplicitSupportedLngs: true,
  returnNull: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
};
