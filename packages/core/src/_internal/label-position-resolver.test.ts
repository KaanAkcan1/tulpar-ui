import { expect } from "@open-wc/testing";
import { resolveLabelPosition, type ResolverInput } from "./label-position-resolver";

const base: ResolverInput = {
  requested: "top",
  hasLabel: true,
  variant: "outlined",
  size: "md",
};

describe("resolveLabelPosition", () => {
  let calls: Array<[string, unknown]>;
  let originalWarn: typeof console.warn;

  beforeEach(() => {
    calls = [];
    originalWarn = console.warn;
    console.warn = (msg: string, ctx?: unknown) => {
      calls.push([msg, ctx]);
    };
  });

  afterEach(() => {
    console.warn = originalWarn;
  });

  it("returns 'top' when label is present and no position requested", () => {
    expect(resolveLabelPosition({ ...base, requested: undefined })).to.equal("top");
  });

  it("returns 'none' when label is missing and no position requested", () => {
    expect(
      resolveLabelPosition({ ...base, requested: undefined, hasLabel: false }),
    ).to.equal("none");
  });

  it("returns 'top' explicitly when requested", () => {
    expect(resolveLabelPosition({ ...base, requested: "top" })).to.equal("top");
  });

  it("falls back float* → top when variant=ghost", () => {
    expect(resolveLabelPosition({ ...base, requested: "float", variant: "ghost" })).to.equal(
      "top",
    );
    expect(resolveLabelPosition({ ...base, requested: "float-in", variant: "ghost" })).to.equal(
      "top",
    );
    expect(resolveLabelPosition({ ...base, requested: "float-on", variant: "ghost" })).to.equal(
      "top",
    );
  });

  it("falls back float* → top when variant=underlined", () => {
    expect(resolveLabelPosition({ ...base, requested: "float", variant: "underlined" })).to.equal(
      "top",
    );
  });

  it("falls back float-in → top when size=xs", () => {
    expect(resolveLabelPosition({ ...base, requested: "float-in", size: "xs" })).to.equal("top");
  });

  it("does NOT fall back float (outlined) → top for size xs (vertical room not required)", () => {
    expect(resolveLabelPosition({ ...base, requested: "float", size: "xs" })).to.equal("float");
  });

  it("preserves 'none' regardless of variant/size", () => {
    expect(
      resolveLabelPosition({ ...base, requested: "none", variant: "ghost", size: "xs" }),
    ).to.equal("none");
  });

  it("warns in dev when a fallback is applied", () => {
    resolveLabelPosition({ ...base, requested: "float", variant: "ghost" });
    expect(calls.length).to.equal(1);
  });
});
