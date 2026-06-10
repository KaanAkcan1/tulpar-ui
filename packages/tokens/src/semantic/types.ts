/**
 * Semantic tokens describe purpose, not raw values.
 * Each brand × mode combination provides values for these slots.
 * Component token groups live in per-component files; this file only
 * composes them into the SemanticTokens contract.
 */
import type { ColorTokens } from "./color";
import type { ButtonTokens } from "./button";
import type { InputTokens } from "./input";
import type { FontTokens, TransitionTokens } from "./common";

export type { ColorTokens, VariantColorTokens } from "./color";
export type { ButtonTokens, ButtonSizeTokens } from "./button";
export type { InputTokens, InputSizeTokens } from "./input";
export type { FontTokens, TransitionTokens } from "./common";

export interface SemanticTokens {
  color: ColorTokens;
  button: ButtonTokens;
  input: InputTokens;
  font: FontTokens;
  transition: TransitionTokens;
}
