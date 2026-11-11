/**
 * Rolldown `output.chunkFileNames` for core and shell (INF-17).
 *
 * Every element registers itself at module top level in a `tulpar-*.ts`
 * source file. The library build moves those modules into shared, hashed
 * chunks, so the chunk is where the side effect lives. A chunk that holds an
 * element module is named `tulpar-<name>-<hash>.js`; every other chunk keeps
 * `<name>-<hash>.js`. `package.json` `sideEffects` then lists
 * `./dist/tulpar-*.js` and a consumer's bundler never drops a registration.
 */
const ELEMENT_MODULE = /[\/]tulpar-[^\/]+\.ts$/;

export function elementChunkFileNames(chunk: { name: string; moduleIds: string[] }): string {
  const isElementChunk = chunk.moduleIds.some((id) => ELEMENT_MODULE.test(id));
  if (!isElementChunk) return "[name]-[hash].js";
  return chunk.name.startsWith("tulpar-") ? "[name]-[hash].js" : "tulpar-[name]-[hash].js";
}
