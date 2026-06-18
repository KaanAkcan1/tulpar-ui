export interface SelectionControlTokens {
  bg: string;
  bgChecked: string;
  bgDisabled: string;
  border: string;
  borderHover: string;
  borderChecked: string;
  borderInvalid: string;
}

export interface SelectionGlyphTokens {
  default: string;
  onCustom: string;
  disabled: string;
}

export interface SelectionCardTokens {
  bg: string;
  border: string;
  bgHover: string;
  bgSelected: string;
}

export interface SelectionTokens {
  control: SelectionControlTokens;
  glyph: SelectionGlyphTokens;
  focusRing: string;
  label: string;
  description: string;
  card: SelectionCardTokens;
}

export interface SwitchTokens {
  trackOff: string;
  trackOn: string;
  thumb: string;
  thumbIconOff: string;
  /** Layered thumb box-shadow. Tokenized (not `:host-context`) so it flips with the `.dark` class. */
  thumbShadow: string;
  /** Loading spinner rotation duration. Non-color, parallels `button.spinnerDuration`. */
  spinnerDuration: string;
}
