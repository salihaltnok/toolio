import React, { useState } from "react";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import {
  Youtube,
  Search,
  Download,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

const YouTubeThumbnail = () => {
  const { t } = useTranslation();
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailData, setThumbnailData] = useState(null);
  const [error, setError] = useState("");

  const extractVideoId = (url) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : false;
  };

  const handleFetch = (e) => {
    e.preventDefault();
    setError("");
    setThumbnailData(null);

    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      setError(t("tools.youtube_thumb.error_url"));
      return;
    }

    setThumbnailData({
      hd: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      normal: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      videoId: videoId,
    });
  };

  const downloadImage = async (url, quality) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `youtube-thumbnail-${quality}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      // Eğer fetch engellenirse (CORS), direkt linki açtır
      window.open(url, "_blank");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title={t("tools.youtube_thumb.name")}
        description={t("tools.youtube_thumb.desc")}
      />

      {/* Başlık */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-2xl mb-4">
          <Youtube className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("tools.youtube_thumb.header")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("tools.youtube_thumb.subtext")}
        </p>
      </div>

      {/* Arama Kutusu */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mb-10">
        <form onSubmit={handleFetch} className="relative">
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition text-gray-800"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-red-600 hover:bg-red-700 text-white px-6 rounded-lg font-bold transition-colors"
          >
            {t("tools.youtube_thumb.fetch_btn")}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3 ml-2">{error}</p>}
      </div>

      {/* Sonuçlar */}
      {thumbnailData && (
        <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* HD Kalite */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4 relative group">
              <img
                src={thumbnailData.hd}
                alt="HD Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a
                  href={thumbnailData.hd}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white flex items-center gap-2 font-bold hover:underline"
                >
                  <ExternalLink size={20} /> Önizle
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">
                  HD Kalite (1280x720)
                </h3>
                <p className="text-sm text-gray-500">En yüksek çözünürlük</p>
              </div>
              <button
                onClick={() => downloadImage(thumbnailData.hd, "HD")}
                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                <Download size={18} /> İndir
              </button>
            </div>
          </div>

          {/* Diğer Kaliteler (Yan Yana) */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* SD Kalite */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <img
                src={thumbnailData.sd}
                alt="SD"
                className="w-full rounded-lg mb-3"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">
                  SD (640x480)
                </span>
                <button
                  onClick={() => downloadImage(thumbnailData.sd, "SD")}
                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>

            {/* Normal Kalite */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <img
                src={thumbnailData.normal}
                alt="Normal"
                className="w-full rounded-lg mb-3"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">
                  Normal (480x360)
                </span>
                <button
                  onClick={() => downloadImage(thumbnailData.normal, "Normal")}
                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

      {/* SEO Metni */}
      <article className="mt-12 prose prose-lg max-w-none text-gray-600 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-gray-800">
          {t("tools.youtube_thumb.content.title")}
        </h2>
        <p>{t("tools.youtube_thumb.content.p1")}</p>
        <h3 className="text-gray-800">{t("tools.youtube_thumb.content.h2")}</h3>
        <ul>
          <li>
            <strong>HD (1280x720):</strong>{" "}
            {t("tools.youtube_thumb.content.li1")}
          </li>
          <li>
            <strong>SD (640x480):</strong>{" "}
            {t("tools.youtube_thumb.content.li2")}
          </li>
          <li>
            <strong>Normal:</strong> {t("tools.youtube_thumb.content.li3")}
          </li>
        </ul>
      </article>
    </div>
  );
};

export default YouTubeThumbnail;
