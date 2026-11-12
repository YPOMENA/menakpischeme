import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `--mode artifact` bundles everything (jsPDF included) into one script so
// scripts/make-artifact.mjs can inline it into a single claude.ai artifact page.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  ...(mode === "artifact" && {
    build: {
      outDir: "dist-artifact",
      assetsInlineLimit: Infinity,
      rollupOptions: { output: { inlineDynamicImports: true } },
    },
  }),
}));
