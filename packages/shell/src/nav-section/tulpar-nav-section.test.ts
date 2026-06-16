import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-nav-section";
import type { TulparNavSection } from "./tulpar-nav-section";

describe("<tulpar-nav-section>", () => {
  it("renders a labelled group", async () => {
    const el = await fixture<TulparNavSection>(
      html`<tulpar-nav-section label="Components"></tulpar-nav-section>`,
    );
    const labelEl = el.shadowRoot!.querySelector(".section-label")!;
    const group = el.shadowRoot!.querySelector('[role="group"]')!;
    expect(labelEl.textContent).to.contain("Components");
    expect(group.getAttribute("aria-labelledby")).to.equal(labelEl.id);
  });

  it("renders a group with no label (divider only) accessibly", async () => {
    const el = await fixture<TulparNavSection>(html`<tulpar-nav-section></tulpar-nav-section>`);
    expect(el.shadowRoot!.querySelector(".section-label")).to.be.null;
    expect(el.shadowRoot!.querySelector('[role="group"]')).to.exist;
  });
});
