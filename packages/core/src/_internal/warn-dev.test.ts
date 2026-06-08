import { expect } from "@open-wc/testing";
import { warnDev } from "./warn-dev";

describe("warnDev", () => {
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

  it("calls console.warn in dev environment", () => {
    warnDev("test message", { foo: 1 });
    expect(calls.length).to.equal(1);
    expect(calls[0][0]).to.equal("test message");
  });

  it("includes the context argument when provided", () => {
    const ctx = document.createElement("div");
    warnDev("hello", ctx);
    expect(calls[0][1]).to.equal(ctx);
  });

  it("is callable without a context argument", () => {
    warnDev("no context");
    expect(calls.length).to.equal(1);
  });
});
