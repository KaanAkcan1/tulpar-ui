import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparChip from "./TulparChip.vue";

describe("TulparChip (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/chip");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparChip).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparChip);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-chip element", () => {
    const wrapper = mount(TulparChip);
    expect(wrapper.find("tulpar-chip").exists()).toBe(true);
  });

  it("forwards tone prop", () => {
    const wrapper = mount(TulparChip, { props: { tone: "info" } });
    expect(wrapper.find("tulpar-chip").attributes("tone")).toBe("info");
  });

  it("forwards label prop", () => {
    const wrapper = mount(TulparChip, { props: { label: "Filter" } });
    expect(wrapper.find("tulpar-chip").attributes("label")).toBe("Filter");
  });

  it("removable=true sets removable attribute", () => {
    const wrapper = mount(TulparChip, { props: { removable: true } });
    expect(wrapper.find("tulpar-chip").attributes("removable")).toBeTruthy();
  });

  it("emits clicked on the core tulpar-click event", async () => {
    const wrapper = mount(TulparChip);
    const inner = wrapper.find("tulpar-chip");
    inner.element.dispatchEvent(new CustomEvent("tulpar-click"));
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("clicked")).toBeTruthy();
  });

  it("emits removed on the core tulpar-remove event", async () => {
    const wrapper = mount(TulparChip, { props: { removable: true } });
    const inner = wrapper.find("tulpar-chip");
    inner.element.dispatchEvent(new CustomEvent("tulpar-remove"));
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("removed")).toBeTruthy();
  });

  it("forwards the avatar named slot through a carrier with slot attr", () => {
    const wrapper = mount(TulparChip, { slots: { avatar: "AB" } });
    expect(wrapper.find('[slot="avatar"]').exists()).toBe(true);
  });
});
