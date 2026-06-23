/**
 * Teardown symmetry tests for ListboxOverlay.
 * Proves that listeners registered during open() are fully removed after
 * close() and destroy() — no resource leaks.
 */

import { expect } from "@open-wc/testing";
import { ListboxOverlay } from "./listbox-overlay";
import { __resetOverlayRootForTest } from "../overlay/overlay-root";

function makeHarness() {
  const host = document.createElement("div");
  const trigger = document.createElement("button");
  const listbox = document.createElement("div");
  host.appendChild(trigger);
  host.appendChild(listbox);
  document.body.appendChild(host);

  // open() awaits host.updateComplete — provide a resolved stub.
  (host as unknown as { updateComplete: Promise<unknown> }).updateComplete = Promise.resolve();

  let dismissCount = 0;
  let scrollCount = 0;
  let pointerDownCount = 0;

  const overlay = new ListboxOverlay({
    host: host as HTMLElement & { updateComplete: Promise<unknown> },
    getTrigger: () => trigger,
    getListbox: () => listbox,
    onDismiss: () => {
      dismissCount++;
    },
    onScrollOrResize: () => {
      scrollCount++;
    },
    onOutsidePointerDown: () => {
      pointerDownCount++;
    },
  });

  function cleanup() {
    overlay.destroy();
    if (host.parentElement) host.parentElement.removeChild(host);
  }

  return {
    overlay,
    host,
    trigger,
    listbox,
    dismissCount: () => dismissCount,
    scrollCount: () => scrollCount,
    pointerDownCount: () => pointerDownCount,
    resetScroll: () => {
      scrollCount = 0;
    },
    resetPointerDown: () => {
      pointerDownCount = 0;
    },
    cleanup,
  };
}

describe("ListboxOverlay teardown", () => {
  afterEach(() => {
    __resetOverlayRootForTest();
  });

  it("after close(), a window scroll no longer fires onScrollOrResize", async () => {
    const h = makeHarness();
    try {
      await h.overlay.open();
      h.resetScroll();

      // Confirm scroll fires while open.
      window.dispatchEvent(new Event("scroll"));
      expect(h.scrollCount()).to.equal(1);

      h.overlay.close();
      h.resetScroll();

      // After close, scroll listener must be removed.
      window.dispatchEvent(new Event("scroll"));
      expect(h.scrollCount()).to.equal(0);
    } finally {
      h.cleanup();
    }
  });

  it("after destroy(), a document pointerdown no longer fires onOutsidePointerDown", async () => {
    const h = makeHarness();
    try {
      await h.overlay.open();
      h.resetPointerDown();

      // Confirm pointerdown on body (outside trigger/listbox) fires while open.
      document.body.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true, composed: true }),
      );
      expect(h.pointerDownCount()).to.equal(1);

      h.overlay.destroy();
      h.resetPointerDown();

      // After destroy, the listener must be removed.
      document.body.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true, composed: true }),
      );
      expect(h.pointerDownCount()).to.equal(0);
    } finally {
      // destroy() already called above, but cleanup() is idempotent (destroy is).
      if (h.host.parentElement) h.host.parentElement.removeChild(h.host);
    }
  });

  it("open()/close() are idempotent (double-open does not double-register scroll)", async () => {
    const h = makeHarness();
    try {
      await h.overlay.open();
      // A second open() while already open must be a no-op (guard: if (this._open) return).
      await h.overlay.open();

      // close() once — must remove the single registration cleanly.
      h.overlay.close();
      h.resetScroll();

      // Scroll must NOT fire — listener was removed.
      window.dispatchEvent(new Event("scroll"));
      expect(h.scrollCount()).to.equal(0);
    } finally {
      h.cleanup();
    }
  });
});
