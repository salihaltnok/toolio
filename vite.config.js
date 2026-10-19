import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const browserOnlyStub = fileURLToPath(
  new URL("./src/lib/ssr-stub.js", import.meta.url),
);

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  resolve: {
    // Prerender (Node.js) sırasında sadece tarayıcıda çalışan kütüphaneler
    // yüklenmesin; bunlar zaten yalnızca butona basınca kullanılıyor.
    alias: isSsrBuild ? { "html2pdf.js": browserOnlyStub } : {},
  },
  ssr: {
    // react-helmet-async CommonJS/ESM karışık; SSR paketine dahil et.
    noExternal: ["react-helmet-async"],
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
}));
