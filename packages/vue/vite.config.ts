import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

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
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      // Regex: subpath imports (@tulpar-ui/core/text-input etc.) must stay
      // external too — an exact-string external silently bundles them INTO
      // this wrapper (duplicating core's components in the vue dist).
      external: ["vue", /^@tulpar-ui\/core(\/.*)?$/],
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
