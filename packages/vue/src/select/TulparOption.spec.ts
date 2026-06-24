import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparOption from "./TulparOption.vue";

describe("TulparOption (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/select");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparOption).toBeDefined();
  });

  it("mounts with a value", () => {
    const wrapper = mount(TulparOption, { props: { value: "a" } });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-option element", () => {
    const wrapper = mount(TulparOption, { props: { value: "a" } });
    expect(wrapper.find("tulpar-option").exists()).toBe(true);
  });

  it("forwards value prop", () => {
    const wrapper = mount(TulparOption, { props: { value: "foo" } });
    expect(wrapper.find("tulpar-option").attributes("value")).toBe("foo");
  });

  it("forwards label prop", () => {
    const wrapper = mount(TulparOption, { props: { value: "a", label: "Option A" } });
    expect(wrapper.find("tulpar-option").attributes("label")).toBe("Option A");
  });

  it("forwards description prop", () => {
    const wrapper = mount(TulparOption, {
      props: { value: "a", description: "A helpful description" },
    });
    expect(wrapper.find("tulpar-option").attributes("description")).toBe("A helpful description");
  });

  it("disabled=true sets disabled attribute", () => {
    const wrapper = mount(TulparOption, { props: { value: "a", disabled: true } });
    expect(wrapper.find("tulpar-option").attributes("disabled")).toBeTruthy();
  });

  it("disabled=false omits disabled attribute", () => {
    const wrapper = mount(TulparOption, { props: { value: "a", disabled: false } });
    expect(wrapper.find("tulpar-option").attributes("disabled")).toBeFalsy();
  });

  it("renders default slot content", () => {
    const wrapper = mount(TulparOption, { props: { value: "a" }, slots: { default: "Option A" } });
    expect(wrapper.text()).toContain("Option A");
  });

  it("forwards the icon named slot through a carrier with slot attr", () => {
    const wrapper = mount(TulparOption, {
      props: { value: "a" },
      slots: { icon: "<svg></svg>" },
    });
    expect(wrapper.find('[slot="icon"]').exists()).toBe(true);
  });

  it("forwards the description named slot through a carrier with slot attr", () => {
    const wrapper = mount(TulparOption, {
      props: { value: "a" },
      slots: { description: "A description" },
    });
    expect(wrapper.find('[slot="description"]').exists()).toBe(true);
  });
});
