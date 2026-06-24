import { expect } from "@open-wc/testing";
import { isOptionGroup, type SelectOption, type SelectOptionGroup } from "./select-options";

describe("select-options", () => {
  it("isOptionGroup distinguishes groups from options", () => {
    const opt: SelectOption = { value: "a", label: "A" };
    const grp: SelectOptionGroup = { label: "G", options: [opt] };
    expect(isOptionGroup(opt)).to.equal(false);
    expect(isOptionGroup(grp)).to.equal(true);
  });
});
