import { css } from "lit";

/**
 * CheckboxGroup-specific styles. The fieldset/legend/items/message anatomy is
 * fully owned by `selectionGroupBaseStyles`; this sheet exists as the
 * component's own composition slot for any checkbox-group-only tweaks. Kept
 * token-only with literal fallbacks.
 */
export const checkboxGroupStyles = css`
  /* No checkbox-group-only overrides yet; anatomy lives in the base sheet. */
`;
