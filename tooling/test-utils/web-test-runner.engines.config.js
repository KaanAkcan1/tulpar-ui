import { playwrightLauncher } from "@web/test-runner-playwright";
import base from "./web-test-runner.config.js";

// The helpers must behave the same in Firefox and WebKit (engine detection, snapshot parsing).
export default {
  ...base,
  browsers: [playwrightLauncher({ product: "firefox" }), playwrightLauncher({ product: "webkit" })],
};
