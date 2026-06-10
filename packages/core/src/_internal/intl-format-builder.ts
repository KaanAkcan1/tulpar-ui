export interface IntlBuilderInput {
  formatStyle?: "decimal" | "currency" | "percent";
  currency?: string;
  useGrouping?: boolean;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  integerOnly?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
}

/**
 * Merges shorthand attribute values into Intl.NumberFormatOptions, then layers
 * the advanced `.formatOptions` property over it (advanced wins).
 *
 * Shorthand covers ~90% of cases (style/currency/grouping/fraction digits);
 * `.formatOptions` is the escape hatch to the full Intl surface (notation,
 * signDisplay, roundingMode, currencySign, unit, ...).
 */
export function buildIntlOptions(input: IntlBuilderInput): Intl.NumberFormatOptions {
  const base: Intl.NumberFormatOptions = {
    style: input.formatStyle ?? "decimal",
    useGrouping: input.useGrouping ?? true,
  };

  if (base.style === "currency" && input.currency) {
    base.currency = input.currency;
  }

  if (input.minFractionDigits !== undefined) {
    base.minimumFractionDigits = input.minFractionDigits;
  }
  if (input.maxFractionDigits !== undefined) {
    base.maximumFractionDigits = input.maxFractionDigits;
  }

  if (input.integerOnly) {
    base.maximumFractionDigits = 0;
    // Guard: Intl throws if min > max.
    if ((base.minimumFractionDigits ?? 0) > 0) base.minimumFractionDigits = 0;
  }

  // Advanced layer overrides shorthand.
  return { ...base, ...(input.formatOptions ?? {}) };
}
