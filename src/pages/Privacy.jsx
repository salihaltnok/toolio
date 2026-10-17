import React from "react";
import SEO from "../components/SEO";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Lock, Server, Cookie } from "lucide-react";

const Privacy = () => {
  const { t, i18n } = useTranslation();
  const isTr = i18n.language?.startsWith("tr");

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
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {t("privacy.page_title")}
            </h1>
            <p className="text-gray-500">
              {t("privacy.last_updated")}: 17.10.2026
            </p>
          </div>

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
              <div className="text-sm bg-gray-50 p-4 rounded-xl border border-gray-100 mt-3 space-y-2">
                <p>
                  {isTr
                    ? "Google dahil üçüncü taraf tedarikçiler, kullanıcılara sitemizdeki ve internetteki diğer sitelerdeki önceki ziyaretlerine dayalı olarak reklam sunmak için çerezleri (DoubleClick DART çerezi dahil) kullanmaktadır."
                    : "Third-party vendors, including Google, use cookies (including the DoubleClick DART cookie) to serve ads based on a user's prior visits to our website or other websites."}
                </p>
                <p>
                  {isTr
                    ? "Kullanıcılar, Google Reklam Ayarları sayfasını ziyaret ederek kişiselleştirilmiş reklamcılığı devre dışı bırakabilirler: "
                    : "Users may opt out of personalized advertising by visiting Google Ads Settings: "}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline font-medium"
                  >
                    https://adssettings.google.com
                  </a>
                </p>
              </div>
            </Section>
          </div>

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
