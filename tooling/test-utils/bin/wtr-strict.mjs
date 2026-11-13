#!/usr/bin/env node
// `wtr` with one extra gate: the run fails when a test file collected 0 tests.
//
// Web Test Runner 1.0 already exits 1 when the `files` pattern matches nothing,
// but a matched file that registers no tests (or hangs before mocha reports
// any) still ends with "all tests passed" and exit 0. WTR 1.0 has no config
// option for this (checked TestRunnerCoreConfig; the CLI exits with
// `process.exit(passed ? 0 : 1)`), so this wrapper starts WTR through its public
// `startTestRunner({ autoExitProcess: false })` API, keeps WTR's own CLI args
// and config loading, and adds the check before exiting.
import { startTestRunner } from "@web/test-runner";

/** @param {import("@web/test-runner").TestSuiteResult | undefined} suite */
function countTests(suite) {
  if (!suite) return 0;
  return suite.tests.length + suite.suites.reduce((n, s) => n + countTests(s), 0);
}

const runner = await startTestRunner({ autoExitProcess: false });
if (!runner) {
  // Start error (bad config, no files matched). WTR printed it and exits 1 itself.
  process.exitCode = 1;
} else {
  const stop = () => runner.stop();
  process.on("SIGINT", stop);
  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception, stopping test runner..\n", error);
    stop();
  });

  runner.on("stopped", (passed) => {
    let ok = passed;
    if (!runner.config.watch) {
      const empty = Array.from(runner.sessions.all()).filter(
        (s) => countTests(s.testResults) === 0,
      );
      if (empty.length > 0) {
        ok = false;
        console.error("\nError: 0 tests collected in these test files (file × browser):");
        for (const s of empty) console.error(`  - ${s.testFile} [${s.browser.name}]`);
        console.error("A test file must register at least one test.\n");
      }
    }
    process.exit(ok ? 0 : 1);
  });
}
