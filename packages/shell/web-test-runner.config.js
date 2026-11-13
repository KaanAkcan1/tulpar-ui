import { playwrightLauncher } from "@web/test-runner-playwright";
import { esbuildPlugin } from "@web/dev-server-esbuild";
import { ariaSnapshotPlugin } from "@tulpar-ui/test-utils/plugin";

// Default run: Chromium (fast local loop, and the only engine with native V8
// coverage). Firefox + WebKit run from web-test-runner.engines.config.js.
export default {
  // Distinct port from @tulpar-ui/core (which uses the WTR default) so the two
  // packages don't collide on EADDRINUSE when `pnpm -r run test` runs them concurrently.
  port: 8002,
  files: "src/**/*.test.ts",
  // "development" picks dev builds (lit dev mode, esm-env DEV=true) so dev-only warnings are testable.
  nodeResolve: { exportConditions: ["development"] },
  browsers: [playwrightLauncher({ product: "chromium" })],
  plugins: [
    esbuildPlugin({ ts: true, target: "es2022", tsconfig: "./tsconfig.wtr.json" }),
    ariaSnapshotPlugin(),
  ],
  // Lit prints its dev-mode banner once per test file; it is expected here and only noise.
  filterBrowserLogs: ({ args }) =>
    !(typeof args[0] === "string" && args[0].startsWith("Lit is in dev mode")),
  testFramework: {
    config: {
      ui: "bdd",
      timeout: "5000",
    },
  },
  coverageConfig: {
    report: true,
    reportDir: "coverage",
    // Same scope as @tulpar-ui/core: our own source only, never third-party deps or tests.
    include: ["src/**/*.ts"],
    exclude: ["**/node_modules/**", "**/*.test.ts"],
    threshold: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
