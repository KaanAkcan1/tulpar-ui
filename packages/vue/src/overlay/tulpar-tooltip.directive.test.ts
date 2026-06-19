import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";

import { vTulparTooltip } from "./tulpar-tooltip.directive";

beforeAll(async () => {
  await import("@tulpar-ui/core/tooltip");
});

function tooltipFor(host: HTMLElement): HTMLElement | null {
  return (host.parentNode as ParentNode | null)?.querySelector("tulpar-tooltip") ?? null;
}

describe("vTulparTooltip (Vue directive)", () => {
  it("is exported", () => {
    expect(vTulparTooltip).toBeDefined();
  });

  it("text-only: mints host id + creates tulpar-tooltip with for===host id and text", () => {
    const wrapper = mount({
      directives: { tulparTooltip: vTulparTooltip },
      template: `<button v-tulpar-tooltip="'Kaydet'">Save</button>`,
    });
    const host = wrapper.find("button").element as HTMLButtonElement;
    expect(host.id).toBeTruthy();
    const tip = tooltipFor(host) as HTMLElement & { text?: string };
    expect(tip).toBeTruthy();
    expect(tip.getAttribute("for")).toBe(host.id);
    expect(tip.text).toBe("Kaydet");
  });

  it("object config forwards placement + arrow as a DOM property (not attribute)", () => {
    const wrapper = mount({
      directives: { tulparTooltip: vTulparTooltip },
      template: `<button v-tulpar-tooltip="{ text: 'Hi', placement: 'top', arrow: false, offset: 8 }">x</button>`,
    });
    const host = wrapper.find("button").element as HTMLButtonElement;
    const tip = tooltipFor(host) as HTMLElement & { arrow?: boolean };
    expect(tip.getAttribute("placement")).toBe("top");
    expect(tip.getAttribute("offset")).toBe("8");
    // arrow MUST be a property — a present boolean ATTRIBUTE reads as true in Lit.
    expect(tip.arrow).toBe(false);
    expect(tip.getAttribute("arrow")).toBeNull();
  });

  it("does not clobber a consumer-set id", () => {
    const wrapper = mount({
      directives: { tulparTooltip: vTulparTooltip },
      template: `<button id="myBtn" v-tulpar-tooltip="'Hi'">x</button>`,
    });
    const host = wrapper.find("button").element as HTMLButtonElement;
    expect(host.id).toBe("myBtn");
    expect(tooltipFor(host)?.getAttribute("for")).toBe("myBtn");
  });

  it("removes the created element on teardown", () => {
    const wrapper = mount({
      directives: { tulparTooltip: vTulparTooltip },
      template: `<button v-tulpar-tooltip="'Hi'">x</button>`,
    });
    const host = wrapper.find("button").element as HTMLButtonElement;
    const parent = host.parentNode as HTMLElement;
    expect(parent.querySelector("tulpar-tooltip")).toBeTruthy();
    wrapper.unmount();
    expect(parent.querySelector("tulpar-tooltip")).toBeNull();
  });

  it("onOpenChange callback fires on tulpar-open / tulpar-close", () => {
    const events: boolean[] = [];
    const wrapper = mount({
      directives: { tulparTooltip: vTulparTooltip },
      data() {
        return { cfg: { text: "Hi", onOpenChange: (v: boolean) => events.push(v) } };
      },
      template: `<button v-tulpar-tooltip="cfg">x</button>`,
    });
    const host = wrapper.find("button").element as HTMLButtonElement;
    const tip = tooltipFor(host)!;
    tip.dispatchEvent(new CustomEvent("tulpar-open"));
    tip.dispatchEvent(new CustomEvent("tulpar-close"));
    expect(events).toEqual([true, false]);
  });
});
