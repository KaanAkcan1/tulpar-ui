// Server side (Node). Loaded by the Web Test Runner config, never by the browser.
//
// Why a custom command: `@web/test-runner-commands`' `a11y-snapshot` calls
// `page.accessibility.snapshot()`, which Playwright removed (absent in 1.65).
// `locator.ariaSnapshot()` is the supported replacement. It returns the computed
// accessibility tree (role, accessible name, states) as YAML and pierces open
// shadow roots, so it sees what a screen reader gets across shadow boundaries.
import type { TestRunnerPlugin } from "@web/test-runner";
import type { Page } from "playwright";

export const ARIA_SNAPSHOT_COMMAND = "aria-snapshot";

export interface AriaSnapshotPayload {
  selector: string;
}

/** The part of `PlaywrightLauncher` (@web/test-runner-playwright 1.0) this plugin uses. */
interface PlaywrightSessionBrowser {
  type: string;
  getPage(sessionId: string): Page;
}

/** Upper bound for one snapshot; ariaSnapshot() otherwise waits without limit. */
const SNAPSHOT_TIMEOUT_MS = 5000;

export function ariaSnapshotPlugin(): TestRunnerPlugin<AriaSnapshotPayload> {
  return {
    name: "tulpar-aria-snapshot",
    async executeCommand({ command, payload, session }) {
      if (command !== ARIA_SNAPSHOT_COMMAND) return undefined;
      if (!payload || typeof payload.selector !== "string" || payload.selector === "") {
        throw new Error(`${ARIA_SNAPSHOT_COMMAND}: payload must be { selector: string }`);
      }
      const browser = session.browser as unknown as PlaywrightSessionBrowser;
      if (browser.type !== "playwright") {
        throw new Error(
          `${ARIA_SNAPSHOT_COMMAND}: needs the Playwright launcher, got "${browser.type}"`,
        );
      }
      const page = browser.getPage(session.id);
      return page.locator(payload.selector).ariaSnapshot({ timeout: SNAPSHOT_TIMEOUT_MS });
    },
  };
}
