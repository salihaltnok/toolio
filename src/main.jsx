import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import "./index.css";
import i18n from "./i18n/client";
import App from "./App.jsx";
import { findToolByPath } from "./data/tools";
import { DEFAULT_LANGUAGE } from "./i18n/resources";

const container = document.getElementById("root");

const app = (
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </I18nextProvider>
  </StrictMode>
);

const start = () => {
  const hasPrerenderedHtml = container.hasChildNodes();
  const sameLanguage = i18n.resolvedLanguage === DEFAULT_LANGUAGE;

  if (hasPrerenderedHtml && sameLanguage) {
    // Build sırasında üretilmiş HTML'i yeniden çizmeden canlandır.
    hydrateRoot(container, app);
  } else {
    createRoot(container).render(app);
  }
};

// Açılan sayfa bir araçsa, kodunu render'dan önce yükle (ekranda titreme olmasın).
const tool = findToolByPath(window.location.pathname);
if (tool) {
  tool.Component.preload().then(start, start);
} else {
  start();
}
