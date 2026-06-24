import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparOptionGroup from "./TulparOptionGroup.vue";

describe("TulparOptionGroup (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/select");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparOptionGroup).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparOptionGroup);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-option-group element", () => {
    const wrapper = mount(TulparOptionGroup);
    expect(wrapper.find("tulpar-option-group").exists()).toBe(true);
  });

  it("forwards label prop", () => {
    const wrapper = mount(TulparOptionGroup, { props: { label: "Group A" } });
    expect(wrapper.find("tulpar-option-group").attributes("label")).toBe("Group A");
  });

  it("renders default slot content", () => {
    const wrapper = mount(TulparOptionGroup, {
      slots: { default: "<span>Option content</span>" },
    });
    expect(wrapper.text()).toContain("Option content");
  });

  it("forwards the label named slot through a carrier with slot attr", () => {
    const wrapper = mount(TulparOptionGroup, { slots: { label: "Group Header" } });
    expect(wrapper.find('[slot="label"]').exists()).toBe(true);
  });
});
