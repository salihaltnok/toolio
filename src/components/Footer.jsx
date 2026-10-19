import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Globe } from "lucide-react";
import { VISIBLE_TOOLS } from "../data/tools";
import { CONTACT_EMAIL } from "../lib/site";

const QUICK_LINKS = [
  "pdf-merge",
  "image-compressor",
  "password-generator",
  "qr-generator",
  "word-counter",
];

const linkClass =
  "hover:text-indigo-400 hover:translate-x-1 transition-all inline-block";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || i18n.language || "tr").slice(0, 2);
  const quickTools = QUICK_LINKS.map((slug) =>
    VISIBLE_TOOLS.find((tool) => tool.slug === slug),
  ).filter(Boolean);

  const languages = [
    { code: "tr", flag: "🇹🇷", label: "Türkçe" },
    { code: "en", flag: "🇬🇧", label: "English" },
  ];

  return (
    <footer className="bg-[#111827] text-gray-400 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo ve kısa tanım */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center gap-3 text-2xl font-bold text-white group"
            >
              <img
                src="/toolio-icon.svg"
                alt=""
                width="40"
                height="40"
                className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
              />
              <span className="tracking-tight">
                Tool<span className="text-indigo-500">io</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              {t("footer.desc")}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition text-sm"
            >
              <Mail size={16} /> {CONTACT_EMAIL}
            </a>
          </div>

          {/* Popüler araçlar */}
          <div>
            <h2 className="text-white font-semibold text-lg mb-6">
              {t("footer.quick_links")}
            </h2>
            <ul className="space-y-3 text-sm">
              {quickTools.map((tool) => (
                <li key={tool.slug}>
                  <Link to={tool.path} className={linkClass}>
                    {t(`tools.${tool.key}.name`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h2 className="text-white font-semibold text-lg mb-6">
              {t("footer.legal")}
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about/" className={linkClass}>
                  {t("navbar.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact/" className={linkClass}>
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link to="/privacy/" className={linkClass}>
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link to="/terms/" className={linkClass}>
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Dil seçimi */}
          <div>
            <h2 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <Globe size={18} className="text-indigo-500" />
              {t("footer.language")}
            </h2>
            <div className="flex flex-col gap-3">
              {languages.map((lang) => (
                <button
                  type="button"
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  aria-pressed={currentLang === lang.code}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                    currentLang === lang.code
                      ? "border-indigo-500 bg-indigo-500/10 text-white"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <span className="text-xl" aria-hidden="true">
                    {lang.flag}
                  </span>
                  <span className="font-medium">{lang.label}</span>
                  {currentLang === lang.code && (
                    <span className="ml-auto w-2 h-2 bg-indigo-500 rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm flex flex-col sm:flex-row gap-2 justify-between">
          <p>
            © {new Date().getFullYear()} Toolio. {t("footer.rights")}
          </p>
          <p>{t("footer.bottom_note")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
