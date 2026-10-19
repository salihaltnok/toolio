import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, ShieldCheck, Gift, Laptop } from "lucide-react";
import SEO from "../components/SEO";
import { CATEGORIES, VISIBLE_TOOLS } from "../data/tools";
import { SITE_URL } from "../lib/site";
import { Helmet } from "react-helmet-async";

const ToolCard = ({ tool, t }) => {
  const Icon = tool.icon;
  return (
    <Link
      to={tool.path}
      className="group h-full"
      onMouseEnter={() => tool.Component.preload()}
      onFocus={() => tool.Component.preload()}
    >
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-start relative overflow-hidden">
        <div
          className={`absolute top-0 right-0 w-24 h-24 ${tool.bgClass} opacity-20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150`}
        ></div>
        <div
          className={`${tool.bgClass} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}
        >
          <Icon className={`w-6 h-6 ${tool.iconClass}`} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
          {t(`tools.${tool.key}.name`)}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {t(`tools.${tool.key}.desc`)}
        </p>
      </div>
    </Link>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const { hash } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // "/#pdf" gibi kategori bağlantılarında ilgili bölüme kaydır
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  const term = searchTerm.trim().toLocaleLowerCase();
  const filteredTools = VISIBLE_TOOLS.filter((tool) => {
    if (!term) return true;
    const name = t(`tools.${tool.key}.name`).toLocaleLowerCase();
    const desc = t(`tools.${tool.key}.desc`).toLocaleLowerCase();
    return name.includes(term) || desc.includes(term);
  });

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Toolio",
    url: `${SITE_URL}/`,
    description: t("home.meta_desc"),
  };

  const features = [
    { icon: ShieldCheck, title: "home.feature1_title", desc: "home.feature1_desc" },
    { icon: Gift, title: "home.feature2_title", desc: "home.feature2_desc" },
    { icon: Laptop, title: "home.feature3_title", desc: "home.feature3_desc" },
  ];

  return (
    <>
      <SEO fullTitle={t("home.meta_title")} description={t("home.meta_desc")} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      </Helmet>

      {/* --- BAŞLIK VE ARAMA --- */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          {t("home.h1")}
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          {t("home.subtitle")}
        </p>

        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="search"
            aria-label={t("home.search_placeholder")}
            placeholder={t("home.search_placeholder")}
            className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- ARAÇLAR --- */}
      {term ? (
        filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} t={t} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">
              {t("home.no_results_title")}
            </h2>
            <p className="text-gray-500 mt-1">
              {t("home.no_results_desc", { term: searchTerm })}
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {t("home.show_all")}
            </button>
          </div>
        )
      ) : (
        <div className="space-y-12">
          {CATEGORIES.map((category) => {
            const tools = VISIBLE_TOOLS.filter(
              (tool) => tool.category === category.id,
            );
            if (tools.length === 0) return null;
            return (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-28"
                aria-labelledby={`cat-${category.id}`}
              >
                <div className="mb-5">
                  <h2
                    id={`cat-${category.id}`}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {t(category.key)}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    {t(`categories.${category.id}_desc`)}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} t={t} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* --- TANITIM / REHBER --- */}
      <section className="mt-20 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-gray-600 space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {t("home.seo_title")}
        </h2>
        <p className="leading-relaxed">{t("home.seo_p1")}</p>
        <p className="leading-relaxed">{t("home.seo_p2")}</p>
        <div className="grid md:grid-cols-3 gap-6 pt-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-gray-50 p-6 rounded-2xl border border-gray-100"
              >
                <Icon className="w-6 h-6 text-indigo-600 mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">
                  {t(feature.title)}
                </h3>
                <p className="text-sm leading-relaxed">{t(feature.desc)}</p>
              </div>
            );
          })}
        </div>
        <p className="text-sm leading-relaxed pt-2">
          {t("home.seo_more")}{" "}
          <Link to="/about/" className="text-indigo-600 font-medium hover:underline">
            {t("home.seo_more_link")}
          </Link>
        </p>
      </section>
    </>
  );
};

export default Home;
