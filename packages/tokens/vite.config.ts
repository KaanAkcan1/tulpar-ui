import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        fallbacks: resolve(import.meta.dirname, "src/fallbacks.ts"),
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    outDir: "dist",
    sourcemap: true,
    // Build: start clean so no stale file (e.g. an old .d.ts.map) is published.
    // Watch: keep dist; the `dev` script writes dist/css before the watcher starts.
    emptyOutDir: !process.argv.includes("--watch"),
  },
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist",
      tsconfigPath: "./tsconfig.json",
      // Publish builds ship no .d.ts.map (src/ is not in the tarball, INF-17);
      // watch builds keep them so go-to-definition reaches src/.
      compilerOptions: { declarationMap: process.argv.includes("--watch") },
    }),
  ],
});
