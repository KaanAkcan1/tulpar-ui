import { playwrightLauncher } from "@web/test-runner-playwright";
import { esbuildPlugin } from "@web/dev-server-esbuild";
import { ariaSnapshotPlugin } from "@tulpar-ui/test-utils/plugin";

// Default run: Chromium (fast local loop, and the only engine with native V8
// coverage). Firefox + WebKit run from web-test-runner.engines.config.js.
export default {
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
    // Measure the threshold against our own source only — never against
    // bundled third-party deps (lit, chai, open-wc helpers) or test files,
    // whose internal functions would otherwise drag the aggregate below 80%.
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
