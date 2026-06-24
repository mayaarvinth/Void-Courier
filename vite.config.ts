import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: './',
  plugins: [
    tsconfigPaths(),
    react(),
  ],
  css: {
    devSourcemap: false, 
  },
  build: {
    cssCodeSplit: false, // Moved inside the correct build object block
  },
  server: {
    port: 5173,
    host: "127.0.0.1",
    strictPort: true,
    hmr: {
      protocol: "ws",
      host: "127.0.0.1",
    },
  },
});