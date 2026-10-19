import React, { useState, useEffect, useRef } from "react";
import SEO from "../../components/SEO";
import { Disc, Shuffle, Trash2, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdBanner from "../../components/AdBanner";
import confetti from "canvas-confetti";

const DecisionWheel = () => {
  const { t } = useTranslation();

  // Varsayılan seçenekler
  const [inputText, setInputText] = useState(() =>
    t("tools.decision_wheel.default_items"),
  );
  const [items, setItems] = useState(() =>
    t("tools.decision_wheel.default_items")
      .split("\n")
      .filter((i) => i.trim() !== ""),
  );

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  const canvasRef = useRef(null);

  // Renk Paleti (Canlı renkler)
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#E7E9ED",
    "#8AC926",
    "#1982C4",
    "#6A4C93",
  ];

  // SES EFEKTLERİ (Base64 - Kazanma Sesi)
  const WIN_SOUND =
    "data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7cQBWIQCubaRCidUhXMscBEAEIYwBMIVM/INRUyFm9sBfowqaSqfcz7FtzqIJDettmYbADCgbrL6BeZOTPUIC5QhLBSGDwJ4js8Z8X8x8x/ngMHhv/+/B4P/t994D/g////94D7nMXmPg8Fgn//95/8O/y858HSiKqSqSqQqFdfksmgn//uQRA4AAdSLjFn0AAx1IuMWfQAAUPYGkAAAAAftwdIAAAAADtwclaCjADPKTjkUPP/TxKDnjfHPndtbfK/5T/3aEqnwQ5X//9D/w4f1/////5f95/+HRdb//l43QT/47B7AAvAodF3///////K4kHw2KdX////////7kEQaAAXmJUqvQAAuYSpVeghAAARBPfIAAAACEE98gAAAAAOAiAAABAgICAQAAAgICAgEAAACAgICAAAAAQICAgEAAACAgICAAAAAQICAgEAAACAgICAAAAAQICAgEAAACAgICAAAAAQICAgEAAACAgICAAAAAQICAgEAAACAgICAAAAAQICAgEAAACAgICAA";

  // Çarkı Çizme Fonksiyonu
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2;

    ctx.clearRect(0, 0, width, height);

    const step = (2 * Math.PI) / items.length;

    items.forEach((item, index) => {
      const startAngle = index * step;
      const endAngle = startAngle + step;

      // Dilimi Çiz
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      ctx.stroke();

      // Metni Çiz
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + step / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px Arial";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      // Yarıçaptan biraz içeride yaz
      ctx.fillText(
        item.length > 15 ? item.substring(0, 15) + ".." : item,
        radius - 20,
        6
      );
      ctx.restore();
    });
  };

  // Liste değişince çarkı yeniden çiz
  useEffect(() => {
    drawWheel();
  }, [items]);

  // Textarea değişince listeyi güncelle
  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    const newItems = text.split("\n").filter((i) => i.trim() !== "");
    if (newItems.length > 0) setItems(newItems);
  };

  // Çevirme Mantığı
  const spin = () => {
    if (isSpinning || items.length < 2) return;

    setIsSpinning(true);
    setWinner(null);

    // Rastgele bir kazanma açısı belirle (En az 5 tur dönsün: 360 * 5)
    // + Math.random() * 360 ile rastgele bir noktada duracak
    const randomSpin = 360 * 5 + Math.random() * 360;
    const newRotation = rotation + randomSpin;

    setRotation(newRotation);

    // Dönüş bittiğinde (CSS transition süresi 4sn ayarladık)
    setTimeout(() => {
      setIsSpinning(false);
      calculateWinner(newRotation);
      playWinSound();
      triggerConfetti();
    }, 4000);
  };

  // Hangi dilimin kazandığını hesapla
  const calculateWinner = (finalRotation) => {
    const actualRotation = finalRotation % 360;
    const sliceAngle = 360 / items.length;
    // Ok sağda (0 derece) kabul edildiğinde hesaplama:
    const winningIndex = Math.floor(
      ((360 - actualRotation) % 360) / sliceAngle
    );

    setWinner(items[winningIndex]);
  };

  const playWinSound = () => {
    try {
      const audio = new Audio(WIN_SOUND);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const shuffleItems = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setInputText(shuffled.join("\n"));
  };

  const clearItems = () => {
    setItems([]);
    setInputText("");
  };

  return (
    <>
      <SEO
        title={t("tools.decision_wheel.name")}
        description={t("tools.decision_wheel.desc")}
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <Disc className="text-purple-600 w-10 h-10 animate-spin-slow" />{" "}
          {t("tools.decision_wheel.header")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* SOL TARAF: ÇARK */}
          <div className="relative flex justify-center items-center bg-white p-4 rounded-3xl shadow-xl border border-gray-100 min-h-[400px]">
            {/* Gösterge Oku (Sağ tarafta sabit) */}
            <div className="absolute right-5 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10">
              <div className="w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-r-[30px] border-r-gray-800 rotate-0 drop-shadow-lg"></div>
            </div>

            {/* Çark Container (Dönen Kısım) */}
            <div
              className="rounded-full overflow-hidden shadow-2xl border-4 border-white ring-4 ring-gray-100"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning
                  ? "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)"
                  : "none",
              }}
            >
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="block w-full h-full max-w-[350px] max-h-[350px] md:max-w-[400px] md:max-h-[400px]"
              />
            </div>

            {/* Orta Nokta (Süs) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg z-10 border-2 border-gray-200 flex items-center justify-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            </div>
          </div>

          {/* SAĞ TARAF: KONTROLLER */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                {t("tools.decision_wheel.input_label")}
              </label>
              <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder={t("tools.decision_wheel.placeholder")}
                className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none font-medium text-gray-600 bg-gray-50"
              ></textarea>
              <div className="text-right text-xs text-gray-400 mt-1">
                {t("tools.decision_wheel.option_count", {
                  count: items.length,
                })}
              </div>
            </div>

            <button
              onClick={spin}
              disabled={isSpinning || items.length < 2}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-black text-2xl tracking-widest hover:from-purple-700 hover:to-indigo-700 transition shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 mb-4"
            >
              {t("tools.decision_wheel.spin_btn")}
            </button>

            <div className="flex gap-3">
              <button
                onClick={shuffleItems}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                <Shuffle size={18} /> {t("tools.decision_wheel.shuffle_btn")}
              </button>
              <button
                onClick={clearItems}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition"
              >
                <Trash2 size={18} /> {t("tools.decision_wheel.reset_btn")}
              </button>
            </div>
          </div>
        </div>

        <AdBanner slot="7778889990" className="mt-8" />


        {/* MODAL: KAZANAN GÖSTERİMİ */}
        {winner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 animate-bounce-in">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                <Trophy size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {t("tools.decision_wheel.winner_title")}
              </h2>
              <div className="text-4xl font-black text-purple-600 mb-4 break-words">
                {winner}
              </div>
              <p className="text-gray-500 mb-6">
                {t("tools.decision_wheel.winner_msg")}
              </p>
              <button
                onClick={() => setWinner(null)}
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition w-full"
              >
                {t("tools.decision_wheel.close_btn")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DecisionWheel;
