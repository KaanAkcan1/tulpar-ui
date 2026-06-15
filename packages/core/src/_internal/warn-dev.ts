/**
 * Dev-only console.warn. In production bundles, the conditional is
 * tree-shaken by Vite/Rollup constant folding around `import.meta.env.DEV`
 * and `process.env.NODE_ENV`.
 *
 * Defaults to dev (warning enabled) when neither flag is observable —
 * matches the principle that production must be opted into by a bundler
 * actively setting `NODE_ENV=production` or replacing `import.meta.env.DEV`
 * with `false`.
 */
export function warnDev(msg: string, ctx?: unknown): void {
  const metaEnv =
    typeof import.meta !== "undefined"
      ? (import.meta as unknown as { env?: { DEV?: boolean; PROD?: boolean } }).env
      : undefined;
  const proc = (globalThis as unknown as { process?: { env?: { NODE_ENV?: string } } }).process;
  const nodeEnv = proc?.env?.NODE_ENV;

  const isProd = metaEnv?.PROD === true || nodeEnv === "production";
  const isDev =
    metaEnv?.DEV === true || (nodeEnv !== undefined && nodeEnv !== "production") || !isProd;

  if (isDev && !isProd) {
    if (ctx === undefined) console.warn(msg);
    else console.warn(msg, ctx);
  }
}
