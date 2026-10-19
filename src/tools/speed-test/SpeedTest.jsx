import React, { useState, useRef, useEffect } from "react";
import SEO from "../../components/SEO";
import AdBanner from "../../components/AdBanner";
import { useTranslation } from "react-i18next";
import {
  Zap,
  ArrowDown,
  ArrowUp,
  Activity,
  RotateCcw,
  Globe,
  Server,
  Wifi,
  CheckCircle2,
} from "lucide-react";

// --- DİNAMİK FONT BOYUTLU GAUGE BİLEŞENİ ---
const SpeedGauge = ({ value, type }) => {
  const { t } = useTranslation();

  // Kadran Ölçeği Mantığı
  const numValue = parseFloat(value);
  const maxValue = numValue > 100 ? (numValue > 500 ? 1000 : 500) : 100;
  const rotation = Math.min(180, (numValue / maxValue) * 180);

  // Renkler
  const colorClass = type === "download" ? "text-cyan-600" : "text-indigo-600";
  const strokeColor = type === "download" ? "#06b6d4" : "#6366f1";

  // --- DİNAMİK FONT BOYUTU MANTIĞI ---
  const valueStr = value.toString();
  let fontSizeClass = "text-6xl";

  if (valueStr.length >= 6) {
    fontSizeClass = "text-4xl";
  } else if (valueStr.length >= 4) {
    fontSizeClass = "text-5xl";
  }

  return (
    <div className="relative w-72 h-40 flex flex-col items-center justify-end overflow-hidden mx-auto">
      <svg viewBox="0 0 200 110" className="w-full h-full drop-shadow-xl">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={strokeColor}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - 251.2 * (rotation / 180)}
          className="transition-all duration-300 ease-out"
        />
      </svg>

      {/* Dijital Değer */}
      <div className="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center justify-end h-20">
        <div
          className={`${fontSizeClass} font-black tracking-tighter ${colorClass} drop-shadow-sm transition-all duration-200 leading-none`}
        >
          {value}
        </div>
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">
          {t("tools.speedtest.gauge_unit")}
        </div>
      </div>
    </div>
  );
};

