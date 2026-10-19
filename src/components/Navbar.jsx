import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Search, Globe, ChevronRight } from "lucide-react";
import { VISIBLE_TOOLS } from "../data/tools";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const currentLang = (i18n.resolvedLanguage || i18n.language || "tr").slice(0, 2);
  const otherLang = currentLang === "tr" ? "en" : "tr";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = () => i18n.changeLanguage(otherLang);

  const query = searchQuery.trim().toLocaleLowerCase();
  const filteredTools = VISIBLE_TOOLS.filter((tool) =>
    t(`tools.${tool.key}.name`).toLocaleLowerCase().includes(query),
  );

  const handleSearchSelect = (path) => {
    navigate(path);
    setShowResults(false);
    setSearchQuery("");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md border-b border-gray-100"
          : "bg-white border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2" aria-label="Toolio">
            <img
              src="/toolio-icon.svg"
              alt=""
              width="32"
              height="32"
              className="w-8 h-8"
            />
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Tool<span className="text-indigo-600">io</span>
            </span>
          </Link>

          {/* ARAMA (Masaüstü) */}
          <div
            className="hidden md:block flex-1 max-w-md mx-8 relative"
            ref={searchRef}
          >
            <div
              className={`flex items-center bg-gray-100 rounded-full px-4 py-2.5 transition-all duration-300 border ${
                showResults
                  ? "border-indigo-500 ring-2 ring-indigo-100 bg-white"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              <Search size={18} className="text-gray-400 mr-3" />
              <input
                type="search"
                aria-label={t("navbar.search_placeholder")}
                placeholder={t("navbar.search_placeholder")}
                className="bg-transparent border-none outline-none text-gray-700 w-full text-sm font-medium placeholder-gray-400"
                value={searchQuery}
                onFocus={() => setShowResults(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
              />
            </div>

            {showResults && query && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden max-h-80 overflow-y-auto">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        type="button"
                        key={tool.slug}
                        onClick={() => handleSearchSelect(tool.path)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition text-left text-gray-700 hover:text-indigo-700"
                      >
                        <div className="text-indigo-500 bg-indigo-50 p-2 rounded-lg">
                          <Icon size={16} />
                        </div>
                        <span className="font-medium text-sm">
                          {t(`tools.${tool.key}.name`)}
                        </span>
                        <ChevronRight size={14} className="ml-auto opacity-50" />
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    {t("navbar.no_results")}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* LİNKLER & DİL */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition"
            >
              {t("navbar.home")}
            </Link>
            <Link
              to="/about/"
              className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition"
            >
              {t("navbar.about")}
            </Link>
            <Link
              to="/contact/"
              className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition"
            >
              {t("footer.contact")}
            </Link>

            <button
              type="button"
              onClick={changeLanguage}
              aria-label={t("navbar.switch_language")}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition text-sm font-bold text-gray-700"
            >
              <Globe size={16} className="text-indigo-600" />
              <span>{otherLang.toUpperCase()}</span>
            </button>
          </div>

          {/* MOBİL MENÜ BUTONU */}
          <div className="md:hidden flex items-center gap-4">
            <button
              type="button"
              onClick={changeLanguage}
              aria-label={t("navbar.switch_language")}
              className="bg-gray-100 p-2 rounded-full text-gray-700"
            >
              <span className="font-bold text-xs">{otherLang.toUpperCase()}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={t("navbar.menu")}
              aria-expanded={isMobileMenuOpen}
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBİL MENÜ */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="search"
                aria-label={t("navbar.search_placeholder")}
                placeholder={t("navbar.search_placeholder")}
                className="w-full outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {query && (
              <div className="mt-2 bg-white rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => (
                    <button
                      type="button"
                      key={tool.slug}
                      onClick={() => handleSearchSelect(tool.path)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 border-b border-gray-50 last:border-0 hover:bg-indigo-50"
                    >
                      {t(`tools.${tool.key}.name`)}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    {t("navbar.no_results")}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col p-4 space-y-2">
            {[
              { to: "/", label: t("navbar.home") },
              { to: "/about/", label: t("navbar.about") },
              { to: "/contact/", label: t("footer.contact") },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-indigo-50 text-gray-700 font-bold hover:text-indigo-600 transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
