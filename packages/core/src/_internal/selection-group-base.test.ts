import { fixture, html, expect } from "@open-wc/testing";
import "../checkbox/tulpar-checkbox";
import { SelectionGroupBase } from "./selection-group-base";

/** Tiny concrete subclass to exercise the abstract base directly. */
class TestGroup extends SelectionGroupBase {
  protected get _childTag() {
    return "tulpar-checkbox";
  }
  protected get _groupRole() {
    return "group";
  }
  protected _reconcileFromChildren() {}
  protected _applyValueToChildren() {}
}
if (!customElements.get("test-selection-group")) {
  customElements.define("test-selection-group", TestGroup);
}

function container(el: TestGroup): HTMLElement {
  return el.shadowRoot!.querySelector(".group") as HTMLElement;
}

describe("SelectionGroupBase (via test subclass)", () => {
  it("is not form-associated", () => {
    expect((SelectionGroupBase as unknown as { formAssociated?: boolean }).formAssociated).to.not
      .equal(true);
  });

  it("renders the legend from the label attribute", async () => {
    const el = await fixture<TestGroup>(
      html`<test-selection-group label="Pick some"></test-selection-group>`,
    );
    const legend = el.shadowRoot!.querySelector(".legend") as HTMLElement;
    expect(legend.hidden).to.be.false;
    expect(legend.textContent).to.contain("Pick some");
  });

  it("renders the legend from a slotted label", async () => {
    const el = await fixture<TestGroup>(html`
      <test-selection-group><span slot="label">Slotted question</span></test-selection-group>
    `);
    const legend = el.shadowRoot!.querySelector(".legend") as HTMLElement;
    expect(legend.hidden).to.be.false;
  });

  it("aria-labelledby links the legend id", async () => {
    const el = await fixture<TestGroup>(
      html`<test-selection-group label="Q"></test-selection-group>`,
    );
    const grp = container(el);
    const legend = el.shadowRoot!.querySelector(".legend") as HTMLElement;
    expect(grp.getAttribute("aria-labelledby")).to.equal(legend.id);
    expect(legend.id).to.be.ok;
  });

  it("orientation reflects and drives the items container direction", async () => {
    const el = await fixture<TestGroup>(
      html`<test-selection-group orientation="horizontal"></test-selection-group>`,
    );
    expect(el.getAttribute("orientation")).to.equal("horizontal");
    const items = el.shadowRoot!.querySelector(".items") as HTMLElement;
    expect(getComputedStyle(items).flexDirection).to.equal("row");
  });

  it("defaults to vertical (column) items", async () => {
    const el = await fixture<TestGroup>(html`<test-selection-group></test-selection-group>`);
    const items = el.shadowRoot!.querySelector(".items") as HTMLElement;
    expect(getComputedStyle(items).flexDirection).to.equal("column");
  });

  it("propagates name/size/disabled/readonly/color to children on connect", async () => {
    const el = await fixture<TestGroup>(html`
      <test-selection-group
        name="grp"
        size="lg"
        disabled
        readonly
        color="#123456"
      >
        <tulpar-checkbox value="a"></tulpar-checkbox>
        <tulpar-checkbox value="b"></tulpar-checkbox>
      </test-selection-group>
    `);
    await el.updateComplete;
    const kids = el.querySelectorAll("tulpar-checkbox");
    for (const k of kids) {
      expect(k.getAttribute("name")).to.equal("grp");
      expect(k.getAttribute("size")).to.equal("lg");
      expect(k.hasAttribute("disabled")).to.be.true;
      expect(k.hasAttribute("readonly")).to.be.true;
      expect(k.getAttribute("color")).to.equal("#123456");
    }
  });

  it("propagates to a child added after connect (slotchange)", async () => {
    const el = await fixture<TestGroup>(html`
      <test-selection-group name="grp" size="sm"></test-selection-group>
    `);
    const added = document.createElement("tulpar-checkbox");
    added.setAttribute("value", "late");
    el.appendChild(added);
    // Wait for slotchange + the resulting update.
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(added.getAttribute("name")).to.equal("grp");
    expect(added.getAttribute("size")).to.equal("sm");
  });

  it("OR-s child's own disabled when the group is not disabled", async () => {
    const el = await fixture<TestGroup>(html`
      <test-selection-group name="grp">
        <tulpar-checkbox value="a" disabled></tulpar-checkbox>
        <tulpar-checkbox value="b"></tulpar-checkbox>
      </test-selection-group>
    `);
    await el.updateComplete;
    const kids = el.querySelectorAll("tulpar-checkbox");
    expect(kids[0].hasAttribute("disabled")).to.be.true;
    expect(kids[1].hasAttribute("disabled")).to.be.false;
  });

  it("re-enabling the group clears only the disables it added", async () => {
    const el = await fixture<TestGroup>(html`
      <test-selection-group name="grp" disabled>
        <tulpar-checkbox value="a" disabled></tulpar-checkbox>
        <tulpar-checkbox value="b"></tulpar-checkbox>
      </test-selection-group>
    `);
    await el.updateComplete;
    const kids = el.querySelectorAll("tulpar-checkbox");
    expect(kids[0].hasAttribute("disabled")).to.be.true;
    expect(kids[1].hasAttribute("disabled")).to.be.true;

    el.disabled = false;
    await el.updateComplete;
    // child a was disabled on its own → stays; child b was only group-disabled → cleared
    expect(kids[0].hasAttribute("disabled")).to.be.true;
    expect(kids[1].hasAttribute("disabled")).to.be.false;
  });

  it("group invalid + errorText renders an alert message row", async () => {
    const el = await fixture<TestGroup>(html`
      <test-selection-group invalid error-text="Required"></test-selection-group>
    `);
    const msg = el.shadowRoot!.querySelector(".selection-message") as HTMLElement;
    expect(msg).to.exist;
    expect(msg.getAttribute("role")).to.equal("alert");
    expect(msg.textContent).to.contain("Required");
    expect(container(el).getAttribute("aria-describedby")).to.equal(el._msgId);
    expect(msg.id).to.equal(el._msgId);
  });

  it("mirrors aria-required and aria-invalid onto the container", async () => {
    const el = await fixture<TestGroup>(
      html`<test-selection-group required invalid></test-selection-group>`,
    );
    const grp = container(el);
    expect(grp.getAttribute("aria-required")).to.equal("true");
    expect(grp.getAttribute("aria-invalid")).to.equal("true");
  });
});
