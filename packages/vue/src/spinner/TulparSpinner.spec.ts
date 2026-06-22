import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparSpinner from "./TulparSpinner.vue";

describe("TulparSpinner (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/spinner");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparSpinner).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparSpinner);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-spinner element", () => {
    const wrapper = mount(TulparSpinner);
    expect(wrapper.find("tulpar-spinner").exists()).toBe(true);
  });

  it("forwards size prop", () => {
    const wrapper = mount(TulparSpinner, { props: { size: "lg" } });
    expect(wrapper.find("tulpar-spinner").attributes("size")).toBe("lg");
  });

  it("forwards tone prop", () => {
    const wrapper = mount(TulparSpinner, { props: { tone: "info" } });
    expect(wrapper.find("tulpar-spinner").attributes("tone")).toBe("info");
  });

  it("default track=true sets the track attribute", () => {
    const wrapper = mount(TulparSpinner);
    expect(wrapper.find("tulpar-spinner").attributes("track")).toBeTruthy();
  });

  it("track=false omits the track attribute", () => {
    const wrapper = mount(TulparSpinner, { props: { track: false } });
    expect(wrapper.find("tulpar-spinner").attributes("track")).toBeUndefined();
  });

  it("forwards the label named slot through a carrier with slot attr", () => {
    const wrapper = mount(TulparSpinner, { slots: { label: "Saving" } });
    expect(wrapper.find('[slot="label"]').exists()).toBe(true);
  });
});
