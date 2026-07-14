import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },

    build: {
      target: "esnext",

      // 🔥 Reduce bundle size
      minify: "esbuild",

      // 🔥 Improve chunking
      rollupOptions: {
        output: {
          manualChunks: {
            // Core libs
            react: ["react", "react-dom"],

            // Animation (choose only ONE!)
            motion: ["framer-motion"],

            // Icons
            icons: ["lucide-react"],

            // Utils
            vendor: ["axios"],
          },
        },
      },

      // 🔥 Helps browser caching
      chunkSizeWarningLimit: 1000,
    },

    // Remove debug statements only from production builds.
    esbuild:
      mode === "production"
        ? {
            drop: ["console", "debugger"],
          }
        : {},

    // 🔥 Optimize dependency pre-bundling
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  };
});
