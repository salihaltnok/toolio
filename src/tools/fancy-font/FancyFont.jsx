import React, { useState } from "react";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import { Type, Copy, Check, Sparkles, RefreshCw } from "lucide-react";

const FancyFont = () => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Alfabe Haritaları (Mapping)
  const fontStyles = [
    {
      name: "Outline",
      map: {
        a: "𝕒",
        b: "𝕓",
        c: "𝕔",
        d: "𝕕",
        e: "𝕖",
        f: "𝕗",
        g: "𝕘",
        h: "𝕙",
        i: "𝕚",
        j: "𝕛",
        k: "𝕜",
        l: "𝕝",
        m: "𝕞",
        n: "𝕟",
        o: "𝕠",
        p: "𝕡",
        q: "𝕢",
        r: "𝕣",
        s: "𝕤",
        t: "𝕥",
        u: "𝕦",
        v: "𝕧",
        w: "𝕨",
        x: "𝕩",
        y: "𝕪",
        z: "𝕫",
        A: "𝔸",
        B: "𝔹",
        C: "ℂ",
        D: "𝔻",
        E: "𝔼",
        F: "𝔽",
        G: "𝔾",
        H: "ℍ",
        I: "𝕀",
        J: "𝕁",
        K: "𝕂",
        L: "𝕃",
        M: "𝕄",
        N: "ℕ",
        O: "𝕆",
        P: "ℙ",
        Q: "ℚ",
        R: "ℝ",
        S: "𝕊",
        T: "𝕋",
        U: "𝕌",
        V: "𝕍",
        W: "𝕎",
        X: "𝕏",
        Y: "𝕐",
        Z: "ℤ",
        0: "𝟘",
        1: "𝟙",
        2: "𝟚",
        3: "𝟛",
        4: "𝟜",
        5: "𝟝",
        6: "𝟞",
        7: "𝟟",
        8: "𝟠",
        9: "𝟡",
      },
    },
    {
      name: "Bold Script",
      map: {
        a: "𝓪",
        b: "𝓫",
        c: "𝓬",
        d: "𝓭",
        e: "𝓮",
        f: "𝓯",
        g: "𝓰",
        h: "𝓱",
        i: "𝓲",
        j: "𝓳",
        k: "𝓴",
        l: "𝓵",
        m: "𝓶",
        n: "𝓷",
        o: "𝓸",
        p: "𝓹",
        q: "𝓺",
        r: "𝓻",
        s: "𝓼",
        t: "𝓽",
        u: "𝓾",
        v: "𝓿",
        w: "𝔀",
        x: "𝔁",
        y: "𝔂",
        z: "𝔃",
        A: "𝓐",
        B: "𝓑",
        C: "𝓒",
        D: "𝓓",
        E: "𝓔",
        F: "𝓕",
        G: "𝓖",
        H: "𝓗",
        I: "𝓘",
        J: "𝓙",
        K: "𝓚",
        L: "𝓛",
        M: "𝓜",
        N: "𝓝",
        O: "𝓞",
        P: "𝓟",
        Q: "𝓠",
        R: "𝓡",
        S: "𝓢",
        T: "𝓣",
        U: "𝓤",
        V: "𝓥",
        W: "𝓦",
        X: "𝓧",
        Y: "𝓨",
        Z: "𝓩",
      },
    },
    {
      name: "Fraktur",
      map: {
        a: "𝔞",
        b: "𝔟",
        c: "𝔠",
        d: "𝔡",
        e: "𝔢",
        f: "𝔣",
        g: "𝔤",
        h: "𝔥",
        i: "𝔦",
        j: "𝔧",
        k: "𝔨",
        l: "𝔩",
        m: "𝔪",
        n: "𝔫",
        o: "𝔬",
        p: "𝔭",
        q: "𝔮",
        r: "𝔯",
        s: "𝔰",
        t: "𝔱",
        u: "𝔲",
        v: "𝔳",
        w: "𝔴",
        x: "𝔵",
        y: "𝔶",
        z: "𝔷",
        A: "𝔄",
        B: "𝔅",
        C: "ℭ",
        D: "𝔇",
        E: "𝔈",
        F: "𝔉",
        G: "𝔊",
        H: "ℌ",
        I: "ℑ",
        J: "𝔍",
        K: "𝔎",
        L: "𝔏",
        M: "𝔐",
        N: "𝔑",
        O: "𝔒",
        P: "𝔓",
        Q: "𝔔",
        R: "ℜ",
        S: "𝔖",
        T: "𝔗",
        U: "𝔘",
        V: "𝔙",
        W: "𝔚",
        X: "𝔛",
        Y: "𝔜",
        Z: "ℨ",
      },
    },
    {
      name: "Bubbles",
      map: {
        a: "ⓐ",
        b: "ⓑ",
        c: "ⓒ",
        d: "ⓓ",
        e: "ⓔ",
        f: "ⓕ",
        g: "ⓖ",
        h: "ⓗ",
        i: "ⓘ",
        j: "ⓙ",
        k: "ⓚ",
        l: "ⓛ",
        m: "ⓜ",
        n: "ⓝ",
        o: "ⓞ",
        p: "ⓟ",
        q: "ⓠ",
        r: "ⓡ",
        s: "ⓢ",
        t: "ⓣ",
        u: "ⓤ",
        v: "ⓥ",
        w: "ⓦ",
        x: "ⓧ",
        y: "ⓨ",
        z: "ⓩ",
        A: "Ⓐ",
        B: "Ⓑ",
        C: "Ⓒ",
        D: "Ⓓ",
        E: "Ⓔ",
        F: "Ⓕ",
        G: "Ⓖ",
        H: "Ⓗ",
        I: "Ⓘ",
        J: "Ⓙ",
        K: "Ⓚ",
        L: "Ⓛ",
        M: "Ⓜ",
        N: "Ⓝ",
        O: "Ⓞ",
        P: "Ⓟ",
        Q: "Ⓠ",
        R: "Ⓡ",
        S: "Ⓢ",
        T: "Ⓣ",
        U: "Ⓤ",
        V: "Ⓥ",
        W: "Ⓦ",
        X: "Ⓧ",
        Y: "Ⓨ",
        Z: "Ⓩ",
        0: "⓪",
        1: "①",
        2: "②",
        3: "③",
        4: "④",
        5: "⑤",
        6: "⑥",
        7: "⑦",
        8: "⑧",
        9: "⑨",
      },
    },
    {
      name: "Small Caps",
      map: {
        a: "ᴀ",
        b: "ʙ",
        c: "ᴄ",
        d: "ᴅ",
        e: "ᴇ",
        f: "ғ",
        g: "ɢ",
        h: "ʜ",
        i: "ɪ",
        j: "ᴊ",
        k: "ᴋ",
        l: "ʟ",
        m: "ᴍ",
        n: "ɴ",
        o: "ᴏ",
        p: "ᴘ",
        q: "ǫ",
        r: "ʀ",
        s: "s",
        t: "ᴛ",
        u: "ᴜ",
        v: "ᴠ",
        w: "ᴡ",
        x: "x",
        y: "ʏ",
        z: "ᴢ",
        A: "ᴀ",
        B: "ʙ",
        C: "ᴄ",
        D: "ᴅ",
        E: "ᴇ",
        F: "ғ",
        G: "ɢ",
        H: "ʜ",
        I: "ɪ",
        J: "ᴊ",
        K: "ᴋ",
        L: "ʟ",
        M: "ᴍ",
        N: "ɴ",
        O: "ᴏ",
        P: "ᴘ",
        Q: "ǫ",
        R: "ʀ",
        S: "s",
        T: "ᴛ",
        U: "ᴜ",
        V: "ᴠ",
        W: "ᴡ",
        X: "x",
        Y: "ʏ",
        Z: "ᴢ",
      },
    },
    {
      name: "Square",
      map: {
        a: "🅰",
        b: "🅱",
        c: "🅲",
        d: "🅳",
        e: "🅴",
        f: "🅵",
        g: "🅶",
        h: "🅷",
        i: "🅸",
        j: "🅹",
        k: "🅺",
        l: "🅻",
        m: "🅼",
        n: "🅽",
        o: "🅾",
        p: "🅿",
        q: "🆀",
        r: "🆁",
        s: "🆂",
        t: "🆃",
        u: "🆄",
        v: "🆅",
        w: "🆆",
        x: "🆇",
        y: "🆈",
        z: "🆉",
        A: "🅰",
        B: "🅱",
        C: "🅲",
        D: "🅳",
        E: "🅴",
        F: "🅵",
        G: "🅶",
        H: "🅷",
        I: "🅸",
        J: "🅹",
        K: "🅺",
        L: "🅻",
        M: "🅼",
        N: "🅽",
        O: "🅾",
        P: "🅿",
        Q: "🆀",
        R: "🆁",
        S: "🆂",
        T: "🆃",
        U: "🆄",
        V: "🆅",
        W: "🆆",
        X: "🆇",
        Y: "🆈",
        Z: "🆉",
      },
    },
    {
      name: "Wide",
      map: {
        a: "ａ",
        b: "ｂ",
        c: "ｃ",
        d: "ｄ",
        e: "ｅ",
        f: "ｆ",
        g: "ｇ",
        h: "ｈ",
        i: "ｉ",
        j: "ｊ",
        k: "ｋ",
        l: "ｌ",
        m: "ｍ",
        n: "ｎ",
        o: "ｏ",
        p: "ｐ",
        q: "ｑ",
        r: "ｒ",
        s: "ｓ",
        t: "ｔ",
        u: "ｕ",
        v: "ｖ",
        w: "ｗ",
        x: "ｘ",
        y: "ｙ",
        z: "ｚ",
        A: "Ａ",
        B: "Ｂ",
        C: "Ｃ",
        D: "Ｄ",
        E: "Ｅ",
        F: "Ｆ",
        G: "Ｇ",
        H: "Ｈ",
        I: "Ｉ",
        J: "Ｊ",
        K: "Ｋ",
        L: "Ｌ",
        M: "Ｍ",
        N: "Ｎ",
        O: "Ｏ",
        P: "Ｐ",
        Q: "Ｑ",
        R: "Ｒ",
        S: "Ｓ",
        T: "Ｔ",
        U: "Ｕ",
        V: "Ｖ",
        W: "Ｗ",
        X: "Ｘ",
        Y: "Ｙ",
        Z: "Ｚ",
        0: "０",
        1: "１",
        2: "２",
        3: "３",
        4: "４",
        5: "５",
        6: "６",
        7: "７",
        8: "８",
        9: "９",
      },
    },
    {
      name: "Upside Down",
      map: {
        a: "ɐ",
        b: "q",
        c: "ɔ",
        d: "p",
        e: "ǝ",
        f: "ɟ",
        g: "ƃ",
        h: "ɥ",
        i: "ᴉ",
        j: "ɾ",
        k: "ʞ",
        l: "l",
        m: "ɯ",
        n: "u",
        o: "o",
        p: "d",
        q: "b",
        r: "ɹ",
        s: "s",
        t: "ʇ",
        u: "n",
        v: "ʌ",
        w: "ʍ",
        x: "x",
        y: "ʎ",
        z: "z",
        A: "∀",
        B: "q",
        C: "Ɔ",
        D: "p",
        E: "Ǝ",
        F: "Ⅎ",
        G: "פ",
        H: "H",
        I: "I",
        J: "ſ",
        K: "ʞ",
        L: "˥",
        M: "W",
        N: "N",
        O: "O",
        P: "d",
        Q: "Ό",
        R: "R",
        S: "S",
        T: "┴",
        U: "∩",
        V: "Λ",
        W: "M",
        X: "X",
        Y: "⅄",
        Z: "Z",
        "?": "¿",
        "!": "¡",
        ".": "˙",
        _: "‾",
      },
    },
  ];

  // Dönüştürme Fonksiyonu
  const convertText = (text, map) => {
    return text
      .split("")
      .map((char) => map[char] || char)
      .join("");
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title={t("tools.fancy_font.name")}
        description={t("tools.fancy_font.desc")}
      />

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-fuchsia-100 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-fuchsia-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("tools.fancy_font.header")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("tools.fancy_font.subtext")}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6 md:p-8">
        {/* Giriş Alanı */}
        <div className="mb-8 relative">
          <div className="absolute top-4 left-4 text-gray-400">
            <Type size={20} />
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t("tools.fancy_font.placeholder")}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-100 outline-none transition text-lg resize-none h-32"
          ></textarea>
          {inputText && (
            <button
              onClick={() => setInputText("")}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <RefreshCw size={18} />
            </button>
          )}
        </div>

        {/* Sonuç Listesi */}
        <div className="space-y-4">
          {fontStyles.map((style, index) => {
            const converted = convertText(inputText || "Toolio", style.map);

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-fuchsia-50 rounded-xl border border-gray-100 transition group cursor-pointer"
                onClick={() => handleCopy(converted, index)}
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1 tracking-wider">
                    {style.name}
                  </p>
                  <p className="text-xl md:text-2xl text-gray-800 break-all font-medium">
                    {converted}
                  </p>
                </div>
                <button
                  className={`p-3 rounded-xl transition-all ${
                    copiedIndex === index
                      ? "bg-green-500 text-white shadow-lg shadow-green-200 scale-110"
                      : "bg-white text-gray-500 shadow-sm group-hover:text-fuchsia-600"
                  }`}
                >
                  {copiedIndex === index ? (
                    <Check size={20} />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

    </div>
  );
};

export default FancyFont;
