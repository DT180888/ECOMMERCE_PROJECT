import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@shared/ui": path.resolve(__dirname, "src/components/common"),
      "@my-project/ui": path.resolve(__dirname, "src/shared/ui"),
      "@my-project/api": path.resolve(__dirname, "src/shared/api"),
      "@my-project/shared-utils": path.resolve(__dirname, "src/shared/utils"),
      "@schemas": path.resolve(__dirname, "src/schemas"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-charts": ["recharts"],
          "vendor-select": ["react-select"],
          "vendor-form": ["react-hook-form", "zod", "@hookform/resolvers"],
          "vendor-icons": ["@heroicons/react/24/outline", "@heroicons/react/24/solid"],
          "vendor-utils": ["axios", "jwt-decode", "zustand"],
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-tabs",
            "@radix-ui/react-slot"
          ],
        },
      },
    },
  },
});
