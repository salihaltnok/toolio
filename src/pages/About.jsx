import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Shield, Zap, Globe, Code, Mail } from "lucide-react";
import SEO from "../components/SEO";
import { VISIBLE_TOOLS } from "../data/tools";
import { CONTACT_EMAIL } from "../lib/site";

const asArray = (value) => (Array.isArray(value) ? value : []);

const About = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50", key: "fast" },
    { icon: Shield, color: "text-green-600", bg: "bg-green-50", key: "secure" },
    { icon: Globe, color: "text-blue-600", bg: "bg-blue-50", key: "free" },
    { icon: Code, color: "text-purple-600", bg: "bg-purple-50", key: "modern" },
  ];

  const howItWorks = asArray(t("about.how_list", { returnObjects: true }));
  const stack = asArray(t("about.stack_list", { returnObjects: true }));

  return (
    <>
      <SEO title={t("about.page_title")} description={t("about.meta_desc")} />

      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        {/* HERO */}
        <div className="relative h-[360px] overflow-hidden isolate flex flex-col justify-end pb-12">
          <picture>
            <source srcSet="/toolio-hero.webp" type="image/webp" />
            <img
              src="/toolio-hero.jpg"
              alt=""
              width="1600"
              height="1073"
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 -z-10 bg-gray-900/75"></div>
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4 drop-shadow-lg">
              {t("about.hero_title")}
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-200 max-w-2xl mx-auto drop-shadow-md">
              {t("about.hero_desc")}
            </p>
          </div>
        </div>

        {/* HİKAYE + ÖZELLİKLER */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
                {t("about.story_title")}
              </h2>
              <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                <p>{t("about.story_p1")}</p>
                <p>{t("about.story_p2", { count: VISIBLE_TOOLS.length })}</p>
                <p>{t("about.story_p3")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.key}
                    className={`p-6 rounded-2xl ${feature.bg} border border-gray-100/50`}
                  >
                    <Icon className={`w-6 h-6 mb-4 ${feature.color}`} />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {t(`about.${feature.key}_title`)}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t(`about.${feature.key}_desc`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* NASIL ÇALIŞIR */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
              {t("about.how_title")}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {t("about.how_intro")}
            </p>
            <ul className="space-y-3 list-disc pl-6 text-gray-600 leading-relaxed marker:text-indigo-500">
              {howItWorks.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* KİM, NEDEN, REKLAMLAR */}
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("about.who_title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">{t("about.who_desc")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("about.ads_title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("about.ads_desc")}{" "}
              <Link to="/privacy/" className="text-indigo-600 font-medium hover:underline">
                {t("footer.privacy")}
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("about.tech_stack_title")}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              {t("about.tech_stack_desc")}
            </p>
            <ul className="flex flex-wrap gap-3">
              {stack.map((item) => (
                <li
                  key={item}
                  className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t("about.contact_title")}
            </h2>
            <p className="text-gray-600 mb-6">{t("about.contact_desc")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/contact/"
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                {t("footer.contact")}
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:border-indigo-300 transition"
              >
                <Mail size={18} /> {CONTACT_EMAIL}
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;
