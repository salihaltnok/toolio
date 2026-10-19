import React, { useState, useEffect, useRef } from "react";
import SEO from "../../components/SEO";
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  Armchair,
  Bell,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";

const Pomodoro = () => {
  const { t } = useTranslation();

  const [durations, setDurations] = useState({
    work: 25,
    short: 5,
    long: 15,
  });

  const [mode, setMode] = useState("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [task, setTask] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });
  const originalTitleRef = useRef(null);
  const deadlineRef = useRef(null);

  // Sayfadan çıkınca sekme başlığını eski haline getir
  useEffect(() => {
    return () => {
      if (originalTitleRef.current) document.title = originalTitleRef.current;
    };
  }, []);

  useEffect(() => {
    let minutes = 25;
    if (mode === "short") minutes = durations.short;
    if (mode === "long") minutes = durations.long;
    if (mode === "work") minutes = durations.work;

    setTimeLeft(minutes * 60);
    setIsActive(false);
  }, [mode, durations]);

  useEffect(() => {
    let interval = null;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    if (isActive) {
      if (!originalTitleRef.current) originalTitleRef.current = document.title;
      document.title = `(${timeString}) ${
        mode === "work" ? t("tools.pomodoro.work") : t("tools.pomodoro.short_break")
      } - Toolio`;
    } else if (originalTitleRef.current) {
      document.title = originalTitleRef.current;
      originalTitleRef.current = null;
    }

    if (isActive && timeLeft > 0) {
      // Bitiş anını sabitleyip kalan süreyi saatten hesaplıyoruz. Böylece
      // sekme arka planda kalsa bile (tarayıcı zamanlayıcıları yavaşlatır)
      // sayaç geri kalmaz.
      if (!deadlineRef.current) {
        deadlineRef.current = Date.now() + timeLeft * 1000;
      }
      interval = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.round((deadlineRef.current - Date.now()) / 1000),
        );
        setTimeLeft(remaining);
      }, 500);
    } else {
      deadlineRef.current = null;
    }

    if (isActive && timeLeft === 0) {
      setIsActive(false);
      try {
        const audio = new Audio(
          "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
        );
        audio.play().catch(() => {});
      } catch (e) {
        console.log("Ses çalınamadı");
      }
      setToast({ show: true, message: t("tools.pomodoro.time_up") });
      setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, t]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalTime =
    mode === "work"
      ? durations.work * 60
      : mode === "short"
      ? durations.short * 60
      : durations.long * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      <SEO
        title={t("tools.pomodoro.name")}
        description={t("tools.pomodoro.desc")}
      />

      <div className="max-w-4xl mx-auto text-center relative">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          {t("tools.pomodoro.name")}
        </h1>
        <p className="text-gray-600 mb-8">{t("tools.pomodoro.desc")}</p>

        {/* Mod Seçimi */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode("work")}
            className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition ${
              mode === "work"
                ? "bg-red-500 text-white shadow-lg scale-105"
                : "bg-white text-gray-600 hover:bg-red-50"
            }`}
          >
            <Brain size={20} /> {t("tools.pomodoro.work")}
          </button>
          <button
            onClick={() => setMode("short")}
            className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition ${
              mode === "short"
                ? "bg-teal-500 text-white shadow-lg scale-105"
                : "bg-white text-gray-600 hover:bg-teal-50"
            }`}
          >
            <Coffee size={20} /> {t("tools.pomodoro.short_break")}
          </button>
          <button
            onClick={() => setMode("long")}
            className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition ${
              mode === "long"
                ? "bg-blue-500 text-white shadow-lg scale-105"
                : "bg-white text-gray-600 hover:bg-blue-50"
            }`}
          >
            <Armchair size={20} /> {t("tools.pomodoro.long_break")}
          </button>
        </div>

        {/* Sayaç Dairesi */}
        <div className="relative w-80 h-80 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-linear ${
                mode === "work"
                  ? "text-red-500"
                  : mode === "short"
                  ? "text-teal-500"
                  : "text-blue-500"
              }`}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div
              className={`text-6xl font-bold font-mono ${
                mode === "work"
                  ? "text-red-600"
                  : mode === "short"
                  ? "text-teal-600"
                  : "text-blue-600"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
            <div className="text-gray-400 font-medium mt-2 uppercase tracking-widest text-sm">
              {isActive
                ? t("tools.pomodoro.status_running")
                : t("tools.pomodoro.status_paused")}
            </div>
          </div>
        </div>

        {/* Görev Girişi */}
        <div className="mb-8 max-w-md mx-auto">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder={t("tools.pomodoro.task_placeholder")}
            className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 text-center text-lg focus:border-red-400 focus:bg-white bg-transparent outline-none transition"
          />
        </div>

        {/* Kontrol Butonları */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-4 rounded-2xl font-bold text-xl flex items-center gap-3 shadow-xl transition transform active:scale-95 ${
              isActive
                ? "bg-white text-gray-800 border-2 border-gray-200"
                : "bg-gray-900 text-white hover:bg-black"
            }`}
          >
            {isActive ? (
              <>
                <Pause /> {t("tools.pomodoro.pause")}
              </>
            ) : (
              <>
                <Play fill="currentColor" /> {t("tools.pomodoro.start")}
              </>
            )}
          </button>
          <button
            onClick={() => {
              setIsActive(false);
              let m = 25;
              if (mode === "short") m = durations.short;
              if (mode === "long") m = durations.long;
              if (mode === "work") m = durations.work;
              setTimeLeft(m * 60);
            }}
            className="px-6 py-4 rounded-2xl font-bold text-xl bg-gray-200 text-gray-600 hover:bg-gray-300 transition"
            title={t("tools.pomodoro.reset")}
          >
            <RotateCcw />
          </button>
        </div>

        {/* REKLAM 1 */}
        <AdBanner slot="8855221144" />

        {/* Ayarlar */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-gray-100 max-w-2xl mx-auto">
          <h3 className="text-gray-500 font-bold mb-4 uppercase text-sm tracking-wider">
            {t("tools.pomodoro.settings")}
          </h3>
          <div className="flex gap-4 justify-center">
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-400 mb-1">
                {t("tools.pomodoro.work")}
              </label>
              <input
                type="number"
                value={durations.work}
                onChange={(e) =>
                  setDurations({ ...durations, work: Number(e.target.value) })
                }
                className="w-16 p-2 border rounded text-center font-bold"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-400 mb-1">
                {t("tools.pomodoro.short_break")}
              </label>
              <input
                type="number"
                value={durations.short}
                onChange={(e) =>
                  setDurations({ ...durations, short: Number(e.target.value) })
                }
                className="w-16 p-2 border rounded text-center font-bold"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-400 mb-1">
                {t("tools.pomodoro.long_break")}
              </label>
              <input
                type="number"
                value={durations.long}
                onChange={(e) =>
                  setDurations({ ...durations, long: Number(e.target.value) })
                }
                className="w-16 p-2 border rounded text-center font-bold"
              />
            </div>
          </div>
        </div>

        {/* REKLAM 2 */}
        <AdBanner slot="9988776655" className="mt-8" />


        {/* Toast */}
        <div
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 transition-all duration-300 z-50 ${
            toast.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center animate-bounce ${
              mode === "work" ? "bg-red-500" : "bg-teal-500"
            }`}
          >
            <Bell size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg">{toast.message}</span>
        </div>
      </div>
    </>
  );
};
export default Pomodoro;
