import { playwrightLauncher } from "@web/test-runner-playwright";
import base from "./web-test-runner.config.js";

// Firefox + WebKit (design spec 1.1 §5.2, D11). Same files, plugins and timeouts as
// the Chromium run; no coverage (native coverage is Chromium-only).
// A test that fails here because of a real product bug is listed in
// @tulpar-ui/test-utils ENGINE_KNOWN_FAILURES and written with itUnlessEngine().
//
// WebKit concurrency 4 (default: half the CPU cores): with 8 parallel pages, headless
// WebKit delays requestAnimationFrame by more than 60 ms, so wall-clock tests
// (toast auto-dismiss, toast.update) raced their own timers. Measured: 2 flaky
// failures in 4 runs at the default, 0 in 6 runs at 4.
export default {
  ...base,
  browsers: [
    playwrightLauncher({ product: "firefox" }),
    playwrightLauncher({ product: "webkit", concurrency: 4 }),
  ],
};
