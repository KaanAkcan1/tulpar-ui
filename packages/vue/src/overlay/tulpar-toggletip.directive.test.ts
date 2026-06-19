import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";

import { vTulparToggletip } from "./tulpar-toggletip.directive";

beforeAll(async () => {
  await import("@tulpar-ui/core/toggletip");
});

function toggletipFor(host: HTMLElement): HTMLElement | null {
  return (host.parentNode as ParentNode | null)?.querySelector("tulpar-toggletip") ?? null;
}

describe("vTulparToggletip (Vue directive)", () => {
  it("is exported", () => {
    expect(vTulparToggletip).toBeDefined();
  });

  it("text-only: mints host id + creates tulpar-toggletip with for===host id", () => {
    const wrapper = mount({
      directives: { tulparToggletip: vTulparToggletip },
      template: `<button v-tulpar-toggletip="'More info'">i</button>`,
    });
    const host = wrapper.find("button").element as HTMLButtonElement;
    expect(host.id).toBeTruthy();
    const tip = toggletipFor(host) as HTMLElement & { text?: string };
    expect(tip).toBeTruthy();
    expect(tip.getAttribute("for")).toBe(host.id);
    expect(tip.text).toBe("More info");
  });

  it("object config forwards placement + tone", () => {
    const wrapper = mount({
      directives: { tulparToggletip: vTulparToggletip },
      template: `<button v-tulpar-toggletip="{ text: 'Info', placement: 'top', tone: 'info' }">i</button>`,
    });
    const host = wrapper.find("button").element as HTMLButtonElement;
    const tip = toggletipFor(host)!;
    expect(tip.getAttribute("placement")).toBe("top");
    expect(tip.getAttribute("tone")).toBe("info");
  });

  it("does not clobber a consumer-set id", () => {
    const wrapper = mount({
      directives: { tulparToggletip: vTulparToggletip },
      template: `<button id="info-btn" v-tulpar-toggletip="'Info'">i</button>`,
    });
    const host = wrapper.find("button").element as HTMLButtonElement;
    expect(host.id).toBe("info-btn");
    expect(toggletipFor(host)?.getAttribute("for")).toBe("info-btn");
  });

  it("removes the created element on teardown", () => {
    const wrapper = mount({
      directives: { tulparToggletip: vTulparToggletip },
      template: `<button v-tulpar-toggletip="'Info'">i</button>`,
    });
    const host = wrapper.find("button").element as HTMLButtonElement;
    const parent = host.parentNode as HTMLElement;
    expect(parent.querySelector("tulpar-toggletip")).toBeTruthy();
    wrapper.unmount();
    expect(parent.querySelector("tulpar-toggletip")).toBeNull();
  });
});
