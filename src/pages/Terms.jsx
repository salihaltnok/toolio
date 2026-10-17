import React from "react";
import SEO from "../components/SEO";
import { useTranslation } from "react-i18next";
import { Scale, FileWarning, Copyright, AlertCircle } from "lucide-react";

const Terms = () => {
  const { t } = useTranslation();

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
        title={t("terms.page_title")}
        description="Toolio Kullanım Şartları"
      />

      <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {t("terms.page_title")}
            </h1>
            <p className="text-gray-500">
              {t("privacy.last_updated")}: 17.10.2026
            </p>
          </div>

          <div className="prose prose-indigo max-w-none">
            <Section
              icon={<Scale size={24} />}
              title={t("terms.acceptance_title")}
            >
              <p>{t("terms.acceptance_desc")}</p>
            </Section>

            <Section
              icon={<FileWarning size={24} />}
              title={t("terms.disclaimer_title")}
            >
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                <p className="font-medium">{t("terms.disclaimer_note")}</p>
              </div>
              <p className="mt-4">{t("terms.disclaimer_desc")}</p>
            </Section>

            <Section
              icon={<Copyright size={24} />}
              title={t("terms.copyright_title")}
            >
              <p>{t("terms.copyright_desc")}</p>
            </Section>

            <Section
              icon={<AlertCircle size={24} />}
              title={t("terms.changes_title")}
            >
              <p>{t("terms.changes_desc")}</p>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
