/**
 * Semantic tokens describe purpose, not raw values.
 * Each brand × mode combination provides values for these slots.
 */

export interface ColorTokens {
  bg: {
    surface: string;
    subtle: string;
    muted: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  border: {
    default: string;
    strong: string;
  };
  brand: VariantColorTokens;
  danger: VariantColorTokens;
  success: VariantColorTokens;
  warn: VariantColorTokens;
  info: VariantColorTokens;
  help: VariantColorTokens;
  contrast: VariantColorTokens;
  neutral: VariantColorTokens;
  focusRing: string;
}

export interface VariantColorTokens {
  default: string;
  hover: string;
  active: string;
  disabled: string;
  onColor: string;
  subtle: string;
  subtleHover: string;
}

export interface ButtonSizeTokens {
  height: string;
  paddingX: string;
  fontSize: string;
  iconSize: string;
}

export interface ButtonTokens {
  size: {
    xs: ButtonSizeTokens;
    sm: ButtonSizeTokens;
    md: ButtonSizeTokens;
    lg: ButtonSizeTokens;
    xl: ButtonSizeTokens;
    "2xl": ButtonSizeTokens;
    "3xl": ButtonSizeTokens;
  };
  borderRadius: string;
  borderWidth: string;
  fontWeight: number;
  iconGap: string;
}

export interface SemanticTokens {
  color: ColorTokens;
  button: ButtonTokens;
  font: {
    family: {
      display: string;
      ui: string;
      mono: string;
    };
  };
  transition: {
    default: string;
  };
}
