import { expect } from "@open-wc/testing";
import { compileMask, tokenAccepts, tokenTransform, applyMask, extractRaw, type MaskToken } from "./mask-engine";

describe("compileMask", () => {
  it("parses 9 as digit token", () => {
    expect(compileMask("999")).to.deep.equal([
      { kind: "digit" },
      { kind: "digit" },
      { kind: "digit" },
    ]);
  });

  it("parses A/a/L/S/* as upper/lower/letter/special/any tokens", () => {
    expect(compileMask("AaLS*")).to.deep.equal([
      { kind: "upper" },
      { kind: "lower" },
      { kind: "letter" },
      { kind: "special" },
      { kind: "any" },
    ]);
  });

  it("treats any other char as literal", () => {
    expect(compileMask("9 9-9")).to.deep.equal([
      { kind: "digit" },
      { kind: "literal", literal: " " },
      { kind: "digit" },
      { kind: "literal", literal: "-" },
      { kind: "digit" },
    ]);
  });

  it("escapes the next character with backslash", () => {
    expect(compileMask("\\9 9")).to.deep.equal([
      { kind: "literal", literal: "9" },
      { kind: "literal", literal: " " },
      { kind: "digit" },
    ]);
  });

  it("parses TR phone mask correctly", () => {
    const tokens = compileMask("+90 (999) 999 99 99");
    expect(tokens.length).to.equal("+90 (999) 999 99 99".length);
    expect(tokens.filter((t) => t.kind === "digit").length).to.equal(11);
  });
});

describe("tokenAccepts", () => {
  it("digit accepts 0-9 only", () => {
    expect(tokenAccepts({ kind: "digit" }, "5")).to.equal(true);
    expect(tokenAccepts({ kind: "digit" }, "a")).to.equal(false);
  });

  it("upper/lower/letter all accept any-case letters", () => {
    expect(tokenAccepts({ kind: "upper" }, "a")).to.equal(true);
    expect(tokenAccepts({ kind: "lower" }, "A")).to.equal(true);
    expect(tokenAccepts({ kind: "letter" }, "x")).to.equal(true);
    expect(tokenAccepts({ kind: "letter" }, "5")).to.equal(false);
  });

  it("special accepts punctuation, rejects alphanumerics", () => {
    expect(tokenAccepts({ kind: "special" }, "@")).to.equal(true);
    expect(tokenAccepts({ kind: "special" }, "a")).to.equal(false);
    expect(tokenAccepts({ kind: "special" }, "5")).to.equal(false);
  });

  it("any accepts printable chars", () => {
    expect(tokenAccepts({ kind: "any" }, "x")).to.equal(true);
    expect(tokenAccepts({ kind: "any" }, "@")).to.equal(true);
    expect(tokenAccepts({ kind: "any" }, "5")).to.equal(true);
  });

  it("literal accepts only the exact literal char", () => {
    expect(tokenAccepts({ kind: "literal", literal: "-" }, "-")).to.equal(true);
    expect(tokenAccepts({ kind: "literal", literal: "-" }, "x")).to.equal(false);
  });
});

describe("tokenTransform", () => {
  it("upper transforms to uppercase", () => {
    expect(tokenTransform({ kind: "upper" }, "a")).to.equal("A");
  });

  it("lower transforms to lowercase", () => {
    expect(tokenTransform({ kind: "lower" }, "A")).to.equal("a");
  });

  it("letter preserves case", () => {
    expect(tokenTransform({ kind: "letter" }, "a")).to.equal("a");
    expect(tokenTransform({ kind: "letter" }, "A")).to.equal("A");
  });
});

describe("applyMask (eager)", () => {
  const tokens = compileMask("+\\90 (999) 999 99 99");
  it("renders full template with _ when input is empty", () => {
    expect(applyMask([], tokens, "_")).to.equal("+90 (___) ___ __ __");
  });
  it("renders partial input filling tokens left-to-right", () => {
    expect(applyMask(["5", "3", "2"], tokens, "_")).to.equal("+90 (532) ___ __ __");
  });
  it("ignores extra chars beyond mask length", () => {
    expect(
      applyMask(["5", "3", "2", "1", "2", "3", "4", "5", "6", "7"], tokens, "_")
    ).to.equal("+90 (532) 123 45 67");
  });
});

describe("applyMask (lazy = empty slot char)", () => {
  const tokens = compileMask("+\\90 (999) 999");
  it("renders literals + single-space placeholders when empty + lazy", () => {
    // Lazy mode: empty token slots render as a single space (preserves caret position UX).
    expect(applyMask([], tokens, "")).to.equal("+90 (   )    ");
  });
});

describe("extractRaw", () => {
  const tokens = compileMask("+\\90 (999) 999 99 99");
  it("strips literals and slot chars", () => {
    expect(extractRaw("+90 (532) 123 45 67", tokens)).to.equal("5321234567");
  });
  it("returns empty when input is the template only", () => {
    expect(extractRaw("+90 (___) ___ __ __", tokens)).to.equal("");
  });
});
