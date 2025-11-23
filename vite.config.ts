import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: 'localhost',
    port: 8080,
  },
  build: {
    outDir: 'ERYCK_STYLE',
    // Increase warning limit and split large vendor libs into manual chunks
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('date-fns')) return 'vendor-date-fns';
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('@supabase') || id.includes('supabase')) return 'vendor-supabase';
            if (id.includes('@tanstack') || id.includes('react-query')) return 'vendor-tanstack';
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('radix')) return 'vendor-radix';
            // fallback for other node_modules
            return 'vendor';
          }
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
