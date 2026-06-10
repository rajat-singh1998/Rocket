import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("gsap")) return "motion";
            if (id.includes("lucide-react")) return "icons";
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
              return "react-vendor";
            }
            return "vendor";
          }

          if (id.includes("/src/pages/admin/") || id.includes("\\src\\pages\\admin\\")) {
            return "admin";
          }

          return undefined;
        }
      }
    }
  }
});
