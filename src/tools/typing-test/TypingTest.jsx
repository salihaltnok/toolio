import React, { useState, useEffect, useRef } from "react";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import { Keyboard, RefreshCcw, Trophy, Timer, AlertCircle } from "lucide-react";

// Rastgele kelime havuzu (Basit versiyon)
const WORDS_TR = [
  "elma",
  "armut",
  "kalem",
  "bilgisayar",
  "yazılım",
  "kodlama",
  "ekran",
  "klavye",
  "fare",
  "masa",
  "sandalye",
  "kitap",
  "defter",
  "okul",
  "öğrenci",
  "öğretmen",
  "sınıf",
  "ders",
  "sınav",
  "başarı",
  "gelecek",
  "hayat",
  "dünya",
  "uzay",
  "yıldız",
  "güneş",
  "deniz",
  "kum",
  "tatil",
  "gezi",
  "araba",
  "uçak",
  "tren",
  "gemi",
  "yol",
  "köprü",
  "bina",
  "ev",
  "oda",
  "kapı",
  "pencere",
  "telefon",
  "internet",
  "mesaj",
  "haber",
  "gazete",
  "dergi",
  "resim",
  "müzik",
  "film",
  "sanat",
  "spor",
  "futbol",
  "basketbol",
  "koşu",
  "yüzme",
  "sağlık",
  "doktor",
  "hasta",
  "ilaç",
  "zaman",
  "saat",
  "dakika",
  "saniye",
  "gün",
  "hafta",
  "ay",
  "yıl",
  "mevsim",
  "kış",
  "yaz",
  "bahar",
  "güz",
  "renk",
  "kırmızı",
  "mavi",
  "yeşil",
  "sarı",
  "beyaz",
  "siyah",
];
const WORDS_EN = [
  "apple",
  "pear",
  "pen",
  "computer",
  "software",
  "coding",
  "screen",
  "keyboard",
  "mouse",
  "table",
  "chair",
  "book",
  "notebook",
  "school",
  "student",
  "teacher",
  "class",
  "lesson",
  "exam",
  "success",
  "future",
  "life",
  "world",
  "space",
  "star",
  "sun",
  "sea",
  "sand",
  "holiday",
  "trip",
  "car",
  "plane",
  "train",
  "ship",
  "road",
  "bridge",
  "building",
  "house",
  "room",
  "door",
  "window",
  "phone",
  "internet",
  "message",
  "news",
  "newspaper",
  "magazine",
  "picture",
  "music",
  "movie",
  "art",
  "sport",
  "football",
  "basketball",
  "run",
  "swim",
  "health",
  "doctor",
  "patient",
  "medicine",
  "time",
  "clock",
  "minute",
  "second",
  "day",
  "week",
  "month",
  "year",
  "season",
  "winter",
  "summer",
  "spring",
  "autumn",
  "color",
  "red",
  "blue",
  "green",
  "yellow",
  "white",
  "black",
];

