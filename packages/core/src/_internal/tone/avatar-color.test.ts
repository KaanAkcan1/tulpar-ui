import { expect } from "@open-wc/testing";
import { AVATAR_FAMILIES, hashToFamily } from "./avatar-color";
import { BRAND_FAMILIES } from "./tone-resolver";

const EXCLUDED = ["ulgen", "al", "colpan", "kara", "yagiz", "boz", "mergen", "ay"];

describe("AVATAR_FAMILIES", () => {
  it("is a non-empty subset of BRAND_FAMILIES", () => {
    expect(AVATAR_FAMILIES.length).to.be.greaterThan(0);
    for (const f of AVATAR_FAMILIES) {
      expect(BRAND_FAMILIES.has(f), `${f} should be a known brand family`).to.be.true;
    }
  });

  it("excludes every semantic-coded / neutral family", () => {
    for (const ex of EXCLUDED) {
      expect(AVATAR_FAMILIES, `${ex} must be excluded`).to.not.include(ex);
    }
  });

  it("equals BRAND_FAMILIES minus the excluded set", () => {
    const expected = [...BRAND_FAMILIES].filter((f) => !EXCLUDED.includes(f));
    expect([...AVATAR_FAMILIES]).to.deep.equal(expected);
  });
});

describe("hashToFamily", () => {
  it("returns a family from the curated palette", () => {
    expect(AVATAR_FAMILIES).to.include(hashToFamily("Jane Doe"));
  });

  it("is stable: same name → same family across calls", () => {
    const a = hashToFamily("Kaan Akcan");
    const b = hashToFamily("Kaan Akcan");
    expect(a).to.equal(b);
  });

  it("never returns an excluded family for a wide range of inputs", () => {
    const names = [
      "",
      "A",
      "Jane Doe",
      "kaan@x.com",
      "Émile Müller",
      "李雷",
      "12345",
      "the quick brown fox jumps over the lazy dog",
      "Ada Byron",
      "Mergen Boz", // deliberately uses excluded family words as a name
    ];
    for (const n of names) {
      const fam = hashToFamily(n);
      expect(AVATAR_FAMILIES, `"${n}" → ${fam} must be in palette`).to.include(fam);
      expect(EXCLUDED, `"${n}" → ${fam} must not be excluded`).to.not.include(fam);
    }
  });

  it("distributes different names across more than one family", () => {
    const sample = ["Ada", "Brian", "Carol", "Dan", "Eve", "Frank", "Grace", "Heidi"];
    const families = new Set(sample.map(hashToFamily));
    expect(families.size).to.be.greaterThan(1);
  });

  it("empty name maps to a palette family deterministically", () => {
    const a = hashToFamily("");
    expect(AVATAR_FAMILIES).to.include(a);
    expect(hashToFamily("")).to.equal(a);
  });
});
