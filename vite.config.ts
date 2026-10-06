import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
// Public (publishable) backend values, used as fallback when external hosts
// (Netlify, Vercel, Liara) build without env vars — otherwise the app renders blank.
const FALLBACK_URL = "https://wzhnfmadpedrnpsytxwv.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aG5mbWFkcGVkcm5wc3l0eHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2OTU3NTYsImV4cCI6MjA3NzI3MTc1Nn0.tzubwBf9va-Trk5m91W9CTxa7TyUR3IWNmfPvEBezZo";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL || FALLBACK_URL),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_KEY),
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
