import React, { Suspense } from "react"; // 1. Suspense'i import et
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 2. Uygulamayı Suspense ile sarmala */}
    <Suspense fallback={<div className="p-10 text-center">Yükleniyor...</div>}>
      <App />
    </Suspense>
  </StrictMode>
);
