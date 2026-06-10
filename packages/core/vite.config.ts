import { readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

/** src/<dir>/index.ts olan her dizin bir entry'dir; _internal hariç. */
export function scanEntries(srcDir: string): Record<string, string> {
  const entries: Record<string, string> = { index: resolve(srcDir, "index.ts") };
  for (const d of readdirSync(srcDir, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name.startsWith("_")) continue;
    const idx = resolve(srcDir, d.name, "index.ts");
    if (existsSync(idx)) entries[`${d.name}/index`] = idx;
  }
  return entries;
}

export default defineConfig({
  build: {
    lib: {
      entry: scanEntries(resolve(__dirname, "src")),
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
