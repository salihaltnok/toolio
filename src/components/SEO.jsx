import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SITE_URL, SITE_NAME } from "../lib/site";

/** Adresi her zaman sonda "/" olacak şekilde normalize eder (prerender klasör yapısıyla aynı). */
const normalizePath = (pathname) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
};

const SEO = ({ title, description, fullTitle, noindex = false }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || "tr";

  const currentUrl = `${SITE_URL}${normalizePath(location.pathname)}`;
  const image = `${SITE_URL}/og-image.jpg`;
  const finalTitle = fullTitle || `${title} | ${SITE_NAME}`;
  const finalDescription = description || t("home.meta_desc");

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <link rel="canonical" href={currentUrl} />
      )}

      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={lang === "en" ? "en_US" : "tr_TR"} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* X / Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
