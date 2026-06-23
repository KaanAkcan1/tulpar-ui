/**
 * TulparToast SFC — smoke + behaviour tests (Task 6.2).
 *
 * Strategy: same pattern as TulparSwitch/TulparCheckbox — import the core
 * element, mount the SFC, assert attributes + properties + slot carriers + events.
 * `@tulpar-ui/core/toast` brings heavy DOM deps (setPointerCapture, matchMedia);
 * we import only the element registration side-effect (registers <tulpar-toast>)
 * without triggering the toast service.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparToast from "./TulparToast.vue";

describe("TulparToast (Vue)", () => {
  beforeAll(async () => {
    // Register <tulpar-toast> in happy-dom's custom element registry.
    await import("@tulpar-ui/core/toast");
  });

  // ── Existence ───────────────────────────────────────────────────────────────

  it("is defined (exported from SFC)", () => {
    expect(TulparToast).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparToast);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner <tulpar-toast> element", () => {
    const wrapper = mount(TulparToast);
    expect(wrapper.find("tulpar-toast").exists()).toBe(true);
  });

  // ── Prop → attribute bindings ───────────────────────────────────────────────

  it("forwards tone prop", () => {
    const wrapper = mount(TulparToast, { props: { tone: "success" } });
    expect(wrapper.find("tulpar-toast").attributes("tone")).toBe("success");
  });

  it("forwards heading prop", () => {
    const wrapper = mount(TulparToast, { props: { heading: "File saved" } });
    expect(wrapper.find("tulpar-toast").attributes("heading")).toBe("File saved");
  });

  it("forwards description prop", () => {
    const wrapper = mount(TulparToast, { props: { description: "Saved to disk" } });
    expect(wrapper.find("tulpar-toast").attributes("description")).toBe("Saved to disk");
  });

  it("forwards icon prop", () => {
    const wrapper = mount(TulparToast, { props: { icon: "success" } });
    expect(wrapper.find("tulpar-toast").attributes("icon")).toBe("success");
  });

  it("forwards color prop", () => {
    const wrapper = mount(TulparToast, { props: { color: "ilay" } });
    expect(wrapper.find("tulpar-toast").attributes("color")).toBe("ilay");
  });

  it("forwards timer prop (true by default)", () => {
    const wrapper = mount(TulparToast, { props: { timer: true } });
    expect(wrapper.find("tulpar-toast").attributes("timer")).toBeTruthy();
  });

  it("omits timer attribute when false (Lit boolean attr semantics)", () => {
    const wrapper = mount(TulparToast, { props: { timer: false } });
    // Boolean false → absent attribute
    const attr = wrapper.find("tulpar-toast").attributes("timer");
    expect(attr === undefined || attr === null || attr === "false").toBeTruthy();
  });

  it("forwards duration prop", () => {
    const wrapper = mount(TulparToast, { props: { duration: 3000 } });
    expect(wrapper.find("tulpar-toast").attributes("duration")).toBe("3000");
  });

  it("forwards timerStyle prop as timer-style attribute", () => {
    const wrapper = mount(TulparToast, { props: { timerStyle: "soft" } });
    expect(wrapper.find("tulpar-toast").attributes("timer-style")).toBe("soft");
  });

  it("forwards highContrast prop as high-contrast attribute", () => {
    const wrapper = mount(TulparToast, { props: { highContrast: true } });
    const attr = wrapper.find("tulpar-toast").attributes("high-contrast");
    expect(attr !== undefined && attr !== null && attr !== false).toBeTruthy();
  });

  it("omits high-contrast when highContrast=false", () => {
    const wrapper = mount(TulparToast, { props: { highContrast: false } });
    const attr = wrapper.find("tulpar-toast").attributes("high-contrast");
    expect(attr === undefined || attr === null || attr === "false").toBeTruthy();
  });

  it("forwards closable prop (true by default)", () => {
    const wrapper = mount(TulparToast, { props: { closable: true } });
    expect(wrapper.find("tulpar-toast").attributes("closable")).toBeTruthy();
  });

  // ── `actions` as a DOM property ─────────────────────────────────────────────

  it("sets actions as a DOM property (not attribute) on the core element", async () => {
    const actions = [{ label: "Undo", onClick: () => {} }];
    const wrapper = mount(TulparToast, { props: { actions } });
    await wrapper.vm.$nextTick();

    const el = wrapper.find("tulpar-toast").element as HTMLElement & { actions?: unknown };
    // Must land as the JS property (functions can't serialize to attrs).
    expect(el.actions).toEqual(actions);
    // Must NOT be an attribute (attributes can't carry functions).
    expect(el.hasAttribute("actions")).toBe(false);
  });

  it("actions property updates reactively when prop changes", async () => {
    const actions1 = [{ label: "Retry", onClick: () => {} }];
    const actions2 = [
      { label: "Undo", onClick: () => {} },
      { label: "Dismiss", onClick: () => {} },
    ];

    const wrapper = mount(TulparToast, { props: { actions: actions1 } });
    await wrapper.vm.$nextTick();

    await wrapper.setProps({ actions: actions2 });
    await wrapper.vm.$nextTick();

    const el = wrapper.find("tulpar-toast").element as HTMLElement & { actions?: unknown };
    expect(el.actions).toEqual(actions2);
  });

  // ── Slot carriers (display:contents) ───────────────────────────────────────

  it("title slot carrier: renders a <span slot='title'> with display:contents containing slot content", () => {
    const wrapper = mount(TulparToast, {
      slots: {
        title: "<strong>File saved</strong>",
      },
    });

    // The inner tulpar-toast element must contain a span with slot="title"
    const carrier = wrapper.find("tulpar-toast span[slot='title']");
    expect(carrier.exists()).toBe(true);
    // Browser normalizes "display:contents" → "display: contents;" — use loose check
    expect(carrier.attributes("style")).toMatch(/display:\s*contents/);
    // The slotted content must be projected inside the carrier
    expect(carrier.find("strong").exists()).toBe(true);
  });

  it("description slot carrier: renders a <span slot='description'> with display:contents", () => {
    const wrapper = mount(TulparToast, {
      slots: {
        description: "<em>Saved to Documents</em>",
      },
    });

    const carrier = wrapper.find("tulpar-toast span[slot='description']");
    expect(carrier.exists()).toBe(true);
    expect(carrier.attributes("style")).toMatch(/display:\s*contents/);
    expect(carrier.find("em").exists()).toBe(true);
  });

  it("icon slot carrier: renders a <span slot='icon'> with display:contents", () => {
    const wrapper = mount(TulparToast, {
      slots: {
        icon: "<svg><circle r='5' /></svg>",
      },
    });

    const carrier = wrapper.find("tulpar-toast span[slot='icon']");
    expect(carrier.exists()).toBe(true);
    expect(carrier.attributes("style")).toMatch(/display:\s*contents/);
    expect(carrier.find("svg").exists()).toBe(true);
  });

  it("default slot projects into the core element's light DOM", () => {
    const wrapper = mount(TulparToast, {
      slots: {
        default: "<p class='rich-body'>Rich content</p>",
      },
    });

    // Default slot content should appear inside tulpar-toast (no slot attr)
    const inner = wrapper.find("tulpar-toast");
    expect(inner.find("p.rich-body").exists()).toBe(true);
  });

  // ── Event forwarding ───────────────────────────────────────────────────────

  it("emits 'dismissed' when core tulpar-dismiss fires", async () => {
    const wrapper = mount(TulparToast);
    const inner = wrapper.find("tulpar-toast");

    const detail = { reason: "user" };
    inner.element.dispatchEvent(
      new CustomEvent("tulpar-dismiss", { detail, bubbles: true, composed: true }),
    );
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("dismissed")).toBeTruthy();
    expect(wrapper.emitted("dismissed")![0]).toEqual([detail]);
  });

  it("emits 'action' when core tulpar-action fires", async () => {
    const wrapper = mount(TulparToast);
    const inner = wrapper.find("tulpar-toast");

    const detail = { label: "Undo", action: { label: "Undo", onClick: () => {} } };
    inner.element.dispatchEvent(
      new CustomEvent("tulpar-action", { detail, bubbles: true, composed: true }),
    );
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("action")).toBeTruthy();
    expect(wrapper.emitted("action")![0]).toEqual([detail]);
  });
});
