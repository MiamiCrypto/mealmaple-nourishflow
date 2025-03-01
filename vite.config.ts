
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",  // Keep base URL as root for custom domain
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    // Optimize build for deployment
    assetsDir: "assets",
    outDir: "dist",
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Ensure proper JavaScript module format
        format: 'es',
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
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
