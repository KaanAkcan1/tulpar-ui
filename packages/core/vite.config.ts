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
      },
      formats: ["es"],
    },
    outDir: "dist",
    sourcemap: true,
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
