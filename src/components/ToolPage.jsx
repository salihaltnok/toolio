import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import ToolGuide from "./ToolGuide";
import { VISIBLE_TOOLS } from "../data/tools";

/** Bir aracın sayfası: içerik haritası + aracın kendisi + rehber + benzer araçlar. */
const ToolPage = ({ tool }) => {
  const { t } = useTranslation();
  const Tool = tool.Component;

  const sameCategory = VISIBLE_TOOLS.filter(
    (item) => item.category === tool.category && item.slug !== tool.slug,
  );
  const others = VISIBLE_TOOLS.filter(
    (item) => item.category !== tool.category,
  );
  const related = [...sameCategory, ...others].slice(0, 4);

  return (
    <>
      <nav
        aria-label={t("common.breadcrumb")}
        className="max-w-5xl mx-auto mb-6 text-sm text-gray-500"
      >
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link to="/" className="hover:text-indigo-600">
              {t("footer.home")}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={14} />
          </li>
          <li>
            <Link
              to={`/#${tool.category}`}
              className="hover:text-indigo-600"
            >
              {t(`categories.${tool.category}`)}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={14} />
          </li>
          <li className="text-gray-700 font-medium" aria-current="page">
            {t(`tools.${tool.key}.name`)}
          </li>
        </ol>
      </nav>

      <Tool />

      <ToolGuide tool={tool} />

      {related.length > 0 && (
        <section className="max-w-5xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t("guide_ui.related")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.slug}
                  to={item.path}
                  onMouseEnter={() => item.Component.preload()}
                  className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div
                    className={`${item.bgClass} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}
                  >
                    <Icon className={`w-5 h-5 ${item.iconClass}`} />
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {t(`tools.${item.key}.name`)}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {t(`tools.${item.key}.desc`)}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
};

export default ToolPage;
