import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("tulpar-"),
        },
      },
    }),
  ],
  server: {
    port: 5273,
    strictPort: true,
  },
  preview: {
    port: 5273,
    strictPort: true,
  },
  // Prevent Vite from pre-bundling Tulpar packages — their token CSS and
  // component JS change as we develop, and the pre-bundle cache holds onto
  // stale versions. Source resolution + HMR pick up changes immediately.
  optimizeDeps: {
    exclude: ["@tulpar-ui/tokens", "@tulpar-ui/core", "@tulpar-ui/vue"],
  },
});
