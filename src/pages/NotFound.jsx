import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SearchX } from "lucide-react";
import SEO from "../components/SEO";
import { VISIBLE_TOOLS } from "../data/tools";

const POPULAR = ["pdf-merge", "image-compressor", "password-generator", "word-counter"];

const NotFound = () => {
  const { t } = useTranslation();
  const popular = POPULAR.map((slug) =>
    VISIBLE_TOOLS.find((tool) => tool.slug === slug),
  ).filter(Boolean);

  return (
    <>
      <SEO title={t("not_found.title")} description={t("not_found.desc")} noindex />
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <SearchX size={32} />
        </div>
        <p className="text-sm font-semibold text-indigo-600 mb-2">404</p>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          {t("not_found.title")}
        </h1>
        <p className="text-gray-600 mb-8">{t("not_found.desc")}</p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          {t("not_found.back_home")}
        </Link>

        <h2 className="text-lg font-bold text-gray-900 mt-14 mb-4">
          {t("not_found.popular")}
        </h2>
        <ul className="flex flex-wrap justify-center gap-3">
          {popular.map((tool) => (
            <li key={tool.slug}>
              <Link
                to={tool.path}
                className="inline-block px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition"
              >
                {t(`tools.${tool.key}.name`)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NotFound;
