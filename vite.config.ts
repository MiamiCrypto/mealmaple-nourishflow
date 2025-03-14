
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    // Optimize build for deployment on Netlify
    assetsDir: "assets",
    outDir: "dist",
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
        manualChunks: undefined,
      },
    },
    // Avoid using native dependencies that might cause issues
    target: 'es2015',
    // Add terser options to ensure it works correctly
    terserOptions: {
      format: {
        comments: false,
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
  // Adding base URL configuration to ensure paths are correctly resolved
  base: '/',
  // Optimize dependencies to ensure all required packages are available
  optimizeDeps: {
    include: ['terser'],
  },
}));
