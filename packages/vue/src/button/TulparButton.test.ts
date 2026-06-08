import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import TulparButton from "./TulparButton.vue";

describe("TulparButton", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/button");
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparButton, { slots: { default: "Click" } });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-button element with given variant", () => {
    const wrapper = mount(TulparButton, {
      props: { variant: "outlined" },
      slots: { default: "Delete" },
    });
    const inner = wrapper.find("tulpar-button");
    expect(inner.exists()).toBe(true);
    expect(inner.attributes("variant")).toBe("outlined");
  });

  it("emits click event when underlying element is clicked", async () => {
    const wrapper = mount(TulparButton, { slots: { default: "X" } });
    await wrapper.find("tulpar-button").trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
  });

  it("passes v0.3 props through to the underlying tulpar-button", () => {
    const wrapper = mount(TulparButton, {
      props: {
        severity: "danger",
        variant: "outlined",
        shape: "round",
        raised: true,
        iconSeparator: true,
        loadingLabel: "Saving…",
      },
      slots: { default: "Delete" },
    });
    const inner = wrapper.find("tulpar-button");
    expect(inner.attributes("severity")).toBe("danger");
    expect(inner.attributes("variant")).toBe("outlined");
    expect(inner.attributes("shape")).toBe("round");
    expect(inner.attributes("loading-label")).toBe("Saving…");
  });

  it("autoIconOnly is true when icon is provided and no default-slot text", () => {
    const FakeIcon = { render: () => h("span", { class: "icon" }, "✓") };
    const wrapper = mount(TulparButton, {
      props: { icon: FakeIcon },
    });
    const inner = wrapper.find("tulpar-button");
    expect(inner.attributes("icon-only")).toBeDefined();
  });

  it("autoIconOnly is false when default slot has meaningful content", () => {
    const FakeIcon = { render: () => h("span", { class: "icon" }, "✓") };
    const wrapper = mount(TulparButton, {
      props: { icon: FakeIcon },
      slots: { default: "Save" },
    });
    const inner = wrapper.find("tulpar-button");
    expect(inner.attributes("icon-only")).toBeUndefined();
  });
});
