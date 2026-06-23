// app.config.ts
import { defineConfig } from "vinxi";
import { tanstackStartVite } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
var app_config_default = defineConfig({
  routers: {
    public: {
      type: "static",
      dir: "./public",
      base: "/"
    },
    client: {
      type: "client",
      handler: "./src/client.tsx",
      target: "browser",
      plugins: () => [tsconfigPaths(), tanstackStartVite()]
    },
    ssr: {
      type: "http",
      handler: "./src/entry-server.tsx",
      plugins: () => [tsconfigPaths(), tanstackStartVite()]
    }
  }
});
export {
  app_config_default as default
};
