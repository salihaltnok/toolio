import React, { useEffect } from "react";

const AdBanner = ({ slot, format = "auto", className = "" }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense hatası:", e);
    }
  }, []);

  return (
    <div className={`my-8 text-center ${className}`}>
      {/* Gerçek AdSense Kodu */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8558157540388037"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;
