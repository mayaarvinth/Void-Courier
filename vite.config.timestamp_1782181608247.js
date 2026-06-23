// vite.config.ts
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/vite";
import react from "@vitejs/plugin-react";
var vite_config_default = defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackStart(),
    react()
  ],
  server: {
    port: 3e3,
    hmr: {
      protocol: "ws",
      host: "localhost"
    }
  }
});
export {
  vite_config_default as default
};
