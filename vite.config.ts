import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // GitHub Pages project-site base path
  // Local development uses "/"
  // GitHub Actions uses "/Python-Programming-With-DSA/"
  base: process.env.GITHUB_ACTIONS
    ? "/Python-Programming-With-DSA/"
    : "/",

  build: {
    outDir: "dist",
    sourcemap: false,
  },

  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
