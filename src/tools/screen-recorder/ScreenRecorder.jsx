import React, { useState, useRef } from "react";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import {
  Video,
  Circle,
  Square,
  Download,
  Monitor,
  RefreshCcw,
  Play,
} from "lucide-react";

const ScreenRecorder = () => {
  const { t } = useTranslation();

  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [stream, setStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Kaydı Başlat
  const startRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true,
      });

      setStream(displayStream);

      const mediaRecorder = new MediaRecorder(displayStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);

        // Stream'i temizle (Kayıt ikonu gitsin)
        displayStream.getTracks().forEach((track) => track.stop());
        setStream(null);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Kullanıcı tarayıcı penceresinden "Paylaşımı Durdur" derse
      displayStream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };
    } catch (err) {
      console.error("Ekran paylaşımı iptal edildi veya hata oluştu:", err);
    }
  };

  // Kaydı Durdur
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  // Yeni Kayıt
  const resetRecording = () => {
    setVideoUrl(null);
    setIsRecording(false);
    setStream(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title={t("tools.screen_recorder.name")}
        description={t("tools.screen_recorder.desc")}
      />

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-2xl mb-4">
          <Video className="w-8 h-8 text-rose-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("tools.screen_recorder.header")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("tools.screen_recorder.subtext")}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-8">
        {/* Durum Ekranı */}
        <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden mb-8 group">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              className="w-full h-full rounded-2xl"
            />
          ) : isRecording ? (
            <div className="text-center animate-pulse">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(220,38,38,0.6)]">
                <Square size={32} className="text-white fill-current" />
              </div>
              <h3 className="text-white text-xl font-bold tracking-wider">
                KAYIT YAPILIYOR...
              </h3>
              <p className="text-gray-400 mt-2 text-sm">
                Durdurmak için aşağıdaki butona basın
              </p>
            </div>
          ) : (
            <div className="text-center">
              <Monitor className="w-24 h-24 text-gray-700 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500 font-medium">
                Kayıt başlatılmaya hazır
              </p>
            </div>
          )}
        </div>

        {/* Kontrol Butonları */}
        <div className="flex flex-wrap justify-center gap-4">
          {!isRecording && !videoUrl && (
            <button
              onClick={startRecording}
              className="flex items-center gap-3 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all transform active:scale-95 text-lg"
            >
              <Circle size={20} className="fill-current" />
              {t("tools.screen_recorder.start_btn")}
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="flex items-center gap-3 px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-95 text-lg"
            >
              <Square size={20} className="fill-current" />
              {t("tools.screen_recorder.stop_btn")}
            </button>
          )}

          {videoUrl && (
            <>
              <a
                href={videoUrl}
                download={`screen-record-${Date.now()}.webm`}
                className="flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all transform active:scale-95 text-lg"
              >
                <Download size={20} />
                {t("tools.screen_recorder.download_btn")}
              </a>

              <button
                onClick={resetRecording}
                className="flex items-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                <RefreshCcw size={20} />
                {t("tools.screen_recorder.new_rec_btn")}
              </button>
            </>
          )}
        </div>

        {/* Bilgi Notu */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Not: Kayıtlar .webm formatındadır. VLC Player veya Chrome ile
          açabilirsiniz.
        </p>
      </div>

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

      {/* SEO İçeriği */}
      <article className="mt-12 prose prose-lg max-w-none text-gray-600 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-gray-800">
          {t("tools.screen_recorder.content.title")}
        </h2>
        <p>{t("tools.screen_recorder.content.p1")}</p>
        <h3 className="text-gray-800">
          {t("tools.screen_recorder.content.h2")}
        </h3>
        <ul>
          <li>
            <strong>{t("tools.screen_recorder.content.li1_title")}</strong>{" "}
            {t("tools.screen_recorder.content.li1")}
          </li>
          <li>
            <strong>{t("tools.screen_recorder.content.li2_title")}</strong>{" "}
            {t("tools.screen_recorder.content.li2")}
          </li>
          <li>
            <strong>{t("tools.screen_recorder.content.li3_title")}</strong>{" "}
            {t("tools.screen_recorder.content.li3")}
          </li>
        </ul>
      </article>
    </div>
  );
};

export default ScreenRecorder;
