import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],

  base: "/",

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir: "build/client",
    sourcemap: true,
  },
});
