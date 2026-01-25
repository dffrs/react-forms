/// <reference types="vitest" />
/// <reference types="vite/client" />
//
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const overallCoverage = 80;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "istanbul",
      include: ["src/form/*"],
      clean: true,
      thresholds: {
        statements: overallCoverage,
        functions: overallCoverage,
        branches: overallCoverage,
        lines: overallCoverage,
      },
    },
  },
});
