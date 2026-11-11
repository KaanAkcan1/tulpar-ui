import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { externalsFrom } from "../../scripts/vite-externals.ts";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("tulpar-"),
        },
      },
    }),
    dts({
      entryRoot: "src",
      outDir: "dist",
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rolldownOptions: {
      // Patterns: dependencies + peerDependencies, bare name and any subpath.
      external: externalsFrom(resolve(import.meta.dirname, "package.json")),
    },
    outDir: "dist",
    sourcemap: true,
    // Watch mode must not wipe dist between rebuilds — downstream watchers
    // (playgrounds, docs) read these files mid-rebuild and hit ENOENT.
    emptyOutDir: !process.argv.includes("--watch"),
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