const TypingTest = () => {
  const { t, i18n } = useTranslation();

  const [words, setWords] = useState([]);
  const [input, setInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [status, setStatus] = useState("waiting"); // waiting, running, finished
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);

  const inputRef = useRef(null);

  // Oyunu Başlat / Sıfırla
  const resetGame = () => {
    const wordList = i18n.language === "tr" ? WORDS_TR : WORDS_EN;
    // Kelimeleri karıştır ve 100 tane al
    const shuffled = [...wordList]
      .sort(() => 0.5 - Math.random())
      .slice(0, 100);
    setWords(shuffled);
    setInput("");
    setCurrentWordIndex(0);
    setCorrectWords(0);
    setIncorrectWords(0);
    setStatus("waiting");
    setTimeLeft(60);
    setWpm(0);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    resetGame();
  }, [i18n.language]);

  // Sayaç
  useEffect(() => {
    let interval = null;
    if (status === "running" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setStatus("finished");
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [status, timeLeft]);

  // Yazma İşlemi
  const handleKeyDown = (e) => {
    if (status === "finished") return;

    // İlk tuşa basınca başlat
    if (status === "waiting") {
      setStatus("running");
    }

    // Space tuşu: Kelimeyi kontrol et
    if (e.code === "Space") {
      e.preventDefault();
      const currentWord = words[currentWordIndex];
      const typedWord = input.trim();

      if (typedWord === currentWord) {
        setCorrectWords((prev) => prev + 1);
      } else {
        setIncorrectWords((prev) => prev + 1);
      }

      setCurrentWordIndex((prev) => prev + 1);
      setInput("");

      // Anlık WPM hesapla (Her kelime ortalama 5 karakter kabul edilir, ama burada basitçe kelime sayısını alıyoruz)
      setWpm(Math.round((correctWords + 1) / ((60 - timeLeft) / 60) || 0));
    }
  };

  const handleChange = (e) => {
    if (status === "finished") return;
    setInput(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title={t("tools.typing.name")}
        description={t("tools.typing.desc")}
      />

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-cyan-100 rounded-2xl mb-4">
          <Keyboard className="w-8 h-8 text-cyan-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("tools.typing.header")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("tools.typing.subtext")}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-8">
        {/* Üst Bilgi Paneli */}
        <div className="flex justify-between items-center mb-8 bg-gray-50 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-700">
            <Timer className="text-cyan-500" />
            {timeLeft}s
          </div>
          <div className="flex items-center gap-2 text-xl font-bold text-gray-700">
            <Trophy className="text-yellow-500" />
            WPM: {status === "finished" ? Math.round(correctWords) : wpm}
          </div>
          <button
            onClick={resetGame}
            className="p-2 bg-white shadow rounded-lg hover:bg-gray-100 transition text-gray-500"
          >
            <RefreshCcw size={20} />
          </button>
        </div>

        {status === "finished" ? (
          /* Sonuç Ekranı */
          <div className="text-center py-10 animate-in zoom-in duration-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t("tools.typing.result_title")}
            </h2>
            <div className="text-6xl font-black text-cyan-600 mb-6">
              {Math.round(correctWords)}{" "}
              <span className="text-xl font-normal text-gray-500">WPM</span>
            </div>

            <div className="flex justify-center gap-8 text-gray-600 mb-8">
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {correctWords}
                </div>
                <div className="text-sm">{t("tools.typing.correct")}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {incorrectWords}
                </div>
                <div className="text-sm">{t("tools.typing.incorrect")}</div>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-cyan-200"
            >
              {t("tools.typing.restart_btn")}
            </button>
          </div>
        ) : (
          /* Oyun Alanı */
          <>
            {/* Kelimeler */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 h-32 overflow-hidden relative select-none">
              <div className="flex flex-wrap gap-3 text-xl leading-relaxed font-medium text-gray-400">
                {words.map((word, idx) => {
                  let colorClass = "text-gray-400";
                  if (idx === currentWordIndex)
                    colorClass = "bg-gray-200 text-gray-800 px-2 rounded -ml-2";
                  else if (idx < currentWordIndex)
                    colorClass = "text-green-500 opacity-50"; // Geçilenler (basitçe yeşil varsayalım)

                  // Ekranı kaydırmak için sadece mevcut ve sonraki kelimeleri gösteriyoruz (Basit bir hile)
                  if (idx < currentWordIndex - 20) return null;

                  return (
                    <span
                      key={idx}
                      className={`${colorClass} transition-colors`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
              {/* Üstüne Gölge (Blur) */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
            </div>

            {/* Input Alanı */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`w-full p-4 text-2xl font-bold text-center border-2 rounded-xl outline-none transition-colors ${
                  input.length > 0 &&
                  !words[currentWordIndex]?.startsWith(input)
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                }`}
                placeholder={t("tools.typing.placeholder")}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm hidden sm:block">
                <span className="bg-gray-200 px-2 py-1 rounded text-xs font-bold">
                  SPACE
                </span>{" "}
                ile geç
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

    </div>
  );
};

export default TypingTest;
