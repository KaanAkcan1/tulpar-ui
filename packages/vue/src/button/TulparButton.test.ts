import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
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
      props: { variant: "danger" },
      slots: { default: "Delete" },
    });
    const inner = wrapper.find("tulpar-button");
    expect(inner.exists()).toBe(true);
    expect(inner.attributes("variant")).toBe("danger");
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
});
