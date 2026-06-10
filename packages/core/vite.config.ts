import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "button/index": resolve(__dirname, "src/button/index.ts"),
        "button-group/index": resolve(__dirname, "src/button-group/index.ts"),
        "text-input/index": resolve(__dirname, "src/text-input/index.ts"),
        "textarea/index": resolve(__dirname, "src/textarea/index.ts"),
        "number-input/index": resolve(__dirname, "src/number-input/index.ts"),
      },
      formats: ["es"],
    },
    outDir: "dist",
    sourcemap: true,
    // Watch mode must not wipe dist between rebuilds — downstream watchers
    // (angular/vue wrappers, playgrounds) read these files mid-rebuild and
    // hit TS2307/ENOENT until the rewrite completes.
    emptyOutDir: !process.argv.includes("--watch"),
    rollupOptions: {
      external: ["lit", "lit/decorators.js"],
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist",
      tsconfigPath: "./tsconfig.json",
    }),
  ],
});
