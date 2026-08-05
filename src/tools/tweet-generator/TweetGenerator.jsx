import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import {
  Download,
  Upload,
  BadgeCheck,
  MessageCircle, // Yeni İkonumuz bu olacak
  Repeat2,
  Heart,
  Share,
  MoreHorizontal,
  Instagram,
  Image as ImageIcon,
  Loader2,
  Bookmark,
  Send,
  MapPin,
  Lightbulb,
  Smile,
} from "lucide-react";

const TweetGenerator = () => {
  const { t } = useTranslation();
  const previewRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // --- STATE'LER ---
  const [platform, setPlatform] = useState("twitter");
  const [theme, setTheme] = useState("light");

  // Ortak Veriler
  const [name, setName] = useState("Jack Daniels");
  const [username, setUsername] = useState("jackdaniels");
  const [text, setText] = useState(
    "Toolio ile harika araçlar geliştiriyoruz! 🚀 #coding #react",
  );
  const [avatar, setAvatar] = useState(null);
  const [isVerified, setIsVerified] = useState(true);

  // Instagram Özel
  const [postImage, setPostImage] = useState(null);
  const [location, setLocation] = useState("Istanbul, Turkiye");

  // Metrikler
  const [time, setTime] = useState("10:30 ÖÖ");
  const [date, setDate] = useState("18 Oca 2026");
  const [views, setViews] = useState("1.2M");
  const [retweets, setRetweets] = useState("2.4B");
  const [quotes, setQuotes] = useState("450");
  const [likes, setLikes] = useState("14.5B");
  const [bookmarks, setBookmarks] = useState("1.1B");

  // Resim Yükleme (Avatar)
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAvatar(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Resim Yükleme (Post Image)
  const handlePostImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPostImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // İndirme Fonksiyonu
  const downloadImage = async () => {
    if (!previewRef.current) return;

    setIsDownloading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor:
          theme === "light"
            ? "#ffffff"
            : theme === "dim"
              ? "#15202b"
              : "#000000",
      });

      const link = document.createElement("a");
      link.download = `${platform}-post-${username}-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("İndirme hatası:", error);
      alert("Resim oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsDownloading(false);
    }
  };

  const themeStyles = {
    light: {
      bg: "bg-white",
      text: "text-black",
      subText: "text-gray-500",
      border: "border-gray-100",
      hover: "hover:bg-gray-100",
    },
    dim: {
      bg: "bg-[#15202b]",
      text: "text-white",
      subText: "text-[#8b98a5]",
      border: "border-[#38444d]",
      hover: "hover:bg-[#1c2732]",
    },
    dark: {
      bg: "bg-black",
      text: "text-[#e7e9ea]",
      subText: "text-[#71767b]",
      border: "border-[#2f3336]",
      hover: "hover:bg-[#16181c]",
    },
  };

  const currentStyle = themeStyles[theme];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <SEO
        title={t("tools.tweet_gen.name")}
        description={t("tools.tweet_gen.desc")}
      />

      {/* HEADER */}
      <div className="text-center mb-10">
        <div
          className={`inline-flex items-center justify-center p-3 rounded-2xl mb-4 transition-colors ${platform === "twitter" ? "bg-sky-100" : "bg-pink-100"}`}
        >
          {/* BURADA LOGO DEĞİŞTİ: Twitter yerine MessageCircle */}
          {platform === "twitter" ? (
            <MessageCircle className="w-8 h-8 text-sky-500" />
          ) : (
            <Instagram className="w-8 h-8 text-pink-500" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("tools.tweet_gen.header")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("tools.tweet_gen.subtext")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- AYARLAR --- */}
        <div className="lg:col-span-5 space-y-6">
          {/* PLATFORM SEÇİMİ */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 px-2">
              {t("tools.tweet_gen.platform_select")}
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => setPlatform("twitter")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 font-bold transition-all ${platform === "twitter" ? "border-sky-500 bg-sky-50 text-sky-600" : "border-gray-100 hover:bg-gray-50 text-gray-500"}`}
              >
                {/* BURADA LOGO DEĞİŞTİ */}
                <MessageCircle size={20} />
                {t("tools.tweet_gen.platform_x")}
              </button>
              <button
                onClick={() => setPlatform("instagram")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 font-bold transition-all ${platform === "instagram" ? "border-pink-500 bg-pink-50 text-pink-600" : "border-gray-100 hover:bg-gray-50 text-gray-500"}`}
              >
                <Instagram size={20} />
                {t("tools.tweet_gen.platform_insta")}
              </button>
            </div>
          </div>

          {/* Tema Seçimi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">
              {t("tools.tweet_gen.settings_appearance")}
            </h3>
            <div className="flex gap-2">
              {["light", "dim", "dark"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`flex-1 py-2 rounded-lg font-medium border-2 transition-all ${theme === mode ? "border-sky-500 bg-sky-50 text-sky-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  {t(`tools.tweet_gen.mode_${mode}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Profil Bilgileri */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800">
              {t("tools.tweet_gen.settings_profile")}
            </h3>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-gray-100 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center group cursor-pointer shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="text-gray-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white z-10 pointer-events-none">
                  <Upload size={20} />
                </div>
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-sky-500 outline-none"
                  placeholder={t("tools.tweet_gen.placeholder_name")}
                />
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-sky-500 outline-none"
                    placeholder={t("tools.tweet_gen.placeholder_username")}
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="w-4 h-4 text-sky-500 rounded focus:ring-sky-500"
              />
              <span className="text-gray-700 text-sm">
                {t("tools.tweet_gen.label_verified")}
              </span>
            </label>
          </div>

          {/* İçerik Ayarları */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 mb-2">
              {t("tools.tweet_gen.settings_content")}
            </h3>

            {platform === "instagram" && (
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-200 rounded-lg text-sm focus:border-sky-500 outline-none"
                  placeholder={t("tools.tweet_gen.placeholder_location")}
                />
              </div>
            )}

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-sky-500 outline-none min-h-[100px] resize-none"
              placeholder={t("tools.tweet_gen.placeholder_content")}
            ></textarea>

            {platform === "instagram" && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t("tools.tweet_gen.label_post_image")}
                </label>
                <div className="relative w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 transition overflow-hidden group">
                  {postImage ? (
                    <img
                      src={postImage}
                      className="w-full h-full object-contain"
                      alt="Post"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 pointer-events-none">
                      <ImageIcon size={32} />
                      <span className="text-xs mt-2 font-medium">
                        Fotoğraf Yüklemek İçin Tıkla
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePostImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white pointer-events-none z-10">
                    <Upload size={32} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* İstatistikler */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">
              {t("tools.tweet_gen.settings_stats")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {platform === "twitter" && (
                <>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg text-sm"
                    placeholder={t("tools.tweet_gen.placeholder_time")}
                  />
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg text-sm"
                    placeholder={t("tools.tweet_gen.placeholder_date")}
                  />
                  <input
                    type="text"
                    value={retweets}
                    onChange={(e) => setRetweets(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg text-sm"
                    placeholder={t("tools.tweet_gen.placeholder_retweets")}
                  />
                  <input
                    type="text"
                    value={quotes}
                    onChange={(e) => setQuotes(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg text-sm"
                    placeholder={t("tools.tweet_gen.placeholder_quotes")}
                  />
                  <input
                    type="text"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg text-sm"
                    placeholder={t("tools.tweet_gen.placeholder_views")}
                  />
                </>
              )}
              <input
                type="text"
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
                className="p-2 border border-gray-200 rounded-lg text-sm"
                placeholder={t("tools.tweet_gen.placeholder_likes")}
              />
              {platform === "twitter" && (
                <input
                  type="text"
                  value={bookmarks}
                  onChange={(e) => setBookmarks(e.target.value)}
                  className="p-2 border border-gray-200 rounded-lg text-sm"
                  placeholder={t("tools.tweet_gen.placeholder_bookmarks")}
                />
              )}
            </div>
          </div>

          <button
            onClick={downloadImage}
            disabled={isDownloading}
            className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${platform === "twitter" ? "bg-sky-500 hover:bg-sky-600 shadow-sky-200" : "bg-pink-600 hover:bg-pink-700 shadow-pink-200"}`}
          >
            {isDownloading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Download size={20} />
            )}
            {t("tools.tweet_gen.btn_download")}
          </button>
        </div>

        {/* --- ÖNİZLEME --- */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="bg-gray-100 p-4 md:p-8 rounded-3xl w-full flex items-center justify-center overflow-x-auto min-h-[500px]">
            {platform === "twitter" && (
              <div
                ref={previewRef}
                className={`${currentStyle.bg} ${currentStyle.text} w-[500px] min-w-[500px] p-6 rounded-none shadow-xl font-sans`}
                style={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                      {avatar ? (
                        <img
                          src={avatar}
                          className="w-full h-full object-cover"
                          alt="avatar"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-400"></div>
                      )}
                    </div>
                    <div className="flex flex-col leading-tight justify-center">
                      <div className="flex items-center gap-1 font-bold text-[15px]">
                        <span>{name}</span>
                        {isVerified && (
                          <BadgeCheck
                            size={18}
                            className="text-[#1d9bf0] fill-current"
                            fill="#1d9bf0"
                            color={
                              theme === "light"
                                ? "white"
                                : theme === "dim"
                                  ? "#15202b"
                                  : "black"
                            }
                          />
                        )}
                      </div>
                      <div className={`${currentStyle.subText} text-[15px]`}>
                        @{username}
                      </div>
                    </div>
                  </div>
                  <MoreHorizontal size={20} className={currentStyle.subText} />
                </div>

                <div
                  className={`text-[17px] leading-snug mb-4 whitespace-pre-wrap ${theme === "dark" ? "font-normal" : "font-normal"}`}
                >
                  {text.split(" ").map((word, i) =>
                    word.startsWith("#") ||
                    word.startsWith("@") ||
                    word.startsWith("http") ? (
                      <span key={i} className="text-[#1d9bf0]">
                        {word}{" "}
                      </span>
                    ) : (
                      word + " "
                    ),
                  )}
                </div>

                <div
                  className={`flex items-center gap-1 text-[15px] ${currentStyle.subText} border-b ${currentStyle.border} pb-4 mb-4`}
                >
                  <span>{time}</span>
                  <span>·</span>
                  <span>{date}</span>
                  <span>·</span>
                  <span className={`${currentStyle.text} font-bold`}>
                    {views}
                  </span>
                  <span>{t("tools.tweet_gen.label_views")}</span>
                </div>

                <div
                  className={`flex items-center gap-6 text-[14px] ${currentStyle.subText} border-b ${currentStyle.border} pb-4 mb-4`}
                >
                  <div className="flex gap-1">
                    <span className={`${currentStyle.text} font-bold`}>
                      {retweets}
                    </span>
                    <span>{t("tools.tweet_gen.label_retweets")}</span>
                  </div>
                  <div className="flex gap-1">
                    <span className={`${currentStyle.text} font-bold`}>
                      {quotes}
                    </span>
                    <span>{t("tools.tweet_gen.label_quotes")}</span>
                  </div>
                  <div className="flex gap-1">
                    <span className={`${currentStyle.text} font-bold`}>
                      {likes}
                    </span>
                    <span>{t("tools.tweet_gen.label_likes")}</span>
                  </div>
                  <div className="flex gap-1">
                    <span className={`${currentStyle.text} font-bold`}>
                      {bookmarks}
                    </span>
                    <span>{t("tools.tweet_gen.label_bookmarks")}</span>
                  </div>
                </div>

                <div className={`flex justify-between text-[#71767b]`}>
                  <MessageCircle size={20} />
                  <Repeat2 size={20} />
                  <Heart size={20} />
                  <div className="flex gap-4">
                    <Share size={20} />
                  </div>
                </div>
              </div>
            )}

            {platform === "instagram" && (
              <div
                ref={previewRef}
                className={`${currentStyle.bg} ${currentStyle.text} w-[400px] min-w-[400px] rounded-sm shadow-xl font-sans border ${currentStyle.border}`}
                style={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                }}
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                      {avatar ? (
                        <img
                          src={avatar}
                          className="w-full h-full object-cover"
                          alt="avatar"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-400"></div>
                      )}
                    </div>
                    <div className="flex flex-col text-sm leading-none">
                      <div className="flex items-center gap-1 font-bold">
                        {username}
                        {isVerified && (
                          <BadgeCheck
                            size={14}
                            className="text-[#0095f6] fill-current"
                            fill="#0095f6"
                            color={theme === "light" ? "white" : "black"}
                          />
                        )}
                      </div>
                      {location && (
                        <div
                          className={`text-xs ${currentStyle.subText} mt-0.5`}
                        >
                          {location}
                        </div>
                      )}
                    </div>
                  </div>
                  <MoreHorizontal size={20} />
                </div>

                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  {postImage ? (
                    <img
                      src={postImage}
                      className="w-full h-full object-cover"
                      alt="Post"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <ImageIcon size={48} />
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <div className="flex justify-between mb-3">
                    <div className="flex gap-4">
                      <Heart size={24} />
                      <MessageCircle
                        size={24}
                        style={{ transform: "rotate(-90deg)" }}
                      />
                      <Send size={24} />
                    </div>
                    <Bookmark size={24} />
                  </div>

                  <div className="font-bold text-sm mb-2">
                    {likes} {t("tools.tweet_gen.label_likes")}
                  </div>

                  <div className="text-sm">
                    <span className="font-bold mr-2">{username}</span>
                    <span className="whitespace-pre-wrap">
                      {text.split(" ").map((word, i) =>
                        word.startsWith("#") || word.startsWith("@") ? (
                          <span
                            key={i}
                            className="text-[#00376b] dark:text-[#e0f1ff]"
                          >
                            {word}{" "}
                          </span>
                        ) : (
                          word + " "
                        ),
                      )}
                    </span>
                  </div>

                  <div
                    className={`text-[10px] uppercase ${currentStyle.subText} mt-2`}
                  >
                    2 HOURS AGO
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="mt-4 text-gray-500 text-sm">
            {t("tools.tweet_gen.preview_note")}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

      {/* SEO ve Bilgi Metni */}
      <article className="mt-16 prose prose-lg max-w-none text-gray-600 bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          {t("tools.tweet_gen.content.title")}
        </h2>
        <p className="leading-relaxed mb-8">
          {t("tools.tweet_gen.content.p1")}
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold text-sky-600 mb-4 flex items-center gap-2">
              <Smile size={24} />
              {t("tools.tweet_gen.content.h2")}
            </h3>
            <ul className="space-y-4 list-none pl-0">
              <li className="bg-sky-50 p-4 rounded-xl">
                <strong className="block text-gray-900 mb-1">
                  {t("tools.tweet_gen.content.li1_title")}
                </strong>
                {t("tools.tweet_gen.content.li1")}
              </li>
              <li className="bg-pink-50 p-4 rounded-xl">
                <strong className="block text-gray-900 mb-1">
                  {t("tools.tweet_gen.content.li2_title")}
                </strong>
                {t("tools.tweet_gen.content.li2")}
              </li>
              <li className="bg-gray-50 p-4 rounded-xl">
                <strong className="block text-gray-900 mb-1">
                  {t("tools.tweet_gen.content.li3_title")}
                </strong>
                {t("tools.tweet_gen.content.li3")}
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb size={24} className="text-yellow-500" />
                {t("tools.tweet_gen.content.h_guide")}
              </h3>
              <p className="mb-4 text-sm font-medium whitespace-pre-wrap">
                {t("tools.tweet_gen.content.guide_p")}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default TweetGenerator;
