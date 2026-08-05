import React from "react";
import SEO from "../components/SEO";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Lock, Server, Cookie } from "lucide-react";

const Privacy = () => {
  const { t } = useTranslation();

  // Stil Tanımları
  const Section = ({ icon, title, children }) => (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="pl-0 md:pl-14 text-gray-600 leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );

  return (
    <>
      <SEO
        title={t("privacy.page_title")}
        description="Toolio Gizlilik Politikası"
      />

      <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {t("privacy.page_title")}
            </h1>
            <p className="text-gray-500">
              {t("privacy.last_updated")}: 27.12.2025
            </p>
          </div>

          {/* İçerik */}
          <div className="prose prose-indigo max-w-none">
            <Section
              icon={<ShieldCheck size={24} />}
              title={t("privacy.intro_title")}
            >
              <p>{t("privacy.intro_desc")}</p>
            </Section>

            <Section
              icon={<Lock size={24} />}
              title={t("privacy.data_collection_title")}
            >
              <p>{t("privacy.data_collection_desc")}</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>{t("privacy.client_side")}:</strong>{" "}
                  {t("privacy.client_side_desc")}
                </li>
              </ul>
            </Section>

            <Section
              icon={<Server size={24} />}
              title={t("privacy.server_side_title")}
            >
              <p>{t("privacy.server_side_desc")}</p>
            </Section>

            <Section
              icon={<Cookie size={24} />}
              title={t("privacy.cookies_title")}
            >
              <p>{t("privacy.cookies_desc")}</p>
              <p className="text-sm bg-gray-50 p-3 rounded border border-gray-100 mt-2">
                Google AdSense ve Google Analytics gibi üçüncü taraf hizmetler,
                tarayıcınıza çerez yerleştirebilir.
              </p>
            </Section>
          </div>

          {/* Alt Bilgi */}
          <div className="mt-16 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              {t("privacy.contact_note")}{" "}
              <a
                href="mailto:info@toolio.com.tr"
                className="text-indigo-600 font-medium"
              >
                info@toolio.com.tr
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
