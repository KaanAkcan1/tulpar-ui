import { fixture, html, expect } from "@open-wc/testing";
import { expectA11yNode, parseFirstAriaNode } from "./a11y.ts";
import { itUnlessEngine } from "./engine-known-failures.ts";

/** Resolves with the error a promise rejects with; fails if it resolves. */
async function rejectionOf(promise: Promise<unknown>): Promise<Error> {
  let resolved = false;
  try {
    await promise;
    resolved = true;
  } catch (error) {
    return error as Error;
  }
  expect(resolved, "expected the assertion to throw").to.be.false;
  throw new Error("unreachable");
}

const uncheckedSwitch = html`
  <div role="switch" aria-checked="false" aria-label="Wi-Fi" tabindex="0"></div>
`;

describe("expectA11yNode", () => {
  it("(a) throws for expanded: false on a role that cannot be expanded (note)", async () => {
    const el = await fixture(html`<div role="note">Heads up</div>`);
    const error = await rejectionOf(
      expectA11yNode(el, { role: "note", states: { expanded: false } }),
    );
    expect(error.message).to.include('role "note" does not support the "expanded" state');
  });

  it("(b) passes for checked: false on an unchecked switch", async () => {
    const el = await fixture(uncheckedSwitch);
    await expectA11yNode(el, { role: "switch", name: "Wi-Fi", states: { checked: false } });
  });

  it("(c) throws for selected on a switch", async () => {
    const el = await fixture(uncheckedSwitch);
    const error = await rejectionOf(
      expectA11yNode(el, { role: "switch", states: { selected: false } }),
    );
    expect(error.message).to.include('role "switch" does not support the "selected" state');
  });

  it("fails checked: true on an unchecked switch", async () => {
    const el = await fixture(uncheckedSwitch);
    const error = await rejectionOf(
      expectA11yNode(el, { role: "switch", states: { checked: true } }),
    );
    expect(error.name).to.equal("AssertionError");
  });

  it("reads checked=mixed, invalid and disabled where the role supports them", async () => {
    const el = await fixture(html`
      <div
        role="checkbox"
        aria-checked="mixed"
        aria-invalid="true"
        aria-disabled="true"
        aria-label="All"
      ></div>
    `);
    await expectA11yNode(el, {
      role: "checkbox",
      name: /all/i,
      states: { checked: "mixed", invalid: true, disabled: true },
    });
  });

  it("throws for required (not in the ARIA snapshot)", async () => {
    const el = await fixture(uncheckedSwitch);
    const error = await rejectionOf(
      expectA11yNode(el, { role: "switch", states: { required: false } }),
    );
    expect(error.message).to.include('"required" is not exposed');
  });

  it("removes the probe attribute after the call", async () => {
    const el = await fixture(uncheckedSwitch);
    await expectA11yNode(el, { role: "switch" });
    expect(el.hasAttribute("data-a11y-probe")).to.be.false;
  });
});

describe("parseFirstAriaNode", () => {
  it("skips text nodes and reads a single-quoted YAML key", () => {
    const node = parseFirstAriaNode(`- text: hi\n- 'button "It''s: here" [expanded]'`);
    expect(node).to.deep.equal({ role: "button", name: "It's: here", flags: { expanded: true } });
  });
});

describe("itUnlessEngine", () => {
  it("throws for an id/test pair that is not in ENGINE_KNOWN_FAILURES", () => {
    expect(() => itUnlessEngine("ENG-0", "nope", () => {})).to.throw(
      'no ENGINE_KNOWN_FAILURES entry for id "ENG-0"',
    );
  });
});
