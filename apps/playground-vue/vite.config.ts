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
  // Best-practice hygiene for a Vite app consuming Lit web components: keep a
  // single Lit instance so any lit-html directive resolves correctly. (The rail
  // flyout itself avoids directives in its hot path — see tulpar-nav-item — so it
  // no longer depends on this, but unsafeSVG for string icons still benefits.)
  resolve: {
    dedupe: ["lit", "lit-html", "lit-element", "@lit/reactive-element"],
  },
  // Prevent Vite from pre-bundling Tulpar packages — their token CSS and
  // component JS change as we develop, and the pre-bundle cache holds onto
  // stale versions. Source resolution + HMR pick up changes immediately.
  optimizeDeps: {
    exclude: ["@tulpar-ui/tokens", "@tulpar-ui/core", "@tulpar-ui/shell", "@tulpar-ui/vue"],
  },
});
