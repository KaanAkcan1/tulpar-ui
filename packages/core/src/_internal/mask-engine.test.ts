import { expect } from "@open-wc/testing";
import { compileMask, tokenAccepts, tokenTransform, type MaskToken } from "./mask-engine";

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
