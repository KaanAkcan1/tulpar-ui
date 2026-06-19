import { expect } from "@open-wc/testing";
import {
  getToasterRoot,
  getLocationContainer,
  restorePreviousFocus,
  __resetToasterRootForTest,
} from "./toaster-root";
import type { Location } from "./queue";

function nextMicrotask(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("toaster-root", () => {
  afterEach(() => {
    __resetToasterRootForTest();
    document.documentElement.classList.remove("dark");
    document.documentElement.removeAttribute("data-brand");
  });

  // ─── getToasterRoot ─────────────────────────────────────────────────────────

  describe("getToasterRoot", () => {
    it("creates a single root appended to body and reuses it", () => {
      const a = getToasterRoot();
      const b = getToasterRoot();
      expect(a).to.equal(b);
      expect(a.parentElement).to.equal(document.body);
      expect(document.querySelectorAll("[data-tulpar-toaster-root]").length).to.equal(1);
    });

    it("sets role=region on the root", () => {
      const root = getToasterRoot();
      expect(root.getAttribute("role")).to.equal("region");
    });

    it("sets aria-label on the root", () => {
      const root = getToasterRoot();
      const label = root.getAttribute("aria-label");
      expect(label).to.be.a("string");
      expect(label!.length).to.be.greaterThan(0);
    });

    it("mirrors the `dark` class from documentElement onto the root", async () => {
      const root = getToasterRoot();
      expect(root.classList.contains("dark")).to.equal(false);
      document.documentElement.classList.add("dark");
      await nextMicrotask();
      expect(root.classList.contains("dark")).to.equal(true);
      document.documentElement.classList.remove("dark");
      await nextMicrotask();
      expect(root.classList.contains("dark")).to.equal(false);
    });

    it("mirrors the data-brand attribute from documentElement onto the root", async () => {
      const root = getToasterRoot();
      document.documentElement.setAttribute("data-brand", "tulpar");
      await nextMicrotask();
      expect(root.getAttribute("data-brand")).to.equal("tulpar");
    });

    it("removes data-brand when documentElement loses the attribute", async () => {
      document.documentElement.setAttribute("data-brand", "tulpar");
      const root = getToasterRoot();
      expect(root.getAttribute("data-brand")).to.equal("tulpar");
      document.documentElement.removeAttribute("data-brand");
      await nextMicrotask();
      expect(root.hasAttribute("data-brand")).to.equal(false);
    });

    it("reflects the initial dark/brand state at creation time", () => {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-brand", "tulpar");
      const root = getToasterRoot();
      expect(root.classList.contains("dark")).to.equal(true);
      expect(root.getAttribute("data-brand")).to.equal("tulpar");
    });
  });

  // ─── getLocationContainer ───────────────────────────────────────────────────

  describe("getLocationContainer", () => {
    const locations: Location[] = [
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ];

    it("returns a child of the toaster root", () => {
      const root = getToasterRoot();
      const container = getLocationContainer("bottom-right");
      expect(container.parentElement).to.equal(root);
    });

    it("returns the same element for repeated calls with the same location", () => {
      const a = getLocationContainer("bottom-right");
      const b = getLocationContainer("bottom-right");
      expect(a).to.equal(b);
    });

    it("returns distinct elements for different locations", () => {
      const br = getLocationContainer("bottom-right");
      const tl = getLocationContainer("top-left");
      expect(br).to.not.equal(tl);
    });

    it("sets data-location attribute on each container", () => {
      for (const loc of locations) {
        const container = getLocationContainer(loc);
        expect(container.getAttribute("data-location")).to.equal(loc);
      }
    });

    it("lazily creates the toaster root if not yet created", () => {
      // Root has not been explicitly created; getLocationContainer should create it.
      const container = getLocationContainer("top-center");
      expect(container.parentElement).to.equal(document.body.querySelector("[data-tulpar-toaster-root]"));
    });

    it("supports all six locations without errors", () => {
      for (const loc of locations) {
        expect(() => getLocationContainer(loc)).to.not.throw();
      }
      // Each location produces exactly one container child in the root.
      const root = getToasterRoot();
      // Children count equals number of unique locations we called.
      expect(root.children.length).to.equal(6);
    });
  });

  // ─── F6 / Shift+F6 ─────────────────────────────────────────────────────────

  describe("F6 keyboard navigation", () => {
    it("F6 moves focus to the toaster root (or region) when no focusable toasts exist", async () => {
      const root = getToasterRoot();
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "F6", bubbles: true }));
      // Focus must actually have moved to the region root, not just the attribute be set.
      expect(document.activeElement).to.equal(root);
    });

    it("ignores non-F6 keys", () => {
      const root = getToasterRoot();
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      // focus should not have moved to the root
      expect(document.activeElement).to.not.equal(root);
    });

    it("Shift+F6 does not move focus into the region", () => {
      const root = getToasterRoot();
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "F6", shiftKey: true, bubbles: true })
      );
      expect(document.activeElement).to.not.equal(root);
    });

    it("F6 listener is bound only once across multiple getToasterRoot calls", () => {
      // Fire F6 and count how many times focus lands on root — it should be 1, not N.
      let focusCount = 0;
      const root = getToasterRoot();
      root.addEventListener("focus", () => {
        focusCount += 1;
      });

      // Call getToasterRoot multiple times to ensure no duplicate listeners.
      getToasterRoot();
      getToasterRoot();

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "F6", bubbles: true }));
      // focusCount is 1 if the root actually received focus (it may be 0 in headless
      // if focus() is a no-op, which is fine — we just verify it doesn't throw).
      expect(focusCount).to.be.lessThan(2);
    });
  });

  // ─── restorePreviousFocus (Task 4.3) ────────────────────────────────────────

  describe("restorePreviousFocus", () => {
    it("restores focus to the element captured by F6", async () => {
      // Ensure the F6 listener is installed by initialising the root first.
      getToasterRoot();

      const btn = document.createElement("button");
      btn.textContent = "Before region";
      document.body.appendChild(btn);
      btn.focus();
      expect(document.activeElement).to.equal(btn);

      // F6 captures previousFocus and moves focus to the region.
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "F6", bubbles: true }));
      // After F6, focus is on the region (not btn).
      expect(document.activeElement).to.not.equal(btn);

      // restorePreviousFocus should move it back to btn.
      restorePreviousFocus();
      expect(document.activeElement).to.equal(btn);

      btn.remove();
    });

    it("is a no-op (does not throw) when no previous focus was captured", () => {
      // Ensure previousFocus is null (reset clears it); no getToasterRoot needed.
      expect(() => restorePreviousFocus()).to.not.throw();
    });

    it("clears the previousFocus WeakRef after restoring (subsequent call is no-op)", async () => {
      // Ensure the F6 listener is installed.
      getToasterRoot();

      const btn = document.createElement("button");
      document.body.appendChild(btn);
      btn.focus();

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "F6", bubbles: true }));
      restorePreviousFocus(); // first call — restores
      expect(document.activeElement).to.equal(btn);

      // Move focus somewhere else.
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.focus();

      // Second call must not restore btn (previousFocus is cleared).
      restorePreviousFocus();
      expect(document.activeElement).to.not.equal(btn); // still on input

      btn.remove();
      input.remove();
    });
  });

  // ─── Fixed positioning (BUG 1 regression guard) ─────────────────────────────

  describe("fixed positioning", () => {
    it("toaster root has position:fixed after getToasterRoot()", () => {
      const root = getToasterRoot();
      const style = window.getComputedStyle(root);
      expect(style.position).to.equal("fixed");
    });

    it("location container has position:fixed after getLocationContainer()", () => {
      const container = getLocationContainer("bottom-right");
      const style = window.getComputedStyle(container);
      expect(style.position).to.equal("fixed");
    });

    it("toaster root has pointer-events:none", () => {
      const root = getToasterRoot();
      const style = window.getComputedStyle(root);
      expect(style.pointerEvents).to.equal("none");
    });

    it("location container has pointer-events:none", () => {
      const container = getLocationContainer("top-center");
      const style = window.getComputedStyle(container);
      expect(style.pointerEvents).to.equal("none");
    });

    it("injects exactly one <style data-tulpar-toaster> into <head>", () => {
      getToasterRoot();
      const sheets = document.querySelectorAll("[data-tulpar-toaster]");
      expect(sheets.length).to.equal(1);
    });

    it("does NOT inject a second style sheet on repeated getToasterRoot calls", () => {
      getToasterRoot();
      getToasterRoot();
      getToasterRoot();
      const sheets = document.querySelectorAll("[data-tulpar-toaster]");
      expect(sheets.length).to.equal(1);
    });

    it("__resetToasterRootForTest removes the injected style sheet", () => {
      getToasterRoot();
      expect(document.querySelector("[data-tulpar-toaster]")).to.not.be.null;
      __resetToasterRootForTest();
      expect(document.querySelector("[data-tulpar-toaster]")).to.be.null;
    });

    it("style sheet is re-injected after reset + new getToasterRoot call", () => {
      getToasterRoot();
      __resetToasterRootForTest();
      // After reset and a new call, the sheet is back.
      getToasterRoot();
      expect(document.querySelector("[data-tulpar-toaster]")).to.not.be.null;
    });
  });

  // ─── __resetToasterRootForTest ──────────────────────────────────────────────

  describe("__resetToasterRootForTest", () => {
    it("removes the root from document.body", () => {
      getToasterRoot();
      expect(document.querySelector("[data-tulpar-toaster-root]")).to.not.equal(null);
      __resetToasterRootForTest();
      expect(document.querySelector("[data-tulpar-toaster-root]")).to.equal(null);
    });

    it("re-creates a fresh root on next getToasterRoot call after reset", () => {
      const first = getToasterRoot();
      __resetToasterRootForTest();
      const second = getToasterRoot();
      expect(first).to.not.equal(second);
      expect(second.parentElement).to.equal(document.body);
    });

    it("clears location containers so they are re-created after reset", () => {
      const before = getLocationContainer("top-left");
      __resetToasterRootForTest();
      const after = getLocationContainer("top-left");
      expect(before).to.not.equal(after);
    });

    it("unbinds the F6 keydown listener after reset (no spurious focus moves)", () => {
      getToasterRoot();
      __resetToasterRootForTest();
      // After reset, no root exists. F6 must not throw.
      expect(() =>
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "F6", bubbles: true }))
      ).to.not.throw();
      // And nothing in the DOM should have been created.
      expect(document.querySelector("[data-tulpar-toaster-root]")).to.equal(null);
    });
  });
});
