import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { ListChecks, Users, Lightbulb, HelpCircle } from "lucide-react";
import SEO from "./SEO";
import { SITE_URL } from "../lib/site";

const asArray = (value) => (Array.isArray(value) ? value : []);

/**
 * Her araç sayfasının altındaki rehber bölümü.
 * Metinler çeviri dosyalarındaki guide.<araç-anahtarı> bölümünden gelir:
 *   seo_title, meta, intro, steps[], uses[], tips[], faq[{q,a}]
 */
const ToolGuide = ({ tool }) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const guide = t(`guide.${tool.key}`, { returnObjects: true });

  if (!guide || typeof guide !== "object") return null;

  const name = t(`tools.${tool.key}.name`);
  const steps = asArray(guide.steps);
  const uses = asArray(guide.uses);
  const tips = asArray(guide.tips);
  const faq = asArray(guide.faq).filter((item) => item && item.q && item.a);
  const lang = i18n.resolvedLanguage || i18n.language || "tr";
  const url = `${SITE_URL}${pathname}`;

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description: guide.meta || t(`tools.${tool.key}.desc`),
    url,
    inLanguage: lang,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
    publisher: { "@type": "Organization", name: "Toolio", url: SITE_URL },
  };

  const faqSchema =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  const sectionTitle = "flex items-center gap-3 text-2xl font-bold text-gray-900 mb-5";
  const iconBox = "p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0";

  return (
    <>
      {/* Araç bileşenindeki kısa açıklamanın yerine daha zengin başlık/açıklama */}
      <SEO
        title={guide.seo_title || name}
        description={guide.meta || t(`tools.${tool.key}.desc`)}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(appSchema)}</script>
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>

      <section
        className="max-w-4xl mx-auto mt-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 text-gray-700 leading-relaxed"
        aria-labelledby={`guide-${tool.slug}`}
      >
        {guide.intro && (
          <div className="mb-10">
            <h2
              id={`guide-${tool.slug}`}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
            >
              {t("guide_ui.about_tool", { tool: name })}
            </h2>
            {String(guide.intro)
              .split("\n\n")
              .map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
          </div>
        )}

        {steps.length > 0 && (
          <div className="mb-10">
            <h2 className={sectionTitle}>
              <span className={iconBox}>
                <ListChecks size={22} />
              </span>
              {t("guide_ui.how_to", { tool: name })}
            </h2>
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-none w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {uses.length > 0 && (
          <div className="mb-10">
            <h2 className={sectionTitle}>
              <span className={iconBox}>
                <Users size={22} />
              </span>
              {t("guide_ui.uses")}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {uses.map((item, index) => (
                <li
                  key={index}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-4"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tips.length > 0 && (
          <div className="mb-10">
            <h2 className={sectionTitle}>
              <span className={iconBox}>
                <Lightbulb size={22} />
              </span>
              {t("guide_ui.tips")}
            </h2>
            <ul className="space-y-3 list-disc pl-6 marker:text-indigo-500">
              {tips.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {faq.length > 0 && (
          <div>
            <h2 className={sectionTitle}>
              <span className={iconBox}>
                <HelpCircle size={22} />
              </span>
              {t("guide_ui.faq")}
            </h2>
            <div className="divide-y divide-gray-100 border-y border-gray-100">
              {faq.map((item, index) => (
                <div key={index} className="py-5">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ToolGuide;
