import { expect, fixture, html } from "@open-wc/testing";
import { LitElement } from "lit";
import type { TemplateResult } from "lit";
import { renderMessageRow, type SelectionMessageHost } from "./selection-message-row";

/**
 * Throwaway host element that drives the message-row helper. Each test sets
 * the relevant host fields then renders, mirroring how SelectionControlBase
 * will consume the helper.
 */
class MsgRowHost extends LitElement implements SelectionMessageHost {
  invalid = false;
  warn = false;
  helperText?: string;
  errorText?: string;
  warnText?: string;
  noMessageSpace = false;
  _msgId = "msg-test-1";

  override render(): TemplateResult {
    return renderMessageRow(this);
  }
}
customElements.define("msg-row-host", MsgRowHost);

async function mount(props: Partial<MsgRowHost>): Promise<MsgRowHost> {
  const el = await fixture<MsgRowHost>(html`<msg-row-host></msg-row-host>`);
  Object.assign(el, props);
  el.requestUpdate();
  await el.updateComplete;
  return el;
}

describe("selection-message-row helper", () => {
  it("renders an error message with role=alert when invalid + errorText", async () => {
    const el = await mount({ invalid: true, errorText: "Something is wrong" });
    const node = el.shadowRoot!.querySelector('[role="alert"]')!;
    expect(node).to.exist;
    expect(node.textContent).to.contain("Something is wrong");
  });

  it("renders a warn message with role=status when warn + warnText", async () => {
    const el = await mount({ warn: true, warnText: "Heads up" });
    const node = el.shadowRoot!.querySelector('[role="status"]')!;
    expect(node).to.exist;
    expect(node.textContent).to.contain("Heads up");
  });

  it("renders a plain helper message (no role) when only helperText", async () => {
    const el = await mount({ helperText: "Some hint" });
    expect(el.shadowRoot!.querySelector('[role="alert"]')).to.not.exist;
    expect(el.shadowRoot!.querySelector('[role="status"]')).to.not.exist;
    expect(el.shadowRoot!.textContent).to.contain("Some hint");
  });

  it("renders nothing when noMessageSpace is true", async () => {
    const el = await mount({
      noMessageSpace: true,
      invalid: true,
      errorText: "ignored",
    });
    expect(el.shadowRoot!.querySelector(".selection-message-row")).to.not.exist;
    expect(el.shadowRoot!.textContent).to.not.contain("ignored");
  });

  it("wires the message id for aria-describedby plumbing", async () => {
    const el = await mount({ invalid: true, errorText: "boom" });
    const node = el.shadowRoot!.querySelector('[role="alert"]')!;
    expect(node.id).to.equal("msg-test-1");
  });
});
