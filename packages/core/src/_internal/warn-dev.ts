import { DEV } from "esm-env";

/**
 * Dev-only console.warn, following Lit's convention (INF-5).
 *
 * `DEV` comes from `esm-env`, which resolves through the consumer's export
 * conditions: `development` → `true` (bundler dev servers, Web Test Runner),
 * `production` → `false` (production builds, where the body and the call are
 * dropped as dead code). Without either condition (an unbundled CDN script)
 * it falls back to `process.env.NODE_ENV`, so warnings stay off.
 *
 * Library source never reads `import.meta.env` or `process.env` directly.
 */
export function warnDev(msg: string, ctx?: unknown): void {
  if (DEV) {
    if (ctx === undefined) console.warn(msg);
    else console.warn(msg, ctx);
  }
}
