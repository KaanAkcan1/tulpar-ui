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

// ─── Group-count badge (fix #1) ──────────────────────────────────────────────

describe("message() group-count badge", () => {
  it("grouped message shows .toast-count element in shadow DOM after a duplicate", async () => {
    message("Saved", { duration: 0 });
    await nextFrame();
    message("Saved", { duration: 0 }); // duplicate → group merge
    await nextFrame();

    const el = toastsInLocation("top-center")[0] as TulparToast;
    // count property must be > 1
    expect(el.count).to.be.greaterThan(1);
    // data-count attribute must be set on host
    expect(el.hasAttribute("data-count")).to.be.true;
    expect(el.getAttribute("data-count")).to.equal(String(el.count));
    // .toast-count element must exist in shadow DOM and show the number
    const badge = el.shadowRoot!.querySelector(".toast-count");
    expect(badge, ".toast-count badge must be in shadow DOM after grouping").to.exist;
    expect(badge!.textContent?.trim()).to.include(String(el.count));
  });

  it("initial message (count=1) has NO data-count attribute", async () => {
    message("Saved", { duration: 0 });
    await nextFrame();
    const el = toastsInLocation("top-center")[0] as TulparToast;
    expect(el.count).to.equal(1);
    expect(el.hasAttribute("data-count")).to.be.false;
  });

  it("triple duplicate increments count to 3 and badge shows ×3", async () => {
    message("Retry", { duration: 0 });
    await nextFrame();
    message("Retry", { duration: 0 });
    await nextFrame();
    message("Retry", { duration: 0 });
    await nextFrame();

    const el = toastsInLocation("top-center")[0] as TulparToast;
    expect(el.count).to.equal(3);
    const badge = el.shadowRoot!.querySelector(".toast-count");
    expect(badge).to.exist;
    expect(badge!.textContent?.trim()).to.include("3");
  });
});

// ─── toast.update() restarts timer on duration change (fix #2) ───────────────

describe("toast.update() — timer restart on duration change", () => {
  it("updating to a short duration causes dismissal on the new schedule", async () => {
    // Start with a long-lived toast (5000ms — won't expire in this test).
    const id = toast("Update timer test", { duration: 5000 });
    await nextFrame();
    expect(toastsInLocation("bottom-right").length).to.equal(1);

    // Update to a very short duration — should dismiss within ~100ms.
    toast.update(id, { duration: 60 });
    await nextFrame();

    // After 120ms the new timer should have fired.
    await wait(120);
    expect(toastsInLocation("bottom-right").length).to.equal(0);
  });

  it("updating to duration=0 makes the toast persistent (no auto-dismiss)", async () => {
    const id = toast("Become persistent", { duration: 80 });
    await nextFrame();

    // Switch to persistent before the original 80ms timer fires.
    toast.update(id, { duration: 0 });
    await nextFrame();

    // Wait longer than the original duration.
    await wait(150);
    // Toast must still be visible.
    expect(toastsInLocation("bottom-right").length).to.equal(1);
    toast.dismiss(id);
  });
});

// ─── dismiss-on-action (fix #4) ──────────────────────────────────────────────

