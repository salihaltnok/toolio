import { useTranslation } from "react-i18next";

const PageLoader = () => {
  const { t } = useTranslation();
  return (
    <div
      className="flex items-center justify-center py-32"
      role="status"
      aria-live="polite"
    >
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <span className="sr-only">{t("common.loading")}</span>
    </div>
  );
};

export default PageLoader;
