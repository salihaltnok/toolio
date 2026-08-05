import React from "react";
import SEO from "../components/SEO";
import { Mail, MapPin, Send, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subject = `Toolio İletişim: ${formData.get("name")}`;
    const body = `Ad: ${formData.get("name")}\nEmail: ${formData.get(
      "email"
    )}\n\nMesaj:\n${formData.get("message")}`;
    window.location.href = `mailto:info@toolio.com.tr?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <SEO
        title={t("contact.page_title")}
        description={t("contact.hero_desc")}
      />

      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t("contact.page_title")}
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              {t("contact.hero_desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SOL TARAFI: Bilgiler */}
            <div className="bg-indigo-600 rounded-2xl shadow-xl overflow-hidden text-white relative">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-2xl"></div>

              <div className="p-10 relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    {t("contact.info_title")}
                  </h3>
                  <p className="text-indigo-100 mb-8 leading-relaxed">
                    {t("contact.info_desc")}
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        {/* ⚠️ GÜNCELLENDİ: t("contact.email_label") */}
                        <p className="text-sm text-indigo-200">
                          {t("contact.email_label")}
                        </p>
                        <a
                          href="mailto:info@toolio.com.tr"
                          className="font-semibold text-lg hover:text-white transition"
                        >
                          info@toolio.com.tr
                        </a>
                        <p className="text-xs text-indigo-300 mt-1">
                          asalihensar@gmail.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        {/* ⚠️ GÜNCELLENDİ: t("contact.location_label") */}
                        <p className="text-sm text-indigo-200">
                          {t("contact.location_label")}
                        </p>
                        <p className="font-semibold text-lg">
                          İstanbul, Türkiye
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <p className="text-sm text-indigo-200 opacity-80">
                    Toolio.com.tr © 2025
                  </p>
                </div>
              </div>
            </div>

            {/* SAĞ TARAF: Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.form_name")}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder={t("contact.form_placeholder_name")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder={t("contact.form_placeholder_email")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.form_message")}
                  </label>
                  <textarea
                    rows="4"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                    placeholder={t("contact.form_placeholder_message")}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  {t("contact.form_btn")}
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Bölümü */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-50 px-4 py-2 rounded-full mb-4">
              <MessageSquare size={18} /> SSS
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("contact.faq_title")}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {t("contact.faq_desc")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
