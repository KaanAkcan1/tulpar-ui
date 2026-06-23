import { expect } from "@open-wc/testing";
import { resolveKeyAction } from "./keymap";

const mods = (
  m: Partial<{ altKey: boolean; shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }> = {},
) => ({
  altKey: false,
  shiftKey: false,
  ctrlKey: false,
  metaKey: false,
  ...m,
});

describe("resolveKeyAction (listbox keymap)", () => {
  describe("when CLOSED", () => {
    const closed = (key: string, m = {}) => resolveKeyAction(key, { open: false, ...mods(m) });

    it("Enter / Space / ArrowDown / ArrowUp open", () => {
      for (const k of ["Enter", " ", "ArrowDown", "ArrowUp"]) {
        const a = closed(k);
        expect(a.type, k).to.equal("open");
        expect(a.preventDefault, k).to.be.true;
      }
    });

    it("Alt+ArrowDown opens", () => {
      const a = closed("ArrowDown", { altKey: true });
      expect(a.type).to.equal("open");
      expect(a.preventDefault).to.be.true;
    });

    it("a printable char opens then typeahead", () => {
      const a = closed("c");
      expect(a.type).to.equal("open-typeahead");
    });

    it("a char with ctrl/meta/alt is ignored", () => {
      expect(closed("c", { ctrlKey: true }).type).to.equal("none");
      expect(closed("c", { metaKey: true }).type).to.equal("none");
      expect(closed("c", { altKey: true }).type).to.equal("none");
    });

    it("an unhandled named key is none", () => {
      expect(closed("Escape").type).to.equal("none");
      expect(closed("Tab").type).to.equal("none");
    });
  });

  describe("when OPEN", () => {
    const open = (key: string, m = {}) => resolveKeyAction(key, { open: true, ...mods(m) });

    it("ArrowDown / ArrowUp move", () => {
      expect(open("ArrowDown")).to.deep.equal({ type: "move-next", preventDefault: true });
      expect(open("ArrowUp")).to.deep.equal({ type: "move-prev", preventDefault: true });
    });

    it("Home / End jump", () => {
      expect(open("Home")).to.deep.equal({ type: "first", preventDefault: true });
      expect(open("End")).to.deep.equal({ type: "last", preventDefault: true });
    });

    it("PageDown / PageUp page", () => {
      expect(open("PageDown")).to.deep.equal({ type: "page-down", preventDefault: true });
      expect(open("PageUp")).to.deep.equal({ type: "page-up", preventDefault: true });
    });

    it("Enter / Space commit (preventDefault)", () => {
      expect(open("Enter")).to.deep.equal({ type: "commit", preventDefault: true });
      expect(open(" ")).to.deep.equal({ type: "commit", preventDefault: true });
    });

    it("Tab / Shift+Tab commit WITHOUT preventDefault", () => {
      expect(open("Tab")).to.deep.equal({ type: "commit", preventDefault: false });
      expect(open("Tab", { shiftKey: true })).to.deep.equal({
        type: "commit",
        preventDefault: false,
      });
    });

    it("Escape reverts", () => {
      expect(open("Escape")).to.deep.equal({ type: "revert", preventDefault: true });
    });

    it("Alt+ArrowUp closes (keep selection)", () => {
      expect(open("ArrowUp", { altKey: true })).to.deep.equal({
        type: "close",
        preventDefault: true,
      });
    });

    it("a printable char is typeahead", () => {
      expect(open("c").type).to.equal("typeahead");
    });

    it("a char with ctrl/meta/alt is ignored", () => {
      expect(open("c", { ctrlKey: true }).type).to.equal("none");
      expect(open("c", { metaKey: true }).type).to.equal("none");
    });
  });
});
