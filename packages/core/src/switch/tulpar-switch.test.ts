import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-switch";
import type { TulparSwitch } from "./tulpar-switch";
import { switchStyles } from "./tulpar-switch.styles";

function track(el: TulparSwitch): HTMLButtonElement {
  return el.shadowRoot!.querySelector(".track") as HTMLButtonElement;
}

function pressKey(el: TulparSwitch, key: string) {
  const t = track(el);
  t.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, composed: true }));
}

describe("public type exports", () => {
  it("re-exports TulparSwitch from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparSwitch).to.exist;
  });
  it("re-exports TulparSwitch from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparSwitch).to.exist;
  });
});

describe("<tulpar-switch>", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-switch")).to.exist;
  });

  it("defaults checked=false with role=switch and aria-checked=false", async () => {
    const el = await fixture<TulparSwitch>(html`<tulpar-switch label="Wifi"></tulpar-switch>`);
    expect(el.checked).to.be.false;
    const t = track(el);
    expect(t.getAttribute("role")).to.equal("switch");
    expect(t.getAttribute("aria-checked")).to.equal("false");
  });

  it("click toggles checked + aria-checked", async () => {
    const el = await fixture<TulparSwitch>(html`<tulpar-switch label="Wifi"></tulpar-switch>`);
    track(el).click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
    expect(track(el).getAttribute("aria-checked")).to.equal("true");
    track(el).click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });

  it("Space toggles checked", async () => {
    const el = await fixture<TulparSwitch>(html`<tulpar-switch></tulpar-switch>`);
    pressKey(el, " ");
    await el.updateComplete;
    expect(el.checked).to.be.true;
  });

  it("Enter toggles checked", async () => {
    const el = await fixture<TulparSwitch>(html`<tulpar-switch></tulpar-switch>`);
    pressKey(el, "Enter");
    await el.updateComplete;
    expect(el.checked).to.be.true;
  });

  it("emits a composed, bubbling change event on toggle", async () => {
    const el = await fixture<TulparSwitch>(html`<tulpar-switch></tulpar-switch>`);
    let evt: Event | null = null;
    el.addEventListener("change", (e) => (evt = e));
    track(el).click();
    await el.updateComplete;
    expect(evt).to.not.be.null;
    expect((evt as unknown as Event).bubbles).to.be.true;
    expect((evt as unknown as Event).composed).to.be.true;
  });

  it("submits value 'on' via FormData when checked, nothing when unchecked", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-switch name="wifi"></tulpar-switch></form>
    `);
    const el = form.querySelector("tulpar-switch") as TulparSwitch;

    let data = new FormData(form);
    expect(data.get("wifi")).to.equal(null);

    track(el).click();
    await el.updateComplete;
    data = new FormData(form);
    expect(data.get("wifi")).to.equal("on");
  });

  it("submits a custom value when value is set", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-switch name="mode" value="dark" checked></tulpar-switch></form>
    `);
    const el = form.querySelector("tulpar-switch") as TulparSwitch;
    await el.updateComplete;
    const data = new FormData(form);
    expect(data.get("mode")).to.equal("dark");
  });

  it("formResetCallback restores the initial checked state", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-switch name="wifi" checked></tulpar-switch></form>
    `);
    const el = form.querySelector("tulpar-switch") as TulparSwitch;
    track(el).click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
    form.reset();
    await el.updateComplete;
    expect(el.checked).to.be.true;
    expect(new FormData(form).get("wifi")).to.equal("on");
  });

  it("disabled blocks toggle", async () => {
    const el = await fixture<TulparSwitch>(html`<tulpar-switch disabled></tulpar-switch>`);
    track(el).click();
    pressKey(el, " ");
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });

  it("readonly blocks toggle", async () => {
    const el = await fixture<TulparSwitch>(html`<tulpar-switch readonly></tulpar-switch>`);
    track(el).click();
    pressKey(el, "Enter");
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });

  describe("loading", () => {
    it("sets aria-busy=true and is NOT aria-disabled or disabled", async () => {
      const el = await fixture<TulparSwitch>(html`<tulpar-switch loading></tulpar-switch>`);
      const t = track(el);
      expect(t.getAttribute("aria-busy")).to.equal("true");
      expect(t.hasAttribute("aria-disabled")).to.be.false;
      expect(t.hasAttribute("disabled")).to.be.false;
    });

    it("does NOT toggle on click (no auto-flip)", async () => {
      const el = await fixture<TulparSwitch>(html`<tulpar-switch loading></tulpar-switch>`);
      track(el).click();
      pressKey(el, " ");
      await el.updateComplete;
      expect(el.checked).to.be.false;
    });

    it("renders the spinner element", async () => {
      const el = await fixture<TulparSwitch>(html`<tulpar-switch loading></tulpar-switch>`);
      expect(el.shadowRoot!.querySelector(".spinner")).to.exist;
    });
  });

  describe("show-icon", () => {
    it("renders default check + cross glyphs", async () => {
      const el = await fixture<TulparSwitch>(html`<tulpar-switch show-icon></tulpar-switch>`);
      expect(el.hasAttribute("show-icon")).to.be.true;
      const onSlot = el.shadowRoot!.querySelector('slot[name="icon-on"]') as HTMLSlotElement;
      const offSlot = el.shadowRoot!.querySelector('slot[name="icon-off"]') as HTMLSlotElement;
      expect(onSlot.querySelector("svg")).to.exist;
      expect(offSlot.querySelector("svg")).to.exist;
    });

    it("slotted icon-on/icon-off override the defaults", async () => {
      const el = await fixture<TulparSwitch>(html`
        <tulpar-switch show-icon>
          <span slot="icon-on" data-custom-on>Y</span>
          <span slot="icon-off" data-custom-off>N</span>
        </tulpar-switch>
      `);
      const onSlot = el.shadowRoot!.querySelector('slot[name="icon-on"]') as HTMLSlotElement;
      const offSlot = el.shadowRoot!.querySelector('slot[name="icon-off"]') as HTMLSlotElement;
      expect(onSlot.assignedElements()[0].hasAttribute("data-custom-on")).to.be.true;
      expect(offSlot.assignedElements()[0].hasAttribute("data-custom-off")).to.be.true;
    });
  });

  describe("custom track colors", () => {
    it("on-color sets --_sw-track-on inline", async () => {
      const el = await fixture<TulparSwitch>(
        html`<tulpar-switch on-color="#123456"></tulpar-switch>`,
      );
      await el.updateComplete;
      expect(el.style.getPropertyValue("--_sw-track-on").trim()).to.equal("#123456");
    });

    it("off-color sets --_sw-track-off inline", async () => {
      const el = await fixture<TulparSwitch>(
        html`<tulpar-switch off-color="#654321"></tulpar-switch>`,
      );
      await el.updateComplete;
      expect(el.style.getPropertyValue("--_sw-track-off").trim()).to.equal("#654321");
    });
  });

  describe("geometry", () => {
    it("at size=md the track resolves to 22px tall (control-size 18 + 4)", async () => {
      const el = await fixture<TulparSwitch>(html`<tulpar-switch size="md"></tulpar-switch>`);
      const t = track(el);
      // Custom props report their literal calc() text; assert the resolved
      // value via the consumed `height` property instead.
      expect(getComputedStyle(t).height).to.equal("22px");
    });
  });

  describe("a11y wiring", () => {
    it("invalid + required set aria-invalid / aria-required", async () => {
      const el = await fixture<TulparSwitch>(
        html`<tulpar-switch invalid required></tulpar-switch>`,
      );
      const t = track(el);
      expect(t.getAttribute("aria-invalid")).to.equal("true");
      expect(t.getAttribute("aria-required")).to.equal("true");
    });

    it("uses ariaLabel from the label attribute when no visible label slot", async () => {
      const el = await fixture<TulparSwitch>(html`<tulpar-switch></tulpar-switch>`);
      // No label at all → aria-label should be absent (nothing)
      expect(track(el).hasAttribute("aria-label")).to.be.false;
    });
  });

  describe("styles", () => {
    it("focus-visible adds an outline on the track", () => {
      const css = switchStyles.cssText;
      expect(css).to.match(/\.track:focus-visible/);
      expect(css).to.include("outline");
      expect(css).to.include("forced-colors");
    });

    it("reduced motion swaps the spinner to a pulse keyframe", () => {
      const css = switchStyles.cssText;
      expect(css).to.match(/prefers-reduced-motion:\s*reduce/);
      expect(css).to.include("tulpar-switch-pulse");
      expect(css).to.include("@keyframes tulpar-switch-pulse");
    });
  });
});
