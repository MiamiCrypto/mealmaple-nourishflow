
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/mealmaple-nourishflow/",  // Keep correct base path for GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    // Optimize build for deployment on GitHub Pages
    assetsDir: "assets",
    outDir: "dist",
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Using '.mjs' extension for JavaScript modules to ensure proper MIME types on GitHub Pages
        entryFileNames: "assets/[name].[hash].mjs",
        chunkFileNames: "assets/[name].[hash].mjs",
        assetFileNames: "assets/[name].[hash].[ext]",
        manualChunks: undefined,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