// --- ANA BİLEŞEN ---
const SpeedTest = () => {
  const { t } = useTranslation();

  // State'ler
  const [status, setStatus] = useState("idle");
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [latency, setLatency] = useState(0);
  const [serverInfo, setServerInfo] = useState(null);
  const [progress, setProgress] = useState(0);

  // Sunucu Seçimi
  const [servers, setServers] = useState([]);
  const [selectedServerMachine, setSelectedServerMachine] = useState("");
  const [rttMap, setRttMap] = useState({});
  const [probingMachine, setProbingMachine] = useState("");

  const runningRef = useRef(false);

  // --- MANTIK (LOGIC) KISMI ---
  const safeWsUrl = (server, key) => server?.urls?.[key] || null;
  const getServerLabel = (s) =>
    `${s?.location?.city || s?.machine || "Unknown"} (${s?.location?.country || "-"})`;

  const locateServers = async () => {
    const response = await fetch(
      "https://locate.measurementlab.net/v2/nearest/ndt/ndt7",
    );
    const data = await response.json();
    if (!data.results?.length) throw new Error("Sunucu yok");
    return data.results;
  };

  const probeRttMs = (wssUrl) =>
    new Promise((resolve) => {
      let sock;
      const finish = (val) => {
        try {
          sock?.close();
        } catch {}
        resolve(val);
      };
      try {
        sock = new WebSocket(wssUrl, "net.measurementlab.ndt.v7");
      } catch {
        return finish(Infinity);
      }
      sock.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg?.TCPInfo?.MinRTT) finish(msg.TCPInfo.MinRTT / 1000);
        } catch {}
      };
      sock.onerror = () => finish(Infinity);
      setTimeout(() => finish(Infinity), 1500);
    });

  const buildRttMap = async (list) => {
    const candidates = list
      .slice(0, 5)
      .filter((s) => safeWsUrl(s, "wss:///ndt/v7/download"));
    await Promise.all(
      candidates.map(async (s) => {
        const rtt = await probeRttMs(safeWsUrl(s, "wss:///ndt/v7/download"));
        if (isFinite(rtt))
          setRttMap((prev) => ({ ...prev, [s.machine]: Math.round(rtt) }));
      }),
    );
  };

  // Multi-Stream Download
  const runMultiDownload = async (url) => {
    setStatus("downloading");
    const STREAM_COUNT = 4;
    const streams = [];
    let totalBytes = 0;
    const startTime = Date.now();

    const tracker = setInterval(() => {
      const duration = (Date.now() - startTime) / 1000;
      if (duration > 0) {
        setDownloadSpeed(((totalBytes * 8) / (duration * 1000000)).toFixed(1));
        setProgress(Math.min(50, (duration / 10) * 50));
      }
    }, 150);

    const createStream = () =>
      new Promise((resolve) => {
        const sock = new WebSocket(url, "net.measurementlab.ndt.v7");
        sock.binaryType = "blob";
        sock.onmessage = (e) => {
          if (!runningRef.current) {
            sock.close();
            resolve();
            return;
          }
          if (e.data instanceof Blob) totalBytes += e.data.size;
          else if (typeof e.data === "string") {
            try {
              const msg = JSON.parse(e.data);
              if (msg.TCPInfo?.MinRTT)
                setLatency((prev) =>
                  prev === 0 || msg.TCPInfo.MinRTT / 1000 < prev
                    ? (msg.TCPInfo.MinRTT / 1000).toFixed(0)
                    : prev,
                );
            } catch {}
          }
        };
        sock.onclose = resolve;
        sock.onerror = resolve;
        setTimeout(() => {
          if (sock.readyState === WebSocket.OPEN) sock.close();
        }, 10000);
      });

    for (let i = 0; i < STREAM_COUNT; i++) streams.push(createStream());
    await Promise.all(streams);
    clearInterval(tracker);
  };

  // Multi-Stream Upload
  const runMultiUpload = async (url) => {
    setStatus("uploading");
    const STREAM_COUNT = 4;
    const streams = [];
    const startTime = Date.now();
    let speeds = new Array(STREAM_COUNT).fill(0);

    const tracker = setInterval(() => {
      setUploadSpeed(speeds.reduce((a, b) => a + b, 0).toFixed(1));
      const duration = (Date.now() - startTime) / 1000;
      setProgress(50 + Math.min(50, (duration / 10) * 50));
    }, 150);

    const createStream = (idx) =>
      new Promise((resolve) => {
        const sock = new WebSocket(url, "net.measurementlab.ndt.v7");
        let uploader;
        sock.onopen = () => {
          const data = new Uint8Array(8192);
          uploader = setInterval(() => {
            if (!runningRef.current) {
              clearInterval(uploader);
              sock.close();
              return;
            }
            if (sock.bufferedAmount < 8192000) sock.send(data);
          }, 0);
        };
        sock.onmessage = (e) => {
          if (typeof e.data === "string") {
            try {
              const msg = JSON.parse(e.data);
              const bytes = msg.TCPInfo?.BytesReceived;
              const time = msg.TCPInfo?.ElapsedTime;
              if (bytes && time) speeds[idx] = (bytes * 8) / time;
            } catch {}
          }
        };
        sock.onclose = () => {
          clearInterval(uploader);
          resolve();
        };
        setTimeout(() => {
          if (sock.readyState === WebSocket.OPEN) sock.close();
        }, 10000);
      });

    for (let i = 0; i < STREAM_COUNT; i++) streams.push(createStream(i));
    await Promise.all(streams);
    clearInterval(tracker);
  };

  const startTest = async () => {
    if (
      status === "downloading" ||
      status === "uploading" ||
      status === "locating"
    )
      return;
    runningRef.current = true;
    setStatus("locating");
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setLatency(0);
    setProgress(0);
    setServerInfo(null);

    try {
      const list = await locateServers();
      setServers(list);
      await buildRttMap(list);

      let chosen;
      if (selectedServerMachine)
        chosen = list.find((s) => s.machine === selectedServerMachine);

      if (!chosen) {
        let bestRtt = Infinity;
        for (let s of list.slice(0, 5)) {
          const r = rttMap[s.machine];
          if (r && r < bestRtt) {
            bestRtt = r;
            chosen = s;
          }
        }
        if (!chosen) chosen = list[0];
        setSelectedServerMachine(chosen.machine);
      }

      setServerInfo(chosen);
      const dl = safeWsUrl(chosen, "wss:///ndt/v7/download");
      const ul = safeWsUrl(chosen, "wss:///ndt/v7/upload");

      if (!dl || !ul) throw new Error("URL Hatası");

      await runMultiDownload(dl);
      if (runningRef.current) {
        await runMultiUpload(ul);
        setStatus("finished");
        setProgress(100);
        runningRef.current = false;
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      runningRef.current = false;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <SEO
        title={t("tools.speedtest.name")}
        description={t("tools.speedtest.desc")}
      />

      {/* BAŞLIK */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">
          {t("tools.speedtest.header")}
        </h1>
        <p className="text-gray-500">{t("tools.speedtest.subtext")}</p>
      </div>

      {/* ANA PANEL */}
      <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden relative">
        {/* Progress Bar (Üst) */}
        {status !== "idle" && (
          <div
            className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-300 ease-linear z-20"
            style={{ width: `${progress}%` }}
          ></div>
        )}

        <div className="p-8 md:p-12 flex flex-col items-center">
          {/* GÖSTERGE ALANI (CENTER STAGE) */}
          <div className="flex flex-col items-center justify-center min-h-[300px] w-full relative">
            {/* IDLE / BAŞLANGIÇ DURUMU */}
            {(status === "idle" || status === "error") && (
              <button
                onClick={startTest}
                className="group relative flex items-center justify-center w-56 h-56 rounded-full bg-white border-8 border-indigo-50 shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              >
                {/* İç Gradient Halka */}
                <div className="absolute inset-2 rounded-full border-4 border-dashed border-indigo-200 animate-[spin_10s_linear_infinite]"></div>

                <div className="z-10 flex flex-col items-center">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 group-hover:scale-110 transition-transform">
                    {t("tools.speedtest.go_text")}
                  </span>
                  <span className="text-xs font-bold text-gray-400 mt-1 tracking-widest uppercase">
                    {t("tools.speedtest.start_label")}
                  </span>
                </div>
              </button>
            )}
            {(status === "idle" || status === "error") && (
              <p className="mt-6 max-w-md text-center text-xs text-gray-500 leading-relaxed">
                {t("tools.speedtest.mlab_notice")}{" "}
                <a
                  href="https://www.measurementlab.net/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline"
                >
                  {t("tools.speedtest.mlab_policy")}
                </a>
              </p>
            )}

            {/* LOCATING / BAĞLANIYOR */}
            {status === "locating" && (
              <div className="flex flex-col items-center animate-pulse">
                <Globe size={64} className="text-indigo-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700">
                  {t("tools.speedtest.locating_title")}
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  {t("tools.speedtest.locating_desc")}
                </p>
              </div>
            )}

            {/* TEST ÇALIŞIYOR (GAUGE - İBRESİZ) */}
            {(status === "downloading" || status === "uploading") && (
              <div className="animate-in zoom-in duration-500">
                <div className="mb-4 flex items-center justify-center gap-2">
                  {status === "downloading" ? (
                    <ArrowDown className="text-cyan-500 animate-bounce" />
                  ) : (
                    <ArrowUp className="text-indigo-500 animate-bounce" />
                  )}
                  <span
                    className={`text-sm font-bold uppercase tracking-widest ${status === "downloading" ? "text-cyan-600" : "text-indigo-600"}`}
                  >
                    {status === "downloading"
                      ? t("tools.speedtest.label_download")
                      : t("tools.speedtest.label_upload")}
                  </span>
                </div>
                <SpeedGauge
                  value={status === "downloading" ? downloadSpeed : uploadSpeed}
                  type={status === "downloading" ? "download" : "upload"}
                />
              </div>
            )}

            {/* SONUÇ EKRANI */}
            {status === "finished" && (
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  {t("tools.speedtest.test_completed")}
                </h2>
                <button
                  onClick={startTest}
                  className="mt-6 flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl"
                >
                  <RotateCcw size={18} /> {t("tools.speedtest.restart_btn")}
                </button>
              </div>
            )}
          </div>

          {/* İSTATİSTİK KARTLARI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-12">
            {/* Download */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center ${status === "downloading" ? "bg-cyan-50 border-cyan-200 shadow-md scale-105" : "bg-gray-50 border-transparent"}`}
            >
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-2">
                <ArrowDown size={16} /> {t("tools.speedtest.download")}
              </div>
              <div
                className={`text-3xl font-black ${status === "downloading" ? "text-cyan-600" : "text-gray-800"}`}
              >
                {downloadSpeed || "-"}
              </div>
              <div className="text-xs text-gray-400">
                {t("tools.speedtest.gauge_unit")}
              </div>
            </div>

            {/* Upload */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center ${status === "uploading" ? "bg-indigo-50 border-indigo-200 shadow-md scale-105" : "bg-gray-50 border-transparent"}`}
            >
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-2">
                <ArrowUp size={16} /> {t("tools.speedtest.upload")}
              </div>
              <div
                className={`text-3xl font-black ${status === "uploading" ? "text-indigo-600" : "text-gray-800"}`}
              >
                {uploadSpeed || "-"}
              </div>
              <div className="text-xs text-gray-400">
                {t("tools.speedtest.gauge_unit")}
              </div>
            </div>

            {/* Ping */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-transparent flex flex-col items-center">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-2">
                <Activity size={16} /> {t("tools.speedtest.ping")}
              </div>
              <div className="text-3xl font-black text-gray-800">
                {latency || "-"}
              </div>
              <div className="text-xs text-gray-400">ms</div>
            </div>
          </div>

          {/* FOOTER: SUNUCU BİLGİSİ */}
          <div className="w-full mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Wifi size={16} />
              <span className="font-medium">
                {t("tools.speedtest.connection_label")}
              </span>
              <span className="text-gray-900 font-bold">
                {t("tools.speedtest.network_name")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Server size={16} className="text-gray-400" />
              <select
                className="bg-transparent font-bold text-indigo-600 outline-none cursor-pointer hover:text-indigo-800 text-right"
                value={selectedServerMachine}
                onChange={(e) => {
                  setSelectedServerMachine(e.target.value);
                  setServerInfo(
                    servers.find((s) => s.machine === e.target.value),
                  );
                }}
                disabled={status === "downloading" || status === "uploading"}
              >
                {serverInfo ? (
                  <option value={serverInfo.machine}>
                    {getServerLabel(serverInfo)}
                  </option>
                ) : (
                  <option>{t("tools.speedtest.server_auto")}</option>
                )}
                {servers.map((s) => (
                  <option key={s.machine} value={s.machine}>
                    {getServerLabel(s)}{" "}
                    {rttMap[s.machine] ? `(${rttMap[s.machine]}ms)` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <AdBanner slot="1234567890" />
      </div>

    </div>
  );
};

export default SpeedTest;
