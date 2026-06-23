import { expect } from "@open-wc/testing";
import { Typeahead } from "./typeahead";

const labels = ["Apple", "Apricot", "Banana", "Cherry"];

describe("Typeahead", () => {
  it("matches the first label that startsWith the buffer", () => {
    const t = new Typeahead(500);
    expect(t.type("b", labels, 0, 0)).to.equal(2); // Banana
  });

  it("accumulates within the window to disambiguate", () => {
    const t = new Typeahead(500);
    expect(t.type("a", labels, 100, -1)).to.equal(0); // Apple
    expect(t.type("p", labels, 200, 0)).to.equal(0); // "ap" → Apple
    expect(t.type("r", labels, 300, 0)).to.equal(1); // "apr" → Apricot
  });

  it("resets the buffer after the window elapses", () => {
    const t = new Typeahead(500);
    t.type("a", labels, 0, -1); // buffer "a"
    expect(t.type("c", labels, 600, 0)).to.equal(3); // window elapsed → "c" → Cherry
  });

  it("cycles through matches on a repeated single letter", () => {
    const t = new Typeahead(500);
    expect(t.type("a", labels, 0, -1)).to.equal(0); // Apple
    expect(t.type("a", labels, 100, 0)).to.equal(1); // repeated 'a' → next: Apricot
    expect(t.type("a", labels, 200, 1)).to.equal(0); // wrap → Apple
  });

  it("is case-insensitive and ignores no-match", () => {
    const t = new Typeahead(500);
    expect(t.type("A", labels, 0, -1)).to.equal(0);
    expect(t.type("z", labels, 0, -1)).to.equal(-1); // no match → -1 (caller keeps current)
  });
});
