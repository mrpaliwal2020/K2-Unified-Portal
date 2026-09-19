import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    allowedHosts: ["uselessly-savior-causation.ngrok-free.dev"],
    proxy: {
      "/k2kapi": {
        target: "http://3.109.253.115",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
