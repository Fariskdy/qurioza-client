import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'handle-html5-routing',
      enforce: 'post',
      apply: 'build',
      generateBundle(options, bundle) {
        bundle['_redirects'] = {
          type: 'asset',
          fileName: '_redirects',
          source: '/* /index.html 200'
        };
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
  },
});
