import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparCheckboxGroup from "./TulparCheckboxGroup.vue";

describe("TulparCheckboxGroup (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/checkbox-group");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparCheckboxGroup).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparCheckboxGroup);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-checkbox-group element", () => {
    const wrapper = mount(TulparCheckboxGroup);
    expect(wrapper.find("tulpar-checkbox-group").exists()).toBe(true);
  });

  it("forwards label prop", () => {
    const wrapper = mount(TulparCheckboxGroup, { props: { label: "Pick options" } });
    const inner = wrapper.find("tulpar-checkbox-group");
    expect(inner.attributes("label")).toBe("Pick options");
  });

  it("forwards orientation prop", () => {
    const wrapper = mount(TulparCheckboxGroup, { props: { orientation: "horizontal" } });
    const inner = wrapper.find("tulpar-checkbox-group");
    expect(inner.attributes("orientation")).toBe("horizontal");
  });

  it("forwards disabled prop", () => {
    const wrapper = mount(TulparCheckboxGroup, { props: { disabled: true } });
    const inner = wrapper.find("tulpar-checkbox-group");
    expect(inner.attributes("disabled")).toBeTruthy();
  });

  it("projects slot children inside tulpar-checkbox-group (nesting invariant)", () => {
    const wrapper = mount(TulparCheckboxGroup, {
      slots: {
        default:
          '<tulpar-checkbox value="x"></tulpar-checkbox><tulpar-checkbox value="y"></tulpar-checkbox>',
      },
    });
    const group = wrapper.find("tulpar-checkbox-group");
    // Children must be descendants of the core group element
    expect(group.findAll("tulpar-checkbox").length).toBe(2);
  });

  it("v-model: emits update:modelValue (string[]) from composed change CustomEvent detail.value", async () => {
    const wrapper = mount(TulparCheckboxGroup, { props: { modelValue: [] } });
    const inner = wrapper.find("tulpar-checkbox-group");
    inner.element.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: ["x", "y"] },
        bubbles: true,
        composed: true,
      }),
    );
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted("update:modelValue");
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual([["x", "y"]]);
  });

  it("emits change event on core CustomEvent change", async () => {
    const wrapper = mount(TulparCheckboxGroup, { props: { modelValue: [] } });
    const inner = wrapper.find("tulpar-checkbox-group");
    inner.element.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: ["x"] },
        bubbles: true,
        composed: true,
      }),
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("change")).toBeTruthy();
  });
});
