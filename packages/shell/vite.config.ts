import { readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalsFrom } from "../../scripts/vite-externals.ts";
import { elementChunkFileNames } from "../../scripts/vite-chunks.ts";

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
      entry: scanEntries(resolve(import.meta.dirname, "src")),
      formats: ["es"],
    },
    outDir: "dist",
    sourcemap: true,
    // Watch mode must not wipe dist between rebuilds — downstream watchers
    // (angular/vue wrappers, playgrounds) read these files mid-rebuild and
    // hit TS2307/ENOENT until the rewrite completes.
    emptyOutDir: !process.argv.includes("--watch"),
    // Patterns (bare name + any subpath), never exact strings: an exact "lit"
    // external inlines lit/directives/*, lit-html and @lit/reactive-element,
    // producing a second lit-html instance (INF-2).
    rolldownOptions: {
      external: externalsFrom(resolve(import.meta.dirname, "package.json")),
      // Element chunks are named tulpar-*.js so `sideEffects` can list them.
      output: { chunkFileNames: elementChunkFileNames },
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
