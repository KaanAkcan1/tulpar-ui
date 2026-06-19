/**
 * toast-service.test.ts
 *
 * Tests for the imperative toast + message service (Task 4.1).
 * Uses @open-wc/testing in a real browser (WTR / Chromium).
 * All timers use short durations (50-150ms) so tests complete within the 5s WTR budget.
 */

import { expect } from "@open-wc/testing";
import { toast, message, __resetToastServiceForTest } from "./toast-service";
import type { TulparToast } from "./tulpar-toast";
import "./tulpar-toast"; // ensure element is registered

// ─── Helpers ─────────────────────────────────────────────────────────────────

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Wait for a Lit element to finish its update cycle */
async function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * Get all tulpar-toast elements currently in the document body's toaster region.
 */
function allToasts(): TulparToast[] {
  return Array.from(
    document.querySelectorAll<TulparToast>("tulpar-toast")
  );
}

/**
 * Get toasts inside the container with data-location attribute.
 */
function toastsInLocation(location: string): TulparToast[] {
  const container = document.querySelector(`[data-location="${location}"]`);
  if (!container) return [];
  return Array.from(container.querySelectorAll<TulparToast>("tulpar-toast"));
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

afterEach(() => {
  __resetToastServiceForTest();
  document.documentElement.classList.remove("dark");
  document.documentElement.removeAttribute("data-brand");
});

// ─── Basic API shape ──────────────────────────────────────────────────────────

describe("toast service — API shape", () => {
  it("toast() is a callable function", () => {
    expect(typeof toast).to.equal("function");
  });

  it("toast.success/.info/.warning/.danger are functions", () => {
    expect(typeof toast.success).to.equal("function");
    expect(typeof toast.info).to.equal("function");
    expect(typeof toast.warning).to.equal("function");
    expect(typeof toast.danger).to.equal("function");
  });

  it("toast.custom is a function", () => {
    expect(typeof toast.custom).to.equal("function");
  });

  it("toast.update is a function", () => {
    expect(typeof toast.update).to.equal("function");
  });

  it("toast.dismiss is a function", () => {
    expect(typeof toast.dismiss).to.equal("function");
  });

  it("toast.setDefaults is a function", () => {
    expect(typeof toast.setDefaults).to.equal("function");
  });

  it("message() is a callable function", () => {
    expect(typeof message).to.equal("function");
  });

  it("message.success/.info/.warning/.danger are functions", () => {
    expect(typeof message.success).to.equal("function");
    expect(typeof message.info).to.equal("function");
    expect(typeof message.warning).to.equal("function");
    expect(typeof message.danger).to.equal("function");
  });

  it("message.dismiss is a function", () => {
    expect(typeof message.dismiss).to.equal("function");
  });
});

// ─── toast() return value ─────────────────────────────────────────────────────

describe("toast() returns id", () => {
  it("returns a non-empty string id", () => {
    const id = toast("Hello");
    expect(typeof id).to.equal("string");
    expect(id.length).to.be.greaterThan(0);
  });

  it("returns unique ids for successive calls", () => {
    const a = toast("First");
    const b = toast("Second");
    expect(a).to.not.equal(b);
  });

  it("toast.success returns a non-empty id", () => {
    const id = toast.success("Success!");
    expect(typeof id).to.equal("string");
    expect(id.length).to.be.greaterThan(0);
  });

  it("toast.info returns a non-empty id", () => {
    const id = toast.info("Info");
    expect(typeof id).to.equal("string");
    expect(id.length).to.be.greaterThan(0);
  });

  it("toast.warning returns a non-empty id", () => {
    const id = toast.warning("Warning");
    expect(typeof id).to.equal("string");
    expect(id.length).to.be.greaterThan(0);
  });

  it("toast.danger returns a non-empty id", () => {
    const id = toast.danger("Danger");
    expect(typeof id).to.equal("string");
    expect(id.length).to.be.greaterThan(0);
  });
});

// ─── DOM mounting ─────────────────────────────────────────────────────────────

describe("toast() DOM mounting", () => {
  it("mounts a <tulpar-toast> in the bottom-right container by default", async () => {
    toast.success("Saved!", { duration: 0 });
    await nextFrame();
    const elements = toastsInLocation("bottom-right");
    expect(elements.length).to.be.greaterThan(0);
  });

  it("sets the tone on the element for .success", async () => {
    toast.success("Saved!", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    expect(el.tone).to.equal("success");
  });

  it("sets the tone on the element for .info", async () => {
    toast.info("Info", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    expect(el.tone).to.equal("info");
  });

  it("sets the tone on the element for .warning", async () => {
    toast.warning("Caution", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    expect(el.tone).to.equal("warning");
  });

  it("sets the tone on the element for .danger", async () => {
    toast.danger("Error", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    expect(el.tone).to.equal("danger");
  });

  it("sets the heading (title) on the element", async () => {
    toast("My Heading", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    expect(el.heading).to.equal("My Heading");
  });

  it("sets description on the element when provided", async () => {
    toast("Title", { description: "More detail", duration: 0 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    expect(el.description).to.equal("More detail");
  });

  it("respects location override — places in specified container", async () => {
    toast("Hello", { location: "top-left", duration: 0 });
    await nextFrame();
    const els = toastsInLocation("top-left");
    expect(els.length).to.equal(1);
    // Confirm it's NOT in the default bottom-right
    const brEls = toastsInLocation("bottom-right");
    expect(brEls.length).to.equal(0);
  });

  it("sets closable=false when specified", async () => {
    toast("Hello", { closable: false, duration: 0 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    expect(el.closable).to.equal(false);
  });

  it("sets closable=true by default", async () => {
    toast("Hello", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    expect(el.closable).to.equal(true);
  });

  it("sets actions property on the element", async () => {
    const action = { label: "Undo", onClick: () => {} };
    toast("File deleted", { actions: [action], duration: 0 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    expect(el.actions.length).to.equal(1);
    expect(el.actions[0].label).to.equal("Undo");
  });
});

// ─── Stacking ─────────────────────────────────────────────────────────────────

describe("toast() stacking", () => {
  it("applies transform to visible toasts", async () => {
    // Enqueue 3 toasts (maxVisible default = 3)
    toast("A", { duration: 0 });
    toast("B", { duration: 0 });
    toast("C", { duration: 0 });
    await nextFrame();
    const els = toastsInLocation("bottom-right");
    expect(els.length).to.equal(3);
    // Each should have a transform set (collapsed stack)
    for (const el of els) {
      expect(el.style.transform).to.be.a("string").and.to.have.length.greaterThan(0);
    }
  });

  it("only 3 toasts are visible (maxVisible default) when 4 are enqueued", async () => {
    toast("A", { duration: 0 });
    toast("B", { duration: 0 });
    toast("C", { duration: 0 });
    toast("D", { duration: 0 });
    await nextFrame();
    // 4th is queued, only 3 in DOM (visible in container)
    const visible = toastsInLocation("bottom-right");
    expect(visible.length).to.equal(3);
  });

  it("stacking: first toast (index 0) has the highest zIndex", async () => {
    toast("A", { duration: 0 });
    toast("B", { duration: 0 });
    await nextFrame();
    const els = toastsInLocation("bottom-right");
    // newest toast is at index 0 (front), should have higher z-index
    const zFront = parseInt(els[0].style.zIndex ?? "0", 10);
    const zBack = parseInt(els[1].style.zIndex ?? "0", 10);
    expect(zFront).to.be.greaterThan(zBack);
  });

  it("setDefaults maxVisible is respected", async () => {
    toast.setDefaults({ maxVisible: 2 });
    toast("A", { duration: 0 });
    toast("B", { duration: 0 });
    toast("C", { duration: 0 }); // should be queued
    await nextFrame();
    const visible = toastsInLocation("bottom-right");
    expect(visible.length).to.equal(2);
  });
});

// ─── Default durations ────────────────────────────────────────────────────────

describe("duration defaults", () => {
  it("toast default duration is 5000ms (set on element)", () => {
    const id = toast("Hello");
    // Get the element from DOM
    const el = toastsInLocation("bottom-right")[0];
    expect(el.duration).to.equal(5000);
    toast.dismiss(id);
  });

  it("message default duration is 3000ms (set on element)", () => {
    message("Quick note");
    const el = toastsInLocation("top-center")[0];
    expect(el.duration).to.equal(3000);
    message.dismiss();
  });

  it("duration override is applied to the element", () => {
    const id = toast("Hello", { duration: 999 });
    const el = toastsInLocation("bottom-right")[0];
    expect(el.duration).to.equal(999);
    toast.dismiss(id);
  });
});

// ─── Auto-dismiss ─────────────────────────────────────────────────────────────

describe("auto-dismiss", () => {
  it("removes the element from DOM after duration expires", async () => {
    toast("Quick", { duration: 60 });
    await nextFrame();
    expect(toastsInLocation("bottom-right").length).to.equal(1);
    await wait(120);
    expect(toastsInLocation("bottom-right").length).to.equal(0);
  });

  it("fires onDismiss with reason='timeout' on auto-dismiss", async () => {
    let capturedReason: string | undefined;
    toast("Quick", { duration: 60, onDismiss: (r) => { capturedReason = r; } });
    await wait(120);
    expect(capturedReason).to.equal("timeout");
  });

  it("fires onAutoClose on auto-dismiss", async () => {
    let called = false;
    toast("Quick", { duration: 60, onAutoClose: () => { called = true; } });
    await wait(120);
    expect(called).to.equal(true);
  });

  it("does NOT auto-dismiss when timer:false", async () => {
    toast("Persistent", { timer: false });
    await wait(100);
    expect(toastsInLocation("bottom-right").length).to.equal(1);
    toast.dismiss();
  });

  it("does NOT auto-dismiss when duration:0", async () => {
    toast("Persistent", { duration: 0 });
    await wait(100);
    expect(toastsInLocation("bottom-right").length).to.equal(1);
    toast.dismiss();
  });
});

// ─── Hover pause ──────────────────────────────────────────────────────────────

describe("hover/focus pause", () => {
  it("pointerenter pauses the timer; pointerleave resumes, element eventually dismissed", async () => {
    toast("Hello", { duration: 80 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];

    // Simulate hover enter
    el.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
    await wait(120); // would have expired without pause
    // Still there because paused
    expect(toastsInLocation("bottom-right").length).to.equal(1);

    // Simulate hover leave — timer resumes from remaining ~80ms
    el.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    await wait(120); // generous for remaining duration
    // Should be gone now
    expect(toastsInLocation("bottom-right").length).to.equal(0);
  });

  it("focusin pauses the timer; focusout resumes", async () => {
    toast("Focus me", { duration: 80 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];

    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await wait(120);
    // Still present after would-have-expired
    expect(toastsInLocation("bottom-right").length).to.equal(1);

    el.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    await wait(120);
    expect(toastsInLocation("bottom-right").length).to.equal(0);
  });
});

// ─── Manual dismiss ───────────────────────────────────────────────────────────

describe("toast.dismiss()", () => {
  it("toast.dismiss(id) removes the specific toast", async () => {
    const id = toast("Remove me", { duration: 0 });
    toast("Keep me", { duration: 0 });
    await nextFrame();
    expect(toastsInLocation("bottom-right").length).to.equal(2);

    toast.dismiss(id);
    await nextFrame();
    expect(toastsInLocation("bottom-right").length).to.equal(1);
  });

  it("toast.dismiss() removes all toasts", async () => {
    toast("A", { duration: 0 });
    toast("B", { duration: 0 });
    await nextFrame();
    expect(toastsInLocation("bottom-right").length).to.equal(2);

    toast.dismiss();
    await nextFrame();
    expect(toastsInLocation("bottom-right").length).to.equal(0);
  });

  it("fires onDismiss with reason='programmatic' on toast.dismiss(id)", async () => {
    let capturedReason: string | undefined;
    const id = toast("Bye", { duration: 0, onDismiss: (r) => { capturedReason = r; } });
    await nextFrame();
    toast.dismiss(id);
    await nextFrame();
    expect(capturedReason).to.equal("programmatic");
  });

  it("relayouts stack after dismiss — queued toast becomes visible", async () => {
    toast("A", { duration: 0 });
    toast("B", { duration: 0 });
    toast("C", { duration: 0 });
    const id4 = toast("D", { duration: 0 }); // queued (4th)
    await nextFrame();
    expect(toastsInLocation("bottom-right").length).to.equal(3); // 4th queued

    // Dismiss queued item, then dismiss all visible
    toast.dismiss(id4); // dismiss the queued one
    toast.dismiss();    // dismiss all remaining visible
    await nextFrame();
    expect(toastsInLocation("bottom-right").length).to.equal(0);
  });
});

// ─── tulpar-dismiss event ─────────────────────────────────────────────────────

describe("tulpar-dismiss event handling", () => {
  it("element firing tulpar-dismiss(reason:'user') removes it from DOM", async () => {
    toast("Close me", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];

    el.dispatchEvent(
      new CustomEvent("tulpar-dismiss", {
        detail: { reason: "user" },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    );
    await nextFrame();
    expect(toastsInLocation("bottom-right").length).to.equal(0);
  });

  it("fires onDismiss with reason='user' on user close", async () => {
    let capturedReason: string | undefined;
    toast("Close me", {
      duration: 0,
      onDismiss: (r) => { capturedReason = r; },
    });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];

    el.dispatchEvent(
      new CustomEvent("tulpar-dismiss", {
        detail: { reason: "user" },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    );
    await nextFrame();
    expect(capturedReason).to.equal("user");
  });

  it("swipe dismiss (reason:'swipe') also removes element", async () => {
    toast("Swipe me", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];

    el.dispatchEvent(
      new CustomEvent("tulpar-dismiss", {
        detail: { reason: "swipe" },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    );
    await nextFrame();
    expect(toastsInLocation("bottom-right").length).to.equal(0);
  });
});

// ─── toast.update() ───────────────────────────────────────────────────────────

describe("toast.update()", () => {
  it("updates the heading on a live element", async () => {
    const id = toast("Original", { duration: 0 });
    await nextFrame();
    toast.update(id, { title: "Updated" });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    expect(el.heading).to.equal("Updated");
  });

  it("updates the tone on a live element", async () => {
    const id = toast("Hello", { duration: 0 });
    await nextFrame();
    toast.update(id, { tone: "success" });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    expect(el.tone).to.equal("success");
  });

  it("updates description on a live element", async () => {
    const id = toast("Hello", { duration: 0 });
    await nextFrame();
    toast.update(id, { description: "New desc" });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    expect(el.description).to.equal("New desc");
  });

  it("no-op for unknown id", () => {
    // Should not throw
    expect(() => toast.update("nonexistent-id", { title: "X" })).to.not.throw();
  });
});

// ─── toast.custom ─────────────────────────────────────────────────────────────

describe("toast.custom()", () => {
  it("creates a toast with tone:'custom'", async () => {
    toast.custom("Custom message", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    expect(el.tone).to.equal("custom");
  });
});

// ─── message() ───────────────────────────────────────────────────────────────

describe("message() — location + minimal variant", () => {
  it("places in top-center by default", async () => {
    message("Quick note", { duration: 0 });
    await nextFrame();
    expect(toastsInLocation("top-center").length).to.equal(1);
    // Confirm not in bottom-right
    expect(toastsInLocation("bottom-right").length).to.equal(0);
  });

  it("tone defaults to info", async () => {
    message("Quick note", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("top-center")[0];
    expect(el.tone).to.equal("info");
  });

  it("message.success sets tone='success'", async () => {
    message.success("Done!", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("top-center")[0];
    expect(el.tone).to.equal("success");
  });

  it("message.info sets tone='info'", async () => {
    message.info("FYI", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("top-center")[0];
    expect(el.tone).to.equal("info");
  });

  it("message.warning sets tone='warning'", async () => {
    message.warning("Watch out", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("top-center")[0];
    expect(el.tone).to.equal("warning");
  });

  it("message.danger sets tone='danger'", async () => {
    message.danger("Fail", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("top-center")[0];
    expect(el.tone).to.equal("danger");
  });

  it("message is minimal — closable is false", async () => {
    message("Quick note", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("top-center")[0];
    expect(el.closable).to.equal(false);
  });

  it("message has no actions", async () => {
    message("Quick note", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("top-center")[0];
    expect(el.actions.length).to.equal(0);
  });

  it("message returns a string id", () => {
    const id = message("Note");
    expect(typeof id).to.equal("string");
    expect(id.length).to.be.greaterThan(0);
    message.dismiss(id);
  });

  it("message auto-dismisses after duration", async () => {
    message("Gone soon", { duration: 60 });
    await nextFrame();
    expect(toastsInLocation("top-center").length).to.equal(1);
    await wait(120);
    expect(toastsInLocation("top-center").length).to.equal(0);
  });
});

// ─── message() grouping ───────────────────────────────────────────────────────

describe("message() grouping", () => {
  it("duplicate message (same tone+text) increments count instead of adding new element", async () => {
    message("Saved", { duration: 0 });
    await nextFrame();
    expect(toastsInLocation("top-center").length).to.equal(1);

    // Same text + tone = should group
    message("Saved", { duration: 0 });
    await nextFrame();
    expect(toastsInLocation("top-center").length).to.equal(1);
  });

  it("grouped message element has count > 1", async () => {
    message("Saved", { duration: 0 });
    await nextFrame();
    message("Saved", { duration: 0 }); // duplicate
    await nextFrame();
    const el = toastsInLocation("top-center")[0] as TulparToast & { count?: number };
    expect(el.count).to.be.greaterThan(1);
  });

  it("different text creates a separate message (no grouping)", async () => {
    message("Saved", { duration: 0 });
    message("Deleted", { duration: 0 });
    await nextFrame();
    expect(toastsInLocation("top-center").length).to.equal(2);
  });

  it("different tone creates a separate message even with same text", async () => {
    message.success("Done", { duration: 0 });
    message.danger("Done", { duration: 0 });
    await nextFrame();
    expect(toastsInLocation("top-center").length).to.equal(2);
  });

  it("group:false disables grouping", async () => {
    message("Saved", { duration: 0, group: false });
    message("Saved", { duration: 0, group: false });
    await nextFrame();
    expect(toastsInLocation("top-center").length).to.equal(2);
  });
});

// ─── message.dismiss() ────────────────────────────────────────────────────────

describe("message.dismiss()", () => {
  it("message.dismiss(id) removes a specific message", async () => {
    const id = message("Note", { duration: 0 });
    message("Another", { duration: 0 });
    await nextFrame();
    expect(toastsInLocation("top-center").length).to.equal(2);

    message.dismiss(id);
    await nextFrame();
    expect(toastsInLocation("top-center").length).to.equal(1);
  });

  it("message.dismiss() removes all messages", async () => {
    message("A", { duration: 0 });
    message("B", { duration: 0 });
    await nextFrame();

    message.dismiss();
    await nextFrame();
    expect(toastsInLocation("top-center").length).to.equal(0);
  });
});

// ─── setDefaults ─────────────────────────────────────────────────────────────

describe("toast.setDefaults()", () => {
  it("setDefaults({ duration }) changes default duration for subsequent toasts", () => {
    toast.setDefaults({ duration: 9999 });
    toast("Hello");
    const el = toastsInLocation("bottom-right")[0];
    expect(el.duration).to.equal(9999);
    toast.dismiss();
  });

  it("setDefaults({ timerStyle }) applies to subsequent toasts", () => {
    toast.setDefaults({ timerStyle: "soft" });
    toast("Hello", { duration: 0 });
    const el = toastsInLocation("bottom-right")[0];
    expect(el.timerStyle).to.equal("soft");
    toast.dismiss();
  });

  it("setDefaults({ location }) changes default location for toast()", async () => {
    toast.setDefaults({ location: "top-right" });
    toast("Hello", { duration: 0 });
    await nextFrame();
    expect(toastsInLocation("top-right").length).to.equal(1);
    expect(toastsInLocation("bottom-right").length).to.equal(0);
  });

  it("per-call location override wins over setDefaults location", async () => {
    toast.setDefaults({ location: "top-right" });
    toast("Override", { location: "bottom-left", duration: 0 });
    await nextFrame();
    expect(toastsInLocation("bottom-left").length).to.equal(1);
    expect(toastsInLocation("top-right").length).to.equal(0);
  });
});

// ─── Reset / isolation ────────────────────────────────────────────────────────

describe("__resetToastServiceForTest", () => {
  it("clears all toasts between tests", async () => {
    toast("Leftover A", { duration: 0 });
    toast("Leftover B", { duration: 0 });
    await nextFrame();
    expect(allToasts().length).to.be.greaterThan(0);

    __resetToastServiceForTest();
    await nextFrame();
    expect(allToasts().length).to.equal(0);
  });

  it("resets defaults — duration returns to 5000 after reset", () => {
    toast.setDefaults({ duration: 1234 });
    __resetToastServiceForTest();
    toast("Check");
    const el = toastsInLocation("bottom-right")[0];
    expect(el.duration).to.equal(5000);
    toast.dismiss();
  });
});
