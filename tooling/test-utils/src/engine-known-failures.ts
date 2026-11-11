// Browser side. The one shared list of tests that fail in Firefox or WebKit
// because of a real product bug that a later phase-1 package fixes.
//
// Rules (design spec 1.1 §5.2):
// - Every entry names a retro finding ID, or `ENG-<n>` for a failure the retro
//   did not record, plus the engines, the exact test title and the owning package.
// - Harness or timing failures are fixed, never listed here.
// - The package that fixes the bug removes the entry (and the `itUnlessEngine` call).
// - More than 20 `ENG-*` entries → stop and report to the owner.

export type Engine = "chromium" | "firefox" | "webkit";

export interface EngineKnownFailure {
  id: string;
  engines: ("firefox" | "webkit")[];
  test: string;
  reason: string;
  ownerPackage: "1.2" | "1.3" | "1.4" | "1.5" | "1.6" | "1.7";
}

export const ENGINE_KNOWN_FAILURES: ReadonlyArray<EngineKnownFailure> = [];

/** The engine the current test page runs in (Playwright's Chromium, Firefox or WebKit). */
export function currentEngine(): Engine {
  const ua = navigator.userAgent;
  if (/Firefox\//.test(ua)) return "firefox";
  if (/AppleWebKit\//.test(ua) && !/Chrome\//.test(ua)) return "webkit";
  return "chromium";
}

/**
 * `it()` that is skipped only in the engines that `ENGINE_KNOWN_FAILURES` lists
 * for (`id`, `title`). Every other engine runs the test unchanged. An unknown
 * (`id`, `title`) pair throws, so a skip without a registered finding is impossible.
 */
export function itUnlessEngine(id: string, title: string, fn: Mocha.Func): void {
  const entry = ENGINE_KNOWN_FAILURES.find((e) => e.id === id && e.test === title);
  if (!entry) {
    throw new Error(
      `itUnlessEngine: no ENGINE_KNOWN_FAILURES entry for id "${id}" and test "${title}"`,
    );
  }
  const engine = currentEngine();
  if (engine !== "chromium" && entry.engines.includes(engine)) {
    it.skip(`${title} [known ${engine} failure ${id}, fixed in ${entry.ownerPackage}]`, fn);
  } else {
    it(title, fn);
  }
}
