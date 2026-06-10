// vite.config.ts
import { resolve } from "node:path";
import { defineConfig } from "file:///C:/Source/Kaan/tulpar-ui/node_modules/.pnpm/vite@5.4.21/node_modules/vite/dist/node/index.js";
import dts from "file:///C:/Source/Kaan/tulpar-ui/node_modules/.pnpm/vite-plugin-dts@3.9.1_typescript@6.0.3_vite@5.4.21/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Source\\Kaan\\tulpar-ui\\packages\\core";
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__vite_injected_original_dirname, "src/index.ts"),
        "button/index": resolve(__vite_injected_original_dirname, "src/button/index.ts"),
        "button-group/index": resolve(__vite_injected_original_dirname, "src/button-group/index.ts"),
        "text-input/index": resolve(__vite_injected_original_dirname, "src/text-input/index.ts"),
        "textarea/index": resolve(__vite_injected_original_dirname, "src/textarea/index.ts"),
        "number-input/index": resolve(__vite_injected_original_dirname, "src/number-input/index.ts")
      },
      formats: ["es"]
    },
    outDir: "dist",
    sourcemap: true,
    // Watch mode must not wipe dist between rebuilds — downstream watchers
    // (angular/vue wrappers, playgrounds) read these files mid-rebuild and
    // hit TS2307/ENOENT until the rewrite completes.
    emptyOutDir: !process.argv.includes("--watch"),
    rollupOptions: {
      external: ["lit", "lit/decorators.js"]
    }
  },
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist",
      tsconfigPath: "./tsconfig.json"
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxTb3VyY2VcXFxcS2FhblxcXFx0dWxwYXItdWlcXFxccGFja2FnZXNcXFxcY29yZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcU291cmNlXFxcXEthYW5cXFxcdHVscGFyLXVpXFxcXHBhY2thZ2VzXFxcXGNvcmVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1NvdXJjZS9LYWFuL3R1bHBhci11aS9wYWNrYWdlcy9jb3JlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJub2RlOnBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGR0cyBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJ1aWxkOiB7XHJcbiAgICBsaWI6IHtcclxuICAgICAgZW50cnk6IHtcclxuICAgICAgICBpbmRleDogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2luZGV4LnRzXCIpLFxyXG4gICAgICAgIFwiYnV0dG9uL2luZGV4XCI6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9idXR0b24vaW5kZXgudHNcIiksXHJcbiAgICAgICAgXCJidXR0b24tZ3JvdXAvaW5kZXhcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2J1dHRvbi1ncm91cC9pbmRleC50c1wiKSxcclxuICAgICAgICBcInRleHQtaW5wdXQvaW5kZXhcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3RleHQtaW5wdXQvaW5kZXgudHNcIiksXHJcbiAgICAgICAgXCJ0ZXh0YXJlYS9pbmRleFwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvdGV4dGFyZWEvaW5kZXgudHNcIiksXHJcbiAgICAgICAgXCJudW1iZXItaW5wdXQvaW5kZXhcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL251bWJlci1pbnB1dC9pbmRleC50c1wiKSxcclxuICAgICAgfSxcclxuICAgICAgZm9ybWF0czogW1wiZXNcIl0sXHJcbiAgICB9LFxyXG4gICAgb3V0RGlyOiBcImRpc3RcIixcclxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcclxuICAgIC8vIFdhdGNoIG1vZGUgbXVzdCBub3Qgd2lwZSBkaXN0IGJldHdlZW4gcmVidWlsZHMgXHUyMDE0IGRvd25zdHJlYW0gd2F0Y2hlcnNcclxuICAgIC8vIChhbmd1bGFyL3Z1ZSB3cmFwcGVycywgcGxheWdyb3VuZHMpIHJlYWQgdGhlc2UgZmlsZXMgbWlkLXJlYnVpbGQgYW5kXHJcbiAgICAvLyBoaXQgVFMyMzA3L0VOT0VOVCB1bnRpbCB0aGUgcmV3cml0ZSBjb21wbGV0ZXMuXHJcbiAgICBlbXB0eU91dERpcjogIXByb2Nlc3MuYXJndi5pbmNsdWRlcyhcIi0td2F0Y2hcIiksXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGV4dGVybmFsOiBbXCJsaXRcIiwgXCJsaXQvZGVjb3JhdG9ycy5qc1wiXSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICBkdHMoe1xyXG4gICAgICBlbnRyeVJvb3Q6IFwic3JjXCIsXHJcbiAgICAgIG91dERpcjogXCJkaXN0XCIsXHJcbiAgICAgIHRzY29uZmlnUGF0aDogXCIuL3RzY29uZmlnLmpzb25cIixcclxuICAgIH0pLFxyXG4gIF0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdULFNBQVMsZUFBZTtBQUN4VSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFGaEIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLFFBQ0wsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxRQUN4QyxnQkFBZ0IsUUFBUSxrQ0FBVyxxQkFBcUI7QUFBQSxRQUN4RCxzQkFBc0IsUUFBUSxrQ0FBVywyQkFBMkI7QUFBQSxRQUNwRSxvQkFBb0IsUUFBUSxrQ0FBVyx5QkFBeUI7QUFBQSxRQUNoRSxrQkFBa0IsUUFBUSxrQ0FBVyx1QkFBdUI7QUFBQSxRQUM1RCxzQkFBc0IsUUFBUSxrQ0FBVywyQkFBMkI7QUFBQSxNQUN0RTtBQUFBLE1BQ0EsU0FBUyxDQUFDLElBQUk7QUFBQSxJQUNoQjtBQUFBLElBQ0EsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBO0FBQUE7QUFBQTtBQUFBLElBSVgsYUFBYSxDQUFDLFFBQVEsS0FBSyxTQUFTLFNBQVM7QUFBQSxJQUM3QyxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsT0FBTyxtQkFBbUI7QUFBQSxJQUN2QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLFdBQVc7QUFBQSxNQUNYLFFBQVE7QUFBQSxNQUNSLGNBQWM7QUFBQSxJQUNoQixDQUFDO0FBQUEsRUFDSDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
