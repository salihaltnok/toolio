import React, { useState, useEffect } from "react";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import { Mic, Play, Pause, Square, Trash2, Copy, Volume2 } from "lucide-react";

const TextToSpeech = () => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1); // Hız
  const [pitch, setPitch] = useState(1); // Ton

  useEffect(() => {
    const synth = window.speechSynthesis;

    // Tarayıcıdaki sesleri yükle
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      // Varsayılan olarak Türkçe veya ilk sesi seç
      const trVoice = availableVoices.find((v) => v.lang.includes("tr"));
      setSelectedVoice(trVoice || availableVoices[0]);
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    // Sayfadan çıkınca konuşmayı durdur
    return () => {
      synth.cancel();
    };
  }, []);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    if (synth.speaking) {
      return;
    }

    if (text !== "") {
      const utterThis = new SpeechSynthesisUtterance(text);
      utterThis.voice = selectedVoice;
      utterThis.rate = rate;
      utterThis.pitch = pitch;

      utterThis.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      synth.speak(utterThis);
      setIsSpeaking(true);
    }
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.pause();
      setIsPaused(true);
      setIsSpeaking(false); // UI güncellemesi için
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPaused(false);
    setIsSpeaking(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert(t("tools.word_counter.copy_msg")); // Var olan çeviriyi kullandık
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO title={t("tools.tts.name")} description={t("tools.tts.desc")} />

      {/* Başlık */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-2xl mb-4">
          <Mic className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("tools.tts.header")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("tools.tts.subtext")}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6 md:p-8">
        {/* Kontroller */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Ses Seçimi */}
          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {t("tools.tts.voice_label")}
            </label>
            <select
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              onChange={(e) => {
                const voice = voices.find((v) => v.name === e.target.value);
                setSelectedVoice(voice);
              }}
              value={selectedVoice?.name}
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Hız Ayarı */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {t("tools.tts.speed_label")}: {rate}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          {/* Ton Ayarı */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {t("tools.tts.pitch_label")}: {pitch}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
        </div>

        {/* Metin Alanı */}
        <div className="relative mb-6">
          <textarea
            className="w-full h-64 p-6 bg-gray-50 border border-gray-200 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-purple-500 text-lg leading-relaxed text-gray-700"
            placeholder={t("tools.tts.placeholder")}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 bg-white rounded-lg shadow text-gray-500 hover:text-purple-600 transition"
              title="Kopyala"
            >
              <Copy size={20} />
            </button>
            <button
              onClick={() => setText("")}
              className="p-2 bg-white rounded-lg shadow text-gray-500 hover:text-red-600 transition"
              title="Temizle"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Oynatma Butonları */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handlePlay}
            disabled={!text}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-lg ${
              isSpeaking && !isPaused
                ? "bg-green-500 hover:bg-green-600 shadow-green-200"
                : "bg-purple-600 hover:bg-purple-700 shadow-purple-200"
            }`}
          >
            {isSpeaking && !isPaused ? (
              <Volume2 className="animate-pulse" />
            ) : (
              <Play />
            )}
            {t("tools.tts.play_btn")}
          </button>

          <button
            onClick={handlePause}
            disabled={!isSpeaking && !isPaused}
            className="flex items-center gap-2 px-6 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold shadow-lg shadow-yellow-200 transition-all disabled:opacity-50"
          >
            <Pause /> {t("tools.tts.pause_btn")}
          </button>

          <button
            onClick={handleStop}
            disabled={!isSpeaking && !isPaused}
            className="flex items-center gap-2 px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 transition-all disabled:opacity-50"
          >
            <Square size={18} fill="currentColor" /> {t("tools.tts.stop_btn")}
          </button>
        </div>
      </div>

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

    </div>
  );
};

export default TextToSpeech;
