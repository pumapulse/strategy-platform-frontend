import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
<<<<<<< HEAD
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
=======

// https://vitejs.dev/config/
export default defineConfig(() => ({
>>>>>>> 1f5628b314e16b48d2341fe649cfad7b8eff92a9
  server: {
    host: "::",
    port: 8080,
  },
<<<<<<< HEAD
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
=======
  plugins: [react()],
>>>>>>> 1f5628b314e16b48d2341fe649cfad7b8eff92a9
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
