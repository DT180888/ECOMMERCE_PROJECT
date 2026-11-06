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
      "@my-project/ui": path.resolve(__dirname, "src/shared/ui"),
      "@my-project/api": path.resolve(__dirname, "src/shared/api"),
      "@my-project/shared-utils": path.resolve(__dirname, "src/shared/utils"),
      "@schemas": path.resolve(__dirname, "src/schemas"),
    },
    dedupe: ["react", "react-dom"],
  },
});
