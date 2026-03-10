import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,         // listen on all network interfaces
    port: 5173,
    strictPort: true,   // ensure port 5173 is used
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "attacks-arms-eng-stylish.trycloudflare.com", // ONLY this tunnel allowed
    ],
    proxy: {
      "/api/v1": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});