// vite.config.ts
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
var vite_config_default = defineConfig({
  plugins: [
    TanStackRouterVite(),
    tsconfigPaths(),
    react()
  ],
  server: {
    hmr: {
      protocol: "ws",
      host: "localhost"
    }
  }
});
export {
  vite_config_default as default
};
