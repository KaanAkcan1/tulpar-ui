import { expect } from "@open-wc/testing";
import { buildIntlOptions } from "./intl-format-builder";

describe("buildIntlOptions", () => {
  it("returns minimal decimal options by default", () => {
    const o = buildIntlOptions({});
    expect(o.style).to.equal("decimal");
    expect(o.useGrouping).to.equal(true);
  });

  it("maps format-style=currency + currency=TRY", () => {
    const o = buildIntlOptions({ formatStyle: "currency", currency: "TRY" });
    expect(o.style).to.equal("currency");
    expect(o.currency).to.equal("TRY");
  });

  it("respects use-grouping=false", () => {
    const o = buildIntlOptions({ useGrouping: false });
    expect(o.useGrouping).to.equal(false);
  });

  it("passes through fraction digits", () => {
    const o = buildIntlOptions({ minFractionDigits: 2, maxFractionDigits: 4 });
    expect(o.minimumFractionDigits).to.equal(2);
    expect(o.maximumFractionDigits).to.equal(4);
  });

  it("integer-only forces max fraction digits to 0", () => {
    const o = buildIntlOptions({ integerOnly: true, minFractionDigits: 2 });
    expect(o.maximumFractionDigits).to.equal(0);
  });

  it(".formatOptions overrides shorthand", () => {
    const o = buildIntlOptions({
      formatStyle: "decimal",
      formatOptions: { style: "currency", currency: "EUR", notation: "compact" },
    });
    expect(o.style).to.equal("currency");
    expect(o.currency).to.equal("EUR");
    expect(o.notation).to.equal("compact");
  });

  it("produces a config consumable by Intl.NumberFormat", () => {
    const o = buildIntlOptions({
      formatStyle: "currency",
      currency: "TRY",
      minFractionDigits: 2,
      maxFractionDigits: 2,
    });
    const formatted = new Intl.NumberFormat("tr-TR", o).format(1234.5);
    // tr-TR: . grouping, , decimal — "₺1.234,50"
    expect(formatted).to.contain("1.234,50");
  });
});