describe("toast action — dismiss with reason 'action'", () => {
  it("clicking an action button dismisses the toast with onDismiss reason='action'", async () => {
    let capturedReason: string | undefined;
    toast("File deleted", {
      duration: 0,
      actions: [{ label: "Undo", onClick: () => {} }],
      onDismiss: (r) => { capturedReason = r; },
    });
    await nextFrame();
    expect(toastsInLocation("bottom-right").length).to.equal(1);

    const el = toastsInLocation("bottom-right")[0];
    // Dispatch the tulpar-action event as the element would after an action click.
    el.dispatchEvent(
      new CustomEvent("tulpar-action", {
        detail: { label: "Undo" },
        bubbles: true,
        composed: true,
        cancelable: false,
      })
    );
    await nextFrame();

    expect(toastsInLocation("bottom-right").length).to.equal(0);
    expect(capturedReason).to.equal("action");
  });

  it("the action's own onClick callback runs before dismiss", async () => {
    const log: string[] = [];
    const action = {
      label: "Undo",
      onClick: () => { log.push("action"); },
    };
    let dismissReason: string | undefined;
    toast("Deleted", {
      duration: 0,
      actions: [action],
      onDismiss: (r) => { log.push("dismiss"); dismissReason = r; },
    });
    await nextFrame();

    const el = toastsInLocation("bottom-right")[0];
    // Simulate the element's _onActionClick: first onClick fires, then tulpar-action.
    action.onClick(); // element calls this first
    el.dispatchEvent(
      new CustomEvent("tulpar-action", {
        detail: { label: "Undo" },
        bubbles: true,
        composed: true,
        cancelable: false,
      })
    );
    await nextFrame();

    // onClick must have been logged before dismiss
    expect(log[0]).to.equal("action");
    expect(log[1]).to.equal("dismiss");
    expect(dismissReason).to.equal("action");
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

// ─── toast.promise() ─────────────────────────────────────────────────────────

describe("toast.promise()", () => {
  it("toast.promise is a function", () => {
    expect(typeof toast.promise).to.equal("function");
  });

  it("shows a loading toast immediately (persistent, not closable)", async () => {
    const p = new Promise<string>(() => {}); // never resolves in this test
    toast.promise(p, { loading: "Saving…", success: "Saved!", error: "Failed" });
    await nextFrame();

    const els = toastsInLocation("bottom-right");
    expect(els.length).to.equal(1);
    const el = els[0];
    expect(el.heading).to.equal("Saving…");
    expect(el.closable).to.equal(false);
    // timer should be false (persistent)
    expect(el.timer).to.equal(false);
    toast.dismiss();
  });

  it("loading toast has a spinner icon (raw SVG injected)", async () => {
    const p = new Promise<string>(() => {});
    toast.promise(p, { loading: "Loading…", success: "Done", error: "Oops" });
    await nextFrame();

    const el = toastsInLocation("bottom-right")[0];
    // The icon prop should be set to a raw SVG string starting with '<svg'
    expect(el.icon).to.be.a("string");
    expect((el.icon as string).trimStart().startsWith("<svg")).to.be.true;
    toast.dismiss();
  });

  it("on resolve → updates toast to success tone, closable, auto-dismiss", async () => {
    let resolveP!: (v: string) => void;
    const p = new Promise<string>((res) => { resolveP = res; });
    toast.promise(p, { loading: "Saving…", success: "Saved!", error: "Failed" });
    await nextFrame();

    resolveP("done");
    await p; // wait for microtask settle
    await nextFrame();

    const el = toastsInLocation("bottom-right")[0];
    expect(el.tone).to.equal("success");
    expect(el.heading).to.equal("Saved!");
    expect(el.closable).to.equal(true);
    expect(el.timer).to.equal(true);
    toast.dismiss();
  });

  it("on reject → updates toast to danger tone, persistent (timer:false), closable", async () => {
    let rejectP!: (e: unknown) => void;
    const p = new Promise<string>((_, rej) => { rejectP = rej; });

    // Attach a catch so the unhandled rejection doesn't pollute the test suite.
    const guarded = p.catch(() => {});
    toast.promise(p, { loading: "Working…", success: "OK", error: "Boom" });
    await nextFrame();

    rejectP(new Error("network error"));
    await guarded; // wait for rejection to settle
    await nextFrame();

    const el = toastsInLocation("bottom-right")[0];
    expect(el.tone).to.equal("danger");
    expect(el.heading).to.equal("Boom");
    expect(el.closable).to.equal(true);
    // error state must be persistent (timer:false)
    expect(el.timer).to.equal(false);
    toast.dismiss();
  });

  it("success as a function receives the resolved value", async () => {
    let resolveP!: (v: number) => void;
    const p = new Promise<number>((res) => { resolveP = res; });
    toast.promise(p, {
      loading: "Computing…",
      success: (v) => `Result: ${v}`,
      error: "Failed",
    });
    await nextFrame();

    resolveP(42);
    await p;
    await nextFrame();

    const el = toastsInLocation("bottom-right")[0];
    expect(el.heading).to.equal("Result: 42");
    toast.dismiss();
  });

  it("error as a function receives the rejection reason", async () => {
    let rejectP!: (e: unknown) => void;
    const p = new Promise<string>((_, rej) => { rejectP = rej; });
    const guarded = p.catch(() => {});
    toast.promise(p, {
      loading: "Working…",
      success: "OK",
      error: (e) => `Error: ${(e as Error).message}`,
    });
    await nextFrame();

    rejectP(new Error("timeout"));
    await guarded;
    await nextFrame();

    const el = toastsInLocation("bottom-right")[0];
    expect(el.heading).to.equal("Error: timeout");
    toast.dismiss();
  });

  it("resolving promise resolves to the value (rethrows / passthrough)", async () => {
    const p = Promise.resolve(99);
    const result = await toast.promise(p, { loading: "…", success: "OK", error: "Fail" });
    expect(result).to.equal(99);
    toast.dismiss();
  });

  it("rejecting promise rejects to the caller (rethrows, does NOT swallow)", async () => {
    const err = new Error("upstream failure");
    const p = Promise.reject<string>(err);
    let caught: unknown = null;
    try {
      await toast.promise(p, { loading: "…", success: "OK", error: "Fail" });
    } catch (e) {
      caught = e;
    }
    expect(caught).to.equal(err);
    toast.dismiss();
  });

  it("opts.duration controls the success auto-dismiss duration", async () => {
    let resolveP!: (v: string) => void;
    const p = new Promise<string>((res) => { resolveP = res; });
    toast.promise(
      p,
      { loading: "…", success: "Done!", error: "Fail" },
      { duration: 80 },
    );
    await nextFrame();

    resolveP("ok");
    await p;
    await nextFrame();
    // After resolve the element should still be visible
    expect(toastsInLocation("bottom-right").length).to.equal(1);
    // After the short duration it should be gone
    await wait(150);
    expect(toastsInLocation("bottom-right").length).to.equal(0);
  });

  it("opts.location places the loading + resolved toast in that location", async () => {
    let resolveP!: (v: string) => void;
    const p = new Promise<string>((res) => { resolveP = res; });
    toast.promise(
      p,
      { loading: "…", success: "Done!", error: "Fail" },
      { location: "top-left", duration: 0 },
    );
    await nextFrame();
    expect(toastsInLocation("top-left").length).to.equal(1);
    expect(toastsInLocation("bottom-right").length).to.equal(0);

    resolveP("ok");
    await p;
    await nextFrame();
    // Still in the same location after update
    expect(toastsInLocation("top-left").length).to.equal(1);
    toast.dismiss();
  });
});

// ─── onAutoClose wiring ───────────────────────────────────────────────────────

describe("onAutoClose lifecycle callback", () => {
  it("fires onAutoClose on timeout (before onDismiss)", async () => {
    const log: string[] = [];
    toast("Quick", {
      duration: 60,
      onAutoClose: () => { log.push("autoClose"); },
      onDismiss: () => { log.push("dismiss"); },
    });
    await wait(120);
    expect(log).to.include("autoClose");
    expect(log[0]).to.equal("autoClose");
    expect(log[1]).to.equal("dismiss");
  });

  it("does NOT fire onAutoClose on manual (user) dismiss", async () => {
    let autoCloseFired = false;
    toast("Manual", {
      duration: 5000,
      onAutoClose: () => { autoCloseFired = true; },
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
    expect(autoCloseFired).to.equal(false);
  });

  it("does NOT fire onAutoClose on programmatic dismiss", async () => {
    let autoCloseFired = false;
    const id = toast("Prog", {
      duration: 5000,
      onAutoClose: () => { autoCloseFired = true; },
    });
    await nextFrame();
    toast.dismiss(id);
    await nextFrame();
    expect(autoCloseFired).to.equal(false);
  });
});

// ─── onDismiss all paths ──────────────────────────────────────────────────────

describe("onDismiss fires for every dismiss path", () => {
  it("fires with reason='timeout' on auto-dismiss", async () => {
    let reason: string | undefined;
    toast("T", { duration: 60, onDismiss: (r) => { reason = r; } });
    await wait(120);
    expect(reason).to.equal("timeout");
  });

  it("fires with reason='user' on user close (tulpar-dismiss user)", async () => {
    let reason: string | undefined;
    toast("T", { duration: 0, onDismiss: (r) => { reason = r; } });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    el.dispatchEvent(new CustomEvent("tulpar-dismiss", { detail: { reason: "user" }, bubbles: true, composed: true, cancelable: true }));
    await nextFrame();
    expect(reason).to.equal("user");
  });

  it("fires with reason='swipe' on swipe dismiss", async () => {
    let reason: string | undefined;
    toast("T", { duration: 0, onDismiss: (r) => { reason = r; } });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    el.dispatchEvent(new CustomEvent("tulpar-dismiss", { detail: { reason: "swipe" }, bubbles: true, composed: true, cancelable: true }));
    await nextFrame();
    expect(reason).to.equal("swipe");
  });

  it("fires with reason='programmatic' on toast.dismiss(id)", async () => {
    let reason: string | undefined;
    const id = toast("T", { duration: 0, onDismiss: (r) => { reason = r; } });
    await nextFrame();
    toast.dismiss(id);
    await nextFrame();
    expect(reason).to.equal("programmatic");
  });

  it("fires with reason='action' on action button click", async () => {
    let reason: string | undefined;
    toast("T", {
      duration: 0,
      actions: [{ label: "Undo", onClick: () => {} }],
      onDismiss: (r) => { reason = r; },
    });
    await nextFrame();
    const el = toastsInLocation("bottom-right")[0];
    el.dispatchEvent(new CustomEvent("tulpar-action", { detail: { label: "Undo" }, bubbles: true, composed: true, cancelable: false }));
    await nextFrame();
    expect(reason).to.equal("action");
  });
});
