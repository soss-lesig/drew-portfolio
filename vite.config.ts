import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [reactRouter()],

  base: "/",

  server: {
    port: 3000,
    open: true,
  },

  build: {
    sourcemap: !isProduction,
  },
});
