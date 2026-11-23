import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL("./demo/", import.meta.url)),
  base: "/",
  plugins: [react()],
  build: {
    outDir: fileURLToPath(new URL("./dist/demo/", import.meta.url)),
    emptyOutDir: true,
  },
});
