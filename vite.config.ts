import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",
  base: "/front_6th_chapter2-1/",
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        advanced: "./index.advanced.html",
      },
    },
    outDir: "dist",
    copyPublicDir: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.ts",
  },
});