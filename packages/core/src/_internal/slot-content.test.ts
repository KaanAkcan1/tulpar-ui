import { expect } from "@open-wc/testing";
import { hasMeaningfulContent, isMeaningfulNode } from "./slot-content";

describe("slot-content", () => {
  describe("isMeaningfulNode", () => {
    it("counts element nodes", () => {
      expect(isMeaningfulNode(document.createElement("span"))).to.equal(true);
    });

    it("counts non-whitespace text nodes", () => {
      expect(isMeaningfulNode(document.createTextNode("hello"))).to.equal(true);
    });

    it("ignores whitespace-only text nodes", () => {
      expect(isMeaningfulNode(document.createTextNode("  \n\t "))).to.equal(false);
      expect(isMeaningfulNode(document.createTextNode(""))).to.equal(false);
    });

    // The core of the Vue empty-slot bug: an empty `<slot/>` outlet leaves a
    // `<!---->` comment in the light DOM. That comment must NOT count as content.
    it("ignores comment nodes (Vue empty-slot placeholder)", () => {
      expect(isMeaningfulNode(document.createComment(""))).to.equal(false);
      expect(isMeaningfulNode(document.createComment("some comment"))).to.equal(false);
    });
  });

  describe("hasMeaningfulContent", () => {
    it("is false for an empty list", () => {
      expect(hasMeaningfulContent([])).to.equal(false);
    });

    it("is false for comment-only / whitespace-only nodes", () => {
      expect(hasMeaningfulContent([document.createComment("")])).to.equal(false);
      expect(hasMeaningfulContent([document.createTextNode("   ")])).to.equal(false);
      expect(
        hasMeaningfulContent([document.createComment(""), document.createTextNode("\n  ")]),
      ).to.equal(false);
    });

    it("is true when any element or non-whitespace text is present", () => {
      expect(hasMeaningfulContent([document.createElement("b")])).to.equal(true);
      expect(hasMeaningfulContent([document.createTextNode("x")])).to.equal(true);
      // mixed: a comment plus real text still counts.
      expect(
        hasMeaningfulContent([document.createComment(""), document.createTextNode("Beta")]),
      ).to.equal(true);
    });
  });
});
