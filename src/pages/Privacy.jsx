import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import SEO from "../components/SEO";
import LegalSections from "../components/LegalSections";
import { CONTACT_EMAIL } from "../lib/site";

const Privacy = () => {
  const { t } = useTranslation();
  const sections = t("privacy.sections", { returnObjects: true });

  return (
    <>
      <SEO title={t("privacy.page_title")} description={t("privacy.meta_desc")} />
      <article className="bg-white rounded-3xl border border-gray-100 shadow-sm py-12 px-6 sm:px-12">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-12">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              {t("privacy.page_title")}
            </h1>
            <p className="text-gray-500">
              {t("privacy.last_updated")}: {t("legal.updated_date")}
            </p>
          </header>

          <p className="text-gray-600 leading-relaxed mb-10">
            {t("privacy.summary")}
          </p>

          <LegalSections sections={sections} />

          <div className="mt-14 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              {t("privacy.contact_note")}{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-indigo-600 font-medium"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </article>
    </>
  );
};

export default Privacy;
