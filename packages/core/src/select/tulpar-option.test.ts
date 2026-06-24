import { elementUpdated, expect, fixture, html } from "@open-wc/testing";
import "./tulpar-option";
import type { TulparOption } from "./tulpar-option";

describe("tulpar-option", () => {
  it("renders the label prop and exposes value", async () => {
    const el = await fixture<TulparOption>(
      html`<tulpar-option value="a" label="Apple"></tulpar-option>`,
    );
    expect(el.value).to.equal("a");
    expect(el.shadowRoot!.textContent).to.contain("Apple");
    expect(el.getAttribute("role")).to.equal("option");
  });

  it("slot content wins over the label prop", async () => {
    const el = await fixture<TulparOption>(
      html`<tulpar-option value="a" label="Prop">Slot</tulpar-option>`,
    );
    expect(el.resolvedLabel).to.equal("Slot");
  });

  it("falls back to the label prop when no slot content", async () => {
    const el = await fixture<TulparOption>(
      html`<tulpar-option value="a" label="Apple"></tulpar-option>`,
    );
    expect(el.resolvedLabel).to.equal("Apple");
  });

  it("reflects disabled", async () => {
    const el = await fixture<TulparOption>(
      html`<tulpar-option value="a" label="A" disabled></tulpar-option>`,
    );
    expect(el.disabled).to.be.true;
    expect(el.hasAttribute("disabled")).to.be.true;
  });

  it("ignores comment nodes when deriving the slotted label", async () => {
    // Guards the empty-slot/comment-node trap (Vue empty slot renders a comment).
    const el = await fixture<TulparOption>(
      html`<tulpar-option value="a" label="Fallback"><!--c--></tulpar-option>`,
    );
    expect(el.resolvedLabel).to.equal("Fallback");
  });

  it("renders a slot-only description (no prop) via the description slot", async () => {
    const el = await fixture<TulparOption>(html`
      <tulpar-option value="a" label="A"><span slot="description">Sub</span></tulpar-option>
    `);
    const slot = el.shadowRoot!.querySelector('slot[name="description"]') as HTMLSlotElement;
    expect(slot, "description slot should be rendered").to.be.ok;
    expect(
      slot
        .assignedNodes({ flatten: true })
        .map((n) => n.textContent)
        .join(""),
    ).to.contain("Sub");
  });

  // ── Icon zone (data-has-icon attribute) ───────────────────────────────────

  it("does NOT set data-has-icon when no icon slot content", async () => {
    const el = await fixture<TulparOption>(
      html`<tulpar-option value="a" label="A"></tulpar-option>`,
    );
    await elementUpdated(el);
    expect(el.hasAttribute("data-has-icon")).to.be.false;
  });

  it("sets data-has-icon when an icon slot child is present", async () => {
    const el = await fixture<TulparOption>(
      html`<tulpar-option value="a" label="A"><svg slot="icon"></svg></tulpar-option>`,
    );
    await elementUpdated(el);
    expect(el.hasAttribute("data-has-icon")).to.be.true;
  });
});
