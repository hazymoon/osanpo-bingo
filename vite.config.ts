/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // 純関数のユニットテスト（bingo.ts / random.ts）。DOM不要なので node 環境で十分軽量。
  test: {
    environment: "node",
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "おさんぽビンゴ",
        short_name: "おさんぽビンゴ",
        description: "街で見つけたものでビンゴ",
        lang: "ja",
        theme_color: "#e85d9b",
        background_color: "#fffdf5",
        display: "standalone",
        orientation: "portrait",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
});
