/**
 * Focused unit tests for ActiveDescendantController — the virtual-focus DOM
 * reflection cluster extracted from `<tulpar-select>`. Built against real DOM
 * (a trigger button + a listbox div of stand-in option elements) with a
 * hand-built {@link Collection}, so the controller's attribute writes are tested
 * in isolation from the Select element itself.
 */

import { expect } from "@open-wc/testing";
import { ActiveDescendantController } from "./active-descendant-controller";
import { buildCollection, type OptionLike } from "./collection";

interface Harness {
  controller: ActiveDescendantController;
  trigger: HTMLButtonElement;
  options: HTMLElement[];
  cleanup: () => void;
}

/**
 * Build a real-DOM harness: a trigger button + a listbox holding `n` stand-in
 * option elements with stable ids, plus a controller reading a fresh collection.
 */
function makeHarness(specs: ReadonlyArray<{ value: string; label: string; disabled?: boolean }>) {
  const host = document.createElement("div");
  const trigger = document.createElement("button");
  const listbox = document.createElement("div");
  host.appendChild(trigger);
  host.appendChild(listbox);
  document.body.appendChild(host);

  const options: HTMLElement[] = specs.map((s, i) => {
    const el = document.createElement("tulpar-option");
    el.id = `opt-${i}`;
    listbox.appendChild(el);
    return el;
  });

  const buildOptions = (): OptionLike[] =>
    specs.map((s, i) => ({
      value: s.value,
      label: s.label,
      disabled: s.disabled ?? false,
      el: options[i],
    }));

  const controller = new ActiveDescendantController({
    getTrigger: () => trigger,
    getListbox: () => listbox,
    getCollection: () => buildCollection(buildOptions()),
  });

  const cleanup = () => {
    if (host.parentElement) host.parentElement.removeChild(host);
  };

  return { controller, trigger, options, cleanup } satisfies Harness;
}

describe("ActiveDescendantController", () => {
  it("setActive(i) marks item i active, clears the others, and points the trigger at it", () => {
    const h = makeHarness([
      { value: "a", label: "Apple" },
      { value: "b", label: "Banana" },
      { value: "c", label: "Cherry" },
    ]);
    try {
      h.controller.setActive(1);
      expect(h.controller.activeIndex).to.equal(1);
      expect(h.options[0].hasAttribute("data-active")).to.be.false;
      expect(h.options[1].hasAttribute("data-active")).to.be.true;
      expect(h.options[2].hasAttribute("data-active")).to.be.false;
      expect(h.trigger.getAttribute("aria-activedescendant")).to.equal(h.options[1].id);
    } finally {
      h.cleanup();
    }
  });

  it("moving active to a new index moves data-active and aria-activedescendant", () => {
    const h = makeHarness([
      { value: "a", label: "Apple" },
      { value: "b", label: "Banana" },
    ]);
    try {
      h.controller.setActive(0);
      h.controller.setActive(1);
      expect(h.options[0].hasAttribute("data-active")).to.be.false;
      expect(h.options[1].hasAttribute("data-active")).to.be.true;
      expect(h.trigger.getAttribute("aria-activedescendant")).to.equal(h.options[1].id);
    } finally {
      h.cleanup();
    }
  });

  it("setActive(-1) removes the active flag and the trigger attribute", () => {
    const h = makeHarness([{ value: "a", label: "Apple" }]);
    try {
      h.controller.setActive(0);
      expect(h.trigger.hasAttribute("aria-activedescendant")).to.be.true;
      h.controller.setActive(-1);
      expect(h.controller.activeIndex).to.equal(-1);
      expect(h.options[0].hasAttribute("data-active")).to.be.false;
      expect(h.trigger.hasAttribute("aria-activedescendant")).to.be.false;
    } finally {
      h.cleanup();
    }
  });

  it("setActive is idempotent on the same index (no error, attrs unchanged)", () => {
    const h = makeHarness([
      { value: "a", label: "Apple" },
      { value: "b", label: "Banana" },
    ]);
    try {
      h.controller.setActive(1);
      const before = h.trigger.getAttribute("aria-activedescendant");
      // Re-applying the same index must early-return without throwing or changing attrs.
      h.controller.setActive(1);
      expect(h.controller.activeIndex).to.equal(1);
      expect(h.options[1].hasAttribute("data-active")).to.be.true;
      expect(h.trigger.getAttribute("aria-activedescendant")).to.equal(before);
    } finally {
      h.cleanup();
    }
  });

  it("applySelectedAttrs(value) marks only the matching option selected", () => {
    const h = makeHarness([
      { value: "a", label: "Apple" },
      { value: "b", label: "Banana" },
      { value: "c", label: "Cherry" },
    ]);
    try {
      h.controller.applySelectedAttrs("b");
      expect(h.options[0].hasAttribute("data-selected")).to.be.false;
      expect(h.options[0].hasAttribute("aria-selected")).to.be.false;
      expect(h.options[1].hasAttribute("data-selected")).to.be.true;
      expect(h.options[1].getAttribute("aria-selected")).to.equal("true");
      expect(h.options[2].hasAttribute("data-selected")).to.be.false;
    } finally {
      h.cleanup();
    }
  });

  it('applySelectedAttrs("") selects nothing (no value selected → placeholder)', () => {
    const h = makeHarness([{ value: "a", label: "Apple" }]);
    try {
      h.controller.applySelectedAttrs("a");
      h.controller.applySelectedAttrs("");
      expect(h.options[0].hasAttribute("data-selected")).to.be.false;
      expect(h.options[0].hasAttribute("aria-selected")).to.be.false;
    } finally {
      h.cleanup();
    }
  });

  it("applyActiveAttrs re-applies the current index against a (possibly rebuilt) collection", () => {
    const h = makeHarness([
      { value: "a", label: "Apple" },
      { value: "b", label: "Banana" },
    ]);
    try {
      h.controller.activeIndex = 1;
      // Simulate the host calling applyActiveAttrs from updated() after a re-render.
      h.controller.applyActiveAttrs();
      expect(h.options[1].hasAttribute("data-active")).to.be.true;
      expect(h.trigger.getAttribute("aria-activedescendant")).to.equal(h.options[1].id);
    } finally {
      h.cleanup();
    }
  });
});
