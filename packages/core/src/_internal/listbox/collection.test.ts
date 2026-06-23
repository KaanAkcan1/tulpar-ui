import { expect } from "@open-wc/testing";
import { buildCollection, type OptionLike } from "./collection";

const opt = (value: string, label: string, disabled = false): OptionLike => ({
  value,
  label,
  disabled,
  el: { value } as unknown as HTMLElement, // identity stand-in
});

describe("buildCollection", () => {
  it("assigns sequential indices and preserves order", () => {
    const c = buildCollection([opt("a", "Apple"), opt("b", "Banana")]);
    expect(c.items.map((i) => i.index)).to.eql([0, 1]);
    expect(c.labels).to.eql(["Apple", "Banana"]);
  });

  it("indexByValue resolves the selected option, -1 when absent", () => {
    const c = buildCollection([opt("a", "Apple"), opt("b", "Banana")]);
    expect(c.indexByValue("b")).to.equal(1);
    expect(c.indexByValue("zzz")).to.equal(-1);
    expect(c.indexByValue("")).to.equal(-1);
  });

  it("exposes disabled flags for the active-index reducer", () => {
    const c = buildCollection([opt("a", "Apple", true), opt("b", "Banana")]);
    expect(c.items.map((i) => i.disabled)).to.eql([true, false]);
  });
});
