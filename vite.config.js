import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Base public path - adjust if deploying to a subdirectory
  base: "/",

  // Copy everything from public/ to dist/ during build
  publicDir: "public",

  // Server config for local development
  server: {
    port: 3000,
    open: true, // Auto-open browser on dev server start
  },

  // Build config for production
  build: {
    outDir: "dist",
    // Generate sourcemaps for debugging production builds
    sourcemap: true,
    // Minify output
    minify: "terser",
  },
});
