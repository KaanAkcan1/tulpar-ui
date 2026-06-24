import { expect } from "@open-wc/testing";
import { normalize, filterOptions } from "./filter";

describe("listbox/filter — normalize (1:1 fold)", () => {
  it("lowercases and folds Turkish + Latin diacritics, length-stable", () => {
    const cases: Array<[string, string]> = [
      ["İstanbul", "istanbul"],
      ["Güneş", "gunes"],
      ["Çağrı", "cagri"],
      ["ÖĞÜŞİÇ", "ogusic"],
      ["Crème Brûlée", "creme brulee"],
      ["Niño", "nino"],
    ];
    for (const [input, want] of cases) {
      const { text, map } = normalize(input);
      expect(text).to.equal(want);
      expect(text.length).to.equal(input.length); // 1:1 — never shifts
      expect(map.length).to.equal(input.length);
      expect(map[0]).to.equal(0); // identity map
    }
  });
});

describe("listbox/filter — filterOptions", () => {
  const labels = ["İstanbul", "Ankara", "İzmir", "Bursa"];

  it("matches diacritic-insensitively and returns original-index ranges", () => {
    const { matched, ranges } = filterOptions(labels, "is");
    expect(matched).to.deep.equal([true, false, false, false]); // 'İstanbul' only
    expect(ranges[0]).to.deep.equal([0, 2]); // highlight "İs"
    expect(ranges[1]).to.equal(null);
  });

  it("matches anywhere in the label (substring, not prefix)", () => {
    const { matched } = filterOptions(labels, "kara");
    expect(matched).to.deep.equal([false, true, false, false]); // 'Ankara'
  });

  it("empty / whitespace query → all matched, null ranges", () => {
    for (const q of ["", "   "]) {
      const { matched, ranges } = filterOptions(labels, q);
      expect(matched.every(Boolean)).to.equal(true);
      expect(ranges.every((r) => r === null)).to.equal(true);
    }
  });

  it("no match → all false", () => {
    const { matched } = filterOptions(labels, "xyz");
    expect(matched.some(Boolean)).to.equal(false);
  });
});
