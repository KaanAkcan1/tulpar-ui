import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";

import { vTulparPopover } from "./tulpar-popover.directive";

beforeAll(async () => {
  await import("@tulpar-ui/core/popover");
});

function popoverFor(host: HTMLElement): HTMLElement | null {
  return (host.parentNode as ParentNode | null)?.querySelector("tulpar-popover") ?? null;
}

describe("vTulparPopover (Vue directive) — inline", () => {
  it("is exported", () => {
    expect(vTulparPopover).toBeDefined();
  });

  it("text-only: mints host id + creates tulpar-popover with for===host id and textContent", () => {
    const wrapper = mount({
      directives: { tulparPopover: vTulparPopover },
      template: `<button v-tulpar-popover="'Quick note'">open</button>`,
    });
    const host = wrapper.find("button").element as HTMLButtonElement;
    expect(host.id).toBeTruthy();
    const pop = popoverFor(host)!;
    expect(pop.getAttribute("for")).toBe(host.id);
    expect(pop.textContent).toBe("Quick note");
  });

  it("object config forwards placement + tone; flip set as a DOM property (no attribute)", () => {
    const wrapper = mount({
      directives: { tulparPopover: vTulparPopover },
      template: `<button v-tulpar-popover="{ text: 'n', placement: 'top', tone: 'warning', flip: false, crossOffset: 4 }">x</button>`,
    });
    const host = wrapper.find("button").element as HTMLButtonElement;
    const pop = popoverFor(host) as HTMLElement & { flip?: boolean; crossOffset?: number };
    expect(pop.getAttribute("placement")).toBe("top");
    expect(pop.getAttribute("tone")).toBe("warning");
    // flip MUST be a property — present boolean attr reads as true in Lit.
    expect(pop.flip).toBe(false);
    expect(pop.getAttribute("flip")).toBeNull();
    // crossOffset is a camelCase DOM property (maps to cross-offset attr).
    expect(pop.crossOffset).toBe(4);
  });

  it("does not clobber a consumer-set id", () => {
    const wrapper = mount({
      directives: { tulparPopover: vTulparPopover },
      template: `<button id="pop-btn" v-tulpar-popover="'n'">x</button>`,
    });
    const host = wrapper.find("button").element as HTMLButtonElement;
    expect(host.id).toBe("pop-btn");
    expect(popoverFor(host)?.getAttribute("for")).toBe("pop-btn");
  });

  it("removes the created element on teardown", () => {
    const wrapper = mount({
      directives: { tulparPopover: vTulparPopover },
      template: `<button v-tulpar-popover="'n'">x</button>`,
    });
    const host = wrapper.find("button").element as HTMLButtonElement;
    const parent = host.parentNode as HTMLElement;
    expect(parent.querySelector("tulpar-popover")).toBeTruthy();
    wrapper.unmount();
    expect(parent.querySelector("tulpar-popover")).toBeNull();
  });
});

describe("vTulparPopover (Vue directive) — ref", () => {
  it("arg form (:ref) sets the declared element's for to the host id and leaves content", () => {
    const wrapper = mount(
      {
        directives: { tulparPopover: vTulparPopover },
        template: `
          <div>
            <tulpar-popover id="declaredPop"><h2>Account</h2></tulpar-popover>
            <button v-tulpar-popover:ref="'declaredPop'">Trigger</button>
          </div>
        `,
      },
      { attachTo: document.body },
    );
    const host = wrapper.find("button").element as HTMLButtonElement;
    const declared = wrapper.find("#declaredPop").element as HTMLElement;
    expect(host.id).toBeTruthy();
    expect(declared.getAttribute("for")).toBe(host.id);
    // Consumer-owned rich content untouched.
    expect(declared.querySelector("h2")?.textContent).toBe("Account");
  });

  it("object form ({ ref }) also anchors the declared element", () => {
    const wrapper = mount(
      {
        directives: { tulparPopover: vTulparPopover },
        template: `
          <div>
            <tulpar-popover id="declaredPop2"><h2>Menu</h2></tulpar-popover>
            <button v-tulpar-popover="{ ref: 'declaredPop2' }">Trigger</button>
          </div>
        `,
      },
      { attachTo: document.body },
    );
    const host = wrapper.find("button").element as HTMLButtonElement;
    const declared = wrapper.find("#declaredPop2").element as HTMLElement;
    expect(declared.getAttribute("for")).toBe(host.id);
  });

  it("does NOT remove the declared element on teardown", () => {
    const wrapper = mount(
      {
        directives: { tulparPopover: vTulparPopover },
        template: `
          <div>
            <tulpar-popover id="declaredPop3"><h2>Keep</h2></tulpar-popover>
            <button v-tulpar-popover:ref="'declaredPop3'">Trigger</button>
          </div>
        `,
      },
      { attachTo: document.body },
    );
    const declared = wrapper.find("#declaredPop3").element as HTMLElement;
    wrapper.unmount();
    // The declared element belongs to the consumer; unmount must not remove it
    // (it lives inside the component template, so we assert the directive itself
    // does not create a duplicate / strip its content during its own teardown).
    expect(declared.querySelector("h2")?.textContent).toBe("Keep");
  });
});
