import { warnDev } from "./warn-dev";
import type { FieldSize, FieldVariant, LabelPosition } from "./form-field-base";

export interface ResolverInput {
  requested: LabelPosition | undefined;
  hasLabel: boolean;
  variant: FieldVariant;
  size: FieldSize;
}

export function resolveLabelPosition(input: ResolverInput): LabelPosition {
  const { requested, hasLabel, variant, size } = input;

  if (requested === undefined) {
    return hasLabel ? "top" : "none";
  }

  if (requested === "none" || requested === "top") {
    return requested;
  }

  // float, float-in, float-on
  if (variant === "ghost" || variant === "underlined") {
    warnDev(
      `[tulpar] label-position="${requested}" is not supported with variant="${variant}" — falling back to "top".`,
    );
    return "top";
  }

  if (requested === "float-in" && size === "xs") {
    warnDev(
      `[tulpar] label-position="float-in" is not supported with size="xs" — falling back to "top".`,
    );
    return "top";
  }

  return requested;
}
