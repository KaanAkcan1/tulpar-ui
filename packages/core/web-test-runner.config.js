import { playwrightLauncher } from "@web/test-runner-playwright";
import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
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
