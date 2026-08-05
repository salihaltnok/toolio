import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Globe } from "lucide-react";

const Footer = () => {
  const { t, i18n } = useTranslation();

  // Dil Değiştirme Fonksiyonu
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <footer className="bg-[#111827] text-gray-400 border-t border-gray-800 mt-auto">
      {/* Üst Kısım */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* 1. Sütun: Logo ve Hakkında */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center gap-3 text-2xl font-bold text-white group"
            >
              <img
                src="/toolio-icon.svg"
                alt="Toolio Logo"
                className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
              />
              {/* ✨ RENKLİ LOGO KISMI ✨ */}
              <span className="tracking-tight">
                Tool<span className="text-indigo-500">io</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-400">
              {t("footer.desc")}
            </p>

            {/* --- SOSYAL MEDYA LİNKLERİ --- */}
            <div className="flex gap-4 pt-2">
              <a
                href="mailto:info@toolio.com.tr"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 hover:text-white transition"
                title={t("footer.send_email")}
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* 2. Sütun: Hızlı Linkler */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              {t("footer.quick_links")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block"
                >
                  {t("footer.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/password-generator"
                  className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block"
                >
                  {t("tools.password_gen.name")}
                </Link>
              </li>
              <li>
                <Link
                  to="/qr-generator"
                  className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block"
                >
                  {t("tools.qr_generator.name")}
                </Link>
              </li>
              <li>
                <Link
                  to="/pomodoro"
                  className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block"
                >
                  {t("tools.pomodoro.name")}
                </Link>
              </li>
              <li>
                <Link
                  to="/counter"
                  className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block"
                >
                  {t("tools.counter.name")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Sütun: Yasal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block"
                >
                  {t("navbar.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block"
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Sütun: Dil Seçimi */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <Globe size={18} className="text-indigo-500" />{" "}
              {t("footer.language")}
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => changeLanguage("tr")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                  i18n.language === "tr"
                    ? "border-indigo-500 bg-indigo-500/10 text-white"
                    : "border-gray-700 hover:border-gray-500"
                }`}
              >
                <span className="text-xl">🇹🇷</span>
                <span className="font-medium">Türkçe</span>
                {i18n.language === "tr" && (
                  <div className="ml-auto w-2 h-2 bg-indigo-500 rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => changeLanguage("en")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                  i18n.language === "en"
                    ? "border-indigo-500 bg-indigo-500/10 text-white"
                    : "border-gray-700 hover:border-gray-500"
                }`}
              >
                <span className="text-xl">🇺🇸</span>
                <span className="font-medium">English</span>
                {i18n.language === "en" && (
                  <div className="ml-auto w-2 h-2 bg-indigo-500 rounded-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ⚠️ İŞTE EKSİK OLAN SATIR BU:
export default Footer;
