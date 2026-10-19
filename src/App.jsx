import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import PageLoader from "./components/PageLoader";
import ToolPage from "./components/ToolPage";

import Home from "./pages/Home";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import { VISIBLE_TOOLS } from "./data/tools";

// Sayfa değiştiğinde en üste kaydır
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || "tr";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Helmet>
        <html lang={lang} />
      </Helmet>
      <ScrollToTop />
      <Navbar />

      <div className="flex-grow pt-20">
        <Layout>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />

                {VISIBLE_TOOLS.map((tool) => (
                  <Route
                    key={tool.slug}
                    path={`/${tool.slug}`}
                    element={<ToolPage tool={tool} />}
                  />
                ))}

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Layout>
      </div>

      <Footer />
    </div>
  );
}

export default App;
