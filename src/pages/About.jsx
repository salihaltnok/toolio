import React from "react";
import SEO from "../components/SEO";
import { User, Shield, Zap, Globe, Code, Heart, Coffee } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../components/AdBanner";

const About = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: t("about.fast_title"),
      desc: t("about.fast_desc"),
      bg: "bg-yellow-50",
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: t("about.secure_title"),
      desc: t("about.secure_desc"),
      bg: "bg-green-50",
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      title: t("about.free_title"),
      desc: t("about.free_desc"),
      bg: "bg-blue-50",
    },
    {
      icon: <Code className="w-6 h-6 text-purple-600" />,
      title: t("about.modern_title"),
      desc: t("about.modern_desc"),
      bg: "bg-purple-50",
    },
  ];

  return (
    <>
      <SEO title={t("about.page_title")} description={t("about.hero_desc")} />

      <div className="min-h-screen bg-white">
        {/* HERO SECTION - GÜNCELLENDİ (Daha Kısa) */}
        {/* ⚠️ h-[400px]: Yüksekliği kısalttık (Önceki 600px idi) */}
        <div className="relative h-[400px] overflow-hidden isolate flex flex-col justify-end pb-12">
          {/* ARKA PLAN RESMİ */}
          <img
            src="/Toolio.png"
            alt="Toolio Team"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />

          {/* KARARTMA KATMANI */}
          <div className="absolute inset-0 -z-10 bg-gray-900/80 mix-blend-multiply"></div>

          {/* PARLAMA EFEKTLERİ */}
          <div
            className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
            aria-hidden="true"
          >
            <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"></div>
          </div>

          {/* İÇERİK (YAZILAR) */}
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4 drop-shadow-lg">
              {t("about.hero_title")}
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-200 max-w-2xl mx-auto drop-shadow-md">
              {t("about.hero_desc")}
            </p>
          </div>
        </div>

        {/* MİSYON & HİKAYE (Aynı kalıyor) */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                {t("about.story_title")}
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>{t("about.story_p1")}</p>
                <p>{t("about.story_p2")}</p>
              </div>
              {/* İKONLAR */}
              <div className="mt-8 flex gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  <Heart size={16} className="text-red-500" /> Made with Love
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  <Coffee size={16} className="text-amber-700" /> Powered by
                  Coffee
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl ${feature.bg} border border-gray-100/50 hover:shadow-lg transition-shadow duration-300`}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TEKNOLOJİ YIĞINI */}
        <div className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-12">
              {t("about.tech_stack_title")}
            </h2>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-2xl font-bold text-gray-400 hover:text-[#61DAFB]">
                React
              </span>
              <span className="text-2xl font-bold text-gray-400 hover:text-[#06B6D4]">
                Tailwind
              </span>
              <span className="text-2xl font-bold text-gray-400 hover:text-[#00ADD8]">
                Go
              </span>
              <span className="text-2xl font-bold text-gray-400 hover:text-[#F29F39]">
                Firebase
              </span>
              <span className="text-2xl font-bold text-gray-400 hover:text-[#339933]">
                Node.js
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <AdBanner slot="1234567890" />
        </div>
      </div>
    </>
  );
};

export default About;
