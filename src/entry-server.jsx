/* eslint-disable react-refresh/only-export-components */
/**
 * Build sırasında (npm run build) her sayfanın hazır HTML'ini üretmek için
 * kullanılır. Tarayıcıda çalışmaz; scripts/prerender.mjs tarafından çağrılır.
 */
import { prerenderToNodeStream } from "react-dom/static";
import { StaticRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { createInstance } from "i18next";
import App from "./App.jsx";
import { baseOptions, DEFAULT_LANGUAGE } from "./i18n/resources";
import { TOOLS, VISIBLE_TOOLS, STATIC_PAGES } from "./data/tools";

export { VISIBLE_TOOLS, STATIC_PAGES };

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    let html = "";
    stream.setEncoding("utf8");
    stream.on("data", (chunk) => {
      html += chunk;
    });
    stream.on("end", () => resolve(html));
    stream.on("error", reject);
  });

export async function preloadAllTools() {
  await Promise.all(TOOLS.filter((t) => !t.hidden).map((t) => t.Component.preload()));
}

export async function render(url, lng = DEFAULT_LANGUAGE) {
  const i18n = createInstance();
  await i18n.use(initReactI18next).init({ ...baseOptions, lng, initAsync: false });

  const helmetContext = {};
  const { prelude } = await prerenderToNodeStream(
    <I18nextProvider i18n={i18n}>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </I18nextProvider>,
  );
  const html = await streamToString(prelude);
  const { helmet } = helmetContext;

  const head = helmet
    ? [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ].join("\n    ")
    : "";

  const htmlAttributes = helmet ? helmet.htmlAttributes.toString() : `lang="${lng}"`;
  return { html, head, htmlAttributes };
}
