/**
 * Semantic tokens describe purpose, not raw values.
 * Each brand × mode combination provides values for these slots.
 * Component token groups live in per-component files; this file only
 * composes them into the SemanticTokens contract.
 */
import type { ColorTokens } from "./color";
import type { ButtonTokens } from "./button";
import type { InputTokens } from "./input";
import type { FontTokens, TransitionTokens, EasingTokens, ShadowTokens } from "./common";
import type { ShellTokens } from "./shell";
import type { ChartTokens } from "./chart";
import type { SelectionTokens, SwitchTokens } from "./selection";
import type { OverlayTokens } from "./overlay";

export type { ColorTokens, VariantColorTokens } from "./color";
export type { ButtonTokens, ButtonSizeTokens } from "./button";
export type { InputTokens, InputSizeTokens } from "./input";
export type { FontTokens, TransitionTokens, EasingTokens, ShadowTokens } from "./common";
export type { ShellTokens, ShellNavItemTokens } from "./shell";
export type { ChartTokens } from "./chart";
export type { SelectionTokens, SwitchTokens } from "./selection";
export type { OverlayTokens, OverlayToneTokens, OverlayMotionTokens } from "./overlay";

export interface SemanticTokens {
  color: ColorTokens;
  chart: ChartTokens;
  button: ButtonTokens;
  input: InputTokens;
  selection: SelectionTokens;
  switch: SwitchTokens;
  overlay: OverlayTokens;
  font: FontTokens;
  transition: TransitionTokens;
  shell: ShellTokens;
  easing: EasingTokens;
  shadow: ShadowTokens;
}
