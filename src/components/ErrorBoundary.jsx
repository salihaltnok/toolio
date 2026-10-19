import { Component } from "react";
import { withTranslation } from "react-i18next";

const RELOAD_FLAG = "toolio-chunk-reload";

/**
 * Bir sayfanın kodu yüklenemezse (ör. yeni sürüm yayınlandıktan sonra eski
 * sekmede gezinirken) beyaz ekran yerine sayfayı bir kez otomatik yeniler,
 * olmazsa kullanıcıya yenile butonu gösterir.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    const message = String(error?.message || "");
    const isChunkError =
      /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
        message,
      );
    if (isChunkError && typeof window !== "undefined") {
      let alreadyReloaded = false;
      try {
        alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG) === "1";
        sessionStorage.setItem(RELOAD_FLAG, "1");
      } catch {
        // sessionStorage kapalı olabilir
      }
      if (!alreadyReloaded) window.location.reload();
    }
  }

  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      return (
        <div className="max-w-lg mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {t("common.error_title")}
          </h1>
          <p className="text-gray-600 mb-6">{t("common.error_desc")}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            {t("common.reload")}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TranslatedErrorBoundary = withTranslation()(ErrorBoundary);
export default TranslatedErrorBoundary;
