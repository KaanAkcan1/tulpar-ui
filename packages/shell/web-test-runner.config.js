import { playwrightLauncher } from "@web/test-runner-playwright";
import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
  // Distinct port from @tulpar-ui/core (which uses the WTR default) so the two
  // packages don't collide on EADDRINUSE when `pnpm -r run test` runs them concurrently.
  port: 8002,
  files: "src/**/*.test.ts",
  nodeResolve: true,
  browsers: [playwrightLauncher({ product: "chromium" })],
  plugins: [esbuildPlugin({ ts: true, target: "es2022", tsconfig: "./tsconfig.wtr.json" })],
  testFramework: {
    config: {
      ui: "bdd",
      timeout: "5000",
    },
  },
  coverageConfig: {
    report: true,
    reportDir: "coverage",
    threshold: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
