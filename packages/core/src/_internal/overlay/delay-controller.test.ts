import { expect } from "@open-wc/testing";
import { overlayDelay, configureOverlayDelays } from "./delay-controller";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("overlayDelay", () => {
  beforeEach(() => {
    overlayDelay.reset();
    // Small, deterministic durations for fast tests.
    configureOverlayDelays({ delayOpen: 40, delayClose: 40, skipDelayGrace: 60 });
  });

  afterEach(() => {
    overlayDelay.reset();
  });

  it("delays the first open by delayOpen", async () => {
    let opened = false;
    overlayDelay.requestOpen("a", () => {
      opened = true;
    });
    await wait(20);
    expect(opened).to.equal(false);
    await wait(40);
    expect(opened).to.equal(true);
  });

  it("opens a sibling immediately when within the skip-delay grace window", async () => {
    overlayDelay.requestOpen("a", () => {});
    await wait(50); // let "a" open (delayOpen 40) — we are now within grace
    let bOpened = false;
    overlayDelay.requestOpen("b", () => {
      bOpened = true;
    });
    await wait(0);
    expect(bOpened).to.equal(true);
  });

  it("returns to a full delay after the grace window expires", async () => {
    overlayDelay.requestOpen("a", () => {});
    await wait(50); // a opens at ~40
    await wait(80); // grace (60) expires after the last open
    let cOpened = false;
    overlayDelay.requestOpen("c", () => {
      cOpened = true;
    });
    await wait(10);
    expect(cOpened).to.equal(false);
    await wait(50);
    expect(cOpened).to.equal(true);
  });

  it("delays close by delayClose", async () => {
    let closed = false;
    overlayDelay.requestClose("a", () => {
      closed = true;
    });
    await wait(20);
    expect(closed).to.equal(false);
    await wait(40);
    expect(closed).to.equal(true);
  });

  it("cancel during close keeps it open", async () => {
    let closed = false;
    overlayDelay.requestClose("a", () => {
      closed = true;
    });
    await wait(20);
    overlayDelay.cancel("a");
    await wait(50);
    expect(closed).to.equal(false);
  });

  it("cancel during open prevents the open", async () => {
    let opened = false;
    overlayDelay.requestOpen("a", () => {
      opened = true;
    });
    await wait(20);
    overlayDelay.cancel("a");
    await wait(50);
    expect(opened).to.equal(false);
  });

  it("a new request for the same key supersedes a pending one", async () => {
    let n = 0;
    overlayDelay.requestClose("a", () => {
      n += 1;
    });
    // Re-request open for the same key cancels the pending close.
    overlayDelay.requestOpen("a", () => {});
    await wait(80);
    expect(n).to.equal(0);
  });
});
