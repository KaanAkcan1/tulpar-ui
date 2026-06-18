import { css } from "lit";

/**
 * RadioGroup-specific styles. The fieldset/legend/items/message anatomy is
 * fully owned by `selectionGroupBaseStyles`; this sheet exists as the
 * component's own composition slot for any radio-group-only tweaks. Kept
 * token-only with literal fallbacks.
 */
export const radioGroupStyles = css`
  /* No radio-group-only overrides yet; anatomy lives in the base sheet. */
`;
