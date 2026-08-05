import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SEO = ({ title, description }) => {
  const location = useLocation();
  const siteUrl = "https://toolio.com.tr";
  const currentUrl = `${siteUrl}${location.pathname}`;
  const image = `${siteUrl}/toolio-icon.svg`; // Veya özel bir kapak resmi yolu

  const fullTitle = `${title} | Toolio - Ücretsiz Web Araçları`;

  return (
    <Helmet>
      {/* Temel Meta Etiketleri */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph (Facebook, WhatsApp, LinkedIn için) */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Kartları */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicon Tanımları (Garanti Olsun) */}
      <link rel="icon" type="image/svg+xml" href="/toolio-icon.svg" />
    </Helmet>
  );
};

export default SEO;
