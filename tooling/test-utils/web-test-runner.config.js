import { playwrightLauncher } from "@web/test-runner-playwright";
import { esbuildPlugin } from "@web/dev-server-esbuild";
import { ariaSnapshotPlugin } from "./src/aria-snapshot-plugin.ts";

// Self-tests of the helpers. Own port: core uses 8000 (default), shell 8002.
export default {
  port: 8003,
  files: "src/**/*.test.ts",
  nodeResolve: { exportConditions: ["development"] },
  browsers: [playwrightLauncher({ product: "chromium" })],
  plugins: [esbuildPlugin({ ts: true, target: "es2022" }), ariaSnapshotPlugin()],
  filterBrowserLogs: ({ args }) =>
    !(typeof args[0] === "string" && args[0].startsWith("Lit is in dev mode")),
  testFramework: { config: { ui: "bdd", timeout: "5000" } },
};
