import { expect } from "@open-wc/testing";
import { initials } from "./initials";

describe("initials()", () => {
  it("takes first letters of first two words, uppercased", () => {
    expect(initials("Kaan Akcan")).to.equal("KA");
  });
  it("single word → first letter", () => {
    expect(initials("Kaan")).to.equal("K");
  });
  it("empty/undefined → empty string", () => {
    expect(initials("")).to.equal("");
    expect(initials(undefined)).to.equal("");
  });
  it("trims and ignores extra spaces", () => {
    expect(initials("  Kaan   Veli Akcan ")).to.equal("KV");
  });
});
