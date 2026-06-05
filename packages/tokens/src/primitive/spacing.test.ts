import { describe, it, expect } from "vitest";
import { primitiveSpacing } from "./spacing";

describe("primitiveSpacing", () => {
  it("provides 0 and px units", () => {
    expect(primitiveSpacing[0]).toBe("0");
    expect(primitiveSpacing[1]).toBe("4px");
    expect(primitiveSpacing[2]).toBe("8px");
  });

  it("scales linearly in 4px increments through 6, then larger jumps", () => {
    expect(primitiveSpacing[4]).toBe("16px");
    expect(primitiveSpacing[8]).toBe("32px");
    expect(primitiveSpacing[16]).toBe("64px");
  });

  it("includes large values for hero spacings", () => {
    expect(primitiveSpacing[24]).toBe("96px");
  });
});
